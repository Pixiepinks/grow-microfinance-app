import 'package:flutter/material.dart';

import '../../models/loan_application.dart';
import '../../services/loan_application_service.dart';
import 'loan_application_form_screen.dart';

class LoanApplicationDetailScreen extends StatefulWidget {
  const LoanApplicationDetailScreen({
    super.key,
    required this.applicationId,
    required this.service,
  });

  final String applicationId;
  final LoanApplicationService service;

  @override
  State<LoanApplicationDetailScreen> createState() =>
      _LoanApplicationDetailScreenState();
}

class _LoanApplicationDetailScreenState
    extends State<LoanApplicationDetailScreen> {
  LoanApplication? _application;
  bool _loading = true;
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
      final app = await widget.service.getById(widget.applicationId);
      setState(() => _application = app);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final app = _application;
    return Scaffold(
      appBar: AppBar(
        title: const Text('Application Details'),
        actions: [
          if (app != null && app.status.toUpperCase() == 'DRAFT')
            TextButton.icon(
              onPressed: () async {
                final updated = await Navigator.of(context).push(
                  MaterialPageRoute(
                    builder: (_) => LoanApplicationFormScreen(
                      service: widget.service,
                      existing: app,
                    ),
                  ),
                );
                if (updated != null) {
                  _load();
                }
              },
              icon: const Icon(Icons.edit, color: Colors.white),
              label: const Text('Edit', style: TextStyle(color: Colors.white)),
            )
        ],
      ),
      body: _loading
          ? const Center(child: CircularProgressIndicator())
          : _error != null
              ? Center(child: Text(_error!))
              : app == null
                  ? const Center(child: Text('Application not found'))
                  : RefreshIndicator(
                      onRefresh: _load,
                      child: ListView(
                        padding: const EdgeInsets.all(16),
                        children: [
                          _buildHeader(app),
                          const SizedBox(height: 12),
                          _buildSection('Applicant Details',
                              _formatMap(app.applicantDetails)),
                          _buildSection(
                              'Loan Details', _formatMap(app.loanDetails)),
                          _buildSection(
                              'Type Specific', _formatMap(app.typeSpecific)),
                          _buildSection('Documents',
                              _formatMap(app.documents, emptyValue: 'Not uploaded')),
                        ],
                      ),
                    ),
    );
  }

  Widget _buildHeader(LoanApplication app) {
    return Card(
      child: ListTile(
        title: Text(
          app.applicationNumber.isNotEmpty
              ? 'Application #${app.applicationNumber}'
              : 'Application ${app.id}',
          style: const TextStyle(fontWeight: FontWeight.bold),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(app.loanType),
            Text('Amount: ${app.appliedAmount.toStringAsFixed(2)}'),
            Text('Tenure: ${app.tenureMonths} months'),
            Text('Purpose: ${app.loanPurpose}'),
            Text('Created: ${app.formattedDate}'),
          ],
        ),
        trailing: Chip(label: Text(app.status)),
      ),
    );
  }

  Widget _buildSection(String title, List<Widget> children) {
    return Card(
      child: Padding(
        padding: const EdgeInsets.all(12),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(title,
                style:
                    const TextStyle(fontSize: 16, fontWeight: FontWeight.w700)),
            const SizedBox(height: 8),
            ...children,
          ],
        ),
      ),
    );
  }

  List<Widget> _formatMap(Map<String, dynamic> data, {String emptyValue = ''}) {
    if (data.isEmpty) {
      return [Text(emptyValue.isEmpty ? 'No data' : emptyValue)];
    }
    return data.entries
        .map(
          (e) => Padding(
            padding: const EdgeInsets.symmetric(vertical: 4),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Text(e.key.replaceAll('_', ' '),
                    style: const TextStyle(fontWeight: FontWeight.w600)),
                Flexible(
                  child: Text(
                    e.value.toString(),
                    textAlign: TextAlign.right,
                  ),
                ),
              ],
            ),
          ),
        )
        .toList();
  }
}
