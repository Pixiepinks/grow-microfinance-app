import 'package:intl/intl.dart';

final NumberFormat currencyFormatter = NumberFormat.currency(
  locale: 'en_LK',
  symbol: 'Rs. ',
  decimalDigits: 2,
);

String formatCurrency(Object? value) {
  if (value is num) {
    return currencyFormatter.format(value);
  }

  final rawValue = value?.toString().trim() ?? '';
  final normalizedValue = rawValue.replaceAll(',', '');
  final parsedValue = num.tryParse(normalizedValue) ?? 0;
  return currencyFormatter.format(parsedValue);
}
