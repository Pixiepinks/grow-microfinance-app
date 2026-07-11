import '../api_config.dart';
import '../models/accounting_models.dart';
import 'api_client.dart';

class AccountingService { AccountingService(this._client); final ApiClient _client;
  String _query(Map<String,dynamic?> q){ final p=q..removeWhere((k,v)=>v==null||v.toString().isEmpty); return p.isEmpty?'':'?${Uri(queryParameters:p.map((k,v)=>MapEntry(k,v.toString()))).query}'; }
  List<dynamic> _items(dynamic d){ if(d is List)return d; if(d is Map<String,dynamic>){ for(final k in ['accounts','journals','issues','entries','transactions','data','items','results']){ if(d[k] is List)return d[k] as List; }} return []; }
  Future<List<AccountingAccount>> accounts([Map<String,dynamic?> q=const{}]) async => _items(await _client.getJsonData('/admin/accounting/accounts${_query(Map.of(q))}')).whereType<Map<String,dynamic>>().map(AccountingAccount.fromJson).toList();
  Future<Map<String,dynamic>> settings() async => await _client.getJson('/admin/accounting/settings');
  Future<Map<String,dynamic>> saveSettings(Map<String,dynamic> body)=>_client.putJson('/admin/accounting/settings', body: body);
  Future<List<AccountingAccount>> fundingAccounts([Map<String,dynamic?> q=const{}]) async => _items(await _client.getJsonData('/admin/accounting/funding-accounts${_query(Map.of(q))}')).whereType<Map<String,dynamic>>().map(AccountingAccount.fromJson).toList();
  Future<Map<String,dynamic>> saveAccount(Map<String,dynamic> body,{String? id})=> id==null ? _client.postJson('/admin/accounting/accounts', body: body) : _client.putJson('/admin/accounting/accounts/$id', body: body);
  Future<List<JournalEntry>> journals([Map<String,dynamic?> q=const{}]) async => _items(await _client.getJsonData('/admin/accounting/journals${_query(Map.of(q))}')).whereType<Map<String,dynamic>>().map(JournalEntry.fromJson).toList();
  Future<JournalEntry> journal(String id) async => JournalEntry.fromJson(await _client.getJson('/admin/accounting/journals/$id'));
  Future<Map<String,dynamic>> createJournal(Map<String,dynamic> body)=>_client.postJson('/admin/accounting/journals', body: body);
  Future<Map<String,dynamic>> postJournal(String id)=>_client.postJson('/admin/accounting/journals/$id/post');
  Future<Map<String,dynamic>> reverseJournal(String id, Map<String,dynamic> body)=>_client.postJson('/admin/accounting/journals/$id/reverse', body: body);
  Future<Map<String,dynamic>> ledger(Map<String,dynamic?> q) async => parseGeneralLedgerResponse(await _client.getJson('/admin/accounting/general-ledger${_query(Map.of(q))}'));
  Future<List<dynamic>> reconciliation([Map<String,dynamic?> q=const{}]) async => _items(await _client.getJsonData('/admin/accounting/reconciliation/issues${_query(Map.of(q))}'));
  Future<List<int>> exportLedgerCsv(Map<String,dynamic?> q) => _client.getBytes('/admin/accounting/general-ledger/export.csv${_query(Map.of(q))}', accept: 'text/csv');
  Future<Map<String,dynamic>> financialReportsSummary(Map<String,dynamic?> q) async => parseFinancialSummaryResponse(await _client.getJson('/admin/accounting/reports/summary${_query(Map.of(q))}'));
  Future<Map<String,dynamic>> trialBalance(Map<String,dynamic?> q)=>_client.getJson('/admin/accounting/reports/trial-balance${_query(Map.of(q))}');
  Future<Map<String,dynamic>> incomeStatement(Map<String,dynamic?> q)=>_client.getJson('/admin/accounting/reports/income-statement${_query(Map.of(q))}');
  Future<Map<String,dynamic>> financialPosition(Map<String,dynamic?> q)=>_client.getJson('/admin/accounting/reports/statement-of-financial-position${_query(Map.of(q))}');
  Future<Map<String,dynamic>> accountDrilldown(Map<String,dynamic?> q)=>_client.getJson('/admin/accounting/reports/account-drilldown${_query(Map.of(q))}');
  Future<List<int>> exportTrialBalanceCsv(Map<String,dynamic?> q)=>_client.getBytes('/admin/accounting/reports/trial-balance/export.csv${_query(Map.of(q))}', accept:'text/csv');
  Future<List<int>> exportIncomeStatementCsv(Map<String,dynamic?> q)=>_client.getBytes('/admin/accounting/reports/income-statement/export.csv${_query(Map.of(q))}', accept:'text/csv');
  Future<List<int>> exportFinancialPositionCsv(Map<String,dynamic?> q)=>_client.getBytes('/admin/accounting/reports/statement-of-financial-position/export.csv${_query(Map.of(q))}', accept:'text/csv');
}
