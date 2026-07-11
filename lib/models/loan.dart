import 'loan_application.dart';
import 'payment.dart';

class Loan {
  final String id;
  final double amount;
  final double balance;
  final String status;
  final List<Payment> payments;
  final int? loanDays;
  final String? repaymentFrequency;
  final int? numberOfInstallments;
  final double? installmentAmount;
  final double? totalRepayment;
  final double? totalInterest;
  final double? interestRate;
  final String? interestType;
  final String? disbursementDate;
  final String? maturityDate;
  final String? finalInstallmentDueDate;
  final List<Map<String, dynamic>> ledgerRows;

  Loan({required this.id, required this.amount, required this.balance, required this.status, required this.payments, this.loanDays, this.repaymentFrequency, this.numberOfInstallments, this.installmentAmount, this.totalRepayment, this.totalInterest, this.interestRate, this.interestType, this.disbursementDate, this.maturityDate, this.finalInstallmentDueDate, this.ledgerRows = const []});

  factory Loan.fromJson(Map<String, dynamic> json) {
    final paymentsJson = json['payments'] as List<dynamic>? ?? [];
    final ledger = (json['ledger'] ?? json['ledger_rows'] ?? json['installments'] ?? const []) as List<dynamic>? ?? const [];
    return Loan(
      id: json['id'].toString(),
      amount: parseDouble(json['principal_amount'] ?? json['approved_amount'] ?? json['amount']) ?? 0,
      balance: parseDouble(json['outstanding'] ?? json['balance']) ?? 0,
      status: json['status']?.toString() ?? 'Active',
      payments: paymentsJson.map((e) => Payment.fromJson(e)).toList(),
      loanDays: parseInt(json['loan_days']),
      repaymentFrequency: json['repayment_frequency']?.toString(),
      numberOfInstallments: parseInt(json['number_of_installments']),
      installmentAmount: parseDouble(json['installment_amount']),
      totalRepayment: parseDouble(json['total_repayment']),
      totalInterest: parseDouble(json['total_interest']),
      interestRate: parseDouble(json['interest_rate']),
      interestType: json['interest_type']?.toString(),
      disbursementDate: json['disbursement_date']?.toString(),
      maturityDate: json['maturity_date']?.toString(),
      finalInstallmentDueDate: json['final_installment_due_date']?.toString(),
      ledgerRows: ledger.whereType<Map>().map((e) => Map<String, dynamic>.from(e)).toList(),
    );
  }
}
