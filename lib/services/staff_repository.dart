import 'api_client.dart';

class StaffRepository {
  StaffRepository(this._client);
  final ApiClient _client;

  Future<List<dynamic>> fetchTodayCollections() async {
    return _client.getJsonList('/staff/today-collections');
  }

  Future<Map<String, dynamic>> submitPayment({
    required String loanId,
    required double amount,
    String? method,
  }) async {
    return _client.postJson(
      '/staff/payments',
      body: {
        // Match backend /staff/payments payload
        'loan_id': int.tryParse(loanId) ?? loanId,
        'amount_collected': amount,
        if (method != null && method.isNotEmpty)
          'payment_method': method,
      },
    );
  }
}
