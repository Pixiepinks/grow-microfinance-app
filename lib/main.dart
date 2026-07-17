import 'package:flutter/material.dart';

import 'app_theme.dart';
import 'api_config.dart';
import 'screens/admin/admin_dashboard.dart';
import 'screens/admin/accounting/accounting_pages.dart';
import 'screens/admin/reports/reports_page.dart';
import 'screens/admin/investors_page.dart';
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
          onLogout: widget.onLogout,
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

    if (widget.role.toLowerCase() == 'admin') {
      return body;
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
  const _AdminNavigationShell({required this.adminRepository, required this.loanApplicationService, required this.accountingService, required this.onLogout});
  final AdminRepository adminRepository;
  final LoanApplicationService loanApplicationService;
  final AccountingService accountingService;
  final VoidCallback onLogout;
  @override State<_AdminNavigationShell> createState() => _AdminNavigationShellState();
}
class _AdminNavigationShellState extends State<_AdminNavigationShell> {
  @override void initState(){super.initState();setBrowserPopStateHandler((path){if(!mounted)return;setState((){page=_pageFromPath(path);selectedId=path.startsWith('/admin/accounting/journals/')?path.split('/').last:null;});});}
  static String _pageFromPath(String path){
    if (path.startsWith('/admin/accounting/journals/') && path.split('/').length > 4) return 'journalDetail';
    switch(path){
      case '/admin/investors': return 'investors';
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
    case 'investors': return '/admin/investors'; case 'accounting': return '/admin/accounting'; case 'accounts': return '/admin/accounting/accounts'; case 'journals': return '/admin/accounting/journals'; case 'journalNew': return '/admin/accounting/journals/new'; case 'journalDetail': return '/admin/accounting/journals/${id??''}'; case 'ledger': return '/admin/accounting/general-ledger'; case 'accountingReports': return '/admin/accounting/reports'; case 'trialBalance': return '/admin/accounting/trial-balance'; case 'incomeStatement': return '/admin/accounting/income-statement'; case 'financialPosition': return '/admin/accounting/financial-position'; case 'reconciliation': return '/admin/accounting/reconciliation'; case 'accountingSettings': return '/admin/accounting/settings'; default: return '/admin';}}
  String page = _pageFromPath(Uri.base.path); String? selectedId = Uri.base.path.startsWith('/admin/accounting/journals/') ? Uri.base.path.split('/').last : null;
  final perms = const AccountingPermissions(<String>{});
  void open(String p,{String? id}) { final path=_pathForPage(p,id:id); pushBrowserPath(path); setState(() { page=_pageFromPath(path); selectedId=id; }); }
  @override Widget build(BuildContext context) {
    final items = <({String key, IconData icon, String label})>[
      (key:'dashboard',icon:Icons.dashboard,label:'Dashboard'),(key:'applications',icon:Icons.assignment,label:'Loan Applications'),(key:'customers',icon:Icons.people,label:'Customers'),(key:'leads',icon:Icons.person_search,label:'Leads'),(key:'loans',icon:Icons.account_balance_wallet,label:'Loans'),(key:'collections',icon:Icons.payments,label:'Collections'),(key:'payments',icon:Icons.credit_card,label:'Payments'),(key:'staff',icon:Icons.admin_panel_settings,label:'Staff & Roles'),(key:'documents',icon:Icons.folder,label:'Documents'),(key:'risk',icon:Icons.shield,label:'Risk Management'),(key:'accounting',icon:Icons.account_balance,label:'Accounting Dashboard'),(key:'accounts',icon:Icons.schema,label:'Chart of Accounts'),(key:'journals',icon:Icons.receipt_long,label:'Journal Entries'),(key:'ledger',icon:Icons.menu_book,label:'General Ledger'),(key:'accountingReports',icon:Icons.assessment,label:'Financial Reports'),(key:'trialBalance',icon:Icons.balance,label:'Trial Balance'),(key:'incomeStatement',icon:Icons.trending_up,label:'Income Statement'),(key:'financialPosition',icon:Icons.account_balance,label:'Statement of Financial Position'),(key:'reconciliation',icon:Icons.rule,label:'Reconciliation'),(key:'accountingSettings',icon:Icons.settings_applications,label:'Accounting Settings'),(key:'reports',icon:Icons.bar_chart,label:'Reports'),(key:'settings',icon:Icons.settings,label:'Settings'),(key:'audit',icon:Icons.history,label:'Audit Logs')];
    Widget body; switch(page){
      case 'investors': body=InvestorsPage(onLogout: widget.onLogout); break;
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
    final nav = _AdminSidebar(items: items, page: page, open: open);
    return LayoutBuilder(builder:(context,c){ if(c.maxWidth>=900){ return Scaffold(body: Row(children:[SizedBox(width:280,child:nav), Expanded(child:body)]));} return Scaffold(drawer:Drawer(child:nav), appBar:AppBar(title:Text(items.firstWhere((i)=>i.key==page,orElse:()=>items.first).label)), body:body);});
  }
}

class _AdminSidebar extends StatelessWidget {
  const _AdminSidebar({required this.items, required this.page, required this.open});
  final List<({String key, IconData icon, String label})> items;
  final String page;
  final void Function(String, {String? id}) open;

