import 'dart:convert';

import 'package:flutter/services.dart';

class ApiConfig {
  static const String _configAssetPath = 'assets/api_config.json';
  static const String _defaultBaseUrl =
      'https://grow-microfinance-api-production.up.railway.app';

  static const Map<String, String> _defaultEndpoints = {
    'login': '/auth/login',
    'adminDashboard': '/admin/dashboard',
    'staffTodayCollections': '/staff/today-collections',
    'staffPayments': '/staff/payments',
    'customerProfile': '/customer/me',
    'customerLoans': '/customer/loans',
    'customerLoanPayments': '/customer/loans/{id}/payments',
    'loanApplications': '/loan-applications',
    'customers': '/customers',
  };

  static String? _baseUrl;
  static Map<String, String> _endpoints = _defaultEndpoints;

  /// Loads the shared API configuration used by both the Flutter and web
  /// frontends. Falls back to defaults if the asset cannot be read.
  static Future<void> ensureInitialized() async {
    if (_baseUrl != null) return;

    try {
      final contents = await rootBundle.loadString(_configAssetPath);
      final data = jsonDecode(contents) as Map<String, dynamic>;
      _baseUrl = (data['baseUrl'] as String?)?.trim();
      final endpointsRaw = data['endpoints'] as Map<String, dynamic>?;
      if (endpointsRaw != null && endpointsRaw.isNotEmpty) {
        _endpoints = endpointsRaw.map(
          (key, value) => MapEntry(key, value.toString()),
        );
      }
    } catch (_) {
      _baseUrl = null;
      _endpoints = _defaultEndpoints;
    }

    _baseUrl ??= _defaultBaseUrl;
  }

  static String get baseUrl => _baseUrl ?? _defaultBaseUrl;

  static String endpoint(String key, {Map<String, String>? params}) {
    var template = _endpoints[key] ?? key;
    if (params != null && params.isNotEmpty) {
      params.forEach((param, value) {
        template = template.replaceAll('{$param}', value);
      });
    }
    return template;
  }
}
