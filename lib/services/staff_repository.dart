import '../api_config.dart';
import 'api_client.dart';

class StaffRepository {
  StaffRepository(this._client);
  final ApiClient _client;

  Future<List<dynamic>> fetchTodayCollections() async {
    return _client.getJsonList(ApiConfig.endpoint('staffTodayCollections'));
  }

  Future<List<Map<String, dynamic>>> fetchActiveLoans() async {
    final list = await _client.getJsonList(
      ApiConfig.endpoint('staffActiveLoans'),
    );
    return list.cast<Map<String, dynamic>>();
  }

  Future<Map<String, dynamic>> submitPayment({
    required String loanId,
    required double amount,
    String? method,
  }) async {
    return _client.postJson(
      ApiConfig.endpoint('staffPayments'),
      body: {
        // Match backend /staff/payments payload
        'loan_id': int.tryParse(loanId) ?? loanId,
        'amount_collected': amount,
        if (method != null && method.isNotEmpty)
          'payment_method': method,
      },
    );
  }

  Future<Map<String, dynamic>> recordRepayment({
    required String loanId,
    required double amount,
    required DateTime date,
    String? method,
    String? note,
  }) async {
    return _client.postJson(
      ApiConfig.endpoint('loanRepayments', params: {'id': loanId}),
      body: {
        'amount': amount,
        'payment_date': date.toIso8601String(),
        if (method != null && method.isNotEmpty) 'payment_method': method,
        if (note != null && note.isNotEmpty) 'note': note,
      },
    );
  }
}
