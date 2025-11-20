import 'payment.dart';

class Loan {
  final String id;
  final double amount; // principal_amount
  final double balance; // outstanding
  final String status;
  final List<Payment> payments;

  Loan({
    required this.id,
    required this.amount,
    required this.balance,
    required this.status,
    required this.payments,
  });

  factory Loan.fromJson(Map<String, dynamic> json) {
    // Backend /customer/loans returns fields like:
    // id, principal_amount, outstanding, status, ...
    final paymentsJson = json['payments'] as List<dynamic>? ?? [];
    return Loan(
      id: json['id'].toString(),
      amount: (json['principal_amount'] as num?)?.toDouble() ?? 0,
      balance: (json['outstanding'] as num?)?.toDouble() ?? 0,
      status: json['status'] ?? 'Active',
      payments: paymentsJson.map((e) => Payment.fromJson(e)).toList(),
    );
  }
}
