import 'package:flutter_test/flutter_test.dart';
import 'package:grow_microfinance_app/models/accounting_models.dart';

void main() {
  test('humanReferenceType renders accounting labels', () {
    expect(humanReferenceType('LOAN_DISBURSEMENT'), 'Loan Disbursement');
    expect(humanReferenceType('LOAN_PAYMENT'), 'Loan Payment');
    expect(humanReferenceType('MANUAL_JOURNAL'), 'Manual Journal');
  });

  test('journal model prefers customer and loan labels over raw ids', () {
    final journal = JournalEntry.fromJson({
      'id': 42,
      'journal_no': 'JRN-00042',
      'customer_id': 8,
      'customer_number': 'CUS-00008',
      'customer_name': 'Shamal Fernando',
      'loan_id': 7,
      'loan_number': 'GROW-LOAN-20260710-0001',
      'lines': [],
    });
    expect(journal.customerLabel, contains('CUS-00008'));
    expect(journal.customerLabel, contains('Shamal Fernando'));
    expect(journal.loanLabel, 'GROW-LOAN-20260710-0001');
  });

  test('account model exposes subtype and system flag', () {
    final account = AccountingAccount.fromJson({
      'id': 1,
      'code': '1010',
      'name': 'Main Bank Account',
      'type': 'ASSET',
      'subtype': 'BANK',
      'normal_balance': 'DEBIT',
      'system_account': true,
    });
    expect(account.label, '1010 — Main Bank Account');
    expect(account.subtype, 'BANK');
    expect(account.systemAccount, isTrue);
  });
}
