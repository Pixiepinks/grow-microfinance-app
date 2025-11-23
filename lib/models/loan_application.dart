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
  final Map<String, dynamic> documents;

  factory LoanApplication.fromJson(Map<String, dynamic> json) {
    return LoanApplication(
      id: json['id'].toString(),
      applicationNumber: json['application_number']?.toString() ?? '',
      loanType: json['loan_type'] ?? '',
      status: json['status'] ?? 'DRAFT',
      appliedAmount: (json['applied_amount'] as num?)?.toDouble() ?? 0,
      tenureMonths: json['tenure_months'] ??
          (json['tenure'] as num?)?.toInt() ??
              (json['tenure_in_months'] as num?)?.toInt() ??
              0,
      loanPurpose: json['loan_purpose'] ?? '',
      createdAt: DateTime.tryParse(json['created_at'] ?? '') ?? DateTime.now(),
      applicantDetails: json['applicant_details'] as Map<String, dynamic>? ?? {},
      loanDetails: json['loan_details'] as Map<String, dynamic>? ?? {},
      typeSpecific: json['type_specific'] as Map<String, dynamic>? ?? {},
      documents: json['documents'] as Map<String, dynamic>? ?? {},
    );
  }

  String get formattedDate => DateFormat('yMMMd').format(createdAt);
}
