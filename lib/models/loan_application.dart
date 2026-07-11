import 'package:intl/intl.dart';

class LoanApplication {
  LoanApplication({
    required this.id,
    required this.applicationNumber,
    required this.loanType,
    required this.status,
    required this.appliedAmount,
    required this.tenureMonths,
    required this.loanPurpose,
    required this.createdAt,
    required this.applicantDetails,
    required this.loanDetails,
    required this.typeSpecific,
    required this.documents,
    required this.availableActions,
    this.approvedAmount,
    this.loanDays,
    this.repaymentFrequency,
    this.numberOfInstallments,
    this.installmentAmount,
    this.totalRepayment,
    this.totalInterest,
    this.interestRate,
    this.interestType,
    this.maturityDate,
    this.finalInstallmentDueDate,
  });

  final String id;
  final String applicationNumber;
  final String loanType;
  final String status;
  final double appliedAmount;
  final int tenureMonths;
  final String loanPurpose;
  final DateTime createdAt;
  final Map<String, dynamic> applicantDetails;
  final Map<String, dynamic> loanDetails;
  final Map<String, dynamic> typeSpecific;
  final List<Map<String, dynamic>> documents;
  final List<String> availableActions;
  final double? approvedAmount;
  final int? loanDays;
  final String? repaymentFrequency;
  final int? numberOfInstallments;
  final double? installmentAmount;
  final double? totalRepayment;
  final double? totalInterest;
  final double? interestRate;
  final String? interestType;
  final String? maturityDate;
  final String? finalInstallmentDueDate;

  LoanApplication copyWith({List<String>? availableActions}) {
    return LoanApplication(
      id: id,
      applicationNumber: applicationNumber,
      loanType: loanType,
      status: status,
      appliedAmount: appliedAmount,
      tenureMonths: tenureMonths,
      loanPurpose: loanPurpose,
      createdAt: createdAt,
      applicantDetails: applicantDetails,
      loanDetails: loanDetails,
      typeSpecific: typeSpecific,
      documents: documents,
      availableActions: availableActions ?? this.availableActions,
      approvedAmount: approvedAmount,
      loanDays: loanDays,
      repaymentFrequency: repaymentFrequency,
      numberOfInstallments: numberOfInstallments,
      installmentAmount: installmentAmount,
      totalRepayment: totalRepayment,
      totalInterest: totalInterest,
      interestRate: interestRate,
      interestType: interestType,
      maturityDate: maturityDate,
      finalInstallmentDueDate: finalInstallmentDueDate,
    );
  }

  factory LoanApplication.fromJson(Map<String, dynamic> json) {
    return LoanApplication(
      id: json['id'].toString(),
      applicationNumber: json['application_number']?.toString() ?? '',
      loanType: json['loan_type']?.toString() ?? '',
      status: json['status']?.toString() ?? 'DRAFT',
      appliedAmount: parseDouble(json['applied_amount']) ?? 0,
      tenureMonths: parseInt(json['tenure_months']) ??
          parseInt(json['tenure']) ??
          parseInt(json['tenure_in_months']) ??
          0,
      loanPurpose: json['loan_purpose']?.toString() ?? '',
      createdAt: DateTime.tryParse(json['created_at']?.toString() ?? '') ?? DateTime.now(),
      applicantDetails: json['applicant_details'] as Map<String, dynamic>? ?? {},
      loanDetails: json['loan_details'] as Map<String, dynamic>? ?? {},
      typeSpecific: json['type_specific'] as Map<String, dynamic>? ?? {},
      documents: (json['documents'] as List<dynamic>? ?? const [])
          .whereType<Map>()
          .map((e) => Map<String, dynamic>.from(e))
          .toList(),
      availableActions:
          (json['available_actions'] ?? json['availableActions'] ?? const []) is List
              ? ((json['available_actions'] ?? json['availableActions']) as List)
                  .map((action) => action.toString().toLowerCase())
                  .toList()
              : const [],
      approvedAmount: parseDouble(json['approved_amount']),
      loanDays: parseInt(json['loan_days']),
      repaymentFrequency: json['repayment_frequency']?.toString(),
      numberOfInstallments: parseInt(json['number_of_installments']),
      installmentAmount: parseDouble(json['installment_amount']),
      totalRepayment: parseDouble(json['total_repayment']),
      totalInterest: parseDouble(json['total_interest']),
      interestRate: parseDouble(json['interest_rate']),
      interestType: json['interest_type']?.toString(),
      maturityDate: json['maturity_date']?.toString(),
      finalInstallmentDueDate: json['final_installment_due_date']?.toString(),
    );
  }

  bool get hasCompleteApprovedTerms =>
      approvedAmount != null &&
      approvedAmount! > 0 &&
      loanDays != null &&
      loanDays! > 0 &&
      repaymentFrequency != null &&
      repaymentFrequency!.isNotEmpty &&
      numberOfInstallments != null &&
      numberOfInstallments! > 0 &&
      installmentAmount != null &&
      installmentAmount! > 0 &&
      interestType != null &&
      interestType!.isNotEmpty;

  String get formattedDate => DateFormat('yMMMd').format(createdAt);
}

double? parseDouble(Object? value) {
  if (value == null) return null;
  if (value is num) return value.toDouble();
  return double.tryParse(value.toString().replaceAll(',', '').trim());
}

int? parseInt(Object? value) {
  if (value == null) return null;
  if (value is int) return value;
  if (value is num) return value.toInt();
  return int.tryParse(value.toString().replaceAll(',', '').trim());
}

String enumLabel(Object? value) {
  final raw = value?.toString() ?? '';
  if (raw.isEmpty) return 'Not available';
  return raw
      .toLowerCase()
      .split('_')
      .map((word) => word.isEmpty ? word : '${word[0].toUpperCase()}${word.substring(1)}')
      .join(' ');
}
