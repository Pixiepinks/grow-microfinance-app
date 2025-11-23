import 'package:flutter/material.dart';

import 'app_theme.dart';
import 'screens/admin/admin_dashboard.dart';
import 'screens/customer/customer_dashboard.dart';
import 'screens/login_screen.dart';
import 'screens/staff/staff_dashboard.dart';
import 'services/admin_repository.dart';
import 'services/api_client.dart';
import 'services/auth_repository.dart';
import 'services/customer_repository.dart';
import 'services/loan_application_service.dart';
import 'services/staff_repository.dart';

void main() {
  WidgetsFlutterBinding.ensureInitialized();
  runApp(const GrowMicrofinanceApp());
}

class GrowMicrofinanceApp extends StatefulWidget {
  const GrowMicrofinanceApp({super.key});

  @override
  State<GrowMicrofinanceApp> createState() => _GrowMicrofinanceAppState();
}

class _GrowMicrofinanceAppState extends State<GrowMicrofinanceApp> {
  final ApiClient _apiClient = ApiClient();
  late final AuthRepository _authRepository = AuthRepository(_apiClient);
  late final AdminRepository _adminRepository = AdminRepository(_apiClient);
  late final StaffRepository _staffRepository = StaffRepository(_apiClient);
  late final CustomerRepository _customerRepository = CustomerRepository(_apiClient);
  late final LoanApplicationService _loanApplicationService =
      LoanApplicationService(_apiClient);

  bool _loadingSession = true;
  String? _role;

  @override
  void initState() {
    super.initState();
    _bootstrap();
  }

  Future<void> _bootstrap() async {
    await _authRepository.loadToken();
    final role = await _authRepository.loadRole();
    setState(() {
      _role = role;
      _loadingSession = false;
    });
  }

  Future<void> _logout() async {
    await _authRepository.logout();
    setState(() => _role = null);
  }

  void _handleLoggedIn(String role) {
    setState(() => _role = role);
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Grow Microfinance',
      debugShowCheckedModeBanner: false,
      theme: AppTheme.light(),
      home: _loadingSession
          ? const Scaffold(body: Center(child: CircularProgressIndicator()))
          : _role == null
              ? LoginScreen(
                  onLoggedIn: _handleLoggedIn,
                  authRepository: _authRepository,
                )
              : _HomeShell(
                  role: _role!,
                  onLogout: _logout,
                  adminRepository: _adminRepository,
                  staffRepository: _staffRepository,
                  customerRepository: _customerRepository,
                  loanApplicationService: _loanApplicationService,
                ),
    );
  }
}

class _HomeShell extends StatefulWidget {
  const _HomeShell({
    required this.role,
    required this.onLogout,
    required this.adminRepository,
    required this.staffRepository,
    required this.customerRepository,
    required this.loanApplicationService,
  });

  final String role;
  final VoidCallback onLogout;
  final AdminRepository adminRepository;
  final StaffRepository staffRepository;
  final CustomerRepository customerRepository;
  final LoanApplicationService loanApplicationService;

  @override
  State<_HomeShell> createState() => _HomeShellState();
}

class _HomeShellState extends State<_HomeShell> {
  @override
  Widget build(BuildContext context) {
    final title = 'Grow Microfinance (${widget.role})';
    Widget body;
    switch (widget.role.toLowerCase()) {
      case 'admin':
        body = AdminDashboardScreen(repository: widget.adminRepository);
        break;
      case 'staff':
        body = StaffDashboardScreen(repository: widget.staffRepository);
        break;
      case 'customer':
      default:
        body = CustomerDashboardScreen(
          repository: widget.customerRepository,
          loanApplicationService: widget.loanApplicationService,
        );
        break;
    }

    return Scaffold(
      appBar: AppBar(
        title: Text(title),
        actions: [
          IconButton(
            onPressed: widget.onLogout,
            icon: const Icon(Icons.logout),
            tooltip: 'Logout',
          ),
        ],
      ),
      body: body,
    );
  }
}
