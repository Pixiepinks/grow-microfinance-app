import 'package:flutter/material.dart';

class ReportsPage extends StatelessWidget {
  const ReportsPage({super.key, required this.openLedger});
  final VoidCallback openLedger;
  @override
  Widget build(BuildContext context) {
    Widget card(String title, String subtitle, {bool enabled = true, VoidCallback? onTap}) => Card(
      child: ListTile(
        enabled: enabled,
        title: Text(title, style: const TextStyle(fontWeight: FontWeight.w700)),
        subtitle: Text(subtitle),
        trailing: enabled ? const Icon(Icons.chevron_right) : const Chip(label: Text('Upcoming')),
        onTap: enabled ? onTap : null,
      ),
    );
    return ListView(padding: const EdgeInsets.all(16), children: [
      Text('Reports', style: Theme.of(context).textTheme.headlineSmall),
      const SizedBox(height: 8),
      Text('Operational reports remain available. Financial statements are staged for later accounting phases.', style: Theme.of(context).textTheme.bodyMedium),
      card('Loan Portfolio Report', 'Portfolio balances, loan statuses, and exposure.'),
      card('Collections Report', 'Collections activity and recovery tracking.'),
      card('Delinquency Report', 'Overdue loans and ageing analysis.'),
      card('Staff Performance Report', 'Staff activity and productivity metrics.'),
      const SizedBox(height: 16),
      Text('Financial Reports', style: Theme.of(context).textTheme.titleLarge),
      card('General Ledger', 'Available under Accounting.', onTap: openLedger),
      card('Trial Balance — Phase 2', 'Coming in Phase 2.', enabled: false),
      card('Income Statement — Phase 2', 'Coming in Phase 2.', enabled: false),
      card('Statement of Financial Position — Phase 2', 'Coming in Phase 2.', enabled: false),
      card('Cash Flow Statement — Future Phase', 'Planned for a future phase.', enabled: false),
    ]);
  }
}
