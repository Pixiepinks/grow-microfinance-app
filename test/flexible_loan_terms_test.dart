import 'package:flutter_test/flutter_test.dart';
import 'package:grow_microfinance_app/models/loan.dart';
import 'package:grow_microfinance_app/models/loan_application.dart';
import 'package:grow_microfinance_app/utils/currency_formatter.dart';

void main() {
  test('flexible approval terms calculate repayment without deriving installments from days', () {
    final approvedCents = 1500000;
    final installmentCents = 240000;
    final installments = 8;
    final totalRepaymentCents = installmentCents * installments;
    final totalInterestCents = totalRepaymentCents - approvedCents;
    final rate = totalInterestCents / approvedCents * 100;

    expect(totalRepaymentCents / 100, 19200);
    expect(totalInterestCents / 100, 4200);
    expect(rate.toStringAsFixed(2), '28.00');
    expect(installments, 8);
  });

  test('approval payload contains all flexible loan term fields', () {
    final payload = {
      'approved_amount': 15000,
      'loan_days': 63,
      'repayment_frequency': 'WEEKLY',
      'number_of_installments': 8,
      'installment_amount': 2400,
      'interest_type': 'FLAT',
    };

    expect(payload.keys, containsAll(['approved_amount', 'loan_days', 'repayment_frequency', 'number_of_installments', 'installment_amount', 'interest_type']));
  });

  test('loan application parses numeric strings and legacy nulls safely', () {
    final app = LoanApplication.fromJson({
      'id': 1,
      'applied_amount': '15000.00',
      'approved_amount': '15000.00',
      'loan_days': '63',
      'repayment_frequency': 'WEEKLY',
      'number_of_installments': '8',
      'installment_amount': '2400.00',
      'total_repayment': '19200.00',
      'total_interest': '4200.00',
      'interest_rate': '28.00',
      'interest_type': 'FLAT',
    });

    expect(app.approvedAmount, 15000);
    expect(app.loanDays, 63);
    expect(app.numberOfInstallments, 8);
    expect(app.hasCompleteApprovedTerms, isTrue);

    final legacy = LoanApplication.fromJson({'id': 2});
    expect(legacy.approvedAmount, isNull);
    expect(legacy.hasCompleteApprovedTerms, isFalse);
  });

  test('loan details format rupee currency and preserve exact API ledger rows', () {
    final loan = Loan.fromJson({
      'id': 'L1',
      'principal_amount': '15000',
      'total_interest': '4200',
      'total_repayment': '19200',
      'number_of_installments': 8,
      'installment_amount': 2400,
      'ledger': List.generate(8, (i) => {'installment_number': i + 1, 'total_due': 2400}),
    });

    expect(formatCurrency(loan.amount), 'Rs. 15,000.00');
    expect(formatCurrency(loan.installmentAmount), 'Rs. 2,400.00');
    expect(loan.ledgerRows, hasLength(8));
  });
}
