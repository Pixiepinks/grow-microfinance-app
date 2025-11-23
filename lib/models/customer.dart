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
      id: json['id'] as String?,
      fullName: json['fullName'] as String? ?? '',
      nic: json['nic'] as String? ?? '',
      mobile: json['mobile'] as String? ?? '',
      address: json['address'] as String? ?? '',
      branch: json['branch'] as String? ?? '',
      customerType: json['customerType'] as String? ?? '',
      email: json['email'] as String?,
      dateOfBirth: json['dateOfBirth'] != null
          ? DateTime.tryParse(json['dateOfBirth'] as String)
          : null,
      notes: json['notes'] as String?,
    );
  }

  Map<String, dynamic> toJson() {
    return {
      if (id != null) 'id': id,
      'fullName': fullName,
      'nic': nic,
      'mobile': mobile,
      'address': address,
      'branch': branch,
      'customerType': customerType,
      if (email != null) 'email': email,
      if (dateOfBirth != null) 'dateOfBirth': dateOfBirth!.toIso8601String(),
      if (notes != null) 'notes': notes,
    };
  }
}
