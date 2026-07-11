import '../utils/accounting_math.dart';

String _s(Map<String, dynamic> j, List<String> keys, [String fallback = '']) {
  for (final k in keys) {
    final v = j[k];
    if (v != null && v.toString().isNotEmpty) return v.toString();
  }
  return fallback;
}


String accountLabel(AccountingAccount? account) {
  if (account == null) return 'Not selected';
  final code = account.code.trim();
  final name = account.name.trim();
  if (code.isNotEmpty && name.isNotEmpty) return '$code — $name';
  if (code.isNotEmpty) return code;
  if (name.isNotEmpty) return name;
  return account.id.isNotEmpty ? 'ID: ${account.id}' : 'Unnamed account';
}

bool parseAccountingBool(Object? value) {
  if (value is bool) return value;
  final s = value?.toString().trim().toLowerCase();
  return s == 'true' || s == '1' || s == 'yes' || s == 'balanced';
}

String accountingIdFallback(Object? label, Object? id) {
  final text = label?.toString().trim() ?? '';
  if (text.isNotEmpty && !RegExp(r'^(customer|loan)?\s*id[: ]', caseSensitive: false).hasMatch(text)) return text;
  final raw = id?.toString().trim() ?? '';
  return raw.isEmpty ? '-' : 'ID: $raw';
}

Map<String, dynamic> parseGeneralLedgerResponse(Map<String, dynamic> j) {
  final tx = j['transactions'];
  final summary = (j['summary'] is Map ? Map<String, dynamic>.from(j['summary'] as Map) : <String, dynamic>{});
  for (final k in ['opening_balance', 'total_debit', 'total_credit', 'closing_balance']) {
    if (j.containsKey(k)) summary[k] = j[k];
  }
  if (tx is! List) throw FormatException('General ledger response is missing transactions.');
  for (final k in ['opening_balance', 'total_debit', 'total_credit', 'closing_balance']) {
    if (!summary.containsKey(k)) throw FormatException('General ledger response is missing $k.');
  }
  final txCents = sumCents(tx.whereType<Map>().map((r) => r['debit'])) - sumCents(tx.whereType<Map>().map((r) => r['credit']));
  final expected = toCents(summary['closing_balance']) - toCents(summary['opening_balance']);
  if (txCents != expected) throw FormatException('General ledger summary totals do not agree with transaction totals.');
  final maps = tx.whereType<Map>().toList();
  if (maps.isNotEmpty && maps.last.containsKey('running_balance') && toCents(maps.last['running_balance']) != toCents(summary['closing_balance'])) {
    throw FormatException('General ledger final running balance does not equal closing balance.');
  }
  return {'summary': summary, 'transactions': tx};
}

Map<String, dynamic> parseFinancialSummaryResponse(Map<String, dynamic> j) {
  final out = <String, dynamic>{};
  for (final k in ['total_assets','total_liabilities','total_equity','total_income','total_expenses','net_profit_loss','trial_balance_difference','financial_position_difference','unclassified_account_count']) {
    if (!j.containsKey(k)) throw FormatException('Financial reports summary is missing $k.');
    out[k] = j[k];
  }
  out['trial_balance_balanced'] = parseAccountingBool(j['trial_balance_balanced']) || toCents(j['trial_balance_difference']) == 0;
  out['financial_position_balanced'] = parseAccountingBool(j['financial_position_balanced']) || toCents(j['financial_position_difference']) == 0;
  out['incomplete_accounting_history'] = parseAccountingBool(j['incomplete_accounting_history']);
  out['warnings'] = j['warnings'] is List ? j['warnings'] : const [];
  return out;
}

String humanIssueType(String? value) => humanReferenceType(value);

