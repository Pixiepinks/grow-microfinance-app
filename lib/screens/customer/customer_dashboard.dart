import 'package:flutter/material.dart';

import '../../models/loan.dart';
import '../../models/user_profile.dart';
import '../../services/customer_repository.dart';
import '../../widgets/dashboard_card.dart';
import 'loan_detail_screen.dart';

class CustomerDashboardScreen extends StatefulWidget {
  const CustomerDashboardScreen({super.key, required this.repository});

  final CustomerRepository repository;

  @override
  State<CustomerDashboardScreen> createState() => _CustomerDashboardScreenState();
}

class _CustomerDashboardScreenState extends State<CustomerDashboardScreen> {
  UserProfile? _profile;
  List<Loan> _loans = [];
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
      final profile = await widget.repository.fetchProfile();
      final loans = await widget.repository.fetchLoans();
      setState(() {
        _profile = profile;
        _loans = loans;
      });
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return RefreshIndicator(
      onRefresh: _load,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text('Welcome back',
                  style: Theme.of(context).textTheme.headlineSmall),
              if (_profile != null)
                CircleAvatar(
                  child: Text(_profile!.name.isNotEmpty
                      ? _profile!.name.characters.first
                      : '?'),
                ),
            ],
          ),
          const SizedBox(height: 12),
          if (_loading) const Center(child: CircularProgressIndicator()),
          if (_error != null)
            DashboardCard(
              title: 'Error',
              icon: Icons.error_outline,
              child: Text(_error!),
            ),
          if (_profile != null)
            DashboardCard(
              title: 'Profile',
              icon: Icons.person,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text(_profile!.name, style: const TextStyle(fontSize: 16)),
                  const SizedBox(height: 4),
                  Text(_profile!.email),
                  const SizedBox(height: 4),
                  Chip(label: Text(_profile!.role.toUpperCase())),
                ],
              ),
            ),
          if (_loans.isNotEmpty)
            ..._loans.map(
              (loan) => GestureDetector(
                onTap: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => LoanDetailScreen(
                        repository: widget.repository,
                        loan: loan,
                      ),
                    ),
                  );
                },
                child: DashboardCard(
                  title: 'Loan #${loan.id}',
                  icon: Icons.account_balance,
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text('Amount: ${loan.amount.toStringAsFixed(2)}'),
                      const SizedBox(height: 4),
                      Text('Balance: ${loan.balance.toStringAsFixed(2)}'),
                      const SizedBox(height: 4),
                      Chip(label: Text(loan.status)),
                    ],
                  ),
                ),
              ),
            ),
          if (!_loading && _loans.isEmpty)
            DashboardCard(
              title: 'Loans',
              icon: Icons.assignment,
              child: const Text('No loans found.'),
            ),
        ],
      ),
    );
  }
}
