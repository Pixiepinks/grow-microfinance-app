const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');

const source = fs.readFileSync(new URL('app.js', `file://${__dirname}/`), 'utf8');
const functionSource = ['bankTransactionCandidate', 'getBankReconciliationTransactions', 'normalizeBankGlLine']
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
vm.runInNewContext(`${functionSource};this.helpers={getBankReconciliationTransactions,normalizeBankGlLine}`, context);
const { getBankReconciliationTransactions, normalizeBankGlLine } = context.helpers;

const row = { journal_line_id: 41, posting_date: '2026-02-01', journal_number: 'JE-41', debit_amount: '25.00' };
assert.equal(getBankReconciliationTransactions({ transactions: [row] })[0].journal_line_id, 41);
assert.equal(getBankReconciliationTransactions({ data: { transactions: [row] } })[0].journal_line_id, 41);
assert.equal(getBankReconciliationTransactions({ eligible_transactions: [row] })[0].journal_line_id, 41);
assert.equal(getBankReconciliationTransactions([row])[0].journal_line_id, 41);

const normalized = normalizeBankGlLine({ line_id: 8, entry_id: 3, transaction_date: '2026-02-02', narration: 'Deposit', source_reference: 'NDB-8', credit_amount: '10.50' });
assert.deepEqual(JSON.parse(JSON.stringify(normalized)), { id: 8, journalEntryId: 3, journalNumber: '—', date: '2026-02-02', description: 'Deposit', reference: 'NDB-8', debit: '0.00', credit: '10.50', runningBalance: '0.00', isReconciled: false, raw: { line_id: 8, entry_id: 3, transaction_date: '2026-02-02', narration: 'Deposit', source_reference: 'NDB-8', credit_amount: '10.50' } });

assert.match(source, /\/transactions`\)/, 'a separate transaction endpoint must be loaded when detail has no line array');
assert.match(source, /Unable to load bank GL transactions\./, 'line failures must not render the empty state');
assert.match(source, /data-br-retry-lines/, 'line failures must offer Retry');
assert.match(source, /requestId!==bankReconciliationState\.requestSequence/, 'stale requests must be ignored');
assert.match(source, /data-br-line=.*line\.id/, 'unreconciled rows must use journal-line IDs in checkboxes');

console.log('Bank reconciliation transaction tests passed.');
