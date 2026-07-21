import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../models/loan_application.dart';
import '../../services/api_client.dart';
import '../../services/loan_application_service.dart';
import '../../utils/currency_formatter.dart';

class LoanApplicationFormScreen extends StatefulWidget {
  const LoanApplicationFormScreen({
    super.key,
    required this.service,
    this.existing,
  });

  final LoanApplicationService service;
  final LoanApplication? existing;

  @override
  State<LoanApplicationFormScreen> createState() =>
      _LoanApplicationFormScreenState();
}

class _LoanApplicationFormScreenState extends State<LoanApplicationFormScreen> {
  final _formKey = GlobalKey<FormState>();
  int _currentStep = 0;
  bool _saving = false;
  bool _hasExistingLoans = false;
  bool _searchingCustomers = false;
  bool _loadingCustomerProfile = false;
  String? _customerProfileError;
  String? _selectedCustomerId;
  String? _selectedCustomerLabel;
  String? _profileRequestCustomerId;
  List<Map<String, dynamic>> _customerResults = [];
  List<Map<String, dynamic>> _existingLoans = [];
  List<String> _profileWarnings = [];
  String _selectedLoanType = loanTypes.first;
  DateTime? _dateOfBirth;
  String? _applicationId;
  final DateFormat _dobFormatter = DateFormat('yyyy-MM-dd');

  final TextEditingController _fullNameController = TextEditingController();
  final TextEditingController _nicController = TextEditingController();
  final TextEditingController _mobileController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _address1Controller = TextEditingController();
  final TextEditingController _address2Controller = TextEditingController();
  final TextEditingController _cityController = TextEditingController();
  final TextEditingController _districtController = TextEditingController();
  final TextEditingController _provinceController = TextEditingController();
  final TextEditingController _postalCodeController = TextEditingController();
  final TextEditingController _customerSearchController = TextEditingController();
  final TextEditingController _monthlyIncomeController = TextEditingController();
  final TextEditingController _monthlyExpensesController =
      TextEditingController();
  final TextEditingController _existingLoansController = TextEditingController();
  final TextEditingController _appliedAmountController = TextEditingController();
  final TextEditingController _tenureController = TextEditingController();
  final TextEditingController _loanPurposeController = TextEditingController();

  // Type specific controllers
  final TextEditingController _onlineStoreController = TextEditingController();
  final TextEditingController _onlinePlatformController =
      TextEditingController();
  final TextEditingController _averageRevenueController =
      TextEditingController();
  final TextEditingController _productCategoryController =
      TextEditingController();
  final TextEditingController _businessNameController = TextEditingController();
  final TextEditingController _businessRegController = TextEditingController();
  final TextEditingController _businessAddressController =
      TextEditingController();
  final TextEditingController _businessTypeController = TextEditingController();
  final TextEditingController _monthlySalesController = TextEditingController();
  final TextEditingController _employmentStatusController =
      TextEditingController();
  final TextEditingController _employerController = TextEditingController();
  final TextEditingController _guarantorNameController = TextEditingController();
  final TextEditingController _guarantorContactController =
      TextEditingController();
  final TextEditingController _teamNameController = TextEditingController();
  final TextEditingController _teamSizeController = TextEditingController();
  final TextEditingController _meetingLocationController =
      TextEditingController();

  final Map<String, PlatformFile?> _documents = {};
  final Map<String, String> _uploadedDocumentIds = {};
  final Map<String, String> _documentUploadWarnings = {};
  final Set<String> _skippedDocuments = {};
  bool _skipDocumentsForNow = false;

  @override
  void initState() {
    super.initState();
    _hydrateFromExisting();
  }

