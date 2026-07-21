import 'dart:convert';

import 'package:flutter_test/flutter_test.dart';
import 'package:grow_microfinance_app/services/api_client.dart';
import 'package:grow_microfinance_app/services/loan_application_service.dart';
import 'package:http/http.dart' as http;
import 'package:http/testing.dart';

void main() {
  test('loads the normalized profile route and unwraps a data profile', () async {
    late Uri requestedUri;
    final client = MockClient((request) async {
      requestedUri = request.url;
      return http.Response(
        jsonEncode({
          'data': {
            'profile': {'customer_id': 19, 'full_name': 'Baskaran'},
            'review_warnings': ['Mobile requires review'],
          },
        }),
        200,
      );
    });
    final service = LoanApplicationService(ApiClient(client: client));

    final profile = await service.fetchNormalizedCustomerProfile('19');

    expect(requestedUri.path, '/admin/customers/19/profile-normalized');
    expect(profile['customer_id'], 19);
    expect(profile['full_name'], 'Baskaran');
    expect(profile['review_warnings'], ['Mobile requires review']);
  });

  test('searches customers with the required query and limit', () async {
    late Uri requestedUri;
    final client = MockClient((request) async {
      requestedUri = request.url;
      return http.Response(jsonEncode({'results': [{'id': 19}]}), 200);
    });
    final service = LoanApplicationService(ApiClient(client: client));

    final results = await service.searchCustomers('bask');

    expect(requestedUri.path, '/admin/customers/search');
    expect(requestedUri.queryParameters, {'q': 'bask', 'limit': '10'});
    expect(results.single['id'], 19);
  });
}
