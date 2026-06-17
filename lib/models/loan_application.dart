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
    );
  }

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
      documents: (json['documents'] as List<dynamic>? ?? const [])
          .map((e) => e as Map<String, dynamic>)
          .toList(),
      availableActions:
          (json['available_actions'] ?? json['availableActions'] ?? const []) is List
              ? ((json['available_actions'] ?? json['availableActions']) as List)
                  .map((action) => action.toString().toLowerCase())
                  .toList()
              : const [],
    );
  }

  String get formattedDate => DateFormat('yMMMd').format(createdAt);
}