  void _hydrateFromExisting() {
    final existing = widget.existing;
    if (existing == null) return;
    _applicationId = existing.id;
    _selectedLoanType = existing.loanType.isNotEmpty
        ? _mapApiLoanTypeToUi(existing.loanType)
        : _selectedLoanType;
    final applicant = {
      ...existing.applicantDetails,
      // Allow hydration from flattened API responses
      'full_name': existing.applicantDetails['full_name'] ?? existing.applicantDetails['name'],
      'nic_number': existing.applicantDetails['nic_number'] ?? existing.applicantDetails['nic'],
      'mobile_number':
          existing.applicantDetails['mobile_number'] ?? existing.applicantDetails['mobile'],
    };
    _fullNameController.text =
        applicant['full_name'] ?? (existing.applicantDetails['name'] ?? '');
    _nicController.text = applicant['nic_number'] ?? applicant['nic'] ?? '';
    _mobileController.text = applicant['mobile_number'] ?? applicant['mobile'] ?? '';
    _emailController.text = applicant['email'] ?? '';
    _address1Controller.text = applicant['address_line1'] ?? '';
    _address2Controller.text = applicant['address_line2'] ?? '';
    _cityController.text = applicant['city'] ?? '';
    _districtController.text = applicant['district'] ?? '';
    _provinceController.text = applicant['province'] ?? '';
    _dateOfBirth = applicant['date_of_birth'] != null
        ? DateTime.tryParse(applicant['date_of_birth'])
        : null;
    _monthlyIncomeController.text =
        (applicant['monthly_income'] ?? existing.loanDetails['monthly_income'])
                ?.toString() ??
            '';
    _monthlyExpensesController.text =
        (applicant['monthly_expenses'] ?? existing.loanDetails['monthly_expenses'])
                ?.toString() ??
            '';
    _hasExistingLoans = applicant['has_existing_loans'] ?? false;
    _existingLoansController.text =
        applicant['existing_loans_description'] ?? '';

    final loanDetails = {
      ...existing.loanDetails,
      'applied_amount': existing.appliedAmount,
      'tenure_months': existing.tenureMonths,
      'loan_purpose': existing.loanPurpose,
    };
    _appliedAmountController.text =
        loanDetails['applied_amount']?.toString() ?? '';
    _tenureController.text =
        loanDetails['tenure_months']?.toString() ?? '';
    _loanPurposeController.text =
        loanDetails['loan_purpose']?.toString() ?? '';

    final typeSpecific = {
      ...existing.typeSpecific,
      // allow flattened responses
      ...existing.loanDetails,
    };
    _onlineStoreController.text = typeSpecific['store_url'] ?? '';
    _onlinePlatformController.text = typeSpecific['store_platform'] ?? '';
    _averageRevenueController.text =
        (typeSpecific['average_monthly_revenue_last_3_months'] ??
                typeSpecific['average_monthly_revenue'] ??
                typeSpecific['avg_monthly_revenue'])
            ?.toString() ??
        '';
    _productCategoryController.text =
        typeSpecific['main_product_category'] ?? '';
    _businessNameController.text = typeSpecific['business_name'] ?? '';
    _businessRegController.text = typeSpecific['business_registration'] ??
        typeSpecific['business_reg_number'] ??
        '';
    _businessAddressController.text = typeSpecific['business_address'] ?? '';
    _businessTypeController.text = typeSpecific['business_type'] ?? '';
    _monthlySalesController.text =
        typeSpecific['monthly_sales']?.toString() ?? '';
    _employmentStatusController.text = typeSpecific['employment_status'] ?? '';
    _employerController.text = typeSpecific['employer_name'] ?? '';
    _guarantorNameController.text = typeSpecific['guarantor_name'] ?? '';
    _guarantorContactController.text = typeSpecific['guarantor_contact'] ?? '';
    _teamNameController.text = typeSpecific['team_name'] ?? '';
    _teamSizeController.text =
        typeSpecific['member_count']?.toString() ?? '';
    _meetingLocationController.text = typeSpecific['meeting_location'] ?? '';
  }

  @override
  void dispose() {
    _fullNameController.dispose();
    _nicController.dispose();
    _mobileController.dispose();
    _emailController.dispose();
    _address1Controller.dispose();
    _address2Controller.dispose();
    _cityController.dispose();
    _districtController.dispose();
    _provinceController.dispose();
    _postalCodeController.dispose();
    _customerSearchController.dispose();
    _monthlyIncomeController.dispose();
    _monthlyExpensesController.dispose();
    _existingLoansController.dispose();
    _appliedAmountController.dispose();
    _tenureController.dispose();
    _loanPurposeController.dispose();
    _onlineStoreController.dispose();
    _onlinePlatformController.dispose();
    _averageRevenueController.dispose();
    _productCategoryController.dispose();
    _businessNameController.dispose();
    _businessRegController.dispose();
    _businessAddressController.dispose();
    _businessTypeController.dispose();
    _monthlySalesController.dispose();
    _employmentStatusController.dispose();
    _employerController.dispose();
    _guarantorNameController.dispose();
    _guarantorContactController.dispose();
    _teamNameController.dispose();
    _teamSizeController.dispose();
    _meetingLocationController.dispose();
    super.dispose();
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(widget.existing == null
            ? 'New Loan Application'
            : 'Edit Loan Application'),
      ),
      body: Form(
        key: _formKey,
        child: Stepper(
          currentStep: _currentStep,
          onStepContinue: _handleContinue,
          onStepCancel: _handleBack,
          controlsBuilder: (context, details) {
            final isLast = _currentStep == 5;
            return Row(
              children: [
                ElevatedButton(
                  onPressed: _loadingCustomerProfile ||
                          (_currentStep == 1 && _selectedCustomerId != null && _customerProfileError != null)
                      ? null
                      : details.onStepContinue,
                  child: Text(isLast ? 'Review & Save' : 'Next'),
                ),
                const SizedBox(width: 12),
                if (_currentStep > 0)
                  TextButton(
                    onPressed: details.onStepCancel,
                    child: const Text('Back'),
                  ),
              ],
            );
          },
          steps: [
            Step(
              title: const Text('Loan Type'),
              isActive: _currentStep >= 0,
              content: _buildLoanTypeSelection(),
            ),
            Step(
              title: const Text('Applicant Details'),
              isActive: _currentStep >= 1,
              content: _buildApplicantDetails(),
            ),
            Step(
              title: const Text('Loan Details'),
              isActive: _currentStep >= 2,
              content: _buildLoanDetails(),
            ),
            Step(
              title: const Text('Type Specific'),
              isActive: _currentStep >= 3,
              content: _buildTypeSpecificFields(),
            ),
            Step(
              title: const Text('Documents'),
              isActive: _currentStep >= 4,
              content: _buildDocuments(),
            ),
            Step(
              title: const Text('Review'),
              isActive: _currentStep >= 5,
              content: _buildReview(),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildLoanTypeSelection() {
    return Column(
      children: loanTypes
          .map(
            (type) => Card(
              color: _selectedLoanType == type
                  ? Theme.of(context).colorScheme.primary.withOpacity(0.08)
                  : null,
              child: ListTile(
                title: Text(type),
                trailing: _selectedLoanType == type
                    ? const Icon(Icons.check_circle, color: Colors.green)
                    : null,
                onTap: () => setState(() => _selectedLoanType = type),
              ),
            ),
          )
          .toList(),
    );
  }

  Widget _buildCustomerLookup() {
    return Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
      TextFormField(
        controller: _customerSearchController,
        enabled: !_loadingCustomerProfile,
        decoration: InputDecoration(
          labelText: 'Find existing customer',
          hintText: 'Search by customer code, name, NIC or mobile',
          suffixIcon: _searchingCustomers
              ? const Padding(padding: EdgeInsets.all(12), child: SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2)))
              : IconButton(icon: const Icon(Icons.search), onPressed: _searchCustomers),
        ),
        onFieldSubmitted: (_) => _searchCustomers(),
      ),
      if (_selectedCustomerId != null)
        Padding(
          padding: const EdgeInsets.only(top: 8),
          child: Row(children: [
            Expanded(child: Text('Selected customer: ${_selectedCustomerLabel ?? _selectedCustomerId}')),
            TextButton(onPressed: _clearCustomerSelection, child: const Text('Clear Selection')),
          ]),
        ),
      if (_loadingCustomerProfile)
        const Padding(padding: EdgeInsets.only(top: 8), child: Text('Loading customer profile…')),
      if (_customerProfileError != null)
        Padding(
          padding: const EdgeInsets.only(top: 8),
          child: Row(children: [
            Expanded(child: Text(_customerProfileError!, style: TextStyle(color: Theme.of(context).colorScheme.error))),
            TextButton(onPressed: _selectedCustomerId == null ? null : () => _loadCustomerProfile(_selectedCustomerId!), child: const Text('Retry')),
          ]),
        ),
      ..._customerResults.map((result) {
        final id = _value(result['id'] ?? result['customer_id']);
        return ListTile(
          dense: true,
          title: Text(_value(result['full_name']).isEmpty ? 'Customer $id' : _value(result['full_name'])),
          subtitle: Text([_value(result['customer_code']), _value(result['nic_number']), _value(result['mobile'] ?? result['mobile_number'])].where((value) => value.isNotEmpty).join(' • ')),
          onTap: id.isEmpty ? null : () => _selectCustomer(result, id),
        );
      }),
    ]);
  }

