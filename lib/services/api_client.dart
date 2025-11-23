import 'dart:convert';
import 'dart:io';

import 'package:http/http.dart' as http;

class ApiClient {
  ApiClient({http.Client? client}) : _client = client ?? http.Client();

  final http.Client _client;
  String? _token;

  /// Deployed backend URL on Railway (no trailing slash).
  static const baseUrl =
      'https://grow-microfinance-api-production.up.railway.app';

  void updateToken(String? token) {
    _token = token;
  }

  Future<Map<String, dynamic>> getJson(String path) async {
    final response = await _client.get(
      Uri.parse('$baseUrl$path'),
      headers: _headers(),
    );
    _throwIfNeeded(response);
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<List<dynamic>> getJsonList(String path) async {
    final response = await _client.get(
      Uri.parse('$baseUrl$path'),
      headers: _headers(),
    );
    _throwIfNeeded(response);
    return jsonDecode(response.body) as List<dynamic>;
  }

  Future<Map<String, dynamic>> postJson(
    String path, {
    Map<String, dynamic>? body,
  }) async {
    final response = await _client.post(
      Uri.parse('$baseUrl$path'),
      headers: _headers(),
      body: jsonEncode(body ?? {}),
    );
    _throwIfNeeded(response);
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> putJson(
    String path, {
    Map<String, dynamic>? body,
  }) async {
    final response = await _client.put(
      Uri.parse('$baseUrl$path'),
      headers: _headers(),
      body: jsonEncode(body ?? {}),
    );
    _throwIfNeeded(response);
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Future<Map<String, dynamic>> postMultipart(
    String path, {
    required File file,
    String fieldName = 'file',
    Map<String, String>? fields,
  }) async {
    final uri = Uri.parse('$baseUrl$path');
    final request = http.MultipartRequest('POST', uri);
    request.headers.addAll(_headers(jsonContentType: false));
    if (fields != null) {
      request.fields.addAll(fields);
    }
    request.files
        .add(await http.MultipartFile.fromPath(fieldName, file.path));
    final streamed = await request.send();
    final response = await http.Response.fromStream(streamed);
    _throwIfNeeded(response);
    return jsonDecode(response.body) as Map<String, dynamic>;
  }

  Map<String, String> _headers({bool jsonContentType = true}) {
    final headers = <String, String>{
      if (jsonContentType) 'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (_token != null) {
      headers['Authorization'] = 'Bearer $_token';
    }
    return headers;
  }

  void _throwIfNeeded(http.Response response) {
    if (response.statusCode >= 400) {
      throw ApiException(
        statusCode: response.statusCode,
        message: response.body,
      );
    }
  }
}

class ApiException implements Exception {
  ApiException({required this.statusCode, required this.message});

  final int statusCode;
  final String message;

  @override
  String toString() => 'ApiException($statusCode): $message';
}
