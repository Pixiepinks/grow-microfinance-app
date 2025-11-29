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
    node.querySelector('.item-title').textContent = loan.product ?? 'Loan';
    node.querySelector('.item-subtitle').textContent =
      `Balance: $${Number(loan.balance ?? 0).toFixed(2)}`;
    node.querySelector('.pill').textContent = loan.status ?? 'Unknown';
    customerLoans.appendChild(node);
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
  const loans = await api('/customer/loans');
  const metrics = [
    { label: 'Name', value: profile.name || profile.email || '—', hint: 'Profile' },
    { label: 'Total loans', value: loans.length ?? '0', hint: 'Active + past' },
  ];
  renderMetrics(customerSummary, metrics);
  renderLoans(loans);
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

hydrateFromSession();