  Future<void> _searchCustomers() async {
    setState(() { _searchingCustomers = true; _customerResults = []; });
    try {
      final results = await widget.service.searchCustomers(_customerSearchController.text);
      if (mounted) setState(() => _customerResults = results);
    } catch (_) {
      if (mounted) setState(() => _customerProfileError = 'Unable to search customers. Please try again.');
    } finally {
      if (mounted) setState(() => _searchingCustomers = false);
    }
  }

  void _selectCustomer(Map<String, dynamic> result, String id) {
    final label = [_value(result['customer_code']), _value(result['full_name']), _value(result['nic_number']), _value(result['mobile'] ?? result['mobile_number'])].where((value) => value.isNotEmpty).join(' • ');
    setState(() {
      _selectedCustomerId = id;
      _selectedCustomerLabel = label.isEmpty ? 'Customer $id' : label;
      _customerResults = [];
      _customerProfileError = null;
      _loadingCustomerProfile = true;
      _clearAutofilledApplicantFields();
    });
    _loadCustomerProfile(id);
  }

  Future<void> _loadCustomerProfile(String customerId) async {
    _profileRequestCustomerId = customerId;
    setState(() { _loadingCustomerProfile = true; _customerProfileError = null; });
    try {
      final profile = await widget.service.fetchNormalizedCustomerProfile(customerId);
      final returnedId = _value(profile['customer_id'] ?? profile['id']);
      if (!mounted || _profileRequestCustomerId != customerId || _selectedCustomerId != customerId || returnedId != customerId) return;
      setState(() {
        _applyNormalizedProfile(profile);
        _loadingCustomerProfile = false;
      });
    } catch (_) {
      if (mounted && _selectedCustomerId == customerId) {
        setState(() { _loadingCustomerProfile = false; _customerProfileError = 'Unable to load the normalized customer profile. Please retry.'; });
      }
    }
  }

  void _applyNormalizedProfile(Map<String, dynamic> profile) {
    String field(String key, [String? fallback]) => _value(profile[key] ?? (fallback == null ? null : profile[fallback]));
    _fullNameController.text = field('full_name');
    _nicController.text = field('nic_number');
    _mobileController.text = field('mobile', 'mobile_number');
    _emailController.text = field('email');
    _address1Controller.text = field('current_address_line1', 'address_line1');
    _address2Controller.text = field('current_address_line2', 'address_line2');
    _cityController.text = field('current_city', 'city');
    _districtController.text = field('current_district', 'district');
    _provinceController.text = field('current_province', 'province');
    _postalCodeController.text = field('current_postal_code', 'postal_code');
    _monthlyIncomeController.text = field('monthly_income');
    _monthlyExpensesController.text = field('monthly_expenses');
    final dob = field('date_of_birth');
    _dateOfBirth = dob.isEmpty ? null : DateTime.tryParse(dob);
    final loanValue = profile['existing_loan_details'] ?? profile['existing_loans'] ?? [];
    _existingLoans = loanValue is List ? loanValue.whereType<Map>().map((loan) => Map<String, dynamic>.from(loan)).toList() : [];
    _hasExistingLoans = profile['has_existing_loans'] == true || _existingLoans.isNotEmpty;
    _existingLoansController.text = _existingLoans.map(_loanSummary).join('\n');
    _profileWarnings = _warningsFor(profile);
    final code = field('customer_code');
    if (code.isNotEmpty) _selectedCustomerLabel = '$code • ${field('full_name')}';
  }

