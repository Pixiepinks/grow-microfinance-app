class Customer {
  final String? id;
  final String fullName;
  final String nic;
  final String mobile;
  final String address;
  final String branch;
  final String customerType;
  final String? email;
  final DateTime? dateOfBirth;
  final String? notes;

  const Customer({
    this.id,
    required this.fullName,
    required this.nic,
    required this.mobile,
    required this.address,
    required this.branch,
    required this.customerType,
    this.email,
    this.dateOfBirth,
    this.notes,
  });

  factory Customer.fromJson(Map<String, dynamic> json) {
    return Customer(
      id: json['id']?.toString(),
      fullName:
          (json['fullName'] ?? json['full_name'] ?? '') as String,
      nic: (json['nic'] ?? json['nicNumber'] ?? '') as String,
      mobile: (json['mobile'] ?? json['phone'] ?? '') as String,
      address: (json['address'] ?? '') as String,
      branch: (json['branch'] ?? '') as String,
      customerType:
          (json['customerType'] ?? json['customer_type'] ?? '') as String,
      email: json['email'] as String?,
      dateOfBirth: json['dateOfBirth'] != null
          ? DateTime.tryParse(json['dateOfBirth'] as String)
          : null,
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'fullName': fullName,
      'nic': nic,
      'mobile': mobile,
      'address': address,
      'branch': branch,
      'customerType': customerType,
      'email': email,
      'dateOfBirth': dateOfBirth?.toIso8601String(),
      'notes': notes,
    };
  }
}
