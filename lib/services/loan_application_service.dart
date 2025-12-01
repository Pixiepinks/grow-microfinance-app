import 'dart:io';

import '../models/loan_application.dart';
import '../api_config.dart';
import 'api_client.dart';

class LoanApplicationService {
  LoanApplicationService(this._client);

  final ApiClient _client;

  Future<LoanApplication> createDraft(Map<String, dynamic> data) async {
    final normalized = _normalizePayload(data);
    final json = await _client.postJson(
      ApiConfig.endpoint('loanApplications'),
      body: normalized,
    );
    return LoanApplication.fromJson(json);
  }

  Future<LoanApplication> updateDraft(
    String id,
    Map<String, dynamic> data,
  ) async {
    final normalized = _normalizePayload(data);
    final json = await _client.putJson(
      '${ApiConfig.endpoint('loanApplications')}/$id',
      body: normalized,
    );
    return LoanApplication.fromJson(json);
  }

  Future<void> submit(String id) async {
    try {
      await _client.postJson(
        '${ApiConfig.endpoint('loanApplications')}/$id/submit',
      );
    } on ApiException catch (e) {
      if (e.statusCode == 400) {
        final messages = <String>[];
        final body = e.body;
        if (body is Map<String, dynamic>) {
          final errors = body['errors'];
          if (errors is List) {
            messages.addAll(
              errors
                  .map((err) => err?.toString() ?? '')
                  .where((msg) => msg.isNotEmpty),
            );
          }
          final message = body['message']?.toString();
          if (message != null && message.isNotEmpty) {
            messages.add(message);
          }
        }

        if (messages.isEmpty && e.message.isNotEmpty) {
          messages.add(e.message);
        }

        throw LoanApplicationValidationException(
          messages.isEmpty
              ? 'Unable to submit application. Please check required fields.'
              : messages.join('; '),
          messages,
        );
      }
      rethrow;
    }
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
    String documentType, {
    File? file,
    List<int>? bytes,
    required String fileName,
  }) async {
    await _client.postMultipart(
      '${ApiConfig.endpoint('loanApplications')}/$id/documents',
      file: file,
      bytes: bytes,
      fileName: fileName,
      // The backend expects the file to be uploaded under the "file" field.
      // Using any other field name causes the document to be ignored, which
      // prevents submissions due to missing required documents.
      fieldName: 'file',
      fields: {'document_type': documentType},
    );
  }

  Map<String, dynamic> _normalizePayload(Map<String, dynamic> data) {
    final normalized = {...data};

    // Flatten nested sections often used by the web build so the backend receives
    // the fields it validates (e.g., nic_number/mobile_number) even if the UI
    // only fills the nested structures.
    for (final section in ['applicant_details', 'loan_details', 'type_specific']) {
      final sectionData = data[section];
      if (sectionData is Map<String, dynamic>) {
        normalized.addAll(sectionData);
      }
    }

    void _ensureValue(String canonicalKey, List<String> aliases) {
      if (_hasValue(normalized[canonicalKey])) return;
      for (final alias in aliases) {
        final value = normalized[alias];
        if (_hasValue(value)) {
          normalized[canonicalKey] = value;
          break;
        }
      }
    }

    // Common applicant aliases from older builds.
    _ensureValue('nic_number', ['nic', 'nicNumber']);
    _ensureValue('mobile_number', ['mobile', 'mobileNumber']);

    // Online business aliases used in the web build.
    _ensureValue('platform', ['store_platform']);
    _ensureValue('online_store_link', ['store_url']);
    _ensureValue('average_monthly_revenue_last_3_months', [
      'average_monthly_revenue',
      'avg_monthly_revenue',
      'average_revenue',
      'average_revenue_last_3_months',
    ]);
    _ensureValue('main_product_category', ['product_category']);

    // Align loan type values with backend constants in case the UI sends legacy labels.
    final loanType = normalized['loan_type']?.toString();
    if (loanType != null) {
      normalized['loan_type'] = _mapLoanTypeToApi(loanType);
    }

    // Older web/mobile builds never collected these required fields for online
    // business loans. Default them so submissions aren't blocked purely due to
    // missing keys when the loan type matches.
    if (normalized['loan_type'] == 'GROW_ONLINE_BUSINESS') {
      if (!_hasValue(normalized['average_monthly_revenue_last_3_months'])) {
        normalized['average_monthly_revenue_last_3_months'] = 0;
      }
      if (!_hasValue(normalized['main_product_category'])) {
        normalized['main_product_category'] = 'General';
      }
    }

    // Keep nested applicant/type-specific sections in sync after alias resolution.
    for (final section in ['applicant_details', 'type_specific']) {
      final sectionData = normalized[section];
      if (sectionData is Map<String, dynamic>) {
        if (_hasValue(normalized['nic_number'])) {
          sectionData['nic_number'] = normalized['nic_number'];
        }
        if (_hasValue(normalized['mobile_number'])) {
          sectionData['mobile_number'] = normalized['mobile_number'];
        }
        if (_hasValue(normalized['platform'])) {
          sectionData['platform'] = normalized['platform'];
        }
        if (_hasValue(normalized['online_store_link'])) {
          sectionData['online_store_link'] = normalized['online_store_link'];
        }
        if (_hasValue(normalized['average_monthly_revenue_last_3_months'])) {
          sectionData['average_monthly_revenue_last_3_months'] =
              normalized['average_monthly_revenue_last_3_months'];
        }
        if (_hasValue(normalized['main_product_category'])) {
          sectionData['main_product_category'] =
              normalized['main_product_category'];
        }
      }
    }

    return normalized;
  }

  bool _hasValue(dynamic value) {
    if (value == null) return false;
    if (value is String) return value.trim().isNotEmpty;
    return true;
  }

  String _mapLoanTypeToApi(String uiValue) {
    switch (uiValue) {
      case 'Grow Online Business Loan':
      case 'ONLINE_BUSINESS_LOAN':
      case 'ONLINE_BUSINESS':
        return 'GROW_ONLINE_BUSINESS';
      case 'Grow Business Loan':
      case 'BUSINESS_LOAN':
      case 'BUSINESS':
        return 'GROW_BUSINESS';
      case 'Grow Personal Loan':
      case 'PERSONAL_LOAN':
      case 'PERSONAL':
        return 'GROW_PERSONAL';
      case 'Grow Team Loan':
      case 'TEAM_LOAN':
      case 'TEAM':
        return 'GROW_TEAM';
      default:
        return uiValue;
    }
  }
}

class LoanApplicationValidationException implements Exception {
  LoanApplicationValidationException(this.message, this.errors);

  final String message;
  final List<String> errors;

  @override
  String toString() => 'LoanApplicationValidationException: $message';
}
