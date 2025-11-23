import '../models/loan.dart';
import '../models/payment.dart';
import '../models/customer.dart';
import '../models/user_profile.dart';
import 'api_client.dart';

class CustomerRepository {
  CustomerRepository([ApiClient? client]) : _client = client ?? ApiClient();
  final ApiClient _client;

  Future<UserProfile> fetchProfile() async {
    final data = await _client.getJson('/customer/me');
    return UserProfile.fromJson(data);
  }

  Future<List<Loan>> fetchLoans() async {
    // API returns: { "summary": {...}, "loans": [ ... ] }
    final data = await _client.getJson('/customer/loans');
    final loansJson = data['loans'] as List<dynamic>? ?? [];
    return loansJson.map((e) => Loan.fromJson(e)).toList();
  }

  Future<List<Payment>> fetchLoanPayments(String loanId) async {
    // API returns: { "loan": {...}, "payments": [ ... ] }
    final data = await _client.getJson('/customer/loans/$loanId/payments');
    final paymentsJson = data['payments'] as List<dynamic>? ?? [];
    return paymentsJson.map((e) => Payment.fromJson(e)).toList();
  }

  Future<Customer> createCustomer(Customer customer) async {
    final response = await _client.postJson(
      '/customers',
      body: customer.toJson(),
    );
    return Customer.fromJson(response);
  }
}
