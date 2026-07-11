import 'package:flutter/material.dart';

import 'app_theme.dart';
import 'api_config.dart';
import 'screens/admin/admin_dashboard.dart';
import 'screens/admin/accounting/accounting_pages.dart';
import 'screens/admin/reports/reports_page.dart';
import 'services/accounting_service.dart';
import 'screens/customer/customer_dashboard.dart';
import 'screens/login_screen.dart';
import 'screens/staff/staff_dashboard.dart';
import 'services/admin_repository.dart';
import 'services/api_client.dart';
import 'services/auth_repository.dart';
import 'services/customer_repository.dart';
import 'services/loan_application_service.dart';
import 'services/staff_repository.dart';
import 'utils/browser_history.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  await ApiConfig.ensureInitialized();
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
  late final AccountingService _accountingService = AccountingService(_apiClient);

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
                  accountingService: _accountingService,
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
    required this.accountingService,
  });

  final String role;
  final VoidCallback onLogout;
  final AdminRepository adminRepository;
  final StaffRepository staffRepository;
  final CustomerRepository customerRepository;
  final LoanApplicationService loanApplicationService;
  final AccountingService accountingService;

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
        body = _AdminNavigationShell(
          adminRepository: widget.adminRepository,
          loanApplicationService: widget.loanApplicationService,
          accountingService: widget.accountingService,
        );
        break;
      case 'staff':
        body = StaffDashboardScreen(
          repository: widget.staffRepository,
          loanApplicationService: widget.loanApplicationService,
        );
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

