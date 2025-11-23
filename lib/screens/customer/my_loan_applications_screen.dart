import 'package:flutter/material.dart';

import '../../models/loan_application.dart';
import '../../services/loan_application_service.dart';
import 'loan_application_detail_screen.dart';
import 'loan_application_form_screen.dart';

class MyLoanApplicationsScreen extends StatefulWidget {
  const MyLoanApplicationsScreen({super.key, required this.service});

  final LoanApplicationService service;

  @override
  State<MyLoanApplicationsScreen> createState() =>
      _MyLoanApplicationsScreenState();
}

class _MyLoanApplicationsScreenState extends State<MyLoanApplicationsScreen> {
  List<LoanApplication> _applications = [];
  bool _loading = false;
  String? _error;

  @override
  void initState() {
    super.initState();
    _load();
  }

  Future<void> _load() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final apps = await widget.service.listMyApplications();
      setState(() => _applications = apps);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(title: const Text('My Loan Applications')),
      floatingActionButton: FloatingActionButton(
        onPressed: () async {
          final created = await Navigator.of(context).push(
            MaterialPageRoute(
              builder: (_) => LoanApplicationFormScreen(service: widget.service),
            ),
          );
          if (created != null) {
            _load();
          }
        },
        child: const Icon(Icons.add),
      ),
      body: RefreshIndicator(
        onRefresh: _load,
        child: _loading
            ? const Center(child: CircularProgressIndicator())
            : _error != null
                ? Center(child: Text(_error!))
                : _applications.isEmpty
                    ? const Center(child: Text('No applications yet.'))
                    : ListView.builder(
                        padding: const EdgeInsets.all(12),
                        itemCount: _applications.length,
                        itemBuilder: (context, index) {
                          final app = _applications[index];
                          return Card(
                            child: ListTile(
                              title: Text(
                                  app.applicationNumber.isNotEmpty
                                      ? 'Application #${app.applicationNumber}'
                                      : 'Application ${app.id}',
                                  style: const TextStyle(
                                      fontWeight: FontWeight.w600)),
                              subtitle: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Text(app.loanType),
                                  const SizedBox(height: 4),
                                  Text('Amount: ${app.appliedAmount.toStringAsFixed(2)}'),
                                  Text('Created: ${app.formattedDate}'),
                                ],
                              ),
                              trailing: Chip(label: Text(app.status)),
                              onTap: () async {
                                await Navigator.of(context).push(
                                  MaterialPageRoute(
                                    builder: (_) => LoanApplicationDetailScreen(
                                      applicationId: app.id,
                                      service: widget.service,
                                    ),
                                  ),
                                );
                                _load();
                              },
                            ),
                          );
                        },
                      ),
      ),
    );
  }
}
