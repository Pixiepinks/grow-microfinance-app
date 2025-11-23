import 'package:flutter/material.dart';

import '../../services/staff_repository.dart';
import '../../widgets/dashboard_card.dart';
import '../customer_registration_screen.dart';

class StaffDashboardScreen extends StatefulWidget {
  const StaffDashboardScreen({super.key, required this.repository});

  final StaffRepository repository;

  @override
  State<StaffDashboardScreen> createState() => _StaffDashboardScreenState();
}

class _StaffDashboardScreenState extends State<StaffDashboardScreen> {
  List<dynamic> _collections = [];
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
      final data = await widget.repository.fetchTodayCollections();
      setState(() => _collections = data);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  void _showPaymentSheet() {
    final loanController = TextEditingController();
    final amountController = TextEditingController();
    final methodController = TextEditingController();

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
              TextField(
                controller: methodController,
                decoration: const InputDecoration(labelText: 'Payment method (optional)'),
              ),
              const SizedBox(height: 12),
              FilledButton.icon(
                onPressed: () async {
                  Navigator.of(context).pop();
                  final amount = double.tryParse(amountController.text);
                  if (amount == null) return;
                  try {
                    await widget.repository.submitPayment(
                      loanId: loanController.text,
                      amount: amount,
                      method: methodController.text.isEmpty
                          ? null
                          : methodController.text,
                    );
                    if (mounted) {
                      ScaffoldMessenger.of(context).showSnackBar(
                        const SnackBar(content: Text('Payment submitted')),
                      );
                      _load();
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
    return Scaffold(
      floatingActionButton: FloatingActionButton.extended(
        onPressed: _showPaymentSheet,
        icon: const Icon(Icons.add_card),
        label: const Text('Add payment'),
      ),
      body: RefreshIndicator(
        onRefresh: _load,
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
            if (_loading) const Center(child: CircularProgressIndicator()),
            if (_error != null)
              DashboardCard(
                title: 'Error',
                icon: Icons.error_outline,
                child: Text(_error!),
              ),
            if (!_loading && _error == null)
              ..._collections.map(
                (item) => DashboardCard(
                  // API returns Payment rows: loan_id, amount_collected, payment_method, collection_date, remarks
                  title: 'Loan ${item['loan_id']}',
                  icon: Icons.person,
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
          ],
        ),
      ),
    );
  }
}
