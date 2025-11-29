const baseUrl = 'https://grow-microfinance-api-production.up.railway.app';
const storageKeys = { token: 'gm_jwt', role: 'gm_role' };

const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-message');
const loginSubmit = document.querySelector('#login-submit');
const loginSubmitLabel = document.querySelector('#login-submit-label');
const loginSpinner = document.querySelector('#login-spinner');
const dashboards = document.querySelector('#dashboards');
const userRoleChip = document.querySelector('#user-role');
const logoutBtn = document.querySelector('#logout-btn');

const adminPanel = document.querySelector('#admin-panel');
const adminMetrics = document.querySelector('#admin-metrics');

const staffPanel = document.querySelector('#staff-panel');
const staffCollections = document.querySelector('#staff-collections');

const customerPanel = document.querySelector('#customer-panel');
const customerSummary = document.querySelector('#customer-summary');
const customerLoans = document.querySelector('#customer-loans');
const customerName = document.querySelector('#customer-name');
const customerEmail = document.querySelector('#customer-email');
const customerRoleLabel = document.querySelector('#customer-role-label');
const customerApplications = document.querySelector('#customer-applications');
const applicationTemplate = document.querySelector('#application-template');
const newApplicationBtn = document.querySelector('#new-application-btn');
const refreshApplicationsBtn = document.querySelector('#refresh-applications');
const applicationFormCard = document.querySelector('#application-form-card');
const loanApplicationForm = document.querySelector('#loan-application-form');
const applicationFormMessage = document.querySelector('#application-form-message');
const loanTypeSelect = document.querySelector('#loan-type-select');
const closeApplicationForm = document.querySelector('#close-application-form');

const loanTypes = [
  'Grow Online Business Loan',
  'Grow Business Loan',
  'Grow Personal Loan',
  'Grow Team Loan',
];

let cachedProfile = null;
let cachedLoans = [];
let cachedApplications = [];

function setMessage(text, type = 'info') {
  loginMessage.textContent = text;
  loginMessage.className = 'alert ' + (type === 'error' ? 'error' : 'success');
  loginMessage.classList.toggle('hidden', !text);
}

function setLoading(isLoading) {
  loginSubmit.disabled = isLoading;
  loginSpinner.classList.toggle('hidden', !isLoading);
  loginSubmitLabel.textContent = isLoading ? 'Signing in...' : 'Sign in';
}

function saveSession(token, role) {
  localStorage.setItem(storageKeys.token, token);
  localStorage.setItem(storageKeys.role, role);
}

function clearSession() {
  localStorage.removeItem(storageKeys.token);
  localStorage.removeItem(storageKeys.role);
}

function getSession() {
  return {
    token: localStorage.getItem(storageKeys.token),
    role: localStorage.getItem(storageKeys.role),
  };
}

async function api(path, { method = 'GET', body } = {}) {
  const { token } = getSession();
  const headers = { 'Content-Type': 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || data.error || 'Request failed';
    throw new Error(message);
  }
  return data;
}

function formatCurrency(value) {
  const amount = Number(value ?? 0);
  return amount ? `$${amount.toFixed(2)}` : '—';
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}

function setInlineAlert(target, text, type = 'success') {
  if (!target) return;
  target.textContent = text;
  target.className = `alert ${type === 'error' ? 'error' : 'success'}`;
  target.classList.toggle('hidden', !text);
}

function showApplicationForm(show = true) {
  if (!applicationFormCard) return;
  applicationFormCard.classList.toggle('hidden', !show);
  if (show) {
    setInlineAlert(applicationFormMessage, '');
  }
}

function populateLoanTypes() {
  if (!loanTypeSelect) return;
  loanTypeSelect.innerHTML = '';
  loanTypes.forEach((type) => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    loanTypeSelect.appendChild(option);
  });
}

function togglePanels(role) {
  dashboards.classList.toggle('hidden', !role);
  userRoleChip.classList.toggle('hidden', !role);
  logoutBtn.classList.toggle('hidden', !role);
  document.querySelector('#login-card').classList.toggle('hidden', !!role);

  adminPanel.classList.toggle('hidden', role !== 'admin');
  staffPanel.classList.toggle('hidden', role !== 'staff');
  customerPanel.classList.toggle('hidden', role !== 'customer');

  if (role) {
    userRoleChip.textContent = role;
  }
}

