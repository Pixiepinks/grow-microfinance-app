import '../utils/accounting_math.dart';

String _s(Map<String, dynamic> j, List<String> keys, [String fallback = '']) {
  for (final k in keys) {
    final v = j[k];
    if (v != null && v.toString().isNotEmpty) return v.toString();
  }
  return fallback;
}

class AccountingAccount {
  AccountingAccount({required this.id, required this.code, required this.name, required this.type, required this.normalBalance, this.parentId, this.parentName, this.description, this.subtype = '', this.allowManualPosting = true, this.active = true, this.systemAccount = false, this.depth = 0, this.defaultFor = const []});
  final String id, code, name, type, normalBalance, subtype;
  final String? parentId, parentName, description;
  final bool allowManualPosting, active, systemAccount;
  final int depth;
  final List<String> defaultFor;
  String get label => '$code — $name';
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
        systemAccount: j['system_account'] ?? j['is_system'] ?? false,
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
