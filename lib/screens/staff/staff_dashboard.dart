import 'package:flutter/material.dart';

import '../../models/loan_application.dart';
import '../../services/loan_application_service.dart';
import '../../services/staff_repository.dart';
import '../../widgets/dashboard_card.dart';
import '../customer_registration_screen.dart';
import '../customer/loan_application_detail_screen.dart';

class StaffDashboardScreen extends StatefulWidget {
  const StaffDashboardScreen({
    super.key,
    required this.repository,
    required this.loanApplicationService,
  });

  final StaffRepository repository;
  final LoanApplicationService loanApplicationService;

  @override
  State<StaffDashboardScreen> createState() => _StaffDashboardScreenState();
}

class _StaffDashboardScreenState extends State<StaffDashboardScreen> {
  List<dynamic> _collections = [];
  List<Map<String, dynamic>> _activeLoans = [];
  List<LoanApplication> _submittedApplications = [];
  bool _loadingApplications = true;
  bool _loadingCollections = true;
  String? _error;
  String? _applicationsError;

  @override
  void initState() {
    super.initState();
    _loadCollections();
    _loadApplications();
  }

  Future<void> _loadCollections() async {
    setState(() {
      _loadingCollections = true;
      _error = null;
    });
    try {
      final data = await widget.repository.fetchTodayCollections();
      final active = await widget.repository.fetchActiveLoans();
      setState(() {
        _collections = data;
        _activeLoans = active;
      });
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() {
        _loadingCollections = false;
      });
    }
  }

  Future<void> _loadApplications() async {
    setState(() {
      _loadingApplications = true;
      _applicationsError = null;
    });
    try {
      final apps = await widget.loanApplicationService
          .listApplications(status: 'SUBMITTED');
      setState(() => _submittedApplications = apps);
    } catch (e) {
      setState(() => _applicationsError = e.toString());
    } finally {
      setState(() => _loadingApplications = false);
    }
  }

  void _showPaymentSheet({String? loanId}) {
    final loanController = TextEditingController(text: loanId);
    final amountController = TextEditingController();
    final methodController = TextEditingController();
    final noteController = TextEditingController();
    DateTime selectedDate = DateTime.now();

    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(
            bottom: MediaQuery.of(context).viewInsets.bottom + 16,
            left: 16,
            right: 16,
            top: 16,
          ),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Text('Record payment',
                  style: Theme.of(context).textTheme.titleMedium),
              const SizedBox(height: 12),
              TextField(
                controller: loanController,
                decoration: const InputDecoration(labelText: 'Loan ID'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: amountController,
                decoration: const InputDecoration(labelText: 'Amount'),
                keyboardType: TextInputType.number,
              ),
              const SizedBox(height: 12),
              Row(
                children: [
                  const Text('Date:'),
                  const SizedBox(width: 12),
                  TextButton.icon(
                    onPressed: () async {
                      final picked = await showDatePicker(
                        context: context,
                        initialDate: selectedDate,
                        firstDate: DateTime(2020),
                        lastDate: DateTime.now().add(const Duration(days: 365)),
                      );
                      if (picked != null) {
                        setState(() => selectedDate = picked);
                      }
                    },
                    icon: const Icon(Icons.calendar_today),
                    label: Text(
                      '${selectedDate.year}-${selectedDate.month.toString().padLeft(2, '0')}-${selectedDate.day.toString().padLeft(2, '0')}',
                    ),
                  ),
                ],
              ),
              const SizedBox(height: 12),
              TextField(
                controller: methodController,
                decoration: const InputDecoration(labelText: 'Payment method (optional)'),
              ),
              const SizedBox(height: 12),
              TextField(
                controller: noteController,
                decoration: const InputDecoration(labelText: 'Note (optional)'),
              ),
              const SizedBox(height: 12),
              FilledButton.icon(
                onPressed: () async {
                  Navigator.of(context).pop();
                  final amount = double.tryParse(amountController.text);
                  if (amount == null) return;
                  try {
                    await widget.repository.recordRepayment(
                      loanId: loanController.text,
                      amount: amount,
                      date: selectedDate,
                      method: methodController.text.isEmpty
                          ? null
                          : methodController.text,
                      note: noteController.text,
                    );
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Payment submitted')),
                      );
                      _loadCollections();
                    }
                  } catch (e) {
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        SnackBar(content: Text('Error submitting payment: $e')),
                      );
                    }
                  }
                },
                icon: const Icon(Icons.send),
                label: const Text('Submit payment'),
              ),
            ],
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Column(
        children: [
          Material(
            color: Theme.of(context).colorScheme.surface,
            child: TabBar(
              labelColor: Theme.of(context).colorScheme.primary,
              tabs: const [
                Tab(text: 'Collections'),
                Tab(text: 'Applications'),
              ],
            ),
          ),
          Expanded(
            child: TabBarView(
              children: [
                _buildCollectionsTab(),
                _buildApplicationsTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCollectionsTab() {
    return RefreshIndicator(
      onRefresh: _loadCollections,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text('Today\'s collections',
              style: Theme.of(context).textTheme.headlineSmall),
          const SizedBox(height: 12),
          DashboardCard(
            title: 'Customers',
            icon: Icons.person_add_alt,
            child: Align(
              alignment: Alignment.centerLeft,
              child: FilledButton.icon(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const CustomerRegistrationScreen(),
                    ),
                  );
                },
                icon: const Icon(Icons.person_add),
                label: const Text('New Customer'),
              ),
            ),
          ),
          const SizedBox(height: 12),
          if (_loadingCollections)
            const Center(child: CircularProgressIndicator()),
          if (_error != null)
            DashboardCard(
              title: 'Error',
              icon: Icons.error_outline,
              child: Text(_error!),
            ),
          if (!_loadingCollections && _error == null)
            ..._collections.map(
              (item) => DashboardCard(
                // API returns Payment rows: loan_id, amount_collected, payment_method, collection_date, remarks
                title: 'Loan ${item['loan_id']}',
                icon: Icons.currency_exchange,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Amount: ${item['amount_collected']}'),
                    const SizedBox(height: 4),
                    Text('Method: ${item['payment_method'] ?? 'Cash'}'),
                    const SizedBox(height: 4),
                    Text('Date: ${item['collection_date'] ?? ''}'),
                  ],
                ),
              ),
            ),
          const SizedBox(height: 16),
          Text('Active loans for collection',
              style: Theme.of(context).textTheme.titleMedium),
          const SizedBox(height: 8),
          if (_loadingCollections)
            const Center(child: CircularProgressIndicator()),
          if (!_loadingCollections && _activeLoans.isEmpty)
            const Center(child: Padding(
              padding: EdgeInsets.symmetric(vertical: 24),
              child: Text('No active loans for collections today.'),
            )),
          ..._activeLoans.map(
            (loan) {
              final loanId = (loan['id'] ?? loan['loan_id'] ?? '').toString();
              final customer =
                  loan['customer_name'] ?? loan['borrower_name'] ?? 'Customer';
              final outstanding = (loan['outstanding_balance'] ??
                      loan['outstanding'] ??
                      loan['balance'] ??
                      loan['remaining'] ??
                      '')
                  .toString();
              final amount = (loan['principal_amount'] ?? loan['amount'] ??
                      loan['principal'] ??
                      '')
                  .toString();
              return DashboardCard(
                title: 'Loan $loanId',
                icon: Icons.request_page,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text('Customer: $customer'),
                    const SizedBox(height: 4),
                    if (amount.isNotEmpty) Text('Amount: $amount'),
                    if (outstanding.isNotEmpty)
                      Text('Outstanding: $outstanding'),
                    const SizedBox(height: 8),
                    Align(
                      alignment: Alignment.centerLeft,
                      child: FilledButton.icon(
                        onPressed: () => _showPaymentSheet(loanId: loanId),
                        icon: const Icon(Icons.payments),
                        label: const Text('Record payment'),
                      ),
                    ),
                  ],
                ),
              );
            },
          ),
        ],
      ),
    );
  }

  Widget _buildApplicationsTab() {
    return RefreshIndicator(
      onRefresh: _loadApplications,
      child: _loadingApplications
          ? ListView(
              children: const [
                Padding(
                  padding: EdgeInsets.all(24),
                  child: Center(child: CircularProgressIndicator()),
                ),
              ],
            )
          : _applicationsError != null
              ? ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    DashboardCard(
                      title: 'Error',
                      icon: Icons.error_outline,
                      child: Text(_applicationsError!),
                    ),
                  ],
                )
              : _submittedApplications.isEmpty
                  ? ListView(
                      children: const [
                        Padding(
                          padding: EdgeInsets.all(24),
                          child:
                              Center(child: Text('No applications waiting for review.')),
                        ),
                      ],
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(12),
                      itemCount: _submittedApplications.length,
                      itemBuilder: (context, index) {
                        final app = _submittedApplications[index];
                        return Card(
                          child: ListTile(
                            title: Text(
                              app.applicationNumber.isNotEmpty
                                  ? 'Application #${app.applicationNumber}'
                                  : 'Application ${app.id}',
                              style:
                                  const TextStyle(fontWeight: FontWeight.w600),
                            ),
                            subtitle: Column(
                              crossAxisAlignment: CrossAxisAlignment.start,
                              children: [
                                Text(app.loanType),
                                Text(
                                    'Amount: ${app.appliedAmount.toStringAsFixed(2)}'),
                                Text('Tenure: ${app.tenureMonths} months'),
                                Text('Created: ${app.formattedDate}'),
                              ],
                            ),
                            trailing: Chip(label: Text(app.status)),
                            onTap: () async {
                              await Navigator.of(context).push(
                                MaterialPageRoute(
                                  builder: (_) => LoanApplicationDetailScreen(
                                    applicationId: app.id,
                                    service: widget.loanApplicationService,
                                    actionButtonsBuilder:
                                        (application) => _buildStaffActions(
                                      application,
                                    ),
                                  ),
                                ),
                              );
                              _loadApplications();
                            },
                          ),
                        );
                      },
                    ),
    );
  }

  List<Widget> _buildStaffActions(LoanApplication app) {
    return [
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          Expanded(
            child: FilledButton(
              onPressed: () async {
                try {
                  await widget.loanApplicationService.staffApprove(app.id);
                  if (mounted) {
                    Navigator.of(context).pop();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Application approved')), 
                    );
                    _loadApplications();
                  }
                } catch (e) {
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Failed to approve: $e')),
                    );
                  }
                }
              },
              child: const Text('Approve'),
            ),
          ),
          const SizedBox(width: 12),
          Expanded(
            child: OutlinedButton(
              onPressed: () async {
                final reason = await _promptReason();
                if (!mounted || reason == null) return;
                try {
                  await widget.loanApplicationService
                      .reject(app.id, reason: reason);
                  if (mounted) {
                    Navigator.of(context).pop();
                    ScaffoldMessenger.of(context).showSnackBar(
                      const SnackBar(content: Text('Application rejected')),
                    );
                    _loadApplications();
                  }
                } catch (e) {
                  if (mounted) {
                    ScaffoldMessenger.of(context).showSnackBar(
                      SnackBar(content: Text('Failed to reject: $e')),
                    );
                  }
                }
              },
              child: const Text('Reject'),
            ),
          ),
        ],
      ),
    ];
  }

  Future<String?> _promptReason() async {
    final controller = TextEditingController();
    return showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Rejection reason'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(
            hintText: 'Optional reason',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(null),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(controller.text),
            child: const Text('Submit'),
          ),
        ],
      ),
    );
  }
}