function renderMetrics(container, metrics) {
  container.innerHTML = '';
  const template = document.querySelector('#metric-template');
  metrics.forEach((metric) => {
    const node = template.content.cloneNode(true);
    node.querySelector('.metric-label').textContent = metric.label;
    node.querySelector('.metric-value').textContent = metric.value;
    node.querySelector('.metric-hint').textContent = metric.hint;
    container.appendChild(node);
  });
}

function renderCollections(items) {
  staffCollections.innerHTML = '';
  const template = document.querySelector('#collection-template');
  if (!items.length) {
    staffCollections.innerHTML = '<p class="muted">No collections for today.</p>';
    return;
  }
  items.forEach((item) => {
    const node = template.content.cloneNode(true);
    node.querySelector('.item-title').textContent = item.customer || 'Collection';
    node.querySelector('.item-subtitle').textContent =
      `Due: ${item.dueDate || '—'} · Reference: ${item.reference || '—'}`;
    node.querySelector('.pill').textContent =
      typeof item.amount === 'number' ? `$${item.amount.toFixed(2)}` : item.amount;
    staffCollections.appendChild(node);
  });
}

function renderLoans(loans) {
  customerLoans.innerHTML = '';
  const template = document.querySelector('#loan-template');
  if (!loans.length) {
    customerLoans.innerHTML = '<p class="muted">No active loans.</p>';
    return;
  }
  loans.forEach((loan) => {
    const node = template.content.cloneNode(true);
    const title = loan.product ?? loan.name ?? 'Loan';
    node.querySelector('.item-title').textContent = title;
    const amount = loan.amount ?? loan.approved_amount;
    const balance = loan.balance ?? loan.outstanding_balance ?? amount;
    node.querySelector('.item-subtitle').textContent =
      `Balance: ${formatCurrency(balance)}${amount ? ` · Amount: ${formatCurrency(amount)}` : ''}`;
    node.querySelector('.pill').textContent = loan.status ?? 'Unknown';
    customerLoans.appendChild(node);
  });
}

function renderProfile(profile) {
  if (!profile) return;
  const name = profile.name || profile.full_name || profile.email || 'Customer';
  const email = profile.email || profile.username || '';
  if (customerName) customerName.textContent = name;
  if (customerEmail) customerEmail.textContent = email || '—';
  if (customerRoleLabel) customerRoleLabel.textContent = (profile.role || 'Customer').toUpperCase();
}

function renderApplications(applications) {
  customerApplications.innerHTML = '';
  const template = applicationTemplate;
  if (!applications.length) {
    customerApplications.innerHTML = '<p class="muted">No applications yet.</p>';
    return;
  }

  applications.forEach((app) => {
    const node = template.content.cloneNode(true);
    const title = app.application_number
      ? `Application #${app.application_number}`
      : `Application ${app.id}`;
    const tenure = app.tenure_months ?? app.loan_details?.tenure_months;
    const amount = app.applied_amount ?? app.loan_details?.applied_amount;
    const loanType = app.loan_type ?? app.loanDetails?.loan_type ?? 'Loan';
    node.querySelector('.application-title').textContent = title;
    node.querySelector('.application-meta').textContent =
      `${loanType} • ${amount ? formatCurrency(amount) : 'Amount pending'}${
        tenure ? ` • ${tenure} mo` : ''
      }`;
    node.querySelector('.application-purpose').textContent =
      app.loan_purpose || app.loan_details?.loan_purpose || 'No purpose provided yet';
    node.querySelector('.application-status').textContent = app.status || 'DRAFT';
    node.querySelector('.application-date').textContent =
      formatDate(app.created_at || app.createdAt) || '';
    customerApplications.appendChild(node);
  });
}

async function loadAdmin() {
  const data = await api('/admin/dashboard');
  const metrics = [
    { label: 'Total customers', value: data.total_customers ?? '—', hint: 'Across all segments' },
    { label: 'Active loans', value: data.active_loans ?? '—', hint: 'Current portfolio' },
    { label: 'Payments today', value: data.payments_today ?? '—', hint: 'Recorded settlements' },
  ];
  renderMetrics(adminMetrics, metrics);
}

async function loadStaff() {
  const data = await api('/staff/today-collections');
  renderCollections(data.collections || data || []);
}

