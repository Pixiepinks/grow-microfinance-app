import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../models/loan.dart';
import '../../models/payment.dart';
import '../../services/customer_repository.dart';
import '../../widgets/dashboard_card.dart';

class LoanDetailScreen extends StatefulWidget {
  const LoanDetailScreen({super.key, required this.repository, required this.loan});

  final CustomerRepository repository;
  final Loan loan;

  @override
  State<LoanDetailScreen> createState() => _LoanDetailScreenState();
}

class _LoanDetailScreenState extends State<LoanDetailScreen> {
  late Loan _loan;
  bool _loadingPayments = true;
  String? _error;

  @override
  void initState() {
    super.initState();
    _loan = widget.loan;
    _loadPayments();
  }

  Future<void> _loadPayments() async {
    setState(() {
      _loadingPayments = true;
      _error = null;
    });
    try {
      final payments = await widget.repository.fetchLoanPayments(_loan.id);
      setState(() {
        _loan = Loan(
          id: _loan.id,
          amount: _loan.amount,
          balance: _loan.balance,
          status: _loan.status,
          payments: payments,
        );
      });
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loadingPayments = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final formatter = NumberFormat.currency(symbol: '\$');
    return Scaffold(
      appBar: AppBar(title: Text('Loan #${_loan.id}')),
      body: RefreshIndicator(
        onRefresh: _loadPayments,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            DashboardCard(
              title: 'Overview',
              icon: Icons.info_outline,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Amount: ${formatter.format(_loan.amount)}'),
                  const SizedBox(height: 4),
                  Text('Balance: ${formatter.format(_loan.balance)}'),
                  const SizedBox(height: 4),
                  Chip(label: Text(_loan.status)),
                ],
              ),
            ),
            if (_loadingPayments)
              const Center(
                child: Padding(
                  padding: EdgeInsets.all(16.0),
                  child: CircularProgressIndicator(),
                ),
              ),
            if (_error != null)
              DashboardCard(
                title: 'Payments',
                icon: Icons.error_outline,
                child: Text(_error!),
              ),
            if (!_loadingPayments && _error == null)
              DashboardCard(
                title: 'Payment history',
                icon: Icons.history,
                child: Column(
                  children: _loan.payments.isEmpty
                      ? [const Text('No payments yet.')]
                      : _loan.payments
                          .map(
                            (p) => ListTile(
                              contentPadding: EdgeInsets.zero,
                              leading: const Icon(Icons.payments_outlined),
                              title: Text(formatter.format(p.amount)),
                              subtitle: Text(DateFormat.yMMMd().format(p.date)),
                              trailing: Text(p.method),
                            ),
                          )
                          .toList(),
                ),
              ),
          ],
        ),
      ),
    );
  }
}
