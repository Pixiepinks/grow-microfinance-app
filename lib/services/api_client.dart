import 'dart:convert';

import 'package:http/http.dart' as http;

class ApiClient {
  ApiClient({http.Client? client, String? baseUrl})
      : _client = client ?? http.Client(),
        _baseUrl = baseUrl ?? _defaultBaseUrl;

  final http.Client _client;
  final String _baseUrl;
  String? _token;

  /// Default deployed backend URL (no trailing slash). Can be overridden at
  /// build time with `--dart-define=API_BASE_URL=...`.
  static const _defaultBaseUrl = const String.fromEnvironment(
    'API_BASE_URL',
    defaultValue: 'https://grow-microfinance-api-production.up.railway.app',
  );

  void updateToken(String? token) {
    _token = token;
  }

  Future<Map<String, dynamic>> getJson(String path) async {
    return _send(
      () => _client.get(Uri.parse('$_baseUrl$path'), headers: _headers()),
      (response) => jsonDecode(response.body) as Map<String, dynamic>,
    );
  }

  Future<List<dynamic>> getJsonList(String path) async {
    return _send(
      () => _client.get(Uri.parse('$_baseUrl$path'), headers: _headers()),
      (response) => jsonDecode(response.body) as List<dynamic>,
    );
  }

  Future<Map<String, dynamic>> postJson(
    String path, {
    Map<String, dynamic>? body,
  }) async {
    return _send(
      () => _client.post(
        Uri.parse('$_baseUrl$path'),
        headers: _headers(),
        body: jsonEncode(body ?? {}),
      ),
      (response) => jsonDecode(response.body) as Map<String, dynamic>,
    );
  }

  Map<String, String> _headers() {
    final headers = <String, String>{
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (_token != null) {
      headers['Authorization'] = 'Bearer $_token';
    }
    return headers;
  }

  Future<T> _send<T>(
    Future<http.Response> Function() request,
    T Function(http.Response response) parser,
  ) async {
    try {
      final response = await request();
      if (response.statusCode >= 400) {
        throw ApiException(
          statusCode: response.statusCode,
          message: response.body,
        );
      }
      return parser(response);
    } on http.ClientException catch (e) {
      throw ApiException(
        statusCode: -1,
        message:
            'Network error: ${e.message}. Verify API_BASE_URL and backend availability.',
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