  List<String> _warningsFor(Map<String, dynamic> profile) {
    final warnings = <String>[];
    if (profile['profile_complete'] == false) warnings.add('Customer profile incomplete.');
    for (final key in ['missing_fields', 'conflicts', 'review_warnings']) {
      final value = profile[key];
      if (value is List) warnings.addAll(value.map(_value).where((value) => value.isNotEmpty));
      else if (_value(value).isNotEmpty) warnings.add(_value(value));
    }
    if (profile['address_review_required'] == true) warnings.add('Address review is required.');
    return warnings;
  }

  String _loanSummary(Map<String, dynamic> loan) {
    final outstanding = _value(loan['outstanding_balance']);
    final instalment = _value(loan['instalment_amount']);
    return [
      _value(loan['loan_number'] ?? loan['number']),
      _value(loan['status']),
      if (outstanding.isNotEmpty) 'Outstanding: $outstanding',
      if (instalment.isNotEmpty) 'Instalment: $instalment',
      _value(loan['repayment_frequency']),
    ].where((value) => value.isNotEmpty).join(' • ');
  }

  String _value(dynamic value) {
    if (value == null) return '';
    final text = value.toString().trim();
    return ['null', 'undefined', 'none', 'nan'].contains(text.toLowerCase()) ? '' : text;
  }

  void _clearAutofilledApplicantFields() {
    for (final controller in [_fullNameController, _nicController, _mobileController, _emailController, _address1Controller, _address2Controller, _cityController, _districtController, _provinceController, _postalCodeController, _monthlyIncomeController, _monthlyExpensesController, _existingLoansController]) { controller.clear(); }
    _dateOfBirth = null; _hasExistingLoans = false; _existingLoans = []; _profileWarnings = [];
  }

  void _clearCustomerSelection() {
    setState(() {
      _profileRequestCustomerId = null;
      _loadingCustomerProfile = false;
      _selectedCustomerId = null; _selectedCustomerLabel = null; _customerProfileError = null; _customerResults = [];
      _clearAutofilledApplicantFields();
      _formKey.currentState?.reset();
    });
  }