class _AdminNavigationShell extends StatefulWidget {
  const _AdminNavigationShell({required this.adminRepository, required this.loanApplicationService, required this.accountingService});
  final AdminRepository adminRepository;
  final LoanApplicationService loanApplicationService;
  final AccountingService accountingService;
  @override State<_AdminNavigationShell> createState() => _AdminNavigationShellState();
}
class _AdminNavigationShellState extends State<_AdminNavigationShell> {
  @override void initState(){super.initState();setBrowserPopStateHandler((path){if(!mounted)return;setState((){page=_pageFromPath(path);selectedId=path.startsWith('/admin/accounting/journals/')?path.split('/').last:null;});});}
  static String _pageFromPath(String path){
    if (path.startsWith('/admin/accounting/journals/') && path.split('/').length > 4) return 'journalDetail';
    switch(path){
      case '/admin/accounting': return 'accounting';
      case '/admin/accounting/accounts': return 'accounts';
      case '/admin/accounting/journals': return 'journals';
      case '/admin/accounting/journals/new': return 'journalNew';
      case '/admin/accounting/general-ledger': return 'ledger';
      case '/admin/accounting/reports': return 'accountingReports';
      case '/admin/accounting/trial-balance': return 'trialBalance';
      case '/admin/accounting/income-statement': return 'incomeStatement';
      case '/admin/accounting/financial-position': return 'financialPosition';
      case '/admin/accounting/reconciliation': return 'reconciliation';
      case '/admin/accounting/settings': return 'accountingSettings';
      default: return 'dashboard';
    }
  }
  static String _pathForPage(String p,{String? id}){switch(p){
    case 'accounting': return '/admin/accounting'; case 'accounts': return '/admin/accounting/accounts'; case 'journals': return '/admin/accounting/journals'; case 'journalNew': return '/admin/accounting/journals/new'; case 'journalDetail': return '/admin/accounting/journals/${id??''}'; case 'ledger': return '/admin/accounting/general-ledger'; case 'accountingReports': return '/admin/accounting/reports'; case 'trialBalance': return '/admin/accounting/trial-balance'; case 'incomeStatement': return '/admin/accounting/income-statement'; case 'financialPosition': return '/admin/accounting/financial-position'; case 'reconciliation': return '/admin/accounting/reconciliation'; case 'accountingSettings': return '/admin/accounting/settings'; default: return '/admin';}}
  String page = _pageFromPath(Uri.base.path); String? selectedId = Uri.base.path.startsWith('/admin/accounting/journals/') ? Uri.base.path.split('/').last : null;
  final perms = const AccountingPermissions(<String>{});
  void open(String p,{String? id}) { final path=_pathForPage(p,id:id); pushBrowserPath(path); setState(() { page=_pageFromPath(path); selectedId=id; }); }
  @override Widget build(BuildContext context) {
    final items = <({String key, IconData icon, String label})>[
      (key:'dashboard',icon:Icons.dashboard,label:'Dashboard'),(key:'applications',icon:Icons.assignment,label:'Loan Applications'),(key:'customers',icon:Icons.people,label:'Customers'),(key:'leads',icon:Icons.person_search,label:'Leads'),(key:'loans',icon:Icons.account_balance_wallet,label:'Loans'),(key:'collections',icon:Icons.payments,label:'Collections'),(key:'payments',icon:Icons.credit_card,label:'Payments'),(key:'staff',icon:Icons.admin_panel_settings,label:'Staff & Roles'),(key:'documents',icon:Icons.folder,label:'Documents'),(key:'risk',icon:Icons.shield,label:'Risk Management'),(key:'accounting',icon:Icons.account_balance,label:'Accounting Dashboard'),(key:'accounts',icon:Icons.schema,label:'Chart of Accounts'),(key:'journals',icon:Icons.receipt_long,label:'Journal Entries'),(key:'ledger',icon:Icons.menu_book,label:'General Ledger'),(key:'accountingReports',icon:Icons.assessment,label:'Financial Reports'),(key:'trialBalance',icon:Icons.balance,label:'Trial Balance'),(key:'incomeStatement',icon:Icons.trending_up,label:'Income Statement'),(key:'financialPosition',icon:Icons.account_balance,label:'Statement of Financial Position'),(key:'reconciliation',icon:Icons.rule,label:'Reconciliation'),(key:'accountingSettings',icon:Icons.settings_applications,label:'Accounting Settings'),(key:'reports',icon:Icons.bar_chart,label:'Reports'),(key:'settings',icon:Icons.settings,label:'Settings'),(key:'audit',icon:Icons.history,label:'Audit Logs')];
    Widget body; switch(page){
      case 'accounting': body=AccountingDashboardPage(service:widget.accountingService,perms:perms,open:(p)=>open(p)); break;
      case 'accounts': body=ChartOfAccountsPage(service:widget.accountingService,perms:perms); break;
      case 'journals': body=JournalEntriesPage(service:widget.accountingService,perms:perms,open:(p,{id})=>open(p,id:id)); break;
      case 'journalNew': body=JournalEntryFormPage(service:widget.accountingService,perms:perms,open:(p,{id})=>open(p,id:id)); break;
      case 'journalDetail': body=JournalDetailPage(service:widget.accountingService,perms:perms,id:selectedId??'',open:(p,{id})=>open(p,id:id)); break;
      case 'accountingReports': body=FinancialReportsDashboardPage(service:widget.accountingService,perms:perms,open:(p)=>open(p)); break;
      case 'trialBalance': body=TrialBalancePage(service:widget.accountingService,perms:perms,open:(p,{id})=>open(p,id:id)); break;
      case 'incomeStatement': body=IncomeStatementPage(service:widget.accountingService,perms:perms,open:(p,{id})=>open(p,id:id)); break;
      case 'financialPosition': body=FinancialPositionPage(service:widget.accountingService,perms:perms,open:(p,{id})=>open(p,id:id)); break;
      case 'ledger': body=GeneralLedgerPage(service:widget.accountingService,perms:perms,open:(p,{id})=>open(p,id:id)); break;
      case 'reconciliation': body=ReconciliationPage(service:widget.accountingService); break;
      case 'accountingSettings': body=AccountingSettingsPage(service:widget.accountingService,perms:perms); break;
      case 'reports': body=ReportsPage(openLedger:()=>open('ledger')); break;
      case 'dashboard': body=AdminDashboardScreen(repository:widget.adminRepository,loanApplicationService:widget.loanApplicationService,accountingService:widget.accountingService,openAdminPage:(p,{id})=>open(p,id:id)); break;
      default: body=Center(child: Text('${items.firstWhere((i)=>i.key==page).label} module'));
    }
    final nav = ListView(children: [const Padding(padding: EdgeInsets.all(16), child: Text('Admin Navigation', style: TextStyle(fontWeight: FontWeight.bold))), ...items.map((i)=>ListTile(leading:Icon(i.icon),title:Text(i.label),selected: page==i.key || (i.key=='accounting' && ['accounts','journals','journalNew','journalDetail','ledger','accountingReports','trialBalance','incomeStatement','financialPosition','reconciliation','accountingSettings'].contains(page)),onTap:(){open(i.key); if(MediaQuery.of(context).size.width<900) Navigator.maybePop(context);}))]);
    return LayoutBuilder(builder:(context,c){ if(c.maxWidth>=900){ return Row(children:[SizedBox(width:280,child:Material(color:Theme.of(context).colorScheme.surface,child:nav)), const VerticalDivider(width:1), Expanded(child:body)]);} return Scaffold(drawer:Drawer(child:nav), appBar:AppBar(title:Text(items.firstWhere((i)=>i.key==page,orElse:()=>items.first).label)), body:body);});
  }
}