class AccountingAccount {
  AccountingAccount({required this.id, required this.code, required this.name, required this.type, required this.normalBalance, this.parentId, this.parentName, this.description, this.subtype = '', this.allowManualPosting = true, this.active = true, this.systemAccount = false, this.depth = 0, this.defaultFor = const []});
  final String id, code, name, type, normalBalance, subtype;
  final String? parentId, parentName, description;
  final bool allowManualPosting, active, systemAccount;
  final int depth;
  final List<String> defaultFor;
  String get label => accountLabel(this);
  factory AccountingAccount.fromJson(Map<String, dynamic> j) => AccountingAccount(
        id: _s(j, ['id', 'account_id'], _s(j, ['code'])),
        code: _s(j, ['code', 'account_code']),
        name: _s(j, ['name', 'account_name']),
        type: _s(j, ['type', 'account_type']),
        normalBalance: _s(j, ['normal_balance', 'normalBalance']),
        subtype: _s(j, ['subtype', 'account_subtype', 'accountSubType']),
        parentId: j['parent_id']?.toString(),
        parentName: j['parent_name']?.toString(),
        description: j['description']?.toString(),
        allowManualPosting: j['allow_manual_posting'] ?? j['posting_allowed'] ?? j['allowManualPosting'] ?? true,
        active: j['active'] ?? j['is_active'] ?? true,
        systemAccount: parseAccountingBool(j['is_system_account'] ?? j['system_account'] ?? j['is_system']),
        depth: int.tryParse((j['depth'] ?? j['level'] ?? 0).toString()) ?? 0,
        defaultFor: ((j['default_for'] ?? j['defaultFor'] ?? []) as List?)?.map((e) => e.toString()).toList() ?? const [],
      );
}

class AccountingSettingField {
  const AccountingSettingField(this.key, this.label, this.section, this.types, this.subtypes, {this.sensitive = true});
  final String key, label, section;
  final List<String> types, subtypes;
  final bool sensitive;
}

class JournalLineDraft { String? accountId, description, customerId, loanId; String debit, credit; JournalLineDraft({this.accountId,this.description,this.customerId,this.loanId,this.debit='',this.credit=''}); bool get hasDebit=>toCents(debit)>0; bool get hasCredit=>toCents(credit)>0; bool get isValid=>accountId!=null && accountId!.isNotEmpty && (hasDebit!=hasCredit); Map<String,dynamic> toJson()=>{'account_id':accountId,'description':description,'customer_id':customerId,'loan_id':loanId,'debit':debit.isEmpty?'0.00':debit,'credit':credit.isEmpty?'0.00':credit}; }

class JournalEntry { JournalEntry({required this.id, required this.journalNo, this.date, this.description, this.referenceType, this.referenceId, this.sourceModule, this.status='DRAFT', this.totalDebit='0', this.totalCredit='0', this.createdBy, this.postedBy, this.postedAt, this.reversalReference, this.originalJournalId, this.originalJournalNo, this.reversalJournalId, this.reversalJournalNo, this.customerId, this.customerName, this.customerNumber, this.loanId, this.loanNumber, this.lines=const []});
  final String id,journalNo,status,totalDebit,totalCredit; final String? date,description,referenceType,referenceId,sourceModule,createdBy,postedBy,postedAt,reversalReference,originalJournalId,originalJournalNo,reversalJournalId,reversalJournalNo,customerId,customerName,customerNumber,loanId,loanNumber; final List<JournalLine> lines;
  String get customerLabel => [customerNumber, customerName].where((v)=>v!=null&&v.isNotEmpty).join('\n').isNotEmpty ? [customerNumber, customerName].where((v)=>v!=null&&v.isNotEmpty).join('\n') : lines.map((l)=>l.customerLabel).firstWhere((v)=>v.isNotEmpty,orElse:()=>'-');
  String get loanLabel => (loanNumber?.isNotEmpty??false) ? loanNumber! : lines.map((l)=>l.loanLabel).firstWhere((v)=>v.isNotEmpty,orElse:()=>'-');
  factory JournalEntry.fromJson(Map<String,dynamic> j)=>JournalEntry(id:_s(j,['id','journal_id']),journalNo:_s(j,['journal_no','journalNo','number','id']),date:j['date']?.toString()??j['journal_date']?.toString(),description:j['description']?.toString(),referenceType:j['reference_type']?.toString(),referenceId:j['reference_id']?.toString(),sourceModule:j['source_module']?.toString(),status:(j['status']??'DRAFT').toString(),totalDebit:(j['total_debit']??j['totalDebit']??0).toString(),totalCredit:(j['total_credit']??j['totalCredit']??0).toString(),createdBy:j['created_by']?.toString(),postedBy:j['posted_by']?.toString(),postedAt:j['posted_at']?.toString(),reversalReference:j['reversal_reference']?.toString()??j['reversal_journal_no']?.toString(),originalJournalId:j['original_journal_id']?.toString(),originalJournalNo:j['original_journal_no']?.toString(),reversalJournalId:j['reversal_journal_id']?.toString(),reversalJournalNo:j['reversal_journal_no']?.toString(),customerId:j['customer_id']?.toString(),customerName:j['customer_name']?.toString()??j['customer']?.toString(),customerNumber:j['customer_number']?.toString(),loanId:j['loan_id']?.toString(),loanNumber:j['loan_number']?.toString()??j['loan']?.toString(),lines:((j['lines']??[]) as List).whereType<Map<String,dynamic>>().map(JournalLine.fromJson).toList()); }