  Widget _buildExistingLoans() => Card(child: Padding(padding: const EdgeInsets.all(12), child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
    const Text('Existing loans', style: TextStyle(fontWeight: FontWeight.bold)),
    ..._existingLoans.map((loan) => Padding(padding: const EdgeInsets.only(top: 6), child: Text(_loanSummary(loan))),
  ])));

  Widget _buildApplicantDetails() {
    return Column(
      children: [
        _buildCustomerLookup(),
        const SizedBox(height: 12),
        const Card(
          child: Padding(
            padding: EdgeInsets.all(12),
            child: Text('Customer information is copied into this application. Changes here do not automatically update the customer master profile.'),
          ),
        ),
        if (_profileWarnings.isNotEmpty)
          Card(
            color: Colors.amber.shade50,
            child: Padding(
              padding: const EdgeInsets.all(12),
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                const Text('Customer profile warnings', style: TextStyle(fontWeight: FontWeight.bold)),
                ..._profileWarnings.map((warning) => Text('• $warning')),
              ]),
            ),
          ),
        TextFormField(
          controller: _fullNameController,
          decoration: const InputDecoration(labelText: 'Full Name'),
          validator: (v) => v == null || v.isEmpty ? 'Required' : null,
        ),
        TextFormField(
          controller: _nicController,
          decoration: const InputDecoration(labelText: 'NIC'),
          validator: (v) => v == null || v.isEmpty ? 'Required' : null,
        ),
        TextFormField(
          controller: _mobileController,
          decoration: const InputDecoration(labelText: 'Mobile'),
          keyboardType: TextInputType.phone,
          validator: (v) => v == null || v.isEmpty ? 'Required' : null,
        ),
        TextFormField(
          controller: _emailController,
          decoration: const InputDecoration(labelText: 'Email'),
          keyboardType: TextInputType.emailAddress,
        ),
        TextFormField(
          controller: _address1Controller,
          decoration: const InputDecoration(labelText: 'Address line 1'),
          validator: (v) => v == null || v.isEmpty ? 'Required' : null,
        ),
        TextFormField(
          controller: _address2Controller,
          decoration: const InputDecoration(labelText: 'Address line 2'),
        ),
        Row(
          children: [
            Expanded(
              child: TextFormField(
                controller: _cityController,
                decoration: const InputDecoration(labelText: 'City'),
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: TextFormField(
                controller: _districtController,
                decoration: const InputDecoration(labelText: 'District'),
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              ),
            ),
          ],
        ),
        TextFormField(
          controller: _postalCodeController,
          decoration: const InputDecoration(labelText: 'Postal code'),
          keyboardType: TextInputType.number,
        ),
        Row(
          children: [
            Expanded(
              child: TextFormField(
                controller: _provinceController,
                decoration: const InputDecoration(labelText: 'Province'),
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: InkWell(
                onTap: _pickDob,
                child: InputDecorator(
                  decoration: const InputDecoration(labelText: 'Date of Birth'),
                  child: Text(
                    _dateOfBirth == null
                        ? 'Tap to select'
                        : _dateOfBirth!.toLocal().toString().split(' ').first,
                  ),
                ),
              ),
            ),
          ],
        ),
        Row(
          children: [
            Expanded(
              child: TextFormField(
                controller: _monthlyIncomeController,
                decoration:
                    const InputDecoration(labelText: 'Monthly Income (LKR)'),
                keyboardType: TextInputType.number,
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              ),
            ),
            const SizedBox(width: 12),
            Expanded(
              child: TextFormField(
                controller: _monthlyExpensesController,
                decoration:
                    const InputDecoration(labelText: 'Monthly Expenses (LKR)'),
                keyboardType: TextInputType.number,
                validator: (v) => v == null || v.isEmpty ? 'Required' : null,
              ),
            ),
          ],
        ),
        SwitchListTile(
          contentPadding: EdgeInsets.zero,
          title: const Text('You currently have other loans'),
          value: _hasExistingLoans,
          onChanged: (val) => setState(() => _hasExistingLoans = val),
        ),
        if (_existingLoans.isNotEmpty)
          _buildExistingLoans(),
        if (_hasExistingLoans && _existingLoans.isEmpty)
          TextFormField(
            controller: _existingLoansController,
            decoration:
                const InputDecoration(labelText: 'Existing loans description'),
            maxLines: 2,
          ),
      ],
    );
  }

  Widget _buildLoanDetails() {
    final purposes = loanPurposes[_selectedLoanType] ?? [];
    return Column(
      children: [
        TextFormField(
          controller: _appliedAmountController,
          decoration:
              const InputDecoration(labelText: 'Applied Amount (LKR)'),
          keyboardType: TextInputType.number,
          validator: (v) => v == null || v.isEmpty ? 'Required' : null,
        ),
        TextFormField(
          controller: _tenureController,
          decoration: const InputDecoration(labelText: 'Tenure (months)'),
          keyboardType: TextInputType.number,
          validator: (v) => v == null || v.isEmpty ? 'Required' : null,
        ),
        DropdownButtonFormField<String>(
          decoration: const InputDecoration(labelText: 'Loan Purpose'),
          items: purposes
              .map((p) => DropdownMenuItem(value: p, child: Text(p)))
              .toList(),
          value: purposes.contains(_loanPurposeController.text)
              ? _loanPurposeController.text
              : null,
          onChanged: (val) {
            setState(() {
              _loanPurposeController.text = val ?? '';
            });
          },
          validator: (v) => v == null || v.isEmpty ? 'Required' : null,
        ),
      ],
    );
  }

  Widget _buildTypeSpecificFields() {
    switch (_selectedLoanType) {
      case 'Grow Online Business Loan':
        return Column(
          children: [
            TextFormField(
              controller: _onlineStoreController,
              decoration: const InputDecoration(labelText: 'Store URL'),
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            TextFormField(
              controller: _onlinePlatformController,
              decoration:
                  const InputDecoration(labelText: 'Selling platform / app'),
            ),
            TextFormField(
              controller: _averageRevenueController,
              decoration: const InputDecoration(
                labelText: 'Average monthly revenue (last 3 months)',
              ),
              keyboardType: TextInputType.number,
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            TextFormField(
              controller: _productCategoryController,
              decoration:
                  const InputDecoration(labelText: 'Main product category'),
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
          ],
        );
      case 'Grow Business Loan':
        return Column(
          children: [
            TextFormField(
              controller: _businessNameController,
              decoration:
                  const InputDecoration(labelText: 'Business name / location'),
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            TextFormField(
              controller: _businessAddressController,
              decoration: const InputDecoration(labelText: 'Business address'),
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            TextFormField(
              controller: _businessTypeController,
              decoration: const InputDecoration(labelText: 'Business type'),
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            TextFormField(
              controller: _businessRegController,
              decoration:
                  const InputDecoration(labelText: 'Business registration'),
            ),
            TextFormField(
              controller: _monthlySalesController,
              decoration:
                  const InputDecoration(labelText: 'Monthly sales amount'),
              keyboardType: TextInputType.number,
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
          ],
        );
      case 'Grow Personal Loan':
        return Column(
          children: [
            TextFormField(
              controller: _employmentStatusController,
              decoration:
                  const InputDecoration(labelText: 'Employment status'),
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            TextFormField(
              controller: _employerController,
              decoration: const InputDecoration(labelText: 'Employer'),
            ),
            TextFormField(
              controller: _guarantorNameController,
              decoration: const InputDecoration(labelText: 'Guarantor name'),
            ),
            TextFormField(
              controller: _guarantorContactController,
              decoration:
                  const InputDecoration(labelText: 'Guarantor contact number'),
            ),
          ],
        );
      case 'Grow Team Loan':
        return Column(
          children: [
            TextFormField(
              controller: _teamNameController,
              decoration: const InputDecoration(labelText: 'Team / group name'),
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            TextFormField(
              controller: _teamSizeController,
              decoration:
                  const InputDecoration(labelText: 'Number of members'),
              keyboardType: TextInputType.number,
              validator: (v) => v == null || v.isEmpty ? 'Required' : null,
            ),
            TextFormField(
              controller: _meetingLocationController,
              decoration:
                  const InputDecoration(labelText: 'Meeting location / time'),
            ),
          ],
        );
      default:
        return const SizedBox.shrink();
    }
  }

  Widget _buildDocuments() {
    final docs = requiredDocuments(_selectedLoanType);
    return Column(
      children: [
        const Align(
          alignment: Alignment.centerLeft,
          child: Text('Optional document uploads'),
        ),
        const SizedBox(height: 12),
        Align(
          alignment: Alignment.centerLeft,
          child: OutlinedButton.icon(
            icon: const Icon(Icons.skip_next),
            label: const Text('Skip documents for now'),
            onPressed: () {
              setState(() {
                _skipDocumentsForNow = true;
                _skippedDocuments.addAll(docs);
                _documentUploadWarnings.clear();
              });
            },
          ),
        ),
        const SizedBox(height: 8),
        ...docs.map(
          (doc) {
            final selectedFile = _documents[doc];
            final warning = _documentUploadWarnings[doc];
            final uploaded = _uploadedDocumentIds.containsKey(doc);
            final skipped =
                _skipDocumentsForNow || _skippedDocuments.contains(doc);
            return Card(
              child: ListTile(
                title: Text(documentsLabels[doc] ?? doc),
                subtitle: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(selectedFile?.name ??
                        (skipped ? 'Skipped for now' : 'No file selected')),
                    if (uploaded)
                      const Text(
                        'Uploaded',
                        style: TextStyle(color: Colors.green),
                      ),
                    if (warning != null)
                      Text(
                        warning,
                        style: TextStyle(
                          color: Theme.of(context).colorScheme.error,
                        ),
                      ),
                  ],
                ),
                trailing: Wrap(
                  spacing: 8,
                  children: [
                    if (warning != null)
                      TextButton(
                        onPressed: () {
                          setState(() {
                            _documentUploadWarnings.remove(doc);
                            _skippedDocuments.add(doc);
                          });
                        },
                        child: const Text('Skip'),
                      ),
                    TextButton.icon(
                      icon: const Icon(Icons.upload_file),
                      label: Text(warning == null ? 'Upload' : 'Retry'),
                      onPressed: () => _pickDocument(doc),
                    ),
                  ],
                ),
              ),
            );
          },
        ),
      ],
    );
  }

  Widget _buildReview() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        _buildSummaryRow('Loan Type', _selectedLoanType),
        _buildSummaryRow('Full Name', _fullNameController.text),
        _buildSummaryRow('NIC', _nicController.text),
        _buildSummaryRow('Mobile', _mobileController.text),
        _buildSummaryRow('Email', _emailController.text),
        _buildSummaryRow(
            'Address',
            '${_address1Controller.text}, ${_address2Controller.text}, ${_cityController.text}, ${_districtController.text}, ${_provinceController.text}'),
        _buildSummaryRow(
            'DOB', _dateOfBirth?.toString().split(' ').first ?? 'Not set'),
        _buildSummaryRow(
          'Monthly Income',
          formatCurrency(_monthlyIncomeController.text),
        ),
        _buildSummaryRow(
          'Monthly Expenses',
          formatCurrency(_monthlyExpensesController.text),
        ),
        _buildSummaryRow(
          'Applied Amount',
          formatCurrency(_appliedAmountController.text),
        ),
        _buildSummaryRow('Tenure (months)', _tenureController.text),
        _buildSummaryRow('Loan Purpose', _loanPurposeController.text),
        if (_selectedLoanType == 'Grow Online Business Loan') ...[
          _buildSummaryRow('Store URL', _onlineStoreController.text),
          _buildSummaryRow(
              'Average monthly revenue',
              formatCurrency(_averageRevenueController.text)),
          _buildSummaryRow(
              'Main product category', _productCategoryController.text),
        ],
        const SizedBox(height: 12),
        Row(
          children: [
            ElevatedButton(
              onPressed: _saving ? null : () => _handleSubmit(draft: true),
              child: _saving
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Save as Draft'),
            ),
            const SizedBox(width: 12),
            ElevatedButton.icon(
              onPressed: _saving ? null : () => _handleSubmit(draft: false),
              icon: const Icon(Icons.check),
              label: _saving
                  ? const SizedBox(
                      width: 16,
                      height: 16,
                      child: CircularProgressIndicator(strokeWidth: 2),
                    )
                  : const Text('Submit Application'),
            ),
          ],
        ),
      ],
    );
  }

  Widget _buildSummaryRow(String title, String value) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 4),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(title, style: const TextStyle(fontWeight: FontWeight.w600)),
          Flexible(child: Text(value, textAlign: TextAlign.right)),
        ],
      ),
    );
  }

  void _handleContinue() {
    if (_currentStep < 5) {
      setState(() => _currentStep += 1);
    }
  }

  void _handleBack() {
    if (_currentStep > 0) {
      setState(() => _currentStep -= 1);
    }
  }

  Future<void> _pickDob() async {
    final now = DateTime.now();
    final picked = await showDatePicker(
      context: context,
      initialDate: _dateOfBirth ?? DateTime(now.year - 18, now.month, now.day),
      firstDate: DateTime(1950),
      lastDate: DateTime(now.year - 16, now.month, now.day),
    );
    if (picked != null) {
      setState(() => _dateOfBirth = picked);
    }
  }

  Future<void> _pickDocument(String type) async {
    final result = await FilePicker.platform
        .pickFiles(type: FileType.any, withData: true);
    if (result != null && result.files.isNotEmpty) {
      setState(() {
        _documents[type] = result.files.first;
        _documentUploadWarnings.remove(type);
        _skippedDocuments.remove(type);
        _skipDocumentsForNow = false;
      });
    }
  }

  Map<String, dynamic> _buildPayload({bool draft = true}) {
    final appliedAmount =
        double.tryParse(_appliedAmountController.text.trim()) ?? 0;
    final tenureMonths = int.tryParse(_tenureController.text.trim()) ?? 0;
    final monthlyIncome =
        double.tryParse(_monthlyIncomeController.text.trim()) ?? 0;
    final monthlyExpenses =
        double.tryParse(_monthlyExpensesController.text.trim()) ?? 0;

    final loanType = _mapLoanTypeToApi(_selectedLoanType.trim());
    // Use the default option if the UI loan type could not be mapped.
    final normalizedLoanType =
        loanType.isEmpty ? _mapLoanTypeToApi(loanTypes.first) : loanType;

    final applicantDetails = {
      'full_name': _fullNameController.text.trim(),
      'nic_number': _nicController.text.trim(),
      'mobile_number': _mobileController.text.trim(),
      'email': _emailController.text.trim(),
      'address_line1': _address1Controller.text.trim(),
      'address_line2': _address2Controller.text.trim(),
      'city': _cityController.text.trim(),
      'district': _districtController.text.trim(),
      'province': _provinceController.text.trim(),
      'postal_code': _postalCodeController.text.trim(),
      'date_of_birth':
          _dateOfBirth != null ? _dobFormatter.format(_dateOfBirth!) : null,
      'monthly_income': monthlyIncome,
      'monthly_expenses': monthlyExpenses,
      'has_existing_loans': _hasExistingLoans,
      'existing_loans_description': _existingLoansController.text,
      'existing_loans': _existingLoans,
    };

    final loanDetails = {
      'applied_amount': appliedAmount,
      'tenure_months': tenureMonths,
      'loan_purpose': _loanPurposeController.text,
    };

    final typeSpecific = {
      'store_platform': 'WEB',
      ..._buildTypeSpecificMap(),
    };

    return {
      'loan_type': normalizedLoanType,
      if (_selectedCustomerId != null) 'customer_id': _selectedCustomerId,
      'loan_purpose': _loanPurposeController.text,
      'status': draft ? 'DRAFT' : 'SUBMITTED',
      // Flattened fields expected by the API
      ...applicantDetails,
      ...loanDetails,
      // Make type-specific data available in both flattened and nested forms
      ...typeSpecific,
      // Nested fields retained for compatibility with existing list/detail views
      'applicant_details': applicantDetails,
      'loan_details': loanDetails,
      'type_specific': typeSpecific,
    };
  }

  String _mapLoanTypeToApi(String uiValue) {
    switch (uiValue) {
      case 'Grow Online Business Loan':
        return 'GROW_ONLINE_BUSINESS';
      case 'Grow Business Loan':
        return 'GROW_BUSINESS';
      case 'Grow Personal Loan':
        return 'GROW_PERSONAL';
      case 'Grow Team Loan':
        return 'GROW_TEAM';
      default:
        return '';
    }
  }

  String _mapApiLoanTypeToUi(String apiValue) {
    switch (apiValue) {
      case 'GROW_ONLINE_BUSINESS':
      case 'ONLINE_BUSINESS_LOAN':
      case 'ONLINE_BUSINESS':
        return 'Grow Online Business Loan';
      case 'GROW_BUSINESS':
      case 'BUSINESS_LOAN':
      case 'BUSINESS':
        return 'Grow Business Loan';
      case 'GROW_PERSONAL':
      case 'PERSONAL_LOAN':
      case 'PERSONAL':
        return 'Grow Personal Loan';
      case 'GROW_TEAM':
      case 'TEAM_LOAN':
      case 'TEAM':
        return 'Grow Team Loan';
      default:
        return apiValue;
    }
  }

  Map<String, dynamic> _buildTypeSpecificMap() {
    switch (_selectedLoanType) {
      case 'Grow Online Business Loan':
        return {
          'online_store_name': _onlineStoreController.text,
          'online_store_link': _onlineStoreController.text,
          'platform': _onlinePlatformController.text,
          'average_monthly_revenue_last_3_months':
              double.tryParse(_averageRevenueController.text.trim()) ?? 0,
          'main_product_category': _productCategoryController.text,
        };
      case 'Grow Business Loan':
        return {
          'business_name': _businessNameController.text,
          'business_address': _businessAddressController.text,
          'business_registration': _businessRegController.text,
          'business_reg_number': _businessRegController.text,
          'business_type': _businessTypeController.text,
          'monthly_sales':
              double.tryParse(_monthlySalesController.text.trim()) ?? 0,
        };
      case 'Grow Personal Loan':
        return {
          'employment_type': _employmentStatusController.text,
          'employer_name': _employerController.text,
          'net_monthly_salary':
              double.tryParse(_monthlyIncomeController.text) ?? 0,
          'guarantor_name': _guarantorNameController.text,
          'guarantor_nic': _nicController.text,
          'guarantor_mobile': _guarantorContactController.text,
          'guarantor_relationship': _guarantorNameController.text,
        };
      case 'Grow Team Loan':
        return {
          'group_name': _teamNameController.text,
          'number_of_members': int.tryParse(_teamSizeController.text) ?? 0,
          'team_leader_name': _fullNameController.text,
          'team_leader_nic': _nicController.text,
          'team_leader_mobile': _mobileController.text,
          'group_business_activity': _meetingLocationController.text,
        };
      default:
        return {};
    }
  }

  Future<void> _handleSubmit({required bool draft}) async {
    if (!_formKey.currentState!.validate()) {
      setState(() => _currentStep = 0);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please fill all required fields.')),
      );
      return;
    }
    if (_dateOfBirth == null) {
      setState(() => _currentStep = 1);
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please select your date of birth.')),
      );
      return;
    }
    setState(() => _saving = true);
    try {
      final payload = _buildPayload(draft: draft);
      LoanApplication application;
      if (_applicationId == null) {
        application = await widget.service.createDraft(payload);
        _applicationId = application.id;
      } else {
        application =
            await widget.service.updateDraft(_applicationId!, payload);
      }

      await _uploadDocumentsIfNeeded();
      final hasUploadWarnings = _documentUploadWarnings.isNotEmpty;

      if (!draft) {
        await widget.service.submit(_applicationId!);
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: hasUploadWarnings && draft
                ? Theme.of(context).colorScheme.secondary
                : null,
            content: Text(hasUploadWarnings && draft
                ? 'Draft saved. Some optional document uploads failed; retry or skip them.'
                : draft
                    ? 'Draft saved successfully'
                    : 'Application submitted'),
          ),
        );
        if (!(draft && hasUploadWarnings)) {
          Navigator.of(context).pop(application);
        }
      }
    } on LoanApplicationValidationException catch (e) {
      if (mounted) {
        final summary = e.errors.isNotEmpty
            ? 'Cannot submit: ${e.errors.join(', ')}'
            : 'Cannot submit: ${e.message}';
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: Theme.of(context).colorScheme.error,
            content: Text(summary),
          ),
        );
      }
    } on ApiException catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            backgroundColor: Theme.of(context).colorScheme.error,
            content: Text(e.message),
          ),
        );
      }
    } catch (e) {
      if (mounted) {
        ScaffoldMessenger.of(context)
            .showSnackBar(SnackBar(content: Text('Error: $e')));
      }
    } finally {
      if (mounted) {
        setState(() => _saving = false);
      }
    }
  }

  Future<void> _uploadDocumentsIfNeeded() async {
    if (_applicationId == null) return;
    for (final entry in _documents.entries) {
      final file = entry.value;
      if (file == null ||
          _skipDocumentsForNow ||
          _skippedDocuments.contains(entry.key)) {
        continue;
      }

      final documentType = _mapDocumentTypeToApi(entry.key);
      try {
        final response = await widget.service.uploadDocument(
          _applicationId!,
          documentType,
          filePath: file.path,
          bytes: file.bytes,
          fileName: file.name,
        );
        final uploadedId = _extractUploadedDocumentId(response);
        setState(() {
          if (uploadedId != null) {
            _uploadedDocumentIds[entry.key] = uploadedId;
          }
          _documentUploadWarnings.remove(entry.key);
          _skippedDocuments.remove(entry.key);
        });
      } catch (e) {
        setState(() {
          _uploadedDocumentIds.remove(entry.key);
          _documentUploadWarnings[entry.key] =
              'Upload failed. You can retry or skip this optional document.';
        });
      }
    }
  }

  String? _extractUploadedDocumentId(Map<String, dynamic> response) {
    final candidates = [
      response['id'],
      response['document_id'],
      response['documentId'],
      if (response['document'] is Map<String, dynamic>)
        (response['document'] as Map<String, dynamic>)['id'],
    ];
    for (final candidate in candidates) {
      final value = candidate?.toString();
      if (value != null && value.isNotEmpty) return value;
    }
    return null;
  }

  String _mapDocumentTypeToApi(String uiValue) {
    switch (uiValue) {
      case 'nic_front':
        return 'NIC_FRONT';
      case 'nic_back':
        return 'NIC_BACK';
      case 'nic_selfie':
        return 'SELFIE_NIC';
      case 'online_proof':
        return 'STORE_SCREENSHOT';
      case 'salary_slip':
        return 'SALARY_SLIP';
      case 'member_list':
        return 'MEMBER_LIST';
      case 'group_photo':
        return 'GROUP_PHOTO';
      default:
        return uiValue.toUpperCase();
    }
  }
}

