class Payment {
  final String id;
  final double amount;
  final DateTime date;
  final String method;
  final String? remarks;

  Payment({
    required this.id,
    required this.amount,
    required this.date,
    required this.method,
    this.remarks,
  });

  factory Payment.fromJson(Map<String, dynamic> json) {
    return Payment(
      id: json['id'].toString(),
      // From backend: amount_collected, collection_date, payment_method, remarks
      amount: (json['amount_collected'] as num?)?.toDouble() ?? 0,
      date: DateTime.tryParse(json['collection_date'] ?? '') ?? DateTime.now(),
      method: json['payment_method'] ?? 'Cash',
      remarks: json['remarks'] as String?,
    );
  }
}
