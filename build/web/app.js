const defaultApiConfig = {
  baseUrl: 'https://grow-microfinance-api-production.up.railway.app',
  endpoints: {
    login: '/auth/login',
    adminDashboard: '/admin/dashboard',
    staffTodayCollections: '/staff/today-collections',
    staffPayments: '/staff/payments',
    customerProfile: '/customer/me',
    customerLoans: '/customer/loans',
    customerLoanPayments: '/customer/loans/{id}/payments',
    loanApplications: '/api/loan-applications',
    customers: '/customers',
  },
};

const loanTypes = [
  'Grow Online Business Loan',
  'Grow Business Loan',
  'Grow Personal Loan',
  'Grow Team Loan',
];

const loanPurposes = {
  'Grow Online Business Loan': [
    'Inventory purchase',
    'Digital marketing',
    'Platform ads',
    'Working capital',
  ],
  'Grow Business Loan': [
    'Expand store',
    'Purchase equipment',
    'Inventory',
    'Renovation',
  ],
  'Grow Personal Loan': ['Education', 'Medical', 'Home improvement', 'Emergency'],
  'Grow Team Loan': ['Group business', 'Community project', 'Savings cycle'],
};

const documentLabels = {
  nic_front: 'NIC front',
  nic_back: 'NIC back',
  nic_selfie: 'Selfie with NIC',
  online_proof: 'Online store proof',
  business_registration: 'Business registration',
  utility_bill: 'Utility bill',
  salary_slip: 'Salary slip',
  member_list: 'Member list',
  group_photo: 'Group photo',
};

const documentsByLoanType = {
  'Grow Online Business Loan': ['nic_front', 'nic_back', 'nic_selfie', 'online_proof'],
  'Grow Business Loan': ['nic_front', 'nic_back', 'nic_selfie', 'business_registration', 'utility_bill'],
  'Grow Personal Loan': ['nic_front', 'nic_back', 'nic_selfie', 'salary_slip'],
  'Grow Team Loan': ['nic_front', 'nic_back', 'nic_selfie', 'member_list', 'group_photo'],
};

let apiConfig = { ...defaultApiConfig };

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
const closeApplicationForm = document.querySelector('#close-application-form');
const stepperIndicator = document.querySelectorAll('.stepper-indicator .step');
const formSteps = document.querySelectorAll('.form-step');
const prevStepBtn = document.querySelector('#prev-step');
const nextStepBtn = document.querySelector('#next-step');
const saveDraftBtn = document.querySelector('#save-draft');
const submitApplicationBtn = document.querySelector('#submit-application');
const loanTypeOptions = document.querySelector('#loan-type-options');
const loanTypeInput = document.querySelector('#loan-type-input');
const loanPurposeSelect = document.querySelector('#loan-purpose-select');
const documentUploads = document.querySelector('#document-uploads');
const reviewSummary = document.querySelector('#review-summary');
const reviewAlert = document.querySelector('#review-alert');
const typeSpecificFields = document.querySelectorAll('.type-specific');

let cachedProfile = null;
let cachedLoans = [];
let cachedApplications = [];
let currentStep = 0;
let currentDraftId = null;
let selectedLoanType = loanTypes[0];
const selectedDocuments = new Map();

async function loadApiConfig() {
  try {
    const response = await fetch('/api_config.json');
    if (!response.ok) throw new Error('Failed to load api_config.json');
    const data = await response.json();
    apiConfig = {
      baseUrl: data.baseUrl || defaultApiConfig.baseUrl,
      endpoints: { ...defaultApiConfig.endpoints, ...(data.endpoints || {}) },
    };
  } catch (error) {
    console.warn('Using default API config:', error.message);
    apiConfig = defaultApiConfig;
  }
}

const endpoint = (key, params = {}) => {
  let template = apiConfig.endpoints?.[key] || key;
  Object.entries(params).forEach(([param, value]) => {
    template = template.replace(`{${param}}`, value);
  });
  return template;
};

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

  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
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