class JournalLine { JournalLine({required this.lineNo,this.accountCode,this.accountName,this.accountType,this.description,this.customerId,this.customerName,this.customerNumber,this.loanId,this.loanNumber,this.debit='0',this.credit='0'}); final int lineNo; final String? accountCode,accountName,accountType,description,customerId,customerName,customerNumber,loanId,loanNumber; final String debit,credit; String get customerLabel=>[customerNumber,customerName].where((v)=>v!=null&&v.isNotEmpty).join('\n'); String get loanLabel=>loanNumber??''; factory JournalLine.fromJson(Map<String,dynamic> j)=>JournalLine(lineNo:int.tryParse((j['line_no']??j['lineNo']??1).toString())??1,accountCode:j['account_code']?.toString(),accountName:j['account_name']?.toString(),accountType:j['account_type']?.toString(),description:j['description']?.toString(),customerId:j['customer_id']?.toString(),customerName:j['customer_name']?.toString()??(j['customer']?.toString().startsWith('Customer ID')==true?null:j['customer']?.toString()),customerNumber:j['customer_number']?.toString(),loanId:j['loan_id']?.toString(),loanNumber:j['loan_number']?.toString()??(j['loan']?.toString().startsWith('Loan ID')==true?null:j['loan']?.toString()),debit:(j['debit']??0).toString(),credit:(j['credit']??0).toString()); }

String humanReferenceType(String? value) { final v=(value??'').trim(); const labels={'LOAN_DISBURSEMENT':'Loan Disbursement','LOAN_PAYMENT':'Loan Payment','MANUAL_JOURNAL':'Manual Journal','REVERSAL':'Reversal'}; return labels[v] ?? (v.isEmpty ? '-' : v.toLowerCase().split('_').map((p)=>p.isEmpty?p:'${p[0].toUpperCase()}${p.substring(1)}').join(' ')); }


Map<String, dynamic> parseFinancialPositionResponse(Map<String, dynamic> j) {
  for (final k in ['has_activity', 'is_empty']) {
    if (!j.containsKey(k)) throw FormatException('Statement of financial position response is missing $k.');
  }
  final out = Map<String, dynamic>.from(j);
  out['has_activity'] = parseAccountingBool(j['has_activity']);
  out['is_empty'] = parseAccountingBool(j['is_empty']);
  out['warnings'] = j['warnings'] is List ? j['warnings'] : const [];
  out['validation'] = j['validation'] is Map ? j['validation'] : const {};
  out['totals'] = j['totals'] is Map ? j['totals'] : <String, dynamic>{
    'total_assets': j['total_assets'],
    'total_liabilities': j['total_liabilities'],
    'total_equity': j['total_equity'],
    'balancing_difference': j['balancing_difference'],
  };
  return out;
}
