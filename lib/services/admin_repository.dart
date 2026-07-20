import '../api_config.dart';
import 'api_client.dart';

class AdminRepository {
  AdminRepository(this._client);
  final ApiClient _client;

  Future<Map<String, dynamic>> fetchDashboard() async {
    final response = await _client.getJson(ApiConfig.endpoint('adminDashboard'));
    final payload = response['data'] is Map<String, dynamic>
        ? response['data'] as Map<String, dynamic>
        : response;

    // Keep the API's snake_case keys intact. Some environments use camelCase,
    // so expose that compatibility value under the production key as well.
    final totalLoans = payload['total_loans'] ?? payload['totalLoans'];
    return <String, dynamic>{
      ...payload,
      if (!payload.containsKey('total_loans') && totalLoans != null)
        'total_loans': totalLoans,
    };
  }
}
