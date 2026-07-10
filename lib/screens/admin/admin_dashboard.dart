import 'package:flutter/material.dart';

import '../../models/loan_application.dart';
import '../../services/loan_application_service.dart';
import '../../services/admin_repository.dart';
import '../../services/accounting_service.dart';
import '../../models/accounting_models.dart';
import '../../utils/currency_formatter.dart';
import '../../widgets/dashboard_card.dart';
import '../customer_registration_screen.dart';
import '../customer/loan_application_detail_screen.dart';

class AdminDashboardScreen extends StatefulWidget {
  const AdminDashboardScreen({
    super.key,
    required this.repository,
    required this.loanApplicationService,
    required this.accountingService,
    required this.openAdminPage,
  });

  final AdminRepository repository;
  final LoanApplicationService loanApplicationService;
  final AccountingService accountingService;
  final void Function(String, {String? id}) openAdminPage;

  @override
  State<AdminDashboardScreen> createState() => _AdminDashboardScreenState();
}

class _AdminDashboardScreenState extends State<AdminDashboardScreen> {
  final Set<String> _disbursing = <String>{};
  Map<String, dynamic>? _data;
  List<LoanApplication> _applications = [];
  String? _selectedStatus;
  bool _loading = true;
  bool _loadingApplications = true;
  String? _error;
  String? _applicationsError;

  @override
  void initState() {
    super.initState();
    _loadOverview();
    _loadApplications();
  }

  Future<void> _loadOverview() async {
    setState(() {
      _loading = true;
      _error = null;
    });
    try {
      final data = await widget.repository.fetchDashboard();
      setState(() => _data = data);
    } catch (e) {
      setState(() => _error = e.toString());
    } finally {
      setState(() => _loading = false);
    }
  }

