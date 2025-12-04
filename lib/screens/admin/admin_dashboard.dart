import 'package:flutter/material.dart';

import '../../models/loan_application.dart';
import '../../services/loan_application_service.dart';
import '../../services/admin_repository.dart';
import '../../widgets/dashboard_card.dart';
import '../customer_registration_screen.dart';
import '../customer/loan_application_detail_screen.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({
    super.key,
    required this.repository,
    required this.loanApplicationService,
  });

  final AdminRepository repository;
  final LoanApplicationService loanApplicationService;

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  Map<String, dynamic>? _data;
  List<LoanApplication> _pendingFinalApproval = [];
  bool _loading = true;
  bool _loadingApplications = true;
  String? _error;
  String? _applicationsError;

  @override
  void initState() {
    super.initState();
    _loadOverview();
    _loadApplications();
  }

  Future<void> _loadOverview() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final data = await widget.repository.fetchDashboard();
      setState(() => _data = data);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  Future<void> _loadApplications() async {
    setState(() {
      _loadingApplications = true;
      _applicationsError = null;
    });
    try {
      final apps = await widget.loanApplicationService
          .listApplications(status: 'STAFF_APPROVED');
      setState(() => _pendingFinalApproval = apps);
    } catch (e) {
      setState(() => _applicationsError = e.toString());
    } finally {
      setState(() => _loadingApplications = false);
    }
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
                Tab(text: 'Overview'),
                Tab(text: 'Applications'),
              ],
            ),
          ),
          Expanded(
            child: TabBarView(
              children: [
                _buildOverviewTab(),
                _buildApplicationsTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOverviewTab() {
    return RefreshIndicator(
      onRefresh: _loadOverview,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Admin dashboard',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
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
          if (_loading) const Center(child: CircularProgressIndicator()),
          if (_error != null)
            DashboardCard(
              title: 'Error',
              icon: Icons.error_outline,
              child: Text(_error!),
            ),
          if (!_loading && _error == null && _data != null)
            DashboardCard(
              title: 'Key metrics',
              icon: Icons.insights,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: _data!.entries
                    .map(
                      (entry) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(entry.key),
                            Text(entry.value.toString(),
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold, fontSize: 16)),
                          ],
                        ),
                      ),
                    )
                    .toList(),
              ),
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
              : _pendingFinalApproval.isEmpty
                  ? ListView(
                      children: const [
                        Padding(
                          padding: EdgeInsets.all(24),
                          child: Center(
                              child: Text(
                                  'No applications waiting for final approval.')),
                        ),
                      ],
                    )
                  : ListView.builder(
                      padding: const EdgeInsets.all(12),
                      itemCount: _pendingFinalApproval.length,
                      itemBuilder: (context, index) {
                        final app = _pendingFinalApproval[index];
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
                                        (application) => _buildAdminActions(
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

  List<Widget> _buildAdminActions(LoanApplication app) {
    return [
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          Expanded(
            child: FilledButton(
              onPressed: () async {
                try {
                  await widget.loanApplicationService.finalApprove(app.id);
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
