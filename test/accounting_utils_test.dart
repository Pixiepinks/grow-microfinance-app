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
}
