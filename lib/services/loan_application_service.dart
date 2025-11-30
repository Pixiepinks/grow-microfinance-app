import 'dart:io';

import '../models/loan_application.dart';
import '../api_config.dart';
import 'api_client.dart';

class LoanApplicationService {
  LoanApplicationService(this._client);

  final ApiClient _client;

  Future<LoanApplication> createDraft(Map<String, dynamic> data) async {
    final json = await _client.postJson(
      ApiConfig.endpoint('loanApplications'),
      body: data,
    );
    return LoanApplication.fromJson(json);
  }

  Future<LoanApplication> updateDraft(
    String id,
    Map<String, dynamic> data,
  ) async {
    final json = await _client.putJson(
      '${ApiConfig.endpoint('loanApplications')}/$id',
      body: data,
    );
    return LoanApplication.fromJson(json);
  }

  Future<void> submit(String id) async {
    await _client.postJson(
      '${ApiConfig.endpoint('loanApplications')}/$id/submit',
    );
  }

  Future<List<LoanApplication>> listMyApplications({String? customerId}) async {
    final query = customerId != null ? '?customer_id=$customerId' : '';
    final list = await _client.getJsonList(
      '${ApiConfig.endpoint('loanApplications')}$query',
    );
    return list
        .map((e) => LoanApplication.fromJson(e as Map<String, dynamic>))
        .toList();
  }

  Future<LoanApplication> getById(String id) async {
    final json = await _client.getJson(
      '${ApiConfig.endpoint('loanApplications')}/$id',
    );
    return LoanApplication.fromJson(json);
  }

  Future<void> uploadDocument(
    String id,
    String documentType,
    File file,
  ) async {
    await _client.postMultipart(
      '${ApiConfig.endpoint('loanApplications')}/$id/documents',
      file: file,
      // The backend expects the file to be uploaded under the "file" field.
      // Using any other field name causes the document to be ignored, which
      // prevents submissions due to missing required documents.
      fieldName: 'file',
      fields: {'document_type': documentType},
    );
  }
}
