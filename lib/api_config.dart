import 'package:flutter/foundation.dart';

class ApiConfig {
  // Use the same base URL for now; later I can change web/mobile separately if needed.
  static const String _baseUrl = 'https://grow-microfinance-api-production.up.railway.app';

  static String get baseUrl => _baseUrl;
}