const loanTypes = [
  'Grow Online Business Loan',
  'Grow Business Loan',
  'Grow Personal Loan',
  'Grow Team Loan',
];

const Map<String, List<String>> loanPurposes = {
  'Grow Online Business Loan': [
    'Inventory purchase',
    'Digital marketing',
    'Platform ads',
    'Working capital',
  ],
  'Grow Business Loan': [
    'Expand store',
    'Purchase equipment',
    'Inventory',
    'Renovation',
  ],
  'Grow Personal Loan': [
    'Education',
    'Medical',
    'Home improvement',
    'Emergency',
  ],
  'Grow Team Loan': [
    'Group business',
    'Community project',
    'Savings cycle',
  ],
};

const Map<String, String> documentsLabels = {
  'nic_front': 'NIC front',
  'nic_back': 'NIC back',
  'nic_selfie': 'Selfie with NIC',
  'online_proof': 'Online store proof',
  'business_registration': 'Business registration',
  'utility_bill': 'Utility bill',
  'salary_slip': 'Salary slip',
  'member_list': 'Member list',
  'group_photo': 'Group photo',
};

List<String> requiredDocuments(String loanType) {
  final baseDocs = ['nic_front', 'nic_back', 'nic_selfie'];
  switch (loanType) {
    case 'Grow Online Business Loan':
      return [...baseDocs, 'online_proof'];
    case 'Grow Business Loan':
      return [...baseDocs, 'business_registration', 'utility_bill'];
    case 'Grow Personal Loan':
      return [...baseDocs, 'salary_slip'];
    case 'Grow Team Loan':
      return [...baseDocs, 'member_list', 'group_photo'];
    default:
      return baseDocs;
  }
}
