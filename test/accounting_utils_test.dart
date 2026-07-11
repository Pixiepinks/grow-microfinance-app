import 'package:flutter_test/flutter_test.dart';
import 'package:grow_microfinance_app/models/accounting_models.dart';
import 'package:grow_microfinance_app/utils/accounting_math.dart';
import 'package:grow_microfinance_app/utils/currency_formatter.dart';

void main() {
  test('currency formatting uses Sri Lankan Rupees', () {
    expect(formatCurrency(15000), 'Rs. 15,000.00');
    expect(formatCurrency(null), 'Rs. 0.00');
  });
  test('journal balance calculation and minimum two lines', () {
    expect(hasBalancedJournal([JournalLineDraft(accountId: '1', debit: '45000.00'), JournalLineDraft(accountId: '2', credit: '45000.00')]), isTrue);
    expect(hasBalancedJournal([JournalLineDraft(accountId: '1', debit: '45000.00')]), isFalse);
    expect(hasBalancedJournal([JournalLineDraft(accountId: '1', debit: '10', credit: '10'), JournalLineDraft(accountId: '2', credit: '10')]), isFalse);
    expect(toCents('1,234.56'), 123456);
  });

test('accountLabel regression handles null and partial accounts', () {
  expect(accountLabel(null), 'Not selected');
  expect(accountLabel(AccountingAccount(id: '8', code: '1010', name: 'Main Bank Account', type: 'ASSET', normalBalance: 'DEBIT')), '1010 — Main Bank Account');
  expect(accountLabel(AccountingAccount(id: '8', code: '', name: '', type: 'ASSET', normalBalance: 'DEBIT')), 'ID: 8');
});

test('general ledger canonical response parsing maps summary fields', () {
  final parsed = parseGeneralLedgerResponse({
    'opening_balance': '0.00',
    'total_debit': '50000.00',
    'total_credit': '0.00',
    'closing_balance': '50000.00',
    'transactions': [
      {'customer_number': 'C-001', 'customer_name': 'Jane Doe', 'loan_number': 'LN-001', 'debit': '50000.00'}
    ],
  });
  expect(parsed['summary']['total_debit'], '50000.00');
  expect(parsed['summary']['closing_balance'], '50000.00');
  expect(parsed['transactions'].first['customer_name'], 'Jane Doe');
  expect(parsed['transactions'].first['loan_number'], 'LN-001');
  expect(() => parseGeneralLedgerResponse({'total_debit': '0.00'}), throwsFormatException);
});

test('financial summary parsing treats string booleans and zero differences safely', () {
  final parsed = parseFinancialSummaryResponse({
    'total_assets': '0.00',
    'total_liabilities': '0.00',
    'total_equity': '0.00',
    'total_income': '0.00',
    'total_expenses': '0.00',
    'net_profit_loss': '0.00',
    'trial_balance_difference': '0.00',
    'trial_balance_balanced': 'false',
    'financial_position_difference': '0.00',
    'financial_position_balanced': 'false',
    'unclassified_account_count': 0,
    'incomplete_accounting_history': 'true',
    'warnings': [{'code': 'INCOMPLETE_HISTORY'}],
  });
  expect(parsed['trial_balance_balanced'], isTrue);
  expect(parsed['financial_position_balanced'], isTrue);
  expect(parsed['incomplete_accounting_history'], isTrue);
  expect(parseAccountingBool('false'), isFalse);
  expect(() => parseFinancialSummaryResponse({'total_assets': '0.00'}), throwsFormatException);
});

test('reconciliation issue labels and ID fallback are human readable', () {
  expect(humanIssueType('MISSING_DISBURSEMENT_JOURNAL'), 'Missing Disbursement Journal');
  expect(humanIssueType('MISSING_PAYMENT_JOURNAL'), 'Missing Payment Journal');
  expect(accountingIdFallback('Customer ID: 8', 8), 'ID: 8');
  expect(accountingIdFallback('LN-001', 9), 'LN-001');
});

test('general ledger parser maps canonical summary fields and labels', () {
  final parsed = parseGeneralLedgerResponse({
    'opening_balance': '0.00',
    'total_debit': '50000.00',
    'total_credit': '0.00',
    'closing_balance': '50000.00',
    'transactions': [
      {
        'debit': '50000.00',
        'credit': '0.00',
        'running_balance': '50000.00',
        'customer_number': 'CUST001',
        'customer_name': 'Sunil Perera',
        'loan_number': 'GROW-LOAN-20260710-0003',
      }
    ],
  });
  expect(parsed['summary']['total_debit'], '50000.00');
  expect(parsed['summary']['closing_balance'], '50000.00');
});

test('general ledger parser rejects missing summary fields instead of zero defaults', () {
  expect(
    () => parseGeneralLedgerResponse({'transactions': []}),
    throwsFormatException,
  );
});

test('financial position parser preserves explicit activity and empty flags', () {
  final parsed = parseFinancialPositionResponse({
    'has_activity': true,
    'is_empty': false,
    'presentation_adjustment': 'BANK_OVERDRAFT_RECLASSIFICATION',
    'assets': [
      {'name': 'Loan Principal Receivable', 'amount': '50000.00'}
    ],
    'liabilities': [
      {'name': 'Bank Overdraft — Main Bank Account', 'amount': '50000.00'}
    ],
    'equity': [],
    'validation': {'balanced': true},
  });
  expect(parsed['has_activity'], isTrue);
  expect(parsed['is_empty'], isFalse);
  expect(parsed['presentation_adjustment'], 'BANK_OVERDRAFT_RECLASSIFICATION');
});

test('chart of accounts parser uses is_system_account', () {
  final account = AccountingAccount.fromJson({
    'id': 1,
    'code': '1100',
    'name': 'Loan Principal Receivable',
    'type': 'ASSET',
    'normal_balance': 'DEBIT',
    'is_system_account': true,
  });
  expect(account.systemAccount, isTrue);
});
}
