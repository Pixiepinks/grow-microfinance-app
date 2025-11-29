import 'package:file_picker/file_picker.dart';
import 'package:flutter/foundation.dart';
import 'package:http/http.dart' as http;

import '../models/loan_application.dart';
import 'api_client.dart';

class LoanApplicationService {
  LoanApplicationService(this._client);

  final ApiClient _client;

  Future<LoanApplication> createDraft(Map<String, dynamic> data) async {
    final json = await _client.postJson('/api/loan-applications', body: data);
    return LoanApplication.fromJson(json);
  }

  Future<LoanApplication> updateDraft(
    String id,
    Map<String, dynamic> data,
  ) async {
    final json =
        await _client.putJson('/api/loan-applications/$id', body: data);
    return LoanApplication.fromJson(json);
  }

  Future<void> submit(String id) async {
    await _client.postJson('/api/loan-applications/$id/submit');
  }

  Future<List<LoanApplication>> listMyApplications({String? customerId}) async {
    final query = customerId != null ? '?customer_id=$customerId' : '';
    final list =
        await _client.getJsonList('/api/loan-applications$query');
    return list
        .map((e) => LoanApplication.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<LoanApplication> getById(String id) async {
    final json = await _client.getJson('/api/loan-applications/$id');
    return LoanApplication.fromJson(json);
  }

  Future<void> uploadDocument(
    String id,
    String documentType,
    PlatformFile file,
  ) async {
    final multipartFile = await _toMultipartFile(file);
    await _client.postMultipart(
        '/api/loan-applications/$id/documents',
        file: multipartFile,
        fields: {'document_type': documentType});
  }

  Future<http.MultipartFile> _toMultipartFile(PlatformFile file) async {
    if (kIsWeb) {
      if (file.bytes == null) {
        throw Exception('No file data found for ${file.name}');
      }
      return http.MultipartFile.fromBytes(
        'document',
        file.bytes!,
        filename: file.name,
      );
    }

    if (file.path != null) {
      return http.MultipartFile.fromPath('document', file.path!,
          filename: file.name.isNotEmpty ? file.name : null);
    }

    throw Exception('Unsupported file input for ${file.name}');
  }
}
