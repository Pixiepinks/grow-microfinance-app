const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(new URL('app.js', `file://${__dirname}/`), 'utf8');
const functionSource = ['bankTransactionCandidate', 'getBankReconciliationTransactions', 'getJournalLineId', 'normalizeBankGlLine']
  .map((name) => {
    const start = source.indexOf(`function ${name}(`);
    assert.notEqual(start, -1, `${name} must exist`);
    let depth = 0;
    let bodyStarted = false;
    const bodyStart = source.indexOf('){', start) + 1;
    assert.notEqual(bodyStart, 0, `${name} must have a function body`);
    for (let index = bodyStart; index < source.length; index += 1) {
      if (source[index] === '{') { depth += 1; bodyStarted = true; }
      if (source[index] === '}') depth -= 1;
      if (bodyStarted && depth === 0) return source.slice(start, index + 1);
    }
    throw new Error(`Could not extract ${name}`);
  })
  .join('\n');
const context = {};
vm.runInNewContext(`${functionSource};this.helpers={getBankReconciliationTransactions,getJournalLineId,normalizeBankGlLine}`, context);
const { getBankReconciliationTransactions, getJournalLineId, normalizeBankGlLine } = context.helpers;

const row = { journal_line_id: 41, posting_date: '2026-02-01', journal_number: 'JE-41', debit_amount: '25.00' };
assert.equal(getBankReconciliationTransactions({ transactions: [row] })[0].journal_line_id, 41);
assert.equal(getBankReconciliationTransactions({ data: { transactions: [row] } })[0].journal_line_id, 41);
assert.equal(getBankReconciliationTransactions({ eligible_transactions: [row] })[0].journal_line_id, 41);
assert.equal(getBankReconciliationTransactions([row])[0].journal_line_id, 41);

const normalized = normalizeBankGlLine({ line_id: 8, entry_id: 3, transaction_date: '2026-02-02', narration: 'Deposit', source_reference: 'NDB-8', credit_amount: '10.50' });
assert.equal(normalized.isReconcilable, false);
assert.equal(normalized.journalStatus, '');
assert.match(normalized.blockReason, /not eligible/i);
assert.equal(normalizeBankGlLine({ journal_line_id: 20, is_posted: true, is_reconciled: false }).isReconcilable, true);
assert.equal(normalizeBankGlLine({ journal_line_id: 21, is_reconcilable: true }).isReconcilable, true);
assert.equal(normalizeBankGlLine({ journal_line_id: 22, is_posted: true, is_reconciled: true }).isReconcilable, false);
assert.equal(normalizeBankGlLine({ journal_line_id: 23, journal_status: 'DRAFT', reconciliation_block_reason: 'Journal entry is not posted.' }).blockReason, 'Journal entry is not posted.');
assert.equal(getJournalLineId({ journal_line_id: 11, line_id: 12, gl_line_id: 13, id: 14 }), 11);
assert.equal(getJournalLineId({ line_id: 12, gl_line_id: 13, id: 14 }), 12);
assert.equal(getJournalLineId({ gl_line_id: 13, id: 14 }), 13);
assert.equal(getJournalLineId({ id: 14 }), 14);
assert.equal(normalizeBankGlLine({ journal_line_id: 19, journal_entry_id: 5 }).id, 19);
assert.equal(normalizeBankGlLine({ journal_line_id: null, journal_entry_id: 5 }).id, null);

assert.match(source, /\/transactions`\)/, 'a separate transaction endpoint must be loaded when detail has no line array');
assert.match(source, /Unable to load bank GL transactions\./, 'line failures must not render the empty state');
assert.match(source, /data-br-retry-lines/, 'line failures must offer Retry');
assert.match(source, /requestId!==bankReconciliationState\.requestSequence/, 'stale requests must be ignored');
assert.match(source, /class="bank-reconciliation-line-checkbox" value="\$\{escapeHtml\(line\.id\)\}" data-journal-line-id="\$\{escapeHtml\(line\.id\)\}"/, 'unreconciled checkboxes must expose the journal-line ID');
assert.match(source, /journal_line_ids:journalLineIds/, 'the POST payload must use a journal_line_ids array');
assert.match(source, /\.bank-reconciliation-line-checkbox:checked/, 'selected IDs must be collected from checked boxes at click time');
assert.match(source, /filter\(value=>eligibleIds\.has\(String\(value\)\)\)/, 'checked IDs must be intersected with eligible rows');
assert.match(source, /Number\.isInteger\(value\)&&value>0/, 'journal-line IDs must be positive integers');
assert.match(source, /Select at least one posted bank GL transaction\./, 'empty eligible selections must be rejected before the API call');
assert.match(source, /The following transactions cannot be reconciled:/, 'structured invalid-line errors must identify rejected transactions');
assert.match(source, /reconciliation_block_reason/, 'the API reconciliation block reason must be displayed');

console.log('Bank reconciliation transaction tests passed.');
