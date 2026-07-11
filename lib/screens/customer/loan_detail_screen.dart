import 'package:flutter/material.dart';
import 'package:intl/intl.dart';

import '../../models/loan.dart';
import '../../models/loan_application.dart';
import '../../models/payment.dart';
import '../../services/customer_repository.dart';
import '../../utils/currency_formatter.dart';
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
          loanDays: _loan.loanDays,
          repaymentFrequency: _loan.repaymentFrequency,
          numberOfInstallments: _loan.numberOfInstallments,
          installmentAmount: _loan.installmentAmount,
          totalRepayment: _loan.totalRepayment,
          totalInterest: _loan.totalInterest,
          interestRate: _loan.interestRate,
          interestType: _loan.interestType,
          disbursementDate: _loan.disbursementDate,
          maturityDate: _loan.maturityDate,
          finalInstallmentDueDate: _loan.finalInstallmentDueDate,
          ledgerRows: _loan.ledgerRows,
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
    return Scaffold(
      appBar: AppBar(title: Text('Loan #${_loan.id}')),
      body: RefreshIndicator(
        onRefresh: _loadPayments,
        child: ListView(
          padding: const EdgeInsets.all(16),
          children: [
            DashboardCard(
              title: 'Loan Terms',
              icon: Icons.request_quote,
              child: Wrap(spacing: 24, runSpacing: 8, children: [
                Text('Principal Amount: ${formatCurrency(_loan.amount)}'),
                Text('Loan Days: ${_loan.loanDays?.toString() ?? 'Not available'}'),
                Text('Repayment Frequency: ${enumLabel(_loan.repaymentFrequency)}'),
                Text('Number of Installments: ${_loan.numberOfInstallments?.toString() ?? 'Not available'}'),
                Text('Installment Amount: ${_moneyOrNot(_loan.installmentAmount)}'),
                Text('Total Repayment: ${_moneyOrNot(_loan.totalRepayment)}'),
                Text('Total Interest: ${_moneyOrNot(_loan.totalInterest)}'),
                Text('Flat Interest Rate: ${_loan.interestRate == null ? 'Not available' : '${_loan.interestRate!.toStringAsFixed(2)}%'}'),
                Text('Interest Type: ${enumLabel(_loan.interestType)}'),
                Text('Disbursement Date: ${_loan.disbursementDate ?? 'Not available'}'),
                Text('Contractual Maturity Date: ${_loan.maturityDate ?? 'Not available'}'),
                Text('Final Installment Due Date: ${_loan.finalInstallmentDueDate ?? 'Not available'}'),
              ]),
            ),
            DashboardCard(
              title: 'Overview',
              icon: Icons.info_outline,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Text('Amount: ${formatCurrency(_loan.amount)}'),
                  const SizedBox(height: 4),
                  Text('Balance: ${formatCurrency(_loan.balance)}'),
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
            DashboardCard(
              title: 'Loan Ledger',
              icon: Icons.table_rows,
              child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                Wrap(spacing: 24, runSpacing: 8, children: [
                  Text('Principal: ${formatCurrency(_loan.amount)}'),
                  Text('Interest: ${_moneyOrNot(_loan.totalInterest)}'),
                  Text('Total Repayment: ${_moneyOrNot(_loan.totalRepayment)}'),
                  Text('Installments: ${_loan.numberOfInstallments?.toString() ?? _loan.ledgerRows.length.toString()}'),
                  Text('Installment Amount: ${_moneyOrNot(_loan.installmentAmount)}'),
                ]),
                const SizedBox(height: 8),
                SingleChildScrollView(scrollDirection: Axis.horizontal, child: DataTable(columns: const ['#','Due Date','Principal','Interest','Total Due','Paid','Outstanding','Status','Delay Days','Delay Interest'].map((h) => DataColumn(label: Text(h))).toList(), rows: _loan.ledgerRows.map((r) => DataRow(cells: [
                  DataCell(Text((r['installment_number'] ?? r['number'] ?? '').toString())),
                  DataCell(Text((r['due_date'] ?? '').toString())),
                  DataCell(Text(formatCurrency(r['principal']))),
                  DataCell(Text(formatCurrency(r['interest']))),
                  DataCell(Text(formatCurrency(r['total_due']))),
                  DataCell(Text(formatCurrency(r['paid_amount']))),
                  DataCell(Text(formatCurrency(r['outstanding_amount']))),
                  DataCell(Text((r['status'] ?? '').toString())),
                  DataCell(Text((r['delay_days'] ?? '0').toString())),
                  DataCell(Text(formatCurrency(r['delay_interest']))),
                ])).toList())),
              ]),
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
                              title: Text(formatCurrency(p.amount)),
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

String _moneyOrNot(Object? value) => value == null ? 'Not available' : formatCurrency(value);