async function apiMultipart(path, formData) {
  const { token } = getSession();
  const headers = token ? { Authorization: `Bearer ${token}` } : {};

  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = data.message || data.error || 'Upload failed';
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
  const data = await api(endpoint('adminDashboard'));
  const metrics = [
    { label: 'Total customers', value: data.total_customers ?? '—', hint: 'Across all segments' },
    { label: 'Active loans', value: data.active_loans ?? '—', hint: 'Current portfolio' },
    { label: 'Payments today', value: data.payments_today ?? '—', hint: 'Recorded settlements' },
  ];
  renderMetrics(adminMetrics, metrics);
}

async function loadStaff() {
  const data = await api(endpoint('staffTodayCollections'));
  renderCollections(data.collections || data || []);
}

async function loadCustomer() {
  const profile = await api(endpoint('customerProfile'));
  cachedProfile = profile;
  renderProfile(profile);

  const loansResponse = await api(endpoint('customerLoans'));
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
  const data = await api(endpoint('loanApplications'));
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

function updateStepperUI() {
  stepperIndicator.forEach((el, idx) => {
    el.classList.toggle('active', idx === currentStep);
    el.classList.toggle('completed', idx < currentStep);
  });
  formSteps.forEach((step, idx) => {
    step.classList.toggle('hidden', idx !== currentStep);
  });

  prevStepBtn.disabled = currentStep === 0;
  nextStepBtn.classList.toggle('hidden', currentStep === formSteps.length - 1);
  saveDraftBtn.classList.toggle('hidden', currentStep !== formSteps.length - 1);
  submitApplicationBtn.classList.toggle('hidden', currentStep !== formSteps.length - 1);
}

function renderLoanTypeOptions() {
  if (!loanTypeOptions) return;
  loanTypeOptions.innerHTML = '';
  loanTypes.forEach((type) => {
    const card = document.createElement('button');
    card.type = 'button';
    card.className = 'loan-type-card';
    card.dataset.loanType = type;
    card.innerHTML = `<strong>${type}</strong><p class="muted">Tap to select</p>`;
    card.addEventListener('click', () => selectLoanType(type));
    loanTypeOptions.appendChild(card);
  });
}

function selectLoanType(type) {
  selectedLoanType = type;
  loanTypeInput.value = type;
  document.querySelectorAll('.loan-type-card').forEach((card) => {
    card.classList.toggle('selected', card.dataset.loanType === type);
  });
  populateLoanPurpose();
  updateTypeSpecificVisibility();
  renderDocumentUploads();
  updateReviewSummary();
}

function populateLoanPurpose() {
  if (!loanPurposeSelect) return;
  const purposes = loanPurposes[selectedLoanType] || [];
  loanPurposeSelect.innerHTML = '';
  purposes.forEach((purpose, index) => {
    const option = document.createElement('option');
    option.value = purpose;
    option.textContent = purpose;
    if (index === 0) option.selected = true;
    loanPurposeSelect.appendChild(option);
  });
}

function updateTypeSpecificVisibility() {
  typeSpecificFields.forEach((field) => {
    const shouldShow = field.dataset.type === selectedLoanType;
    field.classList.toggle('visible', shouldShow);
    const input = field.querySelector('input');
    if (input) {
      input.required = shouldShow;
    }
  });
}

function renderDocumentUploads() {
  if (!documentUploads) return;
  documentUploads.innerHTML = '';
  const requiredDocs = documentsByLoanType[selectedLoanType] || [];
  requiredDocs.forEach((doc) => {
    const card = document.createElement('div');
    card.className = 'document-card';
    card.dataset.docType = doc;
    card.innerHTML = `
      <h5>${documentLabels[doc] || doc}</h5>
      <p class="muted">Upload ${documentLabels[doc] || doc}</p>
      <input type="file" name="${doc}" data-doc-type="${doc}" accept="image/*,.pdf" required />
    `;
    const fileInput = card.querySelector('input[type="file"]');
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files?.[0];
      if (file) {
        selectedDocuments.set(doc, file);
      } else {
        selectedDocuments.delete(doc);
      }
      updateReviewSummary();
    });
    documentUploads.appendChild(card);
  });
}

