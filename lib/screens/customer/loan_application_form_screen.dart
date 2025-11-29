import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';

import '../../models/loan_application.dart';
import '../../services/loan_application_service.dart';

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
  String _selectedLoanType = loanTypes.first;
  DateTime? _dateOfBirth;
  String? _applicationId;

  final TextEditingController _fullNameController = TextEditingController();
  final TextEditingController _nicController = TextEditingController();
  final TextEditingController _mobileController = TextEditingController();
  final TextEditingController _emailController = TextEditingController();
  final TextEditingController _address1Controller = TextEditingController();
  final TextEditingController _address2Controller = TextEditingController();
  final TextEditingController _cityController = TextEditingController();
  final TextEditingController _districtController = TextEditingController();
  final TextEditingController _provinceController = TextEditingController();
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
  final TextEditingController _businessNameController = TextEditingController();
  final TextEditingController _businessRegController = TextEditingController();
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
        ? existing.loanType
        : _selectedLoanType;
    final applicant = existing.applicantDetails;
    _fullNameController.text = applicant['full_name'] ?? '';
    _nicController.text = applicant['nic'] ?? '';
    _mobileController.text = applicant['mobile'] ?? '';
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
        applicant['monthly_income']?.toString() ?? '';
    _monthlyExpensesController.text =
        applicant['monthly_expenses']?.toString() ?? '';
    _hasExistingLoans = applicant['has_existing_loans'] ?? false;
    _existingLoansController.text =
        applicant['existing_loans_description'] ?? '';

    final loanDetails = existing.loanDetails;
    _appliedAmountController.text =
        loanDetails['applied_amount']?.toString() ??
            existing.appliedAmount.toString();
    _tenureController.text =
        (loanDetails['tenure_months'] ?? existing.tenureMonths).toString();
    _loanPurposeController.text =
        loanDetails['loan_purpose'] ?? existing.loanPurpose;

    final typeSpecific = existing.typeSpecific;
    _onlineStoreController.text = typeSpecific['store_url'] ?? '';
    _onlinePlatformController.text = typeSpecific['store_platform'] ?? '';
    _businessNameController.text = typeSpecific['business_name'] ?? '';
    _businessRegController.text = typeSpecific['business_registration'] ?? '';
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
    _monthlyIncomeController.dispose();
    _monthlyExpensesController.dispose();
    _existingLoansController.dispose();
    _appliedAmountController.dispose();
    _tenureController.dispose();
    _loanPurposeController.dispose();
    _onlineStoreController.dispose();
    _onlinePlatformController.dispose();
    _businessNameController.dispose();
    _businessRegController.dispose();
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
                  onPressed: details.onStepContinue,
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

  Widget _buildApplicantDetails() {
    return Column(
      children: [
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
          title: const Text('Existing loans?'),
          value: _hasExistingLoans,
          onChanged: (val) => setState(() => _hasExistingLoans = val),
        ),
        if (_hasExistingLoans)
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
              controller: _businessRegController,
              decoration:
                  const InputDecoration(labelText: 'Business registration'),
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
          child: Text('Upload required documents'),
        ),
        const SizedBox(height: 12),
        ...docs.map(
          (doc) => Card(
            child: ListTile(
              title: Text(documentsLabels[doc] ?? doc),
              subtitle: Text(_documents[doc]?.name ?? 'No file selected'),
              trailing: TextButton.icon(
                icon: const Icon(Icons.upload_file),
                label: const Text('Upload'),
                onPressed: () => _pickDocument(doc),
              ),
            ),
          ),
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
        _buildSummaryRow('Monthly Income', _monthlyIncomeController.text),
        _buildSummaryRow('Monthly Expenses', _monthlyExpensesController.text),
        _buildSummaryRow('Applied Amount', _appliedAmountController.text),
        _buildSummaryRow('Tenure (months)', _tenureController.text),
        _buildSummaryRow('Loan Purpose', _loanPurposeController.text),
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
    final result = await FilePicker.platform.pickFiles(
      type: FileType.any,
      withData: true,
    );
    if (result != null && result.files.isNotEmpty) {
      setState(() => _documents[type] = result.files.first);
    }
  }

  Map<String, dynamic> _buildPayload({bool draft = true}) {
    return {
      'loan_type': _selectedLoanType,
      'status': draft ? 'DRAFT' : 'SUBMITTED',
      'applicant_details': {
        'full_name': _fullNameController.text,
        'nic': _nicController.text,
        'mobile': _mobileController.text,
        'email': _emailController.text,
        'address_line1': _address1Controller.text,
        'address_line2': _address2Controller.text,
        'city': _cityController.text,
        'district': _districtController.text,
        'province': _provinceController.text,
        'date_of_birth': _dateOfBirth?.toIso8601String(),
        'monthly_income': double.tryParse(_monthlyIncomeController.text) ?? 0,
        'monthly_expenses':
            double.tryParse(_monthlyExpensesController.text) ?? 0,
        'has_existing_loans': _hasExistingLoans,
        'existing_loans_description': _existingLoansController.text,
      },
      'loan_details': {
        'applied_amount': double.tryParse(_appliedAmountController.text) ?? 0,
        'tenure_months': int.tryParse(_tenureController.text) ?? 0,
        'loan_purpose': _loanPurposeController.text,
      },
      'type_specific': _buildTypeSpecificMap(),
    };
  }

  Map<String, dynamic> _buildTypeSpecificMap() {
    switch (_selectedLoanType) {
      case 'Grow Online Business Loan':
        return {
          'store_url': _onlineStoreController.text,
          'store_platform': _onlinePlatformController.text,
        };
      case 'Grow Business Loan':
        return {
          'business_name': _businessNameController.text,
          'business_registration': _businessRegController.text,
        };
      case 'Grow Personal Loan':
        return {
          'employment_status': _employmentStatusController.text,
          'employer_name': _employerController.text,
          'guarantor_name': _guarantorNameController.text,
          'guarantor_contact': _guarantorContactController.text,
        };
      case 'Grow Team Loan':
        return {
          'team_name': _teamNameController.text,
          'member_count': int.tryParse(_teamSizeController.text) ?? 0,
          'meeting_location': _meetingLocationController.text,
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
    if (!draft && !_hasAllDocuments()) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Please upload all required documents.')),
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

      if (!draft) {
        await widget.service.submit(_applicationId!);
      }

      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(draft
                ? 'Draft saved successfully'
                : 'Application submitted'),
          ),
        );
        Navigator.of(context).pop(application);
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

  bool _hasAllDocuments() {
    final requiredDocs = requiredDocuments(_selectedLoanType);
    for (final doc in requiredDocs) {
      if (_documents[doc] == null) return false;
    }
    return true;
  }

  Future<void> _uploadDocumentsIfNeeded() async {
    if (_applicationId == null) return;
    for (final entry in _documents.entries) {
      final file = entry.value;
      if (file == null) continue;
      await widget.service.uploadDocument(_applicationId!, entry.key, file);
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
