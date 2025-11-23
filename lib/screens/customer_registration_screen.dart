import 'package:flutter/material.dart';
import 'package:flutter/services.dart';

import '../models/customer.dart';
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
  final _nameController = TextEditingController();
  final _nicController = TextEditingController();
  final _mobileController = TextEditingController();
  final _addressController = TextEditingController();
  final _branchController = TextEditingController();
  final _emailController = TextEditingController();
  final _customerTypeController = TextEditingController();
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

  final _emailRegex = RegExp(r'^[^@]+@[^@]+\.[^@]+$');

  DateTime? _selectedDob;
  bool _submitting = false;

  @override
  void dispose() {
    _nameController.dispose();
    _nicController.dispose();
    _mobileController.dispose();
    _addressController.dispose();
    _branchController.dispose();
    _emailController.dispose();
    _customerTypeController.dispose();
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
    if (!_emailRegex.hasMatch(trimmed)) {
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

  Future<void> _pickOption(
    String title,
    List<String> options,
    TextEditingController controller,
  ) async {
    final selected = await showDialog<String>(
      context: context,
      builder: (context) => SimpleDialog(
        title: Text(title),
        children: options
            .map(
              (option) => SimpleDialogOption(
                onPressed: () => Navigator.of(context).pop(option),
                child: Text(option),
              ),
            )
            .toList(),
      ),
    );

    if (selected != null) {
      setState(() {
        controller.text = selected;
      });
    }
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;

    setState(() => _submitting = true);

    final customer = Customer(
      fullName: _nameController.text.trim(),
      nic: _nicController.text.trim(),
      mobile: _mobileController.text.trim(),
      address: _addressController.text.trim(),
      branch: _branchController.text.trim(),
      customerType: _customerTypeController.text.trim(),
      email: _emailController.text.trim().isEmpty
          ? null
          : _emailController.text.trim(),
      dateOfBirth: _selectedDob,
      notes: _notesController.text.trim().isEmpty
          ? null
          : _notesController.text.trim(),
    );

    try {
      await CustomerRepository().createCustomer(customer);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Customer created successfully')),
      );
      Navigator.of(context).pop(true);
    } catch (e) {
      if (!mounted) return;
      final message = e.toString().isNotEmpty
          ? e.toString()
          : 'Failed to create customer. Please try again.';
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
                        controller: _nameController,
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
                      TextFormField(
                        controller: _branchController,
                        decoration: const InputDecoration(
                          labelText: 'Branch',
                          hintText: 'Select branch',
                          prefixIcon: Icon(Icons.account_tree_outlined),
                          suffixIcon: Icon(Icons.arrow_drop_down),
                        ),
                        readOnly: true,
                        onTap: () => _pickOption(
                          'Select branch',
                          _branches,
                          _branchController,
                        ),
                        validator: (value) => _validateRequired(value, 'Branch'),
                      ),
                      const SizedBox(height: 16),
                      TextFormField(
                        controller: _customerTypeController,
                        decoration: const InputDecoration(
                          labelText: 'Customer type',
                          hintText: 'Select customer type',
                          prefixIcon: Icon(Icons.category_outlined),
                          suffixIcon: Icon(Icons.arrow_drop_down),
                        ),
                        readOnly: true,
                        onTap: () => _pickOption(
                          'Select customer type',
                          _customerTypes,
                          _customerTypeController,
                        ),
                        validator: (value) =>
                            _validateRequired(value, 'Customer type'),
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
