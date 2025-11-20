import 'api_client.dart';

class AdminRepository {
  AdminRepository(this._client);
  final ApiClient _client;

  Future<Map<String, dynamic>> fetchDashboard() async {
    return _client.getJson('/admin/dashboard');
  }
}
