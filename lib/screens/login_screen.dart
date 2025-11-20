import 'package:flutter/material.dart';

import '../services/auth_repository.dart';
import '../widgets/dashboard_card.dart';

class LoginScreen extends StatefulWidget {
  const LoginScreen({super.key, required this.onLoggedIn, required this.authRepository});

  final void Function(String role) onLoggedIn;
  final AuthRepository authRepository;

  @override
  State<LoginScreen> createState() => _LoginScreenState();
}

class _LoginScreenState extends State<LoginScreen> {
  final _formKey = GlobalKey<FormState>();
  final _emailController = TextEditingController();
  final _passwordController = TextEditingController();
  bool _loading = false;
  String? _error;

  @override
  void dispose() {
    _emailController.dispose();
    _passwordController.dispose();
    super.dispose();
  }

  Future<void> _submit() async {
    if (!_formKey.currentState!.validate()) return;
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final response = await widget.authRepository.login(
        email: _emailController.text,
        password: _passwordController.text,
      );
      final role = response['role'] as String?;
      if (role != null) {
        widget.onLoggedIn(role);
      } else {
        setState(() => _error = 'Unable to read role from response.');
      }
    } catch (e) {
      setState(() => _error = 'Login failed: $e');
    } finally {
      if (mounted) {
        setState(() => _loading = false);
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: Center(
        child: SingleChildScrollView(
          padding: const EdgeInsets.all(24),
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 420),
            child: DashboardCard(
              title: 'Grow Microfinance',
              icon: Icons.account_balance_wallet,
              child: Form(
                key: _formKey,
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.stretch,
                  children: [
                    Text(
                      'Sign in',
                      style: Theme.of(context).textTheme.headlineSmall,
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _emailController,
                      keyboardType: TextInputType.emailAddress,
                      decoration: const InputDecoration(labelText: 'Email'),
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Enter your email';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 12),
                    TextFormField(
                      controller: _passwordController,
                      decoration: const InputDecoration(labelText: 'Password'),
                      obscureText: true,
                      validator: (value) {
                        if (value == null || value.isEmpty) {
                          return 'Enter your password';
                        }
                        return null;
                      },
                    ),
                    const SizedBox(height: 12),
                    if (_error != null)
                      Text(
                        _error!,
                        style: TextStyle(color: Theme.of(context).colorScheme.error),
                      ),
                    const SizedBox(height: 12),
                    FilledButton.icon(
                      onPressed: _loading ? null : _submit,
                      icon: _loading
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(strokeWidth: 2),
                            )
                          : const Icon(Icons.login),
                      label: const Text('Login'),
                    ),
                  ],
                ),
              ),
            ),
          ),
        ),
      ),
    );
  }
}
