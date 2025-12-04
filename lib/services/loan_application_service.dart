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
    return listApplications(customerId: customerId);
  }

  Future<List<LoanApplication>> listApplications({
    String? status,
    String? customerId,
  }) async {
    final params = <String, String>{};
    if (status != null && status.isNotEmpty) {
      params['status'] = status;
    }
    if (customerId != null && customerId.isNotEmpty) {
      params['customer_id'] = customerId;
    }

    final query = params.entries.isEmpty
        ? ''
        : '?' +
            params.entries
                .map((entry) => '${entry.key}=${Uri.encodeComponent(entry.value)}')
                .join('&');

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
    String? filePath,
    List<int>? bytes,
    required String fileName,
  }) async {
    await _client.postMultipart(
      '${ApiConfig.endpoint('loanApplications')}/$id/documents',
      filePath: filePath,
      bytes: bytes,
      fileName: fileName,
      // The backend expects the file to be uploaded under the "file" field.
      // Using any other field name causes the document to be ignored, which
      // prevents submissions due to missing required documents.
      fieldName: 'file',
      fields: {'document_type': documentType},
    );
  }

  Future<void> staffApprove(String id) async {
    await _client.postJson(
      ApiConfig.endpoint('staffLoanApplicationApprove', params: {'id': id}),
    );
  }

  Future<void> finalApprove(String id) async {
    await _client.postJson(
      ApiConfig.endpoint('adminLoanApplicationApprove', params: {'id': id}),
    );
  }

  Future<void> reject(String id, {String? reason}) async {
    await _client.postJson(
      ApiConfig.endpoint('loanApplicationReject', params: {'id': id}),
      body: {
        if (reason != null && reason.isNotEmpty) 'reason': reason,
      },
    );
  }

  Map<String, dynamic> _normalizePayload(Map<String, dynamic> data) {
    final normalized = {...data};

    // Flatten nested sections often used by the web build so the backend receives
    // the fields it validates (e.g., nic_number/mobile_number) even if the UI
    // only fills the nested structures.
    final Map<String, dynamic> applicantDetails =
        Map<String, dynamic>.from(data['applicant_details'] ?? {});
    final Map<String, dynamic> typeSpecific =
        Map<String, dynamic>.from(data['type_specific'] ?? {});
    normalized['applicant_details'] = applicantDetails;
    normalized['type_specific'] = typeSpecific;

    for (final section in [applicantDetails, data['loan_details'], typeSpecific]) {
      if (section is Map<String, dynamic>) {
        normalized.addAll(section);
      }
    }

    void _ensureValue(String canonicalKey, List<String> aliases,
        {List<Map<String, dynamic>>? additionalSources}) {
      if (_hasValue(normalized[canonicalKey])) return;

      final sources = [normalized, ...?additionalSources];
      for (final source in sources) {
        for (final alias in aliases) {
          final value = source[alias];
          if (_hasValue(value)) {
            normalized[canonicalKey] = value;
            return;
          }
        }
      }
    }

    // Common applicant aliases from older builds and nested applicant details.
    _ensureValue(
      'nic_number',
      ['nic', 'nicNumber'],
      additionalSources: [applicantDetails],
    );
    _ensureValue(
      'mobile_number',
      ['mobile', 'mobileNumber'],
      additionalSources: [applicantDetails],
    );

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
    if (_hasValue(loanType)) {
      final mapped = _mapLoanTypeToApi(loanType!);
      normalized['loan_type'] = mapped.isEmpty ? 'GROW_ONLINE_BUSINESS' : mapped;
    } else {
      normalized['loan_type'] = 'GROW_ONLINE_BUSINESS';
    }

    // Ensure the platform is always set for web builds that sometimes omit it
    // when reusing previously saved drafts.
    if (!_hasValue(normalized['store_platform'])) {
      normalized['store_platform'] = 'WEB';
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
    for (final sectionData in [applicantDetails, typeSpecific]) {
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
      // Keep older aliases populated so existing drafts saved by the web build
      // still retain their original keys after normalization.
      if (_hasValue(normalized['nic'])) {
        sectionData['nic'] = normalized['nic'];
      }
      if (_hasValue(normalized['mobile'])) {
        sectionData['mobile'] = normalized['mobile'];
      }
      if (_hasValue(normalized['store_url'])) {
        sectionData['store_url'] = normalized['store_url'];
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
    final normalized = uiValue.trim().toUpperCase();
    switch (normalized) {
      case 'GROW ONLINE BUSINESS LOAN':
      case 'GROW_ONLINE_BUSINESS':
      case 'ONLINE_BUSINESS_LOAN':
      case 'ONLINE_BUSINESS':
        return 'GROW_ONLINE_BUSINESS';
      case 'GROW BUSINESS LOAN':
      case 'GROW_BUSINESS':
      case 'BUSINESS_LOAN':
      case 'BUSINESS':
        return 'GROW_BUSINESS';
      case 'GROW PERSONAL LOAN':
      case 'GROW_PERSONAL':
      case 'PERSONAL_LOAN':
      case 'PERSONAL':
        return 'GROW_PERSONAL';
      case 'GROW TEAM LOAN':
      case 'GROW_TEAM':
      case 'TEAM_LOAN':
      case 'TEAM':
        return 'GROW_TEAM';
      default:
        // Handle loosely formatted strings (e.g., "grow online" or lowercase
        // labels) by matching on keywords to avoid backend validation errors.
        if (normalized.contains('ONLINE')) return 'GROW_ONLINE_BUSINESS';
        if (normalized.contains('PERSONAL')) return 'GROW_PERSONAL';
        if (normalized.contains('TEAM')) return 'GROW_TEAM';
        if (normalized.contains('BUSINESS')) return 'GROW_BUSINESS';
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