async function loadCustomer() {
  const profile = await api('/customer/me');
  cachedProfile = profile;
  renderProfile(profile);

  const loansResponse = await api('/customer/loans');
  const loans = Array.isArray(loansResponse) ? loansResponse : loansResponse.loans || [];
  cachedLoans = loans;
  const activeLoans = loans.filter((loan) => (loan.status || '').toLowerCase() === 'active').length;
  const metrics = [
    { label: 'Name', value: profile.name || profile.email || '—', hint: 'Profile' },
    { label: 'Total loans', value: loans.length ?? '0', hint: 'Active + past' },
    { label: 'Active loans', value: activeLoans, hint: 'Currently repaying' },
  ];
  renderMetrics(customerSummary, metrics);
  renderLoans(loans);
  await loadApplications();
}

async function loadApplications() {
  const data = await api('/api/loan-applications');
  const applications = Array.isArray(data) ? data : data.applications || [];
  cachedApplications = applications;
  renderApplications(applications);
}

async function hydrateFromSession() {
  const { token, role } = getSession();
  if (!token || !role) return;

  togglePanels(role);
  setMessage('Restored previous session.', 'success');

  try {
    if (role === 'admin') await loadAdmin();
    if (role === 'staff') await loadStaff();
    if (role === 'customer') await loadCustomer();
  } catch (err) {
    console.error(err);
    setMessage('Session expired. Please sign in again.', 'error');
    clearSession();
    togglePanels(null);
  }
}

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('');
  setLoading(true);

  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const data = await api('/auth/login', { method: 'POST', body: payload });
    if (!data.access_token || !data.role) {
      throw new Error('Invalid response from server.');
    }
    saveSession(data.access_token, data.role);
    togglePanels(data.role);
    setMessage('Signed in successfully.', 'success');

    if (data.role === 'admin') await loadAdmin();
    if (data.role === 'staff') await loadStaff();
    if (data.role === 'customer') await loadCustomer();
  } catch (err) {
    console.error(err);
    setMessage(err.message, 'error');
    clearSession();
    togglePanels(null);
  } finally {
    setLoading(false);
  }
});

logoutBtn?.addEventListener('click', () => {
  clearSession();
  togglePanels(null);
  setMessage('You have been signed out.', 'success');
});

function buildApplicationPayload(formData) {
  const values = Object.fromEntries(formData.entries());
  const hasExistingLoans = formData.get('has_existing_loans') === 'on';

  const applicantDetails = {
    full_name: cachedProfile?.name || values.full_name || '',
    email: cachedProfile?.email || values.email || '',
    mobile: values.mobile || cachedProfile?.mobile || cachedProfile?.phone || '',
    has_existing_loans: hasExistingLoans,
    existing_loans_description: values.existing_loans_description || '',
  };

  if (values.monthly_income) {
    applicantDetails.monthly_income = Number(values.monthly_income) || 0;
  }
  if (values.monthly_expenses) {
    applicantDetails.monthly_expenses = Number(values.monthly_expenses) || 0;
  }

  return {
    loan_type: values.loan_type,
    loan_purpose: values.loan_purpose,
    loan_details: {
      applied_amount: Number(values.applied_amount) || 0,
      tenure_months: Number(values.tenure_months) || 0,
      loan_purpose: values.loan_purpose,
    },
    applicant_details: applicantDetails,
    type_specific: {
      employment_status: values.employment_status || '',
    },
  };
}

newApplicationBtn?.addEventListener('click', () => {
  showApplicationForm(true);
  loanApplicationForm?.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

closeApplicationForm?.addEventListener('click', () => {
  showApplicationForm(false);
});

refreshApplicationsBtn?.addEventListener('click', async () => {
  try {
    await loadApplications();
    setInlineAlert(applicationFormMessage, 'Applications refreshed.', 'success');
  } catch (err) {
    console.error(err);
    setInlineAlert(applicationFormMessage, err.message, 'error');
  }
});

loanApplicationForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setInlineAlert(applicationFormMessage, '');
  const payload = buildApplicationPayload(new FormData(loanApplicationForm));

  try {
    setInlineAlert(applicationFormMessage, 'Saving draft...', 'success');
    const app = await api('/api/loan-applications', { method: 'POST', body: payload });
    cachedApplications = [...cachedApplications.filter((existing) => existing.id !== app.id), app];
    setInlineAlert(applicationFormMessage, 'Draft saved successfully.', 'success');
    loanApplicationForm.reset();
    populateLoanTypes();
    await loadApplications();
  } catch (err) {
    console.error(err);
    setInlineAlert(applicationFormMessage, err.message || 'Unable to save application', 'error');
  }
});

populateLoanTypes();
hydrateFromSession();
