import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../models/customer.dart';
import '../services/api_client.dart';
import '../services/auth_repository.dart';
import '../services/customer_repository.dart';

class CustomerRegistrationScreen extends StatefulWidget {
  const CustomerRegistrationScreen({super.key});

  @override
  State<CustomerRegistrationScreen> createState() =>
      _CustomerRegistrationScreenState();
}

class _CustomerRegistrationScreenState
    extends State<CustomerRegistrationScreen> {
  final _formKey = GlobalKey<FormState>();
  final _fullNameController = TextEditingController();
  final _nicController = TextEditingController();
  final _mobileController = TextEditingController();
  final _addressController = TextEditingController();
  final _emailController = TextEditingController();
  final _dobController = TextEditingController();
  final _notesController = TextEditingController();

  final List<String> _branches = const [
    'Main Branch',
    'City Branch',
    'Rural Branch',
  ];

  final List<String> _customerTypes = const [
    'Loan',
    'Savings',
    'Both',
  ];

  String? _selectedBranch;
  String? _selectedCustomerType;
  DateTime? _selectedDob;
  bool _submitting = false;

  late final ApiClient _apiClient = ApiClient();
  late final CustomerRepository _customerRepository =
      CustomerRepository(_apiClient);
  late final AuthRepository _authRepository = AuthRepository(_apiClient);

  @override
  void initState() {
    super.initState();
    _initializeAuth();
  }

  Future<void> _initializeAuth() async {
    await _authRepository.loadToken();
  }

  @override
  void dispose() {
    _fullNameController.dispose();
    _nicController.dispose();
    _mobileController.dispose();
    _addressController.dispose();
    _emailController.dispose();
    _dobController.dispose();
    _notesController.dispose();
    super.dispose();
  }

  String? _validateRequired(String? value, String fieldName) {
    if (value == null || value.trim().isEmpty) {
      return '$fieldName is required';
    }
    return null;
  }

  String? _validateMobile(String? value) {
    final cleaned = value?.replaceAll(' ', '') ?? '';
    if (cleaned.isEmpty) {
      return 'Mobile number is required';
    }
    if (cleaned.length < 9 || cleaned.length > 15) {
      return 'Mobile number must be between 9 and 15 digits';
    }
    if (!cleaned.split('').every((char) => int.tryParse(char) != null)) {
      return 'Mobile number should contain digits only';
    }
    return null;
  }

  String? _validateEmail(String? value) {
    final trimmed = value?.trim() ?? '';
    if (trimmed.isEmpty) return null;
    final emailRegex = RegExp('^[^@]+@[^@]+\\.[^@]+$');
    if (!emailRegex.hasMatch(trimmed)) {
      return 'Enter a valid email address';
    }
    return null;
  }

  Future<void> _pickDate() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _selectedDob ?? DateTime(now.year - 18),
      firstDate: DateTime(1900),
      lastDate: now,
    );
    if (picked != null) {
      setState(() {
        _selectedDob = picked;
        _dobController.text = _formatDate(picked);
      });
    }
  }

  String _formatDate(DateTime date) {
    return '${date.year}-${date.month.toString().padLeft(2, '0')}-${date.day.toString().padLeft(2, '0')}';
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _submitting = true);

    final customer = Customer(
      fullName: _fullNameController.text.trim(),
      nic: _nicController.text.trim(),
      mobile: _mobileController.text.replaceAll(' ', ''),
      address: _addressController.text.trim(),
      branch: _selectedBranch!,
      customerType: _selectedCustomerType!,
      email: _emailController.text.trim().isEmpty
          ? null
          : _emailController.text.trim(),
      dateOfBirth: _selectedDob,
      notes: _notesController.text.trim().isEmpty
          ? null
          : _notesController.text.trim(),
    );

    try {
      await _customerRepository.createCustomer(customer);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Customer created successfully')),
      );
      Navigator.of(context).pop(true);
    } catch (e) {
      if (!mounted) return;
      final message = e.toString().isNotEmpty
          ? e.toString()
          : 'Failed to create customer. Please check your connection and try again.';
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(message)),
      );
    } finally {
      if (mounted) {
        setState(() => _submitting = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: const Text('Customer Registration'),
      ),
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(16),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 600),
            child: Form(
              key: _formKey,
              child: Stack(
                children: [
                  Column(
                    crossAxisAlignment: CrossAxisAlignment.stretch,
                    children: [
                      TextFormField(
                        controller: _fullNameController,
                        decoration: const InputDecoration(
                          labelText: 'Full name',
                          hintText: 'Enter full name',
                          prefixIcon: Icon(Icons.person_outline),
                        ),
                        textInputAction: TextInputAction.next,
                        validator: (value) =>
                            _validateRequired(value, 'Full name'),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _nicController,
                        decoration: const InputDecoration(
                          labelText: 'NIC / ID number',
                          hintText: 'Enter NIC or ID number',
                          prefixIcon: Icon(Icons.badge_outlined),
                        ),
                        textInputAction: TextInputAction.next,
                        validator: (value) => _validateRequired(value, 'NIC / ID'),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _mobileController,
                        decoration: const InputDecoration(
                          labelText: 'Mobile number',
                          hintText: 'Enter mobile number',
                          prefixIcon: Icon(Icons.phone_iphone),
                        ),
                        keyboardType: TextInputType.phone,
                        inputFormatters: [
                          FilteringTextInputFormatter.allow(RegExp(r'[0-9 ]')),
                          LengthLimitingTextInputFormatter(15),
                        ],
                        textInputAction: TextInputAction.next,
                        validator: _validateMobile,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _addressController,
                        decoration: const InputDecoration(
                          labelText: 'Address',
                          hintText: 'Enter address',
                          prefixIcon: Icon(Icons.home_outlined),
                        ),
                        maxLines: 3,
                        textInputAction: TextInputAction.next,
                        validator: (value) => _validateRequired(value, 'Address'),
                      ),
                      const SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        decoration: const InputDecoration(
                          labelText: 'Branch',
                          prefixIcon: Icon(Icons.account_tree_outlined),
                        ),
                        items: _branches
                            .map((branch) => DropdownMenuItem(
                                  value: branch,
                                  child: Text(branch),
                                ))
                            .toList(),
                        value: _selectedBranch,
                        onChanged: (value) => setState(() => _selectedBranch = value),
                        validator: (value) =>
                            value == null ? 'Branch is required' : null,
                      ),
                      const SizedBox(height: 16),
                      DropdownButtonFormField<String>(
                        decoration: const InputDecoration(
                          labelText: 'Customer type',
                          prefixIcon: Icon(Icons.category_outlined),
                        ),
                        items: _customerTypes
                            .map((type) => DropdownMenuItem(
                                  value: type,
                                  child: Text(type),
                                ))
                            .toList(),
                        value: _selectedCustomerType,
                        onChanged: (value) =>
                            setState(() => _selectedCustomerType = value),
                        validator: (value) =>
                            value == null ? 'Customer type is required' : null,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _emailController,
                        decoration: const InputDecoration(
                          labelText: 'Email (optional)',
                          hintText: 'Enter email address',
                          prefixIcon: Icon(Icons.email_outlined),
                        ),
                        keyboardType: TextInputType.emailAddress,
                        textInputAction: TextInputAction.next,
                        validator: _validateEmail,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _dobController,
                        decoration: const InputDecoration(
                          labelText: 'Date of birth (optional)',
                          hintText: 'Select date of birth',
                          prefixIcon: Icon(Icons.cake_outlined),
                        ),
                        readOnly: true,
                        onTap: _pickDate,
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _notesController,
                        decoration: const InputDecoration(
                          labelText: 'Notes (optional)',
                          hintText: 'Additional notes',
                          prefixIcon: Icon(Icons.note_alt_outlined),
                        ),
                        maxLines: 3,
                      ),
                      const SizedBox(height: 24),
                      SizedBox(
                        width: double.infinity,
                        child: ElevatedButton(
                          onPressed: _submitting ? null : _submit,
                          child: _submitting
                              ? const SizedBox(
                                  height: 20,
                                  width: 20,
                                  child: CircularProgressIndicator(
                                    strokeWidth: 2,
                                    valueColor: AlwaysStoppedAnimation(Colors.white),
                                  ),
                                )
                              : const Text('Create Customer'),
                        ),
                      ),
                    ],
                  ),
                  if (_submitting)
                    Positioned.fill(
                      child: Container(
                        color: Colors.black.withOpacity(0.05),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ),
      ),
    );
  }
}
