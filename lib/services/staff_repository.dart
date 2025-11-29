import '../api_config.dart';
import 'api_client.dart';

class StaffRepository {
  StaffRepository(this._client);
  final ApiClient _client;

  Future<List<dynamic>> fetchTodayCollections() async {
    return _client.getJsonList(ApiConfig.endpoint('staffTodayCollections'));
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
}