function validateStep(stepIndex) {
  const step = formSteps[stepIndex];
  if (!step) return true;
  const requiredFields = step.querySelectorAll('input[required], select[required], textarea[required]');
  for (const field of requiredFields) {
    if (field.type === 'file' && !(field.files?.length)) {
      field.reportValidity();
      return false;
    }
    if (field.type !== 'file' && !field.value) {
      field.reportValidity();
      return false;
    }
  }
  return true;
}

function buildApplicationPayload() {
  const formData = new FormData(loanApplicationForm);
  const values = Object.fromEntries(formData.entries());
  const hasExistingLoans = formData.get('has_existing_loans') === 'on';

  const applicantDetails = {
    full_name: values.full_name || cachedProfile?.name || '',
    nic: values.nic || '',
    mobile: values.mobile || cachedProfile?.mobile || cachedProfile?.phone || '',
    email: values.email || cachedProfile?.email || '',
    address_line1: values.address_line1 || '',
    address_line2: values.address_line2 || '',
    city: values.city || '',
    district: values.district || '',
    province: values.province || '',
    date_of_birth: values.date_of_birth || '',
    monthly_income: Number(values.monthly_income) || 0,
    monthly_expenses: Number(values.monthly_expenses) || 0,
    has_existing_loans: hasExistingLoans,
    existing_loans_description: values.existing_loans_description || '',
  };

  const loanDetails = {
    applied_amount: Number(values.applied_amount) || 0,
    tenure_months: Number(values.tenure_months) || 0,
    loan_purpose: values.loan_purpose || '',
  };

  const typeSpecific = {};
  switch (selectedLoanType) {
    case 'Grow Online Business Loan':
      typeSpecific.store_url = values.store_url || '';
      typeSpecific.store_platform = values.store_platform || '';
      break;
    case 'Grow Business Loan':
      typeSpecific.business_name = values.business_name || '';
      typeSpecific.business_registration = values.business_registration || '';
      break;
    case 'Grow Personal Loan':
      typeSpecific.employment_status = values.employment_status || '';
      typeSpecific.employer_name = values.employer_name || '';
      typeSpecific.guarantor_name = values.guarantor_name || '';
      typeSpecific.guarantor_contact = values.guarantor_contact || '';
      break;
    case 'Grow Team Loan':
      typeSpecific.team_name = values.team_name || '';
      typeSpecific.member_count = Number(values.member_count) || 0;
      typeSpecific.meeting_location = values.meeting_location || '';
      break;
    default:
      break;
  }

  return {
    loan_type: selectedLoanType,
    loan_purpose: values.loan_purpose || '',
    loan_details: loanDetails,
    applicant_details: applicantDetails,
    type_specific: typeSpecific,
  };
}

function updateReviewSummary() {
  if (!reviewSummary) return;
  const data = buildApplicationPayload();
  const rows = [
    ['Loan type', data.loan_type],
    ['Purpose', data.loan_details.loan_purpose],
    ['Applied amount', formatCurrency(data.loan_details.applied_amount)],
    ['Tenure', `${data.loan_details.tenure_months} months`],
    ['Full name', data.applicant_details.full_name],
    ['NIC', data.applicant_details.nic],
    ['Mobile', data.applicant_details.mobile],
    ['Email', data.applicant_details.email || '—'],
    [
      'Address',
      `${data.applicant_details.address_line1}, ${data.applicant_details.address_line2 || ''} ${
        data.applicant_details.city
      }, ${data.applicant_details.district}, ${data.applicant_details.province}`,
    ],
  ];

  reviewSummary.innerHTML = '';
  rows.forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'review-row';
    row.innerHTML = `<span>${label}</span><span>${value || '—'}</span>`;
    reviewSummary.appendChild(row);
  });

  const requiredDocs = documentsByLoanType[selectedLoanType] || [];
  const missingDocs = requiredDocs.filter((doc) => !selectedDocuments.has(doc));
  reviewAlert.textContent = missingDocs.length
    ? `Missing documents: ${missingDocs.map((d) => documentLabels[d] || d).join(', ')}`
    : '';
  reviewAlert.classList.toggle('hidden', !reviewAlert.textContent);
  reviewAlert.classList.toggle('error', !!missingDocs.length);
}