  Future<void> _loadApplications() async {
    setState(() {
      _loadingApplications = true;
      _applicationsError = null;
    });
    try {
      final apps = await widget.loanApplicationService.listAdminApplications(
        status: _selectedStatus,
      );
      setState(() => _applications = apps);
    } catch (e) {
      setState(() => _applicationsError = e.toString());
    } finally {
      setState(() => _loadingApplications = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    return DefaultTabController(
      length: 2,
      child: Column(
        children: [
          Material(
            color: Theme.of(context).colorScheme.surface,
            child: TabBar(
              labelColor: Theme.of(context).colorScheme.primary,
              tabs: const [
                Tab(text: 'Overview'),
                Tab(text: 'Applications'),
              ],
            ),
          ),
          Expanded(
            child: TabBarView(
              children: [
                _buildOverviewTab(),
                _buildApplicationsTab(),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildOverviewTab() {
    return RefreshIndicator(
      onRefresh: _loadOverview,
      child: ListView(
        padding: const EdgeInsets.all(16),
        children: [
          Text(
            'Admin dashboard',
            style: Theme.of(context).textTheme.headlineSmall,
          ),
          const SizedBox(height: 12),
          DashboardCard(
            title: 'Customers',
            icon: Icons.person_add_alt,
            child: Align(
              alignment: Alignment.centerLeft,
              child: FilledButton.icon(
                onPressed: () {
                  Navigator.of(context).push(
                    MaterialPageRoute(
                      builder: (_) => const CustomerRegistrationScreen(),
                    ),
                  );
                },
                icon: const Icon(Icons.person_add),
                label: const Text('New Customer'),
              ),
            ),
          ),
          const SizedBox(height: 12),
          if (_loading) const Center(child: CircularProgressIndicator()),
          if (_error != null)
            DashboardCard(
              title: 'Error',
              icon: Icons.error_outline,
              child: Text(_error!),
            ),
          if (!_loading && _error == null && _data != null)
            DashboardCard(
              title: 'Key metrics',
              icon: Icons.insights,
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: _data!.entries
                    .map(
                      (entry) => Padding(
                        padding: const EdgeInsets.symmetric(vertical: 6),
                        child: Row(
                          mainAxisAlignment: MainAxisAlignment.spaceBetween,
                          children: [
                            Text(entry.key),
                            Text(entry.value.toString(),
                                style: const TextStyle(
                                    fontWeight: FontWeight.bold, fontSize: 16)),
                          ],
                        ),
                      ),
                    )
                    .toList(),
              ),
            ),
        ],
      ),
    );
  }

  Widget _buildApplicationsTab() {
    return RefreshIndicator(
      onRefresh: _loadApplications,
      child: _loadingApplications
          ? ListView(
              children: const [
                Padding(
                  padding: EdgeInsets.all(24),
                  child: Center(child: CircularProgressIndicator()),
                ),
              ],
            )
          : _applicationsError != null
              ? ListView(
                  padding: const EdgeInsets.all(16),
                  children: [
                    DashboardCard(
                      title: 'Error',
                      icon: Icons.error_outline,
                      child: Text(_applicationsError!),
                    ),
                  ],
                )
              : ListView.builder(
                  padding: const EdgeInsets.all(12),
                  itemCount: _applications.isEmpty ? 2 : _applications.length + 1,
                  itemBuilder: (context, index) {
                    if (index == 0) return _buildStatusFilter();

                    if (_applications.isEmpty) {
                      return const Padding(
                        padding: EdgeInsets.all(24),
                        child: Center(child: Text('No loan applications found.')),
                      );
                    }

                    final app = _applications[index - 1];
                    return Card(
                      child: ListTile(
                        title: Text(
                          app.applicationNumber.isNotEmpty
                              ? 'Application #${app.applicationNumber}'
                              : 'Application ${app.id}',
                          style: const TextStyle(fontWeight: FontWeight.w600),
                        ),
                        subtitle: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(app.loanType),
                            Text(
                              'Amount: ${formatCurrency(app.appliedAmount)}',
                            ),
                            Text('Tenure: ${app.tenureMonths} months'),
                            Text('Created: ${app.formattedDate}'),
                          ],
                        ),
                        trailing: Chip(label: Text(app.status)),
                        onTap: () async {
                          await Navigator.of(context).push(
                            MaterialPageRoute(
                              builder: (_) => LoanApplicationDetailScreen(
                                applicationId: app.id,
                                service: widget.loanApplicationService,
                                initialApplication: app,
                                actionButtonsBuilder:
                                    (application, refreshApplication) =>
                                        _buildAdminActions(
                                  application,
                                  refreshApplication,
                                ),
                              ),
                            ),
                          );
                          _loadApplications();
                        },
                      ),
                    );
                  },
                ),
    );
  }

  Widget _buildStatusFilter() {
    const statuses = <String?>[
      null,
      'SUBMITTED',
      'STAFF_APPROVED',
      'APPROVED',
      'REJECTED',
      'DISBURSED',
      'DRAFT',
    ];

    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: DropdownButtonFormField<String?>(
        value: _selectedStatus,
        decoration: const InputDecoration(
          labelText: 'Status',
          border: OutlineInputBorder(),
        ),
        items: statuses
            .map(
              (status) => DropdownMenuItem<String?>(
                value: status,
                child: Text(status ?? 'All'),
              ),
            )
            .toList(),
        onChanged: (status) {
          setState(() => _selectedStatus = status);
          _loadApplications();
        },
      ),
    );
  }

  List<Widget> _buildAdminActions(
    LoanApplication app,
    Future<void> Function() refreshApplication,
  ) {
    final actions = app.availableActions
        .map((action) => action.toLowerCase())
        .toSet();
    final buttons = <Widget>[];

    if (actions.contains('approve')) {
      buttons.add(
        Expanded(
          child: FilledButton(
            onPressed: () => _runApplicationAction(
              action: () => widget.loanApplicationService.finalApprove(app.id),
              refreshApplication: refreshApplication,
              successMessage: 'Application approved',
              errorMessage: 'Failed to approve application',
            ),
            child: const Text('Approve Application'),
          ),
        ),
      );
    }

    if (actions.contains('reject')) {
      buttons.add(
        Expanded(
          child: OutlinedButton(
            onPressed: () async {
              final reason = await _promptReason();
              if (!mounted || reason == null) return;
              await _runApplicationAction(
                action: () => widget.loanApplicationService.reject(
                  app.id,
                  reason: reason,
                ),
                refreshApplication: refreshApplication,
                successMessage: 'Application rejected',
                errorMessage: 'Failed to reject application',
              );
            },
            child: const Text('Reject Application'),
          ),
        ),
      );
    }

    if (actions.contains('disburse')) {
      buttons.add(
        Expanded(
          child: FilledButton(
            onPressed: _disbursing.contains(app.id) ? null : () => _showDisbursementDialog(app, refreshApplication),
            child: _disbursing.contains(app.id)
                ? const SizedBox(width: 18, height: 18, child: CircularProgressIndicator(strokeWidth: 2))
                : const Text('Disburse Loan'),
          ),
        ),
      );
    }

    if (buttons.isEmpty) {
      return const [Text('No actions available for this application.')];
    }

    return [
      Row(
        mainAxisAlignment: MainAxisAlignment.spaceEvenly,
        children: [
          for (var i = 0; i < buttons.length; i++) ...[
            if (i > 0) const SizedBox(width: 12),
            buttons[i],
          ],
        ],
      ),
    ];
  }

  Future<void> _runApplicationAction({
    required Future<void> Function() action,
    required Future<void> Function() refreshApplication,
    required String successMessage,
    required String errorMessage,
  }) async {
    try {
      await action();
      await Future.wait([refreshApplication(), _loadApplications()]);
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(successMessage)),
      );
    } catch (e) {
      debugPrint('$errorMessage: $e');
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text('$errorMessage. Please try again.')),
      );
    }
  }



  Future<void> _showDisbursementDialog(LoanApplication app, Future<void> Function() refreshApplication) async {
    final result = await showDialog<Map<String, dynamic>>(
      context: context,
      barrierDismissible: false,
      builder: (_) => _DisburseLoanDialog(
        application: app,
        accountingService: widget.accountingService,
        loanApplicationService: widget.loanApplicationService,
      ),
    );
    if (!mounted || result == null) return;
    await refreshApplication();
    await _loadApplications();
    final journalId = (result['journal_id'] ?? result['journalId'] ?? result['journal_entry_id'])?.toString();
    final journalNo = (result['journal_no'] ?? result['journalNo'] ?? result['journal_number'])?.toString() ?? 'created';
    final loanNo = (result['loan_number'] ?? result['loanNo'] ?? app.applicationNumber).toString();
    ScaffoldMessenger.of(context).showSnackBar(SnackBar(content: Text('Loan $loanNo disbursed. Journal $journalNo posted.')));
    await showDialog<void>(context: context, builder: (c)=>AlertDialog(title: const Text('Loan Disbursed'), content: Text('Loan Number: $loanNo\nJournal Number: $journalNo'), actions: [TextButton(onPressed:(){Navigator.pop(c);}, child: const Text('Close')), TextButton(onPressed:(){Navigator.pop(c); widget.openAdminPage('loans');}, child: const Text('View Loan')), TextButton(onPressed: journalId==null?null:(){Navigator.pop(c); widget.openAdminPage('journalDetail', id: journalId);}, child: const Text('View Journal Entry'))]));
  }

  Future<String?> _promptReason() async {
    final controller = TextEditingController();
    return showDialog<String>(
      context: context,
      builder: (context) => AlertDialog(
        title: const Text('Rejection reason'),
        content: TextField(
          controller: controller,
          decoration: const InputDecoration(
            hintText: 'Optional reason',
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(context).pop(null),
            child: const Text('Cancel'),
          ),
          FilledButton(
            onPressed: () => Navigator.of(context).pop(controller.text),
            child: const Text('Submit'),
          ),
        ],
      ),
    );
  }
}


class _DisburseLoanDialog extends StatefulWidget { const _DisburseLoanDialog({required this.application, required this.accountingService, required this.loanApplicationService}); final LoanApplication application; final AccountingService accountingService; final LoanApplicationService loanApplicationService; @override State<_DisburseLoanDialog> createState()=>_DisburseLoanDialogState(); }
class _DisburseLoanDialogState extends State<_DisburseLoanDialog>{
  final date=TextEditingController(text:DateTime.now().toIso8601String().substring(0,10)); final ref=TextEditingController(); final remarks=TextEditingController();
  List<AccountingAccount> accounts=[]; String method='BANK_TRANSFER'; String? accountId; bool loading=true, submitting=false; String? error;
  @override void initState(){super.initState(); widget.accountingService.accounts({'active':'true'}).then((v){ if(mounted)setState((){accounts=v.where((a)=>a.active&&a.allowManualPosting&&a.type.toUpperCase()=='ASSET'&&['CASH','BANK'].contains(a.subtype.toUpperCase())).toList(); loading=false;});}).catchError((e){if(mounted)setState((){error=e.toString(); loading=false;});}); }
  List<AccountingAccount> get filtered=>accounts.where((a){final st=a.subtype.toUpperCase(); if(method=='CASH')return st=='CASH'; if(method=='BANK_TRANSFER'||method=='CHEQUE')return st=='BANK'; return st=='CASH'||st=='BANK';}).toList();
  AccountingAccount? get selected=>filtered.where((a)=>a.id==accountId).firstOrNull;
  bool get valid=>accountId!=null&&method.isNotEmpty&&DateTime.tryParse(date.text)!=null&&(!(method=='BANK_TRANSFER'||method=='CHEQUE')||ref.text.trim().isNotEmpty)&&!submitting;
  Future<void> submit()async{ if(!valid)return; setState((){submitting=true; error=null;}); try{final body={'funding_account_id':accountId,'disbursement_method':method,'transaction_reference':ref.text.trim(),'disbursement_date':date.text.trim(),'remarks':remarks.text.trim()}; final res=await widget.loanApplicationService.disburse(widget.application.id, body: body); if(mounted)Navigator.pop(context,res);}catch(e){if(mounted)setState(()=>error=e.toString());}finally{if(mounted)setState(()=>submitting=false);} }
  @override Widget build(BuildContext context){final app=widget.application; final sel=selected; if(accountId!=null && sel==null) accountId=null; return AlertDialog(title:const Text('Disburse Loan'), content:SizedBox(width:620, child:SingleChildScrollView(child:Column(crossAxisAlignment:CrossAxisAlignment.start,mainAxisSize:MainAxisSize.min,children:[if(loading)const LinearProgressIndicator(), if(error!=null)Padding(padding:const EdgeInsets.only(bottom:8), child:Text(error!,style:TextStyle(color:Theme.of(context).colorScheme.error))), Wrap(spacing:24,runSpacing:8,children:[Text('Application Number: ${app.applicationNumber.isNotEmpty?app.applicationNumber:app.id}'),Text('Customer Name: ${app.applicantDetails['full_name']??app.applicantDetails['name']??'-'}'),Text('Principal Amount: ${formatCurrency(app.appliedAmount)}'),Text('Total Payable: ${formatCurrency(app.loanDetails['total_payable']??app.loanDetails['totalPayable']??app.appliedAmount)}')]), const SizedBox(height:12), TextField(controller:date,decoration:const InputDecoration(labelText:'Disbursement Date *'),onChanged:(_)=>setState((){})), DropdownButtonFormField<String>(value:method,decoration:const InputDecoration(labelText:'Disbursement Method *'),items:['BANK_TRANSFER','CASH','CHEQUE','OTHER'].map((m)=>DropdownMenuItem(value:m,child:Text(m))).toList(),onChanged:(v)=>setState((){method=v??'BANK_TRANSFER'; accountId=null;})), DropdownButtonFormField<String>(value:accountId,decoration:const InputDecoration(labelText:'Funding Account *'),items:filtered.map((a)=>DropdownMenuItem(value:a.id,child:Text('${a.code} — ${a.name}'))).toList(),onChanged:(v)=>setState(()=>accountId=v)), TextField(controller:ref,decoration:InputDecoration(labelText:(method=='BANK_TRANSFER'||method=='CHEQUE')?'Transaction Reference *':'Transaction Reference'),onChanged:(_)=>setState((){})), TextField(controller:remarks,decoration:const InputDecoration(labelText:'Remarks')), const SizedBox(height:12), const Text('Disbursing this loan will create a posted accounting journal:\nDebit Loan Principal Receivable and credit the selected funding account.\nPosted journals cannot be edited and must be reversed if incorrect.'), const SizedBox(height:12), Card(child:Padding(padding:const EdgeInsets.all(12),child:Column(crossAxisAlignment:CrossAxisAlignment.start,children:[const Text('Entry Preview',style:TextStyle(fontWeight:FontWeight.bold)), const Text('Debit:'), const Text('1100 Loan Principal Receivable'), Text(formatCurrency(app.appliedAmount)), const SizedBox(height:8), const Text('Credit:'), Text(sel==null?'Select a funding account':'${sel.code} ${sel.name}'), Text(formatCurrency(app.appliedAmount))])))]))), actions:[TextButton(onPressed:submitting?null:()=>Navigator.pop(context),child:const Text('Cancel')), FilledButton(onPressed:valid?submit:null, child: submitting?const SizedBox(width:18,height:18,child:CircularProgressIndicator(strokeWidth:2)):const Text('Confirm Disbursement'))]); }
}
