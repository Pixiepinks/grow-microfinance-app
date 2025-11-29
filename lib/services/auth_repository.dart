import 'dart:convert';

import 'package:shared_preferences/shared_preferences.dart';

import '../api_config.dart';
import 'api_client.dart';

class AuthRepository {
  AuthRepository(this._client);

  final ApiClient _client;
  static const _tokenKey = 'jwt_token';
  static const _roleKey = 'user_role';

  Future<Map<String, dynamic>> login({
    required String email,
    required String password,
  }) async {
    final response = await _client.postJson(
      ApiConfig.endpoint('login'),
      body: {
        'email': email,
        'password': password,
      },
    );
    // Flask API returns "access_token" and "role"
    final token = response['access_token'] as String?;
    final role = response['role'] as String?;
    if (token != null && role != null) {
      await persistAuth(token: token, role: role);
    }
    return response;
  }

  Future<void> persistAuth({required String token, required String role}) async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.setString(_tokenKey, token);
    await prefs.setString(_roleKey, role);
    _client.updateToken(token);
  }

  Future<String?> loadToken() async {
    final prefs = await SharedPreferences.getInstance();
    final token = prefs.getString(_tokenKey);
    _client.updateToken(token);
    return token;
  }

  Future<String?> loadRole() async {
    final prefs = await SharedPreferences.getInstance();
    return prefs.getString(_roleKey);
  }

  Future<void> logout() async {
    final prefs = await SharedPreferences.getInstance();
    await prefs.remove(_tokenKey);
    await prefs.remove(_roleKey);
    _client.updateToken(null);
  }
}