async function saveDraft(showMessage = true) {
  const payload = buildApplicationPayload();
  try {
    setInlineAlert(applicationFormMessage, 'Saving draft...', 'success');
    const endpointPath = currentDraftId
      ? `${endpoint('loanApplications')}/${currentDraftId}`
      : endpoint('loanApplications');
    const method = currentDraftId ? 'PUT' : 'POST';
    const app = await api(endpointPath, { method, body: payload });
    currentDraftId = app.id;
    cachedApplications = [...cachedApplications.filter((a) => a.id !== app.id), app];
    renderApplications(cachedApplications);
    if (showMessage) {
      setInlineAlert(applicationFormMessage, 'Draft saved successfully.', 'success');
    }
    return app;
  } catch (err) {
    console.error(err);
    setInlineAlert(applicationFormMessage, err.message || 'Unable to save application', 'error');
    throw err;
  }
}

async function uploadDocumentsIfNeeded() {
  if (!currentDraftId || selectedDocuments.size === 0) return;
  for (const [docType, file] of selectedDocuments.entries()) {
    const formData = new FormData();
    formData.append('document', file);
    formData.append('document_type', docType);
    await apiMultipart(`${endpoint('loanApplications')}/${currentDraftId}/documents`, formData);
  }
}

async function submitApplication() {
  try {
    if (!validateStep(currentStep)) return;
    await saveDraft(false);

    const requiredDocs = documentsByLoanType[selectedLoanType] || [];
    const missingDocs = requiredDocs.filter((doc) => !selectedDocuments.has(doc));
    if (missingDocs.length) {
      setInlineAlert(
        applicationFormMessage,
        `Please upload: ${missingDocs.map((d) => documentLabels[d] || d).join(', ')}`,
        'error'
      );
      return;
    }

    await uploadDocumentsIfNeeded();
    await api(`${endpoint('loanApplications')}/${currentDraftId}/submit`, { method: 'POST' });
    setInlineAlert(applicationFormMessage, 'Application submitted.', 'success');
    await loadApplications();
    applicationFormCard.classList.add('hidden');
  } catch (err) {
    console.error(err);
    setInlineAlert(applicationFormMessage, err.message || 'Unable to submit application', 'error');
  }
}

function resetApplicationForm() {
  currentStep = 0;
  currentDraftId = null;
  selectedLoanType = loanTypes[0];
  selectedDocuments.clear();
  loanApplicationForm.reset();
  selectLoanType(selectedLoanType);
  updateStepperUI();
  setInlineAlert(applicationFormMessage, '');
  updateReviewSummary();
}

function goToNextStep() {
  if (!validateStep(currentStep)) return;
  if (currentStep < formSteps.length - 1) {
    currentStep += 1;
    updateReviewSummary();
    updateStepperUI();
  }
}

function goToPrevStep() {
  if (currentStep > 0) {
    currentStep -= 1;
    updateStepperUI();
  }
}

async function bootstrap() {
  await loadApiConfig();
  renderLoanTypeOptions();
  selectLoanType(selectedLoanType);
  updateTypeSpecificVisibility();
  renderDocumentUploads();
  updateStepperUI();
  await hydrateFromSession();
}

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('');
  setLoading(true);

  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const data = await api(endpoint('login'), { method: 'POST', body: payload });
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

loanApplicationForm?.addEventListener('submit', (event) => event.preventDefault());

newApplicationBtn?.addEventListener('click', () => {
  resetApplicationForm();
  applicationFormCard.classList.remove('hidden');
  loanApplicationForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

closeApplicationForm?.addEventListener('click', () => {
  applicationFormCard.classList.add('hidden');
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

prevStepBtn?.addEventListener('click', goToPrevStep);
nextStepBtn?.addEventListener('click', goToNextStep);
saveDraftBtn?.addEventListener('click', () => saveDraft(true));
submitApplicationBtn?.addEventListener('click', submitApplication);

bootstrap();