  bool _selected(String key) => page == key || (key == 'accounting' && ['accounts','journals','journalNew','journalDetail','ledger','accountingReports','trialBalance','incomeStatement','financialPosition','reconciliation','accountingSettings'].contains(page));

  @override
  Widget build(BuildContext context) {
    return Material(
      color: const Color(0xFF0F172A),
      child: SafeArea(
        bottom: false,
        child: Column(
          children: [
            Padding(
              padding: const EdgeInsets.fromLTRB(22, 24, 18, 22),
              child: Row(children: [
                Container(width: 42, height: 42, decoration: BoxDecoration(shape: BoxShape.circle, border: Border.all(color: const Color(0xFF16A34A), width: 2)), child: const Icon(Icons.spa, color: Color(0xFF16A34A))),
                const SizedBox(width: 12),
                const Expanded(child: Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
                  Text('Grow Microfinance', style: TextStyle(color: Colors.white, fontWeight: FontWeight.w900, fontSize: 16)),
                  SizedBox(height: 3),
                  Text('Secure lending platform', style: TextStyle(color: Color(0xFFCBD5E1), fontSize: 12)),
                ])),
              ]),
            ),
            const Divider(height: 1, color: Color(0xFF1E293B)),
            Expanded(
              child: ListView(
                padding: const EdgeInsets.fromLTRB(10, 22, 10, 22),
                children: [
                  const Padding(padding: EdgeInsets.only(left: 14, bottom: 6), child: Text('ADMIN', style: TextStyle(color: Color(0xFF94A3B8), fontSize: 12, fontWeight: FontWeight.w800))),
                  const Padding(padding: EdgeInsets.only(left: 14, bottom: 14), child: Text('Navigation', style: TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.w900))),
                  ...items.map((i) {
                    final selected = _selected(i.key);
                    return Padding(
                      padding: const EdgeInsets.symmetric(vertical: 3),
                      child: InkWell(
                        borderRadius: BorderRadius.circular(10),
                        hoverColor: const Color(0xFF1E293B),
                        onTap: () { open(i.key); if (MediaQuery.of(context).size.width < 900) Navigator.maybePop(context); },
                        child: Container(
                          height: i.label.length > 28 ? 58 : 42,
                          decoration: BoxDecoration(color: selected ? const Color(0xFF1E293B) : Colors.transparent, borderRadius: BorderRadius.circular(10)),
                          child: Row(children: [
                            AnimatedContainer(duration: const Duration(milliseconds: 200), width: 3, height: selected ? 28 : 0, decoration: BoxDecoration(color: const Color(0xFF16A34A), borderRadius: BorderRadius.circular(8))),
                            const SizedBox(width: 12),
                            Icon(i.icon, size: 18, color: selected ? const Color(0xFF22C55E) : const Color(0xFFCBD5E1)),
                            const SizedBox(width: 13),
                            Expanded(child: Text(i.label, style: TextStyle(color: selected ? Colors.white : const Color(0xFFE2E8F0), fontWeight: selected ? FontWeight.w800 : FontWeight.w600, fontSize: 13))),
                            if (i.key == 'accounting') const Padding(padding: EdgeInsets.only(right: 10), child: Icon(Icons.keyboard_arrow_up, size: 18, color: Color(0xFFCBD5E1))),
                          ]),
                        ),
                      ),
                    );
                  }),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }
}
