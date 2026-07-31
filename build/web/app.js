const adminLoanApplicationsListUrl = 'https://grow-microfinance-api-production.up.railway.app/api/loan-applications';

const defaultApiConfig = {
  baseUrl: 'https://grow-microfinance-api-production.up.railway.app',
  endpoints: {
    login: '/auth/login',
    refresh: '/auth/refresh',
    changePassword: '/auth/change-password',
    logout: '/auth/logout',
    adminDashboard: '/admin/dashboard',
    adminLoanApplications: '/admin/loan-applications',
    adminLoanApplicationsAll: '/api/loan-applications',
    adminLoans: '/admin/loans',
    adminLoanApplicationApprove: '/loan-applications/{id}/approve',
    staffTodayCollections: '/staff/today-collections',
    staffPayments: '/staff/payments',
    staffActiveLoans: '/staff/active-loans',
    staffLoanApplications: '/loan-applications',
    staffLoanApplicationApprove: '/staff/loan-applications/{id}/approve',
    loanApplicationReject: '/loan-applications/{id}/reject',
    loanApplicationDisburse: '/admin/loan-applications/{id}/disburse',
    loanApplicationDisbursementOptions: '/admin/loan-applications/{id}/disbursement-options',
    loanApplicationDisbursementPreview: '/admin/loan-applications/{id}/disbursement-preview',
    loanRepayments: '/loans/{id}/repayments',
    customerProfile: '/customer/me',
    customerLoans: '/customer/loans',
    customerLoanPayments: '/customer/loans/{id}/payments',
    loanApplications: '/loan-applications',
    adminCustomers: '/customers',
    customers: '/customers',
    leads: '/leads',
    leadConvert: '/leads/{id}/convert-to-customer',
    customerNormalizedProfile: '/admin/customers/{id}/profile-normalized',
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

function mapDocumentTypeToApi(docType) {
  switch ((docType || '').toLowerCase()) {
    case 'nic_front':
      return 'NIC_FRONT';
    case 'nic_back':
      return 'NIC_BACK';
    case 'nic_selfie':
      return 'SELFIE_NIC';
    case 'online_proof':
      return 'STORE_SCREENSHOT';
    case 'salary_slip':
      return 'SALARY_SLIP';
    case 'member_list':
      return 'MEMBER_LIST';
    case 'group_photo':
      return 'GROUP_PHOTO';
    default:
      return (docType || '').toUpperCase();
  }
}

let apiConfig = { ...defaultApiConfig };

const storageKeys = {
  token: 'gm_jwt',
  refreshToken: 'gm_refresh_token',
  accessExpiresAt: 'gm_access_expires_at',
  refreshExpiresAt: 'gm_refresh_expires_at',
  role: 'gm_role',
  user: 'gm_user_state',
};

const appShell = document.querySelector('.app-shell');
const appMain = document.querySelector('.app-main');
const loginCard = document.querySelector('#login-card');
const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-message');
const loginSubmit = document.querySelector('#login-submit');
const loginSubmitLabel = document.querySelector('#login-submit-label');
loginForm?.querySelector('input[name="email"]')?.setAttribute('autocomplete', 'username');
const loginSpinner = document.querySelector('#login-spinner');
const dashboards = document.querySelector('#dashboards');
const userRoleChip = document.querySelector('#user-role');
const logoutBtn = document.querySelector('#logout-btn');
let changePasswordBtn;

let toastContainer;

const adminPanel = document.querySelector('#admin-panel');
const adminMetrics = document.querySelector('#admin-metrics');
const adminApplications = document.querySelector('#admin-applications');
const adminApplicationsMessage = document.querySelector('#admin-applications-message');
const adminMenuItems = document.querySelectorAll('.admin-menu-item');
const adminSections = document.querySelectorAll('.admin-section');
const adminLoanApplicationsSection = document.querySelector('[data-section="loan-applications"]');
const adminLoansSection = document.querySelector('.admin-section[data-section="loans"]');
const loanAppRoutePlaceholder = document.querySelector('#loan-app-route-placeholder');
const loanAppRouteTitle = document.querySelector('#loan-app-route-title');
const loanAppRouteDescription = document.querySelector('#loan-app-route-description');
const loanAppRouteBack = document.querySelector('#loan-app-route-back');
const loanAppRouteGrid = document.querySelector('#loan-app-route-grid');
const adminCustomersMessage = document.querySelector('#admin-customers-message');
const adminCustomersTableBody = document.querySelector('#admin-customers-table-body');
const adminCustomersTableWrapper = document.querySelector('#admin-customers-table-wrapper');
const adminCustomersLoading = document.querySelector('#admin-customers-loading');
const adminCustomersEmptyState = document.querySelector('#admin-customers-empty');
const refreshCustomersBtn = document.querySelector('#refresh-customers-btn');
const adminCustomersFilters = document.querySelector('.customers-table-card .filters');
const adminCustomersTable = document.querySelector('#admin-customers-table');
const adminKycQueueMessage = document.querySelector('#admin-kyc-queue-message');
const adminKycQueueTableBody = document.querySelector('#admin-kyc-queue-table-body');
const adminKycQueueTableWrapper = document.querySelector('#admin-kyc-queue-table-wrapper');
const adminKycQueueLoading = document.querySelector('#admin-kyc-queue-loading');
const adminKycQueueEmptyState = document.querySelector('#admin-kyc-queue-empty');
const refreshKycQueueBtn = document.querySelector('#refresh-kyc-queue-btn');
const adminLeadsSection = document.querySelector('.admin-section[data-section="leads"]');
const adminLeadsMessage = document.querySelector('#admin-leads-message');
const adminLeadsTableBody = document.querySelector('#admin-leads-table-body');
const adminLeadsTableWrapper = document.querySelector('#admin-leads-table-wrapper');
const adminLeadsLoading = document.querySelector('#admin-leads-loading');
const adminLeadsEmptyState = document.querySelector('#admin-leads-empty');
const refreshLeadsBtn = document.querySelector('#refresh-leads-btn');
const createCustomerBtn = document.querySelector('#create-customer-btn');
const customerRoutePlaceholder = document.querySelector('#customer-route-placeholder');
const customerRouteTitle = document.querySelector('#customer-route-title');
const customerRouteDescription = document.querySelector('#customer-route-description');
const customerRoutePath = document.querySelector('#customer-route-path');
const customerRouteBack = document.querySelector('#customer-route-back');
const customerRouteGrid = document.querySelector(
  '.admin-section[data-section="customers"] .subcard-grid'
);
const customerRouteContent = document.querySelector('#customer-route-content');
const applyLoanModal = document.querySelector('#apply-loan-modal');
const applyLoanModalClose = document.querySelector('#close-apply-loan-modal');
const applyLoanModalBody = document.querySelector('#apply-loan-modal-body');
const applyLoanModalDialog = document.querySelector('#apply-loan-modal .app-modal-dialog');
const overlayBodyClasses = ['modal-open', 'drawer-open', 'loading', 'overlay-active', 'no-scroll'];
let customerRouteViews = document.querySelectorAll('[data-customer-view]');
let customerDetailView;
let customerDetailMessage;
let customerDetailLoading;
let customerDetailBody;
let customerDetailBackBtn;
const customerDetailState = {
  customer: null,
  loading: false,
  error: null,
  customerId: null,
  documents: [],
  documentsLoading: false,
  documentsError: null,
};
const customerDetailEditState = {
  isEditing: false,
  isSaving: false,
  values: {
    nic_number: '',
    address: '',
    business_type: '',
  },
};

const customerKycProfileState = {
  dateOfBirth: '',
  civilStatus: '',
  permanentAddressLine1: '',
  permanentAddressLine2: '',
  permanentCity: '',
  permanentDistrict: '',
  permanentProvince: '',
  permanentPostalCode: '',
  currentAddressLine1: '',
  currentAddressLine2: '',
  currentCity: '',
  currentDistrict: '',
  currentProvince: '',
  currentPostalCode: '',
  currentAddressSince: '',
  householdSize: '',
  dependentsCount: '',
  customerType: '',
  employerName: '',
  employerAddress: '',
  occupation: '',
  monthlyIncome: '',
  businessName: '',
  businessAddress: '',
  guarantorName: '',
  guarantorRelationship: '',
  guarantorMobile: '',
  consentDataProcessing: false,
  consentCreditChecks: false,
};

const customerKycProfileInputs = {};
let kycExtendedViewCollapsed = false;
let kycExtendedEditMode = false;
let customerKycProfile = null;

function registerCustomerKycInput(key, input) {
  if (!key || !input) return;
  customerKycProfileInputs[key] = input;

  const value = customerKycProfileState[key];
  if (input.type === 'checkbox') {
    input.checked = !!value;
  } else if (value !== undefined && value !== null) {
    input.value = value;
  }
}

function setCustomerKycProfileField(key, value) {
  if (!Object.prototype.hasOwnProperty.call(customerKycProfileState, key)) return;

  let normalizedValue = value;
  if (key === 'consentDataProcessing' || key === 'consentCreditChecks') {
    normalizedValue = !!value;
  } else if (value === null || value === undefined) {
    normalizedValue = '';
  }

  customerKycProfileState[key] = normalizedValue;

  const input = customerKycProfileInputs[key];
  if (input) {
    if (input.type === 'checkbox') input.checked = !!normalizedValue;
    else input.value = normalizedValue || '';
  }
}

const setDateOfBirth = (value) => setCustomerKycProfileField('dateOfBirth', value || '');
const setCivilStatus = (value) => setCustomerKycProfileField('civilStatus', value || '');
const setPermanentAddressLine1 = (value) =>
  setCustomerKycProfileField('permanentAddressLine1', value || '');
const setPermanentAddressLine2 = (value) =>
  setCustomerKycProfileField('permanentAddressLine2', value || '');
const setPermanentCity = (value) => setCustomerKycProfileField('permanentCity', value || '');
const setPermanentDistrict = (value) =>
  setCustomerKycProfileField('permanentDistrict', value || '');
const setPermanentProvince = (value) =>
  setCustomerKycProfileField('permanentProvince', value || '');
const setPermanentPostalCode = (value) =>
  setCustomerKycProfileField('permanentPostalCode', value || '');
const setCurrentAddressLine1 = (value) =>
  setCustomerKycProfileField('currentAddressLine1', value || '');
const setCurrentAddressLine2 = (value) =>
  setCustomerKycProfileField('currentAddressLine2', value || '');
const setCurrentCity = (value) => setCustomerKycProfileField('currentCity', value || '');
const setCurrentDistrict = (value) => setCustomerKycProfileField('currentDistrict', value || '');
const setCurrentProvince = (value) => setCustomerKycProfileField('currentProvince', value || '');
const setCurrentPostalCode = (value) => setCustomerKycProfileField('currentPostalCode', value || '');
const setCurrentAddressSince = (value) =>
  setCustomerKycProfileField('currentAddressSince', value || '');
const setHouseholdSize = (value) => setCustomerKycProfileField('householdSize', value || '');
const setDependentsCount = (value) => setCustomerKycProfileField('dependentsCount', value || '');
const setCustomerType = (value) => setCustomerKycProfileField('customerType', value || '');
const setEmployerName = (value) => setCustomerKycProfileField('employerName', value || '');
const setEmployerAddress = (value) => setCustomerKycProfileField('employerAddress', value || '');
const setOccupation = (value) => setCustomerKycProfileField('occupation', value || '');
const setMonthlyIncome = (value) => setCustomerKycProfileField('monthlyIncome', value || '');
const setBusinessName = (value) => setCustomerKycProfileField('businessName', value || '');
const setBusinessAddress = (value) => setCustomerKycProfileField('businessAddress', value || '');
const setGuarantorName = (value) => setCustomerKycProfileField('guarantorName', value || '');
const setGuarantorRelationship = (value) =>
  setCustomerKycProfileField('guarantorRelationship', value || '');
const setGuarantorMobile = (value) => setCustomerKycProfileField('guarantorMobile', value || '');
const setConsentDataProcessing = (value) =>
  setCustomerKycProfileField('consentDataProcessing', !!value);
const setConsentCreditChecks = (value) =>
  setCustomerKycProfileField('consentCreditChecks', !!value);

const customerKycProfileSetters = {
  dateOfBirth: setDateOfBirth,
  civilStatus: setCivilStatus,
  permanentAddressLine1: setPermanentAddressLine1,
  permanentAddressLine2: setPermanentAddressLine2,
  permanentCity: setPermanentCity,
  permanentDistrict: setPermanentDistrict,
  permanentProvince: setPermanentProvince,
  permanentPostalCode: setPermanentPostalCode,
  currentAddressLine1: setCurrentAddressLine1,
  currentAddressLine2: setCurrentAddressLine2,
  currentCity: setCurrentCity,
  currentDistrict: setCurrentDistrict,
  currentProvince: setCurrentProvince,
  currentPostalCode: setCurrentPostalCode,
  currentAddressSince: setCurrentAddressSince,
  householdSize: setHouseholdSize,
  dependentsCount: setDependentsCount,
  customerType: setCustomerType,
  employerName: setEmployerName,
  employerAddress: setEmployerAddress,
  occupation: setOccupation,
  monthlyIncome: setMonthlyIncome,
  businessName: setBusinessName,
  businessAddress: setBusinessAddress,
  guarantorName: setGuarantorName,
  guarantorRelationship: setGuarantorRelationship,
  guarantorMobile: setGuarantorMobile,
  consentDataProcessing: setConsentDataProcessing,
  consentCreditChecks: setConsentCreditChecks,
};

function resetCustomerKycProfileState() {
  setDateOfBirth('');
  setCivilStatus('');
  setPermanentAddressLine1('');
  setPermanentAddressLine2('');
  setPermanentCity('');
  setPermanentDistrict('');
  setPermanentProvince('');
  setPermanentPostalCode('');
  setCurrentAddressLine1('');
  setCurrentAddressLine2('');
  setCurrentCity('');
  setCurrentDistrict('');
  setCurrentProvince('');
  setCurrentPostalCode('');
  setCurrentAddressSince('');
  setHouseholdSize('');
  setDependentsCount('');
  setCustomerType('');
  setEmployerName('');
  setEmployerAddress('');
  setOccupation('');
  setMonthlyIncome('');
  setBusinessName('');
  setBusinessAddress('');
  setGuarantorName('');
  setGuarantorRelationship('');
  setGuarantorMobile('');
  setConsentDataProcessing(false);
  setConsentCreditChecks(false);
}

function populateCustomerKycProfileFromCustomer(customer = {}) {
  const toStringValue = (value) => (value === null || value === undefined ? '' : value.toString());

  setDateOfBirth(customer.date_of_birth || '');
  setCivilStatus(customer.civil_status || '');
  setPermanentAddressLine1(customer.permanent_address_line1 || '');
  setPermanentAddressLine2(customer.permanent_address_line2 || '');
  setPermanentCity(customer.permanent_city || '');
  setPermanentDistrict(customer.permanent_district || '');
  setPermanentProvince(customer.permanent_province || '');
  setPermanentPostalCode(customer.permanent_postal_code || '');
  setCurrentAddressLine1(customer.current_address_line1 || '');
  setCurrentAddressLine2(customer.current_address_line2 || '');
  setCurrentCity(customer.current_city || '');
  setCurrentDistrict(customer.current_district || '');
  setCurrentProvince(customer.current_province || '');
  setCurrentPostalCode(customer.current_postal_code || '');
  setCurrentAddressSince(customer.current_address_since || '');
  setHouseholdSize(toStringValue(customer.household_size));
  setDependentsCount(toStringValue(customer.dependents_count));
  setCustomerType(customer.customer_type || '');
  setEmployerName(customer.employer_name || '');
  setEmployerAddress(customer.employer_address || '');
  setOccupation(customer.occupation || '');
  setMonthlyIncome(toStringValue(customer.monthly_income));
  setBusinessName(customer.business_name || '');
  setBusinessAddress(customer.business_address || '');
  setGuarantorName(customer.guarantor_name || '');
  setGuarantorRelationship(customer.guarantor_relationship || '');
  setGuarantorMobile(customer.guarantor_mobile || '');
  setConsentDataProcessing(!!customer.consent_data_processing);
  setConsentCreditChecks(!!customer.consent_credit_checks);
}

function getCustomerKycProfileForDisplay() {
  if (customerKycProfile && typeof customerKycProfile === 'object') {
    return customerKycProfile;
  }

  return {
    date_of_birth: customerKycProfileState.dateOfBirth,
    civil_status: customerKycProfileState.civilStatus,
    permanent_address_line1: customerKycProfileState.permanentAddressLine1,
    permanent_address_line2: customerKycProfileState.permanentAddressLine2,
    permanent_city: customerKycProfileState.permanentCity,
    permanent_district: customerKycProfileState.permanentDistrict,
    permanent_province: customerKycProfileState.permanentProvince,
    permanent_postal_code: customerKycProfileState.permanentPostalCode,
    current_address_line1: customerKycProfileState.currentAddressLine1,
    current_address_line2: customerKycProfileState.currentAddressLine2,
    current_city: customerKycProfileState.currentCity,
    current_district: customerKycProfileState.currentDistrict,
    current_province: customerKycProfileState.currentProvince,
    current_postal_code: customerKycProfileState.currentPostalCode,
    current_address_since: customerKycProfileState.currentAddressSince,
    household_size: customerKycProfileState.householdSize,
    dependents_count: customerKycProfileState.dependentsCount,
    customer_type: customerKycProfileState.customerType,
    employer_name: customerKycProfileState.employerName,
    employer_address: customerKycProfileState.employerAddress,
    occupation: customerKycProfileState.occupation,
    monthly_income: customerKycProfileState.monthlyIncome,
    business_name: customerKycProfileState.businessName,
    business_address: customerKycProfileState.businessAddress,
    guarantor_name: customerKycProfileState.guarantorName,
    guarantor_relationship: customerKycProfileState.guarantorRelationship,
    guarantor_mobile: customerKycProfileState.guarantorMobile,
    consent_data_processing: !!customerKycProfileState.consentDataProcessing,
    consent_credit_checks: !!customerKycProfileState.consentCreditChecks,
  };
}
const adminDocumentsSection = document.querySelector(
  '.admin-content .admin-section[data-section="documents"]'
);

let adminLoanApplicationsMessage;
let adminLoanApplicationsTableBody;
let adminLoanApplicationsTable;
let adminRefreshLoanApplicationsBtn;
let adminLoanApplicationsInitialized = false;
let adminLoanApplicationsStatusFilter;
let adminLoansMessage;
let adminLoansTableBody;
let adminRefreshLoansBtn;
let adminLoansControls;
let adminLoansSummary;
let adminLoansPagination;
let adminLoanDetailModal;
let adminLoanDetailTitle;
let adminLoanDetailStatus;
let adminLoanDetailMessage;
let adminLoanDetailTabs;
let adminLoanDetailContent;
let adminLoanDetailCloseBtn;
let adminLoansInitialized = false;

const staffPanel = document.querySelector('#staff-panel');
const staffCollections = document.querySelector('#staff-collections');
const staffActiveLoans = document.querySelector('#staff-active-loans');
const staffApplications = document.querySelector('#staff-applications');
const staffApplicationsMessage = document.querySelector('#staff-applications-message');
const recordPaymentBtn = document.querySelector('#record-payment-btn');
const staffRefreshApplicationsBtn = document.querySelector('#staff-refresh-applications');
const adminRefreshApplicationsBtn = document.querySelector('#admin-refresh-applications');

const staffRoutePlaceholder = document.querySelector('#staff-route-placeholder');
const staffRouteTitle = document.querySelector('#staff-route-title');
const staffRouteDescription = document.querySelector('#staff-route-description');
const staffRoutePath = document.querySelector('#staff-route-path');
const staffRouteBack = document.querySelector('#staff-route-back');

const customerRoutes = {
  '/admin/customers/all-customers': {
    title: 'All customers',
    description: 'View and manage all customer profiles.',
    view: 'all',
  },
  '/admin/customers/new': {
    title: 'Create customer',
    description: 'Register a new customer and capture full KYC details.',
    view: 'new',
  },
  '/admin/customers/kyc-queue': {
    title: 'KYC verification queue',
    description: 'Review and verify customer KYC submissions.',
    view: 'kyc',
  },
  '/admin/customers/risk-profiles': {
    title: 'Risk profiles',
    description: 'Evaluate and manage customer risk profiles.',
    view: 'risk',
  },
};

const staffRoutes = {
  '/admin/staff-list': {
    title: 'Staff list',
    description: 'View and manage internal staff accounts.',
  },
  '/admin/permission-templates': {
    title: 'Permission templates',
    description: 'Predefined permission sets for staff roles.',
  },
  '/admin/approval-hierarchy': {
    title: 'Approval hierarchy',
    description: 'Configure loan approval levels and workflows.',
  },
  '/admin/staff-activity-logs': {
    title: 'Staff activity logs',
    description: 'Track actions performed by staff across the platform.',
  },
  '/admin/staff-login-history': {
    title: 'Staff login history',
    description: 'Monitor login attempts and security events.',
  },
  '/admin/loan-portfolio-assign': {
    title: 'Assign loan portfolios',
    description: 'Assign customers and loans to staff members.',
  },
  '/admin/role-definition': {
    title: 'Role definition',
    description: 'Manage roles: Admin, Staff, and Customer.',
  },
};

const customerRouteHomePath = '/admin/customers';
const loanApplicationsRouteHomePath = '/admin/loan-applications';
const loanApplicationsRoutes = {
  '/admin/loan-applications/all': {
    title: 'All loan applications',
    description: 'View and manage all loan applications from one place.',
  },
};
const loanApplyWizardRoutePath = '/admin/loan-applications/apply';
const staffRouteHomePath = staffRoutes[window.location.pathname] ? '/' : window.location.pathname || '/';
const leadsRouteBase = '/admin/leads';
const leadsRoutes = {
  '/admin/leads/all': {
    title: 'All leads',
    description: 'View and manage all inbound leads.',
  },
  '/admin/leads/new': {
    title: 'Create lead',
    description: 'Add a new prospect to the leads pipeline.',
  },
};
const documentRouteBase = '/admin/documents';
const documentRouteMap = {
  'document-inbox': `${documentRouteBase}/document-inbox`,
  'pending-verification': `${documentRouteBase}/pending-verification`,
  'rejected-documents': `${documentRouteBase}/rejected-documents`,
  'documents-repository': `${documentRouteBase}/documents-repository`,
  'kyc-queues': `${documentRouteBase}/kyc-queues`,
  'document-audit-trail': `${documentRouteBase}/document-audit-trail`,
};
const documentRouteLookup = Object.fromEntries(
  Object.entries(documentRouteMap).flatMap(([key, path]) => [
    [path, key],
    [`${path}/`, key],
  ])
);
const documentSectionHandlers = {};
const documentSectionButtons = {};
let activeDocumentSection = '';
let adminDocumentsHeader;
let documentTilesGrid;
let documentRepositoryPage;
let documentRepositoryCard;
let documentRepositoryMessage;
let documentRepositoryLoading;
let documentRepositoryTableBody;
let documentRepositoryHeaderRow;
let documentRepositoryTableWrapper;
const documentRepositoryState = {
  items: [],
  loading: false,
  error: null,
  hasLoaded: false,
  baseUrl: '',
};

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
const customerSearchNicInput = document.querySelector('#customer-search-nic');
const customerSearchMobileInput = document.querySelector('#customer-search-mobile');
const customerSearchBtn = document.querySelector('#customer-search-btn');
const customerSearchResultsEl = document.querySelector('#customer-search-results');
const customerSearchMessageEl = document.querySelector('#customer-search-message');
const customerSearchSelectionEl = document.querySelector('#customer-search-selection');
const typeSpecificFields = document.querySelectorAll('.type-specific');
const applicationModal = document.querySelector('#application-modal');
const applicationModalTitle = document.querySelector('#application-modal-title');
const applicationModalStatus = document.querySelector('#application-modal-status');
const applicationModalContent = document.querySelector('#application-modal-content');
const applicationModalActions = document.querySelector('#application-modal-actions');
const applicationModalMessage = document.querySelector('#application-modal-message');
const applicationModalRoleLabel = document.querySelector('#application-modal-role');
const closeApplicationModal = document.querySelector('#close-application-modal');
const paymentSheet = document.querySelector('#payment-sheet');
const paymentForm = document.querySelector('#payment-form');
const paymentLoanId = document.querySelector('#payment-loan-id');
const paymentAmount = document.querySelector('#payment-amount');
const paymentDate = document.querySelector('#payment-date');
const paymentMethod = document.querySelector('#payment-method');
const paymentNote = document.querySelector('#payment-note');
const paymentMessage = document.querySelector('#payment-message');
const closePaymentSheet = document.querySelector('#close-payment-sheet');

let cachedProfile = null;
let cachedCustomerRecord = null;
let activeCustomerId = null;
let cachedLoans = [];
let cachedApplications = [];
let cachedStaffApplications = [];
let cachedAdminApplications = [];
let cachedActiveLoans = [];
const adminLoanApplicationsState = {
  loanApplications: [],
  loanApplicationsLoading: false,
  loanApplicationsError: null,
  hasLoaded: false,
  selectedStatus: 'ALL',
};
const loanFilters = {
  q: '',
  status: '',
  balanceStatus: '',
  dateFrom: '',
  dateTo: '',
  principalMin: '',
  principalMax: '',
  sortBy: 'disbursement_date',
  sortDirection: 'desc',
};
const adminLoansState = {
  loans: [],
  loading: false,
  error: null,
  hasLoaded: false,
  selectedLoan: null,
  detailTab: 'details',
  ledger: [],
  ledgerTotals: null,
  ledgerLoading: false,
  ledgerError: null,
  ledgerLoadedLoanId: null,
  selectedStatus: 'ALL',
  page: 1,
  pageSize: 25,
  total: 0,
  requestSequence: 0,
};
const adminCustomersState = {
  customers: [],
  loading: false,
  error: null,
  hasLoaded: false,
  activeTab: 'all',
  filters: { kyc: 'ALL', eligibility: 'ALL' },
};
const adminKycQueueState = {
  customers: [],
  loading: false,
  error: null,
  hasLoaded: false,
};
const customerKycStatuses = ['ALL', 'PENDING', 'UPLOADED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED'];
const customerEligibilityStatuses = ['ALL', 'ELIGIBLE', 'NOT_ELIGIBLE'];
const kycQueueStatuses = ['PENDING', 'UPLOADED', 'UNDER_REVIEW'];
const adminLeadsState = {
  leads: [],
  loading: false,
  error: null,
  hasLoaded: false,
  showNewLeadForm: false,
};
const leadLoanTypeLabels = {
  GROW_ONLINE_BUSINESS: 'Grow Online Business',
  GROW_BUSINESS: 'Grow Business',
  GROW_PERSONAL: 'Grow Personal',
  GROW_TEAM: 'Grow Team',
};
const leadSourceLabels = {
  BRANCH: 'Branch',
  ONLINE_FORM: 'Online form',
  FACEBOOK_AD: 'Facebook Ad',
  WHATSAPP: 'WhatsApp',
  REFERRAL: 'Referral',
  OTHER: 'Other',
};
const adminLeadFormState = {
  values: { name: '', mobile: '', loan_type_interest: '', source: 'OTHER', notes: '' },
  errors: {},
  submitting: false,
};
let adminLeadsInitialized = false;
let leadModal;
let leadForm;
let leadFormMessage;
let leadFormSubmit;
let leadNameInput;
let leadMobileInput;
let leadLoanTypeSelect;
let leadSourceSelect;
let leadNotesInput;
let leadMobileError;
let leadNameError;
let leadLoanTypeError;
let leadSourceError;
let newLeadBtn;
let leadsCardsGrid;
let leadsRoutePlaceholder;
let leadsRouteTitle;
let leadsRouteDescription;
let leadsRouteBack;
let leadsRouteContent;
let leadsListCard;
let adminDocumentsInitialized = false;
let adminCustomersFiltersInitialized = false;
let currentStep = 0;
let currentDraftId = null;
let selectedLoanType = loanTypes[0];
let currentLoanForPayment = null;
const selectedDocuments = new Map();
const uploadedDocumentIds = new Map();
const documentUploadWarnings = new Map();
const skippedDocuments = new Set();
let skipDocumentsForNow = false;
let customerSearchResults = [];
let selectedCustomer = null;
let selectedCustomerId = null;
let customerSearchLoading = false;
let customerSearchController = null;
let customerSearchSequence = 0;
let customerSearchHighlightedIndex = -1;
let customerProfileController = null;
let customerProfileRequestSequence = 0;
let customerProfileState = 'idle';
let selectedCustomerProfile = null;
let selectedExistingLoans = [];
let publicLeadSection;
let publicLeadForm;
let publicLeadMessage;
let publicLeadNameInput;
let publicLeadMobileInput;
let publicLeadLoanSelect;
let publicLeadSourceInput;
let publicLeadSubmit;
let publicLeadSourceBadge;

let publicKycSection;
let publicKycForm;
let publicKycStatus;
let publicKycSummary;
let publicKycLoading;
let publicKycCodeInput;
let publicKycNicInput;
let publicKycFileNicFront;
let publicKycFileNicBack;
let publicKycFileSelfie;
let publicKycFileAddressProof;
let publicKycSubmit;
let publicKycHelperText;
let publicKycSuccess;
let publicKycSavedList;
let publicKycDobInput;
let publicKycCivilStatusSelect;
let publicKycPermanentLine1;
let publicKycPermanentLine2;
let publicKycPermanentCity;
let publicKycPermanentDistrict;
let publicKycPermanentProvince;
let publicKycPermanentPostalCode;
let publicKycCurrentDifferent;
let publicKycCurrentLine1;
let publicKycCurrentLine2;
let publicKycCurrentCity;
let publicKycCurrentDistrict;
let publicKycCurrentProvince;
let publicKycCurrentPostalCode;
let publicKycCurrentSince;
let publicKycHouseholdSize;
let publicKycDependentsCount;
let publicKycCustomerType;
let publicKycEmployerName;
let publicKycEmployerAddress;
let publicKycOccupation;
let publicKycMonthlyIncome;
let publicKycBusinessName;
let publicKycBusinessAddress;
let publicKycGuarantorName;
let publicKycGuarantorRelationship;
let publicKycGuarantorMobile;
let publicKycConsentDataProcessing;
let publicKycConsentCreditChecks;
let publicKycCurrentAddressGroup;
let publicKycIncomeSalaried;
let publicKycIncomeSelfEmployed;
let publicKycIncomeOther;
let publicKycOtherIncomeLabel;
const publicKycState = {
  code: '',
  customer: null,
  submissionResult: null,
  civilStatus: '',
  dateOfBirth: '',
  permanentAddressLine1: '',
  permanentAddressLine2: '',
  permanentCity: '',
  permanentDistrict: '',
  permanentProvince: '',
  permanentPostalCode: '',
  currentAddressLine1: '',
  currentAddressLine2: '',
  currentCity: '',
  currentDistrict: '',
  currentProvince: '',
  currentPostalCode: '',
  currentAddressSince: '',
  householdSize: '',
  dependentsCount: '',
  customerType: '',
  employerName: '',
  employerAddress: '',
  occupation: '',
  monthlyIncome: '',
  businessName: '',
  businessAddress: '',
  guarantorName: '',
  guarantorRelationship: '',
  guarantorMobile: '',
  consentDataProcessing: false,
  consentCreditChecks: false,
  currentAddressDifferent: false,
};

function getPublicLeadSource() {
  const params = new URLSearchParams(window.location.search || '');
  const source = (params.get('source') || '').trim();
  return source || 'ONLINE_FORM';
}

function setPublicLeadMessage(text = '', type = 'info') {
  if (!publicLeadMessage) return;
  publicLeadMessage.textContent = text;
  publicLeadMessage.className = 'alert ' + (type === 'error' ? 'error' : 'success');
  publicLeadMessage.classList.toggle('hidden', !text);
}

function ensurePublicLeadSection() {
  if (publicLeadSection || !appMain) return;

  publicLeadSection = document.createElement('section');
  publicLeadSection.id = 'public-lead-section';
  publicLeadSection.className = 'card hidden';
  publicLeadSection.innerHTML = `
    <div class="card-header">
      <div>
        <div class="eyebrow">Get started</div>
        <h1>Tell us about your loan need</h1>
        <p class="muted">Share a few details and our team will get in touch.</p>
      </div>
      <div class="pill" id="public-lead-source-badge"></div>
    </div>
    <form id="public-lead-form" class="form-grid">
      <label class="form-field">
        <span>Full Name</span>
        <input id="public-lead-name" name="name" type="text" required placeholder="Enter your full name" />
      </label>
      <label class="form-field">
        <span>Mobile Number</span>
        <input
          id="public-lead-mobile"
          name="mobile"
          type="tel"
          required
          inputmode="tel"
          placeholder="e.g. 024XXXXXXX"
        />
      </label>
      <label class="form-field">
        <span>Loan Type</span>
        <select id="public-lead-loan-type" name="loan_type_interest" required></select>
      </label>
      <input type="hidden" id="public-lead-source" name="source" />
      <button type="submit" class="primary" id="public-lead-submit">Submit</button>
    </form>
    <p id="public-lead-message" class="alert hidden" role="status"></p>
  `;

  appMain.insertBefore(publicLeadSection, appMain.firstChild);

  publicLeadForm = publicLeadSection.querySelector('#public-lead-form');
  publicLeadMessage = publicLeadSection.querySelector('#public-lead-message');
  publicLeadNameInput = publicLeadSection.querySelector('#public-lead-name');
  publicLeadMobileInput = publicLeadSection.querySelector('#public-lead-mobile');
  publicLeadLoanSelect = publicLeadSection.querySelector('#public-lead-loan-type');
  publicLeadSourceInput = publicLeadSection.querySelector('#public-lead-source');
  publicLeadSubmit = publicLeadSection.querySelector('#public-lead-submit');
  publicLeadSourceBadge = publicLeadSection.querySelector('#public-lead-source-badge');

  loanTypes.forEach((type) => {
    const option = document.createElement('option');
    option.value = type;
    option.textContent = type;
    publicLeadLoanSelect.appendChild(option);
  });

  publicLeadForm?.addEventListener('submit', handlePublicLeadSubmit);
}

async function handlePublicLeadSubmit(event) {
  event.preventDefault();
  if (!publicLeadForm || !publicLeadSubmit) return;

  const payload = {
    name: publicLeadNameInput?.value?.trim() || '',
    mobile: publicLeadMobileInput?.value?.trim() || '',
    loan_type_interest: publicLeadLoanSelect?.value || '',
    source: publicLeadSourceInput?.value || 'ONLINE_FORM',
  };

  if (!payload.name || !payload.mobile || !payload.loan_type_interest) {
    setPublicLeadMessage('Please fill in all required fields.', 'error');
    return;
  }

  setPublicLeadMessage('Submitting your request...', 'success');
  publicLeadSubmit.disabled = true;
  publicLeadSubmit.textContent = 'Submitting...';

  try {
    const path = endpoint('leads') || '/leads';
    const response = await fetch(`${apiConfig.baseUrl}${path}`, {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const { data } = await parseResponse(response);
      const message = buildErrorMessage({ status: response.status, data, raw: '' });
      throw new Error(message || 'Unable to submit lead.');
    }

    setPublicLeadMessage('Thank you! We will contact you shortly.', 'success');
    publicLeadForm.reset();
    publicLeadSourceInput.value = payload.source;
    if (publicLeadLoanSelect) publicLeadLoanSelect.value = loanTypes[0];
  } catch (error) {
    console.error('Failed to submit lead', error);
    setPublicLeadMessage(error?.message || 'Could not submit your request.', 'error');
  } finally {
    publicLeadSubmit.disabled = false;
    publicLeadSubmit.textContent = 'Submit';
  }
}

function showPublicLeadPage() {
  ensurePublicLeadSection();
  const source = getPublicLeadSource();
  if (publicLeadSourceInput) publicLeadSourceInput.value = source;
  if (publicLeadSourceBadge) {
    publicLeadSourceBadge.textContent = `Source: ${source}`;
    publicLeadSourceBadge.classList.toggle('hidden', !source);
  }

  setPublicLeadMessage('');
  loginCard?.classList.add('hidden');
  dashboards.classList.add('hidden');
  userRoleChip?.classList.add('hidden');
  logoutBtn?.classList.add('hidden');
  publicLeadSection?.classList.remove('hidden');
  window.scrollTo({ top: 0 });
}

function setPublicKycMessage(text = '', type = 'info') {
  if (!publicKycStatus) return;
  publicKycStatus.textContent = text;
  publicKycStatus.className = 'alert ' + (type === 'error' ? 'error' : 'success');
  publicKycStatus.classList.toggle('hidden', !text);
}

function setPublicKycFieldError(field, message = '') {
  if (!publicKycSection) return;
  const node = publicKycSection.querySelector(`[data-error-for="${field}"]`);
  if (!node) return;
  node.textContent = message || '';
  node.classList.toggle('hidden', !message);
}

function setPublicKycLoading(isLoading) {
  publicKycLoading?.classList.toggle('hidden', !isLoading);
}

function resetPublicKycState() {
  setPublicKycMessage('');
  publicKycSummary && (publicKycSummary.textContent = '');
  publicKycSuccess?.classList.add('hidden');
  publicKycHelperText?.classList.remove('hidden');
  publicKycForm?.classList.add('hidden');
  if (publicKycSavedList) publicKycSavedList.innerHTML = '';
  publicKycState.customer = null;
  publicKycState.submissionResult = null;
  publicKycState.civilStatus = '';
  publicKycState.dateOfBirth = '';
  publicKycState.permanentAddressLine1 = '';
  publicKycState.permanentAddressLine2 = '';
  publicKycState.permanentCity = '';
  publicKycState.permanentDistrict = '';
  publicKycState.permanentProvince = '';
  publicKycState.permanentPostalCode = '';
  publicKycState.currentAddressLine1 = '';
  publicKycState.currentAddressLine2 = '';
  publicKycState.currentCity = '';
  publicKycState.currentDistrict = '';
  publicKycState.currentProvince = '';
  publicKycState.currentPostalCode = '';
  publicKycState.currentAddressSince = '';
  publicKycState.householdSize = '';
  publicKycState.dependentsCount = '';
  publicKycState.customerType = '';
  publicKycState.employerName = '';
  publicKycState.employerAddress = '';
  publicKycState.occupation = '';
  publicKycState.monthlyIncome = '';
  publicKycState.businessName = '';
  publicKycState.businessAddress = '';
  publicKycState.guarantorName = '';
  publicKycState.guarantorRelationship = '';
  publicKycState.guarantorMobile = '';
  publicKycState.consentDataProcessing = false;
  publicKycState.consentCreditChecks = false;
  publicKycState.currentAddressDifferent = false;
  ['nic_front', 'nic_back', 'selfie_nic', 'address_proof'].forEach((field) =>
    setPublicKycFieldError(field, '')
  );
}

function getDocumentLabel(type) {
  if (!type) return '';
  const normalized = type.toLowerCase();
  return documentLabels[normalized] || documentLabels[type] || type;
}

function getPublicKycDocumentUrl(data, type) {
  if (!data || !type) return '';
  const normalized = type.toLowerCase();
  const candidateKeys = [normalized, type, type.toUpperCase(), mapDocumentTypeToApi(type)];
  const containers = [
    data.document_previews,
    data.documents,
    data.files,
    data.file_paths,
    data.uploads,
    data,
  ];

  for (const container of containers) {
    if (!container || typeof container !== 'object') continue;
    for (const key of candidateKeys) {
      const value = container?.[key];
      if (!value) continue;
      if (typeof value === 'string') return value;
      if (typeof value === 'object' && (value.url || value.file_path)) return value.url || value.file_path;
    }
  }

  return '';
}

function renderPublicKycSuccess(result) {
  publicKycForm?.classList.add('hidden');
  publicKycHelperText?.classList.add('hidden');
  publicKycSuccess?.classList.remove('hidden');
  setPublicKycMessage('');

  if (!publicKycSavedList) return;
  publicKycSavedList.innerHTML = '';
  const savedTypes = Array.isArray(result?.saved_types) ? result.saved_types : [];

  if (!savedTypes.length) {
    const li = document.createElement('li');
    li.textContent = 'Documents uploaded successfully.';
    publicKycSavedList.appendChild(li);
    return;
  }

  savedTypes.forEach((type) => {
    const label = getDocumentLabel(type);
    const li = document.createElement('li');
    const url = getPublicKycDocumentUrl(result, type);
    li.textContent = `${label || type}`;
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.style.marginLeft = '8px';
      link.textContent = 'View';
      li.appendChild(document.createTextNode(' – '));
      li.appendChild(link);
    } else {
      li.appendChild(document.createTextNode(' – uploaded'));
    }
    publicKycSavedList.appendChild(li);
  });
}

async function fetchPublicCustomerByCode(code) {
  const baseUrl = getApiBaseUrl().replace(/\/+$/, '');
  const url = `${baseUrl}/public/customers/by-code?customer_code=${encodeURIComponent(code)}`;
  let response;
  try {
    response = await fetch(url, { method: 'GET' });
  } catch (networkError) {
    console.error('Network error while fetching customer by code', networkError);
    throw new Error("Couldn't reach the server. Please check your connection.");
  }

  const { data, raw } = await parseResponse(response.clone());
  if (!response.ok) {
    const message = buildErrorMessage({ status: response.status, data, raw });
    const error = new Error(message);
    error.status = response.status;
    error.data = data;
    throw error;
  }

  return data;
}

async function showPublicKycPage() {
  ensurePublicKycSection();
  resetPublicKycState();
  hidePublicLeadPage();
  publicKycSection?.classList.remove('hidden');
  loginCard?.classList.add('hidden');
  dashboards.classList.add('hidden');
  userRoleChip?.classList.add('hidden');
  logoutBtn?.classList.add('hidden');
  window.scrollTo({ top: 0 });

  const params = new URLSearchParams(window.location.search || '');
  const code = (params.get('code') || '').trim();
  publicKycState.code = code;
  if (publicKycCodeInput) publicKycCodeInput.value = code;

  if (!code) {
    setPublicKycMessage(
      'Invalid link. Customer code is missing. Please contact Grow Microfinance.',
      'error'
    );
    return;
  }

  setPublicKycLoading(true);
  if (publicKycSummary) publicKycSummary.textContent = 'Loading your KYC form...';

  try {
    const customer = await fetchPublicCustomerByCode(code);
    publicKycState.customer = customer;
    const customerName = customer?.full_name || customer?.name || 'Customer';
    const customerCode = customer?.customer_code || code;
    if (publicKycSummary)
      publicKycSummary.textContent = `KYC form for: ${customerCode} – ${customerName}`;
    setPublicKycMessage('');
    publicKycForm?.classList.remove('hidden');
  } catch (error) {
    console.error('Failed to load public KYC form', error);
    const message =
      error?.status === 404
        ? 'We could not find your customer record for this link. Please contact Grow Microfinance.'
        :
          'We could not find your customer record for this link. Please contact Grow Microfinance.';
    setPublicKycMessage(message, 'error');
  } finally {
    setPublicKycLoading(false);
  }
}

function hidePublicKycPage() {
  publicKycSection?.classList.add('hidden');
  const { role } = getSession();
  togglePanels(role || null);
}

function collectPublicKycFormState() {
  publicKycState.dateOfBirth = (publicKycDobInput?.value || '').trim();
  publicKycState.civilStatus = publicKycCivilStatusSelect?.value || '';
  publicKycState.permanentAddressLine1 = (publicKycPermanentLine1?.value || '').trim();
  publicKycState.permanentAddressLine2 = (publicKycPermanentLine2?.value || '').trim();
  publicKycState.permanentCity = (publicKycPermanentCity?.value || '').trim();
  publicKycState.permanentDistrict = (publicKycPermanentDistrict?.value || '').trim();
  publicKycState.permanentProvince = (publicKycPermanentProvince?.value || '').trim();
  publicKycState.permanentPostalCode = (publicKycPermanentPostalCode?.value || '').trim();
  publicKycState.currentAddressDifferent = !!publicKycCurrentDifferent?.checked;
  publicKycState.currentAddressLine1 = (publicKycCurrentLine1?.value || '').trim();
  publicKycState.currentAddressLine2 = (publicKycCurrentLine2?.value || '').trim();
  publicKycState.currentCity = (publicKycCurrentCity?.value || '').trim();
  publicKycState.currentDistrict = (publicKycCurrentDistrict?.value || '').trim();
  publicKycState.currentProvince = (publicKycCurrentProvince?.value || '').trim();
  publicKycState.currentPostalCode = (publicKycCurrentPostalCode?.value || '').trim();
  publicKycState.currentAddressSince = (publicKycCurrentSince?.value || '').trim();
  publicKycState.householdSize = (publicKycHouseholdSize?.value || '').trim();
  publicKycState.dependentsCount = (publicKycDependentsCount?.value || '').trim();
  publicKycState.customerType = publicKycCustomerType?.value || '';
  publicKycState.employerName = (publicKycEmployerName?.value || '').trim();
  publicKycState.employerAddress = (publicKycEmployerAddress?.value || '').trim();
  publicKycState.occupation = (publicKycOccupation?.value || '').trim();
  publicKycState.businessName = (publicKycBusinessName?.value || '').trim();
  publicKycState.businessAddress = (publicKycBusinessAddress?.value || '').trim();
  publicKycState.guarantorName = (publicKycGuarantorName?.value || '').trim();
  publicKycState.guarantorRelationship = (publicKycGuarantorRelationship?.value || '').trim();
  publicKycState.guarantorMobile = (publicKycGuarantorMobile?.value || '').trim();
  publicKycState.consentDataProcessing = !!publicKycConsentDataProcessing?.checked;
  publicKycState.consentCreditChecks = !!publicKycConsentCreditChecks?.checked;

  if (publicKycState.customerType === 'SALARIED') {
    publicKycState.monthlyIncome = (publicKycMonthlyIncome?.value || '').trim();
  } else if (publicKycState.customerType === 'SELF_EMPLOYED') {
    publicKycState.monthlyIncome = (publicKycSection.querySelector('#public-kyc-monthly-income-self')?.value || '').trim();
  } else if (publicKycState.customerType === 'OTHER') {
    publicKycState.monthlyIncome = (publicKycSection.querySelector('#public-kyc-monthly-income-other')?.value || '').trim();
    publicKycState.occupation =
      (publicKycSection.querySelector('#public-kyc-occupation-other')?.value || '').trim() ||
      publicKycState.occupation;
  } else {
    publicKycState.monthlyIncome = (publicKycMonthlyIncome?.value || '').trim();
  }
}

function validatePublicKycForm() {
  let isValid = true;
  setPublicKycMessage('');
  ['nic_front', 'nic_back', 'selfie_nic', 'address_proof'].forEach((field) =>
    setPublicKycFieldError(field, '')
  );
  const required = [
    { field: 'nic_front', input: publicKycFileNicFront, label: 'NIC front' },
    { field: 'nic_back', input: publicKycFileNicBack, label: 'NIC back' },
    { field: 'selfie_nic', input: publicKycFileSelfie, label: 'Selfie holding NIC' },
  ];

  required.forEach(({ field, input, label }) => {
    if (!input?.files?.length) {
      isValid = false;
      setPublicKycFieldError(field, `${label} is required.`);
    }
  });

  const missingFields = [];
  if (!publicKycState.dateOfBirth) missingFields.push('Date of birth');
  if (!publicKycState.civilStatus) missingFields.push('Civil status');
  if (!publicKycState.permanentAddressLine1) missingFields.push('Permanent address line 1');
  if (!publicKycState.permanentCity) missingFields.push('Permanent city');
  if (!publicKycState.permanentDistrict) missingFields.push('Permanent district');
  if (!publicKycState.customerType) missingFields.push('Customer type');
  if (!publicKycState.monthlyIncome) missingFields.push('Monthly income');

  if (publicKycState.customerType === 'SALARIED' && !publicKycState.employerName) {
    missingFields.push('Employer name');
  }
  if (publicKycState.customerType === 'SELF_EMPLOYED' && !publicKycState.businessName) {
    missingFields.push('Business name');
  }

  if (!publicKycState.consentDataProcessing || !publicKycState.consentCreditChecks) {
    missingFields.push('Required consents');
  }

  if (missingFields.length) {
    isValid = false;
    setPublicKycMessage(`Please complete the following required fields: ${missingFields.join(', ')}.`, 'error');
  }

  return isValid;
}

async function handlePublicKycSubmit() {
  if (!publicKycState.code || !publicKycState.customer) {
    setPublicKycMessage(
      'We could not find your customer record for this link. Please contact Grow Microfinance.',
      'error'
    );
    return;
  }

  collectPublicKycFormState();
  if (!validatePublicKycForm()) return;

  const fileNicFront = publicKycFileNicFront?.files?.[0];
  const fileNicBack = publicKycFileNicBack?.files?.[0];
  const fileSelfieNic = publicKycFileSelfie?.files?.[0];
  const fileAddressProof = publicKycFileAddressProof?.files?.[0];

  const formData = new FormData();
  formData.append('nic_front', fileNicFront);
  formData.append('nic_back', fileNicBack);
  formData.append('selfie_nic', fileSelfieNic);
  if (fileAddressProof) {
    formData.append('address_proof', fileAddressProof);
  }

  formData.append('date_of_birth', publicKycState.dateOfBirth || '');
  formData.append('civil_status', publicKycState.civilStatus || '');
  formData.append('permanent_address_line1', publicKycState.permanentAddressLine1 || '');
  formData.append('permanent_address_line2', publicKycState.permanentAddressLine2 || '');
  formData.append('permanent_city', publicKycState.permanentCity || '');
  formData.append('permanent_district', publicKycState.permanentDistrict || '');
  formData.append('permanent_province', publicKycState.permanentProvince || '');
  formData.append('permanent_postal_code', publicKycState.permanentPostalCode || '');
  formData.append('current_address_line1', publicKycState.currentAddressLine1 || '');
  formData.append('current_address_line2', publicKycState.currentAddressLine2 || '');
  formData.append('current_city', publicKycState.currentCity || '');
  formData.append('current_district', publicKycState.currentDistrict || '');
  formData.append('current_province', publicKycState.currentProvince || '');
  formData.append('current_postal_code', publicKycState.currentPostalCode || '');
  formData.append('current_address_since', publicKycState.currentAddressSince || '');
  formData.append('household_size', publicKycState.householdSize || '');
  formData.append('dependents_count', publicKycState.dependentsCount || '');
  formData.append('customer_type', publicKycState.customerType || '');
  formData.append('employer_name', publicKycState.employerName || '');
  formData.append('employer_address', publicKycState.employerAddress || '');
  formData.append('occupation', publicKycState.occupation || '');
  formData.append('monthly_income', publicKycState.monthlyIncome || '');
  formData.append('business_name', publicKycState.businessName || '');
  formData.append('business_address', publicKycState.businessAddress || '');
  formData.append('guarantor_name', publicKycState.guarantorName || '');
  formData.append('guarantor_relationship', publicKycState.guarantorRelationship || '');
  formData.append('guarantor_mobile', publicKycState.guarantorMobile || '');
  formData.append('consent_data_processing', publicKycState.consentDataProcessing ? 'true' : 'false');
  formData.append('consent_credit_checks', publicKycState.consentCreditChecks ? 'true' : 'false');

  const nicNumber = (publicKycNicInput?.value || '').trim();
  if (nicNumber) console.log('Public KYC NIC number provided for reference', nicNumber);

  const baseUrl = getApiBaseUrl().replace(/\/+$/, '');
  const url = `${baseUrl}/public/customers/${encodeURIComponent(publicKycState.code)}/kyc-upload`;

  setPublicKycMessage('');
  if (publicKycSubmit) {
    publicKycSubmit.disabled = true;
    publicKycSubmit.textContent = 'Submitting...';
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: { Accept: 'application/json' },
      body: formData,
    });

    const { data, raw } = await parseResponse(response.clone());
    if (!response.ok) {
      const message = buildErrorMessage({ status: response.status, data, raw });
      throw new Error(message || '');
    }

    publicKycState.submissionResult = data;
    renderPublicKycSuccess(data || {});
  } catch (error) {
    console.error('Public KYC submission failed', error);
    setPublicKycMessage(
      "We couldn't submit your KYC documents. Please check your internet connection and try again. If the problem persists, contact Grow Microfinance.",
      'error'
    );
  } finally {
    if (publicKycSubmit) {
      publicKycSubmit.disabled = false;
      publicKycSubmit.textContent = 'Submit KYC documents';
    }
  }
}

function hidePublicLeadPage() {
  publicLeadSection?.classList.add('hidden');
  const { role } = getSession();
  togglePanels(role || null);
}

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

const refreshLeewayMs = 5 * 60 * 1000;
let refreshTimerId = null;
let refreshPromise = null;
let logoutInProgress = false;

function nowMs() { return Date.now(); }
function toExpiryTimestamp(seconds, fallbackSeconds) {
  const value = Number(seconds || fallbackSeconds || 0);
  return value > 0 ? nowMs() + value * 1000 : 0;
}
function safeJsonParse(value, fallback = {}) {
  try { return value ? JSON.parse(value) : fallback; } catch (_) { return fallback; }
}
function minimumUserState(user = {}) {
  return { must_change_password: !!user.must_change_password, name: user.name || '', email: user.email || '' };
}
function saveSessionFromLogin(data, role) {
  const token = data.access_token || data.token || data.accessToken || data.jwt;
  const refreshToken = data.refresh_token || data.refreshToken || '';
  localStorage.setItem(storageKeys.token, token);
  if (refreshToken) localStorage.setItem(storageKeys.refreshToken, refreshToken);
  localStorage.setItem(storageKeys.accessExpiresAt, String(toExpiryTimestamp(data.access_expires_in || data.expires_in, 3600)));
  localStorage.setItem(storageKeys.refreshExpiresAt, String(toExpiryTimestamp(data.refresh_expires_in, 604800)));
  localStorage.setItem(storageKeys.role, role);
  localStorage.setItem(storageKeys.user, JSON.stringify(minimumUserState(data.user || {})));
  scheduleRefresh();
}
function saveSession(token, role) {
  saveSessionFromLogin({ access_token: token, access_expires_in: 3600, refresh_expires_in: 604800 }, role);
}
function updateAccessToken(data = {}) {
  const token = data.access_token || data.token || data.accessToken || data.jwt;
  if (token) localStorage.setItem(storageKeys.token, token);
  if (data.refresh_token || data.refreshToken) localStorage.setItem(storageKeys.refreshToken, data.refresh_token || data.refreshToken);
  localStorage.setItem(storageKeys.accessExpiresAt, String(toExpiryTimestamp(data.access_expires_in || data.expires_in, 3600)));
  if (data.refresh_expires_in) localStorage.setItem(storageKeys.refreshExpiresAt, String(toExpiryTimestamp(data.refresh_expires_in, 604800)));
  if (data.user) localStorage.setItem(storageKeys.user, JSON.stringify(minimumUserState(data.user)));
  scheduleRefresh();
}
function clearRefreshTimer() { if (refreshTimerId) clearTimeout(refreshTimerId); refreshTimerId = null; }
function clearSession() {
  clearRefreshTimer();
  Object.values(storageKeys).forEach((key) => localStorage.removeItem(key));
  refreshPromise = null;
}
function getSession() {
  return {
    token: localStorage.getItem(storageKeys.token),
    refreshToken: localStorage.getItem(storageKeys.refreshToken),
    accessExpiresAt: Number(localStorage.getItem(storageKeys.accessExpiresAt) || 0),
    refreshExpiresAt: Number(localStorage.getItem(storageKeys.refreshExpiresAt) || 0),
    role: localStorage.getItem(storageKeys.role),
    user: safeJsonParse(localStorage.getItem(storageKeys.user), {}),
  };
}
function hasValidRefreshToken(session = getSession()) { return !!session.refreshToken && (!session.refreshExpiresAt || session.refreshExpiresAt > nowMs()); }
function isAccessNearingExpiry(session = getSession()) { return !session.accessExpiresAt || session.accessExpiresAt - nowMs() <= refreshLeewayMs; }
function scheduleRefresh() {
  clearRefreshTimer();
  const session = getSession();
  if (!session.token || !hasValidRefreshToken(session) || !session.accessExpiresAt) return;
  refreshTimerId = setTimeout(() => ensureValidSession().catch(console.warn), Math.max(0, session.accessExpiresAt - nowMs() - refreshLeewayMs));
}
async function refreshAccessToken() {
  const session = getSession();
  if (!hasValidRefreshToken(session)) throw new Error('Your session has expired. Please sign in again.');
  if (!refreshPromise) {
    refreshPromise = (async () => {
      const response = await fetch(`${apiConfig.baseUrl}${endpoint('refresh')}`, {
        method: 'POST', headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify({ refresh_token: session.refreshToken }),
      });
      const { data, raw } = await parseResponse(response.clone());
      if (!response.ok) throw new Error(buildErrorMessage({ status: response.status, data, raw }) || 'Your session has expired. Please sign in again.');
      updateAccessToken(data);
      return data;
    })().finally(() => { refreshPromise = null; });
  }
  return refreshPromise;
}
async function ensureValidSession() {
  const session = getSession();
  if (!session.token) return false;
  if (isAccessNearingExpiry(session) && hasValidRefreshToken(session)) await refreshAccessToken();
  return true;
}

async function parseResponse(response) {
  const text = await response.text();
  if (!text || !text.trim()) return { data: {}, raw: '' };

  try {
    return { data: JSON.parse(text), raw: text };
  } catch (err) {
    console.warn('Failed to parse JSON response', err);
  }

  return { data: {}, raw: text };
}

function isLikelyHtml(text = '') {
  const trimmed = text.trim().toLowerCase();
  return trimmed.startsWith('<!doctype html') || trimmed.startsWith('<html');
}

function buildErrorMessage({ status, data, raw }) {
  const messages = [];
  if (Array.isArray(data?.errors)) {
    messages.push(
      ...data.errors
        .map((err) => {
          if (!err) return '';
          if (typeof err === 'string') return err;
          if (typeof err === 'object') return err.message || err.detail || '';
          return String(err);
        })
        .filter(Boolean)
    );
  }

  const messageFromPayload =
    data?.message || data?.error || data?.detail || data?.title || '';
  if (messageFromPayload) messages.push(messageFromPayload);

  if (messages.length) return messages.join('; ');

  // Avoid surfacing raw HTML error pages to the user.
  if (raw && !isLikelyHtml(raw)) return raw;
  return `Request failed with status ${status}`;
}


function isTokenExpiredResponse(data = {}) {
  const code = String(data?.error || data?.code || data?.message || '').toLowerCase();
  return code === 'token_expired' || code.includes('token expired') || code.includes('jwt expired');
}

function attachIdFromLocation(data, headers) {
  const location = headers?.get?.('location');
  if (!location) return data;

  const lastSegment = location.split('/').filter(Boolean).pop();
  if (!lastSegment) return data;

  const numericId = Number(lastSegment);
  const inferredId = Number.isNaN(numericId) ? lastSegment : numericId;

  if (data && typeof data === 'object' && !Array.isArray(data)) {
    if (data.id === undefined) data.id = inferredId;
    if (data.application_id === undefined) data.application_id = inferredId;
    return data;
  }

  return { id: inferredId, application_id: inferredId, data };
}

function normalizeApplicationsResponse(response) {
  if (Array.isArray(response)) return response;

  const candidates = [
    response?.applications,
    response?.data?.applications,
    response?.data,
    response?.items,
    response?.data?.items,
    response?.content,
    response?.data?.content,
    response?.results,
    response?.data?.results,
    resolveItemsList(response, 'applications'),
    resolveItemsList(response?.data, 'applications'),
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (candidate && typeof candidate === 'object') {
      if (Array.isArray(candidate.items)) return candidate.items;
      if (Array.isArray(candidate.content)) return candidate.content;
      if (Array.isArray(candidate.data)) return candidate.data;
      if (Array.isArray(candidate.results)) return candidate.results;
    }
  }

  return [];
}

async function api(path, { method = 'GET', body, signal, retryOnExpiredToken = true } = {}) {
  await ensureValidSession();
  const buildRequestOptions = () => {
    const { token } = getSession();
    const shouldSendJson = body !== undefined || !['GET', 'HEAD'].includes(method);
    const headers = { Accept: 'application/json' };
    if (shouldSendJson) headers['Content-Type'] = 'application/json';
    if (token) headers.Authorization = `Bearer ${token}`;
    const payload = body !== undefined ? JSON.stringify(body) : shouldSendJson ? '{}' : undefined;
    return { method, headers, body: payload, signal };
  };

  let response;
  const url = `${apiConfig.baseUrl}${path}`;
  let requestOptions = buildRequestOptions();
  try {
    response = await fetch(url, requestOptions);
  } catch (networkError) {
    console.error('Network error during API request', {
      url,
      path,
      method,
      options: { ...requestOptions, headers: { ...requestOptions.headers, Authorization: requestOptions.headers?.Authorization ? '[REDACTED]' : undefined } },
      error: networkError,
    });
    if (networkError?.name === 'AbortError') { const error = new Error('Disbursement setup took too long to load. Please retry.'); error.name = 'AbortError'; throw error; }
    throw new Error("Couldn't reach the server. Please check your connection.");
  }

  let { data, raw } = await parseResponse(response.clone());
  if (response.status === 401 && retryOnExpiredToken && isTokenExpiredResponse(data) && hasValidRefreshToken()) {
    await refreshAccessToken();
    requestOptions = buildRequestOptions();
    response = await fetch(url, requestOptions);
    ({ data, raw } = await parseResponse(response.clone()));
  }
  const enrichedData = response.ok ? attachIdFromLocation(data, response.headers) : data;
  if (!response.ok) {
    console.error('API request failed', {
      path,
      method,
      status: response.status,
      headers: Object.fromEntries(response.headers?.entries?.() || []),
      body: raw,
      data: enrichedData,
    });
    const message = buildErrorMessage({ status: response.status, data: enrichedData, raw });
    const error = new Error(message);
    error.status = response.status;
    // Preserve structured validation details for callers that can present them.
    error.data = enrichedData;
    throw error;
  }
  return enrichedData;
}

api.get = (path, options = {}) => api(path, { ...options, method: 'GET' });

async function fetchWithTimeout(url, options = {}, timeoutMs = 15000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await api(url, { ...options, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

async function apiRequest(path, { method = 'GET', body } = {}) {
  await ensureValidSession();
  const { token } = getSession();
  const headers = { Accept: 'application/json' };
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  console.log('[API] request', { url: `${apiConfig.baseUrl}${path}`, method, hasBody: body !== undefined });
  const response = await fetch(`${apiConfig.baseUrl}${path}`, { method, headers, body });
  const { data, raw } = await parseResponse(response.clone());

  if (!response.ok) {
    console.error('API request failed', {
      path,
      method,
      status: response.status,
      headers: Object.fromEntries(response.headers?.entries?.() || []),
      body: raw,
      data,
    });
    const message = buildErrorMessage({ status: response.status, data, raw });
    throw new Error(message);
  }

  return data;
}

async function apiMultipart(path, formData) {
  await ensureValidSession();
  const { token } = getSession();
  const headers = token
    ? { Authorization: `Bearer ${token}`, Accept: 'application/json' }
    : { Accept: 'application/json' };

  const response = await fetch(`${apiConfig.baseUrl}${path}`, {
    method: 'POST',
    headers,
    body: formData,
  });

  const { data, raw } = await parseResponse(response.clone());
  if (!response.ok) {
    const message = buildErrorMessage({ status: response.status, data, raw });
    throw new Error(message);
  }
  return data;
}

function formatCurrency(value) {
  const normalizedValue = String(value ?? 0).replace(/,/g, '');
  const amount = Number(normalizedValue || 0);
  return `Rs. ${amount.toLocaleString('en-LK', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function parseDateOnly(value) {
  if (typeof value !== 'string') return null;
  const match = value.trim().match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return null;
  return new Date(Number(match[1]), Number(match[2]) - 1, Number(match[3]));
}

function formatDate(value) {
  if (!value) return '';
  const dateOnly = parseDateOnly(value);
  const date = dateOnly || new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
}


function todayDateOnly() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
}

function dateOnlyToEpoch(value) {
  const date = parseDateOnly(String(value || '').slice(0, 10));
  return date ? date.getTime() : NaN;
}

function daysBetweenDateOnly(start, end) {
  const startTime = dateOnlyToEpoch(start);
  const endTime = dateOnlyToEpoch(end);
  if (!Number.isFinite(startTime) || !Number.isFinite(endTime)) return 0;
  return Math.max(0, Math.round((endTime - startTime) / 86400000));
}

function isHistoricalDate(value) {
  return Number.isFinite(dateOnlyToEpoch(value)) && dateOnlyToEpoch(value) < dateOnlyToEpoch(todayDateOnly());
}

function isFutureDateOnly(value) {
  return Number.isFinite(dateOnlyToEpoch(value)) && dateOnlyToEpoch(value) > dateOnlyToEpoch(todayDateOnly());
}

function formatDateOnlyDisplay(value) {
  return formatDate(String(value || '').slice(0, 10)) || escapeHtml(value || '—');
}

function accountingField(source, keys, fallback = null) {
  return getLoanField(source || {}, keys, fallback);
}

function accountingItems(data) {
  if (Array.isArray(data)) return data;
  for (const key of ['items', 'rows', 'entries', 'journals', 'payments', 'data', 'results']) {
    if (Array.isArray(data?.[key])) return data[key];
  }
  return [];
}

function boolFromBackend(value, fallback = false) {
  if (value === true || value === false) return value;
  if (String(value).toLowerCase() === 'true') return true;
  if (String(value).toLowerCase() === 'false') return false;
  return fallback;
}

function formatDateTime(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleString(undefined, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  });
}

function ensurePublicKycSection() {
  if (publicKycSection || !appMain) return;

  publicKycSection = document.createElement('section');
  publicKycSection.id = 'public-kyc-section';
  publicKycSection.className = 'card hidden';
  publicKycSection.innerHTML = `
    <div class="card-header">
      <div>
        <div class="eyebrow">Customer verification</div>
        <h1>Grow Microfinance – KYC Upload</h1>
        <p class="muted">Submit your identity documents securely.</p>
      </div>
    </div>
    <div id="public-kyc-summary" class="muted" aria-live="polite"></div>
    <div id="public-kyc-status" class="alert hidden" role="status"></div>
    <div id="public-kyc-loading" class="loading-row hidden" aria-live="polite">
      <span class="spinner"></span>
      <span>Loading your KYC form...</span>
    </div>
    <form id="public-kyc-form" class="form-grid hidden" novalidate>
      <label class="form-field">
        <span>Customer code</span>
        <input id="public-kyc-code" type="text" disabled />
      </label>
      <label class="form-field">
        <span>NIC number (optional – for reference)</span>
        <input id="public-kyc-nic" type="text" placeholder="Enter your NIC number" />
      </label>
      <label class="form-field">
        <span>NIC front</span>
        <input id="public-kyc-nic-front" type="file" accept="image/*" required />
        <div class="muted hidden" data-error-for="nic_front" style="color: #b91c1c; font-weight: 600;"></div>
      </label>
      <label class="form-field">
        <span>NIC back</span>
        <input id="public-kyc-nic-back" type="file" accept="image/*" required />
        <div class="muted hidden" data-error-for="nic_back" style="color: #b91c1c; font-weight: 600;"></div>
      </label>
      <label class="form-field">
        <span>Selfie holding NIC</span>
        <input id="public-kyc-selfie-nic" type="file" accept="image/*" required />
        <div class="muted hidden" data-error-for="selfie_nic" style="color: #b91c1c; font-weight: 600;"></div>
      </label>
      <label class="form-field">
        <span>Address proof (utility bill, bank statement, etc.)</span>
        <input id="public-kyc-address-proof" type="file" accept="image/*" />
        <div class="muted hidden" data-error-for="address_proof" style="color: #b91c1c; font-weight: 600;"></div>
      </label>
      <div class="form-section">
        <h3>Personal</h3>
        <label class="form-field">
          <span>Date of birth</span>
          <input id="public-kyc-dob" type="date" />
        </label>
        <label class="form-field">
          <span>Civil status</span>
          <select id="public-kyc-civil-status">
            <option value="">Select status</option>
            <option value="SINGLE">Single</option>
            <option value="MARRIED">Married</option>
            <option value="WIDOWED">Widowed</option>
            <option value="DIVORCED">Divorced</option>
          </select>
        </label>
      </div>
      <div class="form-section">
        <h3>Permanent address</h3>
        <label class="form-field">
          <span>Address line 1</span>
          <input id="public-kyc-permanent-line1" type="text" />
        </label>
        <label class="form-field">
          <span>Address line 2</span>
          <input id="public-kyc-permanent-line2" type="text" />
        </label>
        <label class="form-field">
          <span>City</span>
          <input id="public-kyc-permanent-city" type="text" />
        </label>
        <label class="form-field">
          <span>District</span>
          <input id="public-kyc-permanent-district" type="text" />
        </label>
        <label class="form-field">
          <span>Province</span>
          <input id="public-kyc-permanent-province" type="text" />
        </label>
        <label class="form-field">
          <span>Postal code</span>
          <input id="public-kyc-permanent-postal" type="text" />
        </label>
      </div>
      <div class="form-section">
        <h3>Current address</h3>
        <label class="form-field">
          <span><input id="public-kyc-current-different" type="checkbox" /> Current address is different from permanent</span>
        </label>
        <div id="public-kyc-current-address-group" class="form-subgrid hidden">
          <label class="form-field">
            <span>Address line 1</span>
            <input id="public-kyc-current-line1" type="text" />
          </label>
          <label class="form-field">
            <span>Address line 2</span>
            <input id="public-kyc-current-line2" type="text" />
          </label>
          <label class="form-field">
            <span>City</span>
            <input id="public-kyc-current-city" type="text" />
          </label>
          <label class="form-field">
            <span>District</span>
            <input id="public-kyc-current-district" type="text" />
          </label>
          <label class="form-field">
            <span>Province</span>
            <input id="public-kyc-current-province" type="text" />
          </label>
          <label class="form-field">
            <span>Postal code</span>
            <input id="public-kyc-current-postal" type="text" />
          </label>
          <label class="form-field">
            <span>Living here since</span>
            <input id="public-kyc-current-since" type="month" />
          </label>
        </div>
      </div>
      <div class="form-section">
        <h3>Household</h3>
        <label class="form-field">
          <span>Household size</span>
          <input id="public-kyc-household-size" type="number" min="0" />
        </label>
        <label class="form-field">
          <span>Number of dependents</span>
          <input id="public-kyc-dependents" type="number" min="0" />
        </label>
      </div>
      <div class="form-section">
        <h3>Customer type & income</h3>
        <label class="form-field">
          <span>Customer type</span>
          <select id="public-kyc-customer-type">
            <option value="">Select type</option>
            <option value="SALARIED">Salaried</option>
            <option value="SELF_EMPLOYED">Self-employed</option>
            <option value="OTHER">Other</option>
          </select>
        </label>
        <div id="public-kyc-income-salaried" class="form-subgrid hidden">
          <label class="form-field">
            <span>Employer name</span>
            <input id="public-kyc-employer-name" type="text" />
          </label>
          <label class="form-field">
            <span>Employer address</span>
            <input id="public-kyc-employer-address" type="text" />
          </label>
          <label class="form-field">
            <span>Occupation</span>
            <input id="public-kyc-occupation" type="text" />
          </label>
          <label class="form-field">
            <span>Monthly income</span>
            <input id="public-kyc-monthly-income" type="number" min="0" />
          </label>
        </div>
        <div id="public-kyc-income-self" class="form-subgrid hidden">
          <label class="form-field">
            <span>Business name</span>
            <input id="public-kyc-business-name" type="text" />
          </label>
          <label class="form-field">
            <span>Business address</span>
            <input id="public-kyc-business-address" type="text" />
          </label>
          <label class="form-field">
            <span>Monthly income (approximate net)</span>
            <input id="public-kyc-monthly-income-self" type="number" min="0" />
          </label>
        </div>
        <div id="public-kyc-income-other" class="form-subgrid hidden">
          <label class="form-field">
            <span>Occupation/description</span>
            <input id="public-kyc-occupation-other" type="text" />
          </label>
          <label class="form-field" id="public-kyc-other-income-label">
            <span>Monthly income</span>
            <input id="public-kyc-monthly-income-other" type="number" min="0" />
          </label>
        </div>
      </div>
      <div class="form-section">
        <h3>Guarantor / emergency contact</h3>
        <label class="form-field">
          <span>Guarantor name</span>
          <input id="public-kyc-guarantor-name" type="text" />
        </label>
        <label class="form-field">
          <span>Relationship</span>
          <input id="public-kyc-guarantor-relationship" type="text" />
        </label>
        <label class="form-field">
          <span>Mobile</span>
          <input id="public-kyc-guarantor-mobile" type="tel" />
        </label>
      </div>
      <div class="form-section">
        <h3>Consents</h3>
        <label class="form-field">
          <span><input id="public-kyc-consent-data" type="checkbox" /> I confirm the above information is accurate and true.</span>
        </label>
        <label class="form-field">
          <span><input id="public-kyc-consent-credit" type="checkbox" /> I authorize Grow Microfinance to verify my information with banks/employers if necessary.</span>
        </label>
      </div>
      <button type="submit" class="primary" id="public-kyc-submit">Submit KYC documents</button>
    </form>
    <p id="public-kyc-helper" class="muted">
      Your documents are uploaded securely and stored using encrypted cloud storage. Our team will review and update your KYC status within 1–2 business days.
    </p>
    <div id="public-kyc-success" class="hidden">
      <h2>✅ KYC submitted successfully</h2>
      <p>
        Thank you. Your documents have been uploaded. Our team will review them shortly and update your status.
        You will be contacted if any additional information is required.
      </p>
      <div>
        <h4>Uploaded documents</h4>
        <ul id="public-kyc-saved-list"></ul>
      </div>
    </div>
  `;

  appMain.insertBefore(publicKycSection, appMain.firstChild);

  publicKycForm = publicKycSection.querySelector('#public-kyc-form');
  publicKycStatus = publicKycSection.querySelector('#public-kyc-status');
  publicKycSummary = publicKycSection.querySelector('#public-kyc-summary');
  publicKycLoading = publicKycSection.querySelector('#public-kyc-loading');
  publicKycCodeInput = publicKycSection.querySelector('#public-kyc-code');
  publicKycNicInput = publicKycSection.querySelector('#public-kyc-nic');
  publicKycFileNicFront = publicKycSection.querySelector('#public-kyc-nic-front');
  publicKycFileNicBack = publicKycSection.querySelector('#public-kyc-nic-back');
  publicKycFileSelfie = publicKycSection.querySelector('#public-kyc-selfie-nic');
  publicKycFileAddressProof = publicKycSection.querySelector('#public-kyc-address-proof');
  publicKycSubmit = publicKycSection.querySelector('#public-kyc-submit');
  publicKycHelperText = publicKycSection.querySelector('#public-kyc-helper');
  publicKycSuccess = publicKycSection.querySelector('#public-kyc-success');
  publicKycSavedList = publicKycSection.querySelector('#public-kyc-saved-list');
  publicKycDobInput = publicKycSection.querySelector('#public-kyc-dob');
  publicKycCivilStatusSelect = publicKycSection.querySelector('#public-kyc-civil-status');
  publicKycPermanentLine1 = publicKycSection.querySelector('#public-kyc-permanent-line1');
  publicKycPermanentLine2 = publicKycSection.querySelector('#public-kyc-permanent-line2');
  publicKycPermanentCity = publicKycSection.querySelector('#public-kyc-permanent-city');
  publicKycPermanentDistrict = publicKycSection.querySelector('#public-kyc-permanent-district');
  publicKycPermanentProvince = publicKycSection.querySelector('#public-kyc-permanent-province');
  publicKycPermanentPostalCode = publicKycSection.querySelector('#public-kyc-permanent-postal');
  publicKycCurrentDifferent = publicKycSection.querySelector('#public-kyc-current-different');
  publicKycCurrentLine1 = publicKycSection.querySelector('#public-kyc-current-line1');
  publicKycCurrentLine2 = publicKycSection.querySelector('#public-kyc-current-line2');
  publicKycCurrentCity = publicKycSection.querySelector('#public-kyc-current-city');
  publicKycCurrentDistrict = publicKycSection.querySelector('#public-kyc-current-district');
  publicKycCurrentProvince = publicKycSection.querySelector('#public-kyc-current-province');
  publicKycCurrentPostalCode = publicKycSection.querySelector('#public-kyc-current-postal');
  publicKycCurrentSince = publicKycSection.querySelector('#public-kyc-current-since');
  publicKycHouseholdSize = publicKycSection.querySelector('#public-kyc-household-size');
  publicKycDependentsCount = publicKycSection.querySelector('#public-kyc-dependents');
  publicKycCustomerType = publicKycSection.querySelector('#public-kyc-customer-type');
  publicKycEmployerName = publicKycSection.querySelector('#public-kyc-employer-name');
  publicKycEmployerAddress = publicKycSection.querySelector('#public-kyc-employer-address');
  publicKycOccupation = publicKycSection.querySelector('#public-kyc-occupation');
  publicKycMonthlyIncome = publicKycSection.querySelector('#public-kyc-monthly-income');
  publicKycBusinessName = publicKycSection.querySelector('#public-kyc-business-name');
  publicKycBusinessAddress = publicKycSection.querySelector('#public-kyc-business-address');
  publicKycGuarantorName = publicKycSection.querySelector('#public-kyc-guarantor-name');
  publicKycGuarantorRelationship = publicKycSection.querySelector('#public-kyc-guarantor-relationship');
  publicKycGuarantorMobile = publicKycSection.querySelector('#public-kyc-guarantor-mobile');
  publicKycConsentDataProcessing = publicKycSection.querySelector('#public-kyc-consent-data');
  publicKycConsentCreditChecks = publicKycSection.querySelector('#public-kyc-consent-credit');
  publicKycCurrentAddressGroup = publicKycSection.querySelector('#public-kyc-current-address-group');
  publicKycIncomeSalaried = publicKycSection.querySelector('#public-kyc-income-salaried');
  publicKycIncomeSelfEmployed = publicKycSection.querySelector('#public-kyc-income-self');
  publicKycIncomeOther = publicKycSection.querySelector('#public-kyc-income-other');
  publicKycOtherIncomeLabel = publicKycSection.querySelector('#public-kyc-other-income-label');

  const clearFieldError = (field) => setPublicKycFieldError(field, '');

  publicKycFileNicFront?.addEventListener('change', () => clearFieldError('nic_front'));
  publicKycFileNicBack?.addEventListener('change', () => clearFieldError('nic_back'));
  publicKycFileSelfie?.addEventListener('change', () => clearFieldError('selfie_nic'));
  publicKycFileAddressProof?.addEventListener('change', () => clearFieldError('address_proof'));

  const toggleCurrentAddressVisibility = () => {
    const isDifferent = !!publicKycCurrentDifferent?.checked;
    publicKycState.currentAddressDifferent = isDifferent;
    publicKycCurrentAddressGroup?.classList.toggle('hidden', !isDifferent);
  };

  const toggleIncomeSections = () => {
    const type = publicKycCustomerType?.value || '';
    publicKycState.customerType = type;
    publicKycIncomeSalaried?.classList.toggle('hidden', type !== 'SALARIED');
    publicKycIncomeSelfEmployed?.classList.toggle('hidden', type !== 'SELF_EMPLOYED');
    publicKycIncomeOther?.classList.toggle('hidden', type !== 'OTHER');
  };

  publicKycCurrentDifferent?.addEventListener('change', toggleCurrentAddressVisibility);
  publicKycCustomerType?.addEventListener('change', toggleIncomeSections);

  toggleCurrentAddressVisibility();
  toggleIncomeSections();

  publicKycForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    handlePublicKycSubmit();
  });
}

function buildDocumentUrl(filePath) {
  if (!filePath) return '#';
  if (/^https?:\/\//i.test(filePath) || filePath.startsWith('data:')) return filePath;

  const SUPABASE_URL = 'https://qhelviapplgqmtofucae.supabase.co';
  const SUPABASE_BUCKET = 'grow-documents';
  const normalizedPath = filePath.replace(/^\/+/, '');
  return `${SUPABASE_URL}/storage/v1/object/public/${SUPABASE_BUCKET}/${normalizedPath}`;
}

function getApiBaseUrl() {
  return (
    apiConfig?.baseUrl || window.apiConfig?.apiBaseUrl || window.apiConfig?.baseUrl || defaultApiConfig.baseUrl
  );
}

async function fetchLoanApplicationDocuments() {
  const { token } = getSession();
  const headers = { Accept: 'application/json' };
  if (token) headers.Authorization = `Bearer ${token}`;

  const baseUrl = getApiBaseUrl().replace(/\/+$/, '');
  const url = `${baseUrl}/loan-application-documents`;

  const response = await fetch(url, { method: 'GET', headers });
  const { data, raw } = await parseResponse(response.clone());

  if (!response.ok) {
    const message = buildErrorMessage({ status: response.status, data, raw });
    throw new Error(message);
  }

  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data?.items)) return data.data.items;
  if (Array.isArray(data?.results)) return data.results;
  if (Array.isArray(data?.data)) return data.data;

  return [];
}

function renderStatusBadge(status) {
  const normalized = (status || 'UNKNOWN').toUpperCase();
  const badgeClassMap = {
    DRAFT: 'badge-neutral',
    SUBMITTED: 'badge-info',
    UNDER_REVIEW: 'badge-warning',
    STAFF_APPROVED: 'badge-success',
    APPROVED: 'badge-success',
    REJECTED: 'badge-danger',
    PENDING: 'badge-warning',
    UPLOADED: 'badge-warning',
    ELIGIBLE: 'badge-success',
    NOT_ELIGIBLE: 'badge-danger',
    NEW: 'badge-info',
    CONTACTED: 'badge-warning',
    IN_PROGRESS: 'badge-info',
    CONVERTED: 'badge-success',
    LOST: 'badge-neutral',
    DISBURSED: 'badge-info',
    ACTIVE: 'badge-info',
    OVERDUE: 'badge-warning',
    SETTLED: 'badge-success',
    WRITTEN_OFF: 'badge-danger',
    CANCELLED: 'badge-neutral',
  };

  const badgeClass = badgeClassMap[normalized] || 'badge-neutral';
  return `<span class="badge ${badgeClass}">${normalized}</span>`;
}


function hasActiveOverlay() {
  return !!document.querySelector(
    '.app-modal:not(.hidden), .modal:not(.hidden), .modal-overlay:not(.hidden), .loading-overlay.active, .drawer-backdrop.active, .screen-overlay.active'
  );
}

function restoreBodyScrollingIfNoOverlay() {
  if (hasActiveOverlay()) return;
  document.body.classList.remove(...overlayBodyClasses);
}

function cleanupInactiveOverlays() {
  document
    .querySelectorAll('.modal-backdrop, .loading-overlay, .drawer-backdrop, .screen-overlay, .app-modal-backdrop')
    .forEach((element) => {
      const parentModal = element.closest('.app-modal');
      const isActiveParentModal = parentModal && !parentModal.classList.contains('hidden');
      if (
        !isActiveParentModal &&
        !element.classList.contains('active') &&
        !element.classList.contains('open') &&
        !element.classList.contains('show')
      ) {
        element.remove();
      }
    });
  restoreBodyScrollingIfNoOverlay();
}

function ensureModalBackdrop(modal) {
  if (!modal) return null;
  let backdrop = modal.querySelector(':scope > .app-modal-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'app-modal-backdrop active show';
    backdrop.dataset.modalClose = 'true';
    modal.prepend(backdrop);
  }
  backdrop.classList.remove('hidden');
  backdrop.classList.add('active', 'show');
  return backdrop;
}

function removeModalBackdrop(modal) {
  modal?.querySelectorAll(':scope > .app-modal-backdrop').forEach((backdrop) => backdrop.remove());
}

function setInlineAlert(target, text, type = 'success') {
  if (!target) return;
  target.textContent = text;
  target.className = `alert ${type === 'error' ? 'error' : 'success'}`;
  target.classList.toggle('hidden', !text);
}

function getToastContainer() {
  if (toastContainer) return toastContainer;
  toastContainer = document.createElement('div');
  toastContainer.className = 'toast-container';
  document.body.appendChild(toastContainer);
  return toastContainer;
}

function showToast(message, type = 'success') {
  if (!message) return;
  const container = getToastContainer();
  const toast = document.createElement('div');
  toast.className = `toast ${type === 'error' ? 'error' : 'success'}`;
  toast.setAttribute('role', 'status');
  toast.textContent = message;
  container.appendChild(toast);

  requestAnimationFrame(() => toast.classList.add('visible'));

  setTimeout(() => {
    toast.classList.remove('visible');
    setTimeout(() => toast.remove(), 250);
  }, 3200);
}

function resetAdminLoansState() {
  adminLoansState.loans = [];
  adminLoansState.error = null;
  adminLoansState.loading = false;
  adminLoansState.hasLoaded = false;
  adminLoansState.selectedLoan = null;
  adminLoansState.detailTab = 'details';
  adminLoansState.ledger = [];
  adminLoansState.ledgerTotals = null;
  adminLoansState.ledgerLoading = false;
  adminLoansState.ledgerError = null;
  adminLoansState.ledgerLoadedLoanId = null;
  adminLoansState.page = 1;
  adminLoansState.pageSize = 25;
  adminLoansState.total = 0;
  Object.assign(loanFilters, { q: '', status: '', balanceStatus: '', dateFrom: '', dateTo: '', principalMin: '', principalMax: '', sortBy: 'disbursement_date', sortDirection: 'desc' });

  if (!adminLoansInitialized) return;
  setInlineAlert(adminLoansMessage, '');
  if (adminLoansTableBody) adminLoansTableBody.innerHTML = '';
}

function resetAdminLoanApplicationsState() {
  adminLoanApplicationsState.loanApplications = [];
  adminLoanApplicationsState.loanApplicationsError = null;
  adminLoanApplicationsState.loanApplicationsLoading = false;
  adminLoanApplicationsState.hasLoaded = false;
  adminLoanApplicationsState.selectedStatus = 'ALL';

  if (!adminLoanApplicationsInitialized) return;
  setInlineAlert(adminLoanApplicationsMessage, '');
  if (adminLoanApplicationsTableBody) adminLoanApplicationsTableBody.innerHTML = '';

  if (adminLoanApplicationsStatusFilter) {
    adminLoanApplicationsStatusFilter.value = 'ALL';
  }
}

function resetAdminCustomersState() {
  adminCustomersState.customers = [];
  adminCustomersState.error = null;
  adminCustomersState.loading = false;
  adminCustomersState.hasLoaded = false;
  adminCustomersState.filters = { kyc: 'ALL', eligibility: 'ALL' };

  if (adminCustomersMessage) setInlineAlert(adminCustomersMessage, '');
  adminCustomersLoading?.classList.add('hidden');
  adminCustomersEmptyState?.classList.add('hidden');
  adminCustomersTableWrapper?.classList.add('hidden');
  if (adminCustomersTableBody) adminCustomersTableBody.innerHTML = '';
}

function resetAdminKycQueueState() {
  adminKycQueueState.customers = [];
  adminKycQueueState.error = null;
  adminKycQueueState.loading = false;
  adminKycQueueState.hasLoaded = false;

  setInlineAlert(adminKycQueueMessage, '');
  adminKycQueueLoading?.classList.add('hidden');
  adminKycQueueEmptyState?.classList.add('hidden');
  adminKycQueueTableWrapper?.classList.add('hidden');
  if (adminKycQueueTableBody) adminKycQueueTableBody.innerHTML = '';
}

function resetAdminLeadsState() {
  adminLeadsState.leads = [];
  adminLeadsState.error = null;
  adminLeadsState.loading = false;
  adminLeadsState.hasLoaded = false;
  adminLeadsState.showNewLeadForm = false;

  if (adminLeadsMessage) setInlineAlert(adminLeadsMessage, '');
  adminLeadsLoading?.classList.add('hidden');
  adminLeadsEmptyState?.classList.add('hidden');
  adminLeadsTableWrapper?.classList.add('hidden');
  if (adminLeadsTableBody) adminLeadsTableBody.innerHTML = '';
}

function ensureAdminLoansUI() {
  if (!adminLoansSection || adminLoansInitialized) return;
  adminLoansInitialized = true;

  const cardHeader = adminLoansSection.querySelector('.card-header');
  if (cardHeader && !cardHeader.querySelector('#admin-refresh-loans')) {
    const actions = document.createElement('div');
    actions.className = 'table-actions';
    const refreshBtn = document.createElement('button');
    refreshBtn.type = 'button';
    refreshBtn.id = 'admin-refresh-loans';
    refreshBtn.className = 'secondary';
    refreshBtn.textContent = 'Refresh';
    actions.appendChild(refreshBtn);
    cardHeader.appendChild(actions);
  }

  let loansCard = adminLoansSection.querySelector('#admin-loans-list-card');
  if (!loansCard) {
    loansCard = document.createElement('div');
    loansCard.id = 'admin-loans-list-card';
    loansCard.className = 'subcard';
    loansCard.innerHTML = `
      <div class="card-header">
        <div>
          <div class="eyebrow">Loan list</div>
          <h3>All loans</h3>
          <p class="muted">Live loan records from the admin loans API.</p>
        </div>
      </div>
      <p id="admin-loans-message" class="alert hidden" aria-live="polite"></p>
      <div id="admin-loans-controls" class="admin-loans-filter-toolbar">
        <label class="admin-loans-search">Search Loans<input id="admin-loans-search" type="search" placeholder="Search by loan number, customer name, NIC or mobile..." autocomplete="off"></label>
        <label>Status<select id="admin-loans-status-filter"><option value="">All Statuses</option><option value="ACTIVE">Active</option><option value="OVERDUE">Overdue</option><option value="SETTLED">Settled</option><option value="WRITTEN_OFF">Written Off</option><option value="CANCELLED">Cancelled</option></select></label>
        <label>Balance Status<select id="admin-loans-balance-status"><option value="">All Balances</option><option value="OUTSTANDING">Outstanding</option><option value="FULLY_PAID">Fully Paid</option><option value="OVERPAID">Overpaid / Customer Credit</option><option value="ZERO_BALANCE">Zero Balance</option></select></label>
        <label>Date From<input id="admin-loans-date-from" type="date"></label>
        <label>Date To<input id="admin-loans-date-to" type="date"></label>
        <label>Principal Min<input id="admin-loans-principal-min" type="number" min="0" step="0.01"></label>
        <label>Principal Max<input id="admin-loans-principal-max" type="number" min="0" step="0.01"></label>
        <div class="admin-loans-filter-actions"><button type="button" id="admin-loans-apply-filters">Apply Filters</button><button type="button" id="admin-loans-clear-filters" class="secondary">Clear Filters</button></div>
      </div>
      <p id="admin-loans-result-summary" class="muted" aria-live="polite"></p>
      <div class="loan-table-wrapper">
        <table id="admin-loans-table" class="placeholder-table loan-table">
          <thead><tr>
            <th><button type="button" class="loan-sort" data-loan-sort="loan_number">Loan Number</button></th>
            <th class="admin-loans-customer-col"><button type="button" class="loan-sort" data-loan-sort="customer">Customer</button></th>
            <th><button type="button" class="loan-sort" data-loan-sort="principal_amount">Principal Amount</button></th>
            <th><button type="button" class="loan-sort" data-loan-sort="total_payable">Total Payable</button></th>
            <th><button type="button" class="loan-sort" data-loan-sort="total_paid">Total Paid</button></th>
            <th><button type="button" class="loan-sort" data-loan-sort="outstanding">Outstanding</button></th>
            <th>Customer Credit</th>
            <th><button type="button" class="loan-sort" data-loan-sort="settled_date">Settled Date</button></th>
            <th><button type="button" class="loan-sort" data-loan-sort="status">Status</button></th><th>Actions</th>
          </tr></thead><tbody id="admin-loans-table-body"></tbody>
        </table>
      </div>
      <div id="admin-loans-pagination" class="admin-loans-pagination"><button type="button" id="admin-loans-previous" class="secondary">Previous</button><span id="admin-loans-page-number">Page 1</span><button type="button" id="admin-loans-next" class="secondary">Next</button><label>Page size<select id="admin-loans-page-size"><option>10</option><option selected>25</option><option>50</option><option>100</option></select></label></div>
    `;
    adminLoansSection.appendChild(loansCard);
  }

  adminLoansMessage = adminLoansSection.querySelector('#admin-loans-message');
  adminLoansTableBody = adminLoansSection.querySelector('#admin-loans-table-body');
  adminRefreshLoansBtn = adminLoansSection.querySelector('#admin-refresh-loans');
  adminLoansControls = adminLoansSection.querySelector('#admin-loans-controls');
  adminLoansSummary = adminLoansSection.querySelector('#admin-loans-result-summary');
  adminLoansPagination = adminLoansSection.querySelector('#admin-loans-pagination');
  const controls = {
    search: adminLoansSection.querySelector('#admin-loans-search'), status: adminLoansSection.querySelector('#admin-loans-status-filter'),
    balanceStatus: adminLoansSection.querySelector('#admin-loans-balance-status'), dateFrom: adminLoansSection.querySelector('#admin-loans-date-from'),
    dateTo: adminLoansSection.querySelector('#admin-loans-date-to'), principalMin: adminLoansSection.querySelector('#admin-loans-principal-min'),
    principalMax: adminLoansSection.querySelector('#admin-loans-principal-max'), pageSize: adminLoansSection.querySelector('#admin-loans-page-size'),
  };
  const syncFiltersFromControls = () => Object.entries(controls).forEach(([key, control]) => {
    if (control && key !== 'pageSize') loanFilters[key] = control.value;
  });
  let searchTimer;
  controls.search?.addEventListener('input', () => { loanFilters.q = controls.search.value; clearTimeout(searchTimer); searchTimer = setTimeout(() => { adminLoansState.page = 1; loadAdminLoans(true); }, 300); });
  [controls.status, controls.balanceStatus, controls.dateFrom, controls.dateTo, controls.principalMin, controls.principalMax].forEach((control) => control?.addEventListener('change', () => syncFiltersFromControls()));
  adminLoansSection.querySelector('#admin-loans-apply-filters')?.addEventListener('click', () => { syncFiltersFromControls(); adminLoansState.page = 1; loadAdminLoans(true); });
  adminLoansSection.querySelector('#admin-loans-clear-filters')?.addEventListener('click', () => { Object.assign(loanFilters, { q: '', status: '', balanceStatus: '', dateFrom: '', dateTo: '', principalMin: '', principalMax: '', sortBy: 'disbursement_date', sortDirection: 'desc' }); Object.entries(controls).forEach(([key, control]) => { if (control) control.value = key === 'pageSize' ? String(adminLoansState.pageSize) : ''; }); adminLoansState.page = 1; loadAdminLoans(true); });
  controls.pageSize?.addEventListener('change', () => { adminLoansState.pageSize = Number(controls.pageSize.value); adminLoansState.page = 1; loadAdminLoans(true); });
  adminLoansSection.querySelector('#admin-loans-previous')?.addEventListener('click', () => { if (adminLoansState.page > 1) { adminLoansState.page -= 1; loadAdminLoans(true); } });
  adminLoansSection.querySelector('#admin-loans-next')?.addEventListener('click', () => { if (adminLoansState.page * adminLoansState.pageSize < adminLoansState.total) { adminLoansState.page += 1; loadAdminLoans(true); } });
  adminLoansSection.querySelector('#admin-loans-table')?.addEventListener('click', (event) => { const button = event.target.closest('[data-loan-sort]'); if (!button) return; const sortBy = button.dataset.loanSort; loanFilters.sortDirection = loanFilters.sortBy === sortBy && loanFilters.sortDirection === 'asc' ? 'desc' : 'asc'; loanFilters.sortBy = sortBy; adminLoansState.page = 1; loadAdminLoans(true); });
  adminRefreshLoansBtn?.addEventListener('click', () => loadAdminLoans(true));

  if (!document.querySelector('#admin-loan-ledger-style')) {
    const style = document.createElement('style');
    style.id = 'admin-loan-ledger-style';
    style.textContent = `
      .loan-detail-modal { display:flex; align-items:center; justify-content:center; padding:20px; overflow:hidden; background:rgba(15, 23, 42, 0.55); z-index:1200; }
      .loan-detail-modal .app-modal-dialog { width:min(1200px, calc(100vw - 40px)); max-width:1200px; height:min(90vh, 900px); max-height:90vh; margin:0; }
      .loan-detail-modal .modal-header { position:sticky; top:0; z-index:3; display:flex; align-items:flex-start; justify-content:space-between; gap:1rem; padding:1rem 1.25rem; background:#fff; border-bottom:1px solid var(--border); }
      .loan-detail-modal .modal-header h3 { margin:0; }
      .loan-detail-modal .modal-close-button { flex:0 0 36px; width:36px; min-width:36px; min-height:36px; padding:0; display:inline-flex; align-items:center; justify-content:center; font-size:1.25rem; line-height:1; }
      .loan-detail-tabs { position:sticky; top:var(--loan-modal-header-height, 82px); z-index:2; display:flex; flex:0 0 auto; gap:0.5rem; margin:0; padding:0 1.25rem; background:#fff; border-bottom:1px solid rgba(148, 163, 184, 0.25); }
      .loan-detail-tab { border: 0; border-bottom: 2px solid transparent; background: transparent; padding: 0.75rem 1rem; cursor: pointer; }
      .loan-detail-tab.active { border-bottom-color: #16a34a; color: #166534; font-weight: 700; }
      .loan-detail-modal .modal-body { flex:1 1 auto; min-height:0; overflow-y:auto; overflow-x:hidden; padding:1rem calc(1.25rem - 6px) 1.25rem 1.25rem; }
      .loan-detail-modal .modal-loading { min-height:12rem; display:grid; place-items:center; text-align:center; }
      .loan-summary-grid, .loan-detail-grid, .ledger-totals-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(160px, 1fr)); gap: 0.75rem; margin-bottom: 1rem; }
      .loan-detail-stat { border: 1px solid rgba(148, 163, 184, 0.25); border-radius: 0.85rem; padding: 0.75rem; background: rgba(248, 250, 252, 0.8); }
      .loan-detail-stat span { display: block; color: #64748b; font-size: 0.78rem; text-transform: uppercase; letter-spacing: 0.04em; }
      .loan-detail-stat strong { display: block; margin-top: 0.25rem; }
      .loan-detail-actions { display: flex; justify-content: flex-end; margin: 0 0 1rem; }
      .loan-ledger-table-wrap { width:100%; overflow-x:auto; overflow-y:visible; -webkit-overflow-scrolling:touch; }
      .loan-ledger-table-wrap table { width:max-content; min-width:1400px; }
      /* Payment is a sibling overlay, never a child of the scrollable loan dialog. */
      .record-payment-modal { position:fixed; inset:0; z-index:2000; display:flex; align-items:center; justify-content:center; padding:20px; overflow:auto; background:rgba(15,23,42,.6); }
      .record-payment-modal .modal-card { position:relative; z-index:2001; width:min(900px, 100%); max-height:calc(100vh - 40px); overflow:auto; }
      .historical-accounting-modal .modal-card { background:#fff; color:#0f172a; max-height:92vh; overflow:auto; }
      .sticky-modal-footer { position: sticky; bottom: 0; background:#fff; border-top:1px solid rgba(148,163,184,.25); padding-top: .75rem; }
      .accounting-summary-cards { grid-template-columns: repeat(auto-fit, minmax(190px, 1fr)); }
      .admin-loans-filter-toolbar { display:grid; grid-template-columns:repeat(auto-fit, minmax(145px, 1fr)); gap:.75rem; align-items:end; margin:1rem 0; } .admin-loans-filter-toolbar label { display:grid; gap:.3rem; font-weight:600; } .admin-loans-search { grid-column:span 2; } .admin-loans-filter-toolbar input, .admin-loans-filter-toolbar select { width:100%; } .admin-loans-filter-actions, .admin-loans-pagination { display:flex; flex-wrap:wrap; align-items:end; gap:.5rem; } .admin-loans-pagination { margin-top:1rem; } .loan-sort { border:0; background:transparent; padding:0; font:inherit; font-weight:inherit; cursor:pointer; white-space:nowrap; } .loan-sort[aria-sort="ascending"]::after { content:" ▲"; font-size:.7em; } .loan-sort[aria-sort="descending"]::after { content:" ▼"; font-size:.7em; } .loan-table-wrapper { overflow-x:auto; }
      @media (max-width: 768px) { .loan-detail-modal { padding:12px; } .loan-detail-modal .app-modal-dialog { width:calc(100vw - 24px); height:min(92vh, 900px); max-height:92vh; } .loan-detail-tabs { overflow-x:auto; } .admin-loans-search { grid-column:1 / -1; } .admin-loans-filter-actions { grid-column:1 / -1; } }
      @media (max-width: 640px) { .loan-detail-modal { padding:0; } .loan-detail-modal .app-modal-dialog { width:100vw; height:100vh; max-width:none; max-height:none; border-radius:0; border:0; } .loan-detail-modal .modal-header { padding:.875rem 1rem; } .loan-detail-tabs { top:var(--loan-modal-header-height, 76px); padding:0 1rem; } .loan-detail-modal .modal-body { padding:1rem calc(1rem - 6px) 1rem 1rem; } .record-payment-modal { padding:0; align-items:stretch; } .record-payment-modal .modal-card { width:100vw; max-height:100vh; border-radius:0; } }
    `;
    document.head.appendChild(style);
  }

  if (!adminLoanDetailModal) {
    adminLoanDetailModal = document.createElement('div');
    adminLoanDetailModal.id = 'admin-loan-detail-modal';
    adminLoanDetailModal.className = 'app-modal loan-detail-modal hidden';
    adminLoanDetailModal.innerHTML = `
      <div class="app-modal-dialog" role="dialog" aria-modal="true" aria-labelledby="admin-loan-detail-title">
        <div class="modal-header">
          <div>
            <div class="eyebrow">Loan detail</div>
            <h3 id="admin-loan-detail-title">Loan</h3>
            <p id="admin-loan-detail-status" class="muted"></p>
          </div>
          <button type="button" class="ghost modal-close-button" id="close-admin-loan-detail" aria-label="Close loan detail" title="Close loan detail">×</button>
        </div>
        <div id="admin-loan-detail-tabs" class="loan-detail-tabs" role="tablist">
          <button type="button" class="loan-detail-tab active" data-admin-loan-tab="details">Details</button>
          <button type="button" class="loan-detail-tab" data-admin-loan-tab="ledger">Ledger</button>
        </div>
        <div class="modal-body">
          <p id="admin-loan-detail-message" class="alert hidden" aria-live="polite"></p>
          <div id="admin-loan-detail-content"></div>
        </div>
      </div>
    `;
    document.body.appendChild(adminLoanDetailModal);
  }

  adminLoanDetailTitle = adminLoanDetailModal.querySelector('#admin-loan-detail-title');
  adminLoanDetailStatus = adminLoanDetailModal.querySelector('#admin-loan-detail-status');
  adminLoanDetailMessage = adminLoanDetailModal.querySelector('#admin-loan-detail-message');
  adminLoanDetailTabs = adminLoanDetailModal.querySelector('#admin-loan-detail-tabs');
  adminLoanDetailContent = adminLoanDetailModal.querySelector('#admin-loan-detail-content');
  adminLoanDetailCloseBtn = adminLoanDetailModal.querySelector('#close-admin-loan-detail');

  adminLoanDetailCloseBtn?.addEventListener('click', closeAdminLoanDetail);
  adminLoanDetailModal.addEventListener('click', (event) => {
    if (event.target === adminLoanDetailModal) closeAdminLoanDetail();
  });
  adminLoanDetailTabs?.addEventListener('click', (event) => {
    const tab = event.target.closest('[data-admin-loan-tab]')?.dataset.adminLoanTab;
    if (tab) switchAdminLoanDetailTab(tab);
  });
  // Ledger rows are rendered after the dialog opens, so bind this once to the
  // stable dialog rather than to individual dynamic buttons.
  adminLoanDetailModal.addEventListener('click', (event) => {
    const postSettlementButton = event.target.closest('[data-post-settlement-payment]');
    if (postSettlementButton) {
      event.preventDefault();
      event.stopPropagation();
      openPostSettlementPayment(postSettlementButton);
      return;
    }
    const button = event.target.closest('[data-action="record-payment"]');
    if (!button) return;
    event.preventDefault();
    event.stopPropagation();
    const { loanId, ledgerEntryId, installmentNo } = button.dataset;
    if (!loanId || !ledgerEntryId) {
      setInlineAlert(adminLoanDetailMessage, 'Unable to open payment form: ledger entry information is missing.', 'error');
      return;
    }
    recordAdminLedgerPayment({ loanId, ledgerEntryId, installmentNo, opener: button });
  });
  adminLoanDetailModal.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeAdminLoanDetail();
  });
}


function normalizeLoansResponse(response) {
  if (Array.isArray(response)) return response;

  const candidates = [
    response?.loans,
    response?.data?.loans,
    response?.data,
    response?.items,
    response?.data?.items,
    response?.content,
    response?.data?.content,
    response?.results,
    response?.data?.results,
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
    if (candidate && typeof candidate === 'object') {
      if (Array.isArray(candidate.loans)) return candidate.loans;
      if (Array.isArray(candidate.items)) return candidate.items;
      if (Array.isArray(candidate.content)) return candidate.content;
      if (Array.isArray(candidate.data)) return candidate.data;
      if (Array.isArray(candidate.results)) return candidate.results;
    }
  }

  return [];
}

function getLoanField(loan, keys, fallback = '—') {
  for (const key of keys) {
    const value = key.split('.').reduce((acc, part) => acc?.[part], loan);
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return fallback;
}


function getLoanId(loan) {
  return getLoanField(loan, ['id', 'loan_id', 'loanId', 'uuid', 'loan.uuid'], '');
}

function getLoanStatus(loan = {}) { return String(getLoanField(loan, ['status', 'loan_status', 'loanStatus'], 'UNKNOWN')).toUpperCase(); }
function getLoanOutstanding(loan = {}) { return Number(getLoanField(loan, ['outstanding', 'outstanding_amount', 'outstandingAmount', 'outstanding_balance', 'outstandingBalance', 'balance'], 0)) || 0; }
function displayLoanOutstanding(loan = {}) { return Math.max(0, getLoanOutstanding(loan)); }
function getCustomerCreditAmount(source = {}) { return Math.max(0, Number(getLoanField(source, ['customer_credit', 'customerCredit', 'customer_credit_amount', 'customerCreditAmount', 'credit_amount', 'creditAmount', 'overpayment_credit', 'overpaymentCredit'], 0)) || 0); }
function getActualCustomerCashPaid(source = {}, fallback = 0) { return Number(getLoanField(source, ['cash_received', 'cashReceived', 'total_cash_received', 'totalCashReceived', 'actual_cash_received', 'actualCashReceived', 'customer_cash_received', 'customerCashReceived'], fallback)) || 0; }
function getDelayInterestSettlementAdjustment(source = {}) { return Number(getLoanField(source, ['delay_interest_waived', 'delayInterestWaived', 'delay_interest_waiver_amount', 'delayInterestWaiverAmount', 'settlement.delay_interest_waiver_amount'], 0)) || 0; }
function getSettlementDisplayValue(sources = [], keys = []) {
  for (const source of sources) {
    const value = getLoanField(source || {}, keys, null);
    if (value !== undefined && value !== null && value !== '') return value;
  }
  return undefined;
}
function getSettlementDisplaySummary(...sources) {
  const totalPaid = getSettlementDisplayValue(sources, ['total_paid', 'totalPaid']);
  const cashPaid = getSettlementDisplayValue(sources, ['cash_paid', 'cashPaid']);
  const delayInterestPaid = getSettlementDisplayValue(sources, ['delay_interest_paid', 'delayInterestPaid']);
  const delayInterestWaived = getSettlementDisplayValue(sources, ['delay_interest_waived', 'delayInterestWaived']);
  const settlementAdjustments = getSettlementDisplayValue(sources, ['settlement_adjustments', 'settlementAdjustments']);
  const grossSatisfiedAmount = getSettlementDisplayValue(sources, ['gross_satisfied_amount', 'grossSatisfiedAmount']);
  return {
    totalPaid: Number(totalPaid ?? cashPaid ?? 0) || 0,
    delayInterestPaid,
    delayInterestWaived,
    settlementAdjustments,
    grossSatisfiedAmount,
    breakdownAvailable: [delayInterestPaid, delayInterestWaived, settlementAdjustments, grossSatisfiedAmount]
      .every((value) => value !== undefined && value !== null && value !== ''),
  };
}
function getLoanCustomerId(loan = {}) { return getLoanField(loan, ['customer_id', 'customerId', 'customer.id', 'borrower_id', 'borrowerId', 'borrower.id'], ''); }
function getSettlementDate(loan = {}) { return getLoanField(loan, ['settled_date', 'settledDate', 'settlement_date', 'settlementDate', 'closed_date', 'closedDate'], ''); }

function getLoanCustomerField(loan, keys, fallback = '') {
  const customer = loan?.customer || loan?.borrower || loan?.applicant || {};
  for (const key of keys) {
    const value = key.split('.').reduce((acc, part) => acc?.[part], loan);
    if (value !== undefined && value !== null && value !== '') return String(value);

    const customerValue = key.split('.').reduce((acc, part) => acc?.[part], customer);
    if (customerValue !== undefined && customerValue !== null && customerValue !== '') return String(customerValue);
  }
  return fallback;
}

function getCustomerDisplayNameFromLoan(loan) {
  const fullName = getLoanCustomerField(loan, [
    'customer.full_name', 'customer.fullName', 'customer.name', 'customer_name', 'customerName',
    'borrower.full_name', 'borrower.fullName', 'borrower.name', 'borrower_name', 'borrowerName',
    'applicant.full_name', 'applicant.fullName', 'applicant.name', 'applicant_name', 'applicantName',
    'full_name', 'fullName', 'name'
  ]).trim();
  return fullName || 'Unknown Customer';
}

function renderLoanCustomerCell(loan) {
  const name = getCustomerDisplayNameFromLoan(loan);
  const mobile = getLoanCustomerField(loan, [
    'customer.mobile_number', 'customer.mobileNumber', 'customer.mobile', 'customer.phone', 'customer.contact_number', 'customer.contactNumber',
    'borrower.mobile_number', 'borrower.mobileNumber', 'borrower.mobile', 'borrower.phone', 'borrower.contact_number', 'borrower.contactNumber',
    'applicant.mobile_number', 'applicant.mobileNumber', 'applicant.mobile', 'applicant.phone', 'applicant.contact_number', 'applicant.contactNumber',
    'customer_mobile', 'customerMobile', 'mobile_number', 'mobileNumber', 'mobile', 'phone', 'contact_number', 'contactNumber'
  ]).trim();
  const nic = getLoanCustomerField(loan, [
    'customer.nic_number', 'customer.nicNumber', 'customer.nic_no', 'customer.nicNo', 'customer.nic',
    'borrower.nic_number', 'borrower.nicNumber', 'borrower.nic_no', 'borrower.nicNo', 'borrower.nic',
    'applicant.nic_number', 'applicant.nicNumber', 'applicant.nic_no', 'applicant.nicNo', 'applicant.nic',
    'customer_nic', 'customerNic', 'nic_number', 'nicNumber', 'nic_no', 'nicNo', 'nic'
  ]).trim();

  return `<div class="loan-customer-cell">
    <strong>${escapeHtml(name)}</strong>
    ${mobile ? `<span class="loan-customer-mobile">${escapeHtml(mobile)}</span>` : ''}
    ${nic ? `<span class="loan-customer-nic">NIC: ${escapeHtml(nic)}</span>` : ''}
  </div>`;
}

function normalizeLedgerResponse(response) {
  const entriesCandidates = [
    response?.entries,
    response?.ledger,
    response?.data?.entries,
    response?.data?.ledger,
    response?.data,
    response?.items,
    response?.data?.items,
    response,
  ];
  let entries = [];
  for (const candidate of entriesCandidates) {
    if (Array.isArray(candidate)) {
      entries = candidate;
      break;
    }
  }
  const totals = response?.totals || response?.summary || response?.data?.totals || response?.data?.summary || null;
  return { entries, totals };
}

function getLedgerField(entry, keys, fallback = '—') {
  return getLoanField(entry, keys, fallback);
}

function loanHasValue(value) {
  return value !== undefined && value !== null && value !== '';
}

function getAuthoritativeLoanSource(loan = {}) {
  return collectLoanTermSource(loan);
}

function getAuthoritativeLoanValue(loan, keys, fallback = null) {
  const source = getAuthoritativeLoanSource(loan);
  return getLoanField(source, keys, fallback);
}

function getLedgerSummaryField(ledgerSummary = null, keys = [], fallback = null) {
  return getLoanField(ledgerSummary || {}, keys, fallback);
}

function getLedgerPeriodStartDate(row = {}) {
  return getLedgerField(row, ['period_start_date', 'periodStartDate', 'period_start', 'periodStart', 'start_date', 'startDate'], null);
}

function getLedgerDueDate(row = {}) {
  return getLedgerField(row, ['due_date', 'dueDate'], null);
}

function deriveFrequencyFromLedgerRows(ledgerRows = []) {
  if (!Array.isArray(ledgerRows) || ledgerRows.length < 2) return null;
  const dates = ledgerRows
    .map((row) => parseDateOnly(String(getLedgerDueDate(row) || '').slice(0, 10)) || new Date(getLedgerDueDate(row)))
    .filter((date) => !Number.isNaN(date.getTime()))
    .sort((a, b) => a.getTime() - b.getTime());
  if (dates.length < 2) return null;
  const diffDays = Math.round((dates[1].getTime() - dates[0].getTime()) / 86400000);
  if (diffDays >= 27 && diffDays <= 32) return 'MONTHLY';
  if (diffDays >= 6 && diffDays <= 8) return 'WEEKLY';
  if (diffDays === 1) return 'DAILY';
  return null;
}

function deriveFirstPeriodStartDate(ledgerRows = []) {
  const firstRow = ledgerRows.find((row) => getLedgerDueDate(row));
  if (!firstRow) return null;
  const dueDateValue = String(getLedgerDueDate(firstRow) || '').slice(0, 10);
  const dueDate = parseDateOnly(dueDateValue);
  const days = Number(getLedgerField(firstRow, ['days', 'period_days', 'periodDays'], 0));
  if (!dueDate || !days) return null;
  dueDate.setDate(dueDate.getDate() - days + 1);
  return `${dueDate.getFullYear()}-${String(dueDate.getMonth() + 1).padStart(2, '0')}-${String(dueDate.getDate()).padStart(2, '0')}`;
}

function resolveLoanScheduleValues(loan = {}, ledgerRows = [], ledgerSummary = null) {
  const source = getAuthoritativeLoanSource(loan);
  const termDisplay = getLoanField(source, ['term_display', 'termDisplay'], null)
    || (() => {
      const termType = String(getLoanField(source, ['term_type', 'termType'], '') || '').toUpperCase();
      const termValue = getLoanField(source, ['term_value', 'termValue'], null);
      if (termType === 'DAYS' && loanHasValue(termValue)) return `${termValue} days`;
      if (termType === 'MONTHS' && loanHasValue(termValue)) return `${termValue} months`;
      return null;
    })()
    || (loanHasValue(getLoanField(source, ['loan_days', 'loanDays'], null)) ? `${getLoanField(source, ['loan_days', 'loanDays'], null)} days` : null)
    || (loanHasValue(getLedgerSummaryField(ledgerSummary, ['total_days', 'totalDays'], null)) ? `${getLedgerSummaryField(ledgerSummary, ['total_days', 'totalDays'], null)} days` : null)
    || 'Missing';

  const frequencyCode = String(
    getLoanField(source, ['repayment_frequency', 'repaymentFrequency'], null)
    || getLedgerSummaryField(ledgerSummary, ['repayment_frequency', 'repaymentFrequency'], null)
    || deriveFrequencyFromLedgerRows(ledgerRows)
    || ''
  ).toUpperCase();
  const frequencyLabels = { DAILY: 'Daily', WEEKLY: 'Weekly', MONTHLY: 'Monthly' };
  const frequencyDisplay = frequencyLabels[frequencyCode] || (frequencyCode ? titleCase(frequencyCode) : 'Missing');

  const firstNonNullPeriodStartDate = ledgerRows.map(getLedgerPeriodStartDate).find(loanHasValue) || null;
  const startDate = getLoanField(source, ['start_date', 'startDate'], null)
    || getLedgerSummaryField(ledgerSummary, ['start_date', 'startDate'], null)
    || firstNonNullPeriodStartDate
    || deriveFirstPeriodStartDate(ledgerRows)
    || null;
  const lastLedgerDueDate = [...ledgerRows].reverse().map(getLedgerDueDate).find(loanHasValue) || null;
  const maturityDate = getLoanField(source, ['maturity_date', 'maturityDate'], null)
    || getLoanField(source, ['final_installment_due_date', 'finalInstallmentDueDate'], null)
    || getLoanField(source, ['end_date', 'endDate'], null)
    || getLedgerSummaryField(ledgerSummary, ['maturity_date', 'maturityDate'], null)
    || lastLedgerDueDate
    || null;
  const installmentCountDisplay = getAdminInstallmentCountDisplay(loan, ledgerRows, ledgerSummary);

  return { termDisplay, frequencyCode, frequencyDisplay, installmentCountDisplay, startDate, maturityDate };
}

function formatAdminTermDisplay(loan = {}, ledgerRows = [], ledgerSummary = null) {
  return resolveLoanScheduleValues(loan, ledgerRows, ledgerSummary).termDisplay;
}

function getAdminTermTypeAndValue(loan = {}, ledgerRows = [], ledgerSummary = null) {
  const source = getAuthoritativeLoanSource(loan);
  const termType = String(getLoanField(source, ['term_type', 'termType'], '') || '').toUpperCase();
  const termValue = getLoanField(source, ['term_value', 'termValue'], null);
  if ((termType === 'DAYS' || termType === 'MONTHS') && loanHasValue(termValue)) return { type: termType, value: Number(termValue) || 0 };
  const loanDays = getLoanField(source, ['loan_days', 'loanDays'], null);
  if (loanHasValue(loanDays)) return { type: 'DAYS', value: Number(loanDays) || 0 };
  const totalDays = getLedgerSummaryField(ledgerSummary, ['total_days', 'totalDays'], null);
  if (loanHasValue(totalDays)) return { type: 'DAYS', value: Number(totalDays) || 0 };
  return { type: termType, value: 0 };
}

function formatAdminFrequency(loan = {}, ledgerRows = [], ledgerSummary = null) {
  return resolveLoanScheduleValues(loan, ledgerRows, ledgerSummary).frequencyDisplay;
}

function getAdminFrequencyCode(loan = {}, ledgerRows = [], ledgerSummary = null) {
  return resolveLoanScheduleValues(loan, ledgerRows, ledgerSummary).frequencyCode;
}

function getAdminInstallmentCountDisplay(loan = {}, ledgerRows = [], ledgerSummary = null) {
  const source = getAuthoritativeLoanSource(loan);
  const count = getLoanField(source, ['installment_count', 'installmentCount'], null)
    ?? getLoanField(source, ['number_of_installments', 'numberOfInstallments'], null)
    ?? getLoanField(ledgerSummary || {}, ['installment_count', 'installmentCount'], null);
  if (loanHasValue(count)) return String(count);
  if (ledgerRows.length === 1) return '1 — verify schedule';
  if (ledgerRows.length) return String(ledgerRows.length);
  return 'Missing';
}

function getAdminInstallmentCountNumber(loan = {}, ledgerRows = [], ledgerSummary = null) {
  const display = getAdminInstallmentCountDisplay(loan, ledgerRows, ledgerSummary);
  const parsed = Number(String(display).match(/^\d+(?:\.\d+)?/)?.[0] || 0);
  return Number.isFinite(parsed) ? parsed : 0;
}

function buildLoanDataWarnings(loan = {}, ledgerRows = [], ledgerSummary = null) {
  const resolved = resolveLoanScheduleValues(loan, ledgerRows, ledgerSummary);
  const missing = [];
  if (resolved.termDisplay === 'Missing') missing.push('Term');
  if (resolved.frequencyDisplay === 'Missing') missing.push('Repayment frequency');
  if (resolved.installmentCountDisplay === 'Missing') missing.push('Installment count');
  if (!loanHasValue(resolved.startDate)) missing.push('Start date');
  if (!loanHasValue(resolved.maturityDate)) missing.push('Maturity date');
  if (!missing.length) return '';
  return `<div class="alert warning"><strong>Loan configuration incomplete</strong><p>Missing:</p><ul>${missing.map((item) => `<li>${escapeHtml(item)}</li>`).join('')}</ul><p>This loan may have been disbursed before the term data was correctly saved.</p></div>`;
}

function buildScheduleValidationWarning(loan = {}, ledgerRows = [], ledgerSummary = null) {
  const term = getAdminTermTypeAndValue(loan, ledgerRows, ledgerSummary);
  const frequency = getAdminFrequencyCode(loan, ledgerRows, ledgerSummary);
  if (term.type !== 'DAYS' || frequency !== 'WEEKLY' || !term.value) return '';
  const expectedInstallments = Math.ceil(term.value / 7);
  const found = getAdminInstallmentCountNumber(loan, ledgerRows, ledgerSummary) || ledgerRows.length;
  if (found && expectedInstallments !== found) {
    return `<div class="alert warning">Schedule mismatch: expected ${expectedInstallments} installments but found ${found}.</div>`;
  }
  return '';
}

function buildFinancialValidationWarning(loan = {}) {
  const source = getAuthoritativeLoanSource(loan);
  const basis = String(getLoanField(source, ['interest_rate_basis', 'interestRateBasis'], '') || '').toUpperCase();
  if (basis !== 'FLAT_TERM') return '';
  const principal = Number(getLoanField(source, ['principal_amount', 'principalAmount', 'principal', 'amount', 'approved_amount', 'approvedAmount'], 0)) || 0;
  const interestRate = Number(getLoanField(source, ['interest_rate', 'interestRate'], 0)) || 0;
  const apiInterest = Number(getLoanField(source, ['total_interest', 'totalInterest'], NaN));
  const apiTotal = Number(getLoanField(source, ['total_payable', 'totalPayable', 'payable_amount', 'payableAmount', 'total_amount', 'totalAmount'], NaN));
  if (!principal || !interestRate) return '';
  const expectedInterest = principal * interestRate / 100;
  const expectedTotal = principal + expectedInterest;
  const tolerance = 0.01;
  if ((Number.isFinite(apiInterest) && Math.abs(apiInterest - expectedInterest) > tolerance) || (Number.isFinite(apiTotal) && Math.abs(apiTotal - expectedTotal) > tolerance)) {
    return '<div class="alert warning">Financial mismatch detected.</div>';
  }
  return '';
}

function renderLoanRepairAction(loan = {}) {
  return getLoanField(loan, ['repair_allowed', 'repairAllowed'], false) === true
    ? '<button type="button" class="secondary" data-admin-repair-schedule>Repair Schedule</button>'
    : '';
}

function calculateLedgerDisplayTotals(entries, backendTotals) {
  if (backendTotals) {
    return {
      totalPrincipal: getLoanField(backendTotals, ['total_principal', 'totalPrincipal', 'principal'], 0),
      totalInterest: getLoanField(backendTotals, ['total_interest', 'totalInterest', 'interest'], 0),
      totalPayable: getLoanField(backendTotals, ['total_payable', 'totalPayable', 'payable'], 0),
      totalPaid: getLoanField(backendTotals, ['total_paid', 'totalPaid', 'paid'], 0),
      outstanding: Math.max(0, Number(getLoanField(backendTotals, ['outstanding', 'outstanding_amount', 'outstandingAmount', 'balance'], 0)) || 0),
      totalDelayInterest: getLoanField(backendTotals, ['total_delay_interest', 'totalDelayInterest', 'delay_interest', 'delayInterest'], 0),
    };
  }

  const loan = adminLoansState.selectedLoan || {};
  return {
    totalPrincipal: getLoanField(loan, ['total_principal', 'totalPrincipal', 'principal_amount', 'principalAmount', 'principal'], 0),
    totalInterest: getLoanField(loan, ['total_interest', 'totalInterest', 'interest'], 0),
    totalPayable: getLoanField(loan, ['total_payable', 'totalPayable', 'payable_amount', 'payableAmount', 'total_amount', 'totalAmount'], 0),
    totalPaid: getLoanField(loan, ['total_paid', 'totalPaid', 'paid_amount', 'paidAmount', 'amount_paid', 'amountPaid'], 0),
    outstanding: displayLoanOutstanding(loan),
    totalDelayInterest: getLoanField(loan, ['total_delay_interest', 'totalDelayInterest', 'delay_interest', 'delayInterest'], 0),
  };
}


function renderAccountingSummarySection(loan = {}) {
  const a = loan.accounting_summary || loan.accountingSummary || loan.accounting || adminLoansState.ledgerTotals?.accounting_summary || {};
  const method = accountingField(a, ['interest_accounting_method','interestAccountingMethod'], accountingField(loan, ['interest_accounting_method','interestAccountingMethod'], 'ACCRUAL_BY_INSTALLMENT'));
  const fields = [
    ['Interest accounting method', refLabel(method)],
    ['Principal receivable', formatCurrency(accountingField(a, ['principal_receivable','principalReceivable'], accountingField(loan, ['principal_receivable'], 0)))],
    ['Interest accrued', formatCurrency(accountingField(a, ['interest_accrued','interestAccrued'], 0))],
    ['Interest collected', formatCurrency(accountingField(a, ['interest_collected','interestCollected'], 0))],
    ['Interest receivable', formatCurrency(accountingField(a, ['interest_receivable','interestReceivable'], 0))],
    ['Future unearned interest', formatCurrency(accountingField(a, ['future_unearned_interest','futureUnearnedInterest'], 0))],
    ['Delay interest accrued', formatCurrency(accountingField(a, ['delay_interest_accrued','delayInterestAccrued'], 0))],
    ['Delay interest collected', formatCurrency(accountingField(a, ['delay_interest_collected','delayInterestCollected'], 0))],
    ['Delay interest receivable', formatCurrency(accountingField(a, ['delay_interest_receivable','delayInterestReceivable'], 0))],
    ['Accrual processed through', formatDateOnlyDisplay(accountingField(a, ['accrual_processed_through','accrualProcessedThrough'], '—'))],
    ['Disbursement journal status', accountingField(a, ['disbursement_journal_status','disbursementJournalStatus'], accountingField(loan, ['disbursement_journal_status'], '—'))],
  ];
  const flags = loan.accounting_actions || loan.accountingActions || loan.permissions || {};
  const show = (key, fallback = true) => flags[key] === undefined ? fallback : boolFromBackend(flags[key], fallback);
  const settled = getLoanStatus(loan) === 'SETTLED';
  const eligibleForEarlySettlement = ['ACTIVE', 'OVERDUE'].includes(getLoanStatus(loan));
  const actions = [
    eligibleForEarlySettlement ? '<button type="button" class="secondary" data-early-settlement>Early Settlement</button>' : '',
    !settled && show('can_accrue_interest') ? '<button type="button" class="secondary" data-loan-accrue-interest>Accrue Interest</button>' : '',
    show('can_view_disbursement_journal') ? '<button type="button" class="secondary" data-view-disbursement-journal>View Disbursement Journal</button>' : '',
    show('can_view_interest_journals') ? '<button type="button" class="secondary" data-view-interest-journals>View Interest Journals</button>' : '',
    show('can_reverse_disbursement', false) ? '<button type="button" class="danger" data-reverse-disbursement>Reverse Disbursement</button>' : '',
    show('can_reconcile_loan') ? '<button type="button" class="secondary" data-reconcile-loan>Reconcile Loan</button>' : '',
  ].filter(Boolean).join(' ');
  return `<div class="subcard"><div class="card-header"><div><div class="eyebrow">Accounting</div><h3>Accounting Summary</h3></div></div><div class="loan-detail-grid accounting-summary-cards">${fields.map(([label,value])=>`<div class="loan-detail-stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`).join('')}</div><div class="action-row">${actions}</div></div>`;
}

// Early settlement deliberately remains separate from reconciliation: this flow asks the
// server to calculate and approve a concession; reconciliation only corrects past settlement.
let earlySettlementInProgress = false;

function earlySettlementValue(data = {}, keys = [], fallback = 0) {
  return toMoneyNumber(reconciliationValue(data, keys, fallback));
}

function earlySettlementErrorMessage(error) {
  const message = String(error?.message || '');
  const normalized = message.toLowerCase();
  if (error?.status === 401 || error?.status === 403) return 'You do not have permission to approve an early settlement.';
  if (normalized.includes('rebate account') || normalized.includes('concession account') || normalized.includes('interest_rebate_account')) return 'Configure the Interest Rebate / Loan Concession account before posting.';
  if (error?.status >= 500) return 'Early settlement could not be completed. No changes were posted.';
  return message || 'Early settlement could not be completed. No changes were posted.';
}

function earlySettlementPreviewChanged(error) {
  return error?.status === 409 || ['stale_preview', 'preview stale', 'preview_changed', 'balance changed'].some((text) => String(error?.message || '').toLowerCase().includes(text));
}

function renderEarlySettlementPreview(preview = {}) {
  const fields = [
    ['Principal Outstanding', earlySettlementValue(preview, ['principal_outstanding', 'principalOutstanding'])],
    ['Accrued Interest Outstanding', earlySettlementValue(preview, ['accrued_interest_outstanding', 'accruedInterestOutstanding', 'interest_outstanding', 'interestOutstanding'])],
    ['Future Unearned Interest', earlySettlementValue(preview, ['future_unearned_interest', 'futureUnearnedInterest'])],
    ['Penalty Outstanding', earlySettlementValue(preview, ['penalty_outstanding', 'penaltyOutstanding', 'penalties'])],
    ['Delay Interest Outstanding', earlySettlementValue(preview, ['delay_interest_outstanding', 'delayInterestOutstanding', 'delay_interest_balance', 'delayInterestBalance'])],
    ['Fee Outstanding', earlySettlementValue(preview, ['fee_outstanding', 'feeOutstanding', 'fees'])],
    ['Maximum Eligible Interest Rebate', earlySettlementValue(preview, ['maximum_interest_rebate', 'maximumInterestRebate'])],
    ['Approved/Requested Interest Rebate', earlySettlementValue(preview, ['approved_interest_rebate', 'requested_interest_rebate', 'interest_rebate', 'interestRebate'])],
    ['Final Settlement Amount', earlySettlementValue(preview, ['final_settlement_amount', 'finalSettlementAmount', 'settlement_amount'])],
    ['Customer Credit', earlySettlementValue(preview, ['customer_credit', 'customerCredit'])],
    ['Proposed Status', String(reconciliationValue(preview, ['proposed_status', 'new_status', 'status'], '—')).toUpperCase()],
  ];
  const journals = preview.journal_preview || preview.journalPreview || preview.accounting_preview || preview.accountingPreview || preview.journals || [];
  const journalItems = Array.isArray(journals) ? journals : (journals.entries || journals.lines || [journals]);
  const futureCancelled = earlySettlementValue(preview, ['future_unearned_interest_cancelled', 'futureUnearnedInterestCancelled', 'cancelled_future_unearned_interest']);
  return `<div class="loan-detail-grid">${fields.map(([label, value]) => `<div class="loan-detail-stat"><span>${escapeHtml(label)}</span><strong>${typeof value === 'number' ? formatCurrency(value) : escapeHtml(value)}</strong></div>`).join('')}</div>
    <div class="subcard"><h3>Accounting Preview</h3>${journalItems.filter((item) => item && typeof item === 'object').length ? journalItems.filter((item) => item && typeof item === 'object').map((item) => {
      const debit = item.debit_account_name || item.debit_account || item.dr_account || item.debit || '—';
      const credit = item.credit_account_name || item.credit_account || item.cr_account || item.credit || '—';
      const amount = earlySettlementValue(item, ['amount', 'debit_amount', 'credit_amount']);
      return `<p><strong>Dr ${escapeHtml(String(debit))}</strong><br>Cr ${escapeHtml(String(credit))}<br>${formatCurrency(amount)}</p>`;
    }).join('') : '<p class="muted">No accounting expense journal is required for unrecognized future interest.</p>'}
    <p>Future unearned interest cancelled: <strong>${formatCurrency(futureCancelled)}</strong></p></div>`;
}

async function refreshEarlySettledLoan(loanId, result = {}) {
  await Promise.allSettled([loadAdminLoans(true), loadAdmin(), loadAdminLoanLedger(true)]);
  const refreshedLoan = adminLoansState.loans.find((item) => String(getLoanId(item)) === String(loanId));
  adminLoansState.selectedLoan = refreshedLoan || { ...adminLoansState.selectedLoan, ...result, id: loanId, status: 'SETTLED' };
  adminLoansState.ledgerLoadedLoanId = null;
  renderAdminLoanDetail();
}

async function openEarlySettlementDialog(button) {
  if (earlySettlementInProgress) return;
  const loan = adminLoansState.selectedLoan || {};
  const loanId = getLoanId(loan);
  if (!loanId || !['ACTIVE', 'OVERDUE'].includes(getLoanStatus(loan))) return;
  earlySettlementInProgress = true;
  button.disabled = true;
  let controller = null, timer = null, latestPreview = null, modal;
  const close = () => { if (timer) clearTimeout(timer); controller?.abort(); earlySettlementInProgress = false; button.disabled = false; modal?.remove(); };
  modal = document.createElement('div');
  modal.className = 'modal-overlay historical-accounting-modal';
  modal.innerHTML = `<div class="modal-card wide"><div class="modal-header"><h2>Early Settlement</h2><button class="icon-button" data-close>×</button></div><div class="early-settlement-message"></div><div class="accounting-grid">
    <label>Settlement Date<input name="settlement_date" type="date" value="${todayDateOnly()}" required></label>
    <label>Requested Interest Rebate<input name="interest_rebate" type="number" min="0" step="0.01" value="0" required></label>
    <label>Penalty Waiver<input name="penalty_waiver" type="number" min="0" step="0.01" value="0" required></label>
    <label>Approval Reference<input name="approval_reference" type="text"></label>
    <label>Reason<textarea name="reason"></textarea></label>
  </div><div class="early-settlement-preview"><p class="muted">Loading settlement preview...</p></div><div class="modal-actions sticky-modal-footer"><button type="button" class="secondary" data-close>Cancel</button><button type="button" data-early-settlement-confirm disabled>Approve &amp; Settle Loan</button></div></div>`;
  document.body.appendChild(modal);
  modal.querySelectorAll('[data-close]').forEach((element) => { element.onclick = close; });
  const dateInput = modal.querySelector('[name=settlement_date]'), rebateInput = modal.querySelector('[name=interest_rebate]'), waiverInput = modal.querySelector('[name=penalty_waiver]');
  const message = modal.querySelector('.early-settlement-message'), previewBox = modal.querySelector('.early-settlement-preview'), confirmButton = modal.querySelector('[data-early-settlement-confirm]');
  const payload = () => ({ settlement_date: dateInput.value, interest_rebate: toMoneyNumber(rebateInput.value), penalty_waiver: toMoneyNumber(waiverInput.value) });
  const render = (preview) => {
    latestPreview = preview;
    const maximum = earlySettlementValue(preview, ['maximum_interest_rebate', 'maximumInterestRebate']);
    const requested = payload().interest_rebate;
    const finalAmount = earlySettlementValue(preview, ['final_settlement_amount', 'finalSettlementAmount', 'settlement_amount']);
    const invalid = requested < 0 || requested > maximum + 0.01;
    rebateInput.max = String(maximum);
    message.innerHTML = invalid ? '<div class="alert error">The interest rebate cannot exceed eligible unpaid interest.</div>' : (finalAmount <= 0.01 ? '<div class="alert success">No additional payment is required.</div>' : `<div class="alert warning">${formatCurrency(finalAmount)} must be collected before settlement.</div>`);
    previewBox.innerHTML = renderEarlySettlementPreview(preview);
    confirmButton.textContent = finalAmount <= 0.01 ? 'Approve & Settle Loan' : 'Proceed to Final Payment';
    confirmButton.disabled = invalid || String(reconciliationValue(preview, ['proposed_status', 'new_status'], '')).toUpperCase() !== 'SETTLED';
  };
  const loadPreview = async () => {
    controller?.abort(); controller = new AbortController();
    confirmButton.disabled = true; message.innerHTML = '';
    try { const preview = await api(`/admin/loans/${encodeURIComponent(loanId)}/early-settlement/preview`, { method: 'POST', body: payload(), signal: controller.signal }); if (!controller.signal.aborted) render(preview); }
    catch (error) { if (error.name !== 'AbortError') message.innerHTML = `<div class="alert error">${escapeHtml(earlySettlementErrorMessage(error))}</div>`; }
  };
  const debouncePreview = () => { if (timer) clearTimeout(timer); timer = setTimeout(loadPreview, 300); };
  [dateInput, rebateInput, waiverInput].forEach((input) => input.addEventListener('input', debouncePreview));
  confirmButton.onclick = async () => {
    if (confirmButton.disabled || !latestPreview) return;
    const finalAmount = earlySettlementValue(latestPreview, ['final_settlement_amount', 'finalSettlementAmount', 'settlement_amount']);
    const requestPayload = { ...payload(), approval_reference: approvalInput.value.trim(), reason: reasonInput.value.trim() };
    const confirmation = `<div class="modal-header"><h2>Early Settlement Confirmation</h2><button class="icon-button" data-cancel-confirm>×</button></div><div class="loan-detail-grid">${[
      ['Original total payable', earlySettlementValue(latestPreview, ['original_total_payable', 'total_payable'], getLoanField(loan, ['total_payable', 'totalPayable'], 0))],
      ['Total already paid', earlySettlementValue(latestPreview, ['total_paid', 'total_already_paid'], getLoanField(loan, ['total_paid', 'totalPaid'], 0))],
      ['Interest rebate', requestPayload.interest_rebate], ['Final payment required', finalAmount], ['Status after posting', 'SETTLED']
    ].map(([label, value]) => `<div class="loan-detail-stat"><span>${escapeHtml(label)}</span><strong>${typeof value === 'number' ? formatCurrency(value) : escapeHtml(value)}</strong></div>`).join('')}</div><div class="modal-actions sticky-modal-footer"><button class="secondary" data-cancel-confirm>Back</button><button data-post-early-settlement>Confirm Early Settlement</button></div>`;
    modal.querySelector('.modal-card').innerHTML = confirmation;
    modal.querySelectorAll('[data-cancel-confirm]').forEach((element) => { element.onclick = close; });
    modal.querySelector('[data-post-early-settlement]').onclick = async (event) => {
      const postButton = event.currentTarget; postButton.disabled = true;
      try {
        const result = await api(`/admin/loans/${encodeURIComponent(loanId)}/early-settlement`, { method: 'POST', body: { confirm: true, ...requestPayload } });
        const settlementDate = result.settlement_date || result.settled_date || dateInput.value;
        modal.querySelector('.modal-card').innerHTML = `<div class="modal-header"><h2>Loan Settled Early</h2><button class="icon-button" data-close-success>×</button></div><div class="loan-detail-grid">${[['Settlement Type', 'EARLY_SETTLEMENT'], ['Interest Rebate', requestPayload.interest_rebate], ['Final Payment', earlySettlementValue(result, ['final_settlement_amount', 'final_payment'], finalAmount)], ['Customer Credit', earlySettlementValue(result, ['customer_credit'], 0)], ['Settlement Date', formatDate(settlementDate) || settlementDate], ['Status', 'SETTLED']].map(([label, value]) => `<div class="loan-detail-stat"><span>${label}</span><strong>${typeof value === 'number' ? formatCurrency(value) : escapeHtml(String(value))}</strong></div>`).join('')}</div><div class="modal-actions sticky-modal-footer"><button data-close-success>Close</button></div>`;
        modal.querySelector('[data-close-success]').onclick = close; await refreshEarlySettledLoan(loanId, result);
      } catch (error) {
        if (earlySettlementPreviewChanged(error)) { close(); openEarlySettlementDialog(button); setInlineAlert(adminLoanDetailMessage, 'Loan balances changed. Review the updated preview and confirm again.', 'warning'); return; }
        postButton.disabled = false; modal.querySelector('.modal-card').insertAdjacentHTML('afterbegin', `<div class="alert error">${escapeHtml(earlySettlementErrorMessage(error))}</div>`);
      }
    };
  };
  const approvalInput = modal.querySelector('[name=approval_reference]'), reasonInput = modal.querySelector('[name=reason]');
  await loadPreview();
}

function renderLoanReconciliationSection(data = {}) {
  const rows = [
    ['Principal reconciliation', data.principal || data.principal_reconciliation || {}, ['loan_ledger','general_ledger','difference']],
    ['Interest reconciliation', data.interest || data.interest_reconciliation || {}, ['accrued_less_paid','general_ledger_interest_receivable','difference']],
    ['Delay interest reconciliation', data.delay_interest || data.delayInterest || data.delay_interest_reconciliation || {}, ['accrued_less_paid','general_ledger_balance','difference']],
  ];
  return `<div class="subcard"><h3>Reconciliation</h3><div class="accounting-grid">${rows.map(([title,obj,keys])=>{ const diff=Number(obj.difference||0); const status=obj.status || (Math.abs(diff)<0.01?'Balanced':'Mismatch'); return `<div class="loan-detail-stat"><span>${escapeHtml(title)}</span><strong>${escapeHtml(status)}</strong>${keys.map(k=>`<p>${escapeHtml(k.replaceAll('_',' '))}: ${formatCurrency(obj[k]||0)}</p>`).join('')}</div>`; }).join('')}</div></div>`;
}


let loanReconciliationInProgress = false;
let loanReconciliationState = null;

function normalizeLoanReconciliationPreview(payload) {
  const preview = payload?.preview ?? payload?.data?.preview ?? payload?.data ?? payload;
  if (!preview || typeof preview !== 'object' || Array.isArray(preview)) {
    throw new Error('Reconciliation preview data is missing.');
  }
  return preview;
}

function reconciliationModalRoot() {
  let root = document.getElementById('reconciliation-modal-root');
  if (!root) {
    root = document.createElement('div');
    root.id = 'reconciliation-modal-root';
    document.body.appendChild(root);
  }
  return root;
}

function loanReconciliationErrorMessage(error) {
  const message = String(error?.message || '');
  const normalized = message.toLowerCase();
  if (normalized.includes('loan_not_found')) return 'The selected loan no longer exists.';
  if (normalized.includes('confirmation_required')) return 'Confirm the reconciliation before posting.';
  if (normalized.includes('account') && (normalized.includes('missing') || normalized.includes('configur'))) return 'Required accounting accounts are not configured. Configure them before posting reconciliation.';
  if (normalized.includes('historical excess') || normalized.includes('historical_excess') || normalized.includes('excess_account') || normalized.includes('accounting source')) return 'The excess payment was found, but its accounting source could not be confirmed. Open Accounting Reconciliation for review.';
  if (normalized.includes('not_found') || normalized.includes('the requested url was not found') || normalized.includes('status 404')) return 'The loan reconciliation API endpoint is unavailable. Deploy the matching API route and try again.';
  return message || 'Loan reconciliation failed. Please try again.';
}

function reconciliationPreviewChanged(error) {
  const message = String(error?.message || '').toLowerCase();
  return ['preview_changed', 'preview changed', 'stale_preview', 'stale preview', 'reconciliation_changed', 'reconciliation changed', 'balance changed'].some((value) => message.includes(value));
}

function reconciliationWarnings(data = {}) {
  const warnings = data.warnings || data.warning || [];
  return (Array.isArray(warnings) ? warnings : [warnings]).filter(Boolean).map((warning) => (
    typeof warning === 'string' ? warning : warning.message || warning.description || warning.code || ''
  )).filter(Boolean);
}

function reconciliationValue(data, keys, fallback = '—') {
  for (const key of keys) {
    if (data?.[key] !== undefined && data[key] !== null && data[key] !== '') return data[key];
  }
  return fallback;
}

function toMoneyNumber(value) {
  if (value === null || value === undefined || value === '') return 0;
  const normalized = typeof value === 'string' ? value.replace(/Rs\.?/gi, '').replace(/,/g, '').trim() : value;
  const number = Number(normalized);
  return Number.isFinite(number) ? number : 0;
}

function reconciliationMoney(data, keys, fallback = 0) {
  return toMoneyNumber(reconciliationValue(data, keys, fallback));
}

function reconciliationAccountingReady(preview = {}) {
  const configured = reconciliationValue(preview, ['accounting_accounts_configured', 'accountingConfigured', 'required_accounts_configured', 'requiredAccountsConfigured'], true);
  const missing = reconciliationValue(preview, ['missing_accounting_accounts', 'missingAccountingAccounts', 'missing_accounts', 'missingAccounts'], []);
  return configured !== false && !(Array.isArray(missing) && missing.length);
}

function reconciliationAmounts(preview = {}) {
  const principal = reconciliationMoney(preview, ['principal', 'principal_amount', 'principalAmount', 'principal_due', 'principalDue'], 0);
  const normalInterest = reconciliationMoney(preview, ['normal_interest', 'normalInterest', 'normal_interest_due', 'normalInterestDue', 'interest', 'interest_amount', 'interestAmount'], 0);
  const cashReceived = reconciliationMoney(preview, ['cash_received', 'cashReceived', 'total_cash_received', 'totalCashReceived', 'actual_cash_received', 'actualCashReceived', 'customer_cash_received', 'customerCashReceived', 'total_paid'], 0);
  const principalCollected = reconciliationMoney(preview, ['principal_collected', 'principalCollected', 'collected_principal', 'principal_paid', 'principalPaid'], 0);
  const normalInterestCollected = reconciliationMoney(preview, ['normal_interest_collected', 'normalInterestCollected', 'interest_collected', 'interestCollected', 'normal_interest_paid', 'normalInterestPaid'], 0);
  const delayAccrued = reconciliationMoney(preview, ['delay_interest_accrued', 'delayInterestAccrued', 'accrued_delay_interest'], 0);
  const delayCollected = reconciliationMoney(preview, ['delay_interest_collected', 'delayInterestCollected', 'collected_delay_interest'], 0);
  const delayOutstanding = reconciliationMoney(preview, ['delay_interest_outstanding', 'delayInterestOutstanding', 'delay_interest_balance', 'delayInterestBalance'], Math.max(0, delayAccrued - delayCollected));
  const customerCredit = reconciliationMoney(preview, ['customer_credit', 'customerCredit', 'proposed_customer_credit', 'proposedCustomerCredit'], 0);
  const reclassification = reconciliationMoney(preview, ['customer_credit_reclassification_amount', 'customerCreditReclassificationAmount', 'delay_interest_reclassification_amount', 'delayInterestReclassificationAmount', 'reclassification_amount', 'customer_credit_to_reclassify', 'customerCreditToReclassify', 'existing_customer_credit', 'customer_credit_reclassification', 'customerCreditReclassification', 'reclassification_customer_credit'], 0);
  const remainingBalance = reconciliationMoney(preview, ['remaining_balance', 'remainingBalance', 'outstanding'], delayOutstanding);
  return { principal, normalInterest, cashReceived, principalCollected, normalInterestCollected, delayAccrued, delayCollected, delayOutstanding, customerCredit, reclassification, remainingBalance };
}

function settlementPreviewState(preview = {}, waiverAmount = 0) {
  const amounts = reconciliationAmounts(preview);
  const settlementTolerance = 0.01;
  const waiver = Math.min(Math.max(0, toMoneyNumber(waiverAmount)), amounts.delayOutstanding);
  const remainingBalance = Math.max(0, amounts.remainingBalance - waiver);
  const proposedStatus = remainingBalance <= settlementTolerance ? 'SETTLED' : String(preview.proposed_status ?? preview.new_status ?? '').trim().toUpperCase();
  return { ...amounts, waiver, remainingBalance, settlementTolerance, hasRemainingBalance: remainingBalance > settlementTolerance, proposedStatus, canSettle: proposedStatus === 'SETTLED' && remainingBalance <= settlementTolerance };
}

function renderLoanReconciliationValues(data = {}, loan = {}, waiverAmount = 0) {
  const amounts = settlementPreviewState(data, waiverAmount);
  const fields = [
    ['Principal', amounts.principal], ['Normal Interest', amounts.normalInterest], ['Cash Received', amounts.cashReceived],
    ['Principal Collected', amounts.principalCollected], ['Normal Interest Collected', amounts.normalInterestCollected],
    ['Delay Interest Accrued', amounts.delayAccrued], ['Delay Interest Collected', amounts.delayCollected],
    ['Delay Interest Outstanding', amounts.delayOutstanding], ['Customer Credit', amounts.customerCredit], ['Remaining Balance', amounts.remainingBalance],
  ];
  const reclassificationNotice = amounts.reclassification > amounts.settlementTolerance
    ? `<div class="alert warning">${formatCurrency(amounts.reclassification)} is currently recorded as Customer Credit. It will be reclassified to Delay Interest Receivable. No cash or bank account will be posted again.</div>` : '';
  const warnings = reconciliationWarnings(data);
  return `<div class="loan-detail-grid">${fields.map(([label, value]) => `<div class="loan-detail-stat"><span>${escapeHtml(label)}</span><strong>${formatCurrency(value)}</strong></div>`).join('')}</div>${reclassificationNotice}${warnings.length ? `<div class="alert warning"><strong>Warnings</strong><ul>${warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join('')}</ul></div>` : ''}`;
}

function renderLoanReconciliationSuccess(data = {}, loan = {}) {
  const amounts = reconciliationAmounts(data);
  const waived = reconciliationMoney(data, ['delay_interest_waived', 'delayInterestWaived', 'delay_interest_waiver_amount', 'delayInterestWaiverAmount'], 0);
  const fields = [
    ['Cash received', amounts.cashReceived], ['Delay interest collected', amounts.delayCollected], ['Delay interest waived', waived],
    ['Customer credit', reconciliationMoney(data, ['customer_credit', 'customerCredit'], 0)], ['Outstanding', reconciliationMoney(data, ['outstanding', 'remaining_balance', 'remainingBalance'], 0)],
    ['Status', String(reconciliationValue(data, ['new_status', 'loan_status', 'proposed_status'], 'SETTLED')).trim().toUpperCase()],
  ];
  return `<div class="loan-detail-grid">${fields.map(([label, value]) => `<div class="loan-detail-stat"><span>${escapeHtml(label)}</span><strong>${typeof value === 'number' ? formatCurrency(value) : escapeHtml(String(value))}</strong></div>`).join('')}</div>`;
}

async function refreshReconciledLoan(loanId, reconciliation = {}) {
  await Promise.allSettled([loadAdminLoans(true), loadAdmin(), loadAdminLoanLedger(true), loadFinancialReports(), accountingLoadJournals()]);
  const refreshedLoan = adminLoansState.loans.find((item) => Number(item.id ?? item.loan_id) === loanId);
  adminLoansState.selectedLoan = refreshedLoan || { ...adminLoansState.selectedLoan, ...reconciliation, id: loanId };
  adminLoansState.ledgerLoadedLoanId = null;
  renderAdminLoanDetail();
}

async function openLoanReconciliationPreview(button) {
  if (loanReconciliationInProgress) return;
  const loan = adminLoansState.selectedLoan || {};
  const loanId = Number(getLoanId(loan));
  if (!Number.isInteger(loanId) || loanId <= 0) {
    setInlineAlert(adminLoanDetailMessage, 'A valid loan ID is required for reconciliation.', 'error');
    return;
  }

  loanReconciliationInProgress = true;
  button.disabled = true;
  const buttonLabel = button.textContent;
  button.textContent = 'Loading reconciliation…';
  const previewPath = `/admin/loans/${loanId}/settlement-reconciliation/preview`;
  const postPath = `/admin/loans/${loanId}/settlement-reconciliation`;
  let modal;
  const close = () => {
    if (modal?.isConnected) modal.remove();
    loanReconciliationState = null;
    loanReconciliationInProgress = false;
    button.disabled = false;
    button.textContent = buttonLabel;
    if (button.isConnected) button.focus();
    restoreBodyScrollingIfNoOverlay();
  };
  const trapFocus = (event) => {
    if (event.key === 'Escape') {
      event.preventDefault();
      event.stopPropagation();
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  const renderPreview = (preview) => {
    let posting = false;
    const initial = settlementPreviewState(preview);
    const accountingReady = reconciliationAccountingReady(preview);
    modal.querySelector('.modal-card').innerHTML = `<div class="modal-header"><h2 id="loan-reconciliation-title">Reconcile Loan</h2><button class="icon-button" data-close aria-label="Close reconciliation">×</button></div><p>Review the settlement reconciliation before posting.</p><div class="reconciliation-values"></div><div class="subcard"><label><input type="checkbox" name="waive_delay_interest"> Waive Remaining Delay Interest</label><div class="delay-interest-waiver-fields hidden"><div class="accounting-grid"><label>Delay Interest Waiver Amount<input name="delay_interest_waiver_amount" type="number" min="0" max="${initial.delayOutstanding.toFixed(2)}" step="0.01" value="${initial.delayOutstanding.toFixed(2)}"></label><label>Approval Reference<input name="approval_reference"></label><label>Reason<textarea name="reason"></textarea></label></div></div></div><div class="subcard reconciliation-posting-preview"></div><div id="loan-reconciliation-message" aria-live="polite"></div><div class="modal-actions sticky-modal-footer"><button type="button" class="secondary" data-close>Cancel</button><button type="button" id="confirm-loan-reconciliation" disabled>Confirm Reclassification, Waiver &amp; Settlement</button></div>`;
    modal.querySelectorAll('[data-close]').forEach((closeButton) => { closeButton.onclick = close; });
    const values = modal.querySelector('.reconciliation-values'), waiverCheckbox = modal.querySelector('[name=waive_delay_interest]'), waiverFields = modal.querySelector('.delay-interest-waiver-fields'), waiverInput = modal.querySelector('[name=delay_interest_waiver_amount]'), approvalInput = modal.querySelector('[name=approval_reference]'), reasonInput = modal.querySelector('[name=reason]'), journalPreview = modal.querySelector('.reconciliation-posting-preview'), message = modal.querySelector('#loan-reconciliation-message'), confirmButton = modal.querySelector('#confirm-loan-reconciliation');
    const validate = () => {
      const waiver = waiverCheckbox.checked ? toMoneyNumber(waiverInput.value) : 0;
      const state = settlementPreviewState(preview, waiver);
      const waiverInvalid = waiverCheckbox.checked && (waiver < 0 || waiver > initial.delayOutstanding + state.settlementTolerance);
      const requiredMissing = waiverCheckbox.checked && (!approvalInput.value.trim() || !reasonInput.value.trim());
      waiverFields.classList.toggle('hidden', !waiverCheckbox.checked);
      values.innerHTML = renderLoanReconciliationValues(preview, loan, waiver);
      journalPreview.innerHTML = `<h3>Posting Preview</h3>${initial.reclassification > state.settlementTolerance ? `<p><strong>Reclassification</strong><br>Dr Customer Advances / Credit Balances<br>Cr Penalty / Delay Interest Receivable<br>${formatCurrency(initial.reclassification)}</p>` : ''}${waiverCheckbox.checked && waiver > 0 ? `<p><strong>Waiver</strong><br>Dr Delay Interest Waiver Expense<br>Cr Penalty / Delay Interest Receivable<br>${formatCurrency(waiver)}</p>` : ''}<p><strong>No additional cash or bank entry will be posted.</strong></p>`;
      const errors = [];
      if (!accountingReady) errors.push('Required accounting accounts are not configured.');
      if (waiverInvalid) errors.push('Delay interest waiver cannot exceed outstanding delay interest.');
      if (requiredMissing) errors.push('Approval Reference and Reason are required for a delay-interest waiver.');
      if (state.hasRemainingBalance) errors.push(`Remaining balance: ${formatCurrency(state.remainingBalance)}. Waive the remaining delay interest to settle this loan.`);
      message.innerHTML = errors.length ? `<div class="alert error">${errors.map(escapeHtml).join('<br>')}</div>` : `<div class="alert success">Proposed status: <strong>${state.proposedStatus}</strong></div>`;
      confirmButton.disabled = posting || !accountingReady || waiverInvalid || requiredMissing || state.hasRemainingBalance;
      return { waiver, state, valid: !confirmButton.disabled };
    };
    [waiverCheckbox, waiverInput, approvalInput, reasonInput].forEach((input) => input.addEventListener('input', validate));
    waiverCheckbox.addEventListener('change', validate);
    confirmButton.onclick = async () => {
      const validation = validate();
      if (!validation.valid || confirmButton.disabled) return;
      posting = true;
      confirmButton.disabled = true;
      try {
        const body = { confirm: true, waive_delay_interest: waiverCheckbox.checked, delay_interest_waiver_amount: validation.waiver, approval_reference: approvalInput.value.trim(), reason: reasonInput.value.trim() };
        const reconciliation = await api(postPath, { method: 'POST', body });
        const result = settlementPreviewState({ ...reconciliation, proposed_status: reconciliation.new_status ?? reconciliation.loan_status ?? reconciliation.proposed_status });
        if (!result.canSettle) { message.innerHTML = '<div class="alert error">The loan settlement could not be confirmed. Review the updated reconciliation before trying again.</div>'; return; }
        modal.querySelector('.modal-card').innerHTML = `<div class="modal-header"><h2 id="loan-reconciliation-title">Loan Settled Successfully</h2><button class="icon-button" data-close-success aria-label="Close reconciliation">×</button></div>${renderLoanReconciliationSuccess(reconciliation, loan)}<div class="modal-actions sticky-modal-footer"><button type="button" data-close-success>Close</button></div>`;
        modal.querySelectorAll('[data-close-success]').forEach((closeButton) => { closeButton.onclick = close; });
        await refreshReconciledLoan(loanId, reconciliation);
      } catch (error) {
        if (reconciliationPreviewChanged(error)) {
          try {
            const refreshedPreview = normalizeLoanReconciliationPreview(await api(previewPath, { method: 'POST', body: {} }));
            loanReconciliationState.preview = refreshedPreview;
            renderPreview(refreshedPreview);
            modal.querySelector('#loan-reconciliation-message').innerHTML = '<div class="alert warning">The preview is stale because loan balances changed. Review the updated reconciliation before confirming.</div>';
          } catch (previewError) { message.innerHTML = `<div class="alert error">${escapeHtml(loanReconciliationErrorMessage(previewError))}</div>`; }
          return;
        }
        message.innerHTML = `<div class="alert error">${escapeHtml(loanReconciliationErrorMessage(error))}</div>`;
      } finally { posting = false; if (modal.isConnected && modal.querySelector('#confirm-loan-reconciliation')) validate(); }
    };
    validate();
  };
  try {
    const preview = normalizeLoanReconciliationPreview(await api(previewPath, { method: 'POST', body: {} }));
    loanReconciliationState = { loanId, preview };
    const root = reconciliationModalRoot();
    root.replaceChildren();
    modal = document.createElement('div');
    modal.id = 'loan-reconciliation-modal';
    modal.className = 'reconciliation-overlay is-open';
    modal.hidden = false;
    modal.setAttribute('role', 'dialog');
    modal.setAttribute('aria-modal', 'true');
    modal.setAttribute('aria-hidden', 'false');
    modal.setAttribute('aria-labelledby', 'loan-reconciliation-title');
    modal.tabIndex = -1;
    modal.innerHTML = '<div class="reconciliation-modal modal-card wide"></div>';
    root.appendChild(modal);
    document.body.classList.add('modal-open');
    modal.addEventListener('keydown', trapFocus);
    modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
    renderPreview(preview);
    modal.querySelector('[data-close]')?.focus();
  } catch (error) {
    console.error('Unable to open loan reconciliation', error);
    setInlineAlert(adminLoanDetailMessage, loanReconciliationErrorMessage(error), 'error');
    loanReconciliationInProgress = false;
    button.disabled = false;
    button.textContent = buttonLabel;
  }
}

async function openManualInterestAccrualDialog(loanOnly = true) {
  const loanId = loanOnly ? getLoanId(adminLoansState.selectedLoan) : '';
  const modal = document.createElement('div'); modal.className='modal-overlay historical-accounting-modal';
  modal.innerHTML = `<div class="modal-card wide"><div class="modal-header"><h2>Accrue Interest</h2><button class="icon-button" data-close>×</button></div><div id="accrual-error"></div><div class="accounting-grid"><label>As-of date<input id="accrual-asof" type="date" value="${todayDateOnly()}"></label><label><input id="accrual-loan-only" type="checkbox" ${loanId?'checked':''}> Optional loan-only scope</label></div><button id="preview-accrual" class="secondary">Preview</button><div id="accrual-preview" class="subcard">Preview eligible installments before posting.</div><div class="modal-actions sticky-modal-footer"><button class="secondary" data-close>Cancel</button><button id="confirm-accrual" disabled>Confirm Accrual</button></div></div>`;
  document.body.appendChild(modal); modal.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal.remove());
  const asof=modal.querySelector('#accrual-asof'), loanOnlyEl=modal.querySelector('#accrual-loan-only'), box=modal.querySelector('#accrual-preview'), err=modal.querySelector('#accrual-error'), confirmBtn=modal.querySelector('#confirm-accrual'); let preview=null;
  const payload=()=>({ as_of_date: asof.value, loan_id: loanOnlyEl.checked ? loanId : undefined, preview: true });
  modal.querySelector('#preview-accrual').onclick=async()=>{ err.innerHTML=''; box.innerHTML='Loading preview...'; confirmBtn.disabled=true; try{ preview=await api('/admin/accounting/accrue-interest',{method:'POST',body:payload()}); const skipped=accountingItems(preview.skipped_rows||preview.skipped||[]); box.innerHTML=`<h3>Accrual Preview</h3><p>Eligible installments: ${escapeHtml(preview.eligible_installments ?? preview.installments ?? 0)}</p><p>Total interest: ${formatCurrency(preview.total_interest ?? preview.totalInterest ?? 0)}</p><p>Date range: ${escapeHtml(formatDateOnlyDisplay(preview.date_from||preview.dateFrom))} to ${escapeHtml(formatDateOnlyDisplay(preview.date_to||preview.dateTo||asof.value))}</p><p>Skipped rows: ${skipped.length}</p><p>Locked-period issues: ${escapeHtml(preview.locked_period_issues ?? preview.lockedPeriodIssues ?? 0)}</p>`; confirmBtn.disabled=Number(preview.locked_period_issues||0)>0; }catch(e){ box.innerHTML='<p>Preview failed.</p>'; err.innerHTML=`<div class="alert error">${escapeHtml(e.message||'Failed to preview accrual.')}</div>`; } };
  confirmBtn.onclick=async()=>{ confirmBtn.disabled=true; err.innerHTML=''; try{ const res=await api('/admin/accounting/accrue-interest',{method:'POST',body:{...payload(),preview:false}}); box.innerHTML=`<div class="alert success"><strong>Interest accrual completed.</strong><br>Installments processed: ${escapeHtml(res.installments_processed ?? res.processed ?? 0)}<br>Total interest accrued: ${formatCurrency(res.total_interest_accrued ?? res.total_interest ?? 0)}<br>Journal count: ${escapeHtml(res.journal_count ?? res.journals ?? 0)}</div>`; await loadAdminLoanLedger(true); await loadAdminLoans(true); }catch(e){ err.innerHTML=`<div class="alert error">${escapeHtml(e.message||'Failed to accrue interest.')}</div>`; }finally{ confirmBtn.disabled=false; } };
}

async function reverseLoanDisbursementDialog() {
  const loanId=getLoanId(adminLoansState.selectedLoan); if(!loanId)return;
  const reason=prompt('Reverse Disbursement reason (required):'); if(!reason)return;
  const reversalDate=prompt('Reversal date (YYYY-MM-DD)', todayDateOnly()); if(!reversalDate)return;
  const ok=window.confirm('Reverse Disbursement will reverse the disbursement journal, interest journals, and delay-interest journals. Payments may block reversal. The loan returns to APPROVED and original journals remain in audit history. Continue?');
  if(!ok)return;
  try{ setInlineAlert(adminLoanDetailMessage,'Reversing disbursement...','success'); await api(`/admin/loans/${encodeURIComponent(loanId)}/reverse-disbursement`,{method:'POST',body:{reason,reversal_date:reversalDate}}); setInlineAlert(adminLoanDetailMessage,'Disbursement reversed.','success'); await loadAdminLoans(true); await loadAdminLoanLedger(true); }catch(e){ setInlineAlert(adminLoanDetailMessage,e.message||'Loan cannot be reversed because payments exist.','error'); }
}

function renderLoanDetailFields(loan) {
  const ledgerRows = adminLoansState.ledger || [];
  const ledgerSummary = adminLoansState.ledgerTotals;
  const resolved = resolveLoanScheduleValues(loan, ledgerRows, ledgerSummary);
  const totals = calculateLedgerDisplayTotals(ledgerRows, ledgerSummary);
  const termDisplay = resolved.termDisplay;
  const frequencyDisplay = resolved.frequencyDisplay;
  const installmentCountDisplay = resolved.installmentCountDisplay;
  const installmentAmount = getLoanField(ledgerSummary || {}, ['installment_amount', 'installmentAmount'], getAuthoritativeLoanValue(loan, ['installment_amount', 'installmentAmount'], null));
  const totalInterest = totals.totalInterest;
  const totalPayable = totals.totalPayable;
  const startDate = resolved.startDate;
  const maturityDate = resolved.maturityDate;
  const settled = getLoanStatus(loan) === 'SETTLED';
  const settlementDisplay = getSettlementDisplaySummary(ledgerSummary || {}, loan);
  const settlementBreakdownFields = settled && settlementDisplay.breakdownAvailable ? [
    ['Delay Interest Paid', formatCurrency(settlementDisplay.delayInterestPaid)],
    ['Delay Interest Waived', formatCurrency(settlementDisplay.delayInterestWaived)],
    ['Settlement Adjustments', formatCurrency(settlementDisplay.settlementAdjustments)],
    ['Gross Amount Satisfied', formatCurrency(settlementDisplay.grossSatisfiedAmount)],
  ] : [];
  const fields = [
    ['Loan Number', getLoanField(loan, ['loan_number', 'loanNumber', 'number', 'reference'])],
    ['Customer', getCustomerDisplayNameFromLoan(loan)],
    ['Principal', formatCurrency(totals.totalPrincipal || getLoanField(loan, ['principal_amount', 'principalAmount', 'principal', 'amount', 'approved_amount', 'approvedAmount'], 0))],
    ['Term', termDisplay],
    ['Frequency', frequencyDisplay],
    ['Interest rate and basis', `${getAuthoritativeLoanValue(loan, ['interest_rate', 'interestRate'], 0)}% ${(getAuthoritativeLoanValue(loan, ['interest_rate_basis', 'interestRateBasis'], 'FLAT_TERM') || 'FLAT_TERM')}`],
    ['Installment count', installmentCountDisplay],
    ['Installment amount', loanHasValue(installmentAmount) ? formatCurrency(installmentAmount) : 'Missing'],
    ['Total Interest', formatCurrency(totalInterest)],
    ['Total Payable', formatCurrency(totalPayable)],
    ['Total Paid', formatCurrency(settlementDisplay.totalPaid)],
    ...settlementBreakdownFields,
    ['Outstanding', formatCurrency(Math.max(0, Number(totals.outstanding) || 0))],
    ...(getCustomerCreditAmount(loan) > 0 ? [['Customer Credit', formatCurrency(getCustomerCreditAmount(loan))]] : []),
    ...(settled ? [
      ['Original Total Payable', formatCurrency(getLoanField(loan, ['original_total_payable', 'originalTotalPayable', 'contractual_total_payable', 'contractualTotalPayable', 'total_payable', 'totalPayable'], 0))],
      ['Interest Rebate', formatCurrency(getLoanField(loan, ['interest_rebate', 'interestRebate', 'settlement.interest_rebate'], 0))],
      ['Final Settlement Amount', formatCurrency(getLoanField(loan, ['final_settlement_amount', 'finalSettlementAmount', 'settlement.final_settlement_amount'], 0))],
      ['Settlement Type', getLoanField(loan, ['settlement_type', 'settlementType', 'settlement.type'], '—')],
      ['Settlement Date', formatDate(getSettlementDate(loan)) || getSettlementDate(loan) || '—'],
      ['Approval Reference', getLoanField(loan, ['approval_reference', 'approvalReference', 'settlement.approval_reference'], '—')],
      ['Reason', getLoanField(loan, ['settlement_reason', 'reason', 'settlement.reason'], '—')],
      ['Final Payment', getLoanField(loan, ['final_payment_receipt_number', 'finalPaymentReceiptNumber', 'settlement_receipt_number', 'settlementReceiptNumber', 'receipt_number'], '—')],
    ] : []),
    ['Start date', loanHasValue(startDate) ? (formatDate(startDate) || startDate) : 'Missing'],
    ['Maturity date', loanHasValue(maturityDate) ? (formatDate(maturityDate) || maturityDate) : 'Missing'],
    ['Status', getLoanField(loan, ['status', 'loan_status', 'loanStatus'], 'UNKNOWN')],
  ];
  const warnings = [
    buildLoanDataWarnings(loan, ledgerRows, ledgerSummary),
    buildScheduleValidationWarning(loan, ledgerRows, ledgerSummary),
  ].join('');
  const repairAction = renderLoanRepairAction(loan);
  const settlementSummary = settled ? `<div class="subcard"><h3>Settlement Summary</h3><p>The loan has been fully settled.</p><p>Total Paid represents actual customer payments only. Waivers and settlement adjustments are shown separately.</p>${settlementDisplay.breakdownAvailable ? '' : '<p class="muted">Settlement breakdown unavailable</p>'}<div class="action-row"><button type="button" data-post-settlement-payment>Record Post-Settlement Payment</button><button type="button" class="secondary" data-view-customer-credit>View Customer Credit</button>${getCustomerCreditAmount(loan)>0 ? '<button type="button" class="secondary" data-refund-customer-credit>Refund Credit</button><button type="button" class="secondary" data-apply-customer-credit>Apply Credit to Another Loan</button>' : ''}</div></div>` : '';
  const legacyWarning = getLoanOutstanding(loan) < 0 ? '<div class="alert warning">Settlement reconciliation required <button type="button" class="secondary" data-reconcile-loan>Reconcile Loan</button></div>' : '';
  adminLoanDetailContent.innerHTML = `${warnings}${legacyWarning}${settlementSummary}${renderPostSettlementTransactions(loan, ledgerSummary)}${renderAccountingSummarySection(loan)}${repairAction ? `<div class="loan-detail-actions">${repairAction}</div>` : ''}<div class="loan-detail-grid">${fields
    .map(([label, value]) => `<div class="loan-detail-stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong></div>`)
    .join('')}</div>`;
}


function renderLedgerJournalLink(entry = {}) {
  const url = getLedgerField(entry, ['journal_url','journalUrl','journal.display_url','journalDisplayUrl'], '');
  const id = getLedgerField(entry, ['journal_id','journalId','interest_journal_id','payment_journal_id'], '');
  const label = getLedgerField(entry, ['journal_no','journalNo','journal_number','journalNumber'], id || '—');
  if (url && url !== '—') return `<a href="${escapeHtml(url)}" target="_blank" rel="noopener">${escapeHtml(label)}</a>`;
  if (id && id !== '—') return `<button type="button" class="link-button" data-journal-id="${escapeHtml(id)}">${escapeHtml(label)}</button>`;
  return '<span class="muted">—</span>';
}

function deriveLedgerAccountingStatus(entry = {}) {
  const raw = String(getLedgerField(entry, ['journal_status','journalStatus','accrual_status','accrualStatus','status','payment_status','paymentStatus'], 'Not due')).toUpperCase().replace(/_/g,' ');
  const due = getLedgerDueDate(entry);
  if (String(getLedgerField(entry, ['reversed','is_reversed','isReversed'], '')).toLowerCase() === 'true') return 'Reversed';
  if (raw.includes('PARTIAL')) return 'Partially paid';
  if (raw.includes('PAID') || raw.includes('SETTLED')) return 'Paid';
  if (raw.includes('ACCRUED')) return 'Accrued';
  if (due && isHistoricalDate(due)) return 'Overdue';
  if (due === todayDateOnly()) return 'Due';
  return raw === 'UNKNOWN' ? 'Not due' : titleCase(raw.toLowerCase());
}

function getPostSettlementTransactions(loan = {}, ledgerSummary = {}) {
  const candidates = [
    ledgerSummary?.post_settlement_transactions, ledgerSummary?.postSettlementTransactions,
    ledgerSummary?.post_settlement_payments, ledgerSummary?.postSettlementPayments,
    loan?.post_settlement_transactions, loan?.postSettlementTransactions,
    loan?.post_settlement_payments, loan?.postSettlementPayments,
  ];
  return candidates.find(Array.isArray) || [];
}

function renderPostSettlementTransactions(loan = {}, ledgerSummary = {}) {
  if (getLoanStatus(loan) !== 'SETTLED') return '';
  const transactions = getPostSettlementTransactions(loan, ledgerSummary);
  const rows = transactions.map((transaction) => `<tr>
    <td>${escapeHtml(formatDate(getLoanField(transaction, ['payment_date','paymentDate','date','created_at','createdAt'], '')) || '—')}</td>
    <td>${formatCurrency(getLoanField(transaction, ['amount','cash_received','cashReceived'], 0))}</td>
    <td>${formatCurrency(getLoanField(transaction, ['delay_interest_paid','delayInterestPaid','delay_interest_payment','delayInterestPayment'], 0))}</td>
    <td>${formatCurrency(getLoanField(transaction, ['customer_credit_created','customerCreditCreated','customer_credit','customerCredit'], 0))}</td>
    <td>${escapeHtml(getLoanField(transaction, ['payment_method','paymentMethod','collection_method','collectionMethod'], '—'))}</td>
    <td>${escapeHtml(getLoanField(transaction, ['reference_number','referenceNumber','reference'], '—'))}</td>
    <td>${renderStatusBadge(getLoanField(transaction, ['journal_status','journalStatus','accounting_status','accountingStatus'], '—'))}</td>
  </tr>`).join('');
  return `<div class="subcard"><div class="card-header"><div><div class="eyebrow">Additional payments</div><h3>Post-Settlement Transactions</h3></div><button type="button" data-post-settlement-payment>Record Post-Settlement Payment</button></div><div class="loan-ledger-table-wrap"><table class="placeholder-table loan-table"><thead><tr><th>Date</th><th>Amount</th><th>Delay Interest Paid</th><th>Customer Credit</th><th>Payment Method</th><th>Reference</th><th>Journal Status</th></tr></thead><tbody>${rows || '<tr><td colspan="7" class="muted">No post-settlement transactions recorded.</td></tr>'}</tbody></table></div></div>`;
}

function renderLoanLedger() {
  setInlineAlert(adminLoanDetailMessage, adminLoansState.ledgerError || '', 'error');
  if (adminLoansState.ledgerLoading) {
    adminLoanDetailContent.innerHTML = '<div class="modal-loading"><p class="muted">Loading repayment ledger...</p></div>';
    return;
  }
  if (adminLoansState.ledgerError) {
    adminLoanDetailContent.innerHTML = '<p class="muted">Unable to load repayment ledger.</p>';
    return;
  }
  const entries = adminLoansState.ledger;
  const loan = adminLoansState.selectedLoan || {};
  const warnings = [
    buildLoanDataWarnings(loan, entries, adminLoansState.ledgerTotals),
    buildScheduleValidationWarning(loan, entries, adminLoansState.ledgerTotals),
  ].join('');
  const repairAction = renderLoanRepairAction(loan);
  const resolved = resolveLoanScheduleValues(loan, entries, adminLoansState.ledgerTotals);
  const scheduleHtml = `${warnings}${repairAction ? `<div class="loan-detail-actions">${repairAction}</div>` : ''}<div class="ledger-totals-grid">${[
    ['Term', resolved.termDisplay],
    ['Frequency', resolved.frequencyDisplay],
    ['Installments', resolved.installmentCountDisplay],
    ['Start date', loanHasValue(resolved.startDate) ? (formatDate(resolved.startDate) || resolved.startDate) : 'Missing'],
    ['Maturity date', loanHasValue(resolved.maturityDate) ? (formatDate(resolved.maturityDate) || resolved.maturityDate) : 'Missing'],
  ].map(([label, value]) => `<div class="loan-detail-stat"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`).join('')}</div>`;
  const totals = calculateLedgerDisplayTotals(entries, adminLoansState.ledgerTotals);
  const credit = getCustomerCreditAmount(loan);
  const settled = getLoanStatus(loan) === 'SETTLED';
  const settlementDisplay = getSettlementDisplaySummary(adminLoansState.ledgerTotals || {}, loan);
  const totalsHtml = [
    ['Total Principal', totals.totalPrincipal],
    ['Total Interest', totals.totalInterest],
    ['Total Payable', totals.totalPayable],
    ['Total Paid', settlementDisplay.totalPaid],
    ...(settled && settlementDisplay.breakdownAvailable ? [
      ['Delay Interest Paid', settlementDisplay.delayInterestPaid],
      ['Delay Interest Waived', settlementDisplay.delayInterestWaived],
      ['Settlement Adjustments', settlementDisplay.settlementAdjustments],
      ['Gross Amount Satisfied', settlementDisplay.grossSatisfiedAmount],
    ] : []),
    ['Outstanding', Math.max(0, Number(totals.outstanding) || 0)],
    ['Delay Interest', totals.totalDelayInterest],
  ].map(([label, value]) => `<div class="loan-detail-stat"><span>${escapeHtml(label)}</span><strong>${formatCurrency(value)}</strong></div>`).join('') + (credit > 0 ? `<div class="loan-detail-stat"><span>Customer Credit</span><strong>${formatCurrency(credit)}</strong></div>` : '') + (settled ? `<p class="ledger-settlement-explanation">Total Paid represents actual customer payments only. Waivers and settlement adjustments are shown separately.</p>${settlementDisplay.breakdownAvailable ? '' : '<p class="muted">Settlement breakdown unavailable</p>'}` : '');

  if (!entries.length) {
    adminLoanDetailContent.innerHTML = `${scheduleHtml}<div class="ledger-totals-grid">${totalsHtml}</div>${renderPostSettlementTransactions(loan, adminLoansState.ledgerTotals)}<p class="muted">No contractual ledger entries found for this loan.</p>`;
    return;
  }

  const rows = entries.map((entry) => {
    const status = String(getLedgerField(entry, ['status', 'payment_status', 'paymentStatus'], 'UNKNOWN'));
    const entryId = getLedgerField(entry, ['id', 'entry_id', 'entryId', 'ledger_entry_id', 'ledgerEntryId'], '');
    const normalizedStatus = status.toLowerCase();
    const canRecordPayment = getLoanStatus(loan) !== 'SETTLED' && entryId && !['paid', 'settled', 'complete', 'completed'].includes(normalizedStatus);
    return `<tr>
      <td>${escapeHtml(getLedgerField(entry, ['installment_number', 'installmentNumber', 'installment_no', 'installmentNo', 'number']))}</td>
      <td>${escapeHtml(formatDate(getLedgerPeriodStartDate(entry)) || getLedgerPeriodStartDate(entry) || '—')}</td>
      <td>${escapeHtml(formatDate(getLedgerField(entry, ['due_date', 'dueDate'], '')) || getLedgerField(entry, ['due_date', 'dueDate']))}</td>
      <td>${escapeHtml(getLedgerField(entry, ['days', 'period_days', 'periodDays'], '—'))}</td>
      <td>${formatCurrency(getLedgerField(entry, ['opening_balance', 'openingBalance'], 0))}</td>
      <td>${formatCurrency(getLedgerField(entry, ['interest', 'interest_amount', 'interestAmount'], 0))}</td>
      <td>${formatCurrency(getLedgerField(entry, ['interest_rebate', 'interestRebate', 'waived_interest', 'waivedInterest'], 0))}</td>
      <td>${formatCurrency(getLedgerField(entry, ['revised_interest', 'revisedInterest'], getLedgerField(entry, ['interest', 'interest_amount', 'interestAmount'], 0) - getLedgerField(entry, ['interest_rebate', 'interestRebate', 'waived_interest', 'waivedInterest'], 0)))}</td>
      <td>${escapeHtml(String(getLedgerField(entry, ['waiver_status', 'waiverStatus'], toMoneyNumber(getLedgerField(entry, ['interest_rebate', 'interestRebate', 'waived_interest', 'waivedInterest'], 0)) > 0 ? 'WAIVED' : '—')))}</td>
      <td>${formatCurrency(getLedgerField(entry, ['interest_accrued', 'interestAccrued'], 0))}</td>
      <td>${escapeHtml(formatDate(getLedgerField(entry, ['interest_accrued_date','interestAccruedDate','accrual_date','accrualDate'], '')) || getLedgerField(entry, ['interest_accrued_date','interestAccruedDate','accrual_date','accrualDate'], '—'))}</td>
      <td>${formatCurrency(getLedgerField(entry, ['interest_paid', 'interestPaid'], 0))}</td>
      <td>${formatCurrency(getLedgerField(entry, ['principal_paid', 'principalPaid', 'principal_collected'], getLedgerField(entry, ['paid_principal'], 0)))}</td>
      <td>${formatCurrency(getLedgerField(entry, ['principal', 'principal_amount', 'principalAmount', 'principal_due', 'principalDue'], 0))}</td>
      <td>${formatCurrency(getLedgerField(entry, ['installment_amount', 'installmentAmount', 'amount_due', 'amountDue'], 0))}</td>
      <td>${formatCurrency(getLedgerField(entry, ['closing_balance', 'closingBalance'], 0))}</td>
      <td>${formatCurrency(getLedgerField(entry, ['paid_amount', 'paidAmount', 'amount_paid', 'amountPaid'], 0))}</td>
      <td>${escapeHtml(formatDate(getLedgerField(entry, ['paid_date', 'paidDate', 'payment_date', 'paymentDate'], '')) || getLedgerField(entry, ['paid_date', 'paidDate', 'payment_date', 'paymentDate']))}</td>
      <td>${escapeHtml(getLedgerField(entry, ['delay_days', 'delayDays', 'late_days', 'lateDays'], '—'))}</td>
      <td>${formatCurrency(getLedgerField(entry, ['delay_interest', 'delayInterest', 'late_interest', 'lateInterest'], 0))}</td>
      <td>${formatCurrency(getLedgerField(entry, ['delay_interest_accrued','delayInterestAccrued'], 0))}</td>
      <td>${formatCurrency(getLedgerField(entry, ['delay_interest_paid','delayInterestPaid'], 0))}</td>
      <td>${formatCurrency(getLedgerField(entry, ['delay_interest_waived','delayInterestWaived'], 0))}</td>
      <td>${renderStatusBadge(deriveLedgerAccountingStatus(entry))}<br>${renderLedgerJournalLink(entry)}</td>
      <td>${canRecordPayment ? `<button type="button" class="secondary" data-action="record-payment" data-loan-id="${escapeHtml(getLoanId(loan))}" data-ledger-entry-id="${escapeHtml(entryId)}" data-installment-no="${escapeHtml(getLedgerField(entry, ['installment_number', 'installmentNumber', 'installment_no', 'installmentNo', 'number'], ''))}">Record Payment</button>` : '<span class="muted">—</span>'} ${getLedgerField(entry, ['payment_id','paymentId'], '') ? `<button type="button" class="secondary" data-payment-detail="${escapeHtml(getLedgerField(entry, ['payment_id','paymentId'], ''))}">Payment Details</button>` : ''}</td>
    </tr>`;
  }).join('');

  adminLoanDetailContent.innerHTML = `${scheduleHtml}<div class="ledger-totals-grid">${totalsHtml}</div>${renderPostSettlementTransactions(loan, adminLoansState.ledgerTotals)}
    <div class="loan-ledger-table-wrap"><table class="placeholder-table loan-table"><thead><tr>
      <th>Installment #</th><th>Period Start</th><th>Due Date</th><th>Days</th><th>Opening Balance</th><th>Original Interest</th><th>Interest Rebate</th><th>Revised Interest</th><th>Waiver Status</th><th>Interest Accrued</th><th>Interest Accrued Date</th><th>Interest Paid</th><th>Principal Paid</th><th>Principal</th><th>Installment Amount</th><th>Closing Balance</th><th>Paid Amount</th><th>Paid Date</th><th>Delay Days</th><th>Delay Interest</th><th>Delay Interest Accrued</th><th>Delay Interest Paid</th><th>Delay Interest Waived</th><th>Journal Status</th><th>Actions</th>
    </tr></thead><tbody>${rows}</tbody></table></div>`;
}

function renderAdminLoanDetail() {
  const loan = adminLoansState.selectedLoan;
  if (!loan || !adminLoanDetailModal) return;
  const loanNumber = getLoanField(loan, ['loan_number', 'loanNumber', 'number', 'reference', 'loan_id', 'loanId', 'id']);
  const status = getLoanField(loan, ['status', 'loan_status', 'loanStatus'], 'UNKNOWN');
  adminLoanDetailTitle.textContent = `Loan ${loanNumber}`;
  adminLoanDetailStatus.innerHTML = renderStatusBadge(status);
  adminLoanDetailTabs.querySelectorAll('[data-admin-loan-tab]').forEach((tab) => {
    tab.classList.toggle('active', tab.dataset.adminLoanTab === adminLoansState.detailTab);
  });
  if (adminLoansState.detailTab === 'ledger') renderLoanLedger();
  else {
    setInlineAlert(adminLoanDetailMessage, '');
    renderLoanDetailFields(loan);
  }
}

function closeAdminLoanDetail() {
  adminLoanDetailModal?.classList.add('hidden');
  restoreBodyScrollingIfNoOverlay();
  const opener = adminLoanDetailModal?._opener;
  adminLoanDetailModal._opener = null;
  if (opener?.isConnected) opener.focus();
}

async function openAdminLoanDetail(loan) {
  ensureAdminLoansUI();
  adminLoansState.selectedLoan = loan;
  adminLoansState.detailTab = 'details';
  adminLoansState.ledger = [];
  adminLoansState.ledgerTotals = null;
  adminLoansState.ledgerError = null;
  adminLoansState.ledgerLoadedLoanId = null;
  adminLoanDetailModal._opener = document.activeElement instanceof HTMLElement ? document.activeElement : null;
  adminLoanDetailModal.classList.remove('hidden');
  document.body.classList.add('modal-open');
  adminLoanDetailModal.querySelector('.modal-body')?.scrollTo({ top: 0 });
  renderAdminLoanDetail();
  adminLoanDetailCloseBtn?.focus();
  await loadAdminLoanLedger();
}

async function switchAdminLoanDetailTab(tab) {
  adminLoansState.detailTab = tab;
  renderAdminLoanDetail();
  if (tab === 'ledger') await loadAdminLoanLedger();
}

async function loadAdminLoanLedger(force = false) {
  const loan = adminLoansState.selectedLoan;
  const loanId = getLoanId(loan);
  if (!loanId || adminLoansState.ledgerLoading) return;
  if (!force && adminLoansState.ledgerLoadedLoanId === loanId) {
    renderAdminLoanDetail();
    return;
  }
  adminLoansState.ledgerLoading = true;
  adminLoansState.ledgerError = null;
  renderAdminLoanDetail();
  try {
    const response = await api(`/admin/loans/${encodeURIComponent(loanId)}/ledger`);
    const { entries, totals } = normalizeLedgerResponse(response);
    adminLoansState.ledger = entries;
    adminLoansState.ledgerTotals = totals;
    adminLoansState.ledgerLoadedLoanId = loanId;
  } catch (error) {
    console.error('Failed to load loan ledger', error);
    adminLoansState.ledgerError = error?.message || "Couldn't load loan ledger. Please try again.";
  } finally {
    adminLoansState.ledgerLoading = false;
    renderAdminLoanDetail();
  }
}

async function repairAdminLoanSchedule() {
  const loanId = getLoanId(adminLoansState.selectedLoan);
  if (!loanId) return;
  const confirmed = confirm('This will replace the incorrect unpaid schedule and recalculate the loan. No payment records will be changed.');
  if (!confirmed) return;
  try {
    setInlineAlert(adminLoanDetailMessage, 'Repairing schedule...', 'success');
    await api(`/admin/loans/${encodeURIComponent(loanId)}/repair-schedule`, { method: 'POST', body: {} });
    setInlineAlert(adminLoanDetailMessage, 'Schedule repaired successfully.', 'success');
    await loadAdminLoans(true);
    const refreshedLoan = adminLoansState.loans.find((item) => String(getLoanId(item)) === String(loanId));
    if (refreshedLoan) adminLoansState.selectedLoan = refreshedLoan;
    adminLoansState.ledgerLoadedLoanId = null;
    if (adminLoansState.detailTab === 'ledger') await loadAdminLoanLedger(true);
    else renderAdminLoanDetail();
  } catch (error) {
    console.error('Failed to repair loan schedule', error);
    setInlineAlert(adminLoanDetailMessage, error?.message || 'Failed to repair schedule.', 'error');
  }
}

async function openPostSettlementPayment(opener) {
  const loan = adminLoansState.selectedLoan || {};
  const loanId = getLoanId(loan);
  if (!loanId || getLoanStatus(loan) !== 'SETTLED') {
    setInlineAlert(adminLoanDetailMessage, 'Post-settlement payments are available only for SETTLED loans.', 'error');
    return;
  }
  document.querySelectorAll('.post-settlement-payment-modal').forEach((existing) => existing.remove());
  const modal = document.createElement('div');
  modal.className = 'modal-overlay historical-accounting-modal record-payment-modal post-settlement-payment-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'post-settlement-payment-title');
  modal.innerHTML = '<div class="modal-card wide"><div class="modal-header"><h2 id="post-settlement-payment-title">Record Post-Settlement Payment</h2></div><p class="muted">Loading payment form…</p></div>';
  document.body.appendChild(modal);
  document.body.classList.add('modal-open');
  const close = () => { if (!modal.isConnected) return; modal.remove(); restoreBodyScrollingIfNoOverlay(); if (opener?.isConnected) opener.focus(); };
  modal.addEventListener('click', (event) => { if (event.target === modal) close(); });
  modal.addEventListener('keydown', (event) => { if (event.key === 'Escape') { event.stopPropagation(); close(); } });

  const [accountsResult, collectorsResult] = await Promise.allSettled([
    api('/admin/accounting/accounts?active=true'), api('/admin/collectors'),
  ]);
  if (!modal.isConnected) return;
  const accounts = accountsResult.status === 'fulfilled' ? accountItems(accountsResult.value) : [];
  const collectors = collectorsResult.status === 'fulfilled' ? accountItems(collectorsResult.value) : [];
  const accountLabel = (account) => `${account.code || account.account_code || ''} ${account.name || account.account_name || ''}`.trim();
  const accountOptions = accounts.filter((account) => account.posting_allowed !== false && account.allow_manual_posting !== false)
    .map((account) => `<option value="${escapeHtml(account.id || account.account_id)}">${escapeHtml(accountLabel(account))}</option>`).join('');
  const collectorOptions = collectors.map((collector) => {
    const accountId = collector.default_collection_account_id || collector.defaultCollectionAccountId || collector.collection_account_id || collector.collectionAccountId;
    return accountId ? `<option value="${escapeHtml(accountId)}">Collector — ${escapeHtml(collectionCollectorName(collector) || collector.id)}</option>` : '';
  }).join('');
  const delayOutstanding = Math.max(0, Number(getLoanField(adminLoansState.ledgerTotals || loan, ['delay_interest_outstanding','delayInterestOutstanding','outstanding_delay_interest','outstandingDelayInterest','delay_interest_receivable','delayInterestReceivable','accounting_summary.delay_interest_receivable'], getLoanField(loan, ['delay_interest_outstanding','delayInterestOutstanding','outstanding_delay_interest','outstandingDelayInterest'], 0))) || 0);
  const existingCredit = getCustomerCreditAmount(loan);
  const metadataWarning = accountsResult.status === 'rejected' || collectorsResult.status === 'rejected' ? '<div class="alert warning">Some receiving-account options could not be loaded. Close and retry before posting.</div>' : '';
  modal.innerHTML = `<div class="modal-card wide"><div class="modal-header"><h2 id="post-settlement-payment-title">Record Post-Settlement Payment</h2><button class="icon-button" data-close aria-label="Close payment form">×</button></div>${metadataWarning}<div class="loan-detail-grid">
    <div class="loan-detail-stat"><span>Loan number</span><strong>${escapeHtml(getLoanField(loan, ['loan_number','loanNumber','number','id'], loanId))}</strong></div>
    <div class="loan-detail-stat"><span>Customer</span><strong>${escapeHtml(getCustomerDisplayNameFromLoan(loan))}</strong></div>
    <div class="loan-detail-stat"><span>Loan status</span><strong>SETTLED</strong></div>
    <div class="loan-detail-stat"><span>Outstanding delay interest</span><strong>${formatCurrency(delayOutstanding)}</strong></div>
    <div class="loan-detail-stat"><span>Existing customer credit</span><strong>${formatCurrency(existingCredit)}</strong></div>
  </div><div id="post-settlement-error"></div><div class="accounting-grid">
    <label>Payment amount<input name="amount" type="number" min="0.01" step="0.01" inputmode="decimal" required></label>
    <label>Payment date<input name="payment_date" type="date" value="${todayDateOnly()}" required></label>
    <label>Payment method<select name="payment_method" required><option value="CASH_COLLECTOR">Cash Collector</option><option value="BANK_TRANSFER">Bank Transfer</option><option value="CASH_AT_OFFICE">Cash at Office</option><option value="CHEQUE">Cheque</option><option value="MOBILE_TRANSFER">Mobile Transfer</option><option value="OTHER">Other</option></select></label>
    <label>Receiving account / collector<select name="receiving_account_id" required><option value="">Select receiving account or collector</option>${collectorOptions}${accountOptions}</select></label>
    <label>Reference<input name="reference_number"></label><label>Notes<textarea name="notes"></textarea></label>
  </div><div id="post-settlement-allocation" class="subcard"></div><div class="modal-actions sticky-modal-footer"><button class="secondary" data-close>Cancel</button><button data-submit disabled>Record Post-Settlement Payment</button></div></div>`;
  modal.querySelectorAll('[data-close]').forEach((button) => button.onclick = close);
  const amount = modal.querySelector('[name=amount]'), date = modal.querySelector('[name=payment_date]'), method = modal.querySelector('[name=payment_method]'), receiving = modal.querySelector('[name=receiving_account_id]');
  const reference = modal.querySelector('[name=reference_number]'), notes = modal.querySelector('[name=notes]'), preview = modal.querySelector('#post-settlement-allocation'), error = modal.querySelector('#post-settlement-error'), submit = modal.querySelector('[data-submit]');
  const validate = () => {
    const paid = Number(amount.value);
    const validAmount = Number.isFinite(paid) && paid > 0;
    const delayPaid = validAmount ? Math.min(paid, delayOutstanding) : 0;
    const creditCreated = validAmount ? Math.max(0, paid - delayPaid) : 0;
    preview.innerHTML = `<h3>Payment Allocation</h3><div class="loan-detail-grid"><div class="loan-detail-stat"><span>Delay Interest Payment</span><strong>${formatCurrency(delayPaid)}</strong></div><div class="loan-detail-stat"><span>Customer Credit</span><strong>${formatCurrency(creditCreated)}</strong></div><div class="loan-detail-stat"><span>Total Payment</span><strong>${formatCurrency(validAmount ? paid : 0)}</strong></div></div><div class="alert warning"><strong>Principal and original interest are already settled and will not be changed.</strong></div>`;
    let message = '';
    if (amount.value && !validAmount) message = 'Enter a valid payment amount greater than zero.';
    else if (!date.value) message = 'Payment date is required.';
    else if (!method.value) message = 'Payment method is required.';
    else if (!receiving.value) message = 'Receiving account / collector is required.';
    error.innerHTML = message ? `<div class="alert error">${escapeHtml(message)}</div>` : '';
    submit.disabled = Boolean(message) || !validAmount || !date.value || !method.value || !receiving.value;
  };
  [amount, date, method, receiving].forEach((input) => input.addEventListener('input', validate));
  validate(); amount.focus();
  submit.onclick = async () => {
    validate(); if (submit.disabled) return;
    const paid = Number(amount.value);
    if (!Number.isFinite(paid) || paid <= 0) return;
    submit.disabled = true; error.innerHTML = '';
    const idempotencyKey = globalThis.crypto?.randomUUID?.() || `post-settlement-${loanId}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    try {
      const result = await api(`/admin/loans/${encodeURIComponent(loanId)}/post-settlement-payment`, { method: 'POST', body: { amount: paid.toFixed(2), payment_date: date.value, payment_method: method.value, receiving_account_id: Number(receiving.value), reference_number: reference.value.trim(), notes: notes.value.trim(), idempotency_key: idempotencyKey } });
      const delayPaid = Number(getLoanField(result, ['delay_interest_paid','delayInterestPaid','delay_interest_payment','delayInterestPayment'], Math.min(paid, delayOutstanding))) || 0;
      const creditCreated = Number(getLoanField(result, ['customer_credit_created','customerCreditCreated','customer_credit','customerCredit'], Math.max(0, paid - delayPaid))) || 0;
      const remainingDelay = Number(getLoanField(result, ['remaining_delay_interest','remainingDelayInterest','delay_interest_outstanding','delayInterestOutstanding'], Math.max(0, delayOutstanding - delayPaid))) || 0;
      modal.querySelector('.modal-card').innerHTML = `<div class="modal-header"><h2>Payment Recorded Successfully</h2><button class="icon-button" data-success-close>×</button></div><div class="loan-detail-grid">${[['Cash Received', paid],['Delay Interest Paid', delayPaid],['Customer Credit Created', creditCreated],['Remaining Delay Interest', remainingDelay]].map(([label,value]) => `<div class="loan-detail-stat"><span>${label}</span><strong>${formatCurrency(value)}</strong></div>`).join('')}<div class="loan-detail-stat"><span>Loan Status</span><strong>SETTLED</strong></div></div><div class="alert success">Principal and original interest remain unchanged.</div><div class="modal-actions sticky-modal-footer"><button data-success-close>Close</button></div>`;
      await Promise.allSettled([loadAdminLoans(true), loadAdminLoanLedger(true), loadUndepositedCollections(), loadCollectorBalances(), loadFinancialReports(), accountingLoadJournals()]);
      const refreshed = adminLoansState.loans.find((item) => String(getLoanId(item)) === String(loanId));
      if (refreshed) adminLoansState.selectedLoan = { ...refreshed, status: 'SETTLED' };
      renderAdminLoanDetail();
      modal.querySelectorAll('[data-success-close]').forEach((button) => button.onclick = close);
    } catch (requestError) {
      error.innerHTML = `<div class="alert error">${escapeHtml(requestError?.message || 'Post-settlement payment was not recorded.')}</div>`;
      validate();
    }
  };
}

async function recordAdminLedgerPayment({ loanId, ledgerEntryId, installmentNo, opener }) {
  if (!loanId || !ledgerEntryId) {
    setInlineAlert(adminLoanDetailMessage, 'Unable to open payment form: ledger entry information is missing.', 'error');
    return;
  }
  const entryId = ledgerEntryId;
  const loan = adminLoansState.selectedLoan || {};
  // Mount immediately so failed metadata calls cannot make the payment form fail silently.
  document.querySelectorAll('.record-payment-modal').forEach((existing) => existing.remove());
  const modal = document.createElement('div');
  modal.className = 'modal-overlay historical-accounting-modal collection-payment-modal record-payment-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'record-payment-title');
  modal._opener = opener instanceof HTMLElement ? opener : null;
  modal.innerHTML = '<div class="modal-card wide"><div class="modal-header"><h2 id="record-payment-title">Record Payment</h2></div><p class="muted">Loading payment form…</p></div>';
  document.body.appendChild(modal);
  document.body.classList.add('modal-open');
  const closePaymentModal = () => {
    if (!modal.isConnected) return;
    modal.remove();
    if (modal._opener?.isConnected) modal._opener.focus();
    restoreBodyScrollingIfNoOverlay();
  };
  const trapFocus = (event) => {
    if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); closePaymentModal(); return; }
    if (event.key !== 'Tab') return;
    const focusable = [...modal.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [href], [tabindex]:not([tabindex="-1"])')];
    if (!focusable.length) return;
    const first = focusable[0], last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
    else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
  };
  modal.addEventListener('keydown', trapFocus);
  modal.addEventListener('click', (event) => { if (event.target === modal) closePaymentModal(); });
  const metadataFailures = [];

  const disbursementDate = getLoanField(loan, ['disbursement_date','disbursementDate','start_date','startDate'], '');
  const ledgerEntry=(adminLoansState.ledger||[]).find(e=>String(getLedgerField(e,['id','entry_id','entryId','ledger_entry_id','ledgerEntryId']))===String(entryId))||{};
  const [settingsRaw, accountsRaw, collectorsRaw] = await Promise.allSettled([
    api('/admin/accounting/settings'),
    api('/admin/accounting/accounts?active=true'),
    api('/admin/collectors'),
  ]);
  if (!modal.isConnected) return;
  if (settingsRaw.status === 'rejected') metadataFailures.push('accounting settings');
  if (accountsRaw.status === 'rejected') metadataFailures.push('collection accounts');
  if (collectorsRaw.status === 'rejected') metadataFailures.push('collectors');
  const settings=settingsRaw.status==='fulfilled' ? (settingsRaw.value||{}) : {};
  const accounts=accountsRaw.status==='fulfilled' ? accountItems(accountsRaw.value) : [];
  const collectors=collectorsRaw.status==='fulfilled' ? accountItems(collectorsRaw.value) : [];
  const accountName=a=>a ? `${a.code||a.account_code||''} ${a.name||a.account_name||''}`.trim() : '';
  const isBank=a=>String(acctSubtype(a)||a.bank_account_type||'').toUpperCase().includes('BANK') || String(a.name||a.account_name||'').toUpperCase().includes('BANK');
  const isCash=a=>String(acctSubtype(a)||'').toUpperCase().includes('CASH') || String(a.name||a.account_name||'').toUpperCase().includes('CASH ON HAND');
  const isControlAccount=a=>String(a?.code||a?.account_code)==='1050'||String(a?.name||a?.account_name||'').toUpperCase().includes('CONTROL');
  const isCollection=a=>(String(acctSubtype(a)||'').toUpperCase().replace(/[ -]/g,'_').includes('COLLECTION_CLEARING') || String(a.name||a.account_name||'').toUpperCase().includes('COLLECTION ACCOUNT')) && !isControlAccount(a) && a.allow_manual_posting!==false && a.posting_allowed!==false;
  const collAccountFor=c=>accounts.find(a=>String(a.id)===String(c.default_collection_account_id||c.defaultCollectionAccountId||c.default_collection_account?.id||c.defaultCollectionAccount?.id||c.collection_account_id||c.collectionAccountId)) || accounts.find(a=>isCollection(a)&&String(a.collector_id||a.collectorId||'')===String(c.id)) || accounts.find(a=>isCollection(a)&&String(a.name||a.account_name||'').toLowerCase().includes(String(c.name||c.full_name||'').toLowerCase()));
  const accountReady=a=>!!(a && (a.id||a.account_id) && (a.code||a.account_code) && (a.name||a.account_name));
  const selectedCollector=()=>collectors.find(x=>String(x.id)===collectorEl.value);
  const createAccountButton='<div class="action-row"><button type="button" data-create-payment-collector-account>Create Collection Account</button></div>';
  const opts=(arr,sel='')=>arr.filter(a=>!isControlAccount(a)).map(a=>`<option value="${escapeHtml(a.id)}" ${String(a.id)===String(sel)?'selected':''}>${escapeHtml(accountName(a))}</option>`).join('');
  modal.innerHTML=`<div class="modal-card wide"><div class="modal-header"><h2 id="record-payment-title">Record Payment</h2><button type="button" class="icon-button" data-close aria-label="Close payment form">×</button></div><div id="payment-metadata-error">${metadataFailures.length ? `<div class="alert error">Some payment form data could not be loaded (${escapeHtml(metadataFailures.join(', '))}). You can close this form and try again.</div>` : ''}</div><div id="payment-entry-error"></div><div class="loan-detail-grid"><div class="loan-detail-stat"><span>Loan</span><strong>${escapeHtml(getLoanField(loan, ['loan_number', 'loanNumber', 'number', 'id'], loanId))}</strong></div><div class="loan-detail-stat"><span>Installment</span><strong>${escapeHtml(installmentNo || '—')}</strong></div><div class="loan-detail-stat"><span>Due date</span><strong>${escapeHtml(formatDate(getLedgerField(ledgerEntry, ['due_date', 'dueDate'], '')) || '—')}</strong></div><div class="loan-detail-stat"><span>Installment amount</span><strong>${formatCurrency(getLedgerField(ledgerEntry, ['installment_amount', 'installmentAmount', 'amount_due', 'amountDue'], 0))}</strong></div><div class="loan-detail-stat"><span>Amount paid</span><strong>${formatCurrency(getLedgerField(ledgerEntry, ['paid_amount', 'paidAmount', 'amount_paid', 'amountPaid'], 0))}</strong></div><div class="loan-detail-stat"><span>Outstanding contractual amount</span><strong>${formatCurrency(getLedgerField(ledgerEntry, ['outstanding_amount', 'outstandingAmount', 'closing_balance', 'closingBalance'], getLoanOutstanding(loan)))}</strong></div></div><div class="accounting-grid"><label>Payment date<input id="ledger-payment-date" type="date" value="${todayDateOnly()}"></label><label>Collection method<select id="ledger-payment-method"><option value="CASH_COLLECTOR">Cash Collector</option><option value="BANK_TRANSFER">Bank Transfer</option><option value="CASH_AT_OFFICE">Cash at Office</option><option value="CHEQUE">Cheque</option><option value="MOBILE_TRANSFER">Mobile Transfer</option><option value="OTHER">Other</option></select></label><label data-collector-wrap>Collector<select id="ledger-payment-collector"><option value="">Select collector</option>${collectors.map(c=>`<option value="${escapeHtml(c.id)}">${escapeHtml(collectionCollectorName(c)||c.username||c.id)}</option>`).join('')}</select><div id="collector-empty-state" class="alert warning ${collectors.length?'hidden':''}">No active collectors are configured.<br><button type="button" data-setup-collector>Set Up Collector</button></div></label><label data-account-wrap>Collection account<select id="ledger-payment-account"><option value="">Select account</option>${opts(accounts.filter(isCollection))}</select></label><label data-bank-wrap class="hidden">Bank account<select id="ledger-payment-bank"><option value="">Select bank account</option>${opts(accounts.filter(isBank))}</select></label><label data-bank-ref-wrap class="hidden">Bank transaction/reference number<input id="ledger-payment-bank-reference"></label><label>Amount<input id="ledger-payment-amount" type="number" step="0.01" min="0"></label><label>Reference<input id="ledger-payment-reference"></label><label>Remarks<textarea id="ledger-payment-remarks"></textarea></label></div><div id="historical-payment-panel"></div><div id="payment-allocation-preview" class="subcard"></div><div class="modal-actions sticky-modal-footer"><button class="secondary" data-close>Cancel</button><button id="ledger-payment-confirm" disabled>Record Payment</button></div></div>`;
  modal.querySelectorAll('[data-close]').forEach(b=>b.onclick=closePaymentModal);
  const dateEl=modal.querySelector('#ledger-payment-date'), amountEl=modal.querySelector('#ledger-payment-amount'), methodEl=modal.querySelector('#ledger-payment-method'), collectorEl=modal.querySelector('#ledger-payment-collector'), accountEl=modal.querySelector('#ledger-payment-account'), bankEl=modal.querySelector('#ledger-payment-bank'), bankRefEl=modal.querySelector('#ledger-payment-bank-reference'), refEl=modal.querySelector('#ledger-payment-reference'), remarksEl=modal.querySelector('#ledger-payment-remarks'), preview=modal.querySelector('#payment-allocation-preview'), hist=modal.querySelector('#historical-payment-panel'), err=modal.querySelector('#payment-entry-error'), btn=modal.querySelector('#ledger-payment-confirm');
  const applyMethod=()=>{ const m=methodEl.value; modal.querySelector('[data-bank-wrap]').classList.toggle('hidden',m!=='BANK_TRANSFER'); modal.querySelector('[data-bank-ref-wrap]').classList.toggle('hidden',m!=='BANK_TRANSFER'); modal.querySelector('[data-collector-wrap]').classList.toggle('hidden',m!=='CASH_COLLECTOR'); modal.querySelector('[data-account-wrap]').classList.toggle('hidden',m==='BANK_TRANSFER'); if(m==='CASH_AT_OFFICE'){ const cash=accounts.find(isCash); if(cash) accountEl.value=cash.id; } if(m==='BANK_TRANSFER') accountEl.value=''; if(m!=='CASH_COLLECTOR') accountEl.disabled=false; validate(); };
  collectorEl.onchange=()=>{ const c=selectedCollector(); const a=c&&collAccountFor(c); accountEl.value=a?.id||''; accountEl.disabled=methodEl.value==='CASH_COLLECTOR'; validate(); };
  const periodStatus=()=>String(settings.current_period_status||settings.accounting_period_status||settings.periodStatus||'Open');
  const validate=()=>{ const paidAmount=Number(amountEl.value||0); let error=''; let warning=''; const historical=isHistoricalDate(dateEl.value); if(disbursementDate && dateOnlyToEpoch(dateEl.value)<dateOnlyToEpoch(disbursementDate)) error='Payment date cannot be earlier than disbursement date.'; else if(isFutureDateOnly(dateEl.value)) error='Future payment dates are not supported.'; else if(historical && String(settings.allow_historical_collections ?? settings.allowHistoricalCollections ?? settings.allow_backdated_payment ?? true)==='false') error='Historical collections are disabled by accounting settings.'; if(historical){ const locked=String(settings.locked_period_posting||'').toUpperCase()==='BLOCK' || String(settings.accounting_period_locked||settings.periodLocked)==='true'; if(locked) error='Backend error: selected accounting period is locked.'; warning=`<div class="alert warning"><strong>Historical payment</strong><br>This payment will be posted using the selected historical accounting date.<div class="accounting-grid"><div><strong>Loan disbursement date</strong><br>${escapeHtml(formatDateOnlyDisplay(disbursementDate)||'—')}</div><div><strong>Selected payment date</strong><br>${escapeHtml(formatDateOnlyDisplay(dateEl.value))}</div><div><strong>Interest accruals required through payment date</strong><br>${escapeHtml(settings.historical_payments_auto_accrue===false?'Manual accrual required':'Will be calculated by backend')}</div><div><strong>Accounting-period status</strong><br>${escapeHtml(periodStatus())}</div></div></div>`; }
    hist.innerHTML=warning; const amountDue=Math.max(0, getLoanOutstanding(loan)); const creditToCreate=Math.max(0, paidAmount-amountDue); const overpaymentAllowed=String(settings.allow_customer_credits ?? settings.allowCustomerCredits ?? true)!=='false'; if(creditToCreate>0){ warning += `<div class="alert warning"><strong>Payment exceeds the loan balance</strong><br>Amount due: ${formatCurrency(amountDue)}<br>Payment entered: ${formatCurrency(paidAmount)}<br>Customer credit to be created: ${formatCurrency(creditToCreate)}<br><strong>Confirm Payment and Create Credit</strong></div>`; } hist.innerHTML=warning; const interest=Math.min(paidAmount, Number(getLedgerField(ledgerEntry, ['interest','interest_amount','interestAmount'], paidAmount*0.2))||0); const principal=Math.max(0, paidAmount-interest); const selectedAccount = methodEl.value==='BANK_TRANSFER' ? accounts.find(a=>String(a.id)===bankEl.value) : accounts.find(a=>String(a.id)===accountEl.value); const collectorCash=methodEl.value==='CASH_COLLECTOR'; const collectorAccountMissing=collectorCash && collectorEl.value && !accountReady(selectedAccount); preview.innerHTML=`<h3>Allocation Preview</h3><p><strong>Payment:</strong> ${formatCurrency(paidAmount)}</p><ul><li>Delay interest: ${formatCurrency(0)}</li><li>Interest: ${formatCurrency(interest)}</li><li>Principal: ${formatCurrency(principal)}</li><li>Unapplied: ${formatCurrency(0)}</li></ul>${collectorCash&&accountReady(selectedAccount)?`<div class="alert warning"><strong>Cash destination:</strong><br>${escapeHtml(accountName(selectedAccount))}<br>This payment will be posted to ${escapeHtml((accountName(selectedAccount)||'Collection Account').replace(/^\d+\s*[—-]?\s*/,''))} until deposited to a company bank account.</div>`:''}`; if(methodEl.value==='BANK_TRANSFER'&&!bankEl.value) error='Select a bank account for a direct transfer.'; if(methodEl.value==='CASH_COLLECTOR'&&!collectorEl.value) error='Select a collector.'; if(collectorAccountMissing) error='Collector has no posting collection account.'; if(methodEl.value!=='BANK_TRANSFER'&&selectedAccount&&isControlAccount(selectedAccount)) error='The control account cannot be used for customer payments.'; if(methodEl.value!=='BANK_TRANSFER'&&!accountEl.value) error=methodEl.value==='CASH_COLLECTOR'?error:'Select a collection account.'; if(error) err.innerHTML=`<div class="alert error">${escapeHtml(error)}</div>${collectorAccountMissing?createAccountButton:''}`; else err.innerHTML=''; if(creditToCreate>0&&!overpaymentAllowed) error='Customer credits are not enabled for this payment.'; if(creditToCreate>0&&!btn.dataset.overpaymentConfirmed) btn.textContent='Confirm Payment and Create Credit'; else btn.textContent='Record Payment'; btn.disabled=!!error || !(paidAmount>0 && dateEl.value && methodEl.value); };
  modal.querySelector('[data-setup-collector]')?.addEventListener('click',()=>{ closePaymentModal(); showAdminSection('collections-collectors'); setTimeout(()=>openCollectorSetupWizard({fromPayment:true}),50); }); [dateEl,amountEl,methodEl,collectorEl,accountEl,bankEl,bankRefEl,remarksEl].forEach(el=>el.addEventListener('input',()=>{ delete btn.dataset.overpaymentConfirmed; validate(); })); methodEl.addEventListener('change',applyMethod); err.addEventListener('click',e=>{ if(e.target.closest('[data-create-payment-collector-account]')){ const c=selectedCollector(); closePaymentModal(); showAdminSection('collections-collectors'); setTimeout(()=>openCollectionAccountForm({collector_id:collectorId(c)||collectorEl.value,account_name:'Collection Account – '+(collectionCollectorName(c)||'Collector')}),50); } }); applyMethod(); validate();
  modal.querySelector('#ledger-payment-date')?.focus();
  btn.onclick=async()=>{ if(btn.disabled)return; const method=methodEl.value; const paidAmount=Number(amountEl.value); const creditToCreate=Math.max(0,paidAmount-Math.max(0,getLoanOutstanding(loan))); if(creditToCreate>0&&!btn.dataset.overpaymentConfirmed){ btn.dataset.overpaymentConfirmed='true'; err.innerHTML=`<div class="alert warning">Payment exceeds the loan balance. ${formatCurrency(creditToCreate)} will be recorded as customer credit. Click <strong>Confirm Payment and Create Credit</strong> again to proceed, or Cancel.</div>`; validate(); return; } if(!Number.isFinite(paidAmount)||paidAmount<=0){ err.innerHTML='<div class="alert error">Enter a payment amount greater than zero.</div>'; return; } const selectedCollectorId=collectorEl.value; const selectedCollectionAccountId=method==='BANK_TRANSFER'?bankEl.value:accountEl.value; const account=method==='BANK_TRANSFER'?accounts.find(a=>String(a.id)===bankEl.value):accounts.find(a=>String(a.id)===accountEl.value); btn.disabled=true; err.innerHTML=''; try{ const body={ paid_amount:paidAmount, payment_date:dateEl.value, payment_method:method, collection_method:method, collector_id:method==='CASH_COLLECTOR'?Number(selectedCollectorId)||undefined:undefined, collection_account_id:selectedCollectionAccountId?Number(selectedCollectionAccountId):undefined, reference:refEl.value.trim()||bankRefEl.value.trim(), remarks:remarksEl.value.trim(), bank_account_id: method==='BANK_TRANSFER'?Number(bankEl.value)||undefined:undefined, bank_reference:bankRefEl.value.trim() }; console.log('Ledger payment payload', body); const res=await api(`/admin/loans/${encodeURIComponent(loanId)}/ledger/${encodeURIComponent(entryId)}/payment`, { method:'POST', body }); const paymentId=res.payment_id||res.paymentId||res.id; const journalId=res.journal_entry_id||res.journalEntryId; const journalNo=res.journal_number||res.journalNumber||res.journal_no||res.journalNo; if(!(paymentId&&journalId&&journalNo)){ const unposted=String(res.accounting_status||res.accountingStatus||'').toUpperCase()==='UNPOSTED'; err.innerHTML=`<div class="alert error">Payment was not posted because the accounting journal was not created.</div>${unposted?`<button type="button" id="repair-payment-accounting">Repair Accounting</button>`:''}`; const repair=err.querySelector('#repair-payment-accounting'); if(repair) repair.onclick=async()=>{ if(!confirm('This will create the missing accounting journal for the existing payment. The payment amount will not be entered again.'))return; repair.disabled=true; try{ await api(`/admin/payments/${encodeURIComponent(paymentId)}/repair-accounting`,{method:'POST',body:{}}); err.innerHTML='<div class="alert success">Accounting repair requested. Reopen the payment details to confirm the journal.</div>'; await loadAdminLoanLedger(true); }catch(e){ err.innerHTML=`<div class="alert error">${escapeHtml(e.message||'Failed to repair accounting.')}</div>`; } }; return; } const settled=String(res.loan_status||res.loanStatus||'').toUpperCase()==='SETTLED'; const customerCredit=getCustomerCreditAmount(res); closePaymentModal(); setInlineAlert(adminLoanDetailMessage,settled?'Loan Settled Successfully':`Payment recorded and Journal ${journalNo} posted successfully.`,'success'); await Promise.allSettled([loadAdminLoanLedger(true), loadAdminLoans(true), loadUndepositedCollections(), loadCollectorBalances(), loadFinancialReports(), accountingLoadJournals()]); return; }catch(error){ console.error('Failed to record ledger payment', error); const message=String(error?.message||''); err.innerHTML=`<div class="alert error">${escapeHtml(message.includes('customer_advance_account_missing')?'Configure the Customer Advances liability account before recording this overpayment.':(message||'Payment was not posted. The loan settlement could not be completed.'))}</div>`; }finally{ validate(); } };

}

async function openPaymentDetailDialog(paymentId) {
  if (!paymentId) return;
  const modal=document.createElement('div'); modal.className='modal-overlay historical-accounting-modal';
  modal.innerHTML='<div class="modal-card wide"><div class="modal-header"><h2>Payment Details</h2><button class="icon-button" data-close>×</button></div><div id="payment-detail-body">Loading payment details...</div></div>';
  document.body.appendChild(modal); modal.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal.remove());
  const body=modal.querySelector('#payment-detail-body');
  try{
    const payment=await api(`/admin/payments/${encodeURIComponent(paymentId)}`);
    const canReverse=boolFromBackend(payment.can_reverse ?? payment.canReverse ?? accountingCan('payments.reverse'), true);
    body.innerHTML=`<div class="loan-detail-grid">${[
      ['Total payment',formatCurrency(payment.amount||payment.total_payment||payment.totalPayment)],
      ['Principal allocation',formatCurrency(payment.principal_allocation||payment.principalAllocation)],
      ['Interest allocation',formatCurrency(payment.interest_allocation||payment.interestAllocation)],
      ['Delay-interest allocation',formatCurrency(payment.delay_interest_allocation||payment.delayInterestAllocation)],
      ['Unapplied amount',formatCurrency(payment.unapplied_amount||payment.unappliedAmount)],
      ['Journal number',payment.journal_no||payment.journalNumber||'—'],
      ['Accounting date',formatDateOnlyDisplay(payment.accounting_date||payment.payment_date)],
      ['Status',payment.status||'—'],
      ['Reversal status',payment.reversal_status||payment.reversalStatus||'—'],
    ].map(([l,v])=>`<div class="loan-detail-stat"><span>${escapeHtml(l)}</span><strong>${escapeHtml(String(v))}</strong></div>`).join('')}</div>${canReverse?'<div class="alert warning">This will not delete the original payment or journal. A reversing journal will be created.</div><button class="danger" id="reverse-payment-btn">Reverse Payment</button>':''}`;
    const reverseBtn=body.querySelector('#reverse-payment-btn');
    if(reverseBtn) reverseBtn.onclick=async()=>{ const reason=prompt('Reversal reason (required):'); if(!reason)return; const reversalDate=prompt('Reversal date (YYYY-MM-DD)', todayDateOnly()); if(!reversalDate)return; if(!window.confirm('Create a reversing journal for this payment?'))return; reverseBtn.disabled=true; try{ await api(`/admin/payments/${encodeURIComponent(paymentId)}/reverse`,{method:'POST',body:{reason,reversal_date:reversalDate}}); body.insertAdjacentHTML('afterbegin','<div class="alert success">Payment reversed.</div>'); await loadAdminLoanLedger(true); }catch(e){ body.insertAdjacentHTML('afterbegin',`<div class="alert error">${escapeHtml(e.message||'Failed to reverse payment.')}</div>`); }finally{ reverseBtn.disabled=false; } };
  }catch(e){ body.innerHTML=`<div class="alert error">${escapeHtml(e.message||'Failed to load payment details.')}</div>`; }
}


function buildLoanListQuery({ page = 1, pageSize = 25 } = {}) {
  const params = new URLSearchParams();
  const q = loanFilters.q.trim();
  if (q) params.set('q', q);
  if (loanFilters.status) params.set('status', loanFilters.status);
  if (loanFilters.balanceStatus) params.set('balance_status', loanFilters.balanceStatus);
  if (loanFilters.dateFrom) params.set('date_from', loanFilters.dateFrom);
  if (loanFilters.dateTo) params.set('date_to', loanFilters.dateTo);
  if (loanFilters.principalMin !== '') params.set('principal_min', String(loanFilters.principalMin));
  if (loanFilters.principalMax !== '') params.set('principal_max', String(loanFilters.principalMax));
  params.set('sort_by', loanFilters.sortBy);
  params.set('sort_direction', loanFilters.sortDirection);
  params.set('page', String(page));
  params.set('page_size', String(pageSize));
  return params.toString();
}

function loanFiltersAreValid() {
  if (loanFilters.dateFrom && loanFilters.dateTo && loanFilters.dateFrom > loanFilters.dateTo) {
    setInlineAlert(adminLoansMessage, 'Date From cannot be later than Date To.', 'error');
    return false;
  }
  if (loanFilters.principalMin !== '' && loanFilters.principalMax !== '' && Number(loanFilters.principalMin) > Number(loanFilters.principalMax)) {
    setInlineAlert(adminLoansMessage, 'Principal Min cannot exceed Principal Max.', 'error');
    return false;
  }
  return true;
}

function normalizeLoanPagination(response, loanCount) {
  const pagination = response?.pagination || response?.data?.pagination || {};
  const total = Number(pagination.total ?? pagination.total_count ?? pagination.totalCount ?? response?.total ?? response?.data?.total);
  return { total: Number.isFinite(total) ? total : loanCount };
}

function renderAdminLoansTable(loans) {
  if (!adminLoansTableBody) return;
  if (!loans.length) {
    adminLoansTableBody.innerHTML = '<tr><td colspan="10" class="muted">No loans match the selected search and filters. <button type="button" class="secondary" data-admin-loans-empty-clear>Clear Filters</button></td></tr>';
    return;
  }
  adminLoansTableBody.innerHTML = '';
  loans.forEach((loan) => {
    const loanNumber = getLoanField(loan, ['loan_number', 'loanNumber', 'number', 'reference']);
    const principal = getLoanField(loan, ['principal_amount', 'principalAmount', 'principal', 'amount', 'approved_amount', 'approvedAmount'], 0);
    const totalPayable = getLoanField(loan, ['total_payable', 'totalPayable', 'payable_amount', 'payableAmount', 'total_amount', 'totalAmount'], 0);
    const totalPaid = getLoanField(loan, ['total_paid', 'totalPaid', 'paid_amount', 'paidAmount', 'amount_paid', 'amountPaid'], 0);
    const rawOutstanding = getLoanOutstanding(loan);
    const credit = getCustomerCreditAmount(loan);
    const settledDate = getSettlementDate(loan);
    const tr = document.createElement('tr');
    tr.innerHTML = `<td><strong>${escapeHtml(loanNumber)}</strong></td><td class="admin-loans-customer-col">${renderLoanCustomerCell(loan)}</td><td>${formatCurrency(principal)}</td><td>${formatCurrency(totalPayable)}</td><td>${formatCurrency(totalPaid)}</td><td>${formatCurrency(Math.max(0, rawOutstanding))}${rawOutstanding < 0 ? '<br><span class="badge badge-warning">Credit balance detected</span><br><span class="muted">Settlement reconciliation required</span>' : ''}</td><td>${credit > 0 ? formatCurrency(credit) : '<span class="muted">—</span>'}</td><td>${settledDate ? escapeHtml(formatDate(settledDate) || settledDate) : '<span class="muted">—</span>'}</td><td>${renderStatusBadge(getLoanStatus(loan))}</td><td><button type="button" class="secondary" data-admin-loan-view="${escapeHtml(getLoanId(loan))}">View</button></td>`;
    adminLoansTableBody.appendChild(tr);
  });
}

function renderAdminLoans() {
  if (!adminLoansInitialized) return;
  setInlineAlert(adminLoansMessage, adminLoansState.error || '', 'error');
  const isLoading = adminLoansState.loading;
  if (adminRefreshLoansBtn) { adminRefreshLoansBtn.disabled = isLoading; adminRefreshLoansBtn.textContent = isLoading ? 'Refreshing...' : 'Refresh'; }
  adminLoansControls?.querySelectorAll('button').forEach((button) => { button.disabled = isLoading; });
  adminLoansPagination?.querySelectorAll('button, select').forEach((control) => { control.disabled = isLoading; });
  if (adminLoansSummary) {
    const start = adminLoansState.total ? ((adminLoansState.page - 1) * adminLoansState.pageSize) + 1 : 0;
    const end = Math.min(adminLoansState.page * adminLoansState.pageSize, adminLoansState.total);
    const filtered = Boolean(loanFilters.q || loanFilters.status || loanFilters.balanceStatus || loanFilters.dateFrom || loanFilters.dateTo || loanFilters.principalMin !== '' || loanFilters.principalMax !== '');
    adminLoansSummary.textContent = `Showing ${start}–${end} of ${adminLoansState.total} ${filtered ? 'matching loans' : 'loans'}${isLoading ? ' · Loading loans...' : ''}`;
  }
  adminLoansSection?.querySelectorAll('[data-loan-sort]').forEach((button) => button.setAttribute('aria-sort', button.dataset.loanSort === loanFilters.sortBy ? (loanFilters.sortDirection === 'asc' ? 'ascending' : 'descending') : 'none'));
  const previous = adminLoansSection?.querySelector('#admin-loans-previous');
  const next = adminLoansSection?.querySelector('#admin-loans-next');
  const pageNumber = adminLoansSection?.querySelector('#admin-loans-page-number');
  if (previous) previous.disabled = isLoading || adminLoansState.page <= 1;
  if (next) next.disabled = isLoading || adminLoansState.page * adminLoansState.pageSize >= adminLoansState.total;
  if (pageNumber) pageNumber.textContent = `Page ${adminLoansState.page}`;
  if (!adminLoansState.error && !isLoading) renderAdminLoansTable(adminLoansState.loans);
}

async function loadAdminLoans(force = false) {
  ensureAdminLoansUI();
  if (!adminLoansSection || (!force && adminLoansState.hasLoaded)) { if (adminLoansState.hasLoaded) renderAdminLoans(); return; }
  if (!loanFiltersAreValid()) return;
  const { token } = getSession();
  if (!token) return;
  const requestSequence = ++adminLoansState.requestSequence;
  adminLoansState.loading = true;
  adminLoansState.error = null;
  renderAdminLoans();
  const queryString = buildLoanListQuery({ page: adminLoansState.page, pageSize: adminLoansState.pageSize });
  const path = `${endpoint('adminLoans')}?${queryString}`;
  console.log('Loan filters', loanFilters);
  console.log('Loan list request', path);
  try {
    const response = await api(path);
    if (requestSequence !== adminLoansState.requestSequence) return;
    const loans = normalizeLoansResponse(response);
    console.log('Loan list result count', loans.length);
    adminLoansState.loans = loans;
    adminLoansState.total = normalizeLoanPagination(response, loans.length).total;
    adminLoansState.hasLoaded = true;
  } catch (error) {
    if (requestSequence !== adminLoansState.requestSequence) return;
    console.error('Failed to load admin loans', error);
    const messages = { 401: 'Your session has expired. Please sign in again.', 404: 'Loan search endpoint is unavailable.', 500: 'Loans could not be loaded.' };
    adminLoansState.error = error?.status === 422 ? (error.message || 'Invalid loan search filters.') : (messages[error?.status] || 'Loans could not be loaded.');
    adminLoansState.hasLoaded = false;
  } finally {
    if (requestSequence === adminLoansState.requestSequence) { adminLoansState.loading = false; renderAdminLoans(); }
  }
}

function ensureAdminLoanApplicationsUI() {
  if (!adminLoanApplicationsSection || adminLoanApplicationsInitialized) return;
  adminLoanApplicationsInitialized = true;

  adminLoanApplicationsMessage = adminLoanApplicationsSection.querySelector(
    '#admin-loan-applications-message',
  );
  adminLoanApplicationsTableBody = adminLoanApplicationsSection.querySelector(
    '#loan-applications-body',
  );
  adminLoanApplicationsTable = adminLoanApplicationsSection.querySelector(
    '#admin-loan-applications-table',
  );
  adminRefreshLoanApplicationsBtn = adminLoanApplicationsSection.querySelector(
    '#admin-refresh-loan-applications',
  );
  adminLoanApplicationsStatusFilter = adminLoanApplicationsSection.querySelector(
    '#admin-loan-status-filter',
  );

  setInlineAlert(adminLoanApplicationsMessage, '');
  if (adminLoanApplicationsTableBody) adminLoanApplicationsTableBody.innerHTML = '';

  adminRefreshLoanApplicationsBtn?.addEventListener('click', () => loadAdminLoanApplicationsAll(true));

  adminLoanApplicationsStatusFilter?.addEventListener('change', (event) => {
    adminLoanApplicationsState.selectedStatus = event.target.value || 'ALL';
    loadAdminLoanApplicationsAll(true);
  });
}

function renderAdminLoanApplicationsTable(applications) {
  const tbody = document.getElementById('loan-applications-body');
  if (!tbody) return;

  tbody.innerHTML = '';

  if (!applications || !applications.length) {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td colspan="6" class="text-center text-muted">
        No loan applications found
      </td>
    `;
    tbody.appendChild(tr);
    return;
  }

  applications.forEach((app) => {
    const tr = document.createElement('tr');

    tr.classList.add('clickable-row');
    tr.addEventListener('click', () => openApplicationDetail(app, 'admin'));

    const applicationNumber =
      app.application_number ||
      app.applicationNumber ||
      app.applicationNo ||
      app.application_id ||
      app.id ||
      '-';
    const customerName =
      app.customer_name ||
      app.customerName ||
      app.customer ||
      app.applicant_name ||
      '-';
    const loanType = app.loan_type || app.loanType || app.loan_details?.loan_type || '-';
    const status = app.status || app.application_status || app.applicationStatus || '-';
    const appliedAmount =
      app.applied_amount ??
      app.appliedAmount ??
      app.requested_amount ??
      app.requestedAmount ??
      app.amount ??
      0;
    const submittedAt =
      app.submitted_at || app.submittedAt || app.created_at || app.createdAt || null;

    tr.innerHTML = `
      <td>${applicationNumber}</td>
      <td>${customerName}</td>
      <td>${loanType}</td>
      <td>${renderStatusBadge(status)}</td>
      <td>${formatCurrency(appliedAmount)}</td>
      <td>${formatDate(submittedAt) || '-'}</td>
    `;

    tbody.appendChild(tr);
  });
}

function renderAdminLoanApplications() {
  if (!adminLoanApplicationsInitialized) return;

  const { loanApplicationsError, loanApplications } = adminLoanApplicationsState;

  setInlineAlert(adminLoanApplicationsMessage, loanApplicationsError || '', 'error');

  if (loanApplicationsError) {
    if (adminLoanApplicationsTableBody) adminLoanApplicationsTableBody.innerHTML = '';
    return;
  }

  renderAdminLoanApplicationsTable(loanApplications);
}

function buildLoanApplicationsListPath(statusFilter = 'ALL') {
  // The admin list must target the backend JSON list endpoint directly. Do not
  // derive this from the current browser route because /admin/loan-applications/all
  // is a frontend document route. Keep the All view on the bare list endpoint so
  // DRAFT and SUBMITTED records are both returned and rendered together.
  if (statusFilter && statusFilter !== 'ALL') {
    const separator = adminLoanApplicationsListUrl.includes('?') ? '&' : '?';
    return `${adminLoanApplicationsListUrl}${separator}status=${encodeURIComponent(statusFilter)}`;
  }

  return adminLoanApplicationsListUrl;
}

async function fetchLoanApplicationsList(pathOrUrl) {
  const url = /^https?:\/\//i.test(pathOrUrl) ? pathOrUrl : `${apiConfig.baseUrl}${pathOrUrl}`;
  console.log('Loan applications list API URL', url);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      Accept: 'application/json',
      ...(getSession().token ? { Authorization: `Bearer ${getSession().token}` } : {}),
    },
  });

  const contentType = response.headers?.get?.('content-type') || '';
  if (!contentType.toLowerCase().includes('application/json')) {
    console.error('Loan applications list API returned non-JSON response', {
      url: response.url || url,
      status: response.status,
      contentType,
    });
    throw new Error('Loan applications API returned HTML or another non-JSON response. Check the list API URL.');
  }

  const data = await response.json();
  if (!response.ok) {
    const message = buildErrorMessage({ status: response.status, data, raw: '' });
    const error = new Error(message);
    error.status = response.status;
    throw error;
  }

  return data;
}

async function loadAdminLoanApplicationsAll(force = false) {
  ensureAdminLoanApplicationsUI();
  if (!adminLoanApplicationsSection || adminLoanApplicationsState.loanApplicationsLoading) return;

  const session = getSession();
  if (!session || !session.token) return;

  if (adminLoanApplicationsState.hasLoaded && !force) {
    renderAdminLoanApplications();
    return;
  }

  adminLoanApplicationsState.loanApplicationsLoading = true;
  adminLoanApplicationsState.loanApplicationsError = null;
  renderAdminLoanApplications();

  try {
    const statusFilter = (adminLoanApplicationsState.selectedStatus || 'ALL').toUpperCase();
    const path = buildLoanApplicationsListPath(statusFilter);
    console.log('Loading loan applications...');
    console.log('list API URL', /^https?:\/\//i.test(path) ? path : `${apiConfig.baseUrl}${path}`);
    const response = await fetchLoanApplicationsList(path);
    console.log('raw response', response);
    const normalizedApplications = normalizeApplicationsResponse(response);
    console.log('normalized applications array', normalizedApplications);
    const visibleApplications = statusFilter === 'ALL'
      ? normalizedApplications.filter((app) => {
          const normalizedStatus = String(app?.status || app?.application_status || app?.applicationStatus || '').toUpperCase();
          return !normalizedStatus || normalizedStatus === 'DRAFT' || normalizedStatus === 'SUBMITTED';
        })
      : normalizedApplications;
    const sortedApplications = [...visibleApplications].sort((a, b) => {
      const aDate = new Date(a.submitted_at || a.created_at || 0).getTime();
      const bDate = new Date(b.submitted_at || b.created_at || 0).getTime();
      return bDate - aDate;
    });

    adminLoanApplicationsState.loanApplications = sortedApplications;
    adminLoanApplicationsState.hasLoaded = true;
  } catch (error) {
    console.error('Failed to load admin loan applications', error);
    const friendlyError = /404/.test(error?.message || '') || /reach the server/i.test(error?.message || '')
      ? 'Unable to load loan applications. Please try again later.'
      : error?.message || "Couldn't load loan applications. Please try again.";
    adminLoanApplicationsState.loanApplicationsError = friendlyError;
    adminLoanApplicationsState.hasLoaded = false;
  } finally {
    adminLoanApplicationsState.loanApplicationsLoading = false;
    renderAdminLoanApplications();
  }
}

// Generic helper to extract a list of items from various API response shapes.
function resolveItemsList(payload, fallbackKey) {
  if (!payload || typeof payload !== 'object') {
    return [];
  }

  // If the payload itself is an array, just return it.
  if (Array.isArray(payload)) {
    return payload;
  }

  // Common pattern: { items: [...] }
  if (Array.isArray(payload.items)) {
    return payload.items;
  }

  // Fallback key, e.g. "customers", "leads", etc.
  if (fallbackKey && Array.isArray(payload[fallbackKey])) {
    return payload[fallbackKey];
  }

  // As a last resort, return the first array property we can find.
  for (const key in payload) {
    if (Object.prototype.hasOwnProperty.call(payload, key) && Array.isArray(payload[key])) {
      return payload[key];
    }
  }

  return [];
}

function normalizeCustomersResponse(response) {
  if (Array.isArray(response)) return response;

  const candidates = [
    response?.customers,
    response?.data?.customers,
    response?.results,
    response?.data?.results,
    resolveItemsList(response),
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function normalizeLeadsResponse(response) {
  if (Array.isArray(response)) return response;

  const candidates = [
    response?.leads,
    response?.data?.leads,
    response?.results,
    response?.data?.results,
    resolveItemsList(response),
  ];

  for (const candidate of candidates) {
    if (Array.isArray(candidate)) return candidate;
  }

  return [];
}

function formatLeadLoanType(value) {
  const key = (value || '').toUpperCase();
  return leadLoanTypeLabels[key] || (value ? String(value).replace(/_/g, ' ') : '—');
}

function formatLeadSource(value) {
  const key = (value || '').toUpperCase();
  return leadSourceLabels[key] || 'Other';
}

function renderLeadFormErrors(errors = {}) {
  const fields = { name: leadNameError, mobile: leadMobileError, loan_type_interest: leadLoanTypeError, source: leadSourceError };
  Object.entries(fields).forEach(([key, node]) => {
    if (!node) return;
    const message = errors[key] || '';
    node.textContent = message;
    node.classList.toggle('hidden', !message);
  });
}

function resetLeadForm() {
  adminLeadFormState.values = { name: '', mobile: '', loan_type_interest: '', source: 'OTHER', notes: '' };
  adminLeadFormState.errors = {};
  if (leadForm) leadForm.reset();
  if (leadSourceSelect) leadSourceSelect.value = 'OTHER';
  renderLeadFormErrors({});
  setInlineAlert(leadFormMessage, '');
  if (leadFormSubmit) {
    leadFormSubmit.disabled = false;
    leadFormSubmit.textContent = 'Save lead';
  }
}

function closeLeadModal(targetPath = leadsRouteBase) {
  adminLeadsState.showNewLeadForm = false;
  if (leadModal) leadModal.classList.add('hidden');
  adminLeadFormState.submitting = false;
  resetLeadForm();
  if (window.location.pathname.startsWith(leadsRouteBase)) navigateLeadsRoute(targetPath);
  else renderAdminLeads();
}

function openLeadModal() {
  navigateLeadsRoute(`${leadsRouteBase}/new`);
}

function validateLeadForm(values) {
  const errors = {};
  if (!values.mobile || !values.mobile.trim()) {
    errors.mobile = 'Mobile number is required.';
  }
  return errors;
}

function buildLeadModal(host) {
  if (leadModal) return;

  const targetHost = host || leadsRouteContent || adminLeadsSection;
  if (!targetHost) return;

  leadModal = document.createElement('div');
  leadModal.id = 'lead-modal';
  leadModal.className = 'subcard hidden';
  leadModal.innerHTML = `
    <div class="card-header">
      <div>
        <div class="eyebrow">Leads</div>
        <h3>Create new lead</h3>
        <p class="muted">Capture a prospect’s basic details so you can follow up and convert them into a customer.</p>
      </div>
    </div>
    <form id="lead-form" class="form-grid">
      <label class="form-field">
        <span>Full name <span class="muted">(optional)</span></span>
        <input id="lead-name" name="name" type="text" placeholder="Enter full name" />
        <small class="error-text hidden" data-error="name" style="color:#b91c1c;font-weight:600;"></small>
      </label>
      <label class="form-field">
        <span>Mobile number <span class="muted">(required)</span></span>
        <input id="lead-mobile" name="mobile" type="text" required placeholder="e.g. 024XXXXXXX" />
        <small class="error-text hidden" data-error="mobile" style="color:#b91c1c;font-weight:600;"></small>
      </label>
      <label class="form-field">
        <span>Loan type</span>
        <select id="lead-loan-type" name="loan_type_interest">
          <option value="">Select loan type</option>
          ${Object.entries(leadLoanTypeLabels)
            .map(([value, label]) => `<option value="${value}">${label}</option>`)
            .join('')}
        </select>
        <small class="error-text hidden" data-error="loan_type_interest" style="color:#b91c1c;font-weight:600;"></small>
      </label>
      <label class="form-field">
        <span>Source</span>
        <select id="lead-source" name="source">
          ${Object.entries(leadSourceLabels)
            .map(([value, label]) => `<option value="${value}">${label}</option>`)
            .join('')}
        </select>
        <small class="error-text hidden" data-error="source" style="color:#b91c1c;font-weight:600;"></small>
      </label>
      <div class="form-footer full-width">
        <p id="lead-form-message" class="alert hidden"></p>
        <div class="actions">
          <button type="button" class="ghost" data-action="close-lead-modal">Cancel</button>
          <button type="submit" class="primary" id="lead-submit">Save lead</button>
        </div>
      </div>
    </form>
  `;

  targetHost.appendChild(leadModal);

  leadForm = leadModal.querySelector('#lead-form');
  leadFormMessage = leadModal.querySelector('#lead-form-message');
  leadFormSubmit = leadModal.querySelector('#lead-submit');
  leadNameInput = leadModal.querySelector('#lead-name');
  leadMobileInput = leadModal.querySelector('#lead-mobile');
  leadLoanTypeSelect = leadModal.querySelector('#lead-loan-type');
  leadSourceSelect = leadModal.querySelector('#lead-source');
  leadNotesInput = leadModal.querySelector('#lead-notes');
  leadNameError = leadModal.querySelector('[data-error="name"]');
  leadMobileError = leadModal.querySelector('[data-error="mobile"]');
  leadLoanTypeError = leadModal.querySelector('[data-error="loan_type_interest"]');
  leadSourceError = leadModal.querySelector('[data-error="source"]');

  leadSourceSelect.value = 'OTHER';

  leadModal.querySelectorAll('[data-action="close-lead-modal"]').forEach((btn) => {
    btn.addEventListener('click', closeLeadModal);
  });

  if (leadForm) leadForm.addEventListener('submit', handleLeadFormSubmit);
}

function ensureAdminLeadsUI() {
  if (!adminLeadsSection || adminLeadsInitialized) return;

  const header = adminLeadsSection.querySelector('.card-header');
  if (header) {
    const eyebrow = header.querySelector('.eyebrow');
    if (eyebrow) eyebrow.textContent = 'Prospects';
    const title = header.querySelector('h2');
    if (title) title.textContent = 'Leads';
    const subtitle = header.querySelector('p');
    if (subtitle) subtitle.textContent = 'Review inbound leads and convert them into customers.';
    header.querySelector('.header-actions')?.remove();
    header.querySelector('#refresh-leads-btn')?.remove();
  }

  leadsListCard = adminLeadsSection.querySelector('.subcard');
  if (leadsListCard) {
    leadsListCard.classList.add('hidden');
    leadsListCard.remove();
  }

  leadsCardsGrid = document.createElement('div');
  leadsCardsGrid.className = 'subcard-grid';
  const leadCards = [
    {
      path: '/admin/leads/all',
      title: 'All leads',
      description: 'View and manage all inbound leads.',
      buttonLabel: 'Open',
    },
    {
      path: '/admin/leads/new',
      title: 'Create lead',
      description: 'Add a new prospect to the leads pipeline.',
      buttonLabel: 'New lead',
    },
  ];

  leadCards.forEach(({ path, title, description, buttonLabel }) => {
    const card = document.createElement('div');
    card.className = 'subcard';
    card.dataset.leadRoute = path;
    card.innerHTML = `
      <div class="card-header">
        <div>
          <h3>${title}</h3>
          <p class="muted">${description}</p>
        </div>
      </div>
      <div class="action-row">
        <button class="primary" type="button">${buttonLabel}</button>
      </div>
    `;
    leadsCardsGrid.appendChild(card);
  });

  adminLeadsSection.appendChild(leadsCardsGrid);

  leadsRoutePlaceholder = document.createElement('div');
  leadsRoutePlaceholder.id = 'leads-route-placeholder';
  leadsRoutePlaceholder.className = 'subcard hidden';
  leadsRoutePlaceholder.innerHTML = `
    <div class="card-header">
      <div>
        <div class="eyebrow">Leads</div>
        <h3 id="leads-route-title"></h3>
        <p class="muted" id="leads-route-description"></p>
      </div>
    </div>
    <div class="action-row">
      <button id="leads-route-back" class="ghost" type="button">Back to Leads</button>
    </div>
  `;

  leadsRouteContent = document.createElement('div');
  leadsRouteContent.id = 'leads-route-content';
  leadsRoutePlaceholder.appendChild(leadsRouteContent);

  leadsRouteTitle = leadsRoutePlaceholder.querySelector('#leads-route-title');
  leadsRouteDescription = leadsRoutePlaceholder.querySelector('#leads-route-description');
  leadsRouteBack = leadsRoutePlaceholder.querySelector('#leads-route-back');

  if (leadsListCard) {
    leadsRouteContent.appendChild(leadsListCard);
  }

  adminLeadsSection.appendChild(leadsRoutePlaceholder);

  const leadsHeaderRow =
    leadsListCard?.querySelector('#admin-leads-table thead tr') ||
    document.querySelector('#admin-leads-table thead tr');
  if (leadsHeaderRow) {
    leadsHeaderRow.innerHTML = `
      <th>ID</th>
      <th>Name</th>
      <th>Mobile</th>
      <th>Loan Type</th>
      <th>Source</th>
      <th>Status</th>
      <th>Created at</th>
      <th>Actions</th>
    `;
  }

  adminLeadsInitialized = true;
}

function renderLeadsListPage(root) {
  if (!root) return;
  ensureAdminLeadsUI();

  adminLeadsState.showNewLeadForm = false;
  if (leadModal) leadModal.classList.add('hidden');

  if (leadsListCard) {
    leadsListCard.classList.remove('hidden');
    if (leadsListCard.parentElement !== root) root.appendChild(leadsListCard);

    let actions = leadsListCard.querySelector('.table-actions');
    if (!actions) {
      actions = document.createElement('div');
      actions.className = 'table-actions';
      const spacer = document.createElement('div');
      const buttons = document.createElement('div');
      buttons.className = 'actions';
      actions.appendChild(spacer);
      actions.appendChild(buttons);
      leadsListCard.prepend(actions);
    }

    const buttons = actions.querySelector('.actions') || actions;
    if (refreshLeadsBtn) {
      refreshLeadsBtn.classList.add('ghost');
      if (!buttons.contains(refreshLeadsBtn)) buttons.appendChild(refreshLeadsBtn);
    }

    if (!newLeadBtn) {
      newLeadBtn = document.createElement('button');
      newLeadBtn.type = 'button';
      newLeadBtn.className = 'primary';
      newLeadBtn.id = 'new-lead-btn';
      newLeadBtn.textContent = 'New lead';
    }

    newLeadBtn.onclick = () => navigateLeadsRoute(`${leadsRouteBase}/new`);
    if (!buttons.contains(newLeadBtn)) buttons.appendChild(newLeadBtn);
  }

  renderAdminLeads();
  if (!adminLeadsState.hasLoaded && !adminLeadsState.loading) loadAdminLeads();
}

function renderLeadCreatePage(root) {
  if (!root) return;
  ensureAdminLeadsUI();
  adminLeadsState.showNewLeadForm = true;
  if (leadsListCard) leadsListCard.classList.add('hidden');
  buildLeadModal(root);
  if (leadModal) {
    if (leadModal.parentElement !== root) root.appendChild(leadModal);
    leadModal.classList.remove('hidden');
  }
  resetLeadForm();
  renderAdminLeads();
}

function clearLeadsRouteView() {
  if (!leadsRoutePlaceholder) return;
  leadsRoutePlaceholder.classList.add('hidden');
  leadsCardsGrid?.classList.remove('hidden');
  if (leadsRouteTitle) leadsRouteTitle.textContent = '';
  if (leadsRouteDescription) leadsRouteDescription.textContent = '';
  if (leadModal) leadModal.classList.add('hidden');
  adminLeadsState.showNewLeadForm = false;
}

function renderLeadsRoute(path) {
  if (!leadsRoutePlaceholder || !leadsRoutes[path]) return;
  showAdminSection('leads');

  leadsCardsGrid?.classList.add('hidden');
  leadsRoutePlaceholder.classList.remove('hidden');

  if (leadsRouteTitle) leadsRouteTitle.textContent = leadsRoutes[path].title;
  if (leadsRouteDescription) leadsRouteDescription.textContent = leadsRoutes[path].description;

  const content = leadsRouteContent || (() => {
    const node = document.createElement('div');
    node.id = 'leads-route-content';
    leadsRoutePlaceholder.appendChild(node);
    return node;
  })();

  content.innerHTML = '';

  if (path === `${leadsRouteBase}/all`) {
    renderLeadsListPage(content);
  } else if (path === `${leadsRouteBase}/new`) {
    renderLeadCreatePage(content);
  }
}

function handleLeadsRoute(path = leadsRouteBase, { pushState = false } = {}) {
  if (!path.startsWith(leadsRouteBase)) return false;
  ensureAdminLeadsUI();
  const normalizedPath = path.endsWith('/') && path !== leadsRouteBase ? path.slice(0, -1) : path;

  if (pushState && window.location.pathname !== normalizedPath) {
    history.pushState({ leadsRoute: normalizedPath }, '', normalizedPath);
  }

  if (normalizedPath === leadsRouteBase) {
    clearLeadsRouteView();
    showAdminSection('leads');
    return true;
  }

  if (!leadsRoutes[normalizedPath]) return false;
  renderLeadsRoute(normalizedPath);
  return true;
}

function navigateLeadsRoute(path) {
  handleLeadsRoute(path, { pushState: true });
}

async function handleLeadFormSubmit(event) {
  event.preventDefault();
  if (adminLeadFormState.submitting) return;

  const values = {
    name: leadNameInput?.value || '',
    mobile: leadMobileInput?.value || '',
    loan_type_interest: leadLoanTypeSelect?.value || '',
    source: leadSourceSelect?.value || 'OTHER',
    notes: leadNotesInput?.value || '',
  };

  const errors = validateLeadForm(values);
  adminLeadFormState.errors = errors;
  renderLeadFormErrors(errors);

  if (Object.keys(errors).length) return;

  adminLeadFormState.submitting = true;
  setInlineAlert(leadFormMessage, 'Saving lead...', 'success');
  if (leadFormSubmit) {
    leadFormSubmit.disabled = true;
    leadFormSubmit.textContent = 'Saving...';
  }

  const payload = {
    name: values.name?.trim() || null,
    mobile: values.mobile.trim(),
    loan_type_interest: values.loan_type_interest || null,
    source: values.source || 'OTHER',
  };

  try {
    const path = endpoint('leads') || '/leads';
    await api(path, { method: 'POST', body: payload });
    closeLeadModal(`${leadsRouteBase}/all`);
    setInlineAlert(adminLeadsMessage, 'Lead created successfully.', 'success');
    setTimeout(() => setInlineAlert(adminLeadsMessage, ''), 3000);
    await loadAdminLeads(true);
  } catch (error) {
    console.error('Failed to create lead', error);
    setInlineAlert(leadFormMessage, 'Failed to create lead. Please try again.', 'error');
    setInlineAlert(adminLeadsMessage, 'Failed to create lead. Please try again.', 'error');
  } finally {
    adminLeadFormState.submitting = false;
    if (leadFormSubmit) {
      leadFormSubmit.disabled = false;
      leadFormSubmit.textContent = 'Save lead';
    }
  }
}

function renderAdminLeads() {
  const { leads, loading, error, hasLoaded, showNewLeadForm } = adminLeadsState;

  ensureAdminLeadsUI();

  setInlineAlert(adminLeadsMessage, error || '', 'error');

  adminLeadsLoading?.classList.toggle('hidden', !loading);
  if (leadModal) leadModal.classList.toggle('hidden', !showNewLeadForm);

  if (loading) {
    adminLeadsTableWrapper?.classList.add('hidden');
    adminLeadsEmptyState?.classList.add('hidden');
    if (adminLeadsTableBody) adminLeadsTableBody.innerHTML = '';
    return;
  }

  if (error) {
    adminLeadsTableWrapper?.classList.add('hidden');
    adminLeadsEmptyState?.classList.add('hidden');
    if (adminLeadsTableBody) adminLeadsTableBody.innerHTML = '';
    return;
  }

  const hasLeads = leads.length > 0;
  adminLeadsTableWrapper?.classList.toggle('hidden', !hasLeads);
  adminLeadsEmptyState?.classList.toggle('hidden', hasLeads || !hasLoaded || showNewLeadForm);

  if (!hasLeads) {
    if (adminLeadsTableBody) adminLeadsTableBody.innerHTML = '';
    return;
  }

  if (!adminLeadsTableBody) return;
  adminLeadsTableBody.innerHTML = '';

  leads.forEach((lead) => {
    const row = document.createElement('tr');
    const leadId = lead.id ?? lead.lead_id ?? lead.leadId ?? '—';
    const name =
      lead.name ||
      lead.full_name ||
      [lead.first_name, lead.last_name].filter(Boolean).join(' ') ||
      '—';
    const mobile = lead.mobile || lead.mobile_number || lead.phone || lead.contact || '—';
    const loanInterestValue =
      lead.loan_type_interest || lead.loanTypeInterest || lead.loan_type || lead.interested_loan_type || '';
    const loanInterest = formatLeadLoanType(loanInterestValue);
    const sourceValue = lead.source || lead.channel || lead.acquisition_source || '';
    const source = formatLeadSource(sourceValue);
    const status = lead.status || lead.lead_status || '—';
    const statusBadge = status ? renderStatusBadge(status) : '—';
    const customerId = lead.customer_id || lead.customerId || lead.customer_code;
    const isConverted = (status || '').toUpperCase() === 'CONVERTED';
    const createdAt =
      lead.created_at || lead.createdAt || lead.created || lead.created_on || lead.createdOn || lead.date_created;
    const createdAtLabel = formatDateTime(createdAt) || '—';

    row.innerHTML = `
      <td>${leadId}</td>
      <td>${name}</td>
      <td>${mobile}</td>
      <td>${loanInterest}</td>
      <td>${source}</td>
      <td>${statusBadge}</td>
      <td>${createdAtLabel}</td>
    `;

    const actionsCell = document.createElement('td');
    const actionContainer = document.createElement('div');
    actionContainer.className = 'table-actions';

    if (!isConverted && leadId !== '—') {
      const convertBtn = document.createElement('button');
      convertBtn.type = 'button';
      convertBtn.className = 'ghost';
      convertBtn.dataset.action = 'convert-lead';
      convertBtn.dataset.leadId = leadId;
      convertBtn.textContent = 'Convert to Customer';
      actionContainer.appendChild(convertBtn);
    }

    if (isConverted) {
      const convertedLabel = document.createElement('span');
      convertedLabel.className = 'badge badge-success';
      convertedLabel.textContent = 'Converted';
      actionContainer.appendChild(convertedLabel);
    }

    if (isConverted && customerId) {
      const openCustomerBtn = document.createElement('button');
      openCustomerBtn.type = 'button';
      openCustomerBtn.className = 'ghost';
      openCustomerBtn.dataset.action = 'open-customer-from-lead';
      openCustomerBtn.dataset.customerId = customerId;
      openCustomerBtn.textContent = 'Open customer';
      actionContainer.appendChild(openCustomerBtn);
    }

    if (!actionContainer.children.length) {
      actionContainer.textContent = '—';
    }

    actionsCell.appendChild(actionContainer);
    row.appendChild(actionsCell);

    adminLeadsTableBody.appendChild(row);
  });
}

function ensureAdminCustomersTableHeaders() {
  if (!adminCustomersTable) return;
  const headerRow = adminCustomersTable.querySelector('thead tr');
  if (!headerRow) return;

  headerRow.innerHTML = [
    'Customer Code',
    'Name',
    'NIC',
    'Mobile',
    'Address',
    'Business Type',
    'Lead Status',
    'KYC Status',
    'Eligibility',
    'Created',
    'Actions',
  ]
    .map((label) => `<th>${label}</th>`)
    .join('');
}

function ensureAdminCustomersFilters() {
  if (!adminCustomersFilters) return;

  const currentKyc = adminCustomersState.filters.kyc || 'ALL';
  const currentEligibility = adminCustomersState.filters.eligibility || 'ALL';

  if (adminCustomersFiltersInitialized) {
    const kycFilter = adminCustomersFilters.querySelector('[data-filter="kyc"]');
    const eligibilityFilter = adminCustomersFilters.querySelector('[data-filter="eligibility"]');
    if (kycFilter) kycFilter.value = currentKyc;
    if (eligibilityFilter) eligibilityFilter.value = currentEligibility;
    return;
  }

  adminCustomersFilters.innerHTML = '';

  const kycWrapper = document.createElement('label');
  kycWrapper.className = 'filter';
  kycWrapper.textContent = 'KYC status';
  const kycSelect = document.createElement('select');
  kycSelect.dataset.filter = 'kyc';
  customerKycStatuses.forEach((status) => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status === 'ALL' ? 'All KYC statuses' : status.replace(/_/g, ' ');
    kycSelect.appendChild(option);
  });
  kycSelect.value = currentKyc;
  kycSelect.addEventListener('change', (event) => {
    adminCustomersState.filters.kyc = (event.target.value || 'ALL').toUpperCase();
    loadAdminCustomers(true);
  });
  kycWrapper.appendChild(kycSelect);

  const eligibilityWrapper = document.createElement('label');
  eligibilityWrapper.className = 'filter';
  eligibilityWrapper.textContent = 'Eligibility';
  const eligibilitySelect = document.createElement('select');
  eligibilitySelect.dataset.filter = 'eligibility';
  customerEligibilityStatuses.forEach((status) => {
    const option = document.createElement('option');
    option.value = status;
    option.textContent = status === 'ALL' ? 'All eligibility statuses' : status.replace(/_/g, ' ');
    eligibilitySelect.appendChild(option);
  });
  eligibilitySelect.value = currentEligibility;
  eligibilitySelect.addEventListener('change', (event) => {
    adminCustomersState.filters.eligibility = (event.target.value || 'ALL').toUpperCase();
    loadAdminCustomers(true);
  });
  eligibilityWrapper.appendChild(eligibilitySelect);

  adminCustomersFilters.appendChild(kycWrapper);
  adminCustomersFilters.appendChild(eligibilityWrapper);

  adminCustomersFiltersInitialized = true;
}

function normalizeCustomerStatus(status) {
  return (status || '').toString().trim().toUpperCase();
}

function renderCustomerStatusBadge(status) {
  if (!status) return '—';
  return renderStatusBadge(status);
}

function getCustomerId(customer = {}) {
  return customer.id || customer.customer_id || customer.customerId || customer.customer_code || customer.customerCode;
}

function formatCustomerFieldLabel(key = '') {
  return key
    .toString()
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[_\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function formatCustomerFieldValue(value) {
  if (value === null || value === undefined || value === '') return '—';

  if (typeof value === 'object') {
    try {
      return JSON.stringify(value, null, 2);
    } catch (_) {
      return String(value);
    }
  }

  return String(value);
}

function createCustomerDetailRow(label, value, { isHtml = false, asCode = false } = {}) {
  const row = document.createElement('div');
  row.className = 'detail-row';

  const labelNode = document.createElement('p');
  labelNode.className = 'muted';
  labelNode.textContent = label;

  const valueNode = asCode ? document.createElement('pre') : document.createElement('div');
  valueNode.className = 'detail-value';

  if (isHtml) {
    valueNode.innerHTML = value || '—';
  } else {
    valueNode.textContent = value || '—';
  }

  row.appendChild(labelNode);
  row.appendChild(valueNode);
  return row;
}

function setActiveCustomerId(customerId) {
  activeCustomerId = customerId || null;
  if (loanApplicationForm) loanApplicationForm.dataset.customerId = activeCustomerId || '';
  if (newApplicationBtn) newApplicationBtn.dataset.customerId = activeCustomerId || '';
}

function resolveActiveCustomerId() {
  return (
    loanApplicationForm?.dataset.customerId ||
    newApplicationBtn?.dataset.customerId ||
    activeCustomerId ||
    getCustomerId(cachedCustomerRecord || {}) ||
    getCustomerId(cachedProfile || {}) ||
    null
  );
}

function createCustomerActionButton(label, action, customerId) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'ghost';
  button.dataset.customerAction = action;
  button.dataset.customerId = customerId;
  button.textContent = label;
  return button;
}

function renderCustomerActions(customer, kycStatus, eligibilityStatus) {
  const customerId = getCustomerId(customer);
  const actionsCell = document.createElement('td');
  const actionContainer = document.createElement('div');
  actionContainer.className = 'table-actions';

  if (!customerId) {
    actionContainer.textContent = '—';
    actionsCell.appendChild(actionContainer);
    return actionsCell;
  }

  const viewButton = document.createElement('button');
  viewButton.type = 'button';
  viewButton.className = 'primary small';
  viewButton.dataset.customerDetailRoute = `/admin/customers/${customerId}`;
  viewButton.textContent = 'View';
  actionContainer.appendChild(viewButton);

  const kycNormalized = normalizeCustomerStatus(kycStatus);
  const eligibilityNormalized = normalizeCustomerStatus(eligibilityStatus);

  if (kycNormalized === 'PENDING' || kycNormalized === 'UPLOADED') {
    actionContainer.appendChild(createCustomerActionButton('Mark Under Review', 'kyc-under-review', customerId));
  }

  if (kycNormalized === 'UNDER_REVIEW') {
    actionContainer.appendChild(createCustomerActionButton('Approve KYC', 'kyc-approve', customerId));
    actionContainer.appendChild(createCustomerActionButton('Reject KYC', 'kyc-reject', customerId));
  }

  if (kycNormalized === 'APPROVED' && eligibilityNormalized !== 'ELIGIBLE') {
    actionContainer.appendChild(createCustomerActionButton('Mark Eligible', 'mark-eligible', customerId));
  }

  actionContainer.appendChild(createCustomerActionButton('Mark Not Eligible', 'mark-not-eligible', customerId));

  if (!actionContainer.children.length) {
    actionContainer.textContent = '—';
  }

  actionsCell.appendChild(actionContainer);
  return actionsCell;
}

async function handleCustomerAction(action, customerId, trigger) {
  if (!action || !customerId) return;

  const button = trigger?.closest('button');
  const originalText = button?.textContent;
  if (button) {
    button.disabled = true;
    button.textContent = 'Working...';
  }

  const path = (() => {
    const basePath = `/customers/${encodeURIComponent(customerId)}`;
    switch (action) {
      case 'kyc-under-review':
        return `${basePath}/kyc-under-review`;
      case 'kyc-approve':
        return `${basePath}/kyc-approve`;
      case 'kyc-reject':
        return `${basePath}/kyc-reject`;
      case 'mark-eligible':
        return `${basePath}/mark-eligible`;
      case 'mark-not-eligible':
        return `${basePath}/mark-not-eligible`;
      default:
        return '';
    }
  })();

  if (!path) {
    if (button) {
      button.disabled = false;
      button.textContent = originalText || 'Submit';
    }
    return;
  }

  try {
    await api(path, { method: 'POST' });
    setInlineAlert(adminCustomersMessage, 'Customer status updated successfully.', 'success');
    setInlineAlert(adminKycQueueMessage, 'Customer status updated successfully.', 'success');
    setTimeout(() => {
      setInlineAlert(adminCustomersMessage, '');
      setInlineAlert(adminKycQueueMessage, '');
    }, 3000);
    await Promise.all([loadAdminCustomers(true), loadAdminKycQueue(true)]);
  } catch (error) {
    console.error('Failed to update customer status', error);
    setInlineAlert(
      adminCustomersMessage,
      error?.message || 'Unable to update customer status. Please try again.',
      'error',
    );
    setInlineAlert(
      adminKycQueueMessage,
      error?.message || 'Unable to update customer status. Please try again.',
      'error',
    );
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText || 'Submit';
    }
  }
}

async function loadAdminLeads(force = false) {
  ensureAdminLeadsUI();
  if (adminLeadsState.loading) return;
  if (adminLeadsState.hasLoaded && !force) {
    renderAdminLeads();
    return;
  }

  adminLeadsState.loading = true;
  adminLeadsState.error = null;
  renderAdminLeads();

  try {
    const path = endpoint('leads') || '/leads';
    const response = await api.get(path);
    adminLeadsState.leads = normalizeLeadsResponse(response);
    adminLeadsState.hasLoaded = true;
  } catch (error) {
    console.error('Failed to load leads', error);
    const friendlyError = /404/.test(error?.message || '') || /reach the server/i.test(error?.message || '')
      ? 'Unable to load leads. Please try again later.'
      : error?.message || "Couldn't load leads. Please try again.";
    adminLeadsState.error = friendlyError;
    adminLeadsState.hasLoaded = false;
  } finally {
    adminLeadsState.loading = false;
    renderAdminLeads();
  }
}

async function convertLeadToCustomer(leadId, trigger) {
  if (!leadId) return;
  const confirmed = window.confirm(
    'Convert lead to customer?\n\nThis will create a customer profile from this lead and mark the lead as converted.',
  );
  if (!confirmed) return;
  const pathTemplate = endpoint('leadConvert') || '/leads/{id}/convert-to-customer';
  const path = pathTemplate.replace('{id}', encodeURIComponent(leadId));

  const button = trigger?.closest('button');
  const originalText = button?.textContent;
  if (button) {
    button.disabled = true;
    button.textContent = 'Converting...';
  }

  try {
    await api(path, { method: 'POST' });
    setInlineAlert(adminLeadsMessage, 'Lead converted to customer.', 'success');
    setTimeout(() => setInlineAlert(adminLeadsMessage, ''), 3000);
    await loadAdminLeads(true);
    loadAdminCustomers(true);
  } catch (error) {
    console.error('Failed to convert lead', error);
    setInlineAlert(adminLeadsMessage, error?.message || 'Failed to convert lead.', 'error');
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText || 'Convert to Customer';
    }
  }
}

function renderAdminCustomers() {
  const { customers, loading, error, hasLoaded } = adminCustomersState;

  ensureAdminCustomersTableHeaders();
  ensureAdminCustomersFilters();

  setInlineAlert(adminCustomersMessage, error || '', 'error');

  adminCustomersLoading?.classList.toggle('hidden', !loading);

  if (loading) {
    adminCustomersTableWrapper?.classList.add('hidden');
    adminCustomersEmptyState?.classList.add('hidden');
    if (adminCustomersTableBody) adminCustomersTableBody.innerHTML = '';
    return;
  }

  if (error) {
    adminCustomersTableWrapper?.classList.add('hidden');
    adminCustomersEmptyState?.classList.add('hidden');
    if (adminCustomersTableBody) adminCustomersTableBody.innerHTML = '';
    return;
  }

  const hasCustomers = customers.length > 0;
  adminCustomersTableWrapper?.classList.toggle('hidden', !hasCustomers);
  adminCustomersEmptyState?.classList.toggle('hidden', hasCustomers || !hasLoaded);

  if (!hasCustomers) {
    if (adminCustomersTableBody) adminCustomersTableBody.innerHTML = '';
    return;
  }

  if (!adminCustomersTableBody) return;
  adminCustomersTableBody.innerHTML = '';

  customers.forEach((customer) => {
    const row = document.createElement('tr');
    const name =
      customer.full_name ||
      customer.fullName ||
      customer.name ||
      [customer.first_name, customer.last_name].filter(Boolean).join(' ') ||
      '—';
    const mobile = customer.mobile || customer.mobile_number || customer.phone || customer.contact || '—';
    const nic = customer.nic_number || customer.nic || customer.nicNumber || customer.nic_no || '—';
    const address = customer.address || customer.address_line || customer.addressLine || customer.location || '—';
    const businessType = customer.business_type || customer.businessType || customer.segment || '—';
    const leadStatus = customer.lead_status || customer.leadStatus || customer.status || customer.customer_status;
    const kycStatus = customer.kyc_status || customer.kycStatus || customer.status;
    const eligibilityStatus = customer.eligibility_status || customer.eligibilityStatus;
    const createdAt = formatDate(customer.created_at || customer.createdAt || customer.created_at_utc) || '—';
    const code = customer.customer_code || customer.customerCode || customer.code || customer.id || '—';

    row.innerHTML = `
      <td>${code}</td>
      <td>${name}</td>
      <td>${nic}</td>
      <td>${mobile}</td>
      <td>${address}</td>
      <td>${businessType}</td>
      <td>${renderCustomerStatusBadge(leadStatus)}</td>
      <td>${renderCustomerStatusBadge(kycStatus)}</td>
      <td>${renderCustomerStatusBadge(eligibilityStatus)}</td>
      <td>${createdAt}</td>
    `;

    const actionsCell = renderCustomerActions(customer, kycStatus, eligibilityStatus);
    row.appendChild(actionsCell);

    adminCustomersTableBody.appendChild(row);
  });
}

async function loadAdminCustomers(force = false) {
  if (adminCustomersState.loading) return;
  if (adminCustomersState.hasLoaded && !force) {
    renderAdminCustomers();
    return;
  }

  adminCustomersState.loading = true;
  adminCustomersState.error = null;
  renderAdminCustomers();

  try {
    const basePath = endpoint('customers') || '/customers';
    const query = new URLSearchParams();
    const kycFilter = adminCustomersState.filters.kyc || 'ALL';
    const eligibilityFilter = adminCustomersState.filters.eligibility || 'ALL';
    if (kycFilter && kycFilter !== 'ALL') query.append('kyc_status', kycFilter);
    if (eligibilityFilter && eligibilityFilter !== 'ALL') query.append('eligibility_status', eligibilityFilter);
    const path = query.toString() ? `${basePath}?${query.toString()}` : basePath;

    const response = await api.get(path);
    const customers = normalizeCustomersResponse(response);
    adminCustomersState.customers = customers;
    adminCustomersState.hasLoaded = true;
  } catch (error) {
    console.error('Failed to load admin customers', error);
    const friendlyError = /404/.test(error?.message || '') || /reach the server/i.test(error?.message || '')
      ? 'Unable to load customers. Please try again later.'
      : error?.message || "Couldn't load customers. Please try again.";
    adminCustomersState.error = friendlyError;
    adminCustomersState.hasLoaded = false;
  } finally {
    adminCustomersState.loading = false;
    renderAdminCustomers();
  }
}

function renderAdminKycQueue() {
  const { customers, loading, error, hasLoaded } = adminKycQueueState;

  setInlineAlert(adminKycQueueMessage, error || '', 'error');

  adminKycQueueLoading?.classList.toggle('hidden', !loading);

  if (loading) {
    adminKycQueueTableWrapper?.classList.add('hidden');
    adminKycQueueEmptyState?.classList.add('hidden');
    if (adminKycQueueTableBody) adminKycQueueTableBody.innerHTML = '';
    return;
  }

  if (error) {
    adminKycQueueTableWrapper?.classList.add('hidden');
    adminKycQueueEmptyState?.classList.add('hidden');
    if (adminKycQueueTableBody) adminKycQueueTableBody.innerHTML = '';
    return;
  }

  const hasCustomers = customers.length > 0;
  adminKycQueueTableWrapper?.classList.toggle('hidden', !hasCustomers);
  adminKycQueueEmptyState?.classList.toggle('hidden', hasCustomers || !hasLoaded);

  if (!adminKycQueueTableBody) return;
  adminKycQueueTableBody.innerHTML = '';

  customers.forEach((customer) => {
    const row = document.createElement('tr');
    const name =
      customer.full_name ||
      customer.fullName ||
      customer.name ||
      [customer.first_name, customer.last_name].filter(Boolean).join(' ') ||
      '—';
    const mobile = customer.mobile || customer.mobile_number || customer.phone || customer.contact || '—';
    const kycStatus = customer.kyc_status || customer.kycStatus || customer.status;
    const eligibilityStatus = customer.eligibility_status || customer.eligibilityStatus;
    const code =
      customer.customer_code ||
      customer.customerCode ||
      customer.code ||
      customer.id ||
      customer.customer_id ||
      customer.customerId ||
      '—';

    row.innerHTML = `
      <td>${code}</td>
      <td>${name}</td>
      <td>${mobile}</td>
      <td>${renderCustomerStatusBadge(kycStatus)}</td>
      <td>${renderCustomerStatusBadge(eligibilityStatus)}</td>
    `;

    const actionsCell = renderCustomerActions(customer, kycStatus, eligibilityStatus);
    row.appendChild(actionsCell);

    adminKycQueueTableBody.appendChild(row);
  });
}

async function loadAdminKycQueue(force = false) {
  if (adminKycQueueState.loading) return;
  if (adminKycQueueState.hasLoaded && !force) {
    renderAdminKycQueue();
    return;
  }

  adminKycQueueState.loading = true;
  adminKycQueueState.error = null;
  renderAdminKycQueue();

  try {
    const basePath = endpoint('customers') || '/customers';
    const query = new URLSearchParams();
    kycQueueStatuses.forEach((status) => query.append('kyc_status', status));
    const separator = basePath.includes('?') ? '&' : '?';
    const path = `${basePath}${separator}${query.toString()}`;

    const response = await api.get(path);
    const customers = normalizeCustomersResponse(response).filter((customer) => {
      const status = normalizeCustomerStatus(
        customer.kyc_status || customer.kycStatus || customer.status,
      );
      return kycQueueStatuses.includes(status);
    });

    adminKycQueueState.customers = customers;
    adminKycQueueState.hasLoaded = true;
  } catch (error) {
    console.error('Failed to load KYC queue', error);
    const friendlyError = /404/.test(error?.message || '') || /reach the server/i.test(error?.message || '')
      ? 'Unable to load KYC queue. Please try again later.'
      : error?.message || "Couldn't load KYC queue. Please try again.";
    adminKycQueueState.error = friendlyError;
    adminKycQueueState.hasLoaded = false;
  } finally {
    adminKycQueueState.loading = false;
    renderAdminKycQueue();
  }
}

function ensureCustomerDetailView() {
  if (customerDetailView || !customerRouteContent) return;

  customerDetailView = document.createElement('div');
  customerDetailView.dataset.customerView = 'detail';
  customerDetailView.className = 'hidden';

  const detailCard = document.createElement('div');
  detailCard.className = 'subcard customers-table-card';

  const header = document.createElement('div');
  header.className = 'card-header';

  const headerText = document.createElement('div');
  const title = document.createElement('h3');
  title.textContent = 'Customer detail';
  const subtitle = document.createElement('p');
  subtitle.className = 'muted';
  subtitle.textContent = 'View customer profile and verification status.';
  headerText.appendChild(title);
  headerText.appendChild(subtitle);
  header.appendChild(headerText);

  const headerActions = document.createElement('div');
  headerActions.className = 'action-row';
  customerDetailBackBtn = document.createElement('button');
  customerDetailBackBtn.type = 'button';
  customerDetailBackBtn.className = 'ghost';
  customerDetailBackBtn.textContent = 'Back to customers';
  headerActions.appendChild(customerDetailBackBtn);
  header.appendChild(headerActions);

  detailCard.appendChild(header);

  customerDetailMessage = document.createElement('div');
  customerDetailMessage.id = 'customer-detail-message';
  customerDetailMessage.className = 'alert hidden';
  detailCard.appendChild(customerDetailMessage);

  customerDetailLoading = document.createElement('div');
  customerDetailLoading.id = 'customer-detail-loading';
  customerDetailLoading.className = 'loading-row hidden';
  customerDetailLoading.setAttribute('aria-live', 'polite');
  customerDetailLoading.innerHTML = '<div class="spinner"></div><span>Loading customer...</span>';
  detailCard.appendChild(customerDetailLoading);

  customerDetailBody = document.createElement('div');
  customerDetailBody.id = 'customer-detail-body';
  customerDetailBody.className = 'customer-detail-body hidden';
  detailCard.appendChild(customerDetailBody);

  customerDetailView.appendChild(detailCard);
  customerRouteContent.appendChild(customerDetailView);
  refreshCustomerRouteViews();

  if (customerDetailBackBtn) {
    customerDetailBackBtn.addEventListener('click', () => {
      handleCustomerRoute('/admin/customers/all-customers', { pushState: true });
    });
  }
}

function resetCustomerDetailState() {
  customerDetailState.customer = null;
  customerDetailState.error = null;
  customerDetailState.loading = false;
  customerDetailState.customerId = null;
  customerDetailState.documents = [];
  customerDetailState.documentsLoading = false;
  customerDetailState.documentsError = null;
  customerDetailEditState.isEditing = false;
  customerDetailEditState.isSaving = false;
  customerDetailEditState.values = {
    nic_number: '',
    address: '',
    business_type: '',
  };
  kycExtendedViewCollapsed = false;
  kycExtendedEditMode = false;
  customerKycProfile = null;
  resetCustomerKycProfileState();
  if (customerDetailBody) customerDetailBody.innerHTML = '';
  setInlineAlert(customerDetailMessage, '');
  customerDetailLoading?.classList.add('hidden');
}

function normalizeEditableCustomerField(value) {
  if (value === null || value === undefined) return '';
  const normalized = String(value).trim();
  if (!normalized || normalized === '—' || normalized.toLowerCase() === 'null') return '';
  return normalized;
}

function getEditableCustomerValues(customer = {}) {
  return {
    nic_number: normalizeEditableCustomerField(
      customer.nic_number || customer.nic || customer.nicNumber || customer.nic_no,
    ),
    address: normalizeEditableCustomerField(
      customer.address || customer.address_line || customer.addressLine || customer.location,
    ),
    business_type: normalizeEditableCustomerField(
      customer.business_type || customer.businessType || customer.segment,
    ),
  };
}

function beginCustomerDetailEdit() {
  customerDetailEditState.isEditing = true;
  customerDetailEditState.isSaving = false;
  customerDetailEditState.values = getEditableCustomerValues(customerDetailState.customer || {});
  renderCustomerDetailContent();
}

function cancelCustomerDetailEdit() {
  customerDetailEditState.isEditing = false;
  customerDetailEditState.isSaving = false;
  customerDetailEditState.values = getEditableCustomerValues(customerDetailState.customer || {});
  setInlineAlert(customerDetailMessage, '');
  renderCustomerDetailContent();
}

function setCustomerDetailEditValue(key, value) {
  if (!Object.prototype.hasOwnProperty.call(customerDetailEditState.values, key)) return;
  customerDetailEditState.values[key] = value;
}

async function saveCustomerDetailEdits(customerId) {
  if (!customerId || customerDetailEditState.isSaving) return;

  const payload = {
    nic_number: (customerDetailEditState.values.nic_number || '').trim(),
    address: (customerDetailEditState.values.address || '').trim(),
    business_type: (customerDetailEditState.values.business_type || '').trim(),
  };

  customerDetailEditState.isSaving = true;
  setInlineAlert(customerDetailMessage, '');
  renderCustomerDetailContent();

  try {
    const basePath = endpoint('customers', { id: customerId }) || '/customers';
    const normalizedBase = basePath.replace(/\/+$/, '');
    const path = normalizedBase.endsWith(`/${customerId}`)
      ? normalizedBase
      : `${normalizedBase}/${encodeURIComponent(customerId)}`;

    try {
      await api(path, { method: 'PATCH', body: payload });
    } catch (error) {
      if (error?.status === 404 || error?.status === 405) {
        await api(path, { method: 'PUT', body: payload });
      } else {
        throw error;
      }
    }

    customerDetailEditState.isEditing = false;
    customerDetailEditState.isSaving = false;
    showToast('Customer updated successfully.');
    await loadCustomerDetail(customerId);
  } catch (error) {
    customerDetailEditState.isSaving = false;
    const message = error?.message || 'Failed to update customer details. Please try again.';
    setInlineAlert(customerDetailMessage, message, 'error');
    renderCustomerDetailContent();
  }
}

async function updateCustomerStatus(endpoint, trigger) {
  if (!endpoint) return;

  const button = trigger?.closest ? trigger.closest('button') : trigger;
  const originalText = button?.textContent;

  if (button) {
    button.disabled = true;
    button.textContent = 'Updating...';
  }

  try {
    await api(endpoint, { method: 'POST' });
    if (customerDetailState.customerId) {
      await loadCustomerDetail(customerDetailState.customerId);
    }
    showToast('Status updated successfully.');
  } catch (error) {
    console.error('Failed to update customer status', error);
    showToast('Failed to update status.', 'error');
    throw error;
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText || 'Submit';
    }
  }
}

async function saveCustomerKycProfile(customerId, trigger) {
  console.log('[KYC] saveCustomerKycProfile called', { customerId, state: customerKycProfileState });
  if (!customerId) {
    showToast('Customer ID is missing.', 'error');
    return;
  }

  const button = trigger?.closest ? trigger.closest('button') : trigger;
  const originalText = button?.textContent;

  if (button) {
    button.disabled = true;
    button.textContent = 'Saving...';
  }

  const body = {
    date_of_birth: customerKycProfileState.dateOfBirth || null,
    civil_status: customerKycProfileState.civilStatus || null,
    permanent_address_line1: customerKycProfileState.permanentAddressLine1 || null,
    permanent_address_line2: customerKycProfileState.permanentAddressLine2 || null,
    permanent_city: customerKycProfileState.permanentCity || null,
    permanent_district: customerKycProfileState.permanentDistrict || null,
    permanent_province: customerKycProfileState.permanentProvince || null,
    permanent_postal_code: customerKycProfileState.permanentPostalCode || null,
    current_address_line1: customerKycProfileState.currentAddressLine1 || null,
    current_address_line2: customerKycProfileState.currentAddressLine2 || null,
    current_city: customerKycProfileState.currentCity || null,
    current_district: customerKycProfileState.currentDistrict || null,
    current_province: customerKycProfileState.currentProvince || null,
    current_postal_code: customerKycProfileState.currentPostalCode || null,
    current_address_since: customerKycProfileState.currentAddressSince || null,
    household_size: customerKycProfileState.householdSize ? Number(customerKycProfileState.householdSize) : null,
    dependents_count: customerKycProfileState.dependentsCount
      ? Number(customerKycProfileState.dependentsCount)
      : null,
    customer_type: customerKycProfileState.customerType || null,
    employer_name: customerKycProfileState.employerName || null,
    employer_address: customerKycProfileState.employerAddress || null,
    occupation: customerKycProfileState.occupation || null,
    monthly_income: customerKycProfileState.monthlyIncome
      ? Number(customerKycProfileState.monthlyIncome)
      : null,
    business_name: customerKycProfileState.businessName || null,
    business_address: customerKycProfileState.businessAddress || null,
    guarantor_name: customerKycProfileState.guarantorName || null,
    guarantor_relationship: customerKycProfileState.guarantorRelationship || null,
    guarantor_mobile: customerKycProfileState.guarantorMobile || null,
    consent_data_processing: !!customerKycProfileState.consentDataProcessing,
    consent_credit_checks: !!customerKycProfileState.consentCreditChecks,
  };

  try {
    await apiRequest(`/api/admin/customers/${encodeURIComponent(customerId)}/kyc-profile`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
  } catch (error) {
    console.error('Failed to save KYC profile', error);
    showToast('Failed to save KYC profile.', 'error');
    throw error;
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText || 'Save KYC profile';
    }
  }
}

async function loadCustomerKycProfile(customerId) {
  if (!customerId) return null;

  try {
    const response = await apiRequest(`/api/admin/customers/${encodeURIComponent(customerId)}/kyc-profile`, {
      method: 'GET',
    });

    if (!response) return null;

    const payload = response?.data || response?.profile || response;
    if (!payload || typeof payload !== 'object') return payload || null;

    const extractedKyc = payload?.kyc_profile || payload?.data?.kyc_profile || null;
    if (extractedKyc && typeof extractedKyc === 'object') {
      return {
        ...payload,
        ...extractedKyc,
      };
    }

    return payload;
  } catch (error) {
    if (/404/.test(error?.message || '')) return null;
    console.error('Failed to load customer KYC profile', error);
    return null;
  }
}

function renderExtendedKycCard(container, customerId) {
  const kycCard = document.createElement('div');
  kycCard.className = 'customer-kyc-actions';

  const header = document.createElement('div');
  header.className = 'section-header';

  const title = document.createElement('h3');
  title.textContent = 'KYC Profile';
  header.appendChild(title);

  const actions = document.createElement('div');
  actions.className = 'action-row';

  const collapseBtn = document.createElement('button');
  collapseBtn.type = 'button';
  collapseBtn.className = 'ghost small';
  collapseBtn.textContent = kycExtendedViewCollapsed ? 'Expand' : 'Collapse';
  collapseBtn.addEventListener('click', () => {
    kycExtendedViewCollapsed = !kycExtendedViewCollapsed;
    renderCustomerDetailContent();
  });
  actions.appendChild(collapseBtn);

  if (kycExtendedEditMode) {
    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'secondary';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.addEventListener('click', () => {
      kycExtendedEditMode = false;
      if (customerKycProfile) populateCustomerKycProfileFromCustomer(customerKycProfile);
      renderCustomerDetailContent();
    });
    actions.appendChild(cancelBtn);

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'primary';
    saveBtn.textContent = 'Save KYC profile';
    saveBtn.addEventListener('click', async () => {
      if (!customerId) {
        showToast('Customer ID is missing.', 'error');
        return;
      }

      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';

      try {
        await saveCustomerKycProfile(customerId);
        customerKycProfile = await loadCustomerKycProfile(customerId);
        if (customerKycProfile) populateCustomerKycProfileFromCustomer(customerKycProfile);
        kycExtendedEditMode = false;
        showToast('KYC profile saved', 'success');
        renderCustomerDetailContent();
      } finally {
        saveBtn.disabled = false;
        saveBtn.textContent = 'Save KYC profile';
      }
    });
    actions.appendChild(saveBtn);
  } else {
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'primary';
    editBtn.textContent = 'Edit KYC';
    editBtn.addEventListener('click', () => {
      kycExtendedEditMode = true;
      if (customerKycProfile) populateCustomerKycProfileFromCustomer(customerKycProfile);
      renderCustomerDetailContent();
    });
    actions.appendChild(editBtn);
  }

  header.appendChild(actions);
  kycCard.appendChild(header);

  if (!kycExtendedViewCollapsed) {
    if (kycExtendedEditMode) {
      const extendedForm = document.createElement('div');
      extendedForm.className = 'form-grid';

      const createFieldLabel = (text) => {
        const label = document.createElement('span');
        label.textContent = text;
        return label;
      };

      const createInputField = (label, key, { type = 'text', placeholder, id } = {}) => {
        const field = document.createElement('label');
        field.className = 'form-field';
        field.appendChild(createFieldLabel(label));

        const input = document.createElement('input');
        input.type = type;
        if (id) input.id = id;
        if (placeholder) input.placeholder = placeholder;

        const setter = customerKycProfileSetters[key];
        const eventName = input.type === 'checkbox' ? 'change' : 'input';
        input.addEventListener(eventName, (event) => {
          const value = input.type === 'checkbox' ? event.target.checked : event.target.value;
          if (setter) setter(value);
        });

        registerCustomerKycInput(key, input);
        field.appendChild(input);
        return field;
      };

      const createSelectField = (label, key, options = [], { id } = {}) => {
        const field = document.createElement('label');
        field.className = 'form-field';
        field.appendChild(createFieldLabel(label));

        const select = document.createElement('select');
        if (id) select.id = id;
        options.forEach(({ value, text }) => {
          const option = document.createElement('option');
          option.value = value;
          option.textContent = text;
          select.appendChild(option);
        });

        const setter = customerKycProfileSetters[key];
        select.addEventListener('change', (event) => setter?.(event.target.value));
        registerCustomerKycInput(key, select);
        field.appendChild(select);
        return field;
      };

      const createCheckboxField = (label, key, { id } = {}) => {
        const field = document.createElement('label');
        field.className = 'form-field';

        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        if (id) checkbox.id = id;
        const setter = customerKycProfileSetters[key];
        checkbox.addEventListener('change', (event) => setter?.(event.target.checked));
        registerCustomerKycInput(key, checkbox);

        const labelText = document.createElement('span');
        labelText.textContent = label;

        labelText.prepend(checkbox);
        field.appendChild(labelText);
        return field;
      };

      const appendSection = (titleText, fields = []) => {
        const section = document.createElement('div');
        section.className = 'form-section';
        if (titleText) {
          const heading = document.createElement('h4');
          heading.textContent = titleText;
          section.appendChild(heading);
        }

        fields.forEach((field) => section.appendChild(field));
        extendedForm.appendChild(section);
      };

      appendSection('Personal', [
        createInputField('Date of birth', 'dateOfBirth', { type: 'date', id: 'dob' }),
        createSelectField(
          'Civil status',
          'civilStatus',
          [
            { value: '', text: 'Select status' },
            { value: 'SINGLE', text: 'Single' },
            { value: 'MARRIED', text: 'Married' },
            { value: 'WIDOWED', text: 'Widowed' },
            { value: 'DIVORCED', text: 'Divorced' },
          ],
          { id: 'civil_status' },
        ),
      ]);

      appendSection('Permanent address', [
        createInputField('Address line 1', 'permanentAddressLine1', { id: 'perm_line1' }),
        createInputField('Address line 2', 'permanentAddressLine2', { id: 'perm_line2' }),
        createInputField('City', 'permanentCity', { id: 'perm_city' }),
        createInputField('District', 'permanentDistrict', { id: 'perm_district' }),
        createInputField('Province', 'permanentProvince', { id: 'perm_province' }),
        createInputField('Postal code', 'permanentPostalCode', { id: 'perm_postal' }),
      ]);

      appendSection('Current address', [
        createInputField('Address line 1', 'currentAddressLine1', { id: 'curr_line1' }),
        createInputField('Address line 2', 'currentAddressLine2', { id: 'curr_line2' }),
        createInputField('City', 'currentCity', { id: 'curr_city' }),
        createInputField('District', 'currentDistrict', { id: 'curr_district' }),
        createInputField('Province', 'currentProvince', { id: 'curr_province' }),
        createInputField('Postal code', 'currentPostalCode', { id: 'curr_postal' }),
        createInputField('Living here since', 'currentAddressSince', { type: 'month', id: 'curr_since' }),
      ]);

      appendSection('Household', [
        createInputField('Household size', 'householdSize', { type: 'number', id: 'household_size' }),
        createInputField('Number of dependents', 'dependentsCount', {
          type: 'number',
          id: 'dependents_count',
        }),
      ]);

      appendSection('Customer type & income', [
        createSelectField(
          'Customer type',
          'customerType',
          [
            { value: '', text: 'Select type' },
            { value: 'SALARIED', text: 'Salaried' },
            { value: 'SELF_EMPLOYED', text: 'Self-employed' },
            { value: 'OTHER', text: 'Other' },
          ],
          { id: 'customer_type' },
        ),
        createInputField('Employer name', 'employerName', { id: 'employer_name' }),
        createInputField('Employer address', 'employerAddress', { id: 'employer_address' }),
        createInputField('Occupation', 'occupation', { id: 'occupation' }),
        createInputField('Monthly income', 'monthlyIncome', { type: 'number', id: 'monthly_income' }),
        createInputField('Business name', 'businessName', { id: 'business_name' }),
        createInputField('Business address', 'businessAddress', { id: 'business_address' }),
      ]);

      appendSection('Guarantor / emergency contact', [
        createInputField('Guarantor name', 'guarantorName', { id: 'guarantor_name' }),
        createInputField('Relationship', 'guarantorRelationship', { id: 'guarantor_relationship' }),
        createInputField('Mobile', 'guarantorMobile', { id: 'guarantor_mobile' }),
      ]);

      appendSection('Consents', [
        createCheckboxField('I confirm the above information is accurate and true.', 'consentDataProcessing', {
          id: 'consent_confirm',
        }),
        createCheckboxField(
          'I authorize Grow Microfinance to verify this information with banks/employers if necessary.',
          'consentCreditChecks',
          { id: 'consent_authorize' },
        ),
      ]);

      kycCard.appendChild(extendedForm);
    } else {
      const profile = getCustomerKycProfileForDisplay();
      const hasData = Object.values(profile).some((value) => value !== null && value !== undefined && value !== '');
      const summaryGrid = document.createElement('div');
      summaryGrid.className = 'detail-grid';

      const fallback = (value) => {
        if (value === null || value === undefined || value === '') return '—';
        return value;
      };

      const consentDisplay = (value) => (value ? '✅' : '✖️');

      const summaryGroups = [
        {
          heading: 'Personal',
          items: [
            ['Date of birth', fallback(profile.date_of_birth)],
            ['Civil status', fallback(profile.civil_status)],
            ['Customer type', fallback(profile.customer_type)],
          ],
        },
        {
          heading: 'Permanent address',
          items: [
            ['Line 1', fallback(profile.permanent_address_line1)],
            ['Line 2', fallback(profile.permanent_address_line2)],
            ['City', fallback(profile.permanent_city)],
            ['District', fallback(profile.permanent_district)],
            ['Province', fallback(profile.permanent_province)],
            ['Postal code', fallback(profile.permanent_postal_code)],
          ],
        },
        {
          heading: 'Current address',
          items: [
            ['Line 1', fallback(profile.current_address_line1)],
            ['Line 2', fallback(profile.current_address_line2)],
            ['City', fallback(profile.current_city)],
            ['District', fallback(profile.current_district)],
            ['Province', fallback(profile.current_province)],
            ['Postal code', fallback(profile.current_postal_code)],
            ['Living since', fallback(profile.current_address_since)],
          ],
        },
        {
          heading: 'Household',
          items: [
            ['Household size', fallback(profile.household_size)],
            ['Dependents', fallback(profile.dependents_count)],
          ],
        },
        {
          heading: 'Employment',
          items: [
            ['Employer name', fallback(profile.employer_name)],
            ['Employer address', fallback(profile.employer_address)],
            ['Occupation', fallback(profile.occupation)],
            ['Monthly income', fallback(profile.monthly_income)],
          ],
        },
        {
          heading: 'Business',
          items: [
            ['Business name', fallback(profile.business_name)],
            ['Business address', fallback(profile.business_address)],
          ],
        },
        {
          heading: 'Guarantor',
          items: [
            ['Name', fallback(profile.guarantor_name)],
            ['Relationship', fallback(profile.guarantor_relationship)],
            ['Mobile', fallback(profile.guarantor_mobile)],
          ],
        },
        {
          heading: 'Consents',
          items: [
            ['Data processing', consentDisplay(!!profile.consent_data_processing)],
            ['Credit checks', consentDisplay(!!profile.consent_credit_checks)],
          ],
        },
      ];

      if (!hasData) {
        const emptyState = document.createElement('p');
        emptyState.className = 'muted';
        emptyState.textContent = 'No extended KYC saved yet.';
        kycCard.appendChild(emptyState);
      } else {
        summaryGroups.forEach((group) => {
          const groupCard = document.createElement('div');
          groupCard.className = 'detail-row';
          const heading = document.createElement('p');
          heading.className = 'muted';
          heading.textContent = group.heading;
          groupCard.appendChild(heading);

          const values = document.createElement('div');
          values.className = 'detail-value';
          group.items.forEach(([label, value]) => {
            const line = document.createElement('p');
            line.textContent = `${label}: ${value}`;
            values.appendChild(line);
          });

          groupCard.appendChild(values);
          summaryGrid.appendChild(groupCard);
        });

        kycCard.appendChild(summaryGrid);
      }
    }
  }

  container.appendChild(kycCard);
}

function renderCustomerDetailContent() {
  ensureCustomerDetailView();

  setInlineAlert(customerDetailMessage, customerDetailState.error || '', 'error');

  if (customerDetailLoading)
    customerDetailLoading.classList.toggle('hidden', !customerDetailState.loading);

  const hideBody =
    customerDetailState.loading || !!customerDetailState.error || !customerDetailState.customer;
  if (customerDetailBody) {
    customerDetailBody.classList.toggle('hidden', hideBody);
  }

  if (hideBody || !customerDetailBody) return;

  const customer = customerDetailState.customer || {};
  const code =
    customer.customer_code || customer.customerCode || customer.code || customer.id || '—';
  const name =
    customer.full_name ||
    customer.fullName ||
    customer.name ||
    [customer.first_name, customer.last_name].filter(Boolean).join(' ') ||
    '—';
  const nic = customer.nic_number || customer.nic || customer.nicNumber || customer.nic_no || '—';
  const mobile = customer.mobile || customer.mobile_number || customer.phone || customer.contact || '—';
  const address =
    customer.address || customer.address_line || customer.addressLine || customer.location || '—';
  const businessType = customer.business_type || customer.businessType || customer.segment || '—';
  const kycStatus = customer.kyc_status || customer.kycStatus || customer.status;
  const eligibilityStatus = customer.eligibility_status || customer.eligibilityStatus;
  const customerId = getCustomerId(customer);
  const kycNormalized = normalizeCustomerStatus(kycStatus);
  const eligibilityNormalized = normalizeCustomerStatus(eligibilityStatus);
  const customerDocuments = customerDetailState.documents || [];
  const customerDocumentsLoading = customerDetailState.documentsLoading;
  const customerDocumentsError = customerDetailState.documentsError;
  const isEditing = customerDetailEditState.isEditing;
  const isSaving = customerDetailEditState.isSaving;

  const detailFields = [
    { label: 'Customer code', value: code },
    { label: 'Full name', value: name },
    { label: 'NIC', value: nic, key: 'nic_number' },
    { label: 'Mobile', value: mobile },
    { label: 'Address', value: address, key: 'address' },
    { label: 'Business type', value: businessType, key: 'business_type' },
    { label: 'KYC status', value: renderCustomerStatusBadge(kycStatus) },
    { label: 'Eligibility status', value: renderCustomerStatusBadge(eligibilityStatus) },
  ];
  const primaryFieldKeys = new Set([
    'id',
    'customer_id',
    'customerId',
    'customer_code',
    'customerCode',
    'code',
    'full_name',
    'fullName',
    'name',
    'first_name',
    'last_name',
    'nic_number',
    'nic',
    'nicNumber',
    'nic_no',
    'mobile',
    'mobile_number',
    'phone',
    'contact',
    'address',
    'address_line',
    'addressLine',
    'location',
    'business_type',
    'businessType',
    'segment',
    'kyc_status',
    'kycStatus',
    'status',
    'eligibility_status',
    'eligibilityStatus',
    'date_of_birth',
    'civil_status',
    'permanent_address_line1',
    'permanent_address_line2',
    'permanent_city',
    'permanent_district',
    'permanent_province',
    'permanent_postal_code',
    'current_address_line1',
    'current_address_line2',
    'current_city',
    'current_district',
    'current_province',
    'current_postal_code',
    'current_address_since',
    'household_size',
    'dependents_count',
    'customer_type',
    'employer_name',
    'employer_address',
    'occupation',
    'monthly_income',
    'business_name',
    'business_address',
    'guarantor_name',
    'guarantor_relationship',
    'guarantor_mobile',
    'consent_data_processing',
    'consent_credit_checks',
  ]);

  customerDetailBody.innerHTML = '';

  const detailActions = document.createElement('div');
  detailActions.className = 'action-row';

  if (isEditing) {
    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'primary';
    saveBtn.textContent = isSaving ? 'Saving...' : 'Save';
    saveBtn.disabled = isSaving;
    saveBtn.addEventListener('click', () => {
      if (customerId) saveCustomerDetailEdits(customerId);
    });

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'ghost';
    cancelBtn.textContent = 'Cancel';
    cancelBtn.disabled = isSaving;
    cancelBtn.addEventListener('click', () => {
      cancelCustomerDetailEdit();
    });

    detailActions.appendChild(saveBtn);
    detailActions.appendChild(cancelBtn);
  } else {
    const editBtn = document.createElement('button');
    editBtn.type = 'button';
    editBtn.className = 'secondary';
    editBtn.textContent = 'Edit';
    editBtn.addEventListener('click', () => {
      beginCustomerDetailEdit();
    });
    detailActions.appendChild(editBtn);
  }

  customerDetailBody.appendChild(detailActions);

  const detailGrid = document.createElement('div');
  detailGrid.className = 'detail-grid';

  detailFields.forEach(({ label, value, key }) => {
    const isStatusField = label === 'KYC status' || label === 'Eligibility status';

    if (isEditing && key && Object.prototype.hasOwnProperty.call(customerDetailEditState.values, key)) {
      const row = document.createElement('div');
      row.className = 'detail-row';

      const labelNode = document.createElement('p');
      labelNode.className = 'muted';
      labelNode.textContent = label;

      const fieldWrapper = document.createElement('div');
      fieldWrapper.className = 'detail-value form-field';

      const input = key === 'address' ? document.createElement('textarea') : document.createElement('input');
      if (key !== 'address') input.type = 'text';
      if (key === 'address') input.rows = 3;
      input.value = customerDetailEditState.values[key] || '';
      input.placeholder = `Enter ${label.toLowerCase()}`;
      input.disabled = isSaving;
      input.addEventListener('input', (event) => {
        setCustomerDetailEditValue(key, event.target.value);
      });

      fieldWrapper.appendChild(input);
      row.appendChild(labelNode);
      row.appendChild(fieldWrapper);
      detailGrid.appendChild(row);
      return;
    }

    detailGrid.appendChild(
      createCustomerDetailRow(label, value, {
        isHtml: isStatusField,
      }),
    );
  });

  Object.entries(customer)
    .filter(([key]) => !primaryFieldKeys.has(key))
    .forEach(([key, value]) => {
      const normalizedValue = formatCustomerFieldValue(value);
      const asCode = typeof value === 'object' && value !== null;
      detailGrid.appendChild(
        createCustomerDetailRow(formatCustomerFieldLabel(key), normalizedValue, {
          asCode,
        }),
      );
    });

  customerDetailBody.appendChild(detailGrid);

  const kycSection = document.createElement('div');
  kycSection.className = 'customer-kyc-actions';
  const sectionHeader = document.createElement('div');
  sectionHeader.className = 'section-header';
  const sectionTitle = document.createElement('h3');
  sectionTitle.textContent = 'KYC & Eligibility';
  sectionHeader.appendChild(sectionTitle);
  kycSection.appendChild(sectionHeader);

  const actionRow = document.createElement('div');
  actionRow.className = 'action-row';

  const addAction = (label, endpoint, style = 'secondary') => {
    if (!endpoint) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = style;
    button.textContent = label;
    button.addEventListener('click', async () => {
      try {
        await updateCustomerStatus(endpoint, button);
      } catch (_) {}
    });
    actionRow.appendChild(button);
  };

  if (customerId) {
    const basePath = `/customers/${encodeURIComponent(customerId)}`;

    if (kycNormalized === 'PENDING' || kycNormalized === 'UPLOADED' || kycNormalized === 'REJECTED') {
      addAction('Mark Under Review', `${basePath}/kyc-under-review`, 'secondary');
    }

    if (kycNormalized === 'UNDER_REVIEW') {
      addAction('Approve KYC', `${basePath}/kyc-approve`, 'primary');
      addAction('Reject KYC', `${basePath}/kyc-reject`, 'secondary');
    }

    if (kycNormalized === 'APPROVED') {
      addAction('Mark Eligible', `${basePath}/mark-eligible`, 'primary');
      addAction('Mark Not Eligible', `${basePath}/mark-not-eligible`, 'ghost');
    }

    if (kycNormalized === 'REJECTED') {
      addAction('Mark Not Eligible', `${basePath}/mark-not-eligible`, 'ghost');
    }
  }

  if (!actionRow.children.length) {
    const noActions = document.createElement('p');
    noActions.className = 'muted';
    noActions.textContent = 'No actions available for the current status.';
    kycSection.appendChild(noActions);
  } else {
    kycSection.appendChild(actionRow);
  }

  if (eligibilityNormalized || kycNormalized) {
    customerDetailBody.appendChild(kycSection);
  }

  renderExtendedKycCard(customerDetailBody, customerId);

  const documentsSection = document.createElement('div');
  documentsSection.className = 'customer-kyc-actions';

  const documentsHeader = document.createElement('div');
  documentsHeader.className = 'section-header';
  const documentsTitle = document.createElement('h3');
  documentsTitle.textContent = 'KYC documents';
  documentsHeader.appendChild(documentsTitle);
  documentsSection.appendChild(documentsHeader);

  if (customerDocumentsError) {
    const errorAlert = document.createElement('div');
    errorAlert.className = 'alert error';
    errorAlert.textContent = customerDocumentsError;
    documentsSection.appendChild(errorAlert);
  }

  const documentsWrapper = document.createElement('div');
  documentsWrapper.className = 'loan-table-wrapper documents-repository-table';
  const documentsTable = document.createElement('table');
  documentsTable.className = 'loan-table placeholder-table';

  const tableHead = document.createElement('thead');
  const tableHeadRow = document.createElement('tr');
  ['Document type', 'Uploaded at', 'File'].forEach((label) => {
    const th = document.createElement('th');
    th.textContent = label;
    tableHeadRow.appendChild(th);
  });
  tableHead.appendChild(tableHeadRow);
  documentsTable.appendChild(tableHead);

  const tableBody = document.createElement('tbody');

  if (customerDocumentsLoading) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 3;
    td.className = 'text-center text-muted';
    td.textContent = 'Loading documents...';
    tr.appendChild(td);
    tableBody.appendChild(tr);
  } else if (!customerDocuments.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 3;
    td.className = 'text-center text-muted';
    td.textContent = 'No KYC documents uploaded yet.';
    tr.appendChild(td);
    tableBody.appendChild(tr);
  } else {
    customerDocuments.forEach((doc) => {
      const tr = document.createElement('tr');
      const typeTd = document.createElement('td');
      typeTd.textContent = doc.document_type || doc.documentType || '—';
      tr.appendChild(typeTd);

      const uploadedTd = document.createElement('td');
      const uploadedAt = doc.uploaded_at || doc.uploadedAt || doc.created_at || doc.createdAt;
      uploadedTd.textContent = uploadedAt ? new Date(uploadedAt).toLocaleString() : '—';
      tr.appendChild(uploadedTd);

      const fileTd = document.createElement('td');
      const href = buildDocumentUrl(doc.file_path || doc.filePath || '');
      const link = document.createElement('a');
      link.href = href || '#';
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
      link.textContent = 'Open';
      link.className = 'link';
      fileTd.appendChild(link);
      tr.appendChild(fileTd);

      tableBody.appendChild(tr);
    });
  }

  documentsTable.appendChild(tableBody);
  documentsWrapper.appendChild(documentsTable);
  documentsSection.appendChild(documentsWrapper);

  const uploadControls = document.createElement('div');
  uploadControls.className = 'document-upload-grid';

  const documentTypes = [
    { label: 'NIC front', value: 'NIC_FRONT' },
    { label: 'NIC back', value: 'NIC_BACK' },
    { label: 'Selfie with NIC', value: 'SELFIE_NIC' },
    { label: 'Address proof', value: 'ADDRESS_PROOF' },
  ];

  const createUploadRow = ({ label, value }) => {
    const row = document.createElement('div');
    row.className = 'document-upload-row';

    const labelEl = document.createElement('label');
    labelEl.textContent = label;
    row.appendChild(labelEl);

    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*,.pdf';
    input.dataset.documentType = value;
    row.appendChild(input);

    const uploadBtn = document.createElement('button');
    uploadBtn.type = 'button';
    uploadBtn.className = 'secondary small';
    uploadBtn.textContent = 'Upload';
    uploadBtn.addEventListener('click', async () => {
      if (!customerId) {
        showToast('Customer ID is missing for upload.', 'error');
        return;
      }

      const file = input?.files?.[0];
      if (!file) {
        showToast('Please select a file to upload.', 'error');
        return;
      }

      uploadBtn.disabled = true;
      uploadBtn.textContent = 'Uploading...';

      try {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('document_type', value);

        const response = await apiMultipart(`/customers/${encodeURIComponent(customerId)}/documents`, formData);
        showToast('Document uploaded successfully.');
        input.value = '';

        if (response?.kyc_status && customerDetailState.customer) {
          customerDetailState.customer = {
            ...customerDetailState.customer,
            kyc_status: response.kyc_status,
          };
        }

        await loadCustomerDocuments(customerId);
      } catch (error) {
        console.error('Failed to upload document', error);
        showToast('Failed to upload document.', 'error');
      } finally {
        uploadBtn.disabled = false;
        uploadBtn.textContent = 'Upload';
      }
    });

    row.appendChild(uploadBtn);
    uploadControls.appendChild(row);
  };

  documentTypes.forEach(createUploadRow);

  documentsSection.appendChild(uploadControls);

  customerDetailBody.appendChild(documentsSection);
}

async function loadCustomerDetail(customerId) {
  const normalizedId = customerId?.toString();

  if (!normalizedId) {
    customerDetailState.error = 'Customer not found.';
    renderCustomerDetailContent();
    return;
  }

  customerDetailState.loading = true;
  customerDetailState.error = null;
  customerDetailState.customerId = normalizedId;
  customerDetailState.documents = [];
  customerDetailState.documentsError = null;
  renderCustomerDetailContent();

  try {
    const basePath = endpoint('customers', { id: normalizedId }) || '/customers';
    const normalizedBase = basePath.replace(/\/+$/, '');
    const path = normalizedBase.endsWith(`/${normalizedId}`)
      ? normalizedBase
      : `${normalizedBase}/${normalizedId}`;

    const response = await api.get(path);
    const customer = response?.customer || response?.data || response;
    customerKycProfile = await loadCustomerKycProfile(normalizedId);

    const extractedKyc =
      customerKycProfile?.kyc_profile ||
      customerKycProfile?.data?.kyc_profile ||
      customerKycProfile ||
      {};

    customerDetailState.customer = {
      ...customer,
      ...extractedKyc,
    };

    populateCustomerKycProfileFromCustomer(customerDetailState.customer);
    await loadCustomerDocuments(normalizedId);
  } catch (error) {
    console.error('Failed to load customer detail', error);
    const friendlyError = /404/.test(error?.message || '')
      ? 'Customer not found.'
      : error?.message || "Couldn't load customer. Please try again.";
    customerDetailState.error = friendlyError;
  } finally {
    customerDetailState.loading = false;
    renderCustomerDetailContent();
  }
}

async function loadCustomerDocuments(customerId) {
  const normalizedId = customerId?.toString();
  if (!normalizedId) return;

  customerDetailState.documentsLoading = true;
  customerDetailState.documentsError = null;
  renderCustomerDetailContent();

  try {
    const documents = await api.get(`/customers/${encodeURIComponent(normalizedId)}/documents`);
    if (Array.isArray(documents?.items)) customerDetailState.documents = documents.items;
    else if (Array.isArray(documents?.data?.items)) customerDetailState.documents = documents.data.items;
    else if (Array.isArray(documents?.documents)) customerDetailState.documents = documents.documents;
    else if (Array.isArray(documents?.data)) customerDetailState.documents = documents.data;
    else if (Array.isArray(documents)) customerDetailState.documents = documents;
    else customerDetailState.documents = [];
  } catch (error) {
    console.error('Failed to load customer documents', error);
    customerDetailState.documents = [];
    customerDetailState.documentsError = 'Unable to load KYC documents.';
  } finally {
    customerDetailState.documentsLoading = false;
    renderCustomerDetailContent();
  }
}

function renderCustomerDetail(customerId) {
  ensureCustomerDetailView();

  const normalizedId = customerId?.toString();

  if (!normalizedId) {
    customerDetailState.error = 'Customer not found.';
    customerDetailState.customer = null;
    renderCustomerDetailContent();
    return;
  }

  if (
    customerDetailState.customerId === normalizedId &&
    customerDetailState.customer &&
    !customerDetailState.loading
  ) {
    renderCustomerDetailContent();
    return;
  }

  resetCustomerDetailState();
  loadCustomerDetail(normalizedId);
}

/* --------------------------------------------------------------------------
 * Operational customer profile
 * Front-end only: the normalized profile remains the source of financial truth.
 * -------------------------------------------------------------------------- */
const operationalProfileState = {
  customerId: null, activeTab: 'overview', loans: [], payments: [], credits: [], letters: [], audit: [], normalized: {},
  financialSummary: {}, loading: { loans: false, payments: false, credit: false },
  sectionErrors: {}, requestSequence: 0, letterModalOpen: false, documentModalOpen: false,
};

function unwrapApiPayload(payload) {
  if (payload == null) return null;
  return payload.data?.profile ?? payload.profile ?? payload.data?.customer ?? payload.customer ?? payload.data ?? payload;
}

function unwrapArray(payload, possibleKeys = []) {
  if (Array.isArray(payload)) return payload;
  for (const key of possibleKeys) {
    if (Array.isArray(payload?.[key])) return payload[key];
    if (Array.isArray(payload?.data?.[key])) return payload.data[key];
  }
  if (Array.isArray(payload?.data)) return payload.data;
  if (Array.isArray(payload?.items)) return payload.items;
  if (Array.isArray(payload?.results)) return payload.results;
  return [];
}

function safeValue(value, fallback = '—') {
  if (value === null || value === undefined || typeof value === 'object') return fallback;
  const text = String(value).trim();
  return !text || ['null', 'undefined', 'nan', '[object object]'].includes(text.toLowerCase()) ? fallback : text;
}

function profilePick(source, keys, fallback = null) {
  for (const key of keys) {
    const value = key.split('.').reduce((item, part) => item && item[part], source);
    if (value !== null && value !== undefined && value !== '') return value;
  }
  return fallback;
}

function formatProfileDate(value, includeTime = false) {
  if (!value) return '—';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '—';
  return new Intl.DateTimeFormat('en-GB', includeTime
    ? { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }
    : { day: '2-digit', month: 'short', year: 'numeric' }).format(date);
}

function formatProfileCurrency(value) {
  if (value === null || value === undefined || value === '' || typeof value === 'object') return '—';
  const number = Number(value);
  return Number.isFinite(number) ? `Rs. ${number.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}` : '—';
}

function formatAddress(value, prefix = '') {
  if (typeof value === 'string') return safeValue(value);
  const source = value && typeof value === 'object' ? value : {};
  const p = prefix ? `${prefix}_` : '';
  const root = customerDetailState.customer || {};
  const parts = [
    source.line_1, source.line1, source.address_line_1,
    root[`${p}address_line1`], root[`${p}address_line_1`],
    source.line_2, source.line2, source.address_line_2,
    root[`${p}address_line2`], root[`${p}address_line_2`],
    source.city, root[`${p}city`], source.district, root[`${p}district`],
    source.province, root[`${p}province`], source.postal_code, root[`${p}postal_code`],
  ].filter((item, index, all) => item && all.indexOf(item) === index && typeof item !== 'object');
  return parts.length ? parts.map((part) => safeValue(part)).join(', ') : '—';
}

function normalizeCustomerProfile(payload) {
  return unwrapApiPayload(payload) || {};
}
function normalizeCustomerLoans(payload) {
  const direct = unwrapArray(payload, ['loans', 'customer_loans']);
  if (direct.length) return direct.slice().sort((a,b) => {
    const rank = (loan) => isOperationalActiveLoan(loan) ? 0 : ['SETTLED','CLOSED'].includes(normalizeCustomerStatus(profilePick(loan,['status','loan_status']))) ? 2 : 1;
    return rank(a)-rank(b) || new Date(profilePick(b,['disbursement_date','created_at'],0))-new Date(profilePick(a,['disbursement_date','created_at'],0));
  });
  const portfolio = payload?.loan_portfolio ?? payload?.data?.loan_portfolio;
  return unwrapArray(portfolio, ['loans', 'items']);
}
function normalizeCustomerPayments(payload) {
  return unwrapArray(payload, ['payments', 'recent_payments', 'collections', 'receipts']).slice().sort((a,b) => new Date(profilePick(b,['payment_date','paid_date','transaction_date','created_at'],0))-new Date(profilePick(a,['payment_date','paid_date','transaction_date','created_at'],0)));
}
function normalizeCustomerDocuments(payload) {
  const data = payload?.data || payload || {};
  const rows = data.documents || data.items || [];
  return Array.isArray(rows) ? rows : [];
}
function normalizeCustomerLetters(payload) {
  const data = payload?.data || payload || {};
  const rows = data.letters || data.notices || data.communications || data.items || [];
  return Array.isArray(rows) ? rows : [];
}
function isInternalPlaceholderEmail(email) {
  const value = String(email || '').trim().toLowerCase();
  return value.endsWith('@leads.local') || value.endsWith('@local') || value.includes('placeholder');
}
function customerDisplayEmail(customer) {
  const email = profilePick(customer, ['email', 'email_address']);
  return isInternalPlaceholderEmail(email) ? '—' : safeValue(email);
}
function profileNumber(value) {
  if (value === null || value === undefined || value === '' || typeof value === 'object') return null;
  const number = Number(String(value).replace(/,/g, ''));
  return Number.isFinite(number) ? number : null;
}
const operationalActiveLoanStatuses = new Set(['ACTIVE', 'DISBURSED', 'OVERDUE']);
function isOperationalActiveLoan(loan) { return operationalActiveLoanStatuses.has(normalizeCustomerStatus(profilePick(loan, ['status', 'loan_status']))); }
function sumProfileValues(rows, keys) {
  return rows.reduce((sum, row) => sum + (profileNumber(profilePick(row, keys)) ?? 0), 0);
}
function firstAvailable(source, keys) { return profileNumber(profilePick(source, keys)); }
function buildOperationalFinancialSummary(raw = {}) {
  const envelope = raw?.data ?? raw;
  const supplied = profilePick(envelope, ['financial_summary', 'financial_profile', 'summary', 'profile.financial_summary', 'customer.financial_summary'], {}) || {};
  const loans = operationalProfileState.loans, payments = operationalProfileState.payments;
  const active = loans.filter(isOperationalActiveLoan), settled = loans.filter((l) => ['SETTLED', 'CLOSED'].includes(normalizeCustomerStatus(profilePick(l, ['status', 'loan_status']))));
  const dates = active.map((l) => profilePick(l, ['next_due_date', 'next_installment_date', 'next_payment_date'])).filter((v) => v && !Number.isNaN(new Date(v).getTime())).sort((a,b) => new Date(a)-new Date(b));
  const paymentDates = payments.map((p) => profilePick(p, ['payment_date', 'paid_date', 'transaction_date', 'created_at'])).filter(Boolean).sort((a,b) => new Date(b)-new Date(a));
  const credit = operationalProfileState.credits.reduce((sum, item) => sum + (profileNumber(profilePick(item, ['available_amount', 'available_balance', 'credit_balance'])) ?? 0), 0);
  const pickNumber = (keys, fallback) => firstAvailable(supplied, keys) ?? firstAvailable(envelope, keys) ?? fallback;
  return {
    ...supplied,
    total_loans: pickNumber(['total_loans', 'loan_count'], loans.length),
    active_loans: pickNumber(['active_loans', 'activeLoans', 'total_active_loans', 'active_loan_count'], active.length),
    settled_loans: pickNumber(['settled_loans', 'settled_loan_count'], settled.length),
    total_outstanding: pickNumber(['total_outstanding', 'outstanding_total', 'customer_outstanding', 'loan_outstanding'], sumProfileValues(loans, ['outstanding', 'outstanding_amount', 'remaining_balance', 'total_outstanding'])),
    total_paid: pickNumber(['total_cash_paid', 'cash_paid', 'total_paid'], payments.length ? sumProfileValues(payments, ['cash_received', 'amount', 'payment_amount']) : sumProfileValues(loans, ['cash_paid', 'total_cash_paid', 'total_paid', 'paid_amount'])),
    customer_credit: pickNumber(['customer_credit_balance', 'available_credit', 'available_customer_credit', 'credit_balance', 'customer_credit'], credit),
    principal_outstanding: pickNumber(['principal_outstanding'], sumProfileValues(loans, ['principal_outstanding', 'outstanding_principal'])),
    original_interest_outstanding: pickNumber(['original_interest_outstanding', 'interest_outstanding'], sumProfileValues(loans, ['original_interest_outstanding', 'interest_outstanding'])),
    delay_interest_outstanding: pickNumber(['delay_interest_outstanding', 'outstanding_delay_interest', 'delay_interest_receivable'], sumProfileValues(loans, ['delay_interest_outstanding', 'outstanding_delay_interest', 'delay_interest_receivable'])),
    next_due_date: profilePick(supplied, ['next_due_date', 'next_installment_date', 'next_payment_date']) ?? profilePick(envelope, ['next_due_date']) ?? dates[0] ?? null,
    next_installment_amount: pickNumber(['next_installment_amount', 'next_instalment_amount'], firstAvailable(active[0] || {}, ['next_installment_amount', 'next_instalment_amount', 'next_payment_amount'])),
    days_overdue: pickNumber(['days_overdue', 'overdue_days', 'max_days_overdue'], Math.max(0, ...active.map((l) => firstAvailable(l, ['days_overdue', 'overdue_days']) ?? 0))),
    last_payment_date: profilePick(supplied, ['last_payment_date']) ?? paymentDates[0] ?? null,
  };
}
function statusBadge(value) {
  const status = safeValue(typeof value === 'object' ? profilePick(value, ['status', 'value', 'name']) : value);
  const slug = status.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  return `<span class="cp-badge cp-status-${escapeHtml(slug)}">${escapeHtml(status.replaceAll('_', ' '))}</span>`;
}
function loadingState(label = 'Loading') { return `<div class="cp-state"><span class="cp-spinner"></span>${escapeHtml(label)}…</div>`; }
function emptyState(label) { return `<div class="cp-state cp-empty">${escapeHtml(label)}</div>`; }
function errorState(label, section) { return `<div class="cp-state cp-error">${escapeHtml(label)} <button type="button" data-cp-retry="${escapeHtml(section)}">Retry</button></div>`; }

function cpName(customer) {
  return safeValue(profilePick(customer, ['full_name', 'customer_name', 'name', 'profile.full_name', 'customer.full_name', 'fullName']));
}
function cpField(customer, keys) { return safeValue(profilePick(customer, keys)); }
function cpInitials(name) {
  const words = safeValue(name, '').split(/\s+/).filter(Boolean);
  return (words.slice(0, 2).map((word) => word[0]).join('') || 'CU').toUpperCase();
}
function cpInfoCard(title, icon, rows) {
  return `<section class="cp-card cp-info-card"><h3><span>${icon}</span>${escapeHtml(title)}</h3><dl>${rows.map(([label, value, html]) => `<div><dt>${escapeHtml(label)}</dt><dd>${html ? value : escapeHtml(safeValue(value))}</dd></div>`).join('')}</dl></section>`;
}
function cpTable(columns, rows, emptyMessage) {
  return `<div class="cp-table-wrap"><table><thead><tr>${columns.map((c) => `<th>${escapeHtml(c)}</th>`).join('')}</tr></thead><tbody>${rows || `<tr><td colspan="${columns.length}">${emptyState(emptyMessage)}</td></tr>`}</tbody></table></div>`;
}
function cpSection(title, action, content, extra = '') {
  return `<section class="cp-card ${extra}"><header class="cp-card-head"><h3>${escapeHtml(title)}</h3>${action || ''}</header>${content}</section>`;
}
function cpFinancialTable(section, columns, rows, emptyMessage) {
  if (operationalProfileState.loading[section]) return loadingState(`Loading ${section}`);
  if (operationalProfileState.sectionErrors[section]) return errorState(`Unable to load customer ${section}.`, section);
  return cpTable(columns, rows, emptyMessage);
}

function cpLoanValue(loan, keys) { return profilePick(loan, keys); }
function cpLoanRows(loans, compact = false) {
  return loans.slice(0, compact ? 5 : loans.length).map((loan) => {
    const id = safeValue(cpLoanValue(loan, ['loan_number', 'loan_no', 'number', 'id']));
    const status = cpLoanValue(loan, ['status', 'loan_status']);
    const settled = normalizeCustomerStatus(status) === 'SETTLED';
    const cells = [id, statusBadge(status), formatProfileCurrency(cpLoanValue(loan, ['principal', 'principal_amount', 'approved_amount', 'disbursed_amount'])), formatProfileCurrency(cpLoanValue(loan, ['total_payable', 'total_repayment', 'scheduled_total', 'contract_value'])), formatProfileCurrency(cpLoanValue(loan, ['cash_paid', 'total_paid', 'paid_amount'])), formatProfileCurrency(cpLoanValue(loan, ['outstanding', 'outstanding_amount', 'remaining_balance', 'total_outstanding'])), formatProfileDate(cpLoanValue(loan, ['next_due_date', 'next_installment_date', 'next_payment_date', 'next_due']))];
    if (!compact) cells.push(formatProfileCurrency(cpLoanValue(loan, ['delay_interest_outstanding', 'delay_interest'])), safeValue(cpLoanValue(loan, ['days_overdue', 'overdue_days'])), `<div class="cp-row-actions"><button type="button" data-cp-loan="${escapeHtml(safeValue(cpLoanValue(loan, ['id', 'loan_id']), ''))}">View Loan</button><button type="button" ${settled ? 'disabled title="Settled loans cannot receive a standard payment"' : ''} data-cp-payment="${escapeHtml(safeValue(cpLoanValue(loan, ['id', 'loan_id']), ''))}">Record Payment</button></div>`);
    return `<tr>${cells.map((cell) => `<td>${typeof cell === 'string' && cell.startsWith('<') ? cell : escapeHtml(safeValue(cell))}</td>`).join('')}</tr>`;
  }).join('');
}
function cpPaymentRows(payments, compact = false) {
  return payments.slice(0, compact ? 5 : payments.length).map((payment) => {
    const cells = [formatProfileDate(profilePick(payment, ['payment_date', 'paid_date', 'transaction_date', 'date', 'created_at'])), cpField(payment, ['receipt_number', 'receipt_no', 'reference']), cpField(payment, ['loan_number', 'loan_no', 'loan.loan_number', 'loan.number']), formatProfileCurrency(profilePick(payment, ['amount', 'payment_amount', 'cash_received', 'cash_amount'])), cpField(payment, ['payment_method', 'payment_mode', 'method']), cpField(payment, ['collector_name', 'collector.full_name', 'collector.staff_name', 'collector.name', 'created_by_name'])];
    if (!compact) cells.push(statusBadge(profilePick(payment, ['journal_status', 'status'])), '<button type="button" disabled title="Receipt action is not available from this API">View Receipt</button>');
    return `<tr>${cells.map((cell) => `<td>${typeof cell === 'string' && cell.startsWith('<') ? cell : escapeHtml(safeValue(cell))}</td>`).join('')}</tr>`;
  }).join('');
}

function renderProfileHeader(customer) {
  const name = cpName(customer), code = cpField(customer, ['customer_code', 'customerCode', 'code']);
  const currentAddress = formatAddress(profilePick(customer, ['current_address']), 'current');
  const primaryAddress = currentAddress === '—' ? formatAddress(profilePick(customer, ['address'])) : currentAddress;
  return `<div class="cp-breadcrumb"><button type="button" data-cp-back>← Customers</button><span>/</span><strong>${escapeHtml(name)}</strong><span>/</span><span>${escapeHtml(code)}</span></div>
  <section class="cp-profile-head cp-card"><div class="cp-identity"><div class="cp-avatar" aria-label="Customer initials">${escapeHtml(cpInitials(name))}</div><div class="cp-identity-main"><div class="cp-name-line"><h1>${escapeHtml(name)}</h1>${profilePick(customer, ['customer_status', 'account_status']) != null ? statusBadge(profilePick(customer, ['customer_status', 'account_status'])) : ''}</div><div class="cp-contact-line"><strong>${escapeHtml(code)}</strong><span>NIC: ${escapeHtml(cpField(customer, ['nic_number', 'nic', 'nic_no']))}</span><span>☎ ${escapeHtml(cpField(customer, ['mobile', 'mobile_number', 'phone']))}</span></div><p class="cp-address">⌖ ${escapeHtml(primaryAddress)}</p><div class="cp-status-grid"><div><span>Lead Status</span>${statusBadge(profilePick(customer, ['lead_status']))}</div><div><span>KYC Status</span>${statusBadge(profilePick(customer, ['kyc_status']))}</div><div><span>Eligibility</span>${statusBadge(profilePick(customer, ['eligibility_status']))}</div><div><span>Customer Since</span><strong>${escapeHtml(formatProfileDate(profilePick(customer, ['created_at', 'customer_since'])))}</strong></div></div></div></div>
  <div class="cp-header-actions"><button type="button" class="cp-primary" data-cp-edit>✎ Edit Customer</button><button type="button" class="cp-blue" data-cp-tab="personal">✎ Edit KYC</button><button type="button" data-cp-new-loan>＋ New Loan Application</button><button type="button" data-cp-letter>✉ Send Letter / Notice</button><details><summary>More ⌄</summary><div class="cp-more-menu"><button data-cp-eligible>Mark Eligible</button><button data-cp-not-eligible>Mark Not Eligible</button><button data-cp-upload>Upload Document</button><button disabled title="Customer ledger endpoint is not available">View Customer Ledger</button><button data-cp-print>Print Customer Profile</button><button data-cp-tab="audit">View Audit History</button></div></details></div></section>`;
}

function renderKpiCards(customer) {
  const financial = operationalProfileState.financialSummary || {};
  const active = profilePick(financial, ['active_loans'], operationalProfileState.loans.filter(isOperationalActiveLoan).length);
  const cards = [
    ['▥', 'Active Loans', active, 'loans', 'View Loans'], ['◈', 'Total Outstanding', formatProfileCurrency(profilePick(financial, ['total_outstanding', 'outstanding_amount'])), 'financial', 'View Details'],
    ['☑', 'Total Paid', formatProfileCurrency(profilePick(financial, ['total_paid', 'cash_paid'])), 'payments', 'View Payments'], ['▣', 'Customer Credit', formatProfileCurrency(profilePick(financial, ['customer_credit', 'credit_balance', 'available_customer_credit'])), 'financial', 'View Ledger'],
    ['▦', 'Next Due Date', formatProfileDate(profilePick(financial, ['next_due_date'])), 'loans', 'View Schedule'], ['!', 'Days Overdue', safeValue(profilePick(financial, ['days_overdue', 'overdue_days'])), 'financial', 'View Details'],
  ];
  return `<section class="cp-kpis">${cards.map(([icon, label, value, tab, link]) => `<article class="cp-kpi"><span class="cp-kpi-icon">${icon}</span><div><small>${escapeHtml(label)}</small><strong>${escapeHtml(safeValue(value))}</strong><button type="button" data-cp-tab="${tab}">${escapeHtml(link)} →</button></div></article>`).join('')}</section>`;
}

const cpTabs = [['overview','Overview'],['personal','Personal & KYC'],['loans','Loans'],['payments','Payments'],['financial','Financial Profile'],['documents','Documents'],['letters','Letters & Notices'],['audit','Audit History']];
function renderProfileTabs() {
  return `<nav class="cp-tabs" role="tablist" aria-label="Customer profile sections">${cpTabs.map(([id,label]) => `<button type="button" role="tab" aria-selected="${operationalProfileState.activeTab === id}" tabindex="${operationalProfileState.activeTab === id ? '0' : '-1'}" class="${operationalProfileState.activeTab === id ? 'active' : ''}" data-cp-tab="${id}">${escapeHtml(label)}</button>`).join('')}</nav>`;
}

function renderOverviewTab(c) {
  const permanent = formatAddress(profilePick(c, ['permanent_address']), 'permanent');
  const current = formatAddress(profilePick(c, ['current_address']), 'current');
  const info = `<div class="cp-info-grid">${cpInfoCard('Contact Information','☎', [['Mobile',cpField(c,['mobile','mobile_number','phone'])],['Email',customerDisplayEmail(c)],['Current Address',current],['Permanent Address',permanent]])}${cpInfoCard('Personal Information','☺', [['Date of Birth',formatProfileDate(profilePick(c,['date_of_birth']))],['Civil Status',cpField(c,['civil_status'])],['Customer Type',cpField(c,['customer_type'])],['Dependents',cpField(c,['dependents_count','dependents'])],['Household Size',cpField(c,['household_size'])],['Living Since',formatProfileDate(profilePick(c,['current_address_since']))]])}${cpInfoCard('Employment / Business','▣', [['Occupation',cpField(c,['occupation'])],['Employer Name',cpField(c,['employer_name'])],['Employer Address',cpField(c,['employer_address'])],['Monthly Income',formatProfileCurrency(profilePick(c,['monthly_income']))],['Business Name',cpField(c,['business_name'])],['Business Address',cpField(c,['business_address'])],['Business Type',cpField(c,['business_type'])]])}${cpInfoCard('Guarantor Information','♙', [['Name',cpField(c,['guarantor_name','guarantor.name'])],['Relationship',cpField(c,['guarantor_relationship','guarantor.relationship'])],['Mobile',cpField(c,['guarantor_mobile','guarantor.mobile'])],['Address',cpField(c,['guarantor_address','guarantor.address'])]])}</div>`;
  const loans = cpSection('Loans Summary','<button data-cp-tab="loans">View All Loans →</button>',cpFinancialTable('loans',['Loan No.','Status','Principal','Total Payable','Paid','Outstanding','Next Due'],cpLoanRows(operationalProfileState.loans,true),'No loans recorded yet.'),'cp-wide');
  const payments = cpSection('Recent Payments','<button data-cp-tab="payments">View All Payments →</button>',cpFinancialTable('payments',['Date','Receipt No.','Loan No.','Amount','Method','Collector'],cpPaymentRows(operationalProfileState.payments,true),'No payments recorded yet.'),'cp-wide');
  const f = operationalProfileState.financialSummary || {};
  const account = cpInfoCard('Account Summary','▤',[['Total Loans (All Time)',profilePick(f,['total_loans'],operationalProfileState.loans.length)],['Active Loans',profilePick(f,['active_loans'])],['Settled Loans',profilePick(f,['settled_loans'])],['Total Paid',formatProfileCurrency(profilePick(f,['total_paid']))],['Total Outstanding',formatProfileCurrency(profilePick(f,['total_outstanding']))],['Customer Credit Balance',formatProfileCurrency(profilePick(f,['customer_credit','credit_balance']))]]);
  const credit = cpInfoCard('Credit Summary','◉',[['Original Interest Outstanding',formatProfileCurrency(profilePick(f,['original_interest_outstanding','interest_outstanding']))],['Principal Outstanding',formatProfileCurrency(profilePick(f,['principal_outstanding']))],['Delay Interest Outstanding',formatProfileCurrency(profilePick(f,['delay_interest_outstanding']))],['Next Due Date',formatProfileDate(profilePick(f,['next_due_date']))],['Next Instalment Amount',formatProfileCurrency(profilePick(f,['next_installment_amount','next_instalment_amount']))],['Days Overdue',safeValue(profilePick(f,['days_overdue', 'overdue_days']))],['Last Payment Date',formatProfileDate(profilePick(f,['last_payment_date']))]]);
  const letters = cpSection('Letters & Notices','<button class="cp-primary" data-cp-letter>＋ New Letter</button>', operationalProfileState.letters.length ? operationalProfileState.letters.slice(0,3).map((l)=>`<div class="cp-letter-row"><div><strong>${escapeHtml(cpField(l,['type','letter_type']))}</strong><span>${escapeHtml(cpField(l,['letter_number','number']))}</span></div>${statusBadge(profilePick(l,['status']))}<time>${escapeHtml(formatProfileDate(profilePick(l,['date','letter_date','created_at'])))}</time></div>`).join('') + '<button data-cp-tab="letters">View All Letters →</button>' : emptyState('No letters recorded. API persistence is not available.'));
  const docs = renderDocumentsCard(true);
  const quick = cpSection('Quick Actions','',`<div class="cp-quick"><button data-cp-new-loan>▧ New Loan Application</button><button data-cp-payment="">▣ Record Payment</button><button disabled title="Customer credit action is not available">＋ Add Customer Credit</button><button data-cp-letter>✉ Send Letter / Notice</button><button disabled title="Customer ledger endpoint is not available">▤ View Customer Ledger</button><button data-cp-print>⎙ Print Customer Profile</button></div>`);
  return `${info}<div class="cp-two-col">${loans}${payments}</div><div class="cp-three-col">${account}${credit}${letters}</div><div class="cp-bottom-grid">${docs}${quick}</div>`;
}

function renderPersonalTab(c) {
  const addressRows = (prefix) => [['Line 1',cpField(c,[`${prefix}_address_line1`,`${prefix}_address_line_1`])],['Line 2',cpField(c,[`${prefix}_address_line2`,`${prefix}_address_line_2`])],['City',cpField(c,[`${prefix}_city`])],['District',cpField(c,[`${prefix}_district`])],['Province',cpField(c,[`${prefix}_province`])],['Postal Code',cpField(c,[`${prefix}_postal_code`])]];
  const consent = (value) => statusBadge(value === true ? 'Granted' : value === false ? 'Not Granted' : 'Not Recorded');
  const cards = [cpInfoCard('Personal Details','☺',[['Full Name',cpName(c)],['NIC',cpField(c,['nic_number','nic'])],['Date of Birth',formatProfileDate(profilePick(c,['date_of_birth']))],['Civil Status',cpField(c,['civil_status'])],['Customer Type',cpField(c,['customer_type'])]]),cpInfoCard('Permanent Address','⌂',addressRows('permanent')),cpInfoCard('Current Address','⌖',addressRows('current')),cpInfoCard('Household','♙',[['Household Size',cpField(c,['household_size'])],['Dependents',cpField(c,['dependents_count'])],['Living Since',formatProfileDate(profilePick(c,['current_address_since']))]]),cpInfoCard('Employment','▣',[['Occupation',cpField(c,['occupation'])],['Employer Name',cpField(c,['employer_name'])],['Employer Address',cpField(c,['employer_address'])],['Monthly Income',formatProfileCurrency(profilePick(c,['monthly_income']))]]),cpInfoCard('Business','▦',[['Business Name',cpField(c,['business_name'])],['Business Type',cpField(c,['business_type'])],['Business Address',cpField(c,['business_address'])]]),cpInfoCard('Guarantor','♙',[['Name',cpField(c,['guarantor_name'])],['Relationship',cpField(c,['guarantor_relationship'])],['Mobile',cpField(c,['guarantor_mobile'])],['Address',cpField(c,['guarantor_address'])]]),cpInfoCard('Consents','✓',[['Data Processing',consent(profilePick(c,['consent_data_processing'])),true],['Credit Checks',consent(profilePick(c,['consent_credit_checks'])),true]]),cpInfoCard('KYC Status','◉',[['Current Status',statusBadge(profilePick(c,['kyc_status'])),true],['Last Updated',formatProfileDate(profilePick(c,['kyc_updated_at']))],['Reason',cpField(c,['kyc_reason'])]]),cpInfoCard('Eligibility','★',[['Current Status',statusBadge(profilePick(c,['eligibility_status'])),true],['Last Updated',formatProfileDate(profilePick(c,['eligibility_updated_at']))],['Reason',cpField(c,['eligibility_reason'])]])];
  const missing = profilePick(c,['missing_fields'],[]), warnings = profilePick(c,['warnings','review_warnings'],[]);
  if ((Array.isArray(missing)&&missing.length)||(Array.isArray(warnings)&&warnings.length)||profilePick(c,['completeness_percentage']) !== null) cards.push(cpSection('Profile Completeness','',`<strong class="cp-complete">${escapeHtml(safeValue(profilePick(c,['completeness_percentage']))) }${profilePick(c,['completeness_percentage']) !== null ? '%' : ''}</strong>${Array.isArray(missing)&&missing.length?`<p>Missing: ${escapeHtml(missing.join(', '))}</p>`:''}${Array.isArray(warnings)&&warnings.length?`<p>Warnings: ${escapeHtml(warnings.join(', '))}</p>`:''}`));
  return `<div class="cp-info-grid cp-personal-grid">${cards.join('')}</div>`;
}

function renderLoansTab() { return cpSection('Customer Loans','<button class="cp-primary" data-cp-new-loan>＋ New Loan Application</button>',cpFinancialTable('loans',['Loan Number','Status','Principal','Total Payable','Total Paid','Outstanding','Next Due Date','Delay Interest','Days Overdue','Actions'],cpLoanRows(operationalProfileState.loans),'No loans recorded for this customer.')); }
function renderPaymentsTab() { return cpSection('Payment History','',cpFinancialTable('payments',['Payment Date','Receipt Number','Loan Number','Amount','Payment Method','Collector','Journal Status','Actions'],cpPaymentRows(operationalProfileState.payments),'No payments recorded yet.')); }
function renderFinancialTab() {
  const f=operationalProfileState.financialSummary||{};
  return `<div class="cp-financial-grid">${cpInfoCard('Loan Portfolio','▥',[['Total Loans',profilePick(f,['total_loans'],operationalProfileState.loans.length)],['Active Loans',profilePick(f,['active_loans'])],['Settled Loans',profilePick(f,['settled_loans'])],['Total Principal',formatProfileCurrency(profilePick(f,['total_principal']))],['Total Paid',formatProfileCurrency(profilePick(f,['total_paid']))],['Total Outstanding',formatProfileCurrency(profilePick(f,['total_outstanding']))]])}${cpInfoCard('Receivables','◉',[['Principal Outstanding',formatProfileCurrency(profilePick(f,['principal_outstanding']))],['Original Interest Outstanding',formatProfileCurrency(profilePick(f,['original_interest_outstanding']))],['Delay Interest Outstanding',formatProfileCurrency(profilePick(f,['delay_interest_outstanding']))],['Fees Outstanding',formatProfileCurrency(profilePick(f,['fees_outstanding']))]])}${cpInfoCard('Customer Credit','▣',[['Available Customer Credit',formatProfileCurrency(profilePick(f,['available_customer_credit','customer_credit']))],['Credit Created',formatProfileCurrency(profilePick(f,['credit_created']))],['Credit Applied',formatProfileCurrency(profilePick(f,['credit_applied']))],['Last Credit Activity',formatProfileDate(profilePick(f,['last_credit_activity']))]])}${cpInfoCard('Repayment Behaviour','▦',[['Next Due Date',formatProfileDate(profilePick(f,['next_due_date']))],['Next Instalment Amount',formatProfileCurrency(profilePick(f,['next_installment_amount','next_instalment_amount']))],['Last Payment Date',formatProfileDate(profilePick(f,['last_payment_date']))],['Days Overdue',safeValue(profilePick(f,['days_overdue', 'overdue_days']))],['Overdue Instalments',safeValue(profilePick(f,['overdue_installments']))]])}</div><div class="cp-accounting-note">Financial values are displayed exactly as supplied by the authoritative customer profile API. Cash payments, credit and settlement adjustments remain separate.</div>`;
}

function renderDocumentsCard(compact=false) {
  const rows=customerDetailState.documents.slice(0,compact?4:customerDetailState.documents.length).map((d)=>`<tr><td>${escapeHtml(cpField(d,['document_type','type']))}</td><td>${escapeHtml(cpField(d,['file_name','name','filename']))}</td><td>${escapeHtml(formatProfileDate(profilePick(d,['uploaded_at','created_at'])))}</td><td>${statusBadge(profilePick(d,['verification_status','status','verified']))}</td><td>${escapeHtml(cpField(d,['uploaded_by_name','uploaded_by']))}</td>${compact?'':`<td>${escapeHtml(cpField(d,['notes']))}</td>`}<td><a class="cp-link" href="${escapeHtml(buildDocumentUrl(profilePick(d,['file_path','url'],''))||'#')}" target="_blank" rel="noopener">View</a></td></tr>`).join('');
  return cpSection(compact?'Documents':'Document Manager','<button class="cp-primary" data-cp-upload>＋ Upload Document</button>', customerDetailState.documentsError?errorState(customerDetailState.documentsError,'documents'):cpTable(compact?['Document Type','File Name','Uploaded On','Verified','Uploaded By','Actions']:['Document Type','File Name','Uploaded Date','Verification Status','Uploaded By','Notes','Actions'],rows,'No customer documents uploaded yet.'));
}
function renderLettersTab() {
  const rows=operationalProfileState.letters.map((l)=>`<tr><td>${escapeHtml(cpField(l,['letter_number','number']))}</td><td>${escapeHtml(formatProfileDate(profilePick(l,['date','letter_date'])))}</td><td>${escapeHtml(cpField(l,['type','letter_type']))}</td><td>${escapeHtml(cpField(l,['loan_number','related_loan']))}</td><td>${escapeHtml(cpField(l,['subject']))}</td><td>${escapeHtml(cpField(l,['delivery_method']))}</td><td>${statusBadge(profilePick(l,['status']))}</td><td>${escapeHtml(cpField(l,['created_by_name','created_by']))}</td><td><button disabled title="No supported letter write endpoint">View</button></td></tr>`).join('');
  return `<div class="cp-api-notice"><strong>Letter persistence is not yet available from the API.</strong> You can prepare and print a letter, but Save and Send remain disabled.</div>${cpSection('Letters & Notices','<button class="cp-primary" data-cp-letter>＋ New Letter</button>',cpTable(['Letter Number','Date','Type','Related Loan','Subject','Delivery Method','Status','Created By','Actions'],rows,'No letters or notices recorded.'))}`;
}
function renderAuditTab() {
  const rows=operationalProfileState.audit.map((a)=>`<tr><td>${escapeHtml(formatProfileDate(profilePick(a,['created_at','date','timestamp']),true))}</td><td>${escapeHtml(cpField(a,['user_name','user.name','created_by']))}</td><td>${escapeHtml(cpField(a,['action']))}</td><td>${escapeHtml(cpField(a,['entity_type','entity']))}</td><td>${escapeHtml(cpField(a,['reference','entity_id']))}</td><td>${escapeHtml(cpField(a,['details','description']))}</td></tr>`).join('');
  return cpSection('Audit History','',operationalProfileState.sectionErrors.audit?errorState(operationalProfileState.sectionErrors.audit,'audit'):cpTable(['Date and Time','User','Action','Entity','Reference','Details'],rows,'No audit history is available for this customer.'));
}

function renderCustomerProfileTab(customer) {
  switch(operationalProfileState.activeTab){case'personal':return renderPersonalTab(customer);case'loans':return renderLoansTab();case'payments':return renderPaymentsTab();case'financial':return renderFinancialTab();case'documents':return renderDocumentsCard();case'letters':return renderLettersTab();case'audit':return renderAuditTab();default:return renderOverviewTab(customer);}
}

function cpLetterModal(customer) {
  if (!operationalProfileState.letterModalOpen) return '';
  const firstLoan=operationalProfileState.loans[0]||{};
  return `<div class="cp-modal" role="presentation" data-cp-modal-backdrop><section class="cp-modal-dialog cp-letter-dialog" role="dialog" aria-modal="true" aria-labelledby="cp-letter-title"><header><div><small>Customer communication</small><h2 id="cp-letter-title">New Letter / Notice</h2></div><button aria-label="Close letter editor" data-cp-close>✕</button></header><div class="cp-letter-layout"><form class="cp-letter-form"><label>Customer<input value="${escapeHtml(cpName(customer))}" readonly></label><label>Letter Type<select id="cp-letter-type"><option>Payment Reminder</option><option>Overdue Warning</option><option>Final Warning</option><option>Demand Letter</option><option>Settlement Confirmation</option><option>Welcome Letter</option><option>Loan Approval Letter</option><option>Loan Disbursement Letter</option><option>Custom Letter</option></select></label><label>Related Loan<select><option value="">None</option>${operationalProfileState.loans.map(l=>`<option>${escapeHtml(safeValue(profilePick(l,['loan_number','number'])))}</option>`).join('')}</select></label><label>Subject<input id="cp-letter-subject" value="Payment reminder"></label><label>Letter Date<input type="date" value="${new Date().toISOString().slice(0,10)}"></label><label>Due Date<input type="date"></label><label>Delivery Method<select><option>Print</option><option disabled>Email — integration unavailable</option><option disabled>WhatsApp — integration unavailable</option><option>Hand Delivery</option><option>Registered Post</option><option>Courier</option></select></label><label>Recipient Address<textarea>${escapeHtml(formatAddress(profilePick(customer,['current_address']),'current'))}</textarea></label><label>Recipient Mobile<input value="${escapeHtml(cpField(customer,['mobile','mobile_number']))}"></label><label>Recipient Email<input value="${escapeHtml(customerDisplayEmail(customer) === '—' ? '' : customerDisplayEmail(customer))}"></label><label class="cp-span-2">Letter Body<textarea id="cp-letter-body" rows="8">Dear ${escapeHtml(cpName(customer))},\n\nThis is a courteous reminder regarding your loan ${escapeHtml(cpField(firstLoan,['loan_number','number']))}. Please contact GROW Microfinance if you need assistance.\n\nYours faithfully,\nGROW Microfinance</textarea></label><label class="cp-span-2">Internal Notes<textarea rows="2"></textarea></label></form><article class="cp-a4" id="cp-letter-preview"><div class="cp-letter-brand">GROW <span>Microfinance</span></div><time>${escapeHtml(formatProfileDate(new Date()))}</time><p>${escapeHtml(cpName(customer))}<br>${escapeHtml(formatAddress(profilePick(customer,['current_address']),'current'))}</p><h3>Payment reminder</h3><div class="cp-preview-body">Dear ${escapeHtml(cpName(customer))},<br><br>This is a courteous reminder regarding your loan ${escapeHtml(cpField(firstLoan,['loan_number','number']))}. Please contact GROW Microfinance if you need assistance.<br><br>Yours faithfully,<br>GROW Microfinance</div><footer>Authorized Signatory ____________________</footer></article></div><footer class="cp-modal-actions"><span>Sending integration is not available.</span><button disabled title="Letter persistence is not yet available from the API">Save Draft</button><button disabled title="Sending integration is not available">Send</button><button class="cp-primary" data-cp-print-letter>Generate / Print</button></footer></section></div>`;
}
function cpDocumentModal() {
  if (!operationalProfileState.documentModalOpen) return '';
  return `<div class="cp-modal" data-cp-modal-backdrop><section class="cp-modal-dialog cp-upload-dialog" role="dialog" aria-modal="true" aria-labelledby="cp-upload-title"><header><h2 id="cp-upload-title">Upload Customer Document</h2><button aria-label="Close upload" data-cp-close>✕</button></header><form id="cp-upload-form"><label>Document Type<select name="document_type" required><option value="NIC_FRONT">NIC Front</option><option value="NIC_BACK">NIC Back</option><option value="SELFIE_NIC">Selfie with NIC</option><option value="ADDRESS_PROOF">Address Proof</option><option value="OTHER">Other</option></select></label><label>File<input name="file" type="file" accept="image/*,.pdf" required></label><label>Notes<textarea name="notes" rows="3"></textarea></label><footer><button type="button" data-cp-close>Cancel</button><button type="submit" class="cp-primary">Upload</button></footer></form></section></div>`;
}

function bindCustomerProfileEvents() {
  const root=customerDetailBody; if(!root)return;
  root.onclick=async(event)=>{
    const target=event.target.closest('button,a'); if(!target)return;
    if(target.dataset.cpTab){operationalProfileState.activeTab=target.dataset.cpTab;renderCustomerDetailContent();return;}
    if(target.hasAttribute('data-cp-back')){handleCustomerRoute('/admin/customers/all-customers',{pushState:true});return;}
    if(target.hasAttribute('data-cp-edit')){beginCustomerDetailEdit();return;}
    if(target.hasAttribute('data-cp-new-loan')){openApplyLoanModal?.({ customerId: customerDetailState.customerId });return;}
    if(target.hasAttribute('data-cp-print')){window.print();return;}
    if(target.hasAttribute('data-cp-letter')){operationalProfileState.letterModalOpen=true;renderCustomerDetailContent();return;}
    if(target.hasAttribute('data-cp-upload')){operationalProfileState.documentModalOpen=true;renderCustomerDetailContent();return;}
    if(target.hasAttribute('data-cp-close')){operationalProfileState.letterModalOpen=false;operationalProfileState.documentModalOpen=false;renderCustomerDetailContent();return;}
    if(target.hasAttribute('data-cp-print-letter')){document.body.classList.add('cp-print-letter');window.print();setTimeout(()=>document.body.classList.remove('cp-print-letter'),500);return;}
    if(target.hasAttribute('data-cp-eligible')){await updateCustomerStatus(`/customers/${encodeURIComponent(customerDetailState.customerId)}/mark-eligible`,target);return;}
    if(target.hasAttribute('data-cp-not-eligible')){await updateCustomerStatus(`/customers/${encodeURIComponent(customerDetailState.customerId)}/mark-not-eligible`,target);return;}
    if(target.dataset.cpPayment!==undefined){if(window.paymentLoanId)paymentLoanId.value=target.dataset.cpPayment||'';paymentSheet?.classList.remove('hidden');return;}
    if(target.dataset.cpLoan){if(typeof showAdminLoanDetail === 'function') showAdminLoanDetail(target.dataset.cpLoan); else showToast('Open the Loans workspace to view this loan.');return;}
    if(target.dataset.cpRetry==='documents'){loadCustomerDocuments(customerDetailState.customerId);return;}
    if(['loans','payments','credit'].includes(target.dataset.cpRetry)){loadOperationalFinancialSection(target.dataset.cpRetry,customerDetailState.customerId);return;}
  };
  root.onkeydown=(event)=>{if(event.key==='Escape'&&(operationalProfileState.letterModalOpen||operationalProfileState.documentModalOpen)){operationalProfileState.letterModalOpen=false;operationalProfileState.documentModalOpen=false;renderCustomerDetailContent();}if((event.key==='ArrowLeft'||event.key==='ArrowRight')&&event.target.matches('[role="tab"]')){const i=cpTabs.findIndex(([id])=>id===operationalProfileState.activeTab);operationalProfileState.activeTab=cpTabs[(i+(event.key==='ArrowRight'?1:-1)+cpTabs.length)%cpTabs.length][0];renderCustomerDetailContent();customerDetailBody.querySelector(`[data-cp-tab="${operationalProfileState.activeTab}"]`)?.focus();}};
  const form=root.querySelector('#cp-upload-form');if(form)form.onsubmit=async(event)=>{event.preventDefault();const button=form.querySelector('[type="submit"]');button.disabled=true;button.textContent='Uploading…';try{const data=new FormData(form);await apiMultipart(`/customers/${encodeURIComponent(customerDetailState.customerId)}/documents`,data);showToast('Document uploaded successfully.');operationalProfileState.documentModalOpen=false;await loadCustomerDocuments(customerDetailState.customerId);}catch(error){showToast(error?.message||'Document upload failed.','error');button.disabled=false;button.textContent='Upload';}};
  const body=root.querySelector('#cp-letter-body'), subject=root.querySelector('#cp-letter-subject');const refreshPreview=()=>{const preview=root.querySelector('.cp-preview-body');if(preview&&body)preview.innerText=body.value;const h=root.querySelector('#cp-letter-preview h3');if(h&&subject)h.textContent=subject.value||'Letter';};body?.addEventListener('input',refreshPreview);subject?.addEventListener('input',refreshPreview);
}

renderCustomerDetailContent = function renderOperationalCustomerProfile() {
  ensureCustomerDetailView();
  setInlineAlert(customerDetailMessage,customerDetailState.error||'','error');
  customerDetailLoading?.classList.toggle('hidden',!customerDetailState.loading);
  const hide=customerDetailState.loading||!!customerDetailState.error||!customerDetailState.customer;
  customerDetailBody?.classList.toggle('hidden',hide);if(hide||!customerDetailBody)return;
  const customer=customerDetailState.customer;
  customerDetailBody.innerHTML=`<main class="grow-customer-profile">${renderProfileHeader(customer)}${renderKpiCards(customer)}${renderProfileTabs()}<div class="cp-tab-panel" role="tabpanel">${renderCustomerProfileTab(customer)}</div>${cpLetterModal(customer)}${cpDocumentModal()}<section class="cp-print-only"><h2>GROW Microfinance — Customer Profile</h2><p>Generated ${escapeHtml(formatProfileDate(new Date()))}</p></section></main>`;
  bindCustomerProfileEvents();
};

const legacyLoadCustomerDetail = loadCustomerDetail;
async function loadOperationalFinancialSection(section, id, sequence = operationalProfileState.requestSequence) {
  const paths = {
    loans: `/admin/loans?customer_id=${encodeURIComponent(id)}&page=1&page_size=100`,
    payments: `/admin/payments?customer_id=${encodeURIComponent(id)}&page=1&page_size=100`,
    credit: `/admin/customers/${encodeURIComponent(id)}/credits`,
  };
  operationalProfileState.loading[section] = true;
  delete operationalProfileState.sectionErrors[section];
  renderCustomerDetailContent();
  try {
    const response = await api.get(paths[section]);
    if (sequence !== operationalProfileState.requestSequence || String(id) !== String(operationalProfileState.customerId)) return;
    if (section === 'loans') operationalProfileState.loans = normalizeCustomerLoans(response);
    if (section === 'payments') operationalProfileState.payments = normalizeCustomerPayments(response);
    if (section === 'credit') operationalProfileState.credits = unwrapArray(response, ['credits', 'customer_credits']);
  } catch (error) {
    if (sequence !== operationalProfileState.requestSequence || String(id) !== String(operationalProfileState.customerId)) return;
    const hasAuthoritativeData = section === 'loans' ? operationalProfileState.loans.length : section === 'payments' ? operationalProfileState.payments.length : operationalProfileState.credits.length;
    if (!hasAuthoritativeData) operationalProfileState.sectionErrors[section] = error?.message || `Unable to load customer ${section}.`;
  } finally {
    if (sequence === operationalProfileState.requestSequence && String(id) === String(operationalProfileState.customerId)) {
      operationalProfileState.loading[section] = false;
      operationalProfileState.financialSummary = buildOperationalFinancialSummary(operationalProfileState.normalized);
      renderCustomerDetailContent();
    }
  }
}
loadCustomerDetail = async function loadOperationalCustomerDetail(customerId) {
  const id=customerId?.toString();if(!id)return legacyLoadCustomerDetail(customerId);
  const sequence=++operationalProfileState.requestSequence;
  customerDetailState.loading=true;customerDetailState.error=null;customerDetailState.customerId=id;customerDetailState.documents=[];
  operationalProfileState.customerId=id;operationalProfileState.activeTab='overview';operationalProfileState.loans=[];operationalProfileState.payments=[];operationalProfileState.credits=[];operationalProfileState.financialSummary={};operationalProfileState.loading={loans:false,payments:false,credit:false};operationalProfileState.sectionErrors={};renderCustomerDetailContent();
  try{
    let normalizedResponse=null;
    try{normalizedResponse=await api.get(`/admin/customers/${encodeURIComponent(id)}/profile-normalized`);}catch(error){operationalProfileState.sectionErrors.normalized=error?.message||'Normalized profile unavailable.';}
    const base=endpoint('customers',{id})||'/customers';const normalizedBase=base.replace(/\/+$/,'');const detailPath=normalizedBase.endsWith(`/${id}`)?normalizedBase:`${normalizedBase}/${id}`;
    const detailResponse=await api.get(detailPath);const detail=normalizeCustomerProfile(detailResponse);const normalized=normalizeCustomerProfile(normalizedResponse||{});
    let kyc={};try{const response=await loadCustomerKycProfile(id);customerKycProfile=response;kyc=response?.kyc_profile||response?.data?.kyc_profile||response||{};}catch(_){operationalProfileState.sectionErrors.kyc='Extended KYC is unavailable.';}
    if(sequence!==operationalProfileState.requestSequence||id!==operationalProfileState.customerId)return;
    operationalProfileState.normalized=normalizedResponse||{};
    customerDetailState.customer={...detail,...normalized,...kyc};
    operationalProfileState.loans=normalizeCustomerLoans(operationalProfileState.normalized);
    operationalProfileState.payments=normalizeCustomerPayments(operationalProfileState.normalized);
    operationalProfileState.letters=normalizeCustomerLetters(operationalProfileState.normalized);
    operationalProfileState.audit=Array.isArray(profilePick(operationalProfileState.normalized,['audit_history','audit','audit_logs'],[]))?profilePick(operationalProfileState.normalized,['audit_history','audit','audit_logs'],[]):[];
    operationalProfileState.financialSummary=buildOperationalFinancialSummary(operationalProfileState.normalized);
    populateCustomerKycProfileFromCustomer(customerDetailState.customer);
    customerDetailState.loading=false;renderCustomerDetailContent();
    await Promise.allSettled(['loans','payments','credit'].map((section)=>loadOperationalFinancialSection(section,id,sequence)));
    if(sequence===operationalProfileState.requestSequence)await loadCustomerDocuments(id);
  }catch(error){if(sequence===operationalProfileState.requestSequence)customerDetailState.error=/404/.test(error?.message||'')?'Customer not found.':error?.message||"Couldn't load customer. Please try again.";}finally{if(sequence===operationalProfileState.requestSequence){customerDetailState.loading=false;renderCustomerDetailContent();}}
};

function refreshCustomerRouteViews() {
  customerRouteViews = document.querySelectorAll('[data-customer-view]');
}

function setActiveCustomerView(view = '') {
  refreshCustomerRouteViews();
  customerRouteViews.forEach((panel) => {
    panel.classList.toggle('hidden', panel.dataset.customerView !== view);
  });
}

function clearCustomerRouteView() {
  if (!customerRoutePlaceholder) return;
  setActiveCustomerView('');
  customerRoutePlaceholder.classList.add('hidden');
  customerRouteGrid?.classList.remove('hidden');
  if (customerRouteTitle) customerRouteTitle.textContent = '';
  if (customerRouteDescription) customerRouteDescription.textContent = '';
  if (customerRoutePath) customerRoutePath.textContent = '';
}

function getCustomerRouteConfig(path = customerRouteHomePath) {
  if (!path || !path.startsWith(customerRouteHomePath)) return null;
  const normalizedPath = path.replace(/\/+$/, '') || customerRouteHomePath;

  if (customerRoutes[normalizedPath]) {
    return { ...customerRoutes[normalizedPath], path: normalizedPath };
  }

  const detailMatch = normalizedPath.match(/^\/admin\/customers\/(\d+)$/);
  if (detailMatch) {
    return {
      title: 'Customer detail',
      description: 'Review customer profile, KYC and eligibility.',
      view: 'detail',
      customerId: detailMatch[1],
      path: normalizedPath,
    };
  }

  return null;
}

function renderCustomerRoute(pathOrRoute) {
  const routeConfig = typeof pathOrRoute === 'string' ? getCustomerRouteConfig(pathOrRoute) : pathOrRoute;
  if (!customerRoutePlaceholder || !routeConfig) return;

  customerRouteGrid?.classList.add('hidden');
  customerRoutePlaceholder.classList.remove('hidden');

  const route = routeConfig;

  if (customerRouteTitle) customerRouteTitle.textContent = route.title || '';
  if (customerRouteDescription) customerRouteDescription.textContent = route.description || '';
  if (customerRoutePath) customerRoutePath.textContent = route.path ? `Route: ${route.path}` : '';

  if (route.view === 'detail') ensureCustomerDetailView();
  setActiveCustomerView(route.view || '');

  if (route.view === 'all') {
    renderAdminCustomers();
    loadAdminCustomers();
  }

  if (route.view === 'kyc') {
    renderAdminKycQueue();
    loadAdminKycQueue();
  }

  if (route.view === 'detail') {
    renderCustomerDetail(route.customerId);
  }
}

function handleCustomerRoute(path = customerRouteHomePath, { pushState = false } = {}) {
  if (!path.startsWith(customerRouteHomePath)) return false;
  showAdminSection('customers');

  const routeConfig = getCustomerRouteConfig(path);

  if (routeConfig) {
    const targetPath = routeConfig.path || path;
    if (pushState && window.location.pathname !== targetPath) {
      history.pushState({ customerRoute: targetPath }, '', targetPath);
    }
    renderCustomerRoute(routeConfig);
  } else {
    if (pushState && window.location.pathname !== customerRouteHomePath) {
      history.pushState({ customerRoute: customerRouteHomePath }, '', customerRouteHomePath);
    }
    clearCustomerRouteView();
  }

  return true;
}

function navigateCustomerRoute(path) {
  const routeConfig = getCustomerRouteConfig(path);
  if (!routeConfig) return;
  const targetPath = routeConfig.path || path;
  history.pushState({ customerRoute: targetPath }, '', targetPath);
  renderCustomerRoute(routeConfig);
}

function clearLoanApplicationsRouteView() {
  loanAppRouteGrid?.classList.remove('hidden');
  loanAppRoutePlaceholder?.classList.add('hidden');
  if (loanAppRouteTitle) loanAppRouteTitle.textContent = '';
  if (loanAppRouteDescription) loanAppRouteDescription.textContent = '';
}

function renderLoanApplicationsRoute(path = loanApplicationsRouteHomePath) {
  showAdminSection('loan-applications');
  const route = loanApplicationsRoutes[path];
  if (!route) {
    clearLoanApplicationsRouteView();
    return;
  }

  loanAppRouteGrid?.classList.add('hidden');
  loanAppRoutePlaceholder?.classList.remove('hidden');
  if (loanAppRouteTitle) loanAppRouteTitle.textContent = route.title;
  if (loanAppRouteDescription) loanAppRouteDescription.textContent = route.description;

  ensureAdminLoanApplicationsUI();
  renderAdminLoanApplications();
  loadAdminLoanApplicationsAll();
}

function handleLoanApplicationsRoute(path = loanApplicationsRouteHomePath, { pushState = false } = {}) {
  if (path === loanApplyWizardRoutePath) return false;
  if (!path.startsWith(loanApplicationsRouteHomePath)) return false;
  const normalizedPath = path.replace(/\/+$/, '') || loanApplicationsRouteHomePath;

  if (pushState && window.location.pathname !== normalizedPath) {
    history.pushState({ loanApplicationRoute: normalizedPath }, '', normalizedPath);
  }

  renderLoanApplicationsRoute(normalizedPath);
  return true;
}

const originalApplicationFormParent = applicationFormCard?.parentElement || null;
const originalApplicationFormNextSibling = applicationFormCard?.nextElementSibling || null;

function showApplyLoanError(message) {
  if (!applyLoanModalBody) return;
  applyLoanModalBody.innerHTML = `
    <div class="modal-error">
      <h3>Unable to load the loan application form</h3>
      <p>${escapeHtml(message || 'Unknown error')}</p>
      <button type="button" id="retryLoanWizard" class="primary">Retry</button>
    </div>
  `;
  applyLoanModalBody.querySelector('#retryLoanWizard')?.addEventListener('click', openApplyLoanModal);
}

function openApplyLoanModal() {
  if (!applyLoanModal || !applyLoanModalBody || !applicationFormCard) return;
  cleanupInactiveOverlays();
  applyLoanModal.classList.remove('hidden');
  applyLoanModal.classList.add('open');
  applyLoanModal.setAttribute('aria-hidden', 'false');
  ensureModalBackdrop(applyLoanModal);
  document.body.classList.add('modal-open');
  applyLoanModalBody.innerHTML = '<div class="modal-loading">Loading loan application form...</div>';

  try {
    if (!formSteps || formSteps.length === 0) {
      throw new Error('No loan application wizard steps configured');
    }
    resetApplicationForm();
    currentStep = 0;
    applyLoanModalBody.replaceChildren();
    applicationFormCard.classList.add('loan-wizard');
    applicationFormCard.classList.remove('hidden');
    applyLoanModalBody.appendChild(applicationFormCard);
    const footerActions = applicationFormCard.querySelector('.stepper-footer .footer-actions');
    if (footerActions && !footerActions.querySelector('[data-apply-loan-cancel]')) {
      const cancelButton = document.createElement('button');
      cancelButton.type = 'button';
      cancelButton.className = 'ghost';
      cancelButton.dataset.applyLoanCancel = 'true';
      cancelButton.textContent = 'Cancel';
      cancelButton.addEventListener('click', closeApplyLoanModal);
      footerActions.prepend(cancelButton);
    }
    updateStepperUI();
    if (!applicationFormCard.childElementCount) {
      throw new Error('Loan wizard returned empty content');
    }
  } catch (error) {
    console.error('Unable to initialize Apply Loan wizard', error);
    showApplyLoanError(error.message);
  }
}

function closeApplyLoanModal() {
  if (!applyLoanModal) return;
  // Invalidate profile work immediately so a closed/reopened wizard cannot show stale data.
  clearSelectedCustomer();
  applyLoanModal.classList.add('hidden');
  applyLoanModal.classList.remove('open');
  applyLoanModal.setAttribute('aria-hidden', 'true');
  if (originalApplicationFormParent && applicationFormCard) {
    applicationFormCard.classList.add('hidden');
    applicationFormCard.classList.remove('loan-wizard');
    originalApplicationFormParent.insertBefore(applicationFormCard, originalApplicationFormNextSibling);
  }
  if (applyLoanModalBody) applyLoanModalBody.replaceChildren();
  removeModalBackdrop(applyLoanModal);
  restoreBodyScrollingIfNoOverlay();
}

function createDocumentTile({ title, description, buttonLabel, key, path }) {
  const card = document.createElement('div');
  card.className = 'subcard';

  const header = document.createElement('div');
  header.className = 'card-header';
  const wrapper = document.createElement('div');
  const titleEl = document.createElement('h3');
  titleEl.textContent = title;
  const descriptionEl = document.createElement('p');
  descriptionEl.className = 'muted';
  descriptionEl.textContent = description;
  wrapper.appendChild(titleEl);
  wrapper.appendChild(descriptionEl);
  header.appendChild(wrapper);
  card.appendChild(header);

  const actionRow = document.createElement('div');
  actionRow.className = 'action-row';
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'primary';
  button.textContent = buttonLabel;
  button.dataset.documentKey = key || '';
  button.dataset.documentRoute = path || '';
  button.addEventListener('click', () => {
    handleDocumentRoute(path || documentRouteBase, { pushState: true, key });
  });
  if (key) {
    documentSectionButtons[key] = button;
  }
  actionRow.appendChild(button);
  card.appendChild(actionRow);

  return card;
}

function createDocumentRepositoryView() {
  if (documentRepositoryCard || !adminDocumentsSection) return;

  documentRepositoryPage = document.createElement('div');
  documentRepositoryPage.className = 'documents-repository-page hidden';

  const pageHeader = document.createElement('div');
  pageHeader.className = 'documents-repository-header';
  const pageTitle = document.createElement('h2');
  pageTitle.textContent = 'All Documents Repository';
  const pageSubtitle = document.createElement('p');
  pageSubtitle.className = 'muted';
  pageSubtitle.textContent = 'View every uploaded document in the system.';
  pageHeader.appendChild(pageTitle);
  pageHeader.appendChild(pageSubtitle);

  documentRepositoryCard = document.createElement('div');
  documentRepositoryCard.id = 'documents-repository-view';
  documentRepositoryCard.className = 'documents-repository-card card';

  documentRepositoryMessage = document.createElement('p');
  documentRepositoryMessage.className = 'alert hidden';
  documentRepositoryCard.appendChild(documentRepositoryMessage);

  documentRepositoryLoading = document.createElement('p');
  documentRepositoryLoading.className = 'muted hidden';
  documentRepositoryLoading.textContent = 'Loading documents...';
  documentRepositoryCard.appendChild(documentRepositoryLoading);

  documentRepositoryTableWrapper = document.createElement('div');
  documentRepositoryTableWrapper.className = 'loan-table-wrapper documents-repository-table';

  const table = document.createElement('table');
  table.className = 'loan-table placeholder-table';

  const thead = document.createElement('thead');
  const headerRow = document.createElement('tr');
  documentRepositoryHeaderRow = headerRow;
  thead.appendChild(headerRow);

  const tbody = document.createElement('tbody');
  documentRepositoryTableBody = tbody;

  table.appendChild(thead);
  table.appendChild(tbody);
  documentRepositoryTableWrapper.appendChild(table);
  documentRepositoryCard.appendChild(documentRepositoryTableWrapper);

  documentRepositoryPage.appendChild(pageHeader);
  documentRepositoryPage.appendChild(documentRepositoryCard);
  adminDocumentsSection.appendChild(documentRepositoryPage);
}

function getDocumentRepositoryColumns(items = []) {
  const hasApplicationNumber = items.some((item) => item?.application_number || item?.applicationNumber);
  const hasCustomerName = items.some((item) => item?.customer_name || item?.customerName);
  const hasLoanType = items.some((item) => item?.loan_type || item?.loanType);
  const hasStatus = items.some((item) => item?.status || item?.application_status || item?.applicationStatus);

  const columns = [
    { key: 'id', label: 'ID', getter: (row) => row?.id ?? row?.document_id ?? row?.documentId },
    {
      key: 'loan_application_id',
      label: 'Application ID',
      getter: (row) =>
        row?.loan_application_id || row?.loanApplicationId || row?.application_id || row?.applicationId,
    },
  ];

  if (hasApplicationNumber) {
    columns.push({
      key: 'application_number',
      label: 'Application number',
      getter: (row) => row?.application_number || row?.applicationNumber,
    });
  }

  if (hasCustomerName) {
    columns.push({
      key: 'customer_name',
      label: 'Customer name',
      getter: (row) => row?.customer_name || row?.customerName,
    });
  }

  if (hasLoanType) {
    columns.push({ key: 'loan_type', label: 'Loan type', getter: (row) => row?.loan_type || row?.loanType });
  }

  if (hasStatus) {
    columns.push({
      key: 'status',
      label: 'Status',
      getter: (row) => row?.status || row?.application_status || row?.applicationStatus,
    });
  }

  columns.push({ key: 'document_type', label: 'Document type', getter: (row) => row?.document_type || row?.documentType });
  columns.push({ key: 'file_path', label: 'File path', getter: (row) => row?.file_path || row?.filePath });
  columns.push({
    key: 'uploaded_at',
    label: 'Uploaded at',
    getter: (row) => row?.uploaded_at || row?.uploadedAt || row?.created_at || row?.createdAt,
  });

  return columns;
}



function renderDocumentRepositoryTable(items = []) {
  if (!documentRepositoryHeaderRow || !documentRepositoryTableBody) return;

  const columns = getDocumentRepositoryColumns(items);

  documentRepositoryHeaderRow.innerHTML = '';
  columns.forEach((col) => {
    const th = document.createElement('th');
    th.textContent = col.label;
    documentRepositoryHeaderRow.appendChild(th);
  });

  documentRepositoryTableBody.innerHTML = '';

  if (!items.length) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = columns.length || 1;
    td.className = 'text-center text-muted';
    td.textContent = 'No documents found.';
    tr.appendChild(td);
    documentRepositoryTableBody.appendChild(tr);
    return;
  }

  items.forEach((row) => {
    const tr = document.createElement('tr');

    columns.forEach((col) => {
      const td = document.createElement('td');
      if (col.key === 'file_path') {
        const href = row.file_url || row.file_path || '#';
        const link = document.createElement('a');
        link.href = href;
        link.target = '_blank';
        link.rel = 'noopener noreferrer';
        link.textContent = row.file_path || 'Open file';
        link.className = 'link';
        td.appendChild(link);
      } else if (col.key === 'uploaded_at') {
        const uploadedAt = col.getter(row);
        const formatted = uploadedAt ? new Date(uploadedAt).toLocaleString() : '';
        td.textContent = formatted || '—';
      } else if (col.key === 'status') {
        const status = col.getter(row);
        td.innerHTML = status ? renderStatusBadge(status) : '—';
      } else {
        const value = col.getter(row);
        td.textContent = value ?? '—';
      }
      tr.appendChild(td);
    });

    documentRepositoryTableBody.appendChild(tr);
  });
}

function renderDocumentRepository() {
  if (!documentRepositoryCard) return;

  const { loading, error, items } = documentRepositoryState;
  const columns = getDocumentRepositoryColumns(items);

  if (documentRepositoryHeaderRow) {
    documentRepositoryHeaderRow.innerHTML = '';
    columns.forEach((col) => {
      const th = document.createElement('th');
      th.textContent = col.label;
      documentRepositoryHeaderRow.appendChild(th);
    });
  }

  documentRepositoryCard.classList.toggle('hidden', activeDocumentSection !== 'documents-repository');

  if (documentRepositoryMessage) setInlineAlert(documentRepositoryMessage, error || '', 'error');

  if (documentRepositoryLoading) {
    documentRepositoryLoading.classList.toggle('hidden', !loading);
    documentRepositoryLoading.textContent = loading ? 'Loading documents...' : '';
  }

  if (loading) {
    if (documentRepositoryTableBody) {
      documentRepositoryTableBody.innerHTML = '';
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = columns.length || 1;
      td.className = 'text-center text-muted';
      td.textContent = 'Loading documents...';
      tr.appendChild(td);
      documentRepositoryTableBody.appendChild(tr);
    }
    return;
  }

  if (error) {
    if (documentRepositoryTableBody) {
      documentRepositoryTableBody.innerHTML = '';
      const tr = document.createElement('tr');
      const td = document.createElement('td');
      td.colSpan = columns.length || 1;
      td.className = 'text-center text-muted';
      td.textContent = 'Unable to load documents.';
      tr.appendChild(td);
      documentRepositoryTableBody.appendChild(tr);
    }
    return;
  }

  renderDocumentRepositoryTable(items);
}

async function loadDocumentRepository(force = false) {
  createDocumentRepositoryView();
  if (!documentRepositoryCard || documentRepositoryState.loading) return;

  if (documentRepositoryState.hasLoaded && !force) {
    renderDocumentRepository();
    return;
  }

  documentRepositoryState.loading = true;
  documentRepositoryState.error = null;
  renderDocumentRepository();

  try {
    const { token } = getSession();
    const headers = { Accept: 'application/json' };
    if (token) headers.Authorization = `Bearer ${token}`;

    const baseUrl = getApiBaseUrl().replace(/\/+$/, '');
    const response = await fetch(`${baseUrl}/admin/documents/repository`, { method: 'GET', headers });
    const { data, raw } = await parseResponse(response.clone());

    if (!response.ok) {
      const message = buildErrorMessage({ status: response.status, data, raw });
      throw new Error(message);
    }

    let items = [];
    if (Array.isArray(data?.items)) items = data.items;
    else if (Array.isArray(data?.data?.items)) items = data.data.items;
    else if (Array.isArray(data)) items = data;

    documentRepositoryState.items = items;
    documentRepositoryState.hasLoaded = true;
    documentRepositoryState.baseUrl = baseUrl;
  } catch (error) {
    console.error('Failed to load document repository', error);
    const friendlyError = /404/.test(error?.message || '') || /reach the server/i.test(error?.message || '')
      ? 'Failed to load document repository'
      : error?.message || 'Failed to load document repository';
    documentRepositoryState.error = friendlyError;
    documentRepositoryState.hasLoaded = false;
  } finally {
    documentRepositoryState.loading = false;
    renderDocumentRepository();
  }
}

documentSectionHandlers['documents-repository'] = () => {
  createDocumentRepositoryView();
  renderDocumentRepository();
  loadDocumentRepository();
};

function ensureAdminDocumentsUI() {
  if (!adminDocumentsSection || adminDocumentsInitialized) return;

  adminDocumentsSection.innerHTML = '';

  const header = document.createElement('div');
  header.className = 'card-header';
  const headerWrapper = document.createElement('div');
  const eyebrow = document.createElement('div');
  eyebrow.className = 'eyebrow';
  eyebrow.textContent = 'COMPLIANCE';
  const title = document.createElement('h2');
  title.textContent = 'Documents';
  const subtitle = document.createElement('p');
  subtitle.className = 'muted';
  subtitle.textContent = 'KYC and application document management.';
  headerWrapper.appendChild(eyebrow);
  headerWrapper.appendChild(title);
  headerWrapper.appendChild(subtitle);
  header.appendChild(headerWrapper);
  adminDocumentsSection.appendChild(header);
  adminDocumentsHeader = header;

  const grid = document.createElement('div');
  grid.className = 'subcard-grid documents-tiles-grid';
  documentTilesGrid = grid;

  const tiles = [
    {
      key: 'document-inbox',
      path: documentRouteMap['document-inbox'],
      title: 'Document inbox',
      description: 'View all newly uploaded customer documents.',
      buttonLabel: 'Open',
    },
    {
      key: 'pending-verification',
      path: documentRouteMap['pending-verification'],
      title: 'Pending verification',
      description: 'Documents awaiting KYC review.',
      buttonLabel: 'View queue',
    },
    {
      key: 'rejected-documents',
      path: documentRouteMap['rejected-documents'],
      title: 'Rejected documents',
      description: 'Items needing re-submission by customers.',
      buttonLabel: 'View list',
    },
    {
      key: 'documents-repository',
      path: documentRouteMap['documents-repository'],
      title: 'All documents (repository)',
      description: 'Central repository of all uploaded files.',
      buttonLabel: 'Open repository',
    },
    {
      key: 'kyc-queues',
      path: documentRouteMap['kyc-queues'],
      title: 'KYC queues',
      description: 'Organized queues by loan officer or branch.',
      buttonLabel: 'Manage queues',
    },
    {
      key: 'document-audit-trail',
      path: documentRouteMap['document-audit-trail'],
      title: 'Document audit trail',
      description: 'Track who viewed and approved documents.',
      buttonLabel: 'View logs',
    },
  ];

  tiles.forEach((tile) => {
    grid.appendChild(createDocumentTile(tile));
  });

  adminDocumentsSection.appendChild(grid);

  createDocumentRepositoryView();

  adminDocumentsInitialized = true;
}

function setActiveDocumentSection(key = '') {
  activeDocumentSection = key || '';
  const isRepository = activeDocumentSection === 'documents-repository';
  if (adminDocumentsSection) {
    adminDocumentsSection.dataset.activeDocument = activeDocumentSection;
  }
  if (adminDocumentsHeader) adminDocumentsHeader.classList.toggle('hidden', isRepository);
  if (documentTilesGrid) documentTilesGrid.classList.toggle('hidden', isRepository);
  if (documentRepositoryPage) {
    documentRepositoryPage.classList.toggle('hidden', !isRepository);
    if (isRepository) {
      documentRepositoryPage.classList.remove('fade-in');
      void documentRepositoryPage.offsetWidth;
      documentRepositoryPage.classList.add('fade-in');
    }
  }
  if (documentRepositoryCard) {
    documentRepositoryCard.classList.toggle('hidden', !isRepository);
  }
  const handler = documentSectionHandlers[activeDocumentSection];
  if (typeof handler === 'function') handler();
}

function getDocumentSectionKeyFromPath(path = '') {
  const normalizedPath = path.endsWith('/') && path !== documentRouteBase ? path.slice(0, -1) : path;
  if (normalizedPath === documentRouteBase) return '';
  return documentRouteLookup[normalizedPath] || '';
}

function handleDocumentRoute(path = documentRouteBase, { pushState = false, key } = {}) {
  if (!path.startsWith(documentRouteBase)) return false;
  showAdminSection('documents');
  ensureAdminDocumentsUI();
  const sectionKey = key || getDocumentSectionKeyFromPath(path);

  if (pushState && window.location.pathname !== path) {
    history.pushState({ documentRoute: path }, '', path);
  }

  setActiveDocumentSection(sectionKey);
  return true;
}

function loadAdminDocuments() {
  ensureAdminDocumentsUI();
}

function showAdminSection(section = 'dashboard') {
  if (sessionRequiresPasswordChange()) {
    adminSections.forEach((el) => el.classList.add('hidden'));
    showChangePasswordModal(true);
    return;
  }
  if (!adminSections.length) return;
  const hasSection = Array.from(adminSections).some((el) => el.dataset.section === section);
  const target = hasSection ? section : 'dashboard';

  adminSections.forEach((el) => {
    el.classList.toggle('hidden', el.dataset.section !== target);
  });

  adminMenuItems.forEach((item) => {
    const isActive = item.dataset.section === target;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-selected', isActive ? 'true' : 'false');
  });

  if (target === 'documents') {
    loadAdminDocuments();
  } else if (target === 'loans') {
    loadAdminLoans();
  } else if (target === 'leads') {
    ensureAdminLeadsUI();
    clearLeadsRouteView();
    loadAdminLeads();
  }
}

function clearStaffRouteView() {
  if (!staffRoutePlaceholder) return;
  staffRoutePlaceholder.classList.add('hidden');
  const grid = staffRoutePlaceholder.parentElement?.querySelector('.subcard-grid');
  grid?.classList.remove('hidden');
  if (staffRouteTitle) staffRouteTitle.textContent = '';
  if (staffRouteDescription) staffRouteDescription.textContent = '';
  if (staffRoutePath) staffRoutePath.textContent = '';
  const content = document.querySelector('#staff-route-content');
  if (content) content.innerHTML = '';
}

function renderStaffRoute(path) {
  if (!staffRoutePlaceholder || !staffRoutes[path]) return;
  showAdminSection('staff-roles');

  const grid = staffRoutePlaceholder.parentElement?.querySelector('.subcard-grid');
  grid?.classList.add('hidden');

  const content = document.querySelector('#staff-route-content') || (() => {
    const node = document.createElement('div');
    node.id = 'staff-route-content';
    staffRoutePlaceholder.appendChild(node);
    return node;
  })();

  if (staffRouteTitle) staffRouteTitle.textContent = staffRoutes[path].title;
  if (staffRouteDescription) staffRouteDescription.textContent = staffRoutes[path].description;
  if (staffRoutePath) staffRoutePath.textContent = '';
  content.innerHTML = '';

  if (path === '/admin/staff-list') {
    const { role } = getSession();
    if (role !== 'admin') {
      content.innerHTML =
        '<p class="alert error">Admins only. Please sign in with an admin account to view staff.</p>';
      return;
    }

    const actions = document.createElement('div');
    actions.className = 'table-actions';
    const spacer = document.createElement('div');
    actions.appendChild(spacer);

    const addStaffBtn = document.createElement('button');
    addStaffBtn.type = 'button';
    addStaffBtn.className = 'primary';
    addStaffBtn.textContent = 'Add staff';
    addStaffBtn.addEventListener('click', () => alert('Add staff – TODO'));
    actions.appendChild(addStaffBtn);

    const statusMessage = document.createElement('p');
    statusMessage.className = 'alert hidden';

    const tableWrapper = document.createElement('div');
    tableWrapper.className = 'loan-table-wrapper';

    const table = document.createElement('table');
    table.className = 'placeholder-table loan-table';

    table.innerHTML = `
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Role</th>
          <th>Status</th>
          <th>Last login</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody></tbody>
    `;

    const tbody = table.querySelector('tbody');
    const showLoading = () => {
      tbody.innerHTML = '<tr><td colspan="6" class="muted">Loading staff...</td></tr>';
    };

    const renderRows = (staff = []) => {
      statusMessage.classList.add('hidden');
      tbody.innerHTML = '';
      if (!staff.length) {
        tbody.innerHTML = '<tr><td colspan="6" class="muted">No staff members found.</td></tr>';
        return;
      }

      staff.forEach((user) => {
        const tr = document.createElement('tr');
        const lastLogin = formatDate(user.last_login_at) || user.last_login_at || '-';
        tr.innerHTML = `
          <td>${user.name || ''}</td>
          <td>${user.email || ''}</td>
          <td>${user.role || ''}</td>
          <td>${user.is_active ? 'Active' : 'Inactive'}</td>
          <td>${lastLogin || '-'}</td>
          <td><button type="button" class="ghost">Manage</button></td>
        `;
        tbody.appendChild(tr);
      });
    };

    const showError = () => {
      statusMessage.textContent = 'Unable to load staff list. Please try again.';
      statusMessage.className = 'alert error';
      statusMessage.classList.remove('hidden');
      tbody.innerHTML = '<tr><td colspan="6" class="muted">No staff to display.</td></tr>';
    };

    const loadStaffList = async () => {
      showLoading();
      try {
        const staffResponse = await api.get('/admin/staff');
        const staff = Array.isArray(staffResponse)
          ? staffResponse
          : staffResponse?.staff || staffResponse?.data || [];
        renderRows(staff);
      } catch (error) {
        console.error('Failed to load staff list', error);
        showError();
      }
    };

    tableWrapper.appendChild(table);

    content.appendChild(actions);
    content.appendChild(statusMessage);
    content.appendChild(tableWrapper);

    loadStaffList();
  } else {
    if (staffRoutePath)
      staffRoutePath.textContent = `Route: ${path} (placeholder view will be implemented soon).`;
  }

  staffRoutePlaceholder.classList.remove('hidden');
}

function navigateStaffRoute(path) {
  if (!staffRoutes[path]) return;
  history.pushState({ staffRoute: path }, '', path);
  renderStaffRoute(path);
}

function togglePanels(role) {
  ensureChangePasswordButton();
  dashboards.classList.toggle('hidden', !role);
  appShell?.classList.toggle('admin-shell', role === 'admin');
  dashboards?.classList.toggle('admin-dashboard-grid', role === 'admin');
  userRoleChip.classList.toggle('hidden', !role);
  logoutBtn.classList.toggle('hidden', !role);
  changePasswordBtn?.classList.toggle('hidden', !role);
  loginCard?.classList.toggle('hidden', !!role);

  adminPanel.classList.toggle('hidden', role !== 'admin');
  if (role === 'admin' && !sessionRequiresPasswordChange()) showAdminSection('dashboard');
  else {
    resetAdminLoanApplicationsState();
    resetAdminLoansState();
    resetAdminCustomersState();
    resetAdminLeadsState();
  }
  staffPanel.classList.toggle('hidden', role !== 'staff');
  customerPanel.classList.toggle('hidden', role !== 'customer');

  if (role) {
    userRoleChip.textContent = role;
  }
}

function normalizeDashboardMetrics(raw = {}) {
  const source = raw?.data ?? raw ?? {};
  const metricValue = (snakeCaseKey, camelCaseKey) => {
    if (Object.prototype.hasOwnProperty.call(source, snakeCaseKey)) {
      return source[snakeCaseKey];
    }
    if (Object.prototype.hasOwnProperty.call(source, camelCaseKey)) {
      return source[camelCaseKey];
    }
    return null;
  };

  return {
    totalCustomers: metricValue('total_customers', 'totalCustomers'),
    totalLoans: metricValue('total_loans', 'totalLoans'),
    activeLoans: metricValue('active_loans', 'activeLoans'),
    paymentsToday: metricValue('payments_today', 'paymentsToday'),
  };
}

function renderDashboardMetrics(metrics) {
  renderMetrics(adminMetrics, [
    { label: 'Total Customers', value: String(metrics.totalCustomers ?? '—'), hint: 'All customer records' },
    { label: 'Total Loans', value: String(metrics.totalLoans ?? '—'), hint: 'All loan records' },
    { label: 'Active Loans', value: String(metrics.activeLoans ?? '—'), hint: 'Currently active loans' },
    { label: 'Payments Today', value: String(metrics.paymentsToday ?? '—'), hint: 'Payments received today' },
  ]);
}

function renderDashboardMetricsLoading() {
  renderMetrics(adminMetrics, [
    { label: 'Total Customers', value: 'Loading...', hint: 'All customer records' },
    { label: 'Total Loans', value: 'Loading...', hint: 'All loan records' },
    { label: 'Active Loans', value: 'Loading...', hint: 'Currently active loans' },
    { label: 'Payments Today', value: 'Loading...', hint: 'Payments received today' },
  ]);
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

function showDashboardMetricsError() {
  if (!adminMetrics) return;
  let alert = document.querySelector('#admin-dashboard-metrics-message');
  if (!alert) {
    alert = document.createElement('p');
    alert.id = 'admin-dashboard-metrics-message';
    adminMetrics.insertAdjacentElement('beforebegin', alert);
  }
  alert.className = 'alert error';
  alert.innerHTML = 'Dashboard metrics could not be loaded. <button type="button" class="link-button" id="admin-dashboard-metrics-retry">Retry</button>';
  alert.querySelector('#admin-dashboard-metrics-retry')?.addEventListener('click', () => loadAdmin());
}

function clearDashboardMetricsError() {
  const alert = document.querySelector('#admin-dashboard-metrics-message');
  if (alert) alert.remove();
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
      formatCurrency(item.amount);
    staffCollections.appendChild(node);
  });
}

function renderActiveLoans(loans) {
  staffActiveLoans.innerHTML = '';
  const template = document.querySelector('#active-loan-template');
  if (!loans.length) {
    staffActiveLoans.innerHTML = '<p class="muted">No active loans for collections today.</p>';
    return;
  }

  loans.forEach((loan) => {
    const node = template.content.cloneNode(true);
    node.querySelector('.item-title').textContent = loan.borrower_name || loan.customer || 'Loan';
    node.querySelector('.item-subtitle').textContent =
      `Balance: ${formatCurrency(loan.outstanding_balance ?? loan.balance ?? loan.amount)} · ` +
      `ID: ${loan.id ?? loan.loan_id ?? loan.reference ?? '—'}`;
    node.querySelector('.record-payment-action').addEventListener('click', () => {
      openPaymentSheet(loan);
    });
    staffActiveLoans.appendChild(node);
  });
}


function titleCase(value) {
  return String(value || '').toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase());
}

function collectLoanTermSource(record = {}) {
  return { ...(record.loan_details || record.loanDetails || {}), ...record };
}

function getLoanTermInfo(record = {}) {
  const source = collectLoanTermSource(record);
  let type = String(source.term_type || source.termType || '').toUpperCase();
  let value = Number(source.term_value ?? source.termValue ?? 0);
  if (!type && Number(source.loan_days ?? source.loanDays ?? 0) > 0) {
    type = 'DAYS';
    value = Number(source.loan_days ?? source.loanDays);
  } else if (!type && Number(source.tenure_months ?? source.tenureMonths ?? source.approved_tenure ?? 0) > 0) {
    type = 'MONTHS';
    value = Number(source.tenure_months ?? source.tenureMonths ?? source.approved_tenure);
  }
  if (!value && type === 'DAYS') value = Number(source.loan_days ?? source.loanDays ?? 0);
  if (!value && type === 'MONTHS') value = Number(source.tenure_months ?? source.tenureMonths ?? source.approved_tenure ?? 0);
  return { type, value: Number.isFinite(value) ? value : 0 };
}

function formatLoanTerm(record = {}) {
  const { type, value } = getLoanTermInfo(record);
  if (!value) return '—';
  return type === 'MONTHS' ? `${value} month${value === 1 ? '' : 's'}` : `${value} day${value === 1 ? '' : 's'}`;
}

function estimateInstallmentCount(termType, termValue, frequency) {
  const value = Number(termValue) || 0;
  const freq = String(frequency || '').toUpperCase();
  if (!value || !freq) return 0;
  if (termType === 'DAYS') {
    if (freq === 'DAILY') return value;
    if (freq === 'WEEKLY') return Math.ceil(value / 7);
    if (freq === 'MONTHLY') return Math.max(1, Math.ceil(value / 30));
  }
  if (termType === 'MONTHS') {
    if (freq === 'MONTHLY') return value;
    if (freq === 'WEEKLY') return Math.ceil(value * 30 / 7);
    if (freq === 'DAILY') return value * 30;
  }
  return 0;
}

function calculateLoanPreview(data = {}) {
  const source = collectLoanTermSource(data);
  const term = getLoanTermInfo(source);
  const principal = Number(source.applied_amount ?? source.approved_amount ?? source.principal_amount ?? source.principal ?? source.amount ?? 0) || 0;
  const rate = Number(source.interest_rate ?? source.interestRate ?? 0) || 0;
  const frequency = String(source.repayment_frequency ?? source.repaymentFrequency ?? '').toUpperCase();
  const installmentCount = Number(source.installment_count ?? source.installmentCount ?? 0) || estimateInstallmentCount(term.type, term.value, frequency);
  const totalInterest = Number(source.total_interest ?? source.totalInterest ?? 0) || (principal * rate / 100);
  const totalPayable = Number(source.total_payable ?? source.totalPayable ?? 0) || (principal + totalInterest);
  const installmentAmount = Number(source.installment_amount ?? source.installmentAmount ?? source.estimated_installment_amount ?? 0) || (installmentCount ? totalPayable / installmentCount : 0);
  return { ...term, principal, rate, frequency, installmentCount, totalInterest, totalPayable, installmentAmount };
}

function renderLoanSummaryRows(summary) {
  return [
    ['Principal', formatCurrency(summary.principal)],
    ['Term', formatLoanTerm({ term_type: summary.type, term_value: summary.value })],
    ['Repayment frequency', titleCase(summary.frequency) || '—'],
    ['Number of installments', summary.installmentCount || '—'],
    ['Interest', formatCurrency(summary.totalInterest)],
    ['Total payable', formatCurrency(summary.totalPayable)],
    ['Installment amount', formatCurrency(summary.installmentAmount)],
    ['Final due', summary.value ? `${formatLoanTerm({ term_type: summary.type, term_value: summary.value })} after disbursement` : '—'],
  ];
}

function renderReviewQueue(container, messageEl, applications, emptyText, onSelect) {
  container.innerHTML = '';
  if (messageEl) messageEl.classList.add('hidden');

  const template = document.querySelector('#review-template');
  if (!applications.length) {
    container.innerHTML = `<p class="muted">${emptyText}</p>`;
    return;
  }

  applications.forEach((app) => {
    const node = template.content.cloneNode(true);
    const title = app.application_number
      ? `Application #${app.application_number}`
      : `Application ${app.id}`;
    node.querySelector('.review-title').textContent = title;
    const termLabel = formatLoanTerm(app);
    const amount = app.applied_amount ?? app.loan_details?.applied_amount;
    const loanType = app.loan_type ?? app.loan_details?.loan_type ?? 'Loan';
    node.querySelector('.review-meta').textContent =
      `${loanType} • ${amount ? formatCurrency(amount) : 'Amount pending'}${
        termLabel !== '—' ? ` • ${termLabel}` : ''
      }`;
    node.querySelector('.review-customer').textContent = app.customer_name || app.customer || '';
    node.querySelector('.review-status').textContent = app.status || 'Unknown';
    node.querySelector('.review-date').textContent = formatDate(app.created_at || app.createdAt);
    node.querySelector('.list-item').addEventListener('click', () => onSelect(app));
    container.appendChild(node);
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
    const termLabel = formatLoanTerm(app);
    const amount = app.applied_amount ?? app.loan_details?.applied_amount;
    const loanType = app.loan_type ?? app.loanDetails?.loan_type ?? 'Loan';
    node.querySelector('.application-title').textContent = title;
    node.querySelector('.application-meta').textContent =
      `${loanType} • ${amount ? formatCurrency(amount) : 'Amount pending'}${
        termLabel !== '—' ? ` • ${termLabel}` : ''
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
  setInlineAlert(adminApplicationsMessage, '');
  clearDashboardMetricsError();
  renderDashboardMetricsLoading();
  try {
    const [dashboardResult, applicationsResult] = await Promise.allSettled([
      api(endpoint('adminDashboard')),
      api(`${endpoint('staffLoanApplications')}?status=STAFF_APPROVED`),
    ]);

    if (dashboardResult.status === 'fulfilled') {
      const response = dashboardResult.value;
      const metrics = normalizeDashboardMetrics(response);
      renderDashboardMetrics(metrics);
    } else {
      console.error('Failed to load dashboard metrics', dashboardResult.reason);
      showDashboardMetricsError();
      renderMetrics(adminMetrics, [
        { label: 'Total Customers', value: '—', hint: 'All customer records' },
        { label: 'Total Loans', value: '—', hint: 'All loan records' },
        { label: 'Active Loans', value: '—', hint: 'Currently active loans' },
        { label: 'Payments Today', value: '—', hint: 'Payments received today' },
      ]);
    }

    if (applicationsResult.status === 'rejected') {
      throw applicationsResult.reason;
    }

    const applicationsResponse = applicationsResult.value;
    const applications = normalizeApplicationsResponse(applicationsResponse);
    cachedAdminApplications = applications;
    renderReviewQueue(
      adminApplications,
      adminApplicationsMessage,
      applications,
      'No applications awaiting final approval.',
      (app) => openApplicationDetail(app, 'admin'),
    );
  } catch (error) {
    console.error('Failed to load admin data', error);
    const fallbackMessage = "Couldn't reach the server. Please check your connection.";
    setInlineAlert(
      adminApplicationsMessage,
      error?.message ? fallbackMessage : "Couldn't load applications – tap Refresh to try again.",
      'error',
    );
  } finally {
    cleanupInactiveOverlays();
  }
}

async function loadStaff() {
  setInlineAlert(staffApplicationsMessage, '');
  try {
    const [collectionsResponse, activeLoansResponse, applicationsResponse] = await Promise.all([
      api(endpoint('staffTodayCollections')),
      api(endpoint('staffActiveLoans')),
      api(`${endpoint('staffLoanApplications')}?status=SUBMITTED`),
    ]);

    renderCollections(collectionsResponse.collections || collectionsResponse || []);

    const activeLoans = Array.isArray(activeLoansResponse)
      ? activeLoansResponse
      : activeLoansResponse.loans || activeLoansResponse.data || [];
    cachedActiveLoans = activeLoans;
    renderActiveLoans(activeLoans);

    const applications = normalizeApplicationsResponse(applicationsResponse);
    cachedStaffApplications = applications;
    renderReviewQueue(
      staffApplications,
      staffApplicationsMessage,
      applications,
      'No applications awaiting review.',
      (app) => openApplicationDetail(app, 'staff'),
    );
  } catch (error) {
    console.error('Failed to load staff data', error);
    const friendly = "Couldn't load applications – tap Refresh to try again.";
    const details = error?.message ? ` (${error.message})` : '';
    setInlineAlert(staffApplicationsMessage, `${friendly}${details}`, 'error');
  }
}

async function fetchCustomerRecordById(customerId) {
  if (!customerId) throw new Error('Customer ID is required to start an application.');
  const path = `${endpoint('customers')}/${encodeURIComponent(customerId)}`;
  return api(path);
}

function extractCustomerStatuses(customer = {}) {
  return {
    kyc: normalizeCustomerStatus(customer.kyc_status || customer.kycStatus || customer.status),
    eligibility: normalizeCustomerStatus(customer.eligibility_status || customer.eligibilityStatus),
  };
}

async function ensureCustomerEligibilityForApplication() {
  const customerId = resolveActiveCustomerId();
  if (!customerId) {
    setInlineAlert(
      applicationFormMessage,
      'Unable to start application: missing customer information.',
      'error'
    );
    applicationFormCard?.classList.add('hidden');
    return null;
  }

  try {
    const customer = await fetchCustomerRecordById(customerId);
    cachedCustomerRecord = customer;
    setActiveCustomerId(getCustomerId(customer) || customerId);

    const { kyc, eligibility } = extractCustomerStatuses(customer);

    if (kyc !== 'APPROVED') {
      applicationFormCard?.classList.add('hidden');
      setInlineAlert(
        applicationFormMessage,
        'Your KYC verification is not yet approved. Please contact support or wait until verification is complete.',
        'error'
      );
      return null;
    }

    if (eligibility !== 'ELIGIBLE') {
      applicationFormCard?.classList.add('hidden');
      setInlineAlert(
        applicationFormMessage,
        'You are currently not eligible to apply for a loan based on our assessment.',
        'error'
      );
      return null;
    }

    setInlineAlert(applicationFormMessage, '');
    return customer;
  } catch (error) {
    console.error('Unable to verify customer eligibility', error);
    const friendlyMessage =
      error?.status === 400
        ? error.message ||
          'We could not start a loan application because your eligibility or KYC status has changed.'
        : error?.message || 'Unable to load customer details. Please try again later.';
    applicationFormCard?.classList.add('hidden');
    setInlineAlert(applicationFormMessage, friendlyMessage, 'error');
    return null;
  }
}

async function loadCustomer() {
  const profile = await api(endpoint('customerProfile'));
  cachedProfile = profile;
  setActiveCustomerId(getCustomerId(profile));

  if (resolveActiveCustomerId()) {
    try {
      cachedCustomerRecord = await fetchCustomerRecordById(resolveActiveCustomerId());
    } catch (error) {
      console.warn('Unable to load customer record for eligibility checks', error);
    }
  }
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

function closeApplicationDetail() {
  applicationModal.classList.add('hidden');
  applicationModalContent.innerHTML = '';
  applicationModalActions.innerHTML = '';
}

function renderApplicationDetails(app) {
  applicationModalContent.innerHTML = '';
  const summary = calculateLoanPreview(app);
  const fields = [
    ['Customer', app.customer_name || app.customer || '—'],
    ['Loan type', app.loan_type || app.loan_details?.loan_type || '—'],
    [
      'Requested amount',
      formatCurrency(app.applied_amount ?? app.loan_details?.applied_amount ?? app.amount ?? app.approved_amount),
    ],
    ['Loan term', formatLoanTerm(app)],
    ['Repayment frequency', titleCase(summary.frequency) || '—'],
    ['Installments', summary.installmentCount || '—'],
    ['Interest', `${summary.rate || 0}% flat for full term`],
    ['Total interest', formatCurrency(summary.totalInterest)],
    ['Total payable', formatCurrency(summary.totalPayable)],
    ['Purpose', app.loan_purpose || app.loan_details?.loan_purpose || '—'],
    ['Status', app.status || '—'],
    ['Created', formatDate(app.created_at || app.createdAt) || '—'],
  ];

  fields.forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'review-row';
    row.innerHTML = `<span>${label}</span><span>${value || '—'}</span>`;
    applicationModalContent.appendChild(row);
  });
}

async function openApplicationDetail(appSummary, role) {
  const appId = resolveApplicationId(appSummary);
  applicationModal.classList.remove('hidden');
  applicationModalActions.innerHTML = '';
  applicationModalContent.innerHTML = '<p class="muted">Loading application...</p>';
  applicationModalTitle.textContent = appSummary.application_number
    ? `Application #${appSummary.application_number}`
    : `Application ${appId ?? ''}`;
  applicationModalStatus.textContent = appSummary.status || '';
  applicationModalRoleLabel.textContent = role === 'admin' ? 'Admin' : 'Staff';
  setInlineAlert(applicationModalMessage, '');

  try {
    const app = appId ? await api(`${endpoint('loanApplications')}/${appId}`) : appSummary;
    renderApplicationDetails(app);
    applicationModalStatus.textContent = app.status || appSummary.status || '';
    const availableActions = Array.isArray(app?.available_actions ?? app?.availableActions)
      ? (app.available_actions ?? app.availableActions).map((action) => String(action).toLowerCase())
      : [];
    applicationModalActions.innerHTML = '';

    const addAction = (label, handler, variant = 'primary') => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = variant === 'primary' ? 'primary' : 'ghost';
      btn.textContent = label;
      btn.addEventListener('click', handler);
      applicationModalActions.appendChild(btn);
    };

      const approvedAmount =
        app?.approved_amount ??
        app?.applied_amount ??
        app?.loan_details?.applied_amount ??
        app?.amount ??
        app?.requested_amount ??
        appSummary?.approved_amount ??
        appSummary?.applied_amount ??
        appSummary?.loan_details?.applied_amount ??
        appSummary?.amount ??
        appSummary?.requested_amount;

      const approvedTenure =
        app?.term_value ??
        app?.loan_details?.term_value ??
        app?.approved_tenure ??
        app?.tenure_months ??
        app?.loan_details?.tenure_months ??
        appSummary?.term_value ??
        appSummary?.loan_details?.term_value ??
        appSummary?.approved_tenure ??
        appSummary?.tenure_months;

    const handleApprove = async () => {
      try {
        setInlineAlert(applicationModalMessage, 'Submitting approval...', 'success');
        const endpointKey = role === 'staff' ? 'staffLoanApplicationApprove' : 'adminLoanApplicationApprove';
        await api(endpoint(endpointKey, { id: appId }), {
          method: 'POST',
          body: { approved_amount: approvedAmount, approved_tenure: approvedTenure },
        });
        setInlineAlert(applicationModalMessage, 'Application approved.', 'success');
        if (appId) await openApplicationDetail({ ...appSummary, id: appId }, role);
        if (role === 'staff') await loadStaff();
        if (role === 'admin') {
          await Promise.all([loadAdmin(), loadAdminLoanApplicationsAll(true)]);
        }
      } catch (err) {
        console.error('Failed to approve loan application', err);
        setInlineAlert(applicationModalMessage, err.message || 'Failed to approve application. Please try again.', 'error');
      }
    };

    const handleReject = async () => {
      const reason = prompt('Reason for rejection (optional)') || '';
      try {
        setInlineAlert(applicationModalMessage, 'Submitting rejection...', 'success');
        await api(endpoint('loanApplicationReject', { id: appId }), {
          method: 'POST',
          body: reason ? { reason, reject_reason: reason } : {},
        });
        setInlineAlert(applicationModalMessage, 'Application rejected.', 'success');
        if (appId) await openApplicationDetail({ ...appSummary, id: appId }, role);
        if (role === 'staff') await loadStaff();
        if (role === 'admin') {
          await Promise.all([loadAdmin(), loadAdminLoanApplicationsAll(true)]);
        }
      } catch (err) {
        console.error('Failed to reject loan application', err);
        setInlineAlert(applicationModalMessage, err.message || 'Failed to reject application. Please try again.', 'error');
      }
    };

    const handleDisburse = async (event) => {
      event?.preventDefault?.();
      event?.stopPropagation?.();
      if (applicationModalActions.dataset.loadingDisbursement === 'true') return;
      applicationModalActions.dataset.loadingDisbursement = 'true';
      const modal = document.createElement('div');
      modal.className = 'modal-overlay historical-accounting-modal';
      const appNo = app.application_number || app.applicationNumber || appId;
      const customer = app.applicant_details?.full_name || app.applicant_details?.name || app.customer_name || '-';
      const fallbackPrincipal = Number(app.approved_amount || app.applied_amount || app.amount || app.loan_details?.principal_amount || 0);
      const renderShell = (body) => { modal.innerHTML = `<div class="modal-card wide"><div class="modal-header"><h2>Disburse Loan</h2><button type="button" class="icon-button" data-close-disburse>×</button></div><div id="disburse-body">${body}</div></div>`; modal.querySelectorAll('[data-close-disburse]').forEach(b=>b.onclick=()=>modal.remove()); };
      const renderLoading = () => renderShell('<div class="alert success">Loading disbursement configuration...</div>');
      const disbursementErrorMessage = (err) => {
        if (err?.name === 'AbortError') return 'Disbursement setup took too long to load. Please retry.';
        if (err?.status === 401) return 'Your session has expired. Please sign in again.';
        if (err?.status === 403) return 'You do not have permission to disburse this loan.';
        if (err?.status === 422) return err.message || 'Disbursement configuration is invalid.';
        if (err?.status >= 500) return err.message || 'Disbursement setup could not be loaded. Please retry.';
        return err?.message || 'Disbursement setup could not be loaded. Please retry.';
      };
      const renderError = (err) => renderShell(`<div class="alert error">${escapeHtml(disbursementErrorMessage(err))}</div><div class="modal-actions sticky-modal-footer"><button type="button" class="secondary" data-close-disburse>Cancel</button><button type="button" class="primary" id="retry-disburse-options">Retry</button></div>`);
      const loadOptions = async () => {
        console.log('Opening disbursement', appId);
        console.time('load-disbursement-options');
        try {
          const optionsPath = endpoint('loanApplicationDisbursementOptions', { id: appId });
          const data = await fetchWithTimeout(optionsPath, {}, 15000);
          console.log('Disbursement options loaded', { path: optionsPath, status: 200 });
          return data || {};
        } finally {
          console.timeEnd('load-disbursement-options');
        }
      };
      const renderForm = (options) => {
        const money = (value) => Math.round((Number(String(value ?? 0).replace(/,/g, '')) || 0) * 100) / 100;
        const pick = (obj, keys, fallback = '') => { for (const k of keys) if (obj?.[k] !== undefined && obj?.[k] !== null && obj?.[k] !== '') return obj[k]; return fallback; };
        const labelAccount = (a) => [a?.code || a?.account_code || a?.accountCode, a?.name || a?.account_name || a?.accountName].filter(Boolean).join(' ');
        const summary = options.application || options.application_summary || options.applicationSummary || app;
        const settings = options.disbursement_settings || options.disbursementSettings || options.settings || {};
        const rawChargeTypes = accountItems(options.charge_types || options.chargeTypes || options.charges || []);
        const defaultCharges = accountItems(options.default_charges || options.defaultCharges || options.default_disbursement_charges || []);
        const rawMappings = options.default_charge_mappings || options.defaultChargeMappings || options.charge_mappings || {};
        const fundingAccounts = options.funding_accounts ?? options.accounts ?? options.options?.funding_accounts ?? options.eligible_funding_accounts ?? options.eligibleFundingAccounts ?? options.fundingAccounts ?? [];
        const accounts = accountItems(fundingAccounts);
        const principal = money(pick(summary, ['gross_principal','grossPrincipal','principal','principal_amount','principalAmount','approved_amount','approvedAmount','applied_amount','appliedAmount'], fallbackPrincipal));
        const canManageCharges = role === 'admin' || accountingCan('loan.disbursement.charges.manage') || accountingCan('accounting.settings.manage');
        const canWaiveCharges = accountingCan('loan.disbursement.charges.waive') || canManageCharges;
        const normalizeChargeType = (c) => {
          const destinationAccount = c.destination_account || c.destinationAccount || c.income_account || c.incomeAccount || c.gl_account || c.glAccount || c.destination_gl_account || c.destinationGlAccount || null;
          const account = destinationAccount || {};
          const id = pick(c, ['charge_type_id','chargeTypeId','id','type_id','typeId']);
          const destinationAccountLabel = labelAccount(account) || pick(c, ['destination_account_label','destinationAccountLabel','income_account_label','incomeAccountLabel','gl_account_label','glAccountLabel','destination_gl_account_label','destinationGlAccountLabel'], '') || [pick(c, ['destination_account_code','destinationAccountCode','income_account_code','incomeAccountCode','gl_account_code','glAccountCode'], ''), pick(c, ['destination_account_name','destinationAccountName','income_account_name','incomeAccountName','gl_account_name','glAccountName'], '')].filter(Boolean).join(' ');
          return {
            id,
            code: pick(c, ['code','charge_code','chargeCode'], ''),
            name: pick(c, ['name','label','charge_name','chargeName','type'], 'Disbursement charge'),
            amount: money(pick(c, ['amount','default_amount','defaultAmount','default_value','defaultValue'], 0)),
            calculationMethod: pick(c, ['calculation_method','calculationMethod','method'], 'FIXED_AMOUNT'),
            accountingTreatment: pick(c, ['accounting_treatment','accountingTreatment','treatment'], 'Income'),
            destinationAccount,
            destinationAccountId: pick(c, ['destination_account_id','destinationAccountId','destination_gl_account_id','destinationGlAccountId','gl_account_id','glAccountId','income_account_id','incomeAccountId'], account.id || rawMappings[id] || rawMappings[c.code] || rawMappings[c.name] || ''),
            destinationAccountLabel,
            selectedByDefault: boolFromBackend(c.selected_by_default ?? c.selectedByDefault ?? c.required, false),
            required: boolFromBackend(c.required ?? c.is_required ?? c.mandatory ?? (String(c.code || '').toUpperCase() === 'DOC_FEE' && settings.require_documentation_charge), false),
            canEdit: boolFromBackend(c.can_edit ?? c.canEdit, true),
            canRemove: boolFromBackend(c.can_remove ?? c.canRemove, true),
            canWaive: boolFromBackend(c.can_waive ?? c.canWaive, canWaiveCharges),
          };
        };
        const chargeTypes = (Array.isArray(rawChargeTypes) ? rawChargeTypes : []).filter(c => c.active !== false && c.is_active !== false).map(normalizeChargeType);
        const byId = new Map(chargeTypes.map(c => [String(c.id), c]));
        const selectedCharges = [];
        defaultCharges.forEach(dc => {
          const id = pick(dc, ['charge_type_id','chargeTypeId','id','type_id','typeId']);
          const defaultCharge = normalizeChargeType(dc);
          const base = byId.get(String(id)) || defaultCharge;
          selectedCharges.push({ ...base, destinationAccount: defaultCharge.destinationAccount || base.destinationAccount, destinationAccountId: defaultCharge.destinationAccountId || base.destinationAccountId, destinationAccountLabel: defaultCharge.destinationAccountLabel || base.destinationAccountLabel, id: base.id || id, amount: money(pick(dc, ['amount','default_amount','defaultAmount'], base.amount)) });
        });
        chargeTypes.filter(c => c.selectedByDefault && !selectedCharges.some(x => String(x.id) === String(c.id))).forEach(c => selectedCharges.push({ ...c }));
        const requireDoc = boolFromBackend(settings.require_documentation_charge ?? settings.requireDocumentationCharge, false);
        const defaultMethod = settings.default_transaction_method || settings.defaultTransactionMethod || 'BANK_TRANSFER';
        const defaultInterestMethod = settings.default_interest_accounting_method || settings.defaultInterestAccountingMethod || 'ACCRUAL_BY_INSTALLMENT';
        const historicalMode = String(settings.backdated_loan_accounting || settings.backdatedLoanAccounting || settings.historical_accrual_mode || 'ASK').toUpperCase();
        const methodReadOnly = boolFromBackend(settings.interest_accounting_method_locked ?? settings.interestAccountingMethodLocked, true);
        const applicationId = app.id ?? app.application_id;
        if (!Number.isInteger(Number(applicationId))) {
          renderShell('<div class="alert error">A valid loan application ID is required.</div><div class="modal-actions sticky-modal-footer"><button type="button" class="secondary" data-close-disburse>Cancel</button></div>');
          return;
        }
        let previewOk = false, previewBalanced = false, previewData = null, previewPayload = null, previewTimer = null, previewAbortController = null, previewValidationErrors = [], previewErrorText = '', previewSequence = 0;
        let historicalChoice = historicalMode === 'AUTO' ? 'AUTO' : historicalMode === 'NONE' ? 'NONE' : 'CREATE';
        renderShell(`<div id="disburse-error"></div><p><strong>Application Number:</strong> ${escapeHtml(appNo)} &nbsp; <strong>Customer Name:</strong> ${escapeHtml(customer)}</p><div class="accounting-grid"><p><strong>Gross principal</strong><br><span id="gross-principal">${formatCurrency(principal)}</span></p><label>Disbursement date *<input id="disburse-date" type="date" value="${todayDateOnly()}"></label><label>Transaction method *<select id="disburse-method"><option>BANK_TRANSFER</option><option>CASH</option><option>CHEQUE</option><option>OTHER</option></select></label><label>Funding account *<select id="funding-account"><option value="">Select funding account</option></select><small id="funding-account-empty"></small></label><label>Reference<input id="disburse-reference" placeholder="Required for bank transfer or cheque"></label><label>Interest accounting method<select id="interest-accounting-method" ${methodReadOnly ? 'disabled' : ''}><option value="ACCRUAL_BY_INSTALLMENT">Accrual by installment</option><option value="CASH_BASIS">Cash basis</option></select><small>${methodReadOnly ? 'Inherited from Accounting Settings.' : 'Override allowed by Accounting Settings.'}</small></label><label>Remarks<textarea id="disburse-remarks"></textarea></label></div><div class="subcard"><div class="card-header"><strong>Disbursement deductions</strong><button type="button" class="secondary" id="add-deduction" ${chargeTypes.length ? '' : 'disabled'}>Add Deduction</button></div><div id="charge-empty"></div><div class="table-scroll"><table><thead><tr><th>Charge</th><th>Amount</th><th>Calculation</th><th>Treatment</th><th>Posts to</th><th>Actions</th></tr></thead><tbody id="charge-rows"></tbody></table></div><div id="charge-cards"></div><p><strong>Total deductions</strong><br><span id="total-deductions"></span></p><p><strong>Net amount to customer</strong><br><span id="net-amount"></span></p><p id="customer-net-message" class="alert success"></p></div><div id="historical-disbursement-panel"></div><div class="subcard"><strong>Journal preview</strong><div id="journal-preview"><p class="muted">Select a funding account to preview journal entries.</p></div></div><details id="historical-journal-details" class="subcard hidden"><summary>View details</summary><div id="historical-journal-detail-body"></div></details><div class="modal-actions sticky-modal-footer"><button type="button" class="secondary" data-close-disburse>Cancel</button><button type="button" id="confirm-disburse" disabled>Confirm Disbursement</button></div>`);
        const methodEl=modal.querySelector('#disburse-method'), accountEl=modal.querySelector('#funding-account'), refEl=modal.querySelector('#disburse-reference'), dateEl=modal.querySelector('#disburse-date'), confirm=modal.querySelector('#confirm-disburse'), errEl=modal.querySelector('#disburse-error'), interestMethodEl=modal.querySelector('#interest-accounting-method'), historicalPanel=modal.querySelector('#historical-disbursement-panel');
        methodEl.value = defaultMethod; interestMethodEl.value = defaultInterestMethod === 'CASH_BASIS' ? 'CASH_BASIS' : 'ACCRUAL_BY_INSTALLMENT';
        const validAccounts=()=>accounts.filter(a=>{const st=String(a.subtype||a.account_subtype||a.accountSubType).toUpperCase(); const m=methodEl.value; if(m==='CASH')return st==='CASH'; if(m==='BANK_TRANSFER'||m==='CHEQUE')return st==='BANK'; return st==='CASH'||st==='BANK'||!st;});
        const chargesPayload=()=>selectedCharges.filter(c=>!c.waived).map(c=>({charge_type_id:Number(c.id),amount:Number(money(c.amount))}));
        const renderHistoricalPanel=()=>{ historicalPanel.innerHTML=''; modal.querySelector('#historical-journal-details').classList.add('hidden'); };
        const normalizeJournalLine=(line={})=>{ const accountObject=typeof line.account==='object'&&line.account?line.account:null; const glObject=typeof line.gl_account==='object'&&line.gl_account?line.gl_account:null; return { accountId: line.account_id ?? line.accountId ?? accountObject?.id ?? glObject?.id ?? null, accountCode: line.account_code ?? line.accountCode ?? line.code ?? accountObject?.code ?? glObject?.code ?? '', accountName: line.account_name ?? line.accountName ?? accountObject?.name ?? glObject?.name ?? (typeof line.account==='string'?line.account:(typeof line.gl_account==='string'?line.gl_account:(line.description ?? ''))), amount: Number(line.amount ?? line.debit ?? line.credit ?? 0), raw: line }; };
        const normalizeDisbursementPreview=(raw)=>{ const source=raw?.data ?? raw?.preview ?? raw ?? {}; const journal=source.journal_preview ?? source.journalPreview ?? source.journal ?? source.entry_preview ?? {}; const debits=journal.debits ?? journal.debit_lines ?? source.debits ?? source.debit_lines ?? []; const credits=journal.credits ?? journal.credit_lines ?? source.credits ?? source.credit_lines ?? []; const flatLines=journal.lines ?? source.journal_lines ?? source.lines ?? []; const normalizedDebits=Array.isArray(debits)?debits.map(normalizeJournalLine):[]; const normalizedCredits=Array.isArray(credits)?credits.map(normalizeJournalLine):[]; if(normalizedDebits.length===0&&normalizedCredits.length===0&&Array.isArray(flatLines)){ for(const line of flatLines){ const side=String(line.side ?? line.entry_type ?? line.type ?? '').toUpperCase(); if(side==='DEBIT'||Number(line.debit||0)>0) normalizedDebits.push(normalizeJournalLine({...line,amount:Number(line.amount ?? line.debit ?? 0)})); if(side==='CREDIT'||Number(line.credit||0)>0) normalizedCredits.push(normalizeJournalLine({...line,amount:Number(line.amount ?? line.credit ?? 0)})); } } const totalDebit=Number(journal.total_debit ?? journal.totalDebit ?? source.total_debit ?? source.totalDebit ?? normalizedDebits.reduce((sum,line)=>sum+Number(line.amount ?? line.debit ?? 0),0)); const totalCredit=Number(journal.total_credit ?? journal.totalCredit ?? source.total_credit ?? source.totalCredit ?? normalizedCredits.reduce((sum,line)=>sum+Number(line.amount ?? line.credit ?? 0),0)); const balanced=journal.balanced ?? journal.is_balanced ?? journal.isBalanced ?? source.balanced ?? source.is_balanced ?? source.isBalanced ?? Math.abs(totalDebit-totalCredit)<=0.01; return { applicationId: source.application_id ?? source.applicationId, grossPrincipal: Number(source.gross_principal_amount ?? source.grossPrincipalAmount ?? source.principal_amount ?? source.principalAmount ?? 0), totalDeductions: Number(source.total_disbursement_deductions ?? source.total_deductions ?? source.totalDeductions ?? 0), netDisbursed: Number(source.net_disbursed_amount ?? source.net_amount ?? source.netDisbursedAmount ?? source.netAmount ?? 0), charges: source.charges ?? source.deductions ?? [], journal: { debits: normalizedDebits, credits: normalizedCredits, totalDebit, totalCredit, balanced: boolFromBackend(balanced, Math.abs(totalDebit-totalCredit)<=0.01) }, validationErrors: accountItems(source.validation_errors ?? source.validationErrors ?? source.errors ?? []) }; };
        const buildDisbursementPayload=()=>({ disbursement_date:dateEl.value, funding_account_id:Number(accountEl.value), transaction_method:methodEl.value, reference:refEl.value.trim(), remarks:modal.querySelector('#disburse-remarks').value.trim(), charges:chargesPayload() });
        const configMessages=()=>{ const msgs=[]; if(!accounts.length) msgs.push('No active bank or cash funding account is configured.'); if(!chargeTypes.length) msgs.push(requireDoc?'Documentation Charge is required but not configured.':'No disbursement charges are configured.'); if(!chargeTypes.length && !requireDoc) msgs.push(canManageCharges?'Configure Charges: Accounting Settings → Disbursement Charges':'Contact an administrator to configure disbursement charges.'); if(requireDoc && !selectedCharges.some(c=>String(c.code).toUpperCase()==='DOC_FEE'&&!c.waived)) msgs.push('Documentation Charge is required.'); selectedCharges.filter(c=>!c.waived).forEach(c=>{ if(!money(c.amount) || money(c.amount)<=0) msgs.push(`${c.name} amount must be greater than zero.`); if(!c.destinationAccount && !c.destinationAccountId && !c.destinationAccountLabel) msgs.push(String(c.code).toUpperCase()==='DOC_FEE'?'Documentation Charge must be linked to an income account.':`${c.name} has no destination GL account.`); }); const total=selectedCharges.reduce((s,c)=>s+(c.waived?0:money(c.amount)),0); if(total>=principal) msgs.push(total>principal?'Total deductions cannot exceed the loan principal.':'Net disbursed amount must be greater than zero.'); return msgs; };
        const renderPreview=(preview)=>{ previewValidationErrors=preview.validationErrors; previewBalanced=preview.journal.balanced===true; const debitRows=preview.journal.debits.map(l=>`<tr><td>Debit</td><td>${escapeHtml([l.accountCode,l.accountName].filter(Boolean).join(' '))}</td><td>${formatCurrency(l.amount)}</td><td></td></tr>`).join(''); const creditRows=preview.journal.credits.map(l=>`<tr><td>Credit</td><td>${escapeHtml([l.accountCode,l.accountName].filter(Boolean).join(' '))}</td><td></td><td>${formatCurrency(l.amount)}</td></tr>`).join(''); if(preview.journal.debits.length&&preview.journal.credits.length){ modal.querySelector('#journal-preview').innerHTML=`<div class="table-scroll"><table><thead><tr><th>Type</th><th>Account</th><th>Debit</th><th>Credit</th></tr></thead><tbody>${debitRows}${creditRows}</tbody></table></div><p><strong>Total Debit:</strong> ${formatCurrency(preview.journal.totalDebit)} &nbsp; <strong>Total Credit:</strong> ${formatCurrency(preview.journal.totalCredit)} &nbsp; <strong>Status:</strong> ${preview.journal.balanced?'Balanced':'Unbalanced'}</p>`; } else { modal.querySelector('#journal-preview').innerHTML='<div class="alert error">The preview response contains no debit or credit lines.</div>'; previewBalanced=false; } };
        const recalc=()=>{ const total=money(selectedCharges.reduce((s,c)=>s+(c.waived?0:money(c.amount)),0)); const net=money(principal-total); modal.querySelector('#total-deductions').textContent=formatCurrency(total); modal.querySelector('#net-amount').textContent=formatCurrency(net); modal.querySelector('#customer-net-message').textContent=`The customer will receive ${formatCurrency(net)}. The loan principal remains ${formatCurrency(principal)}.`; modal.querySelector('#charge-empty').innerHTML=chargeTypes.length?'':`<p class="muted">${requireDoc?'Documentation Charge is required but not configured.':'No disbursement charges are configured.'}</p>${canManageCharges?'<button type="button" class="secondary" data-accounting-section="accounting-settings">Configure Charges</button>':'<p class="muted">Contact an administrator to configure disbursement charges.</p>'}`; modal.querySelector('#charge-rows').innerHTML=selectedCharges.map((c,i)=>`<tr><td><strong>${escapeHtml(c.name)}</strong>${c.required?' <span class="badge">Required</span>':''}${c.waived?' <span class="badge">Waived</span>':''}</td><td>${c.canEdit&&!c.waived?`<input data-charge-amount="${i}" type="number" min="0" step="0.01" value="${escapeHtml(c.amount)}">`:formatCurrency(c.amount)}</td><td>${escapeHtml(refLabel(c.calculationMethod))}</td><td>${escapeHtml(refLabel(c.accountingTreatment))}</td><td>${escapeHtml(c.destinationAccountLabel||c.destinationAccountId||'—')}</td><td>${c.canRemove&&(!c.required||c.canWaive)?`<button type="button" data-remove-charge="${i}">Remove</button>`:''} ${c.canWaive?`<button type="button" class="secondary" data-waive-charge="${i}">Waive</button>`:''}</td></tr>`).join(''); modal.querySelector('#charge-cards').innerHTML=selectedCharges.map(c=>`<div class="subcard"><strong>${escapeHtml(c.name)}</strong><p>Amount: ${formatCurrency(c.amount)}</p><p>Posts to: ${escapeHtml(c.destinationAccountLabel||'—')}</p><p>Treatment: ${escapeHtml(refLabel(c.accountingTreatment))}</p></div>`).join(''); };
        const validate=()=>{ recalc(); const messages=configMessages(); if(isFutureDateOnly(dateEl.value)) messages.unshift('Future disbursement dates are not supported.'); errEl.innerHTML=[...messages.map(m=>`<div class="alert ${m.startsWith('Configure')?'warning':'error'}">${escapeHtml(m)}</div>`), previewErrorText ? `<div class="alert error">${escapeHtml(previewErrorText)}</div>` : ''].join(''); const selectedFunding=Number(accountEl.value); const payloadMatches=previewPayload&&JSON.stringify(previewPayload)===JSON.stringify(buildDisbursementPayload()); const previewReady=payloadMatches&&previewData&&previewData.journal.debits.length>0&&previewData.journal.credits.length>0&&previewData.journal.balanced===true&&previewData.validationErrors.length===0&&previewData.journal.totalDebit>0&&previewData.journal.totalCredit>0&&selectedFunding>0&&previewData.netDisbursed>0; confirm.disabled = messages.some(m=>!m.startsWith('Configure')) || !previewReady || !(dateEl.value && methodEl.value && (!['BANK_TRANSFER','CHEQUE'].includes(methodEl.value) || refEl.value.trim())) || applicationModalActions.dataset.disbursing === 'true'; };
        const previewErrorMessage=(err)=>{ if(err?.status===404) return 'Disbursement preview endpoint was not found.'; if(err?.status===422) return err.message || 'Disbursement preview validation failed.'; return disbursementErrorMessage(err); };
        const refreshPreview=async()=>{ const sequence=++previewSequence; if(previewAbortController) previewAbortController.abort(); const controller=new AbortController(); previewAbortController=controller; const signal=controller.signal; previewOk=false; previewErrorText=''; validate(); if(!accountEl.value || configMessages().some(m=>!m.startsWith('Configure'))) return; let timer, timedOut=false; try{ modal.querySelector('#journal-preview').innerHTML='<p>Loading backend preview...</p>'; const fundingAccountId=Number(accountEl.value); if(!Number.isFinite(fundingAccountId)||fundingAccountId<=0) throw new Error('Selected funding account must be a positive database ID.'); const payload=buildDisbursementPayload(); const path=endpoint('loanApplicationDisbursementPreview',{id:applicationId}); console.log('Disbursement preview', { applicationId, path, payload }); timer=setTimeout(()=>{ timedOut=true; controller.abort(); },15000); const raw=await api(path,{method:'POST',body:payload,signal}); console.log('Disbursement preview raw response:', raw); if(sequence!==previewSequence) return; const normalized=normalizeDisbursementPreview(raw); if(normalized.journal.debits.length===0||normalized.journal.credits.length===0) throw new Error('The preview response contains no debit or credit lines.'); previewData=normalized; previewPayload=payload; previewOk=true; previewErrorText=''; errEl.innerHTML=''; renderPreview(normalized); }catch(e){ if((e?.name==='AbortError'||e?.code==='ABORT_ERR')&&!timedOut){ console.debug('Stale disbursement preview request cancelled.'); return; } if(sequence!==previewSequence) return; previewData=null; previewPayload=null; previewValidationErrors=[]; previewBalanced=false; previewErrorText=previewErrorMessage(e); modal.querySelector('#journal-preview').innerHTML=`<div class="alert error">${escapeHtml(previewErrorText)}</div>`; } finally { if(timer) clearTimeout(timer); if(previewAbortController?.signal===signal) previewAbortController=null; if(sequence===previewSequence) validate(); } };
        const schedulePreview=()=>{ clearTimeout(previewTimer); previewTimer=setTimeout(refreshPreview,350); };
        const renderAccounts=()=>{ const keep=accountEl.value; const eligible=validAccounts(); accountEl.innerHTML='<option value="">Select funding account</option>'+eligible.map(a=>`<option value="${escapeHtml(a.id)}">${escapeHtml(((a.code||a.account_code||'')+' — '+(a.name||a.account_name||'')).trim())}</option>`).join(''); const defaultFundingId=pick(settings,['default_funding_account_id','defaultFundingAccountId','funding_account_id','fundingAccountId'],''); if([...accountEl.options].some(o=>o.value===keep)) accountEl.value=keep; else if(defaultFundingId && [...accountEl.options].some(o=>o.value===String(defaultFundingId))) accountEl.value=String(defaultFundingId); else if(!keep && eligible.length===1) accountEl.value=String(eligible[0].id); const empty=modal.querySelector('#funding-account-empty'); if(empty) empty.innerHTML=accounts.length?'':'No active bank or cash funding account is configured.'+(canManageCharges?' <button type="button" class="link-button" data-accounting-section="accounting-accounts">Configure Funding Accounts</button>':''); validate(); schedulePreview(); };
        modal.querySelector('#add-deduction').onclick=()=>{ const choices=chargeTypes.filter(c=>!selectedCharges.some(x=>String(x.id)===String(c.id))); if(!choices.length) return alert('All active disbursement charges have already been added.'); const text=choices.map((c,i)=>`${i+1}. ${c.name} (${formatCurrency(c.amount)})`).join('\n'); const n=Number(prompt(`Select deduction to add:\n${text}`)); if(n>=1&&n<=choices.length){ selectedCharges.push({...choices[n-1]}); recalc(); schedulePreview(); } };
        modal.addEventListener('input',e=>{ if(e.target.matches('[data-charge-amount]')){ selectedCharges[Number(e.target.dataset.chargeAmount)].amount=money(e.target.value); schedulePreview(); } else validate(); });
        modal.addEventListener('click',e=>{ const r=e.target.closest('[data-remove-charge]'); const w=e.target.closest('[data-waive-charge]'); if(r){ const i=Number(r.dataset.removeCharge); if(selectedCharges[i].required && !selectedCharges[i].canWaive) return alert('Documentation Charge is mandatory and cannot be removed.'); selectedCharges.splice(i,1); recalc(); schedulePreview(); } if(w){ const i=Number(w.dataset.waiveCharge); const reason=prompt('Waiver reason (required):'); if(!reason) return; if(confirm('Waive this disbursement charge?')){ selectedCharges[i].waived=true; selectedCharges[i].waiver_reason=reason; recalc(); schedulePreview(); } } });
        modal.querySelectorAll('[data-close-disburse]').forEach(b=>b.onclick=()=>modal.remove()); [methodEl,accountEl,refEl,dateEl,interestMethodEl,modal.querySelector('#disburse-remarks')].forEach(el=>el.addEventListener('input',schedulePreview)); methodEl.addEventListener('change',renderAccounts); renderHistoricalPanel(); renderAccounts(); recalc();
        confirm.onclick = async () => { if(confirm.disabled) return; const total=money(chargesPayload().reduce((s,c)=>s+c.amount,0)); const net=money(principal-total); if(!window.confirm(`Disburse Loan\n\nGross principal: ${formatCurrency(principal)}\n${selectedCharges.filter(c=>!c.waived).map(c=>`${c.name}: ${formatCurrency(c.amount)}`).join('\n')}\nTotal deductions: ${formatCurrency(total)}\nNet amount transferred: ${formatCurrency(net)}\nCustomer principal obligation: ${formatCurrency(principal)}`)) return; applicationModalActions.dataset.disbursing='true'; confirm.disabled=true; confirm.textContent='Disbursing...'; try { const payload={...(previewPayload||buildDisbursementPayload()), interest_accounting_method: interestMethodEl.value, historical_accrual_option: historicalChoice}; const res=await fetchWithTimeout(endpoint('loanApplicationDisburse', { id: applicationId }), { method:'POST', body: payload }, 15000); const journalNo=res.journal_no||res.journalNo||res.disbursement_journal_number||res.disbursementJournalNumber||res.journal_number||'created'; const loanNo=res.loan_number||res.loanNo||appNo; modal.querySelector('.modal-card').innerHTML=`<h2>Loan disbursed successfully.</h2><p>Loan Number: ${escapeHtml(loanNo)}</p><p>Disbursement Journal Number: ${escapeHtml(journalNo)}</p><p>Gross principal: ${formatCurrency(principal)}</p>${selectedCharges.filter(c=>!c.waived).map(c=>`<p>${escapeHtml(c.name)}: ${formatCurrency(c.amount)}</p>`).join('')}<p>Total deductions: ${formatCurrency(total)}</p><p>Net transferred: ${formatCurrency(net)}</p><p>Funding account: ${escapeHtml(labelAccount(validAccounts().find(a=>String(a.id)===accountEl.value))||accountEl.value)}</p><p>Disbursement date: ${escapeHtml(formatDateOnlyDisplay(dateEl.value))}</p><button type="button" data-close-success>Close</button> <button type="button" onclick="showAdminSection('loans')">View Loan</button> <button type="button" onclick="showAdminSection('accounting-journals')">View Journal Entry</button>`; modal.querySelector('[data-close-success]').onclick=()=>modal.remove(); setInlineAlert(applicationModalMessage, `Loan ${loanNo} disbursed. Gross ${formatCurrency(principal)}, net ${formatCurrency(net)}. Journal ${journalNo} posted.`, 'success'); if (appId) await openApplicationDetail({ ...appSummary, id: appId }, role); if (role === 'admin') await Promise.allSettled([loadAdmin(), loadAdminLoanApplicationsAll(true)]); } catch(err) { console.error('Failed to disburse loan application', err); errEl.innerHTML=`<div class="alert error">${escapeHtml(disbursementErrorMessage(err))}</div>`; } finally { applicationModalActions.dataset.disbursing='false'; confirm.textContent='Confirm Disbursement'; validate(); } };
      };
      document.body.appendChild(modal);
      renderLoading();
      try { renderForm(await loadOptions()); }
      catch (err) { console.error('Failed to load disbursement setup', err); renderError(err); modal.querySelector('#retry-disburse-options')?.addEventListener('click', () => { modal.remove(); handleDisburse(event); }, { once: true }); }
      finally { applicationModalActions.dataset.loadingDisbursement='false'; }
    };

    if (availableActions.includes('reject')) {
      addAction('Reject', handleReject, 'ghost');
    }
    if (availableActions.includes('approve')) {
      addAction('Approve', handleApprove, 'primary');
    }
    if (availableActions.includes('disburse')) {
      addAction('Disburse Loan', handleDisburse, 'primary');
    }
    if (!availableActions.length) {
      const note = document.createElement('p');
      note.className = 'muted';
      note.textContent = 'No actions available for this application.';
      applicationModalActions.appendChild(note);
    }
  } catch (error) {
    console.error(error);
    setInlineAlert(applicationModalMessage, error.message || 'Failed to load application', 'error');
    applicationModalContent.innerHTML = '<p class="muted">Unable to load application details.</p>';
  }
}

function openPaymentSheet(loan) {
  currentLoanForPayment = loan || null;
  setInlineAlert(paymentMessage, '');
  paymentLoanId.value = loan?.id || loan?.loan_id || loan?.reference || '';
  paymentAmount.value = '';
  paymentMethod.value = '';
  paymentNote.value = '';
  paymentDate.value = new Date().toISOString().slice(0, 10);
  paymentSheet.classList.remove('hidden');
}

function closePaymentSheetUI() {
  paymentSheet.classList.add('hidden');
  paymentForm.reset();
  currentLoanForPayment = null;
}


function ensureChangePasswordButton() {
  if (changePasswordBtn || !logoutBtn?.parentElement) return;
  changePasswordBtn = document.createElement('button');
  changePasswordBtn.type = 'button';
  changePasswordBtn.id = 'change-password-btn';
  changePasswordBtn.className = 'ghost hidden';
  changePasswordBtn.textContent = 'Change Password';
  logoutBtn.parentElement.insertBefore(changePasswordBtn, logoutBtn);
  changePasswordBtn.addEventListener('click', () => showChangePasswordModal(false));
}
function passwordPolicy(currentPassword, newPassword) {
  return [
    ['Minimum 12 characters', newPassword.length >= 12],
    ['Uppercase letter', /[A-Z]/.test(newPassword)],
    ['Lowercase letter', /[a-z]/.test(newPassword)],
    ['Number', /\d/.test(newPassword)],
    ['Special character', /[^A-Za-z0-9]/.test(newPassword)],
    ['Different from current password', !!newPassword && newPassword !== currentPassword],
  ];
}
function showChangePasswordModal(forced = false) {
  document.querySelector('#change-password-modal')?.remove();
  const modal = document.createElement('div');
  modal.id = 'change-password-modal';
  modal.className = 'modal-overlay historical-accounting-modal';
  modal.innerHTML = `<div class="modal-card wide"><div class="modal-header"><div><h2>${forced ? 'Password must be changed before continuing' : 'Change Password'}</h2><p class="muted">Choose a strong password to protect your account.</p></div>${forced ? '' : '<button type="button" class="icon-button" data-cancel>×</button>'}</div><form id="change-password-form" class="form-grid"><label class="form-field"><span>Current Password</span><div><input id="current-password" name="current_password" type="password" autocomplete="current-password" required><button type="button" class="secondary" data-toggle-password="current-password">Show</button></div></label><label class="form-field"><span>New Password</span><div><input id="new-password" name="new_password" type="password" autocomplete="new-password" required><button type="button" class="secondary" data-toggle-password="new-password">Show</button></div></label><label class="form-field"><span>Confirm New Password</span><div><input id="confirm-password" name="confirm_password" type="password" autocomplete="new-password" required><button type="button" class="secondary" data-toggle-password="confirm-password">Show</button></div></label><div class="subcard"><strong>Password requirements</strong><ul id="password-policy-list"></ul><p class="muted">Your browser may warn you when a password has appeared in a known data breach. Choose a new, unique password that you do not use on any other website.</p></div><p id="change-password-message" class="alert hidden"></p><div class="modal-actions sticky-modal-footer"><button type="submit" class="primary">Change Password</button>${forced ? '' : '<button type="button" class="secondary" data-cancel>Cancel</button>'}<button type="button" class="ghost" data-logout>Logout</button></div></form></div>`;
  document.body.appendChild(modal);
  const form = modal.querySelector('#change-password-form');
  const current = modal.querySelector('#current-password');
  const next = modal.querySelector('#new-password');
  const confirm = modal.querySelector('#confirm-password');
  const message = modal.querySelector('#change-password-message');
  const renderPolicy = () => {
    modal.querySelector('#password-policy-list').innerHTML = passwordPolicy(current.value, next.value).map(([label, ok]) => `<li>${ok ? '✅' : '○'} ${escapeHtml(label)}</li>`).join('');
  };
  [current,next,confirm].forEach(input => input.addEventListener('input', renderPolicy));
  renderPolicy();
  modal.addEventListener('click', (event) => {
    const toggle = event.target.closest('[data-toggle-password]');
    if (toggle) { const input = modal.querySelector(`#${toggle.dataset.togglePassword}`); input.type = input.type === 'password' ? 'text' : 'password'; toggle.textContent = input.type === 'password' ? 'Show' : 'Hide'; }
    if (event.target.closest('[data-cancel]')) modal.remove();
    if (event.target.closest('[data-logout]')) performLogout('You have been signed out.');
  });
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    message.className = 'alert hidden';
    const payload = { current_password: current.value, new_password: next.value, confirm_password: confirm.value };
    if (payload.new_password !== payload.confirm_password) { message.textContent = 'New password and confirmation do not match.'; message.className = 'alert error'; return; }
    if (passwordPolicy(payload.current_password, payload.new_password).some(([,ok]) => !ok)) { message.textContent = 'Please meet all password requirements.'; message.className = 'alert error'; return; }
    try {
      await api(endpoint('changePassword'), { method: 'POST', body: payload });
      clearSession();
      modal.remove();
      togglePanels(null);
      setMessage('Password changed successfully. Please sign in again with your new password.', 'success');
    } catch (error) {
      message.textContent = error?.message || 'Unable to change password.';
      message.className = 'alert error';
    } finally {
      current.value = next.value = confirm.value = '';
    }
  });
}
function sessionRequiresPasswordChange(session = getSession()) { return !!session.user?.must_change_password; }
async function performLogout(message = 'Your session has expired. Please sign in again.') {
  if (logoutInProgress) return;
  logoutInProgress = true;
  try { if (getSession().token) await api(endpoint('logout'), { method: 'POST', retryOnExpiredToken: false }).catch(() => {}); }
  finally { clearSession(); togglePanels(null); setMessage(message, message.includes('expired') ? 'error' : 'success'); logoutInProgress = false; }
}

async function hydrateFromSession() {
  const { token, role } = getSession();
  if (!token || !role) return;

  await ensureValidSession();
  togglePanels(role);
  if (sessionRequiresPasswordChange()) { showChangePasswordModal(true); setMessage('Your password must be changed before continuing.', 'error'); return; }
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
  // A selected existing customer must finish normalized-profile loading before Applicant can advance.
  nextStepBtn.disabled = currentStep === 1 && Boolean(selectedCustomerId) && customerProfileState !== 'ready';
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
      input.required = shouldShow && input.dataset.required === 'true';
    }
  });
}

function getStepFirstInvalidField(stepIndex) {
  const step = formSteps[stepIndex];
  if (!step) return null;
  const requiredFields = step.querySelectorAll('input[required], select[required], textarea[required]');
  for (const field of requiredFields) {
    if (field.closest('.type-specific') && !field.closest('.type-specific').classList.contains('visible')) continue;
    if (field.type === 'file' && !(field.files?.length)) return field;
    if (field.type !== 'file' && !field.value) return field;
  }
  return null;
}

function renderDocumentUploads() {
  if (!documentUploads) return;
  documentUploads.innerHTML = '';
  const requiredDocs = documentsByLoanType[selectedLoanType] || [];
  const skipButton = document.createElement('button');
  skipButton.type = 'button';
  skipButton.className = 'ghost';
  skipButton.textContent = 'Skip documents for now';
  skipButton.addEventListener('click', () => {
    skipDocumentsForNow = true;
    requiredDocs.forEach((doc) => skippedDocuments.add(doc));
    documentUploadWarnings.clear();
    renderDocumentUploads();
    updateReviewSummary();
  });
  documentUploads.appendChild(skipButton);

  requiredDocs.forEach((doc) => {
    const card = document.createElement('div');
    const warning = documentUploadWarnings.get(doc);
    const selectedFile = selectedDocuments.get(doc);
    const uploaded = uploadedDocumentIds.has(doc);
    const skipped = skipDocumentsForNow || skippedDocuments.has(doc);
    card.className = 'document-card';
    card.dataset.docType = doc;
    card.innerHTML = `
      <h5>${documentLabels[doc] || doc}</h5>
      <p class="muted">${selectedFile ? selectedFile.name : skipped ? 'Skipped for now' : 'No file selected'}</p>
      ${uploaded ? '<p class="success-text">Uploaded</p>' : ''}
      ${warning ? `<p class="error-text">${warning}</p>` : ''}
      <input type="file" name="${doc}" data-doc-type="${doc}" accept="image/*,.pdf" />
      ${warning ? '<button type="button" class="ghost skip-doc">Skip</button>' : ''}
    `;
    const fileInput = card.querySelector('input[type="file"]');
    fileInput.addEventListener('change', (event) => {
      const file = event.target.files?.[0];
      if (file) {
        selectedDocuments.set(doc, file);
        documentUploadWarnings.delete(doc);
        skippedDocuments.delete(doc);
        skipDocumentsForNow = false;
      } else {
        selectedDocuments.delete(doc);
      }
      renderDocumentUploads();
      updateReviewSummary();
    });
    card.querySelector('.skip-doc')?.addEventListener('click', () => {
      documentUploadWarnings.delete(doc);
      skippedDocuments.add(doc);
      renderDocumentUploads();
      updateReviewSummary();
    });
    documentUploads.appendChild(card);
  });
}

function validateStep(stepIndex) {
  const invalidField = getStepFirstInvalidField(stepIndex);
  if (invalidField) {
    invalidField.reportValidity();
    return false;
  }
  return validateLoanTermsForStep(stepIndex);
}

function validateWizardAndJump() {
  for (let i = 0; i < formSteps.length - 1; i += 1) {
    const invalidField = getStepFirstInvalidField(i);
    if (invalidField) {
      currentStep = i;
      updateStepperUI();
      invalidField.reportValidity();
      return false;
    }
    if (!validateLoanTermsForStep(i)) {
      currentStep = i;
      updateStepperUI();
      return false;
    }
  }
  return true;
}


function getCustomerDisplayName(customer = {}) {
  return (
    customer.full_name ||
    customer.fullName ||
    customer.name ||
    [customer.first_name, customer.last_name].filter(Boolean).join(' ') ||
    '—'
  );
}

function getCustomerField(customer = {}, keys = []) {
  for (const key of keys) {
    const value = customer?.[key];
    if (value !== undefined && value !== null && String(value).trim() !== '') return value;
  }
  return '';
}

function debounce(fn, delay = 300) {
  let timer;

  return (...args) => {
    clearTimeout(timer);

    timer = setTimeout(
      () => fn(...args),
      delay
    );
  };
}

function normalizeCustomerSearchResponse(raw) {
  const source =
    raw?.data ??
    raw ??
    {};

  const rows = Array.isArray(source)
    ? source
    : (
        source.items ??
        source.customers ??
        []
      );

  return Array.isArray(rows)
    ? rows
    : [];
}

function getCustomerDatabaseId(customer = {}) {
  return customer?.id ?? customer?.customer_id ?? customer?.customerId ?? null;
}

function setCustomerSearchMessage(message = '', type = 'error') {
  if (!customerSearchMessageEl) return;
  if (!message) {
    customerSearchMessageEl.textContent = '';
    customerSearchMessageEl.className = 'inline-alert hidden';
    return;
  }
  customerSearchMessageEl.textContent = message;
  customerSearchMessageEl.className = `inline-alert ${type}`;
}

function safeProfileText(value) {
  if (value === null || value === undefined) return '';
  const text = String(value).trim();
  return /^(null|undefined|nan|none)$/i.test(text) ? '' : text;
}

function normalizeProfileDate(value) {
  const text = safeProfileText(value);
  if (!text) return '';
  const direct = /^(\d{4}-\d{2}-\d{2})/.exec(text);
  if (direct) {
    const [year, month, day] = direct[1].split('-').map(Number);
    const date = new Date(Date.UTC(year, month - 1, day));
    return date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day ? direct[1] : '';
  }
  const date = new Date(text);
  return Number.isNaN(date.getTime()) ? '' : date.toISOString().slice(0, 10);
}

function setApplicantValue(name, value) {
  const input = loanApplicationForm?.querySelector(`[name="${name}"]`);
  if (input) input.value = safeProfileText(value);
}

function clearCustomerDerivedFields() {
  ['full_name', 'nic_number', 'mobile_number', 'email', 'address_line1', 'address_line2', 'city', 'district', 'province', 'postal_code', 'date_of_birth', 'monthly_income', 'monthly_expenses', 'existing_loans_description'].forEach((name) => setApplicantValue(name, ''));
  const existingLoans = loanApplicationForm?.querySelector('[name="has_existing_loans"]');
  if (existingLoans) existingLoans.checked = false;
  selectedCustomerProfile = null;
  selectedExistingLoans = [];
}

function unwrapNormalizedCustomerProfile(payload) {
  const profile = payload?.profile ?? payload?.data?.profile ?? payload?.data ?? payload;
  if (!profile || typeof profile !== 'object' || Array.isArray(profile) || !safeProfileText(profile.customer_id ?? profile.id)) return null;
  return profile;
}

function formatExistingLoans(loans) {
  const rows = Array.isArray(loans) ? loans : [];
  if (!rows.length) return '';
  return rows.map((loan) => [
    `Loan ${safeProfileText(loan.loan_number ?? loan.loan_no ?? loan.number ?? loan.id) || '—'}`,
    safeProfileText(loan.status) && `Status: ${safeProfileText(loan.status)}`,
    safeProfileText(loan.outstanding_amount ?? loan.outstanding_balance) && `Outstanding: ${safeProfileText(loan.outstanding_amount ?? loan.outstanding_balance)}`,
    safeProfileText(loan.installment_amount) && `Installment: ${safeProfileText(loan.installment_amount)}`,
    safeProfileText(loan.repayment_frequency ?? loan.frequency) && `Frequency: ${safeProfileText(loan.repayment_frequency ?? loan.frequency)}`,
  ].filter(Boolean).join(' • ')).join('\n');
}

function applyNormalizedCustomerProfile(profile) {
  const fieldMap = {
    full_name: profile.full_name,
    nic_number: profile.nic_number,
    mobile_number: profile.mobile ?? profile.mobile_number,
    email: profile.email,
    address_line1: profile.current_address_line1 ?? profile.address_line1,
    address_line2: profile.current_address_line2 ?? profile.address_line2,
    city: profile.current_city ?? profile.city,
    district: profile.current_district ?? profile.district,
    province: profile.current_province ?? profile.province,
    postal_code: profile.current_postal_code ?? profile.postal_code,
    monthly_income: profile.monthly_income,
    monthly_expenses: profile.monthly_expenses,
  };
  Object.entries(fieldMap).forEach(([name, value]) => setApplicantValue(name, value));
  setApplicantValue('date_of_birth', normalizeProfileDate(profile.date_of_birth));
  const loans = Array.isArray(profile.existing_loans) ? profile.existing_loans : [];
  const rawDetails = profile.existing_loan_details;
  const details = (typeof rawDetails === 'string' || typeof rawDetails === 'number' ? safeProfileText(rawDetails) : '') || formatExistingLoans(loans);
  const hasExistingLoans = profile.has_existing_loans === true || loans.length > 0;
  const checkbox = loanApplicationForm?.querySelector('[name="has_existing_loans"]');
  if (checkbox) checkbox.checked = hasExistingLoans;
  setApplicantValue('existing_loans_description', details);
  selectedCustomerProfile = profile;
  selectedExistingLoans = loans;
}

function profileWarnings(profile) {
  const warnings = [];
  if (profile.profile_complete === false) warnings.push('Profile incomplete');
  for (const value of [profile.missing_fields, profile.conflicts, profile.review_warnings]) {
    if (Array.isArray(value)) warnings.push(...value.map(safeProfileText).filter(Boolean));
    else if (safeProfileText(value)) warnings.push(safeProfileText(value));
  }
  if (profile.address_review_required === true) warnings.push('Address review required');
  return [...new Set(warnings)];
}

function renderSelectedCustomerChip(needsConfirmation = false) {
  if (!customerSearchSelectionEl) return;
  if (!selectedCustomerId || !selectedCustomer) {
    customerSearchSelectionEl.classList.add('hidden');
    customerSearchSelectionEl.innerHTML = '';
    return;
  }
  const code = safeProfileText(selectedCustomerProfile?.customer_code ?? selectedCustomer.customer_code ?? selectedCustomer.customer_number);
  const label = `${selectedCustomerId}${code ? ` / ${code}` : ''} - ${safeProfileText(selectedCustomerProfile?.full_name) || getCustomerDisplayName(selectedCustomer)}`;
  const warnings = selectedCustomerProfile ? profileWarnings(selectedCustomerProfile) : [];
  const loans = selectedExistingLoans;
  const busy = customerProfileState === 'loading';
  const failed = customerProfileState === 'error';
  customerSearchSelectionEl.classList.remove('hidden');
  customerSearchSelectionEl.innerHTML = `
    <span><strong>${needsConfirmation ? 'Previous customer:' : 'Selected Customer:'}</strong> ${escapeHtml(label)}</span>
    ${busy ? '<p class="muted">Loading customer profile...</p>' : ''}
    ${customerProfileState === 'ready' ? '<p class="muted">Customer information has been copied into this application. Changes made here do not automatically update the customer master profile.</p>' : ''}
    ${warnings.length ? `<div class="inline-alert warning"><strong>Profile warnings</strong><ul>${warnings.map((warning) => `<li>${escapeHtml(warning)}</li>`).join('')}</ul></div>` : ''}
    ${loans.length ? `<div class="inline-alert warning"><strong>Existing active loans</strong><ul>${loans.map((loan) => `<li>${escapeHtml(formatExistingLoans([loan]))}</li>`).join('')}</ul></div>` : ''}
    ${failed ? '<div class="inline-alert error">Unable to load the normalized customer profile. Please retry. <button type="button" id="retry-customer-profile" class="ghost">Retry</button></div>' : ''}
    <button type="button" id="clear-selected-customer" class="ghost">Clear selection</button>`;
  customerSearchSelectionEl.querySelector('#clear-selected-customer')?.addEventListener('click', clearSelectedCustomer);
  customerSearchSelectionEl.querySelector('#retry-customer-profile')?.addEventListener('click', () => loadNormalizedCustomerProfile(selectedCustomerId));
}

async function loadNormalizedCustomerProfile(customerId) {
  const sequence = ++customerProfileRequestSequence;
  customerProfileController?.abort();
  customerProfileController = new AbortController();
  customerProfileState = 'loading';
  renderSelectedCustomerChip();
  updateStepperUI();
  try {
    const path = endpoint('customerNormalizedProfile').replace('{id}', encodeURIComponent(customerId));
    const payload = await api.get(path, { signal: customerProfileController.signal });
    if (sequence !== customerProfileRequestSequence || String(customerId) !== String(selectedCustomerId)) return;
    const profile = unwrapNormalizedCustomerProfile(payload);
    if (!profile || String(profile.customer_id ?? profile.id) !== String(customerId)) throw new Error('The normalized profile did not match the selected customer.');
    applyNormalizedCustomerProfile(profile);
    customerProfileState = 'ready';
    setCustomerSearchMessage('', 'success');
  } catch (error) {
    if (error?.name === 'AbortError' || sequence !== customerProfileRequestSequence || String(customerId) !== String(selectedCustomerId)) return;
    console.error('Normalized customer profile failed to load', error);
    clearCustomerDerivedFields();
    customerProfileState = 'error';
  } finally {
    if (sequence === customerProfileRequestSequence && String(customerId) === String(selectedCustomerId)) {
      renderSelectedCustomerChip();
      updateStepperUI();
    }
  }
}

function clearSelectedCustomer() {
  customerProfileRequestSequence += 1;
  customerProfileController?.abort();
  customerProfileController = null;
  selectedCustomer = null;
  selectedCustomerId = null;
  customerProfileState = 'idle';
  clearCustomerDerivedFields();
  setActiveCustomerId(null);
  renderSelectedCustomerChip();
  setCustomerSearchMessage('', 'success');
  updateStepperUI();
}

function invalidateSelectedCustomerForNewSearch() {
  if (!selectedCustomerId && !selectedCustomer) return;
  clearSelectedCustomer();
  setCustomerSearchMessage('Select a customer from the search results.', 'error');
}

function selectCustomerForApplication(customer) {
  const customerId = getCustomerDatabaseId(customer);
  if (!customerId) { setCustomerSearchMessage('Selected customer does not have a valid ID.', 'error'); return; }
  clearCustomerDerivedFields();
  selectedCustomer = customer;
  selectedCustomerId = customerId;
  setActiveCustomerId(customerId);
  customerSearchResults = [];
  customerSearchHighlightedIndex = -1;
  renderCustomerSearchResults();
  renderSelectedCustomerChip();
  loadNormalizedCustomerProfile(customerId);
}

function clearCustomerResults(message = 'Enter a customer name, NIC, mobile number, or customer ID.') {
  customerSearchController?.abort();
  customerSearchController = null;
  customerSearchSequence += 1;
  customerSearchResults = [];
  customerSearchHighlightedIndex = -1;
  customerSearchLoading = false;
  customerSearchBtn && (customerSearchBtn.disabled = true);
  renderCustomerSearchResults();
  setCustomerSearchMessage(message, 'success');
}

function getCustomerSearchQuery() {
  const nicTerm = customerSearchNicInput?.value.trim() || '';
  const mobileTerm = customerSearchMobileInput?.value.trim() || '';
  return mobileTerm || nicTerm;
}

function renderCustomerSearchResults() {
  if (!customerSearchResultsEl) return;

  customerSearchResultsEl.style.maxHeight = '300px';
  customerSearchResultsEl.style.overflowY = 'auto';
  customerSearchResultsEl.style.overflowX = 'hidden';

  if (!customerSearchResults.length) {
    customerSearchResultsEl.classList.add('hidden');
    customerSearchResultsEl.innerHTML = '';
    return;
  }

  customerSearchResultsEl.classList.remove('hidden');
  const rows = customerSearchResults
    .slice(0, 10)
    .map((customer, index) => {
      const id = getCustomerDatabaseId(customer) || '—';
      const number = getCustomerField(customer, ['customer_number', 'customerNumber', 'customer_code', 'customerCode']);
      const displayId = number ? `${id} / ${number}` : id;
      const name = getCustomerDisplayName(customer);
      const nic = getCustomerField(customer, ['nic_number', 'nic', 'nicNumber', 'nic_no']) || '—';
      const mobile = getCustomerField(customer, ['mobile', 'mobile_number', 'phone', 'contact']) || '—';
      const code = getCustomerField(customer, ['customer_code', 'customerCode', 'customer_number', 'customerNumber']) || '—';
      const isHighlighted = index === customerSearchHighlightedIndex;
      return `
        <tr data-customer-index="${index}" tabindex="0" style="${isHighlighted ? 'background: rgba(37, 99, 235, 0.12);' : ''}">
          <td>${escapeHtml(id)}</td>
          <td>${escapeHtml(code)}</td>
          <td>${escapeHtml(name)}</td>
          <td>${escapeHtml(nic)}</td>
          <td>${escapeHtml(mobile)}</td>
          <td><button type="button" class="secondary" data-select-customer-index="${index}">Select</button></td>
        </tr>
      `;
    })
    .join('');

  customerSearchResultsEl.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Customer ID</th>
          <th>Customer Code</th>
          <th>Full Name</th>
          <th>NIC</th>
          <th>Mobile</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;

  customerSearchResultsEl.querySelectorAll('tbody tr').forEach((row) => {
    row.addEventListener('click', () => {
      const index = Number(row.dataset.customerIndex);
      const customer = customerSearchResults[index];
      if (customer) selectCustomerForApplication(customer);
    });
  });
}

function showCustomerSearchError(error) {
  console.error('Customer search failed', error);
  if (error?.status === 401) {
    setCustomerSearchMessage('Your session has expired. Please sign in again.', 'error');
  } else if (error?.status === 404) {
    setCustomerSearchMessage('Customer search endpoint was not found.', 'error');
  } else if (error?.status >= 500) {
    setCustomerSearchMessage('Customer search could not be completed.', 'error');
  } else if (!error?.status) {
    setCustomerSearchMessage('Unable to search customers. Check the connection and try again.', 'error');
  } else {
    setCustomerSearchMessage(error?.message || 'Customer search could not be completed.', 'error');
  }
}

async function searchCustomersForApplication({ nic = '', mobile = '' } = {}) {
  const query = (mobile || '').trim() || (nic || '').trim();
  customerSearchBtn && (customerSearchBtn.disabled = query.length < 1);

  if (query.length < 1) {
    clearCustomerResults();
    return;
  }

  invalidateSelectedCustomerForNewSearch();
  customerSearchLoading = true;
  customerSearchBtn && (customerSearchBtn.disabled = true);
  setCustomerSearchMessage('Searching customers...', 'success');

  const sequence = ++customerSearchSequence;
  customerSearchController?.abort();
  customerSearchController = new AbortController();

  try {
    const params = new URLSearchParams();
    params.set('q', query);
    params.set('limit', '10');
    const path = `/admin/customers/search?${params.toString()}`;
    const response = await api.get(path, { signal: customerSearchController.signal });

    if (sequence !== customerSearchSequence) return;

    const customers = normalizeCustomerSearchResponse(response).slice(0, 10);
    console.log('Live customer search', { query, resultCount: customers.length });
    customerSearchResults = customers;
    customerSearchHighlightedIndex = customers.length ? 0 : -1;
    renderCustomerSearchResults();

    if (!customers.length) {
      setCustomerSearchMessage(`No matching customer found. No customer matched "${query}".`, 'error');
      return;
    }

    setCustomerSearchMessage(`Found ${customers.length} matching customer(s). Select one from the list.`, 'success');
  } catch (error) {
    if (error?.name === 'AbortError') return;
    if (sequence !== customerSearchSequence) return;
    customerSearchResults = [];
    customerSearchHighlightedIndex = -1;
    renderCustomerSearchResults();
    showCustomerSearchError(error);
  } finally {
    if (sequence === customerSearchSequence) {
      customerSearchLoading = false;
      customerSearchBtn && (customerSearchBtn.disabled = getCustomerSearchQuery().length < 1);
    }
  }
}

const scheduleCustomerSearch = debounce(() => {
  const nic = customerSearchNicInput?.value || '';
  const mobile = customerSearchMobileInput?.value || '';
  const query = (mobile || '').trim() || (nic || '').trim();
  customerSearchBtn && (customerSearchBtn.disabled = query.length < 1);
  if (query.length < 1) {
    clearCustomerResults();
    return;
  }
  searchCustomersForApplication({ nic, mobile });
}, 300);

function handleCustomerSearchKeydown(event) {
  if (!customerSearchResults.length) {
    if (event.key === 'Escape') clearCustomerResults('');
    return;
  }

  if (event.key === 'ArrowDown') {
    event.preventDefault();
    customerSearchHighlightedIndex = Math.min(customerSearchHighlightedIndex + 1, customerSearchResults.length - 1);
    renderCustomerSearchResults();
  } else if (event.key === 'ArrowUp') {
    event.preventDefault();
    customerSearchHighlightedIndex = Math.max(customerSearchHighlightedIndex - 1, 0);
    renderCustomerSearchResults();
  } else if (event.key === 'Enter') {
    event.preventDefault();
    const customer = customerSearchResults[customerSearchHighlightedIndex];
    if (customer) selectCustomerForApplication(customer);
  } else if (event.key === 'Escape') {
    event.preventDefault();
    customerSearchResults = [];
    customerSearchHighlightedIndex = -1;
    renderCustomerSearchResults();
  }
}

function normalizeLoanEnum(value, fallback = '') {
  const normalized = String(value || fallback || '')
    .trim()
    .replace(/[\s-]+/g, '_')
    .toUpperCase();
  const aliases = {
    DAY: 'DAYS',
    DAYS: 'DAYS',
    MONTH: 'MONTHS',
    MONTHS: 'MONTHS',
    DAILY: 'DAILY',
    WEEKLY: 'WEEKLY',
    MONTHLY: 'MONTHLY',
    FLAT: 'FLAT',
    FLAT_TERM: 'FLAT_TERM',
    FLAT_FOR_FULL_TERM: 'FLAT_TERM',
  };
  return aliases[normalized] || normalized;
}

function toPayloadNumber(value, fallback = 0) {
  if (value === null || value === undefined || value === '') return fallback;
  const numeric = Number(String(value).replace(/%/g, '').trim());
  return Number.isFinite(numeric) ? numeric : fallback;
}

function buildApplicationPayload() {
  const formData = new FormData(loanApplicationForm);
  const values = Object.fromEntries(formData.entries());
  const hasExistingLoans = formData.get('has_existing_loans') === 'on';

  const applicantDetails = {
    full_name: values.full_name || cachedProfile?.name || '',
    nic_number: values.nic_number || '',
    mobile_number: values.mobile_number || cachedProfile?.mobile || cachedProfile?.phone || '',
    email: values.email || cachedProfile?.email || '',
    address_line1: values.address_line1 || '',
    address_line2: values.address_line2 || '',
    city: values.city || '',
    district: values.district || '',
    province: values.province || '',
    postal_code: values.postal_code || '',
    date_of_birth: values.date_of_birth || '',
    monthly_income: Number(values.monthly_income) || 0,
    monthly_expenses: Number(values.monthly_expenses) || 0,
    has_existing_loans: hasExistingLoans,
    existing_loans_description: values.existing_loans_description || '',
    existing_loan_details: values.existing_loans_description || '',
    existing_loans: selectedExistingLoans,
  };

  const termType = normalizeLoanEnum(values.term_type);
  const termValue = Math.trunc(toPayloadNumber(values.term_value));
  const repaymentFrequency = normalizeLoanEnum(values.repayment_frequency);
  const appliedAmount = toPayloadNumber(values.applied_amount);
  const interestRate = toPayloadNumber(values.interest_rate);
  const previewSource = {
    applied_amount: appliedAmount,
    term_type: termType,
    term_value: termValue,
    loan_days: termType === 'DAYS' ? termValue : null,
    tenure_months: termType === 'MONTHS' ? termValue : null,
    interest_rate: interestRate,
    interest_rate_basis: 'FLAT_TERM',
    repayment_frequency: repaymentFrequency,
    loan_purpose: values.loan_purpose || '',
  };
  const preview = calculateLoanPreview(previewSource);
  const installmentCount = Math.trunc(toPayloadNumber(preview.installmentCount));
  const installmentAmount = toPayloadNumber(preview.installmentAmount);
  const totalInterest = toPayloadNumber(preview.totalInterest);
  const totalRepayment = toPayloadNumber(preview.totalPayable);
  const loanDetails = {
    applied_amount: appliedAmount,
    term_type: termType,
    term_value: termValue,
    loan_days: termType === 'DAYS' ? termValue : null,
    tenure_months: termType === 'MONTHS' ? termValue : null,
    repayment_frequency: repaymentFrequency,
    interest_rate: interestRate,
    interest_rate_basis: 'FLAT_TERM',
    interest_type: 'FLAT',
    number_of_installments: installmentCount,
    installment_count: installmentCount,
    installment_amount: installmentAmount,
    total_interest: totalInterest,
    total_repayment: totalRepayment,
    total_payable: totalRepayment,
    installment_details: values.installment_details || '',
    loan_purpose: values.loan_purpose || '',
  };

  const typeSpecific = {};
  const payload = {
    customer_id: selectedCustomerId || null,
    loan_type: mapLoanTypeToApi(selectedLoanType),
    loan_purpose: values.loan_purpose || '',
    loan_details: loanDetails,
    applicant_details: applicantDetails,
    type_specific: typeSpecific,
  };
  switch (selectedLoanType) {
    case 'Grow Online Business Loan':
      typeSpecific.online_store_name = values.online_store_name || '';
      typeSpecific.online_store_link = values.online_store_link || '';
      typeSpecific.platform = values.platform || '';
      typeSpecific.average_monthly_revenue_last_3_months = Number(values.average_monthly_revenue_last_3_months) || 0;
      typeSpecific.main_product_category = values.main_product_category || '';
      typeSpecific.store_platform = 'WEB';
      break;
    case 'Grow Business Loan':
      typeSpecific.business_name = values.business_name || '';
      typeSpecific.business_registration = values.business_registration || '';
      typeSpecific.business_reg_number = values.business_registration || '';
      typeSpecific.business_address = values.business_address || '';
      typeSpecific.business_type = values.business_type || '';
      typeSpecific.monthly_sales = Number(values.monthly_sales) || 0;
      typeSpecific.store_platform = 'WEB';
      break;
    case 'Grow Personal Loan':
      typeSpecific.employment_type = values.employment_type || '';
      typeSpecific.employer_name = values.employer_name || '';
      typeSpecific.net_monthly_salary = Number(values.net_monthly_salary || values.monthly_income) || 0;
      typeSpecific.guarantor_name = values.guarantor_name || '';
      typeSpecific.guarantor_nic = values.guarantor_nic || values.nic_number || '';
      typeSpecific.guarantor_mobile = values.guarantor_mobile || '';
      typeSpecific.guarantor_relationship = values.guarantor_relationship || '';
      typeSpecific.store_platform = 'WEB';
      break;
    case 'Grow Team Loan':
      typeSpecific.group_name = values.group_name || '';
      typeSpecific.number_of_members = Number(values.number_of_members) || 0;
      typeSpecific.team_leader_name = values.full_name || '';
      typeSpecific.team_leader_nic = values.nic_number || '';
      typeSpecific.team_leader_mobile = values.mobile_number || '';
      typeSpecific.group_business_activity = values.meeting_location || '';
      typeSpecific.store_platform = 'WEB';
      break;
    default:
      break;
  }

  return { ...payload, ...applicantDetails, ...loanDetails, ...typeSpecific };
}

function validateLoanSubmissionPayload(payload) {
  const requiredFields = {
    term_type: payload.term_type,
    term_value: payload.term_value,
    repayment_frequency: payload.repayment_frequency,
    interest_rate: payload.interest_rate,
    installment_count: payload.installment_count,
    loan_purpose: payload.loan_purpose,
  };
  const missing = Object.entries(requiredFields)
    .filter(([, value]) => value === null || value === undefined || value === '')
    .map(([key]) => key);
  if (missing.length) {
    throw new Error(`Cannot submit loan application. Missing: ${missing.join(', ')}`);
  }
}

function responseConfirmsLoanTermData(response = {}) {
  const source = collectLoanTermSource(response?.data || response || {});
  return ['term_type', 'term_value', 'repayment_frequency', 'installment_count', 'loan_purpose']
    .every((key) => hasValue(source[key]));
}

function hasValue(value) {
  if (value === null || value === undefined) return false;
  if (typeof value === 'string') return value.trim().length > 0;
  return true;
}

function resolveApplicationId(value) {
  if (!hasValue(value)) return null;
  if (typeof value === 'number') return value;
  if (typeof value === 'string') {
    const numeric = Number(value);
    return Number.isNaN(numeric) ? null : numeric;
  }
  if (typeof value === 'object') {
    return (
      value.id ??
      value.application_id ??
      value.applicationId ??
      value.data?.id ??
      value.data?.application_id ??
      value.data?.applicationId ??
      null
    );
  }
  return null;
}

function normalizeNic(value) {
  if (!hasValue(value)) return '';
  return String(value)
    .replace(/\s+/g, '')
    .replace(/-/g, '')
    .toUpperCase();
}

function deriveStoreName({ typeSpecific, applicant }) {
  const existing = (typeSpecific?.online_store_name || '').trim();
  if (existing) return existing;

  const platformName = (typeSpecific?.store_platform || '').trim();
  if (platformName) return platformName;

  const url = (typeSpecific?.store_url || '').trim();
  if (url) {
    try {
      const parsed = new URL(url);
      if (parsed.hostname) return parsed.hostname;
    } catch (_) {
      // fall through if URL parsing fails
    }
  }

  if (applicant?.full_name) {
    return `${applicant.full_name} Online Store`;
  }

  return 'Online Store';
}

function mapLoanTypeToApi(uiValue) {
  const normalized = (uiValue || '').trim().toUpperCase();
  switch (normalized) {
    case 'GROW ONLINE BUSINESS LOAN':
    case 'GROW_ONLINE_BUSINESS':
    case 'ONLINE_BUSINESS_LOAN':
    case 'ONLINE_BUSINESS':
      return 'GROW_ONLINE_BUSINESS';
    case 'GROW BUSINESS LOAN':
    case 'GROW_BUSINESS':
    case 'BUSINESS_LOAN':
    case 'BUSINESS':
      return 'GROW_BUSINESS';
    case 'GROW PERSONAL LOAN':
    case 'GROW_PERSONAL':
    case 'PERSONAL_LOAN':
    case 'PERSONAL':
      return 'GROW_PERSONAL';
    case 'GROW TEAM LOAN':
    case 'GROW_TEAM':
    case 'TEAM_LOAN':
    case 'TEAM':
      return 'GROW_TEAM';
    default:
      if (normalized.includes('ONLINE')) return 'GROW_ONLINE_BUSINESS';
      if (normalized.includes('PERSONAL')) return 'GROW_PERSONAL';
      if (normalized.includes('TEAM')) return 'GROW_TEAM';
      if (normalized.includes('BUSINESS')) return 'GROW_BUSINESS';
      return uiValue || 'GROW_ONLINE_BUSINESS';
  }
}

function normalizeApplicationPayload(payload) {
  const applicant = { ...(payload.applicant_details || {}) };
  const loanDetails = { ...(payload.loan_details || {}) };
  const typeSpecific = { ...(payload.type_specific || {}) };

  const normalized = {
    ...payload,
    applicant_details: applicant,
    loan_details: loanDetails,
    type_specific: typeSpecific,
  };

  const ensureValue = (canonicalKey, aliases, sources = []) => {
    if (hasValue(normalized[canonicalKey])) return;
    for (const source of [normalized, ...sources]) {
      if (!source) continue;
      for (const alias of aliases) {
        const value = source[alias];
        if (hasValue(value)) {
          normalized[canonicalKey] = value;
          return;
        }
      }
    }
  };

  ensureValue('nic_number', ['nic', 'nicNumber'], [applicant]);
  ensureValue('mobile_number', ['mobile', 'mobileNumber'], [applicant]);
  ensureValue('store_platform', ['platform'], [typeSpecific]);
  ensureValue('platform', ['store_platform'], [typeSpecific]);
  ensureValue('online_store_link', ['store_url'], [typeSpecific]);
  ensureValue('online_store_name', ['store_platform', 'store_url'], [typeSpecific]);
  ensureValue('group_name', ['team_name'], [typeSpecific]);
  ensureValue('number_of_members', ['member_count', 'memberCount'], [typeSpecific]);
  ensureValue('team_leader_name', ['leader_name'], [typeSpecific]);
  ensureValue('team_leader_nic', ['leader_nic'], [typeSpecific]);
  ensureValue('team_leader_mobile', ['leader_mobile', 'mobile_number', 'mobile'], [typeSpecific, applicant]);
  ensureValue('group_savings_amount', ['savings_amount'], [typeSpecific]);
  ensureValue('group_business_activity', ['business_activity'], [typeSpecific]);

  normalized.loan_type = mapLoanTypeToApi(normalized.loan_type || payload.loan_type);
  if (!hasValue(normalized.store_platform)) {
    normalized.store_platform = 'WEB';
  }

  if (normalized.loan_type === 'GROW_ONLINE_BUSINESS') {
    if (!hasValue(normalized.average_monthly_revenue_last_3_months)) {
      normalized.average_monthly_revenue_last_3_months = 0;
    }
    if (!hasValue(normalized.main_product_category)) {
      normalized.main_product_category = 'General';
    }
    if (!hasValue(normalized.online_store_name)) {
      normalized.online_store_name = deriveStoreName({ typeSpecific, applicant });
    }
  }

  if (hasValue(normalized.nic_number)) {
    const nic = normalizeNic(normalized.nic_number);
    normalized.nic_number = nic;
    applicant.nic_number = nic;
    applicant.nic = nic;
  }
  if (hasValue(normalized.mobile_number)) {
    applicant.mobile_number = normalized.mobile_number;
  }
  if (hasValue(normalized.store_platform)) {
    typeSpecific.store_platform = normalized.store_platform;
  }
  if (hasValue(normalized.online_store_link)) {
    typeSpecific.online_store_link = normalized.online_store_link;
  }
  if (hasValue(normalized.online_store_name)) {
    typeSpecific.online_store_name = normalized.online_store_name;
  }
  if (hasValue(normalized.group_name)) {
    typeSpecific.group_name = normalized.group_name;
  }
  if (hasValue(normalized.number_of_members)) {
    typeSpecific.number_of_members = normalized.number_of_members;
  }
  if (hasValue(normalized.team_leader_name)) {
    typeSpecific.team_leader_name = normalized.team_leader_name;
  }
  if (hasValue(normalized.team_leader_nic)) {
    typeSpecific.team_leader_nic = normalizeNic(normalized.team_leader_nic);
  }
  if (hasValue(normalized.team_leader_mobile)) {
    typeSpecific.team_leader_mobile = normalized.team_leader_mobile;
  }
  if (hasValue(normalized.group_savings_amount)) {
    typeSpecific.group_savings_amount = Number(normalized.group_savings_amount) || 0;
  }
  if (hasValue(normalized.group_business_activity)) {
    typeSpecific.group_business_activity = normalized.group_business_activity;
  }
  if (hasValue(normalized.meeting_location)) {
    typeSpecific.meeting_location = normalized.meeting_location;
  }

  Object.assign(normalized, applicant, loanDetails, typeSpecific);
  return normalized;
}

function updateReviewSummary() {
  if (!reviewSummary) return;
  const data = normalizeApplicationPayload(buildApplicationPayload());
  const summary = calculateLoanPreview(data);
  const rows = [
    ['Loan type', data.loan_type],
    ['Purpose', data.loan_details.loan_purpose],
    ['Applied amount', formatCurrency(data.loan_details.applied_amount)],
    ['Term type', summary.type || '—'],
    ['Loan term', formatLoanTerm(data.loan_details)],
    ['Repayment frequency', titleCase(summary.frequency) || '—'],
    ['Interest rate', `${data.loan_details.interest_rate || 0}% flat for full term`],
    ['Interest basis', data.loan_details.interest_rate_basis || 'FLAT_TERM'],
    ['Installment count', summary.installmentCount || '—'],
    [`${titleCase(summary.frequency) || 'Installment'} payment`, summary.installmentAmount ? formatCurrency(summary.installmentAmount) : '—'],
    ['Total interest', formatCurrency(summary.totalInterest)],
    ['Total payable', formatCurrency(summary.totalPayable)],
    ['Full name', data.applicant_details.full_name],
    ['NIC', data.applicant_details.nic_number],
    ['Mobile', data.applicant_details.mobile_number],
    ['Email', data.applicant_details.email || '—'],
    [
      'Address',
      `${data.applicant_details.address_line1}, ${data.applicant_details.address_line2 || ''} ${
        data.applicant_details.city
      }, ${data.applicant_details.district}, ${data.applicant_details.province}`,
    ],
  ];

  const typeSpecificRows = [];
  if (selectedLoanType === 'Grow Business Loan') {
    typeSpecificRows.push(
      ['Business name', data.type_specific.business_name || '—'],
      ['Business registration', data.type_specific.business_registration || '—'],
      ['Business address', data.type_specific.business_address || '—'],
      ['Business type', data.type_specific.business_type || '—'],
      ['Average monthly sales', formatCurrency(data.type_specific.monthly_sales)]
    );
  }
  if (selectedLoanType === 'Grow Team Loan') {
    typeSpecificRows.push(
      ['Group name', data.type_specific.group_name || '—'],
      ['Number of members', data.type_specific.number_of_members || '—'],
      ['Team leader name', data.type_specific.team_leader_name || '—'],
      ['Team leader NIC', data.type_specific.team_leader_nic || '—'],
      ['Team leader mobile', data.type_specific.team_leader_mobile || '—'],
      ['Group business activity', data.type_specific.group_business_activity || '—']
    );
  }

  reviewSummary.innerHTML = '';
  [...rows, ...typeSpecificRows].forEach(([label, value]) => {
    const row = document.createElement('div');
    row.className = 'review-row';
    row.innerHTML = `<span>${label}</span><span>${value || '—'}</span>`;
    reviewSummary.appendChild(row);
  });

  const warnings = Array.from(documentUploadWarnings.entries()).map(
    ([doc]) => `${documentLabels[doc] || doc} upload failed; retry or skip it.`
  );
  reviewAlert.textContent = warnings.join(' ');
  reviewAlert.classList.toggle('hidden', !reviewAlert.textContent);
  reviewAlert.classList.toggle('error', !!warnings.length);
}

async function saveDraft(showMessage = true) {
  const payload = normalizeApplicationPayload(buildApplicationPayload());
  payload.status = 'DRAFT';
  try {
    setInlineAlert(applicationFormMessage, 'Saving draft...', 'success');
    const endpointPath = currentDraftId
      ? `${endpoint('loanApplications')}/${currentDraftId}`
      : endpoint('loanApplications');
    const method = currentDraftId ? 'PUT' : 'POST';
    const app = await api(endpointPath, { method, body: payload });
    const appId = resolveApplicationId(app) ?? currentDraftId;
    currentDraftId = appId;

    if (app && typeof app === 'object' && !Array.isArray(app)) {
      const normalizedApp = { ...app };
      if (appId && !normalizedApp.id) normalizedApp.id = appId;
      cachedApplications = [
        ...cachedApplications.filter((a) => (a.id ?? a.application_id) !== appId),
        normalizedApp,
      ].filter(Boolean);
    }

    await loadApplications();
    if (!currentDraftId) {
      const latestDraft = cachedApplications.find(
        (application) => (application.status || '').toLowerCase() === 'draft'
      );
      currentDraftId = resolveApplicationId(latestDraft) ?? currentDraftId;
    }
    if (showMessage) {
      setInlineAlert(applicationFormMessage, 'Draft saved successfully.', 'success');
    }
    return app;
  } catch (err) {
    console.error(err);
    const friendlyMessage =
      err?.status === 400
        ? err.message ||
          'Unable to save application because your eligibility or KYC status has changed. Please verify and try again.'
        : err.message || 'Unable to save application';
    setInlineAlert(applicationFormMessage, friendlyMessage, 'error');
    throw err;
  }
}

function extractUploadedDocumentId(response) {
  return (
    response?.id ??
    response?.document_id ??
    response?.documentId ??
    response?.document?.id ??
    null
  );
}

async function uploadDocumentsIfNeeded() {
  if (!currentDraftId || selectedDocuments.size === 0) return;
  for (const [docType, file] of selectedDocuments.entries()) {
    if (!file || skipDocumentsForNow || skippedDocuments.has(docType)) continue;
    const formData = new FormData();
    formData.append('file', file);
    // Align document_type values with the backend's expected enums (same as mobile app)
    // so submitted applications aren't rejected for "missing" files.
    formData.append('document_type', mapDocumentTypeToApi(docType));
    try {
      const response = await apiMultipart(`${endpoint('loanApplications')}/${currentDraftId}/documents`, formData);
      const uploadedId = extractUploadedDocumentId(response);
      if (uploadedId) uploadedDocumentIds.set(docType, uploadedId);
      documentUploadWarnings.delete(docType);
      skippedDocuments.delete(docType);
    } catch (error) {
      uploadedDocumentIds.delete(docType);
      documentUploadWarnings.set(docType, 'Upload failed. You can retry or skip this optional document.');
    }
  }
  renderDocumentUploads();
  updateReviewSummary();
}

let isSubmitting = false;

async function submitApplication() {
  if (isSubmitting) return; // Guard against double-clicks sending duplicate requests.
  const originalLabel = submitApplicationBtn?.textContent;
  try {
    isSubmitting = true;
    if (submitApplicationBtn) {
      submitApplicationBtn.disabled = true;
      submitApplicationBtn.textContent = 'Submitting...';
    }

    if (!validateWizardAndJump()) return;

    if (!selectedCustomerId) {
      setInlineAlert(
        applicationFormMessage,
        'Please search and select a customer (NIC/Mobile)',
        'error'
      );
      currentStep = 1;
      updateStepperUI();
      return;
    }

    const payload = normalizeApplicationPayload(buildApplicationPayload());
    payload.status = 'SUBMITTED';
    payload.customer_id = selectedCustomerId || payload.customer_id || null;
    validateLoanSubmissionPayload(payload);
    console.log('Loan application submission payload:', payload);
    setInlineAlert(applicationFormMessage, 'Saving application...', 'success');
    const endpointPath = currentDraftId
      ? `${endpoint('loanApplications')}/${currentDraftId}`
      : endpoint('loanApplications');
    const method = currentDraftId ? 'PUT' : 'POST';
    const app = await api(endpointPath, { method, body: payload });
    currentDraftId = resolveApplicationId(app) ?? currentDraftId;

    await uploadDocumentsIfNeeded();
    const submitResponse = await api(`${endpoint('loanApplications')}/${currentDraftId}/submit`, { method: 'POST' });
    const confirmed = responseConfirmsLoanTermData(submitResponse) || responseConfirmsLoanTermData(app);
    setInlineAlert(
      applicationFormMessage,
      confirmed
        ? 'Application submitted.'
        : 'Application was submitted but loan term data was not confirmed by the server.',
      confirmed ? 'success' : 'warning'
    );
    await loadApplications();
    if (confirmed) applicationFormCard.classList.add('hidden');
  } catch (err) {
    console.error(err);
    const friendlyMessage =
      err?.status === 400
        ? err.message ||
          'Unable to submit because your eligibility or KYC status has changed. Please refresh and try again.'
        : err.message || 'Unable to submit application';
    setInlineAlert(applicationFormMessage, friendlyMessage, 'error');
  } finally {
    isSubmitting = false;
    if (submitApplicationBtn) {
      submitApplicationBtn.disabled = false;
      submitApplicationBtn.textContent = originalLabel || 'Submit application';
    }
  }
}

function resetApplicationForm() {
  currentStep = 0;
  currentDraftId = null;
  selectedLoanType = loanTypes[0];
  selectedDocuments.clear();
  uploadedDocumentIds.clear();
  documentUploadWarnings.clear();
  skippedDocuments.clear();
  skipDocumentsForNow = false;
  loanApplicationForm.reset();
  customerSearchResults = [];
  clearSelectedCustomer();
  clearCustomerResults();
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
  cleanupInactiveOverlays();
  await loadApiConfig();

  if (window.location.pathname === '/lead') {
    showPublicLeadPage();
    return;
  }

  if (window.location.pathname === '/kyc') {
    showPublicKycPage();
    return;
  }

  const isApplyWizardRoute = window.location.pathname === loanApplyWizardRoutePath;
  const isEmbedMode = new URLSearchParams(window.location.search).get('embed') === '1';
  if (isApplyWizardRoute) {
    if (isEmbedMode) document.body.classList.add('embed-loan-wizard-mode');
    dashboards?.classList.remove('hidden');
    customerPanel?.classList.remove('hidden');
    applicationFormCard?.classList.remove('hidden');
  }

  renderLoanTypeOptions();
  selectLoanType(selectedLoanType);
  updateTypeSpecificVisibility();
  renderDocumentUploads();
  updateStepperUI();
  await hydrateFromSession();

  if (window.location.pathname.startsWith(loanApplicationsRouteHomePath)) {
    handleLoanApplicationsRoute(window.location.pathname);
    if (window.location.pathname === '/admin/loan-applications/all') {
      loadAdminLoanApplicationsAll(true);
    }
  }
}

loginForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  setMessage('');
  setLoading(true);

  const formData = new FormData(loginForm);
  const payload = Object.fromEntries(formData.entries());

  try {
    const data = await api(endpoint('login'), { method: 'POST', body: payload });
    const token =
      data.access_token || data.token || data.accessToken || data.jwt;
    if (!token || !data.role) {
      throw new Error('Invalid response from server.');
    }
    saveSessionFromLogin(data, data.role);
    if (data.password_change_required || data.user?.must_change_password) {
      const user = { ...minimumUserState(data.user || {}), must_change_password: true };
      localStorage.setItem(storageKeys.user, JSON.stringify(user));
      togglePanels(data.role);
      showChangePasswordModal(true);
      setMessage('Your password must be changed before continuing.', 'error');
      return;
    }
    togglePanels(data.role);
    setMessage('Signed in successfully.', 'success');

    if (data.role === 'admin') await loadAdmin();
    if (data.role === 'staff') await loadStaff();
    if (data.role === 'customer') await loadCustomer();
  } catch (err) {
    console.error(err);
    const msg = /locked/i.test(err.message || '') ? 'Your account is temporarily locked. Try again later or contact an administrator.' : /password.*change|required|reset/i.test(err.message || '') ? 'Your password must be changed before continuing.' : 'Invalid username or password.';
    setMessage(msg, 'error');
    clearSession();
    togglePanels(null);
  } finally {
    setLoading(false);
  }
});

logoutBtn?.addEventListener('click', () => performLogout('You have been signed out.'));

document.addEventListener('visibilitychange', async () => {
  if (document.visibilityState === 'visible') {
    try { await ensureValidSession(); } catch (_) { await performLogout('Your session has expired. Please sign in again.'); }
  }
});

loanApplicationForm?.addEventListener('submit', (event) => event.preventDefault());

newApplicationBtn?.addEventListener('click', async () => {
  const eligibleCustomer = await ensureCustomerEligibilityForApplication();
  if (!eligibleCustomer) return;

  resetApplicationForm();
  if (eligibleCustomer) {
    selectCustomerForApplication(eligibleCustomer);
  }
  applicationFormCard.classList.remove('hidden');
  loanApplicationForm.scrollIntoView({ behavior: 'smooth', block: 'start' });
});

closeApplicationForm?.addEventListener('click', () => {
  applicationFormCard.classList.add('hidden');
});

customerSearchBtn?.addEventListener('click', () => {
  searchCustomersForApplication({
    nic: customerSearchNicInput?.value || '',
    mobile: customerSearchMobileInput?.value || '',
  });
});

customerSearchNicInput?.addEventListener('input', scheduleCustomerSearch);
customerSearchMobileInput?.addEventListener('input', scheduleCustomerSearch);
customerSearchNicInput?.addEventListener('keydown', handleCustomerSearchKeydown);
customerSearchMobileInput?.addEventListener('keydown', handleCustomerSearchKeydown);
customerSearchBtn && (customerSearchBtn.disabled = true);

refreshApplicationsBtn?.addEventListener('click', async () => {
  try {
    await loadApplications();
    setInlineAlert(applicationFormMessage, 'Applications refreshed.', 'success');
  } catch (err) {
    console.error(err);
    setInlineAlert(applicationFormMessage, err.message, 'error');
  }
});

adminMenuItems.forEach((item) => {
  item.addEventListener('click', () => {
    const target = item.dataset.section || 'dashboard';
    if (target === 'documents') handleDocumentRoute(documentRouteBase, { pushState: true });
    else if (target === 'customers') handleCustomerRoute(customerRouteHomePath, { pushState: true });
    else if (target === 'loan-applications') {
      handleLoanApplicationsRoute(loanApplicationsRouteHomePath, { pushState: true });
    } else if (target === 'leads') handleLeadsRoute(leadsRouteBase, { pushState: true });
    else showAdminSection(target);
  });
});

document.addEventListener('click', (event) => {
  const routeTarget = event.target.closest('[data-staff-route]');
  if (!routeTarget) return;
  event.preventDefault();
  const target = routeTarget.dataset.staffRoute;
  navigateStaffRoute(target);
});

document.addEventListener('click', (event) => {
  const routeTarget = event.target.closest('[data-lead-route]');
  if (!routeTarget) return;
  event.preventDefault();
  const target = routeTarget.dataset.leadRoute;
  navigateLeadsRoute(target);
});

document.addEventListener('click', (event) => {
  const routeTarget = event.target.closest('[data-customer-route]');
  if (!routeTarget) return;
  event.preventDefault();
  const target = routeTarget.dataset.customerRoute;
  navigateCustomerRoute(target);
});

document.addEventListener('click', (event) => {
  const routeTarget = event.target.closest('[data-loan-route]');
  if (!routeTarget) return;
  event.preventDefault();
  const target = routeTarget.dataset.loanRoute;
  handleLoanApplicationsRoute(target, { pushState: true });
});

document.addEventListener('click', (event) => {
  const actionTarget = event.target.closest('[data-loan-action]');
  if (!actionTarget) return;
  event.preventDefault();
  const action = actionTarget.dataset.loanAction;
  if (action === 'open-apply-modal') openApplyLoanModal();
});


function openCustomerCreditDialog(mode = 'view') {
  const loan = adminLoansState.selectedLoan || {};
  const customerId = getLoanCustomerId(loan);
  if (!customerId) { setInlineAlert(adminLoanDetailMessage, 'Customer credit is unavailable because this loan has no customer identifier.', 'error'); return; }
  const modal = document.createElement('div'); modal.className = 'modal-overlay historical-accounting-modal';
  modal.innerHTML = '<div class="modal-card wide"><div class="modal-header"><h2>Customer Credit</h2><button class="icon-button" data-close>×</button></div><div class="customer-credit-body">Loading customer credits...</div></div>';
  document.body.appendChild(modal); modal.querySelector('[data-close]').onclick=()=>modal.remove();
  const body=modal.querySelector('.customer-credit-body');
  const money=v=>formatCurrency(Math.max(0, Number(v)||0));
  const reload=async()=>{
    try { const response=await api(`/admin/customers/${encodeURIComponent(customerId)}/credits`); const credits=normalizeLoansResponse(response); const selected=credits.find(c=>String(getLoanField(c,['id','credit_id','creditId']))===String(getLoanField(loan,['customer_credit_id','customerCreditId','credit_id','creditId'],''))) || credits.find(c=>(Number(getLoanField(c,['available_amount','availableAmount'],0))||0)>0) || credits[0];
      body.innerHTML=`<div class="ledger-table-scroll"><table class="placeholder-table loan-table"><thead><tr><th>Credit Number</th><th>Date</th><th>Source Loan</th><th>Original Amount</th><th>Available Amount</th><th>Applied Amount</th><th>Refunded Amount</th><th>Status</th><th>Actions</th></tr></thead><tbody>${credits.length?credits.map(c=>{const id=getLoanField(c,['id','credit_id','creditId']);const avail=Number(getLoanField(c,['available_amount','availableAmount'],0))||0;return `<tr><td>${escapeHtml(getLoanField(c,['credit_number','creditNumber','number'],id))}</td><td>${escapeHtml(formatDate(getLoanField(c,['date','credit_date','creditDate','created_at','createdAt'],''))||'—')}</td><td>${escapeHtml(getLoanField(c,['source_loan_number','sourceLoanNumber','loan_number','loanNumber'],'—'))}</td><td>${money(getLoanField(c,['original_amount','originalAmount','amount'],0))}</td><td>${money(avail)}</td><td>${money(getLoanField(c,['applied_amount','appliedAmount'],0))}</td><td>${money(getLoanField(c,['refunded_amount','refundedAmount'],0))}</td><td>${renderStatusBadge(getLoanField(c,['status'],'UNKNOWN'))}</td><td>${avail>0?`<button class="secondary" data-credit-refund="${escapeHtml(id)}">Refund</button> <button class="secondary" data-credit-apply="${escapeHtml(id)}">Apply to Loan</button>`:'—'}</td></tr>`}).join(''):'<tr><td colspan="9" class="muted">No customer credits found.</td></tr>'}</tbody></table></div>`;
      if (selected && mode !== 'view') openCreditTransactionForm(modal, selected, mode, customerId, reload);
    } catch(e) { body.innerHTML=`<div class="alert error">${escapeHtml(e.message||'Failed to load customer credits.')}</div>`; }
  };
  body.addEventListener('click',e=>{const refund=e.target.closest('[data-credit-refund]'),apply=e.target.closest('[data-credit-apply]');if(refund){const c={id:refund.dataset.creditRefund,available_amount:refund.closest('tr').children[4].textContent.replace(/[^0-9.]/g,'')};openCreditTransactionForm(modal,c,'refund',customerId,reload)}if(apply){const c={id:apply.dataset.creditApply,available_amount:apply.closest('tr').children[4].textContent.replace(/[^0-9.]/g,'')};openCreditTransactionForm(modal,c,'apply',customerId,reload)}}); reload();
}
async function openCreditTransactionForm(parent, credit, mode, customerId, reload) {
  const available=Math.max(0,Number(credit.available_amount||credit.availableAmount)||0); const isRefund=mode==='refund';
  const form=document.createElement('div'); form.className='subcard'; form.innerHTML=`<h3>${isRefund?'Refund Customer Credit':'Apply Customer Credit to Another Loan'}</h3><div class="credit-form-message"></div><div class="accounting-grid">${isRefund?'<label>Cash/Bank Account<input name="account_id" required></label><label>Reference<input name="reference"></label>':'<label>Target Loan<select name="target_loan_id"><option>Loading active loans...</option></select></label>'}<label>Amount<input name="amount" type="number" min="0.01" max="${available}" step="0.01" required></label><label>${isRefund?'Refund Date':'Effective Date'}<input name="effective_date" type="date" value="${todayDateOnly()}" required></label><label>Remarks<textarea name="remarks"></textarea></label></div><div class="modal-actions"><button class="secondary" data-credit-cancel>Cancel</button><button data-credit-submit>${isRefund?'Confirm Refund':'Apply Credit'}</button></div>`;
  parent.querySelector('.customer-credit-body').appendChild(form); if(!isRefund){try{const loans=normalizeLoansResponse(await api(endpoint('adminLoans'))).filter(l=>String(getLoanCustomerId(l))===String(customerId)&&['ACTIVE','OVERDUE','DISBURSED'].includes(getLoanStatus(l)));const select=form.querySelector('[name=target_loan_id]');select.innerHTML=`<option value="">Select active loan</option>${loans.map(l=>`<option value="${escapeHtml(getLoanId(l))}">${escapeHtml(getLoanField(l,['loan_number','loanNumber','id']))} — ${formatCurrency(displayLoanOutstanding(l))}</option>`).join('')}`;}catch(e){form.querySelector('.credit-form-message').innerHTML='<div class="alert error">Could not load this customer’s active loans.</div>';}}
  form.querySelector('[data-credit-cancel]').onclick=()=>form.remove(); form.querySelector('[data-credit-submit]').onclick=async()=>{const amount=Number(form.querySelector('[name=amount]').value);const msg=form.querySelector('.credit-form-message');if(!(amount>0)||amount>available){msg.innerHTML='<div class="alert error">Amount cannot exceed the available customer credit.</div>';return;} const body={amount,remarks:form.querySelector('[name=remarks]').value.trim()};if(isRefund){body.refund_date=form.querySelector('[name=effective_date]').value;body.cash_bank_account_id=form.querySelector('[name=account_id]').value;body.reference=form.querySelector('[name=reference]').value.trim();}else{body.target_loan_id=form.querySelector('[name=target_loan_id]').value;body.effective_date=form.querySelector('[name=effective_date]').value;if(!body.target_loan_id){msg.innerHTML='<div class="alert error">Select an active loan for the same customer.</div>';return;}}try{await api(`/admin/customer-credits/${encodeURIComponent(credit.id||credit.credit_id)}/${isRefund?'refund':'apply-to-loan'}`,{method:'POST',body});msg.innerHTML=`<div class="alert success">Customer credit ${isRefund?'refunded':'applied'} successfully.</div>`;await Promise.allSettled([reload(),loadAdminLoans(true),loadAdminLoanLedger(true)]);}catch(e){msg.innerHTML=`<div class="alert error">${escapeHtml(e.message||'Customer credit transaction failed.')}</div>`;}};
}

document.addEventListener('click', (event) => {
  const viewBtn = event.target.closest('[data-admin-loan-view]');
  if (viewBtn) {
    event.preventDefault();
    const loanId = viewBtn.dataset.adminLoanView;
    const loan = adminLoansState.loans.find((item) => String(getLoanId(item)) === String(loanId));
    if (loan) openAdminLoanDetail(loan);
    return;
  }

  if (event.target.closest('[data-admin-loans-empty-clear]')) {
    event.preventDefault();
    adminLoansSection?.querySelector('#admin-loans-clear-filters')?.click();
    return;
  }

  if (event.target.closest('[data-view-customer-credit]')) { event.preventDefault(); openCustomerCreditDialog('view'); return; }
  if (event.target.closest('[data-refund-customer-credit]')) { event.preventDefault(); openCustomerCreditDialog('refund'); return; }
  if (event.target.closest('[data-apply-customer-credit]')) { event.preventDefault(); openCustomerCreditDialog('apply'); return; }

  const repairBtn = event.target.closest('[data-admin-repair-schedule]');
  if (repairBtn) {
    event.preventDefault();
    repairAdminLoanSchedule();
    return;
  }
  if (event.target.closest('[data-loan-accrue-interest]')) { event.preventDefault(); openManualInterestAccrualDialog(true); return; }
  if (event.target.closest('[data-reverse-disbursement]')) { event.preventDefault(); reverseLoanDisbursementDialog(); return; }
  if (event.target.closest('[data-view-disbursement-journal]')) { event.preventDefault(); showAdminSection('accounting-journals'); return; }
  if (event.target.closest('[data-view-interest-journals]')) { event.preventDefault(); showAdminSection('accounting-journals'); return; }
  const earlySettlementButton = event.target.closest('[data-early-settlement]');
  if (earlySettlementButton) { event.preventDefault(); openEarlySettlementDialog(earlySettlementButton); return; }
  const reconcileLoanButton = event.target.closest('[data-reconcile-loan]');
  if (reconcileLoanButton) { event.preventDefault(); openLoanReconciliationPreview(reconcileLoanButton); return; }
  const paymentDetailBtn = event.target.closest('[data-payment-detail]');
  if (paymentDetailBtn) { event.preventDefault(); openPaymentDetailDialog(paymentDetailBtn.dataset.paymentDetail); return; }
});

refreshCustomersBtn?.addEventListener('click', () => loadAdminCustomers(true));
refreshKycQueueBtn?.addEventListener('click', () => loadAdminKycQueue(true));
refreshLeadsBtn?.addEventListener('click', () => loadAdminLeads(true));

document.addEventListener('click', (event) => {
  const customerDetailBtn = event.target.closest('[data-customer-detail-route]');
  if (customerDetailBtn) {
    const targetPath = customerDetailBtn.dataset.customerDetailRoute;
    if (targetPath) handleCustomerRoute(targetPath, { pushState: true });
    return;
  }

  const customerActionBtn = event.target.closest('[data-customer-action]');
  if (customerActionBtn) {
    const { customerAction, customerId } = customerActionBtn.dataset;
    handleCustomerAction(customerAction, customerId, customerActionBtn);
    return;
  }

  const convertBtn = event.target.closest('[data-action="convert-lead"]');
  if (convertBtn) {
    const leadId = convertBtn.dataset.leadId;
    convertLeadToCustomer(leadId, convertBtn);
    return;
  }

  const openCustomerBtn = event.target.closest('[data-action="open-customer-from-lead"]');
  if (openCustomerBtn) {
    const customerId = openCustomerBtn.dataset.customerId;
    const path = '/admin/customers/all-customers';
    handleCustomerRoute(path, { pushState: true });
    if (customerId) {
      setInlineAlert(adminCustomersMessage, `Opening customer ${customerId}`, 'success');
    }
    loadAdminCustomers(true);
  }
});

createCustomerBtn?.addEventListener('click', () => {
  alert('New customer creation form coming soon');
});

staffRouteBack?.addEventListener('click', () => {
  history.pushState({}, '', staffRouteHomePath);
  clearStaffRouteView();
});

customerRouteBack?.addEventListener('click', () => {
  history.pushState({}, '', customerRouteHomePath);
  clearCustomerRouteView();
});

loanAppRouteBack?.addEventListener('click', () => {
  handleLoanApplicationsRoute(loanApplicationsRouteHomePath, { pushState: true });
});

applyLoanModalClose?.addEventListener('click', closeApplyLoanModal);
applyLoanModal?.addEventListener('click', (event) => {
  if (event.target.closest('[data-modal-close="true"]')) closeApplyLoanModal();
});

applyLoanModalDialog?.addEventListener('click', (event) => {
  event.stopPropagation();
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && applyLoanModal && !applyLoanModal.classList.contains('hidden')) {
    closeApplyLoanModal();
  }
});

leadsRouteBack?.addEventListener('click', () => {
  handleLeadsRoute(leadsRouteBase, { pushState: true });
});

window.addEventListener('popstate', () => {
  const path = window.location.pathname;
  if (path === '/lead') {
    showPublicLeadPage();
    return;
  }

  if (path === '/kyc') {
    showPublicKycPage();
    return;
  }

  hidePublicLeadPage();
  hidePublicKycPage();

  if (customerRoutes[path] || path.startsWith(customerRouteHomePath)) handleCustomerRoute(path);
  else if (path.startsWith(loanApplicationsRouteHomePath)) handleLoanApplicationsRoute(path);
  else if (staffRoutes[path]) renderStaffRoute(path);
  else if (handleLeadsRoute(path)) {
    // handled
  } else if (!handleDocumentRoute(path)) {
    clearCustomerRouteView();
    clearLoanApplicationsRouteView();
    clearStaffRouteView();
  }
});

if (window.location.pathname === '/lead') {
  showPublicLeadPage();
} else if (window.location.pathname === '/kyc') {
  showPublicKycPage();
} else if (
  customerRoutes[window.location.pathname] ||
  window.location.pathname.startsWith(customerRouteHomePath)
) {
  handleCustomerRoute(window.location.pathname);
} else if (window.location.pathname.startsWith(loanApplicationsRouteHomePath)) {
  handleLoanApplicationsRoute(window.location.pathname);
} else if (staffRoutes[window.location.pathname]) {
  renderStaffRoute(window.location.pathname);
} else if (handleDocumentRoute(window.location.pathname)) {
  // handled by document routing
} else if (handleLeadsRoute(window.location.pathname)) {
  // handled by leads routing
}

staffRefreshApplicationsBtn?.addEventListener('click', () => loadStaff());
adminRefreshApplicationsBtn?.addEventListener('click', () => loadAdmin());

recordPaymentBtn?.addEventListener('click', () => openPaymentSheet());
closePaymentSheet?.addEventListener('click', closePaymentSheetUI);
paymentForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  const loanId = paymentLoanId.value.trim();
  const amount = Number(paymentAmount.value);
  const paymentDateValue = paymentDate.value || new Date().toISOString().slice(0, 10);
  if (!loanId || Number.isNaN(amount)) {
    setInlineAlert(paymentMessage, 'Loan ID and amount are required.', 'error');
    return;
  }

  try {
    setInlineAlert(paymentMessage, 'Submitting payment...', 'success');
    await api(endpoint('loanRepayments', { id: loanId }), {
      method: 'POST',
      body: {
        amount,
        payment_date: paymentDateValue,
        ...(paymentMethod.value ? { payment_method: paymentMethod.value } : {}),
        ...(paymentNote.value ? { note: paymentNote.value } : {}),
      },
    });
    setInlineAlert(paymentMessage, 'Payment recorded.', 'success');
    await loadStaff();
    closePaymentSheetUI();
  } catch (err) {
    console.error(err);
    setInlineAlert(paymentMessage, err.message || 'Failed to record payment', 'error');
  }
});


function updateLoanTermUi() {
  if (!loanApplicationForm) return;
  const termTypeEl = loanApplicationForm.querySelector('[name="term_type"]');
  const termValueEl = loanApplicationForm.querySelector('[name="term_value"]');
  const labelEl = document.querySelector('#loan-term-value-label');
  const termType = String(termTypeEl?.value || '').toUpperCase();
  if (labelEl) labelEl.textContent = termType === 'MONTHS' ? 'Loan months' : termType === 'DAYS' ? 'Loan days' : 'Loan Term';
  if (termValueEl) termValueEl.placeholder = termType === 'MONTHS' ? '3' : '63';
}

function renderLoanPreview() {
  const previewEl = document.querySelector('#loan-summary-preview');
  if (!previewEl || !loanApplicationForm) return;
  updateLoanTermUi();
  const data = buildApplicationPayload();
  const summary = calculateLoanPreview(data.loan_details);
  previewEl.innerHTML = `<div class="subcard"><h3>Loan Summary</h3>${renderLoanSummaryRows(summary)
    .map(([label, value]) => `<div class="review-row"><span>${escapeHtml(label)}</span><span>${escapeHtml(value || '—')}</span></div>`)
    .join('')}</div>`;
  updateReviewSummary();
}

function validateLoanTermsForStep(stepIndex) {
  const step = formSteps[stepIndex];
  if (!step || !step.querySelector('[name="term_type"]')) return true;
  const amountEl = step.querySelector('[name="applied_amount"]');
  const termTypeEl = step.querySelector('[name="term_type"]');
  const termValueEl = step.querySelector('[name="term_value"]');
  const rateEl = step.querySelector('[name="interest_rate"]');
  const freqEl = step.querySelector('[name="repayment_frequency"]');
  if (!Number(amountEl?.value || 0) || Number(amountEl.value) <= 0) {
    amountEl?.setCustomValidity('Enter an applied amount greater than zero.');
    amountEl?.reportValidity();
    amountEl?.setCustomValidity('');
    return false;
  }
  if (!termTypeEl?.value) {
    termTypeEl?.setCustomValidity('Select a loan term type.');
    termTypeEl?.reportValidity();
    termTypeEl?.setCustomValidity('');
    return false;
  }
  const termValue = Number(termValueEl?.value || 0);
  if (!Number.isInteger(termValue) || termValue <= 0) {
    termValueEl?.setCustomValidity(termTypeEl.value === 'MONTHS' ? 'Enter the number of loan months.' : 'Enter the number of loan days.');
    termValueEl?.reportValidity();
    termValueEl?.setCustomValidity('');
    return false;
  }
  if (Number(rateEl?.value || 0) < 0) {
    rateEl?.setCustomValidity('Enter an interest rate of zero or more.');
    rateEl?.reportValidity();
    rateEl?.setCustomValidity('');
    return false;
  }
  if (!freqEl?.value) {
    freqEl?.setCustomValidity('Select a repayment frequency.');
    freqEl?.reportValidity();
    freqEl?.setCustomValidity('');
    return false;
  }
  return true;
}

loanApplicationForm?.addEventListener('input', (event) => {
  if (['applied_amount', 'term_value', 'interest_rate'].includes(event.target?.name)) renderLoanPreview();
});
loanApplicationForm?.addEventListener('change', (event) => {
  if (['term_type', 'repayment_frequency', 'loan_purpose'].includes(event.target?.name)) renderLoanPreview();
});

closeApplicationModal?.addEventListener('click', closeApplicationDetail);

prevStepBtn?.addEventListener('click', goToPrevStep);
nextStepBtn?.addEventListener('click', goToNextStep);
saveDraftBtn?.addEventListener('click', () => saveDraft(true));
submitApplicationBtn?.addEventListener('click', submitApplication);

bootstrap();

// Phase 1 Accounting frontend
const accountingState = { accounts: [], journals: [], issues: [], selectedJournal: null, ledger: null };

const accountingSettingFields=[['default_disbursement_account_id','Default Disbursement Account','Loan Disbursement',['ASSET'],['CASH','BANK']],['default_cash_collection_account_id','Default Cash Collection Account','Customer Collections',['ASSET'],['CASH']],['default_bank_collection_account_id','Default Bank Collection Account','Customer Collections',['ASSET'],['BANK']],['collector_clearing_control_account_id','Collector Clearing Control Account','Customer Collections',['ASSET'],['COLLECTION_CLEARING','COLLECTION CLEARING']],['loan_principal_receivable_account_id','Loan Principal Receivable Account','Loan Accounting',['ASSET'],['LOAN_RECEIVABLE','LOAN RECEIVABLE']],['interest_receivable_account_id','Interest Receivable Account','Loan Accounting',['ASSET'],['INTEREST_RECEIVABLE','INTEREST RECEIVABLE']],['penalty_receivable_account_id','Penalty Receivable Account','Loan Accounting',['ASSET'],['PENALTY_RECEIVABLE','PENALTY RECEIVABLE']],['interest_income_account_id','Interest Income Account','Income Accounts',['INCOME'],['INTEREST_INCOME','INTEREST INCOME']],['penalty_income_account_id','Penalty Income Account','Income Accounts',['INCOME'],['PENALTY_INCOME','PENALTY INCOME']],['processing_fee_income_account_id','Processing Fee Income Account','Income Accounts',['INCOME'],['PROCESSING_FEE_INCOME','PROCESSING FEE INCOME']],['loan_write_off_expense_account_id','Loan Write-off Expense Account','Adjustments and Closing',['EXPENSE'],['WRITE_OFF','LOAN_WRITE_OFF','OPERATING_EXPENSE']],['suspense_account_id','Suspense Account','Adjustments and Closing',['ASSET','LIABILITY'],['SUSPENSE']],['retained_earnings_account_id','Retained Earnings Account','Adjustments and Closing',['EQUITY'],['RETAINED_EARNINGS','RETAINED EARNINGS']]];
function refLabel(v){const m={LOAN_DISBURSEMENT:'Loan Disbursement',LOAN_INTEREST_ACCRUAL:'Loan Interest Accrual',LOAN_DELAY_INTEREST_ACCRUAL:'Loan Delay Interest Accrual',LOAN_PAYMENT:'Loan Payment',LOAN_PAYMENT_REVERSAL:'Loan Payment Reversal',LOAN_DISBURSEMENT_REVERSAL:'Loan Disbursement Reversal',LOAN_INTEREST_REVERSAL:'Loan Interest Reversal',MANUAL_JOURNAL:'Manual Journal',REVERSAL:'Reversal',ACCRUAL_BY_INSTALLMENT:'Accrual by installment',CASH_BASIS:'Cash basis'};return m[v]||String(v||'').toLowerCase().replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase())||'—';}
function acctSubtype(a){return a.subtype||a.account_subtype||a.accountSubType||'';} function acctType(a){return a.type||a.account_type||'';}
function getAccountLabel(account){ if(!account){ return ''; } const code=String(account.account_code??account.code??'').trim(); const name=String(account.account_name??account.name??'').trim(); if(code&&name){ return `${code} — ${name}`; } return name||code||'Account'; }
function customerDisplay(x){return [x.customer_number,x.customer_name||x.customer].filter(Boolean).join('<br>')||'—';} function loanDisplay(x){return x.loan_number||x.loan||'—';}
async function accountingLoadSettings(){
  const root=document.querySelector('#accounting-settings-root'); if(!root)return;
  root.innerHTML='<h2>Accounting Settings</h2><p>Loading...</p>';
  try{
    const [settingsRaw,accountsRaw]=await Promise.all([api('/admin/accounting/settings'),api('/admin/accounting/accounts')]);
    const settings=settingsRaw||{}; const accounts=accountItems(accountsRaw); const can=accountingCan('accounting.settings.manage'); const sections={}; accountingSettingFields.forEach(f=>(sections[f[2]] ||= []).push(f)); const valueFor=k=>settings[k]||settings[k.replace('_account_id','')]||'';
    const operationalFields=[
      ['default_interest_accounting_method','Default Interest Accounting Method','select',[['ACCRUAL_BY_INSTALLMENT','Accrual by installment'],['CASH_BASIS','Cash basis']],'Controls whether loan interest is accrued by installment or recognised only as cash is collected.'],
      ['backdated_loan_accounting','Backdated Loan Accounting','select',[['AUTO','Automatically post historical interest accruals'],['ASK','Ask before posting historical accruals'],['NONE','Never create historical accruals automatically']],'Controls what happens when a disbursement date is earlier than today.'],
      ['historical_payments_auto_accrue','Historical Payments','boolean',null,'Automatically accrue required interest through the payment date before allocating historical payments.'],
      ['allow_backdated_disbursement','Allow Backdated Disbursement','boolean',null,'Permit loan disbursements with past accounting dates when period controls allow it.'],
      ['allow_backdated_payment','Allow Backdated Payment','boolean',null,'Permit repayment collection with past accounting dates when period controls allow it.'],['require_collector_for_cash_collection','Require collector for cash collection','boolean',null,'Require collector selection for cash collector payments.'],['require_bank_reference_for_deposit','Require bank reference for deposit','boolean',null,'Require a bank deposit/reference number before posting deposits.'],['allow_partial_deposits','Allow partial deposits','boolean',null,'Allow a receipt to be partially included in a collector deposit.'],['allow_historical_collections','Allow historical collections','boolean',null,'Permit historical payment accounting dates.'],['allow_historical_deposits','Allow historical deposits','boolean',null,'Permit historical collector deposit dates.'],['block_unmatched_deposit_batches','Block unmatched deposit batches','boolean',null,'Prevent deposit batches when selected receipt allocations do not match the deposit amount.'],
      ['locked_period_posting','Locked Period Posting','select',[['BLOCK','Block'],['CONTROLLED_OVERRIDE','Controlled override, only if backend supports it']],'Determines whether locked accounting periods block posting or allow a controlled backend override.'],
    ];
    const operationalHtml=`<div class="subcard"><h3>Interest Accounting & Historical Loans</h3><div class="accounting-grid">${operationalFields.map(([key,label,type,opts,help])=>{ const val=settings[key] ?? settings[key.replace(/_([a-z])/g,(_,c)=>c.toUpperCase())] ?? (type==='boolean'?'false':''); if(type==='boolean') return `<label>${escapeHtml(label)}<select data-operational-setting-key="${key}" ${can?'':'disabled'}><option value="true" ${String(val)==='true'?'selected':''}>Yes</option><option value="false" ${String(val)!=='true'?'selected':''}>No</option></select><small>${escapeHtml(help)}</small></label>`; return `<label>${escapeHtml(label)}<select data-operational-setting-key="${key}" ${can?'':'disabled'}>${opts.map(([v,t])=>`<option value="${v}" ${String(val||opts[0][0])===v?'selected':''}>${escapeHtml(t)}</option>`).join('')}</select><small>${escapeHtml(help)}</small></label>`; }).join('')}</div></div>`;
    root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Accounting</div><h2>Accounting Settings</h2><p class="muted">Configure account mappings and historical loan accounting workflows.</p></div>${can?'':'<span class="badge">Read-only</span>'}</div><div id="settings-message"></div>${operationalHtml}${Object.entries(sections).map(([name,fields])=>`<div class="subcard"><h3>${escapeHtml(name)}</h3><div class="accounting-grid">${fields.map(f=>{const [key,label,,types,subs]=f; const eligible=accounts.filter(a=>types.includes(String(acctType(a)).toUpperCase())&&(!subs.length||subs.map(s=>s.replace(/ /g,'_')).includes(String(acctSubtype(a)).toUpperCase().replace(/ /g,'_')))); const selected=accounts.find(a=>String(a.id)===String(valueFor(key))); return `<label>${escapeHtml(label)}<select data-setting-key="${key}" ${can?'':'disabled'}><option value="">Select account</option>${selected&&!eligible.find(a=>String(a.id)===String(selected.id))?`<option selected value="${escapeHtml(selected.id)}">${escapeHtml(getAccountLabel(selected))} (invalid)</option>`:''}${eligible.map(a=>`<option value="${escapeHtml(a.id)}" ${String(a.id)===String(valueFor(key))?'selected':''}>${escapeHtml(getAccountLabel(a))}</option>`).join('')}</select><small>Account Type: ${escapeHtml(selected?acctType(selected):'—')}<br>Subtype: ${escapeHtml(selected?acctSubtype(selected):'—')}</small>${selected&&(selected.active===false||selected.is_active===false)?'<div class="alert warning">Warning: this account is inactive.</div>':''}</label>`}).join('')}</div></div>`).join('')}${can?'<div class="action-row"><button id="save-accounting-settings">Save Changes</button><button class="secondary" id="reset-accounting-settings">Reset Unsaved Changes</button></div>':''}`;
    if(can){ const original={}; accountingSettingFields.forEach(f=>original[f[0]]=String(valueFor(f[0])||'')); operationalFields.forEach(f=>original[f[0]]=String(settings[f[0]] ?? '')); document.querySelector('#reset-accounting-settings').onclick=()=>accountingLoadSettings(); document.querySelector('#save-accounting-settings').onclick=async()=>{const changed={}; root.querySelectorAll('[data-setting-key],[data-operational-setting-key]').forEach(el=>{const key=el.dataset.settingKey||el.dataset.operationalSettingKey; if(String(el.value||'')!==String(original[key]||'')) changed[key]=el.value;}); if(!Object.keys(changed).length)return; if(!confirm('Save accounting settings? Future transactions will use the new workflow and account mappings. Existing posted journals will not be changed.'))return; try{await api('/admin/accounting/settings',{method:'PUT',body:changed}); document.querySelector('#settings-message').innerHTML='<div class="alert success">Accounting settings updated successfully.</div>'; }catch(e){document.querySelector('#settings-message').innerHTML=`<div class="alert error">${escapeHtml(e.message||'Failed to update accounting settings.')}</div>`;}};}
  }catch(e){root.innerHTML=`<div class="alert error">${escapeHtml(e.message)}</div>`;}
}

function accountItems(d){ if(Array.isArray(d)) return d; for (const k of ['accounts','journals','issues','transactions','data','items','results']) if(Array.isArray(d?.[k])) return d[k]; return []; }
const moneyCell = (v) => `<span class="money">${formatCurrency(v)}</span>`;
function accountingCan(permission){ const user = window.currentUser || {}; const perms = user.permissions || JSON.parse(localStorage.getItem('gm_permissions') || '[]'); return !perms.length || perms.includes(permission); }
async function accountingLoadDashboard(){ const root=document.querySelector('#accounting-dashboard-root'); if(!root)return; root.innerHTML='<div class="card-header"><div><div class="eyebrow">Accounting</div><h2>Accounting Dashboard</h2><p class="muted">Double-entry controls and reconciliation alerts.</p></div></div><p>Loading accounting summary...</p>'; try{ const [acc,jrn,iss]=await Promise.all([api('/admin/accounting/accounts?limit=50'),api('/admin/accounting/journals?limit=20'),api('/admin/accounting/reconciliation/issues?limit=10')]); accountingState.accounts=accountItems(acc); accountingState.journals=accountItems(jrn); accountingState.issues=accountItems(iss); const now=new Date(); const month=accountingState.journals.filter(j=>{const d=new Date(j.date||j.journal_date); return d.getFullYear()===now.getFullYear()&&d.getMonth()===now.getMonth();}); const sum=(key)=>month.reduce((a,j)=>a+Number(String(j[key]??0).replace(/,/g,'')),0); const cards=[['Total Active Accounts',accountingState.accounts.filter(a=>a.active!==false&&a.is_active!==false).length],['Posted Journals',accountingState.journals.filter(j=>j.status==='POSTED').length],['Draft Journals',accountingState.journals.filter(j=>j.status==='DRAFT').length],['Journals This Month',month.length],['Unbalanced Journals',accountingState.journals.filter(j=>String(j.total_debit)!==String(j.total_credit)).length],['Missing Source Journals',accountingState.issues.filter(i=>String(i.issue_type||i.description).toLowerCase().includes('without accounting')).length],['Total Debit This Month',formatCurrency(sum('total_debit'))],['Total Credit This Month',formatCurrency(sum('total_credit'))]]; root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Accounting</div><h2>Accounting Dashboard</h2><p class="muted">Phase 1 accounting overview.</p></div></div><div class="accounting-grid">${cards.map(([l,v])=>`<div class="metric"><div class="metric-label">${l}</div><div class="metric-value">${v}</div></div>`).join('')}</div><div class="subcard"><h3>Quick Actions</h3><button data-accounting-section="accounting-journal-form">New Journal Entry</button> <button class="secondary" data-accounting-section="accounting-ledger">View General Ledger</button> <button class="secondary" data-accounting-section="accounting-accounts">Manage Chart of Accounts</button></div><div class="subcard-grid"><div class="subcard"><h3>Recent Journal Entries</h3>${accountingState.journals.slice(0,6).map(j=>`<p><button class="link-button" data-journal-id="${escapeHtml(j.id)}">${escapeHtml(j.journal_no||j.number||j.id)}</button> ${escapeHtml(j.description||'')}</p>`).join('')||'<p>No journal entries found.</p>'}</div><div class="subcard"><h3>Reconciliation Alerts</h3>${accountingState.issues.slice(0,5).map(i=>`<p><span class="badge">${escapeHtml(i.severity||'Information')}</span> ${escapeHtml(i.description||i.issue_type||'Issue')}</p>`).join('')||'<p>No reconciliation alerts returned.</p>'}</div></div>`; }catch(e){root.innerHTML=`<div class="alert error">${escapeHtml(e.message)}</div>`;} }
async function accountingLoadAccounts(){ const root=document.querySelector('#accounting-accounts-root'); if(!root)return; const previous={search:document.querySelector('#account-search')?.value||'',type:document.querySelector('#account-type')?.value||'',active:document.querySelector('#account-active')?.value||''}; root.innerHTML='<h2>Chart of Accounts</h2><p>Loading...</p>'; try{ const rows=accountItems(await api('/admin/accounting/accounts')); accountingState.accounts=rows; root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Accounting</div><h2>Chart of Accounts</h2></div>${accountingCan('accounting.accounts.manage')?'<div><button data-account-form>Add Account</button> <button class="secondary" data-collection-account-form>Add Collection Account</button></div>':''}</div><div id="account-editor-message"></div><div class="accounting-filters"><input id="account-search" placeholder="Search code or name" value="${escapeHtml(previous.search)}"><select id="account-type"><option value="">All types</option><option>ASSET</option><option>LIABILITY</option><option>EQUITY</option><option>INCOME</option><option>EXPENSE</option></select><select id="account-active"><option value="">Any status</option><option value="true">Active</option><option value="false">Inactive</option></select></div><div class="table-scroll"><table id="chart-of-accounts-table"><thead><tr>${['Code','Account Name','Type','Subtype','Normal Balance','Posting Allowed','System Account','Status','Actions'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(a=>`<tr data-account-id="${escapeHtml(a.id)}"><td>${escapeHtml(a.code||a.account_code)}</td><td style="padding-left:${(a.depth||a.level||0)*18+10}px">${escapeHtml(a.name||a.account_name)}${String(a.code||a.account_code)==='1050'?'<div class="muted"><strong>Child accounts:</strong><br>1051 Collection Account – Sanjana<br>1052 Collection Account – Viraj</div>':''}</td><td>${escapeHtml(a.type||a.account_type)}</td><td>${escapeHtml(String(a.code||a.account_code)==='1050'?'Collector Clearing Control':(acctSubtype(a)||'—'))}</td><td>${escapeHtml(a.normal_balance||a.normalBalance)}</td><td>${String(a.code||a.account_code)==='1050'?'No':(a.allow_manual_posting!==false&&a.posting_allowed!==false?'Yes':'No')}</td><td>${a.system_account||a.is_system?'<span class="badge" title="This account is required by the accounting system.">🔒 System</span>':'No'}</td><td>${a.active!==false&&a.is_active!==false?'Active':'Inactive'}</td><td>${accountingCan('accounting.accounts.manage')?`<button data-account-id="${escapeHtml(a.id)}" class="edit-account-btn">Edit</button>`:'Read-only'}</td></tr>`).join('')}</tbody></table></div>`; const typeEl=root.querySelector('#account-type'), activeEl=root.querySelector('#account-active'); if(typeEl)typeEl.value=previous.type; if(activeEl)activeEl.value=previous.active; }catch(e){root.innerHTML=`<div class="alert error">${escapeHtml(e.message)}</div>`;} }
const journalFilters = { dateFrom:"", dateTo:"", status:"", referenceType:"", accountId:null, customerId:null, loanId:null, search:"" };
let currentJournalPage=1, currentJournalPageSize=25;
let journalReferenceTypes=['LOAN_DISBURSEMENT','LOAN_INTEREST_ACCRUAL','LOAN_DELAY_INTEREST_ACCRUAL','LOAN_PAYMENT','LOAN_PAYMENT_REVERSAL','LOAN_DISBURSEMENT_REVERSAL','LOAN_INTEREST_REVERSAL','MANUAL_JOURNAL','REVERSAL','ACCRUAL_BY_INSTALLMENT','CASH_BASIS'];
function buildJournalQuery({page=1,pageSize=25}={}){const p=new URLSearchParams(); if(journalFilters.dateFrom)p.set('date_from',journalFilters.dateFrom);if(journalFilters.dateTo)p.set('date_to',journalFilters.dateTo);if(journalFilters.status)p.set('status',journalFilters.status);if(journalFilters.referenceType)p.set('reference_type',journalFilters.referenceType);if(journalFilters.accountId)p.set('account_id',String(journalFilters.accountId));if(journalFilters.customerId)p.set('customer_id',String(journalFilters.customerId));if(journalFilters.loanId)p.set('loan_id',String(journalFilters.loanId));const s=journalFilters.search.trim();if(s)p.set('search',s);p.set('page',String(page));p.set('page_size',String(pageSize));return p.toString();}
function journalItems(r){return Array.isArray(r)?r:(Array.isArray(r?.items)?r.items:(Array.isArray(r?.data?.items)?r.data.items:[]));}
function journalRows(rows){return rows.map(j=>`<tr><td><button class="link-button" data-journal-id="${escapeHtml(j.id)}">${escapeHtml(j.journal_no||j.number||j.id)}</button></td><td>${escapeHtml(refLabel(j.source_type||j.reference_type))}</td><td>${escapeHtml(j.loan_number||loanDisplay(j))}</td><td>${customerDisplay(j)}</td><td>${escapeHtml(j.installment_number||j.installment_no||'—')}</td><td>${escapeHtml(formatDateOnlyDisplay(j.accounting_date||j.date||j.journal_date))}</td><td>${escapeHtml(formatDateTime(j.posted_at||j.created_at)||'—')}</td><td>${escapeHtml(j.description||'')}</td><td>${escapeHtml(j.original_journal_no||j.original_journal||'—')}</td><td>${escapeHtml(j.reversal_journal_no||j.reversal_journal||'—')}</td><td>${moneyCell(j.total_debit)}</td><td>${moneyCell(j.total_credit)}</td><td><span class="badge">${escapeHtml(j.status||'DRAFT')}</span></td><td><button data-journal-id="${escapeHtml(j.id)}">View</button>${j.status==='DRAFT'&&accountingCan('accounting.journals.post')?' <button data-post-journal="'+escapeHtml(j.id)+'">Post</button>':''}${j.status==='POSTED'&&accountingCan('accounting.journals.reverse')?' <button data-reverse-journal="'+escapeHtml(j.id)+'">Reverse</button>':''}</td></tr>`).join('');}
function journalError(message,type='error'){const el=document.querySelector('#journal-filter-message');if(el)el.innerHTML=`<div class="alert ${type}">${escapeHtml(message)}</div>`;}
function renderJournals(rows,total){const root=document.querySelector('#accounting-journals-root');if(!root)return;const refs=journalReferenceTypes.map(x=>typeof x==='string'?{v:x,l:refLabel(x)}:{v:x.value||x.code||x.id,l:x.label||x.name||refLabel(x.value||x.code||x.id)}).filter(x=>x.v);root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Accounting</div><h2>Journal Entries</h2></div>${accountingCan('accounting.journals.create')?'<button data-accounting-section="accounting-journal-form">New Journal Entry</button>':''}</div><form id="journal-filters-form" class="accounting-filters"><input id="journal-date-from" type="date" aria-label="Date From" value="${escapeHtml(journalFilters.dateFrom)}"><input id="journal-date-to" type="date" aria-label="Date To" value="${escapeHtml(journalFilters.dateTo)}"><select id="journal-status" aria-label="Status"><option value="">All statuses</option>${[['DRAFT','Draft'],['POSTED','Posted'],['REVERSED','Reversed'],['CANCELLED','Cancelled']].map(x=>`<option value="${x[0]}" ${journalFilters.status===x[0]?'selected':''}>${x[1]}</option>`).join('')}</select><select id="journal-reference-type" aria-label="Reference Type"><option value="">All reference types</option>${refs.map(x=>`<option value="${escapeHtml(x.v)}" ${journalFilters.referenceType===x.v?'selected':''}>${escapeHtml(x.l)}</option>`).join('')}</select><input id="journal-account" list="journal-account-options" autocomplete="off" placeholder="Account" aria-label="Account"><datalist id="journal-account-options"></datalist><input id="journal-customer" list="journal-customer-options" autocomplete="off" placeholder="Customer" aria-label="Customer"><datalist id="journal-customer-options"></datalist><button id="journal-customer-clear" type="button">Clear</button><input id="journal-loan" list="journal-loan-options" autocomplete="off" placeholder="Loan" aria-label="Loan"><datalist id="journal-loan-options"></datalist><button id="journal-loan-clear" type="button">Clear</button><input id="journal-search" type="search" placeholder="Search" aria-label="Search" value="${escapeHtml(journalFilters.search)}"><button id="journal-apply-filters" type="submit">Apply Filters</button><button id="journal-clear-filters" class="secondary" type="button">Clear Filters</button></form><div id="journal-filter-message"></div><p class="muted">${total} journal entr${total===1?'y':'ies'}</p><div class="table-scroll"><table><thead><tr>${['Journal No.','Source Type','Loan Number','Customer','Installment #','Accounting Date','Posting Date/Time','Description','Original Journal','Reversal Journal','Debit Total','Credit Total','Status','Actions'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.length?journalRows(rows):'<tr><td colspan="14">No journal entries match the selected filters.</td></tr>'}</tbody></table></div><div class="action-row"><button id="journal-prev" class="secondary" type="button" ${currentJournalPage===1?'disabled':''}>Previous</button><span>Page ${currentJournalPage}</span><button id="journal-next" class="secondary" type="button" ${rows.length<currentJournalPageSize||total<=currentJournalPage*currentJournalPageSize?'disabled':''}>Next</button></div>`;bindJournalEvents(root);loadJournalLookups(root);}
async function loadJournalLookups(root){try{const a=accountItems(await api('/admin/accounting/accounts?active=true&posting_allowed=true'));const input=root.querySelector('#journal-account');input._accounts=a;root.querySelector('#journal-account-options').innerHTML=a.map(x=>`<option value="${escapeHtml(getAccountLabel(x))}"></option>`).join('');}catch(e){console.warn('Journal account lookup unavailable',e);}try{const r=await api('/admin/accounting/journal-reference-types'),v=journalItems(r);if(v.length){journalReferenceTypes=v;const select=root.querySelector('#journal-reference-type');if(select){const options=v.map(x=>typeof x==='string'?{v:x,l:refLabel(x)}:{v:x.value||x.code||x.id,l:x.label||x.name||refLabel(x.value||x.code||x.id)}).filter(x=>x.v);select.innerHTML=`<option value="">All reference types</option>${options.map(x=>`<option value="${escapeHtml(x.v)}" ${journalFilters.referenceType===x.v?'selected':''}>${escapeHtml(x.l)}</option>`).join('')}`;}}}catch(e){console.warn('Journal reference types unavailable; using fallback values');}}
function bindLookup(root,type){const input=root.querySelector('#journal-'+type),list=root.querySelector('#journal-'+type+'-options'),key=type==='customer'?'customerId':'loanId',url=type==='customer'?'/admin/customers/search':'/admin/loans/search';let timer;input.addEventListener('input',()=>{journalFilters[key]=null;clearTimeout(timer);const q=input.value.trim();if(!q)return;timer=setTimeout(async()=>{try{const a=journalItems(await api(`${url}?${new URLSearchParams({q,limit:'10'})}`));input._items=a;list.innerHTML=a.map((x,i)=>`<option value="${escapeHtml(type==='customer'?[x.customer_number,x.full_name||x.customer_name||x.name,x.mobile].filter(Boolean).join(' — '):[x.loan_number||x.number,x.customer_name||x.customer].filter(Boolean).join(' — '))}" data-index="${i}"></option>`).join('');}catch(e){list.innerHTML='';}},250);});input.addEventListener('change',()=>{const match=(input._items||[]).find(x=>(type==='customer'?[x.customer_number,x.full_name||x.customer_name||x.name,x.mobile].filter(Boolean).join(' — '):[x.loan_number||x.number,x.customer_name||x.customer].filter(Boolean).join(' — '))===input.value);journalFilters[key]=match?match.id:null;});root.querySelector('#journal-'+type+'-clear').onclick=()=>{journalFilters[key]=null;input.value='';input._items=[];};}
function bindJournalEvents(root){[['#journal-date-from','dateFrom'],['#journal-date-to','dateTo'],['#journal-search','search']].forEach(([id,key])=>root.querySelector(id).oninput=e=>journalFilters[key]=e.target.value);root.querySelector('#journal-status').onchange=e=>journalFilters.status=e.target.value;root.querySelector('#journal-reference-type').onchange=e=>journalFilters.referenceType=e.target.value;const account=root.querySelector('#journal-account');account.oninput=()=>{journalFilters.accountId=null;const a=(account._accounts||[]).find(x=>getAccountLabel(x)===account.value);if(a)journalFilters.accountId=a.id;};bindLookup(root,'customer');bindLookup(root,'loan');const apply=async e=>{e?.preventDefault();if(journalFilters.dateFrom&&journalFilters.dateTo&&journalFilters.dateFrom>journalFilters.dateTo)return journalError('Date From cannot be later than Date To.');currentJournalPage=1;await loadJournalEntries({page:1});};root.querySelector('#journal-filters-form').onsubmit=apply;root.querySelector('#journal-search').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();apply(e);}};root.querySelector('#journal-clear-filters').onclick=()=>{Object.assign(journalFilters,{dateFrom:'',dateTo:'',status:'',referenceType:'',accountId:null,customerId:null,loanId:null,search:''});currentJournalPage=1;loadJournalEntries({page:1});};root.querySelector('#journal-prev').onclick=()=>loadJournalEntries({page:currentJournalPage-1});root.querySelector('#journal-next').onclick=()=>loadJournalEntries({page:currentJournalPage+1});}
async function loadJournalEntries({page=currentJournalPage,pageSize=currentJournalPageSize}={}){const root=document.querySelector('#accounting-journals-root');if(!root)return;currentJournalPage=page;currentJournalPageSize=pageSize;const button=root.querySelector('#journal-apply-filters');if(button)button.disabled=true;journalError('Loading journal entries...','success');const path=`/admin/accounting/journal-entries?${buildJournalQuery({page,pageSize})}`;console.log('Journal filters',journalFilters);console.log('Journal request path',path);try{const r=await api(path),items=journalItems(r);console.log('Journal result count',items.length);accountingState.journals=items;renderJournals(items,Number(r?.total??r?.count??r?.data?.total??r?.data?.count??items.length));}catch(e){journalError(e?.status===401?'Your session has expired. Please sign in again.':e?.status===404?'Journal Entry filter endpoint is unavailable.':e?.status===422?(e.message||'Invalid filter values.'):e?.status>=500?'Journal entries could not be loaded.':(e.message||'Journal entries could not be loaded.'));if(button)button.disabled=false;}}
async function accountingLoadJournals(){const root=document.querySelector('#accounting-journals-root');if(!root)return;root.innerHTML='<h2>Journal Entries</h2><p>Loading journal entries...</p>';await loadJournalEntries({page:1});}

function accountingRenderJournalForm(){
  const root=document.querySelector('#accounting-journal-form-root');
  if(!root)return;
  const state={customers:[],loans:[],lineLoans:new Map(),submitting:false,dirty:false,lastResult:null};
  const postingAccounts=()=>accountingState.accounts.filter(a=>a.active!==false&&a.is_active!==false&&a.allow_manual_posting!==false&&a.posting_allowed!==false&&a.is_posting_allowed!==false&&a.posting!==false);
  const idOf=o=>o?.id??o?.account_id??o?.customer_id??o?.loan_id??'';
  const accountLabel=a=>`${a.code||a.account_code||''} — ${a.name||a.account_name||''}`.replace(/^ — /,'').replace(/ — $/,'');
  const customerLabel=c=>[c.customer_number||c.customer_no||c.number||c.id,c.name||c.customer_name||c.full_name,c.nic||c.nic_number||c.mobile||c.phone].filter(Boolean).join(' — ');
  const loanCustomerId=l=>l.customer_id??l.customerId??l.customer?.id??'';
  const loanCustomerName=l=>l.customer_name||l.customerName||l.customer?.name||l.customer?.customer_name||'';
  const loanLabel=l=>[l.loan_number||l.loan_no||l.number||l.id,loanCustomerName(l)||l.customer||'',`Outstanding ${formatCurrency(l.outstanding_amount??l.outstanding??l.balance??0)}`].filter(Boolean).join(' — ');
  const money2=v=>Math.round((Number(v)||0)*100)/100;
  const lineRows=()=>Array.from(root.querySelectorAll('#journal-lines tr'));
  root.innerHTML=`<style>
    .manual-journal-header{display:grid;grid-template-columns:repeat(2,minmax(220px,1fr));gap:12px;margin-bottom:14px}.manual-journal-header label,.journal-line-card label{display:flex;flex-direction:column;gap:4px;font-size:.85rem;font-weight:600}.manual-journal-header textarea{min-height:76px;grid-column:1/-1}.manual-journal-status{align-self:end}.accounting-line-table select,.accounting-line-table input{min-width:140px}.accounting-line-table .line-desc{min-width:220px}.accounting-line-table .line-account,.accounting-line-table .line-customer,.accounting-line-table .line-loan{min-width:220px}.journal-line-error{color:#b42318;font-size:.82rem;max-width:260px}.journal-totals{position:sticky;bottom:0;background:var(--card-bg,#fff);z-index:2;display:flex;gap:18px;align-items:center;flex-wrap:wrap}.manual-journal-actions{display:flex;gap:10px;flex-wrap:wrap;margin-top:12px}.journal-result-actions{display:flex;gap:8px;flex-wrap:wrap}.journal-mobile-lines{display:none}@media(max-width:760px){.manual-journal-header{grid-template-columns:1fr}.table-scroll.manual-journal-table{overflow:visible}.accounting-line-table,.accounting-line-table thead,.accounting-line-table tbody,.accounting-line-table tr,.accounting-line-table td{display:block;width:100%;box-sizing:border-box}.accounting-line-table thead{display:none}.accounting-line-table tr{border:1px solid #ddd;border-radius:10px;padding:12px;margin:10px 0}.accounting-line-table td{padding:6px 0}.accounting-line-table td:nth-child(1)::before{content:'Line No. ';font-weight:700}.accounting-line-table td:nth-child(2)::before{content:'Account';font-weight:700;display:block}.accounting-line-table td:nth-child(3)::before{content:'Description';font-weight:700;display:block}.accounting-line-table td:nth-child(4)::before{content:'Customer (Optional)';font-weight:700;display:block}.accounting-line-table td:nth-child(5)::before{content:'Loan (Optional)';font-weight:700;display:block}.accounting-line-table td:nth-child(6),.accounting-line-table td:nth-child(7){display:inline-block;width:49%}.accounting-line-table td:nth-child(6)::before{content:'Debit';font-weight:700;display:block}.accounting-line-table td:nth-child(7)::before{content:'Credit';font-weight:700;display:block}.journal-totals{box-shadow:0 -2px 8px rgba(0,0,0,.08);padding:10px}.accounting-line-table select,.accounting-line-table input{width:100%;min-width:0;box-sizing:border-box}}
  </style><div class="card-header"><div><div class="eyebrow">Accounting</div><h2>Manual Journal Entry</h2></div></div><div id="journal-message"></div><div class="manual-journal-header"><label>Journal Date<input id="journal-date" type="date" required></label><label>Reference<input id="journal-reference" placeholder="Reference"></label><label>Description<textarea id="journal-description" placeholder="Description"></textarea></label><div class="manual-journal-status"><strong>Status:</strong> <span id="journal-status" class="badge">Out of balance</span></div></div><div class="table-scroll manual-journal-table"><table class="accounting-line-table"><thead><tr>${['Line No.','Account','Description','Customer (Optional)','Loan (Optional)','Debit','Credit','Remove'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody id="journal-lines"></tbody></table></div><div id="journal-mobile-lines" class="journal-mobile-lines"></div><button id="add-journal-line" type="button">Add Line</button><div class="subcard journal-totals"><strong>Total Debit:</strong> <span id="journal-debit">Rs. 0.00</span> <strong>Total Credit:</strong> <span id="journal-credit">Rs. 0.00</span> <strong>Difference:</strong> <span id="journal-diff">Rs. 0.00</span></div><div class="manual-journal-actions"><button id="save-journal-draft" type="button">Save as Draft</button> <button id="post-journal-now" type="button" disabled>Post Now</button></div><div id="journal-result"></div>`;
  const dateEl=root.querySelector('#journal-date'), refEl=root.querySelector('#journal-reference'), descEl=root.querySelector('#journal-description'), tbody=root.querySelector('#journal-lines'), mobile=root.querySelector('#journal-mobile-lines'), msg=root.querySelector('#journal-message'), result=root.querySelector('#journal-result'), postBtn=root.querySelector('#post-journal-now'), draftBtn=root.querySelector('#save-journal-draft');
  dateEl.value=new Date().toISOString().slice(0,10);
  const opts=(items,labeler,empty)=>`<option value="">${empty}</option>`+items.map(i=>`<option value="${escapeHtml(idOf(i))}">${escapeHtml(labeler(i))}</option>`).join('');
  const accountById=id=>postingAccounts().find(a=>String(idOf(a))===String(id)); const customerById=id=>state.customers.find(c=>String(idOf(c))===String(id)); const loanById=id=>state.loans.find(l=>String(idOf(l))===String(id))||[...state.lineLoans.values()].flat().find(l=>String(idOf(l))===String(id));
  const add=()=>{const n=tbody.children.length+1; tbody.insertAdjacentHTML('beforeend',`<tr><td class="line-no">${n}</td><td><select class="line-account"><option value="">Select posting account</option>${postingAccounts().map(a=>`<option value="${escapeHtml(idOf(a))}">${escapeHtml(accountLabel(a))}</option>`).join('')}</select><div class="journal-line-error"></div></td><td><input class="line-desc" placeholder="Line description"></td><td><select class="line-customer"><option value="">No customer</option></select><div class="selected-customer muted"></div></td><td><select class="line-loan"><option value="">No loan</option></select></td><td><input class="debit" type="number" min="0" step="0.01" inputmode="decimal"></td><td><input class="credit" type="number" min="0" step="0.01" inputmode="decimal"></td><td><button type="button" data-remove-line>Remove</button></td></tr>`); const r=tbody.lastElementChild; refreshLineOptions(r); renderMobile();};
  const refreshLineOptions=async(r)=>{const c=r.querySelector('.line-customer'), l=r.querySelector('.line-loan'), cid=c.value, lid=l.value; c.innerHTML=opts(state.customers,customerLabel,'No customer'); c.value=cid; const key=[...tbody.children].indexOf(r); let loans=state.lineLoans.get(key)||state.loans; l.innerHTML=opts(loans,loanLabel,'No loan'); l.value=lid;};
  const loadLoans=async(r,cid)=>{try{const url=cid?`/admin/loans/options?customer_id=${encodeURIComponent(cid)}`:'/admin/loans/options'; const loans=accountItems(await api(url)); state.lineLoans.set([...tbody.children].indexOf(r),loans); refreshLineOptions(r);}catch(e){msg.innerHTML=`<div class="alert error">${escapeHtml(e.message)}</div>`;}};
  const blank=r=>!r.querySelector('.line-account').value&&!r.querySelector('.line-desc').value.trim()&&!r.querySelector('.line-customer').value&&!r.querySelector('.line-loan').value&&!Number(r.querySelector('.debit').value||0)&&!Number(r.querySelector('.credit').value||0);
  const validate=()=>{let d=0,c=0,valid=0,errors=[]; lineRows().forEach((r,i)=>{const debit=money2(r.querySelector('.debit').value), credit=money2(r.querySelector('.credit').value), acct=accountById(r.querySelector('.line-account').value), cid=r.querySelector('.line-customer').value, lid=r.querySelector('.line-loan').value, loan=loanById(lid), err=[]; d+=debit;c+=credit; if(blank(r)){r.querySelector('.journal-line-error').textContent=''; return;} if(!acct)err.push(`Select an account for line ${i+1}.`); if(debit<=0&&credit<=0)err.push(`Enter debit or credit for line ${i+1}.`); if(debit>0&&credit>0)err.push(`Line ${i+1} cannot have both debit and credit.`); if(acct?.requires_customer&&!cid)err.push('This account requires a customer reference.'); if(acct?.requires_loan&&!lid)err.push('This account requires a loan reference.'); if(lid&&cid&&loan&&String(loanCustomerId(loan))!==String(cid))err.push('The selected loan does not belong to the selected customer.'); if(!err.length)valid++; errors.push(...err); r.querySelector('.journal-line-error').textContent=err.join(' ');}); const diff=money2(d-c), balanced=Math.abs(diff)<=0.01; root.querySelector('#journal-debit').textContent=formatCurrency(d); root.querySelector('#journal-credit').textContent=formatCurrency(c); root.querySelector('#journal-diff').textContent=formatCurrency(Math.abs(diff)); root.querySelector('#journal-status').textContent=balanced?'Balanced':'Out of balance'; postBtn.disabled=!(dateEl.value&&valid>=2&&d>0&&c>0&&balanced&&!errors.length&&!state.submitting); return {d,c,diff,balanced,valid,errors};};
  const payload=(status)=>{const v=validate(); if(v.errors.length) throw new Error(v.errors[0]); if(status==='POSTED'&&!v.balanced) throw new Error('Total debit must equal total credit.'); if(!dateEl.value) throw new Error('Journal date is required.'); const lines=lineRows().filter(r=>!blank(r)).map((r,i)=>{const debit=money2(r.querySelector('.debit').value), credit=money2(r.querySelector('.credit').value); if(!r.querySelector('.line-account').value||((debit>0)===(credit>0))) throw new Error(`Line ${i+1} is partially completed.`); return {account_id:Number(r.querySelector('.line-account').value),description:r.querySelector('.line-desc').value.trim(),customer_id:r.querySelector('.line-customer').value?Number(r.querySelector('.line-customer').value):null,loan_id:r.querySelector('.line-loan').value?Number(r.querySelector('.line-loan').value):null,debit_amount:debit,credit_amount:credit};}); if(lines.length<2) throw new Error('Enter at least two valid journal lines.'); return {journal_date:dateEl.value,reference:refEl.value.trim(),description:descEl.value.trim(),status,lines};};
  const showResult=(text,res,p)=>{const journalNo=res.journal_no||res.journal_number||res.number||res.id||'—'; result.innerHTML=`<div class="alert success"><strong>${escapeHtml(text)}</strong><p>Journal Number: ${escapeHtml(journalNo)}</p><p>Journal Date: ${escapeHtml(formatDateOnlyDisplay(res.journal_date||p.journal_date))}</p><p>Reference: ${escapeHtml(res.reference||p.reference||'—')}</p><p>Total Debit: ${formatCurrency(res.total_debit??p.lines.reduce((s,l)=>s+l.debit_amount,0))}</p><p>Total Credit: ${formatCurrency(res.total_credit??p.lines.reduce((s,l)=>s+l.credit_amount,0))}</p>${res.posted_by?`<p>Posted By: ${escapeHtml(res.posted_by)}</p>`:''}${res.posted_at?`<p>Posted At: ${escapeHtml(formatDateTime(res.posted_at))}</p>`:''}<div class="journal-result-actions"><button onclick="showAdminSection('accounting-journals')">View Journal</button><button onclick="showAdminSection('accounting-ledger')">Open General Ledger</button><button id="create-another-journal" type="button">Create Another Journal</button></div></div>`; const b=root.querySelector('#create-another-journal'); if(b)b.onclick=()=>accountingRenderJournalForm(); state.dirty=false;};
  const submit=async(status)=>{let p; try{p=payload(status); if(status==='POSTED'&&!window.confirm(`Post Manual Journal Entry?\n\nDate:\n${formatDateOnlyDisplay(p.journal_date)}\n\nReference:\n${p.reference||'—'}\n\nTotal Debit:\n${formatCurrency(p.lines.reduce((s,l)=>s+l.debit_amount,0))}\n\nTotal Credit:\n${formatCurrency(p.lines.reduce((s,l)=>s+l.credit_amount,0))}\n\nCustomer/Loan links:\nOptional and shown per line`)) return; state.submitting=true; validate(); msg.innerHTML=''; const res=await api(status==='POSTED'?'/admin/accounting/journal-entries/post':'/admin/accounting/journal-entries',{method:'POST',body:p}); showResult(status==='POSTED'?'Journal entry posted successfully.':'Journal saved as draft.',res,p);}catch(e){msg.innerHTML=`<div class="alert error">${escapeHtml(e.message||'Unexpected error.')}</div>`;}finally{state.submitting=false; validate();}};
  root.addEventListener('input',e=>{state.dirty=true; if(e.target.classList.contains('debit')&&Number(e.target.value)>0)e.target.closest('tr').querySelector('.credit').value=''; if(e.target.classList.contains('credit')&&Number(e.target.value)>0)e.target.closest('tr').querySelector('.debit').value=''; validate(); renderMobile();});
  root.addEventListener('change',async e=>{const r=e.target.closest('tr'); if(!r)return; state.dirty=true; if(e.target.classList.contains('line-loan')){const loan=loanById(e.target.value); if(loan){r.querySelector('.line-customer').value=loanCustomerId(loan)||''; r.querySelector('.selected-customer').textContent=loanCustomerName(loan)||customerLabel(customerById(loanCustomerId(loan)))||''; r.querySelector('.line-customer').disabled=true;} else {r.querySelector('.line-customer').disabled=false; r.querySelector('.selected-customer').textContent='';}} if(e.target.classList.contains('line-customer')){r.querySelector('.line-customer').disabled=false; const lid=r.querySelector('.line-loan').value, loan=loanById(lid); if(lid&&loan&&String(loanCustomerId(loan))!==String(e.target.value))r.querySelector('.line-loan').value=''; await loadLoans(r,e.target.value);} validate(); renderMobile();});
  root.addEventListener('click',e=>{if(e.target.matches('[data-remove-line]')){e.target.closest('tr').remove(); lineRows().forEach((r,i)=>r.querySelector('.line-no').textContent=i+1); state.dirty=true; validate(); renderMobile();}});
  const renderMobile=()=>{};
  window.addEventListener('beforeunload',e=>{if(state.dirty){e.preventDefault();e.returnValue='';}});
  Promise.allSettled([accountingState.accounts.length?Promise.resolve(accountingState.accounts):api('/admin/accounting/accounts?active=true'),api('/admin/customers/options'),api('/admin/loans/options')]).then(([a,c,l])=>{if(a.status==='fulfilled')accountingState.accounts=accountItems(a.value); if(c.status==='fulfilled')state.customers=accountItems(c.value); if(l.status==='fulfilled')state.loans=accountItems(l.value); lineRows().forEach(refreshLineOptions); validate();}).catch(()=>{});
  add(); add(); validate(); draftBtn.onclick=()=>submit('DRAFT'); postBtn.onclick=()=>submit('POSTED'); root.querySelector('#add-journal-line').onclick=()=>{add();validate();};
}
async function accountingLoadLedger(){
  const root=document.querySelector('#accounting-ledger-root');
  if(!root)return;
  try{
    if(!accountingState.accounts.length) accountingState.accounts=accountItems(await api('/admin/accounting/accounts?active=true'));
  }catch(e){ root.innerHTML=`<div class="alert error">${escapeHtml(e.message||'Failed to load Chart of Accounts.')}</div>`; return; }
  root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Accounting</div><h2>General Ledger</h2></div></div><div class="accounting-filters"><select id="ledger-account"><option value="">Account *</option>${accountingState.accounts.map(a=>`<option value="${escapeHtml(a.id)}">${escapeHtml(getAccountLabel(a))}</option>`).join('')}</select><input id="ledger-from" type="date"><input id="ledger-to" type="date"><input id="ledger-customer" placeholder="Customer Search"><input id="ledger-loan" placeholder="Loan Search (select account first)" disabled><label id="ledger-reconciliation-filter-wrap" class="hidden">Reconciliation Status<select id="ledger-reconciliation-filter"><option value="">All</option><option value="RECONCILED">Reconciled</option><option value="UNRECONCILED">Unreconciled</option></select></label><button id="run-ledger" disabled>Run</button>${accountingCan('accounting.export')?'<button id="export-ledger" disabled>Export CSV</button>':''}</div><p class="muted">Select an account to view its ledger transactions.</p><div id="ledger-results"><p>Select an account and click Run.</p></div>`;
  const accountEl=document.querySelector('#ledger-account'), fromEl=document.querySelector('#ledger-from'), toEl=document.querySelector('#ledger-to'), customerEl=document.querySelector('#ledger-customer'), loanEl=document.querySelector('#ledger-loan'), reconciliationEl=document.querySelector('#ledger-reconciliation-filter'), reconciliationWrap=document.querySelector('#ledger-reconciliation-filter-wrap'), runBtn=document.querySelector('#run-ledger'), exportBtn=document.querySelector('#export-ledger'), results=document.querySelector('#ledger-results');
  const selectedAccount = () => accountingState.accounts.find(a => String(a.id) === accountEl.value);
  const buildLedgerUrl = (base='/admin/accounting/general-ledger') => {
    const id=accountEl.value;
    const params=new URLSearchParams();
    if(id) params.set('account_id', id);
    [['date_from',fromEl.value],['date_to',toEl.value],['customer_id',customerEl.value.trim()],['loan_id',loanEl.value.trim()],['reconciliation_status',isBankAccount(selectedAccount())?reconciliationEl.value:'']].forEach(([k,v])=>{ if(v) params.set(k,v); });
    return `${base}?${params.toString()}`;
  };
  accountEl.onchange=()=>{const has=!!accountEl.value, bank=isBankAccount(selectedAccount()); runBtn.disabled=!has; if(exportBtn) exportBtn.disabled=!has; loanEl.disabled=!has; loanEl.placeholder=has?'Loan ID':'Loan ID (account required)'; reconciliationWrap.classList.toggle('hidden',!bank); if(!bank)reconciliationEl.value='';};
  runBtn.onclick=async()=>{
    if(runBtn.disabled) return;
    const id=accountEl.value;
    if(!id) return;
    if(!/^\d+$/.test(id)){ results.innerHTML='<div class="alert error">Selected account ID is not numeric. Reload the Chart of Accounts and try again.</div>'; return; }
    const account=selectedAccount();
    const url=buildLedgerUrl();
    console.debug('General Ledger request', { url, account_id:Number(id), account_code:account?.code||account?.account_code });
    runBtn.disabled=true;
    results.innerHTML='<p>Loading ledger...</p>';
    try{
      const data=await api(url);
      const summary=data.summary||data.account||{};
      const tx=accountItems(data);
      const accountCode=summary.account_code||account?.code||account?.account_code||'';
      const accountName=summary.account_name||account?.name||account?.account_name||'';
      const summaryHtml=`<div class="accounting-grid">${[['Account Code',accountCode],['Account Name',accountName],['Account Type',summary.account_type||'—'],['Account Subtype',summary.account_subtype||'—'],['Normal Balance',summary.normal_balance||'—'],['Opening Balance',formatCurrency(summary.opening_balance)],['Total Debit',formatCurrency(summary.total_debit)],['Total Credit',formatCurrency(summary.total_credit)],['Closing Balance',formatCurrency(summary.closing_balance)]].map(([label,value])=>`<div class="metric"><div class="metric-label">${escapeHtml(label)}</div><div>${escapeHtml(value)}</div></div>`).join('')}</div>`;
      const bank=isBankAccount(account); const headers=['Date','Journal No.','Description','Reference','Customer','Loan','Debit','Credit',...(bank?['Reconciled']:[]),'Running Balance'];
      const tableHtml=tx.length?`<div class="table-scroll"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${tx.map(r=>`<tr><td>${escapeHtml(r.date||r.journal_date||'')}</td><td><button class="link-button" data-journal-id="${escapeHtml(r.journal_id||r.id)}">${escapeHtml(r.journal_no||'')}</button></td><td>${escapeHtml(r.description||'')}</td><td>${escapeHtml(r.reference||r.reference_id||r.source_module||'')}</td><td>${escapeHtml(r.customer||r.customer_id||'')}</td><td>${escapeHtml(r.loan||r.loan_id||'')}</td><td>${moneyCell(r.debit)}</td><td>${moneyCell(r.credit)}</td>${bank?`<td>${renderGlReconciliation(r)}</td>`:''}<td>${moneyCell(r.running_balance)}</td></tr>`).join('')}</tbody></table></div>`:'<p>No ledger transactions found for the selected filters.</p>';
      results.innerHTML=summaryHtml+tableHtml;
    }catch(e){
      results.innerHTML=`<div class="alert error">${escapeHtml(e.message||'Failed to load ledger transactions.')}</div>`;
    }finally{
      runBtn.disabled=!accountEl.value;
    }
  };
  if(exportBtn) exportBtn.onclick=async()=>{ if(accountEl.value) await api(buildLedgerUrl('/admin/accounting/general-ledger/export.csv')); };
}
async function accountingLoadReconciliation(){ const root=document.querySelector('#accounting-reconciliation-root'); if(!root)return; try{ const rows=accountItems(await api('/admin/accounting/reconciliation/issues')); root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Accounting</div><h2>Reconciliation Issues</h2><p class="muted">Diagnostic only. No automatic Fix All action is available.</p></div></div><div class="table-scroll"><table><thead><tr>${['Issue Type','Severity','Source Type','Source ID','Description','Detected At','Action'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><td>${escapeHtml(r.issue_type||'')}</td><td><span class="badge">${escapeHtml(r.severity||'Information')}</span></td><td>${escapeHtml(r.source_type||'')}</td><td>${escapeHtml(r.source_id||'')}</td><td>${escapeHtml(r.description||'')}</td><td>${escapeHtml(r.detected_at||'')}</td><td><button>Open ${escapeHtml(r.source_type||'Source')}</button> <button onclick="navigator.clipboard?.writeText('${escapeHtml(r.source_id||'')}')">Copy Reference</button></td></tr>`).join('')}</tbody></table></div>`;}catch(e){root.innerHTML=`<div class="alert error">${escapeHtml(e.message)}</div>`;} }
async function accountingLoadDetail(id){ const root=document.querySelector('#accounting-journal-detail-root'); if(!root)return; root.innerHTML='<h2>Journal Detail</h2><p>Loading...</p>'; const j=await api(`/admin/accounting/journals/${id}`); const lines=accountItems(j.lines||j); root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Accounting</div><h2>Journal ${escapeHtml(j.journal_no||j.number||j.id)}</h2></div></div><div class="subcard-grid">${['journal_no','source_type','loan_number','customer_name','installment_number','accounting_date','posted_at','description','total_debit','total_credit','status','original_journal_no','reversal_journal_no'].map(k=>`<div><strong>${k}</strong><br>${escapeHtml(k==='reference_type'?refLabel(j[k]):(j[k]||'—'))}</div>`).join('')}</div>${j.source_module?'<p><span class="badge">System-generated</span></p>':''}<div class="table-scroll"><table><thead><tr>${['Line No.','Account Code','Account Name','Account Type','Description','Customer','Loan','Debit','Credit'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${lines.map((l,i)=>`<tr><td>${l.line_no||i+1}</td><td>${escapeHtml(l.account_code||'')}</td><td>${escapeHtml(l.account_name||'')}</td><td>${escapeHtml(l.account_type||'')}</td><td>${escapeHtml(l.description||'')}</td><td>${customerDisplay(l)}</td><td>${escapeHtml(loanDisplay(l))}</td><td>${moneyCell(l.debit)}</td><td>${moneyCell(l.credit)}</td></tr>`).join('')}</tbody></table></div><div class="subcard">Total Debit: ${formatCurrency(j.total_debit)} Total Credit: ${formatCurrency(j.total_credit)} Difference: ${formatCurrency(Number(j.total_debit||0)-Number(j.total_credit||0))}</div><button data-accounting-section="accounting-journals">Back to Journals</button>`; }
const originalShowAdminSection = showAdminSection;
showAdminSection = function(section='dashboard'){ originalShowAdminSection(section); if(section==='accounting') accountingLoadDashboard(); if(section==='accounting-accounts') accountingLoadAccounts(); if(section==='accounting-journals') accountingLoadJournals(); if(section==='accounting-journal-form') { accountingLoadAccounts().then(accountingRenderJournalForm); } if(section==='accounting-ledger') accountingLoadLedger(); if(section==='accounting-reconciliation') accountingLoadReconciliation(); if(section==='accounting-settings') accountingLoadSettings(); };
document.addEventListener('click', (e)=>{ const sec=e.target.closest('[data-accounting-section],[data-section-link]')?.dataset.accountingSection || e.target.closest('[data-accounting-section],[data-section-link]')?.dataset.sectionLink; if(sec){ e.preventDefault(); showAdminSection(sec); } const jid=e.target.closest('[data-journal-id]')?.dataset.journalId; if(jid){ e.preventDefault(); showAdminSection('accounting-journal-detail'); accountingLoadDetail(jid); }});
document.addEventListener('click', async (e)=>{ const post=e.target.closest('[data-post-journal]')?.dataset.postJournal; if(post){ if(confirm('Post this draft journal?')){ await api(`/admin/accounting/journals/${post}/post`, { method:'POST' }); accountingLoadJournals(); }} const rev=e.target.closest('[data-reverse-journal]')?.dataset.reverseJournal; if(rev){ const reason=prompt('Reversal reason:'); if(reason){ await api(`/admin/accounting/journals/${rev}/reverse`, { method:'POST', body:{ reversal_date:new Date().toISOString().slice(0,10), reason } }); accountingLoadJournals(); }} });

// Phase 2 financial reporting (generated web bundle update)
const reportCurrency = v => { const n=Number(String(v ?? 0).replace(/,/g,'')); const formatted=Math.abs(n).toLocaleString('en-LK',{style:'currency',currency:'LKR',currencyDisplay:'code',minimumFractionDigits:2}).replace('LKR','Rs.'); return n<0?`(${formatted})`:formatted; };
const reportAmountNumber = v => Number(String(v ?? 0).replace(/,/g,'')) || 0;
const reportItems = d => Array.isArray(d) ? d : (d?.accounts||d?.rows||d?.items||d?.data||d?.results||[]);
const reportQuery = form => new URLSearchParams([...new FormData(form).entries()].filter(([,v])=>String(v).trim()!==''));
const reportToday = () => typeof todayDateOnly==='function' ? todayDateOnly() : new Date().toISOString().slice(0,10);
function reportWarnings(d){ const warnings=reportItems(d?.warnings||d?.issues||d?.diagnostics); const uniqueWarnings=[...new Map(warnings.map(warning=>[warning.code||warning.message||warning.description||warning.title||warning.type,warning])).values()]; return uniqueWarnings.map(w=>`<div class="alert warning"><strong>${escapeHtml(w.title||w.type||'Report warning')}</strong><br>${escapeHtml(w.message||w.description||'Review Reconciliation.')} <button class="secondary" data-accounting-section="accounting-reconciliation">Open Reconciliation</button></div>`).join(''); }
function reportShell(root,title,filters,body=''){ root.innerHTML=`<div class="report-page"><div class="card-header"><div><div class="eyebrow">Accounting</div><h2>${title}</h2><p class="muted">GROW Microfinance · Generated ${new Date().toLocaleString()}</p></div><button class="secondary" onclick="window.print()">Print Report</button></div><form class="accounting-filters report-filters">${filters}<button>Run Report</button><button class="secondary" type="reset">Clear</button></form><div class="report-results">${body}</div></div>`; }
function reportTable(headers, rows){ return `<div class="table-scroll report-table"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.join('')}</tbody></table></div>`; }
function reportAccountName(a){ return a.label||a.name||a.account_name||a.description||''; }
function reportAccountCode(a){ return a.account_code||a.code||''; }
function reportAccountAmount(a){ return a.current??a.amount??a.balance??a.closing_balance??a.value??0; }
function reportSectionTitle(s,fallback){ return s.title||s.name||s.label||s.section_name||s.category||fallback; }
function reportSectionAccounts(s){ return reportItems(s?.accounts||s?.rows||s?.items||s?.children||s?.data); }
function reportSectionTotal(s){ return s?.total??s?.amount??s?.balance??s?.current??s?.section_total; }
function reportRenderAccountRows(accounts){ return accounts.map(a=>`<tr><td>${escapeHtml(reportAccountCode(a))}</td><td><button class="link-button" data-drill-account="${escapeHtml(a.account_id||a.id||'')}">${escapeHtml(reportAccountName(a))}</button></td><td class="money">${reportCurrency(reportAccountAmount(a))}</td></tr>`).join(''); }
function reportRenderFinancialSection(title, sections, totalLabel, totalValue){ const sectionHtml=(sections||[]).map((section,i)=>{ const accounts=reportSectionAccounts(section); const total=reportSectionTotal(section); return `<tr class="parent-row"><td colspan="2"><strong>${escapeHtml(reportSectionTitle(section, title))}</strong></td><td class="money">${total==null?'':reportCurrency(total)}</td></tr>${accounts.length?reportRenderAccountRows(accounts):''}`; }).join(''); return `${sectionHtml||`<tr class="parent-row"><td colspan="3"><strong>${escapeHtml(title)}</strong></td></tr>`}<tr class="total-row"><td colspan="2"><strong>${escapeHtml(totalLabel)}</strong></td><td class="money"><strong>${reportCurrency(totalValue)}</strong></td></tr>`; }
function reportIncomeHasActivity(d){ return d.has_activity===true || reportAmountNumber(d.total_income)!==0 || reportAmountNumber(d.total_expenses)!==0 || reportAmountNumber(d.net_profit??d.net_profit_loss??d.totals?.net_profit_loss)!==0 || (d.income_sections||[]).some(section=>reportSectionAccounts(section).length>0) || (d.expense_sections||[]).some(section=>reportSectionAccounts(section).length>0); }
function reportAnyRows(sections){ return (sections||[]).some(section=>reportSectionAccounts(section).length>0 || (section?.sections||section?.children||[]).some?.(child=>reportSectionAccounts(child).length>0)); }
function reportNamedSections(group,names){ return names.map(([key,label])=>{ const section=group?.[key]; return section == null ? null : (typeof section==='object' ? Object.assign({title:label}, section) : {title:label,total:section}); }).filter(Boolean); }
function reportRenderNestedSections(title, group){ const fallbackNames=title==='Assets' ? [['current_assets','Current Assets'],['non_current_assets','Non-current Assets'],['noncurrent_assets','Non-current Assets']] : title==='Liabilities' ? [['current_liabilities','Current Liabilities'],['non_current_liabilities','Non-current Liabilities'],['noncurrent_liabilities','Non-current Liabilities']] : [['capital','Capital'],['retained_earnings','Retained Earnings'],['current_period_earnings','Current Period Earnings']]; const sections=(group?.sections||group?.subsections||group?.categories||reportNamedSections(group,fallbackNames)||[]); const own=reportSectionAccounts(group); const total=group?.total??group?.amount??group?.balance??0; let html=`<tr class="parent-row"><td colspan="2"><strong>${escapeHtml(title)}</strong></td><td class="money"><strong>${reportCurrency(total)}</strong></td></tr>`; html+=own.length?reportRenderAccountRows(own):''; html+=(sections||[]).map(s=>`<tr class="parent-row"><td></td><td><strong>${escapeHtml(reportSectionTitle(s,''))}</strong></td><td class="money">${reportSectionTotal(s)==null?'':reportCurrency(reportSectionTotal(s))}</td></tr>${reportRenderAccountRows(reportSectionAccounts(s))}`).join(''); return html; }
function reportBalanceHasActivity(d){ const groups=[d.assets,d.liabilities,d.equity].filter(Boolean); return d.has_activity===true || groups.some(g=>reportAnyRows([g]) || reportAnyRows(g.sections||g.subsections||g.categories||[])) || ['total_assets','total_liabilities','total_equity','total_liabilities_and_equity','difference'].some(k=>reportAmountNumber(d[k]??d.totals?.[k])!==0) || reportAmountNumber(d.assets?.total_assets??d.assets?.total??d.assets?.current_assets?.total??d.assets?.non_current_assets?.total)!==0 || reportAmountNumber(d.liabilities?.total_liabilities??d.liabilities?.total??d.liabilities?.current_liabilities?.total??d.liabilities?.non_current_liabilities?.total)!==0 || reportAmountNumber(d.equity?.total_equity??d.equity?.total)!==0; }
async function loadFinancialReports(){const root=document.querySelector('#accounting-reports-root'); if(!root)return; reportShell(root,'Financial Reports',`<label>Date From<input name="date_from" type="date"></label><label>Date To<input name="date_to" type="date"></label><label>As of Date<input name="as_of_date" type="date" value="${new Date().toISOString().slice(0,10)}"></label>`,'Loading...'); const form=root.querySelector('form'); async function run(e){e&&e.preventDefault(); const box=root.querySelector('.report-results'); box.innerHTML='Loading...'; try{const d=await api('/admin/accounting/reports/summary?'+reportQuery(form)); const cards=['total_assets','total_liabilities','total_equity','total_income','total_expenses','net_profit_loss','trial_balance_difference','financial_position_difference'].map(k=>`<div class="metric"><div class="metric-label">${k.replaceAll('_',' ')}</div><div class="metric-value">${reportCurrency(d[k])}</div></div>`).join(''); box.innerHTML=`${reportWarnings(d)}<div class="accounting-grid">${cards}</div><div class="subcard"><h3>Status</h3><p>Trial Balance: ${d.trial_balance_balanced?'Balanced':'Out of Balance'}</p><p>Statement of Financial Position: ${d.financial_position_balanced?'Balanced':'Out of Balance'}</p><p>Unclassified Accounts: ${escapeHtml(d.unclassified_accounts??0)}</p><p>${d.incomplete_accounting_history?'Incomplete Accounting History warning':'Accounting history OK'}</p></div><div class="action-row"><button data-accounting-section="accounting-trial-balance">Open Trial Balance</button><button data-accounting-section="accounting-income-statement">Open Income Statement</button><button data-accounting-section="accounting-financial-position">Open Statement of Financial Position</button><button class="secondary" data-accounting-section="accounting-reconciliation">Open Reconciliation</button></div>`;}catch(err){box.innerHTML=`<div class="alert error">${escapeHtml(err.message)}</div>`;}} form.onsubmit=run; await run();}
async function loadTrialBalance(){const root=document.querySelector('#accounting-trial-balance-root'); if(!root)return; reportShell(root,'Trial Balance',`<label>As of Date<input name="as_of_date" type="date" value="${new Date().toISOString().slice(0,10)}"></label><label>Date From<input name="date_from" type="date"></label><label><input name="include_zero_balances" type="checkbox" value="true"> Include Zero Balances</label><label>Account Type<select name="account_type"><option value="">All</option><option>ASSET</option><option>LIABILITY</option><option>EQUITY</option><option>INCOME</option><option>EXPENSE</option></select></label><label>Compare With Date<input name="compare_with_date" type="date"></label><button type="button" data-export>Export CSV</button>`,'Loading...'); const form=root.querySelector('form'); async function run(e){e&&e.preventDefault(); const q=reportQuery(form); const box=root.querySelector('.report-results'); try{const d=await api('/admin/accounting/reports/trial-balance?'+q); const rows=reportItems(d).map(r=>`<tr class="${r.is_parent?'parent-row':''}"><td>${escapeHtml(r.account_code||r.code||'')}</td><td style="padding-left:${Number(r.depth||r.level||0)*16+8}px"><button class="link-button" data-drill-account="${escapeHtml(r.account_id||r.id||'')}">${escapeHtml(r.account_name||r.name||'')}</button></td><td>${escapeHtml(r.account_type||r.type||'')}</td>${['opening_debit','opening_credit','period_debit','period_credit','closing_debit','closing_credit','comparative_debit','comparative_credit','variance'].map(k=>`<td class="money">${Number(r[k]||0)?reportCurrency(r[k]):'—'}</td>`).join('')}</tr>`); const diff=d.totals?.difference??d.difference; box.innerHTML=`<h3>GROW Microfinance — Trial Balance</h3><p>${escapeHtml(form.as_of_date.value)}</p><div class="alert ${Number(diff||0)===0?'success':'warning'}">${Number(diff||0)===0?'Balanced':'Out of Balance'} · Difference ${reportCurrency(diff)}</div>${reportWarnings(d)}${rows.length?reportTable(['Account Code','Account Name','Account Type','Opening Debit','Opening Credit','Period Debit','Period Credit','Closing Debit','Closing Credit','Comparative Debit','Comparative Credit','Variance'],rows):'<p>No posted accounting activity was found up to the selected date.</p>'}`;}catch(err){box.innerHTML=`<div class="alert error">${escapeHtml(err.message)}</div>`;}} form.onsubmit=run; root.querySelector('[data-export]').onclick=()=>api('/admin/accounting/reports/trial-balance/export.csv?'+reportQuery(form)); await run();}
async function loadIncomeStatement(){const root=document.querySelector('#accounting-income-statement-root'); if(!root)return; reportShell(root,'Income Statement',`<label>Date From<input name="date_from" type="date"></label><label>Date To<input name="date_to" type="date" value="${reportToday()}"></label><label>Comparative Date From<input name="comparative_date_from" type="date"></label><label>Comparative Date To<input name="comparative_date_to" type="date"></label><label><input name="include_zero_balances" type="checkbox" value="true"> Include Zero Balances</label><button type="button" data-export>Export CSV</button>`,'Loading...'); const form=root.querySelector('form'); async function run(e){e&&e.preventDefault(); const box=root.querySelector('.report-results'); try{const d=await api('/admin/accounting/reports/income-statement?'+reportQuery(form)); const totalIncome=d.total_income??d.totals?.total_income??0; const totalExpenses=d.total_expenses??d.totals?.total_expenses??0; const net=d.net_profit??d.net_profit_loss??d.totals?.net_profit??d.totals?.net_profit_loss??(reportAmountNumber(totalIncome)-reportAmountNumber(totalExpenses)); const hasActivity=reportIncomeHasActivity(d); const body=hasActivity?reportTable(['Account Code','Description','Amount'],[reportRenderFinancialSection('Income',d.income_sections||[],'Total Income',totalIncome),reportRenderFinancialSection('Expenses',d.expense_sections||[],'Total Expenses',totalExpenses),`<tr class="total-row"><td colspan="2"><strong>${reportAmountNumber(net)<0?'Net Loss':'Net Profit'}</strong></td><td class="money"><strong>${reportCurrency(net)}</strong></td></tr>`]):'<p>No income or expense activity was found for the selected period.</p>'; box.innerHTML=`<h3>GROW Microfinance — Income Statement</h3><p>${escapeHtml(form.date_from.value||'Beginning')} to ${escapeHtml(form.date_to.value||reportToday())}</p>${reportWarnings(d)}${body}`;}catch(err){box.innerHTML=`<div class="alert error">${escapeHtml(err.message)}</div>`;}} form.onsubmit=run; root.querySelector('[data-export]').onclick=()=>api('/admin/accounting/reports/income-statement/export.csv?'+reportQuery(form)); await run();}
async function loadFinancialPosition(){const root=document.querySelector('#accounting-financial-position-root'); if(!root)return; reportShell(root,'Statement of Financial Position',`<label>As of Date<input name="as_of_date" type="date" value="${reportToday()}"></label><label>Comparative As of Date<input name="comparative_as_of_date" type="date"></label><label><input name="include_zero_balances" type="checkbox" value="true"> Include Zero Balances</label><button type="button" data-export>Export CSV</button>`,'Loading...'); const form=root.querySelector('form'); async function run(e){e&&e.preventDefault(); const box=root.querySelector('.report-results'); try{const d=await api('/admin/accounting/reports/statement-of-financial-position?'+reportQuery(form)); const currentAssets=reportAmountNumber(d.assets?.current_assets?.total); const nonCurrentAssets=reportAmountNumber(d.assets?.non_current_assets?.total??d.assets?.noncurrent_assets?.total); const totalAssets=reportAmountNumber(d.assets?.total_assets??d.assets?.total??d.totals?.total_assets??d.total_assets??(currentAssets+nonCurrentAssets)); const currentLiabilities=reportAmountNumber(d.liabilities?.current_liabilities?.total); const nonCurrentLiabilities=reportAmountNumber(d.liabilities?.non_current_liabilities?.total??d.liabilities?.noncurrent_liabilities?.total); const totalLiabilities=reportAmountNumber(d.liabilities?.total_liabilities??d.liabilities?.total??d.totals?.total_liabilities??d.total_liabilities??(currentLiabilities+nonCurrentLiabilities)); const equityAccountsTotal=(d.equity?.accounts||[]).reduce((sum,row)=>sum+reportAmountNumber(row.amount),0); const equitySectionsTotal=reportNamedSections(d.equity,[['capital','Capital'],['retained_earnings','Retained Earnings'],['current_period_earnings','Current Period Earnings']]).reduce((sum,row)=>sum+reportAmountNumber(reportSectionTotal(row)),0); const resolvedEquityAccountsTotal=equityAccountsTotal||equitySectionsTotal; const totalEquity=reportAmountNumber(d.equity?.total_equity??d.equity?.total??d.totals?.total_equity??d.total_equity??resolvedEquityAccountsTotal); const totalLAndE=reportAmountNumber(d.total_liabilities_and_equity??d.totals?.total_liabilities_and_equity??(totalLiabilities+totalEquity)); const calculatedDifference=totalAssets-(totalLiabilities+totalEquity); const backendDifference=d.difference??d.balancing_difference??d.totals?.difference??d.totals?.balancing_difference; const diff=backendDifference==null?calculatedDifference:reportAmountNumber(backendDifference); const balanced=Math.abs(calculatedDifference)<=0.01; const consistencyWarnings=[]; if(Math.abs(totalAssets-(currentAssets+nonCurrentAssets))>0.01) consistencyWarnings.push('Asset subtotal mismatch detected.'); if(Math.abs(totalLiabilities-(currentLiabilities+nonCurrentLiabilities))>0.01) consistencyWarnings.push('Liability subtotal mismatch detected.'); if(Math.abs(totalEquity-resolvedEquityAccountsTotal)>0.01 && resolvedEquityAccountsTotal!==0) consistencyWarnings.push('Equity subtotal mismatch detected.'); if(backendDifference!=null && Math.abs(diff-calculatedDifference)>0.01) consistencyWarnings.push('Backend/display balancing difference mismatch detected.'); const consistencyWarningHtml=consistencyWarnings.map(message=>`<div class="alert warning"><strong>Report warning</strong><br>${escapeHtml(message)}</div>`).join(''); const hasActivity=reportBalanceHasActivity(d); const assetsGroup=Object.assign({},d.assets||{},{total:totalAssets}); const liabilitiesGroup=Object.assign({},d.liabilities||{},{total:totalLiabilities}); const equityGroup=Object.assign({},d.equity||{},{total:totalEquity}); const body=hasActivity?reportTable(['Account Code','Description','Amount'],[reportRenderNestedSections('Assets',assetsGroup),`<tr class="total-row"><td colspan="2"><strong>Total Assets</strong></td><td class="money"><strong>${reportCurrency(totalAssets)}</strong></td></tr>`,reportRenderNestedSections('Liabilities',liabilitiesGroup),`<tr class="total-row"><td colspan="2"><strong>Total Liabilities</strong></td><td class="money"><strong>${reportCurrency(totalLiabilities)}</strong></td></tr>`,reportRenderNestedSections('Equity',equityGroup),`<tr class="total-row"><td colspan="2"><strong>Total Equity</strong></td><td class="money"><strong>${reportCurrency(totalEquity)}</strong></td></tr><tr class="total-row"><td colspan="2"><strong>Total Liabilities and Equity</strong></td><td class="money"><strong>${reportCurrency(totalLAndE)}</strong></td></tr><tr class="total-row"><td colspan="2"><strong>Balancing Difference</strong></td><td class="money"><strong>${reportCurrency(calculatedDifference)}</strong></td></tr>`]):'<p>No balance sheet activity was found up to the selected date.</p>'; box.innerHTML=`<h3>GROW Microfinance — Statement of Financial Position</h3><p>As of ${escapeHtml(form.as_of_date.value||reportToday())}</p><div class="alert ${balanced?'success':'error'}">${balanced?'Balanced':'Not balanced'} — Difference ${reportCurrency(calculatedDifference)}</div>${reportWarnings(d)}${consistencyWarningHtml}${body}`;}catch(err){box.innerHTML=`<div class="alert error">${escapeHtml(err.message)}</div>`;}} form.onsubmit=run; root.querySelector('[data-export]').onclick=()=>api('/admin/accounting/reports/statement-of-financial-position/export.csv?'+reportQuery(form)); await run();}
async function loadAccountDrilldown(id){ if(!id)return; const modal=document.createElement('div'); modal.className='modal'; modal.innerHTML='<div class="modal-card wide"><button class="icon-button" data-close>×</button><h2>Account Drill-down</h2><p>Loading...</p></div>'; document.body.appendChild(modal); modal.onclick=e=>{if(e.target.dataset.close!==undefined)modal.remove();}; try{const d=await api('/admin/accounting/reports/account-drilldown?account_id='+encodeURIComponent(id)); const tx=reportItems(d.transactions||d.items||d.data); modal.querySelector('.modal-card').innerHTML=`<button class="icon-button" data-close>×</button><h2>${escapeHtml(d.account_code||'')} — ${escapeHtml(d.account_name||'Account')}</h2><div class="accounting-grid">${['account_type','account_subtype','normal_balance','opening_balance','total_debit','total_credit','closing_balance'].map(k=>`<div class="metric"><div class="metric-label">${k.replaceAll('_',' ')}</div><div>${k.includes('balance')||k.includes('total')?reportCurrency(d[k]):escapeHtml(d[k]||'—')}</div></div>`).join('')}</div>${reportTable(['Date','Journal No.','Description','Reference Type','Customer','Loan','Debit','Credit','Running Balance'],tx.map(r=>`<tr><td>${escapeHtml(r.date||'')}</td><td>${escapeHtml(r.journal_no||'')}</td><td>${escapeHtml(r.description||'')}</td><td>${escapeHtml(r.reference_type||'')}</td><td>${escapeHtml(r.customer_name||r.customer_number||'')}</td><td>${escapeHtml(r.loan_number||'')}</td><td class="money">${reportCurrency(r.debit)}</td><td class="money">${reportCurrency(r.credit)}</td><td class="money">${reportCurrency(r.running_balance)}</td></tr>`))}<button data-accounting-section="accounting-ledger">Open Full General Ledger</button>`;}catch(err){modal.querySelector('.modal-card').innerHTML=`<button class="icon-button" data-close>×</button><div class="alert error">${escapeHtml(err.message)}</div>`;}}
const phase2ShowAdminSection=showAdminSection; showAdminSection=function(section='dashboard'){ phase2ShowAdminSection(section); if(section==='accounting-reports')loadFinancialReports(); if(section==='accounting-trial-balance')loadTrialBalance(); if(section==='accounting-income-statement')loadIncomeStatement(); if(section==='accounting-financial-position')loadFinancialPosition(); };
document.addEventListener('click',e=>{const id=e.target.closest('[data-drill-account]')?.dataset.drillAccount; if(id){e.preventDefault(); loadAccountDrilldown(id);}});
const pathSection={'/admin/accounting/reports':'accounting-reports','/admin/accounting/trial-balance':'accounting-trial-balance','/admin/accounting/income-statement':'accounting-income-statement','/admin/accounting/financial-position':'accounting-financial-position','/admin/accounting/balance-sheet':'accounting-financial-position'}; if(pathSection[location.pathname]) setTimeout(()=>showAdminSection(pathSection[location.pathname]),0);

// Phase 3 collector collections and deposits frontend
const collectionState = { receipts: [], deposits: [], balances: [], selectedReceiptIds: new Set(), accounts: [], collectors: [], settings: {} };
function collectionItems(d){ return accountItems(d); }
function collectionApiError(e){ return e?.status===404 ? 'Collection deposit API endpoint is not available.' : (e?.message||'Failed to load collection data.'); }
function collectionAccountLabel(a){ return `${a?.code||a?.account_code||''} — ${a?.name||a?.account_name||''}`.replace(/^ — /,''); }
function collectionIsBank(a){ return String(acctSubtype(a)||a?.name||a?.account_name||'').toUpperCase().includes('BANK'); }
function collectionIsClearing(a){ return String(acctSubtype(a)||'').toUpperCase().replace(/[ -]/g,'_').includes('COLLECTION_CLEARING') || String(a?.name||a?.account_name||'').toUpperCase().includes('COLLECTION ACCOUNT'); }
function collectionCollectorName(x){
  const collector=x?.collector;
  const value=x?.collector_name||x?.collectorName||x?.staff_name||x?.staffName||x?.full_name||x?.name
    ||(collector&&typeof collector==='object'&&(collector.name||collector.full_name||collector.staff_name||collector.display_name))
    ||(typeof collector==='string'?collector:'');
  const code=x?.collector_code||x?.collectorCode||(collector&&typeof collector==='object'&&(collector.code||collector.collector_code));
  return [code,value].filter(Boolean).join(' — ')||'—';
}
function collectionIsUndepositedEligible(row){
  const status=String(row?.deposit_status||row?.reconciliation_status||row?.status||'').toUpperCase();
  const sheetOrigin=Boolean(row?.collection_sheet_id||row?.collectionSheetId||row?.collection_sheet_number||String(row?.source_type||row?.sourceType||'').toUpperCase()==='COLLECTION_SHEET');
  const sheetDepositPosted=row?.bank_deposit_posted===true||row?.deposit_posted===true||row?.is_deposited===true||row?.is_reconciled===true||['POSTED','DEPOSITED','RECONCILED','POSTED_AND_DEPOSITED'].includes(status);
  return !(sheetOrigin&&sheetDepositPosted) && Number(row?.undeposited_amount??row?.remaining_amount??row?.amount??0)>0;
}
function collectionTextValue(...values){
  const value=values.find(candidate=>typeof candidate==='string'&&candidate.trim());
  return value?.trim()||'';
}
function collectionCustomerName(row={}){
  return collectionTextValue(row.customer_name,row.customer_full_name,row.full_name,row.customer?.full_name,row.customer?.name,row.loan?.customer_name,row.loan?.customer_full_name,row.loan?.customer?.full_name,row.loan?.customer?.name)||'—';
}
function collectionLoanNumber(row={}){
  return collectionTextValue(row.loan_number,row.loan_no,row.loan?.loan_number,row.loan?.loan_no,row.loan?.number)||'—';
}
async function collectionBootstrapData(){
  const [settings, accounts, collectors] = await Promise.allSettled([api('/admin/accounting/settings'), api('/admin/accounting/accounts?active=true'), api('/admin/collectors')]);
  collectionState.settings = settings.status==='fulfilled' ? settings.value||{} : {};
  collectionState.accounts = accounts.status==='fulfilled' ? accountItems(accounts.value) : [];
  collectionState.collectors = collectors.status==='fulfilled' ? accountItems(collectors.value) : [];
}
function ensureCollectionsNavigation(){
  const host=document.querySelector('.admin-sidebar,.sidebar,.admin-menu,nav,.admin-nav');
  if(host && !document.querySelector('[data-collections-nav]')) host.insertAdjacentHTML('beforeend', `<div data-collections-nav class="menu-group"><div class="eyebrow">Collections</div>${[['Record Payment','loans'],['Collection Sheets','collection-sheets'],['Collectors','collections-collectors'],['Undeposited Collections','collections-undeposited'],['Deposit Collections','collections-deposit'],['Deposit Register','collections-register'],['Collector Balances','collections-balances']].map(([l,s])=>`<button class="admin-menu-item" data-section-link="${s}">${l}</button>`).join('')}</div>`);
  const sectionsHost=document.querySelector('.admin-content')||document.querySelector('#admin-panel')||document.body;
  [['collection-sheets','collection-sheets-root'],['collections-collectors','collections-collectors-root'],['collections-undeposited','collections-undeposited-root'],['collections-deposit','collections-deposit-root'],['collections-register','collections-register-root'],['collections-balances','collections-balances-root']].forEach(([sec,id])=>{ if(!document.querySelector(`#${id}`)) sectionsHost.insertAdjacentHTML('beforeend',`<section class="admin-section hidden" data-section="${sec}"><div id="${id}"></div></section>`); });
}
async function loadUndepositedCollections(){ const root=document.querySelector('#collections-undeposited-root'); if(!root)return; root.innerHTML='<h2>Undeposited Collections</h2><p>Loading...</p>'; try{ await collectionBootstrapData(); const rows=collectionItems(await api('/admin/collections/undeposited')).filter(collectionIsUndepositedEligible); collectionState.receipts=rows; collectionState.selectedReceiptIds.clear(); const filterHtml=`<div class="accounting-filters"><select><option>Collector</option></select><input type="date" placeholder="Date from"><input type="date" placeholder="Date to"><input placeholder="Customer"><input placeholder="Loan"><select><option>Status</option><option>UNDEPOSITED</option><option>PARTIAL</option></select></div>`; const table=rows.map(r=>{const id=r.id||r.receipt_id||r.receiptNumber; const amount=Number(r.amount_collected||r.amount||0), dep=Number(r.amount_deposited||r.deposited_amount||0), und=Number(r.undeposited_amount ?? (amount-dep)); return `<tr><td><input type="checkbox" data-select-receipt="${escapeHtml(id)}" data-amount="${und}"></td><td>${escapeHtml(r.receipt_number||r.receiptNo||id)}</td><td>${escapeHtml(formatDateOnlyDisplay(r.payment_date||r.paid_date))}</td><td>${escapeHtml(collectionCollectorName(r))}</td><td>${escapeHtml(collectionCustomerName(r))}</td><td>${escapeHtml(collectionLoanNumber(r))}</td><td>${formatCurrency(amount)}</td><td>${formatCurrency(dep)}</td><td>${formatCurrency(und)}</td><td><span class="badge">${escapeHtml(r.status||'Undeposited')}</span></td></tr>`;}).join(''); root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Collections</div><h2>Undeposited Collections</h2></div><button data-accounting-section="collections-deposit">Deposit Selected</button></div>${filterHtml}<div class="table-scroll collection-responsive-table"><table><thead><tr>${['Select','Receipt','Payment date','Collector','Customer','Loan','Amount collected','Amount deposited','Undeposited','Status'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${table||'<tr><td colspan="10">No undeposited collections found.</td></tr>'}</tbody></table></div><div class="subcard sticky-modal-footer" id="undeposited-totals">Selected collections: 0 · Selected amount: ${formatCurrency(0)} · Total undeposited: ${formatCurrency(rows.reduce((s,r)=>s+Number(r.undeposited_amount??r.amount??0),0))}</div>`; root.querySelectorAll('[data-select-receipt]').forEach(cb=>cb.onchange=()=>{ const selected=[...root.querySelectorAll('[data-select-receipt]:checked')]; root.querySelector('#undeposited-totals').textContent=`Selected collections: ${selected.length} · Selected amount: ${formatCurrency(selected.reduce((s,c)=>s+Number(c.dataset.amount||0),0))} · Total undeposited: ${formatCurrency(rows.reduce((s,r)=>s+Number(r.undeposited_amount??r.amount??0),0))}`; }); }catch(e){root.innerHTML=`<div class="alert error">${escapeHtml(collectionApiError(e))}</div>`;} }
async function loadDepositCollections(){
  const root=document.querySelector('#collections-deposit-root');
  if(!root)return;
  root.innerHTML='<h2>Deposit Collections</h2><p>Loading...</p>';
  try{
    await collectionBootstrapData();
    const collectors=collectionState.collectors, accounts=collectionState.accounts;
    const allowPartial=String(collectionState.settings.allow_partial_deposits ?? collectionState.settings.allowPartialDeposits ?? true)!=='false';
    root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Collections</div><h2>Deposit Collections</h2></div></div><div id="deposit-message"></div><div class="accounting-grid"><label>Collector<select id="deposit-collector"><option value="">Select collector</option>${collectors.map(c=>`<option value="${escapeHtml(c.id)}">${escapeHtml(collectionCollectorName(c))}</option>`).join('')}</select></label><label>Collector collection account<select id="deposit-source-account"><option value="">Select account</option>${accounts.filter(collectionIsClearing).map(a=>`<option value="${escapeHtml(a.id)}">${escapeHtml(collectionAccountLabel(a))}</option>`).join('')}</select></label><label>Deposit date<input id="deposit-date" type="date" value="${todayDateOnly()}"></label><label>Destination bank account<select id="deposit-bank"><option value="">Select bank account</option>${accounts.filter(collectionIsBank).map(a=>`<option value="${escapeHtml(a.id)}">${escapeHtml(collectionAccountLabel(a))}</option>`).join('')}</select></label><label>Bank deposit/reference number<input id="deposit-reference"></label><label>Remarks<textarea id="deposit-remarks"></textarea></label></div><div id="historical-deposit-panel"></div><div id="deposit-receipts"><p class="muted">Select a collector to load all undeposited collections.</p></div><div id="deposit-preview" class="subcard"></div><div class="modal-actions sticky-modal-footer"><button id="preview-collection-deposit" class="secondary">Preview Collection Deposit</button><button id="post-collection-deposit" disabled>Post Collection Deposit</button></div>`;
    const collectorEl=root.querySelector('#deposit-collector'), sourceEl=root.querySelector('#deposit-source-account'), dateEl=root.querySelector('#deposit-date'), bankEl=root.querySelector('#deposit-bank'), refEl=root.querySelector('#deposit-reference'), remarksEl=root.querySelector('#deposit-remarks'), receiptsEl=root.querySelector('#deposit-receipts'), preview=root.querySelector('#deposit-preview'), previewBtn=root.querySelector('#preview-collection-deposit'), btn=root.querySelector('#post-collection-deposit'), msg=root.querySelector('#deposit-message');
    let rows=[], previewPayload=null, previewResponse=null;
    const selectedLines=()=>[...root.querySelectorAll('[data-deposit-line]:checked')];
    const total=()=>selectedLines().reduce((s,cb)=>s+Number(root.querySelector(`[data-include-amount="${CSS.escape(cb.value)}"]`)?.value||cb.dataset.undeposited||0),0);
    const accountLabelById=id=>collectionAccountLabel(accounts.find(a=>String(a.id)===String(id)));
    const buildPayload=()=>({
      collector_id:Number(collectorEl.value),
      collector_account_id:Number(sourceEl.value),
      bank_account_id:Number(bankEl.value),
      deposit_date:dateEl.value,
      bank_reference:refEl.value.trim(),
      remarks:remarksEl.value.trim(),
      allocations:selectedLines().map(cb=>({payment_id:Number(cb.value),amount:Number(root.querySelector(`[data-include-amount="${CSS.escape(cb.value)}"]`)?.value||0)}))
    });
    const missingFields=payload=>{ const missing=[]; if(!payload.collector_id)missing.push('collector'); if(!payload.collector_account_id)missing.push('collector collection account'); if(!payload.bank_account_id)missing.push('destination bank account'); if(!payload.deposit_date)missing.push('deposit date'); if(!payload.allocations.length)missing.push('selected collections'); return missing; };
    const resetPreview=()=>{ previewPayload=null; previewResponse=null; btn.disabled=true; };
    const renderPreview=()=>{
      const t=total(), hist=isHistoricalDate(dateEl.value);
      root.querySelector('#historical-deposit-panel').innerHTML=hist?`<div class="alert warning"><strong>Historical collector deposit</strong><br>Validate deposit date is not earlier than selected payment dates, accounting period is open, and sufficient collector balance existed on that date. Do not silently use today’s date.</div>`:'';
      preview.innerHTML=`<h3>Deposit journal preview</h3><div class="accounting-grid"><p><strong>Dr ${escapeHtml(accountLabelById(bankEl.value)||'Main Bank Account')}</strong><br>${formatCurrency(t)}</p><p><strong>Cr ${escapeHtml(accountLabelById(sourceEl.value)||'Collection Account – Collector')}</strong><br>${formatCurrency(t)}</p></div><p class="muted">This deposit transfers collector-held cash to the bank. Customer loan balances will not be changed again.</p><p><strong>Remaining collector balance after deposit:</strong> ${formatCurrency(rows.reduce((s,r)=>s+Number(r.undeposited_amount??r.amount??0),0)-t)}</p>`;
      previewBtn.disabled=!!(collectionState.settings.require_bank_reference_for_deposit&&!refEl.value.trim());
    };
    const renderRows=()=>{ receiptsEl.innerHTML=`<h3>Selected customer collections</h3><div class="table-scroll collection-responsive-table"><table><thead><tr><th>Select</th><th>Receipt</th><th>Customer</th><th>Loan Number</th><th>Payment date</th><th>Undeposited amount</th><th>Amount included in this deposit</th><th>Remaining</th></tr></thead><tbody>${rows.map(r=>{const id=r.payment_id||r.id||r.receipt_id||r.receipt_number; const und=Number(r.undeposited_amount??r.amount??0); return `<tr><td><input type="checkbox" data-deposit-line value="${escapeHtml(id)}" data-undeposited="${und}"></td><td>${escapeHtml(r.receipt_number||id)}</td><td>${escapeHtml(collectionCustomerName(r))}</td><td>${escapeHtml(collectionLoanNumber(r))}</td><td>${escapeHtml(formatDateOnlyDisplay(r.payment_date))}</td><td>${formatCurrency(und)}</td><td><input ${allowPartial?'':'readonly'} data-include-amount="${escapeHtml(id)}" type="number" step="0.01" max="${und}" value="${und}"></td><td data-remaining="${escapeHtml(id)}">${formatCurrency(0)}</td></tr>`;}).join('')}</tbody></table></div><div class="subcard sticky-modal-footer">Selected total: <strong id="deposit-selected-total">${formatCurrency(0)}</strong></div>`; receiptsEl.querySelectorAll('input').forEach(i=>i.oninput=()=>{ resetPreview(); receiptsEl.querySelectorAll('[data-include-amount]').forEach(inp=>{ const row=rows.find(r=>String(r.payment_id||r.id||r.receipt_id||r.receipt_number)===String(inp.dataset.includeAmount)); const und=Number(row?.undeposited_amount??row?.amount??0); const rem=Math.max(0,und-Number(inp.value||0)); receiptsEl.querySelector(`[data-remaining="${CSS.escape(inp.dataset.includeAmount)}"]`).textContent=formatCurrency(rem); }); receiptsEl.querySelector('#deposit-selected-total').textContent=formatCurrency(total()); renderPreview(); }); renderPreview(); };
    collectorEl.onchange=async()=>{ resetPreview(); receiptsEl.innerHTML='Loading undeposited collections...'; rows=collectionItems(await api(`/admin/collections/undeposited?collector_id=${encodeURIComponent(collectorEl.value)}`)).filter(collectionIsUndepositedEligible); renderRows(); };
    [sourceEl,dateEl,bankEl,refEl,remarksEl].forEach(el=>el.oninput=()=>{ resetPreview(); renderPreview(); });
    previewBtn.onclick=async()=>{ msg.innerHTML=''; resetPreview(); const payload=buildPayload(); const missing=missingFields(payload); if(missing.length){ msg.innerHTML=`<div class="alert error">${escapeHtml(`Cannot preview deposit. Missing: ${missing.join(', ')}`)}</div>`; return; } console.log('Collection deposit preview payload:', payload); previewBtn.disabled=true; preview.innerHTML='Loading deposit preview...'; try{ previewResponse=await api('/admin/collection-deposits/preview',{method:'POST',body:payload}); previewPayload=payload; preview.innerHTML=`<h3>Deposit journal preview</h3><div class="accounting-grid"><p><strong>Dr ${escapeHtml(accountLabelById(payload.bank_account_id)||'Main Bank Account')}</strong><br>${formatCurrency(total())}</p><p><strong>Cr ${escapeHtml(accountLabelById(payload.collector_account_id)||'Collection Account – Collector')}</strong><br>${formatCurrency(total())}</p></div><div class="alert success">Preview successful. Post Collection Deposit is now enabled.</div>`; btn.disabled=false; }catch(e){ preview.innerHTML='<p>Preview failed.</p>'; msg.innerHTML=`<div class="alert error">${escapeHtml(collectionApiError(e))}</div>`; }finally{ previewBtn.disabled=false; } };
    btn.onclick=async()=>{ if(btn.disabled||!previewPayload)return; if(!confirm(`Post Collection Deposit\n\nCollector: ${collectorEl.options[collectorEl.selectedIndex]?.text}\nDestination: ${bankEl.options[bankEl.selectedIndex]?.text}\nReceipts: ${previewPayload.allocations.length}\nDeposit total: ${formatCurrency(total())}\n\nJournal:\nDr ${bankEl.options[bankEl.selectedIndex]?.text}\nCr ${sourceEl.options[sourceEl.selectedIndex]?.text}`))return; btn.disabled=true; msg.innerHTML=''; try{ const res=await api('/admin/collection-deposits',{method:'POST',body:previewPayload}); const required=['deposit_batch_id','deposit_number','journal_entry_id','journal_number']; const missing=required.filter(k=>!res?.[k]); if(missing.length){ msg.innerHTML=`<div class="alert error">Collection deposit response is missing: ${escapeHtml(missing.join(', '))}.</div>`; return; } msg.innerHTML=`<div class="alert success">Collection deposit ${escapeHtml(res.deposit_number)} posted. Journal ${escapeHtml(res.journal_number)} created.</div>`; await Promise.allSettled([loadUndepositedCollections(),loadDepositRegister(),loadCollectorBalances(),loadFinancialReports(),accountingLoadLedger(),accountingLoadJournals(),loadAdminLoanLedger(true)]); }catch(e){ msg.innerHTML=`<div class="alert error">${escapeHtml(collectionApiError(e))}</div>`; } };
  }catch(e){root.innerHTML=`<div class="alert error">${escapeHtml(collectionApiError(e))}</div>`;}
}
async function loadDepositRegister(){ const root=document.querySelector('#collections-register-root'); if(!root)return; root.innerHTML='<h2>Deposit Register</h2><p>Loading...</p>'; try{ const rows=collectionItems(await api('/admin/collection-deposits')); root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Collections</div><h2>Deposit Register</h2></div></div><div class="table-scroll"><table><thead><tr>${['Deposit number','Deposit date','Collector','Collector account','Bank account','Amount','Bank reference','Status','Actions'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr><td>${escapeHtml(r.deposit_number||r.id)}</td><td>${escapeHtml(formatDateOnlyDisplay(r.deposit_date))}</td><td>${escapeHtml(collectionCollectorName(r))}</td><td>${escapeHtml(r.collection_account_name||'—')}</td><td>${escapeHtml(r.bank_account_name||'—')}</td><td>${formatCurrency(r.amount||r.deposit_amount)}</td><td>${escapeHtml(r.bank_reference||'—')}</td><td><span class="badge">${escapeHtml(r.status||'Posted')}</span></td><td><button data-view-deposit="${escapeHtml(r.id)}">View</button> <button data-reverse-deposit="${escapeHtml(r.id)}">Reverse</button> <button onclick="window.print()">Print Deposit Summary</button></td></tr>`).join('')}</tbody></table></div>`; }catch(e){root.innerHTML=`<div class="alert error">${escapeHtml(collectionApiError(e))}</div>`;} }
async function loadCollectorBalances(){ const root=document.querySelector('#collections-balances-root'); if(!root)return; root.innerHTML='<h2>Collector Balances</h2><p>Loading...</p>'; try{ const rows=collectionItems(await api('/admin/collections/collector-balances')); const sums=k=>rows.reduce((s,r)=>s+Number(r[k]||0),0); root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Collections</div><h2>Collector Balances</h2></div></div><div class="accounting-grid">${[['Opening balance',sums('opening_balance')],['Collections today',sums('collections_today')],['Deposits today',sums('deposits_today')],['Current undeposited balance',sums('closing_balance')||sums('current_undeposited_balance')]].map(([l,v])=>`<div class="metric"><div class="metric-label">${l}</div><div class="metric-value">${formatCurrency(v)}</div></div>`).join('')}</div><div class="table-scroll"><table><thead><tr>${['Collector','Collection account','Collections','Deposits','Adjustments','Closing balance','Last deposit','Actions'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr class="${Number(r.closing_balance||r.current_undeposited_balance||0)!==0?'alert-warning-row':''}"><td>${escapeHtml(collectionCollectorName(r))}</td><td>${escapeHtml(r.collection_account_name||'—')}</td><td>${formatCurrency(r.collections||r.collections_today)}</td><td>${formatCurrency(r.deposits||r.deposits_today)}</td><td>${formatCurrency(r.adjustments)}</td><td><strong>${formatCurrency(r.closing_balance||r.current_undeposited_balance)}</strong></td><td>${escapeHtml(formatDateOnlyDisplay(r.last_deposit_date)||'—')}</td><td><button data-collector-detail="${escapeHtml(r.collector_id||r.id)}">View Detail</button></td></tr>`).join('')}</tbody></table></div>`; }catch(e){root.innerHTML=`<div class="alert error">${escapeHtml(e.message)}</div>`;} }
async function openCollectorDetail(id){ const modal=document.createElement('div'); modal.className='modal-overlay historical-accounting-modal'; modal.innerHTML='<div class="modal-card wide"><button class="icon-button" data-close>×</button><h2>Collector Detail</h2><p>Loading...</p></div>'; document.body.appendChild(modal); modal.querySelector('[data-close]').onclick=()=>modal.remove(); try{ const d=await api(`/admin/collections/collectors/${encodeURIComponent(id)}/detail`); const status=Number(d.reconciliation_difference||0)===0?(Number(d.current_undeposited_balance||0)>0?'Needs deposit':'Balanced'):'Mismatch'; modal.querySelector('.modal-card').innerHTML=`<button class="icon-button" data-close>×</button><h2>Collector Detail</h2><div class="alert ${status==='Balanced'?'success':status==='Mismatch'?'error':'warning'}">${status}</div><div class="accounting-grid">${[['All customer collections',d.collections_count],['All deposit batches',d.deposit_batches_count],['Outstanding undeposited receipts',d.outstanding_receipts_count],['Historical balance',formatCurrency(d.historical_balance)],['GL balance',formatCurrency(d.gl_balance)],['Reconciliation difference',formatCurrency(d.reconciliation_difference)]].map(([l,v])=>`<div class="metric"><div class="metric-label">${escapeHtml(l)}</div><div>${escapeHtml(String(v??'—'))}</div></div>`).join('')}</div>`; modal.querySelector('[data-close]').onclick=()=>modal.remove(); }catch(e){modal.querySelector('.modal-card').innerHTML=`<button class="icon-button" data-close>×</button><div class="alert error">${escapeHtml(e.message)}</div>`;} }
const collectionSections=new Set(['collection-sheets','collections-collectors','collections-undeposited','collections-deposit','collections-register','collections-balances']);
const collectionSectionPaths={
  'collection-sheets':'/admin/collection-sheets',
  'collections-undeposited':'/admin/collections/undeposited',
  'collections-deposit':'/admin/collections/deposit',
  'collections-register':'/admin/collections/deposit-register',
  'collections-balances':'/admin/collections/collector-balances'
};
const collectionPathSections=Object.fromEntries(Object.entries(collectionSectionPaths).map(([section,path])=>[path,section]));
const collectionsShowAdminSection=showAdminSection;
showAdminSection=function(section='dashboard'){
  ensureCollectionsNavigation();
  collectionsShowAdminSection(section);
  document.querySelectorAll('.admin-section[data-section]').forEach(el=>{
    if(collectionSections.has(el.dataset.section)) el.classList.toggle('hidden',el.dataset.section!==section);
  });
  document.querySelectorAll('[data-collections-nav] [data-section-link]').forEach(el=>{
    const active=el.dataset.sectionLink===section;
    el.classList.toggle('active',active);
    el.setAttribute('aria-selected',active?'true':'false');
  });
  if(section==='collections-collectors')loadCollectorsManagement();
  if(section==='collections-undeposited')loadUndepositedCollections();
  if(section==='collections-deposit')loadDepositCollections();
  if(section==='collections-register')loadDepositRegister();
  if(section==='collections-balances')loadCollectorBalances();
};
document.addEventListener('click',event=>{
  const target=event.target.closest('[data-section-link],[data-accounting-section]');
  const section=target?.dataset.sectionLink||target?.dataset.accountingSection;
  const path=collectionSectionPaths[section];
  if(path&&location.pathname!==path) history.pushState({collectionSection:section},'',path);
});
window.addEventListener('popstate',()=>{ const section=collectionPathSections[location.pathname]; if(section)showAdminSection(section); });
if(collectionPathSections[location.pathname]) setTimeout(()=>showAdminSection(collectionPathSections[location.pathname]),0);
document.addEventListener('click',e=>{ const detail=e.target.closest('[data-collector-detail]')?.dataset.collectorDetail; if(detail) openCollectorDetail(detail); const rev=e.target.closest('[data-reverse-deposit]')?.dataset.reverseDeposit; if(rev){ const reason=prompt('Deposit reversal reason'); if(!reason)return; const reversal_date=prompt('Reversal date (YYYY-MM-DD)', todayDateOnly()); if(!reversal_date)return; if(confirm('Deposit reversal journal preview:\nDr Collection Account – Collector\nCr Bank Account')) api(`/admin/collections/deposits/${encodeURIComponent(rev)}/reverse`,{method:'POST',body:{reason,reversal_date}}).then(loadDepositRegister).catch(err=>alert(err.message)); }});
ensureCollectionsNavigation();

// Collection Sheet entry, approval, posting, reversal and print workflow.
const collectionSheetState = { rows: [], active: null, posting: false, searchTimer: null };
const csValue=(o,keys,fallback='')=>{ for(const key of keys){ const value=o?.[key]; if(value!==undefined&&value!==null) return value; } return fallback; };
const csId=o=>csValue(o,['id','collection_sheet_id','collectionSheetId']);
const csStatus=o=>String(csValue(o,['status'],'DRAFT')).toUpperCase();
const csTotals=o=>({
  gross:Number(csValue(o,['gross_collection','gross_amount','total_collections'],0)),
  expenses:Number(csValue(o,['total_expenses','expenses_total'],0)),
  expected:Number(csValue(o,['expected_deposit'],0)),
  actual:Number(csValue(o,['actual_deposit','deposit_amount'],0)),
  difference:Number(csValue(o,['difference','deposit_difference'],0))
});
const csRows=(o,keys)=>{ const value=csValue(o,keys,[]); return Array.isArray(value)?value:collectionItems(value); };
function csLockBody(){ document.body.classList.add('collection-sheet-modal-open'); }
function csUnlockBody(){ if(!document.querySelector('.collection-sheet-overlay')) document.body.classList.remove('collection-sheet-modal-open'); }
function csClose(modal){ modal?.remove(); csUnlockBody(); }
function csError(error,fallback='Unable to complete the request.'){
  const data=error?.data||error?.body||error?.response||{};
  return data.message||data.detail||error?.message||fallback;
}
function csStatusBadge(status){ return `<span class="badge collection-sheet-status status-${escapeHtml(String(status).toLowerCase())}">${escapeHtml(status)}</span>`; }
function csCanReverse(){ return accountingCan('collection_sheets.reverse')||accountingCan('collections.reverse'); }
function csSheetOptions(items,selected,name){ return `<option value="">Select ${name}</option>${items.map(item=>`<option value="${escapeHtml(csValue(item,['id']))}" ${String(csValue(item,['id']))===String(selected||'')?'selected':''}>${escapeHtml(name==='collector'?collectionCollectorName(item):collectionAccountLabel(item))}</option>`).join('')}`; }
function csPrintReport(sheet){
  const totals=csTotals(sheet), items=csRows(sheet,['items','collection_items','collections']), expenses=csRows(sheet,['expenses','expense_items']);
  return `<article class="collection-sheet-print-report">
    <header><h1>GROW Microfinance</h1><h2>DAILY COLLECTION SHEET</h2></header>
    <div class="print-meta"><span><b>Sheet No</b>${escapeHtml(csValue(sheet,['sheet_number','collection_sheet_number'],'—'))}</span><span><b>Collection Date</b>${escapeHtml(formatDateOnlyDisplay(csValue(sheet,['collection_date'])))}</span><span><b>Collector</b>${escapeHtml(collectionCollectorName(sheet))}</span><span><b>Status</b>${escapeHtml(csStatus(sheet))}</span></div>
    <h3>Customer Collections</h3><table><thead><tr><th>#</th><th>Customer</th><th>Loan No</th><th class="money">Amount</th></tr></thead><tbody>${items.map((item,index)=>`<tr><td>${index+1}</td><td>${escapeHtml(csValue(item,['customer_name','customer'],'—'))}</td><td>${escapeHtml(csValue(item,['loan_number','loan_no'],'—'))}</td><td class="money">${formatCurrency(csValue(item,['amount_collected','amount'],0))}</td></tr>`).join('')||'<tr><td colspan="4">No collections</td></tr>'}</tbody><tfoot><tr><th colspan="3">Gross Collection</th><th class="money">${formatCurrency(totals.gross)}</th></tr></tfoot></table>
    <h3>Expenses</h3><table><thead><tr><th>Description</th><th class="money">Amount</th></tr></thead><tbody>${expenses.map(item=>`<tr><td>${escapeHtml(csValue(item,['description','expense_name'],'—'))}</td><td class="money">${formatCurrency(csValue(item,['amount'],0))}</td></tr>`).join('')||'<tr><td colspan="2">No expenses</td></tr>'}</tbody><tfoot><tr><th>Total Expenses</th><th class="money">${formatCurrency(totals.expenses)}</th></tr></tfoot></table>
    <section class="print-reconciliation"><h3>Reconciliation</h3>${[['Gross Collection',totals.gross],['Less: Expenses',totals.expenses],['Expected Deposit',totals.expected],['Actual Bank Deposit',totals.actual],['Difference',totals.difference]].map(([label,value])=>`<div><span>${label}</span><strong>${formatCurrency(value)}</strong></div>`).join('')}</section>
    <footer><div><span class="signature-line"></span>Prepared By</div><div><span class="signature-line"></span>Approved By</div></footer>
  </article>`;
}
function csActionButtons(sheet){
  const id=csId(sheet), status=csStatus(sheet), draft=status==='DRAFT', submitted=status==='SUBMITTED', posted=['POSTED','RECONCILED'].includes(status);
  return `<div class="collection-sheet-row-actions"><button class="secondary" data-cs-open="${escapeHtml(id)}">View</button>${draft?`<button data-cs-open="${escapeHtml(id)}">Edit</button><button data-cs-submit="${escapeHtml(id)}">Submit</button>`:''}${submitted?`<button data-cs-preview="${escapeHtml(id)}">Approve &amp; Post</button>`:''}<button class="secondary" data-cs-print="${escapeHtml(id)}">Print</button>${posted&&csCanReverse()?`<button class="danger" data-cs-reverse="${escapeHtml(id)}">Reverse</button>`:''}</div>`;
}
async function loadCollectionSheets(){
  const root=document.querySelector('#collection-sheets-root'); if(!root)return;
  await collectionBootstrapData();
  root.innerHTML='<div class="collection-sheet-loading">Loading collection sheets…</div>';
  try{
    const filters=collectionSheetState.filters||{};
    const query=new URLSearchParams(Object.entries(filters).filter(([,value])=>value)).toString();
    const response=await api('/admin/collection-sheets'+(query?`?${query}`:''));
    collectionSheetState.rows=collectionItems(response);
    root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Collections</div><h2>Collection Sheets</h2><p class="muted">Create and approve daily collector sheets before posting payments.</p></div><button data-cs-create>+ Create Collection Sheet</button></div>
      <form id="collection-sheet-filters" class="accounting-filters collection-sheet-filters">
        <label>Date From<input name="date_from" type="date" value="${escapeHtml(filters.date_from||'')}"></label><label>Date To<input name="date_to" type="date" value="${escapeHtml(filters.date_to||'')}"></label>
        <label>Collector<select name="collector_id">${csSheetOptions(collectionState.collectors,filters.collector_id,'collector')}</select></label><label>Status<select name="status"><option value="">All statuses</option>${['DRAFT','SUBMITTED','POSTED','RECONCILED','REVERSED'].map(s=>`<option ${filters.status===s?'selected':''}>${s}</option>`).join('')}</select></label>
        <label>Sheet Number<input name="sheet_number" value="${escapeHtml(filters.sheet_number||'')}" placeholder="Sheet number"></label><button>Apply Filters</button><button type="button" class="secondary" data-cs-clear>Clear</button>
      </form>
      <div class="table-scroll collection-sheet-list-table"><table><thead><tr>${['Sheet No','Collection Date','Collector','Gross Collection','Expenses','Expected Deposit','Actual Deposit','Difference','Status','Actions'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${collectionSheetState.rows.map(sheet=>{const t=csTotals(sheet);return `<tr><td>${escapeHtml(csValue(sheet,['sheet_number','collection_sheet_number'],'Draft'))}</td><td>${escapeHtml(formatDateOnlyDisplay(csValue(sheet,['collection_date'])))}</td><td>${escapeHtml(collectionCollectorName(sheet))}</td><td>${formatCurrency(t.gross)}</td><td>${formatCurrency(t.expenses)}</td><td>${formatCurrency(t.expected)}</td><td>${formatCurrency(t.actual)}</td><td class="${Math.abs(t.difference)>.005?'collection-sheet-difference':''}">${formatCurrency(t.difference)}</td><td>${csStatusBadge(csStatus(sheet))}</td><td>${csActionButtons(sheet)}</td></tr>`;}).join('')||'<tr><td colspan="10">No collection sheets found.</td></tr>'}</tbody></table></div>`;
    root.querySelector('#collection-sheet-filters').onsubmit=e=>{e.preventDefault();collectionSheetState.filters=Object.fromEntries(new FormData(e.currentTarget));loadCollectionSheets();};
    root.querySelector('[data-cs-clear]').onclick=()=>{collectionSheetState.filters={};loadCollectionSheets();};
  }catch(error){ root.innerHTML=`<div class="alert error">${escapeHtml(csError(error,'Failed to load collection sheets.'))}</div>`; }
}
async function csGetSheet(id){ return api(`/admin/collection-sheets/${encodeURIComponent(id)}`); }
async function csRefreshModal(modal,id){ const fresh=await csGetSheet(id); collectionSheetState.active=fresh; csRenderSheetModal(modal,fresh); return fresh; }
function csSummary(sheet){ const t=csTotals(sheet); return `<div class="collection-sheet-summary">${[['Gross Collection',t.gross],['Total Expenses',t.expenses],['Expected Deposit',t.expected],['Actual Deposit',t.actual],['Difference',t.difference]].map(([label,value],index)=>`<div class="metric ${index===4&&Math.abs(value)>.005?'difference-warning':''}"><div class="metric-label">${label}</div><div class="metric-value">${formatCurrency(value)}</div></div>`).join('')}</div>`; }
function csRenderSheetModal(modal,sheet={status:'DRAFT'}){
  const status=csStatus(sheet), id=csId(sheet), editable=status==='DRAFT', posted=['POSTED','RECONCILED'].includes(status), items=csRows(sheet,['items','collection_items','collections']), expenses=csRows(sheet,['expenses','expense_items']);
  let currentSheetId=id;
  const expenseAccounts=collectionState.accounts.filter(account=>String(csValue(account,['account_type','type'])).toUpperCase()==='EXPENSE'&&(csValue(account,['posting_allowed','is_posting_allowed'],true)!==false));
  const bankAccounts=collectionState.accounts.filter(collectionIsBank);
  modal.innerHTML=`<div class="modal-card collection-sheet-card" role="dialog" aria-modal="true" aria-labelledby="collection-sheet-title"><div class="modal-header"><div><div class="eyebrow">Collections</div><h2 id="collection-sheet-title">${id?'Collection Sheet':'Create Collection Sheet'}</h2></div><button class="icon-button" data-cs-close aria-label="Close">×</button></div><div id="collection-sheet-message"></div>
    <section class="subcard"><div class="collection-sheet-heading"><h3>Sheet Details</h3>${csStatusBadge(status)}</div><div class="accounting-grid"><label>Collection Sheet No<input readonly value="${escapeHtml(csValue(sheet,['sheet_number','collection_sheet_number'],'Auto generated after save'))}"></label><label>Collection Date<input id="cs-date" type="date" ${editable?'':'disabled'} value="${escapeHtml(csValue(sheet,['collection_date'],todayDateOnly()))}"></label><label>Collector<select id="cs-collector" ${editable?'':'disabled'}>${csSheetOptions(collectionState.collectors,csValue(sheet,['collector_id']),'collector')}</select></label><label>Notes<textarea id="cs-notes" ${editable?'':'disabled'}>${escapeHtml(csValue(sheet,['notes'],''))}</textarea></label></div></section>
    <section class="subcard"><div class="collection-sheet-heading"><h3>Customer Collections</h3></div>${editable?`<div class="collection-sheet-search"><label>Search by Customer / NIC / Mobile / Loan No.<input id="cs-loan-search" autocomplete="off" placeholder="Start typing to search"></label><div id="cs-loan-results"></div><div id="cs-selected-loan"><input id="cs-selected-loan-id" type="hidden"><input id="cs-selected-customer-id" type="hidden"><div id="cs-selected-loan-summary" class="collection-sheet-selection"><strong>Selected:</strong><span>No customer/loan selected.</span></div><label>Amount Collected<input id="cs-item-amount" type="number" min="0.01" step="0.01" inputmode="decimal"></label><button data-cs-add-item>Add Collection</button></div></div>`:''}<div class="table-scroll"><table><thead><tr><th>#</th><th>Customer</th><th>Loan Number</th><th>Amount Collected</th><th>Action</th></tr></thead><tbody>${items.map((item,index)=>`<tr><td>${index+1}</td><td>${escapeHtml(csValue(item,['customer_name','customer'],'—'))}</td><td>${escapeHtml(csValue(item,['loan_number','loan_no'],'—'))}</td><td>${formatCurrency(csValue(item,['amount_collected','amount'],0))}</td><td>${editable?`<button class="danger" data-cs-delete-item="${escapeHtml(csValue(item,['id','item_id']))}">Remove</button>`:'—'}</td></tr>`).join('')||'<tr><td colspan="5">No customer collections added.</td></tr>'}</tbody></table></div></section>
    <section class="subcard"><div class="collection-sheet-heading"><h3>Expenses Deducted From Collection</h3>${editable?'<button data-cs-toggle-expense>+ Add Expense</button>':''}</div>${editable?`<div id="cs-expense-form" class="accounting-grid hidden"><label>Expense Account<select id="cs-expense-account">${csSheetOptions(expenseAccounts,'','account')}</select></label><label>Amount<input id="cs-expense-amount" type="number" min="0.01" step="0.01"></label><label>Description<input id="cs-expense-description"></label><label>Reference<input id="cs-expense-reference"></label><button data-cs-save-expense>Add Expense</button></div>`:''}<div class="table-scroll"><table><thead><tr><th>Expense</th><th>GL Account</th><th>Amount</th><th>Reference</th><th>Action</th></tr></thead><tbody>${expenses.map(expense=>`<tr><td>${escapeHtml(csValue(expense,['description','expense_name'],'—'))}</td><td>${escapeHtml(csValue(expense,['expense_account_name','gl_account_name','account_name'],'—'))}</td><td>${formatCurrency(csValue(expense,['amount'],0))}</td><td>${escapeHtml(csValue(expense,['reference'],'—'))}</td><td>${editable?`<button class="danger" data-cs-delete-expense="${escapeHtml(csValue(expense,['id','expense_id']))}">Remove</button>`:'—'}</td></tr>`).join('')||'<tr><td colspan="5">No expenses added.</td></tr>'}</tbody></table></div></section>
    <section class="subcard"><h3>Deposit</h3><div class="accounting-grid"><label>Bank Account<select id="cs-bank" ${editable?'':'disabled'}>${csSheetOptions(bankAccounts,csValue(sheet,['bank_account_id']),'account')}</select></label><label>Deposit Date<input id="cs-deposit-date" type="date" ${editable?'':'disabled'} value="${escapeHtml(csValue(sheet,['deposit_date'],csValue(sheet,['collection_date'],todayDateOnly())))}"></label><label>Actual Deposit<input id="cs-actual-deposit" type="number" min="0" step="0.01" ${editable?'':'disabled'} value="${escapeHtml(csValue(sheet,['actual_deposit','deposit_amount'],0))}"></label><label>Deposit Reference<input id="cs-deposit-reference" ${editable?'':'disabled'} value="${escapeHtml(csValue(sheet,['deposit_reference'],''))}"></label></div><p class="muted">Preview values may change while editing. Saved totals below are authoritative values returned by the backend.</p></section>
    ${csSummary(sheet)}
    <div class="modal-actions sticky-modal-footer collection-sheet-controls">${editable?`<button class="secondary" data-cs-save>Save Draft</button>${id?'<button data-cs-submit-current>Submit Collection Sheet</button>':''}`:''}${status==='SUBMITTED'?'<button data-cs-review>Review &amp; Approve</button>':''}<button class="secondary" data-cs-print-current>Print Collection Sheet</button>${posted?'<button class="secondary" data-cs-view-journals>View Journals</button><button class="secondary" data-cs-view-payments>View Payments</button>':''}${posted&&csCanReverse()?'<button class="danger" data-cs-reverse-current>Reverse Collection Sheet</button>':''}<button class="secondary" data-cs-close>Close</button></div>
    ${csPrintReport(sheet)}</div>`;
  modal.querySelectorAll('[data-cs-close]').forEach(button=>button.onclick=()=>csClose(modal));
  modal.querySelector('[data-cs-print-current]').onclick=()=>window.print();
  modal.querySelector('[data-cs-view-journals]')?.addEventListener('click',()=>{csClose(modal);showAdminSection('accounting-journals');});
  modal.querySelector('[data-cs-view-payments]')?.addEventListener('click',()=>{csClose(modal);showAdminSection('payments');});
  if(!editable){ modal.querySelector('[data-cs-review]')?.addEventListener('click',()=>openCollectionSheetPreview(sheet,modal)); modal.querySelector('[data-cs-reverse-current]')?.addEventListener('click',()=>reverseCollectionSheet(sheet,modal)); return; }
  const message=modal.querySelector('#collection-sheet-message');
  const payload=()=>({collection_date:modal.querySelector('#cs-date').value,collector_id:modal.querySelector('#cs-collector').value,notes:modal.querySelector('#cs-notes').value,bank_account_id:modal.querySelector('#cs-bank').value||null,deposit_date:modal.querySelector('#cs-deposit-date').value||null,actual_deposit:Number(modal.querySelector('#cs-actual-deposit').value||0),deposit_reference:modal.querySelector('#cs-deposit-reference').value});
  const save=async()=>{ const button=modal.querySelector('[data-cs-save]'); button.disabled=true;message.innerHTML='Saving draft…';try{const result=await api(currentSheetId?`/admin/collection-sheets/${encodeURIComponent(currentSheetId)}`:'/admin/collection-sheets',{method:currentSheetId?'PATCH':'POST',body:payload()});const newId=csId(result)||currentSheetId;if(!newId)throw new Error('The backend did not return a collection sheet ID.');currentSheetId=newId;await csRefreshModal(modal,newId);modal.querySelector('#collection-sheet-message').innerHTML='<div class="alert success">Draft saved. No customer payments have been posted.</div>';await loadCollectionSheets();return newId;}catch(error){message.innerHTML=`<div class="alert error">${escapeHtml(csError(error,'Failed to save draft.'))}</div>`;}finally{button.disabled=false;}};
  modal.querySelector('[data-cs-save]').onclick=save;
  modal.querySelector('[data-cs-submit-current]')?.addEventListener('click',()=>submitCollectionSheet(id,modal));
  modal.querySelector('[data-cs-toggle-expense]')?.addEventListener('click',()=>modal.querySelector('#cs-expense-form').classList.toggle('hidden'));
  modal.querySelectorAll('[data-cs-delete-item]').forEach(button=>button.onclick=async()=>{if(!confirm('Remove this draft collection?'))return;try{await api(`/admin/collection-sheets/${encodeURIComponent(id)}/items/${encodeURIComponent(button.dataset.csDeleteItem)}`,{method:'DELETE'});await csRefreshModal(modal,id);}catch(error){message.innerHTML=`<div class="alert error">${escapeHtml(csError(error))}</div>`;}});
  modal.querySelectorAll('[data-cs-delete-expense]').forEach(button=>button.onclick=async()=>{if(!confirm('Remove this draft expense?'))return;try{await api(`/admin/collection-sheets/${encodeURIComponent(id)}/expenses/${encodeURIComponent(button.dataset.csDeleteExpense)}`,{method:'DELETE'});await csRefreshModal(modal,id);}catch(error){message.innerHTML=`<div class="alert error">${escapeHtml(csError(error))}</div>`;}});
  modal.querySelector('[data-cs-save-expense]')?.addEventListener('click',async()=>{if(!id){message.innerHTML='<div class="alert warning">Save the draft before adding expenses.</div>';return;}const body={expense_account_id:modal.querySelector('#cs-expense-account').value,amount:Number(modal.querySelector('#cs-expense-amount').value),description:modal.querySelector('#cs-expense-description').value,reference:modal.querySelector('#cs-expense-reference').value};try{await api(`/admin/collection-sheets/${encodeURIComponent(id)}/expenses`,{method:'POST',body});await csRefreshModal(modal,id);}catch(error){message.innerHTML=`<div class="alert error">${escapeHtml(csError(error))}</div>`;}});
  const search=modal.querySelector('#cs-loan-search');
  search?.addEventListener('input',()=>{clearTimeout(collectionSheetState.searchTimer);const q=search.value.trim(),results=modal.querySelector('#cs-loan-results');if(q.length<2){results.innerHTML='';return;}collectionSheetState.searchTimer=setTimeout(async()=>{results.innerHTML='<p>Searching…</p>';try{const loans=collectionItems(await api(`/admin/collection-sheets/loan-search?q=${encodeURIComponent(q)}`));results.innerHTML=`<div class="table-scroll"><table><thead><tr><th>Customer</th><th>NIC</th><th>Loan Number</th><th>Loan Status</th><th>Outstanding</th><th></th></tr></thead><tbody>${loans.map((loan,index)=>`<tr><td>${escapeHtml(csValue(loan,['customer_name','customer'],'—'))}</td><td>${escapeHtml(csValue(loan,['nic','customer_nic'],'—'))}</td><td>${escapeHtml(csValue(loan,['loan_number','number'],'—'))}</td><td>${escapeHtml(csValue(loan,['loan_status','status'],'—'))}</td><td>${formatCurrency(csValue(loan,['outstanding','outstanding_balance'],0))}</td><td><button data-cs-select-loan="${index}">Select</button></td></tr>`).join('')||'<tr><td colspan="6">No matching loans.</td></tr>'}</tbody></table></div>`;results.querySelectorAll('[data-cs-select-loan]').forEach(button=>button.onclick=()=>{const loan=loans[Number(button.dataset.csSelectLoan)]||{};const loanId=csValue(loan,['loan_id','id']);const customerId=csValue(loan,['customer_id','customerId'])||csValue(loan.customer,['id']);const customerName=csValue(loan,['customer_name','customer'],'—');const loanNumber=csValue(loan,['loan_number','number'],'—');modal.querySelector('#cs-selected-loan-id').value=loanId;modal.querySelector('#cs-selected-customer-id').value=customerId;modal.querySelector('#cs-selected-loan-summary').innerHTML=`<strong>Selected:</strong><span>${escapeHtml(customerName)}<br>${escapeHtml(loanNumber)}</span>`;message.innerHTML='';modal.querySelector('#cs-item-amount').focus();});}catch(error){results.innerHTML=`<div class="alert error">${escapeHtml(csError(error,'Loan search failed.'))}</div>`;}},300);});
  modal.querySelector('[data-cs-add-item]')?.addEventListener('click',async()=>{
    const button=modal.querySelector('[data-cs-add-item]');
    if(button.disabled)return;
    const selectedLoanId=modal.querySelector('#cs-selected-loan-id').value;
    const selectedCustomerId=modal.querySelector('#cs-selected-customer-id').value;
    const amountText=modal.querySelector('#cs-item-amount').value.trim();
    const amount=Number(amountText);
    if(!selectedLoanId||!selectedCustomerId){message.innerHTML='<div class="alert warning">Please select a customer/loan first.</div>';return;}
    if(!amountText||!Number.isFinite(amount)||amount<=0){message.innerHTML='<div class="alert warning">Enter a valid collection amount.</div>';return;}
    let draftWasCreated=false, savedSheetNumber='';
    button.disabled=true;
    try{
      if(!currentSheetId){
        if(!modal.querySelector('#cs-date').value||!modal.querySelector('#cs-collector').value){message.innerHTML='<div class="alert warning">Please select Collection Date and Collector before adding collections.</div>';return;}
        button.textContent='Creating Draft…';
        message.innerHTML='<div class="alert info">Creating draft…</div>';
        const draft=await api('/admin/collection-sheets',{method:'POST',body:payload()});
        currentSheetId=csId(draft);
        if(!currentSheetId)throw new Error('The backend did not return a collection sheet ID.');
        draftWasCreated=true;
        savedSheetNumber=csValue(draft,['sheet_number','collection_sheet_number'],String(currentSheetId));
        collectionSheetState.active={...sheet,...draft,id:currentSheetId,status:csStatus(draft)};
        const numberInput=modal.querySelector('#cs-date').closest('.accounting-grid').querySelector('input[readonly]');
        if(numberInput)numberInput.value=savedSheetNumber;
        message.innerHTML='<div class="alert success">Draft saved automatically. Adding collection…</div>';
      }
      button.textContent='Adding Collection…';
      await api(`/admin/collection-sheets/${encodeURIComponent(currentSheetId)}/items`,{method:'POST',body:{loan_id:selectedLoanId,amount:amount.toFixed(2)}});
      await csRefreshModal(modal,currentSheetId);
      modal.querySelector('#collection-sheet-message').innerHTML='<div class="alert success">Collection added to the draft. No customer payment has been posted.</div>';
      await loadCollectionSheets();
    }catch(error){
      const target=modal.querySelector('#collection-sheet-message')||message;
      const detail=escapeHtml(csError(error,draftWasCreated?'The collection could not be added.':'Failed to save draft.'));
      target.innerHTML=draftWasCreated?`<div class="alert error">Draft ${escapeHtml(savedSheetNumber)} was saved, but the collection could not be added. Please retry.<br>${detail}</div>`:`<div class="alert error">${detail}</div>`;
    }finally{
      if(button.isConnected){button.disabled=false;button.textContent='Add Collection';}
    }
  });
}
async function openCollectionSheet(id=null){
  const modal=document.createElement('div');modal.className='modal-overlay collection-sheet-overlay';modal.innerHTML='<div class="modal-card collection-sheet-card"><p>Loading collection sheet…</p></div>';document.body.appendChild(modal);csLockBody();
  try{await collectionBootstrapData();const sheet=id?await csGetSheet(id):{status:'DRAFT',collection_date:todayDateOnly(),deposit_date:todayDateOnly()};collectionSheetState.active=sheet;csRenderSheetModal(modal,sheet);}catch(error){modal.innerHTML=`<div class="modal-card"><div class="alert error">${escapeHtml(csError(error,'Failed to load collection sheet.'))}</div><button data-cs-close>Close</button></div>`;modal.querySelector('[data-cs-close]').onclick=()=>csClose(modal);}
}
async function submitCollectionSheet(id,modal=null){
  if(!confirm('Once submitted, this sheet will be ready for approval.'))return;
  try{await api(`/admin/collection-sheets/${encodeURIComponent(id)}/submit`,{method:'POST'});if(modal)await csRefreshModal(modal,id);await loadCollectionSheets();}catch(error){const target=modal?.querySelector('#collection-sheet-message');if(target)target.innerHTML=`<div class="alert error">${escapeHtml(csError(error,'Collection sheet was not submitted.'))}</div>`;else alert(csError(error));}
}
function csPreviewAccounting(preview){ const expenseRows=csRows(preview,['expenses','expense_items']);return `<div class="collection-sheet-preview-grid"><div><h3>Customer Payments</h3><p>Count: <strong>${escapeHtml(csValue(preview,['customer_payment_count','payments_count'],csRows(preview,['customer_payments','payments']).length))}</strong></p><p>Gross amount: <strong>${formatCurrency(csValue(preview,['gross_collection','gross_amount'],0))}</strong></p></div><div><h3>Expenses</h3>${expenseRows.map(row=>`<p>${escapeHtml(csValue(row,['description','expense_name'],'Expense'))}: <strong>${formatCurrency(csValue(row,['amount'],0))}</strong></p>`).join('')||'<p>None</p>'}<p>Total: <strong>${formatCurrency(csValue(preview,['total_expenses','expenses_total'],0))}</strong></p></div><div><h3>Bank Deposit</h3><p>${escapeHtml(csValue(preview,['bank_account_name','bank_name'],'—'))}</p><strong>${formatCurrency(csValue(preview,['actual_deposit','bank_deposit_amount'],0))}</strong></div></div><div class="subcard"><h3>Accounting Preview</h3><p><b>Customer payments</b><br>Dr Collector Clearing<br>Cr Contractual Interest / Principal / Customer Credit as calculated</p><p><b>Expenses</b><br>Dr Expense<br>Cr Collector Clearing</p><p><b>Deposit</b><br>Dr Bank<br>Cr Collector Clearing</p></div>${csSummary(preview)}`; }
async function openCollectionSheetPreview(sheet,parentModal=null){
  const id=csId(sheet),modal=document.createElement('div');modal.className='modal-overlay collection-sheet-overlay collection-sheet-approval-overlay';modal.innerHTML='<div class="modal-card wide"><p>Loading posting preview…</p></div>';document.body.appendChild(modal);csLockBody();
  try{const preview=await api(`/admin/collection-sheets/${encodeURIComponent(id)}/posting-preview`);modal.innerHTML=`<div class="modal-card wide collection-sheet-preview-card"><div class="modal-header"><h2>Posting Preview</h2><button class="icon-button" data-cs-close>×</button></div><div id="cs-posting-message"></div>${csPreviewAccounting(preview)}<div class="modal-actions sticky-modal-footer"><button class="secondary" data-cs-close>Cancel</button><button data-cs-approve>Approve &amp; Post Collection Sheet</button></div></div>`;modal.querySelectorAll('[data-cs-close]').forEach(button=>button.onclick=()=>csClose(modal));modal.querySelector('[data-cs-approve]').onclick=()=>approvePostCollectionSheet(id,modal,parentModal);
  }catch(error){modal.innerHTML=`<div class="modal-card"><div class="alert error">${escapeHtml(csError(error,'Posting preview failed.'))}</div><button data-cs-close>Close</button></div>`;modal.querySelector('[data-cs-close]').onclick=()=>csClose(modal);}
}
async function approvePostCollectionSheet(id,modal,parentModal){
  if(collectionSheetState.posting||!confirm('Approve and post this collection sheet? This will create all customer payments, expenses, and the bank deposit.'))return;
  collectionSheetState.posting=true;const button=modal.querySelector('[data-cs-approve]'),message=modal.querySelector('#cs-posting-message');button.disabled=true;button.textContent='Posting…';message.innerHTML='<div class="alert warning">Posting all collection sheet entries. Please wait…</div>';
  try{const result=await api(`/admin/collection-sheets/${encodeURIComponent(id)}/approve-post`,{method:'POST'});message.innerHTML=`<div class="alert success"><h3>Collection Sheet Posted Successfully</h3><p>Customer Payments Posted: ${escapeHtml(csValue(result,['customer_payments_posted','payments_posted'],0))}</p><p>Gross Collection: ${formatCurrency(csValue(result,['gross_collection','gross_amount'],0))}</p><p>Expenses Posted: ${formatCurrency(csValue(result,['expenses_posted','total_expenses'],0))}</p><p>Bank Deposit Posted: ${formatCurrency(csValue(result,['bank_deposit_posted','actual_deposit'],0))}</p><p>Difference: ${formatCurrency(csValue(result,['difference'],0))}</p><p>Status: ${escapeHtml(csValue(result,['status'],'POSTED'))}</p>${csRows(result,['journal_references','journals','payment_references']).map(ref=>`<p>${escapeHtml(typeof ref==='string'?ref:csValue(ref,['journal_number','payment_number','reference','id']))}</p>`).join('')}</div>`;button.remove();if(parentModal)await csRefreshModal(parentModal,id);await loadCollectionSheets();
  }catch(error){const failures=csRows(error?.data||error?.body||{},['failures','errors','line_errors']);message.innerHTML=`<div class="alert error"><h3>Collection sheet was not posted.</h3>${failures.length?`<table><thead><tr><th>Customer / Loan</th><th>Reason</th></tr></thead><tbody>${failures.map(f=>`<tr><td>${escapeHtml(csValue(f,['loan_number','customer_name','loan'],'—'))}</td><td>${escapeHtml(csValue(f,['reason','message','detail'],csError(error)))}</td></tr>`).join('')}</tbody></table>`:`<p>${escapeHtml(csError(error))}</p>`}</div>`;button.disabled=false;button.textContent='Approve & Post Collection Sheet';
  }finally{collectionSheetState.posting=false;}
}
async function reverseCollectionSheet(sheet,parentModal=null){
  const reason=prompt('Reversal reason (required)');if(!reason?.trim())return;if(!confirm('Strong confirmation: reversing this posted collection sheet will reverse its payments, expenses, and bank journal. The sheet will remain in the audit trail. Continue?'))return;
  try{await api(`/admin/collection-sheets/${encodeURIComponent(csId(sheet))}/reverse`,{method:'POST',body:{reason:reason.trim()}});alert('Collection Sheet Reversed. Status: REVERSED');if(parentModal)await csRefreshModal(parentModal,csId(sheet));await loadCollectionSheets();}catch(error){alert(csError(error,'Collection sheet reversal failed.'));}
}
async function printCollectionSheet(id){ try{await openCollectionSheet(id);setTimeout(()=>window.print(),100);}catch(error){alert(csError(error));} }
const collectionSheetsShowAdminSection=showAdminSection;
showAdminSection=function(section='dashboard'){
  collectionSheetsShowAdminSection(section);
  if(section==='collection-sheets')loadCollectionSheets();
};
document.addEventListener('click',event=>{
  if(event.target.closest('[data-cs-create]'))openCollectionSheet();
  const open=event.target.closest('[data-cs-open]')?.dataset.csOpen;if(open)openCollectionSheet(open);
  const submit=event.target.closest('[data-cs-submit]')?.dataset.csSubmit;if(submit)submitCollectionSheet(submit);
  const preview=event.target.closest('[data-cs-preview]')?.dataset.csPreview;if(preview){const sheet=collectionSheetState.rows.find(row=>String(csId(row))===String(preview));if(sheet)openCollectionSheetPreview(sheet);}
  const print=event.target.closest('[data-cs-print]')?.dataset.csPrint;if(print)printCollectionSheet(print);
  const reverse=event.target.closest('[data-cs-reverse]')?.dataset.csReverse;if(reverse){const sheet=collectionSheetState.rows.find(row=>String(csId(row))===String(reverse));if(sheet)reverseCollectionSheet(sheet);}
});

function accountFieldValue(account,...keys){ for(const k of keys){ const v=account?.[k]; if(v!==undefined&&v!==null&&v!=='') return v; } return ''; }
function accountSubtypeValue(account){ return String(accountFieldValue(account,'account_subtype','subtype','accountSubType')).trim().toUpperCase(); }
function accountRoleValue(account){ return String(accountFieldValue(account,'account_role','accountRole')).trim().toUpperCase(); }
function accountIsCollectionPosting(account){ return (account.is_collection_account===true||account.is_collection_account===1) && accountSubtypeValue(account)==='COLLECTION_CLEARING'; }
function accountIsCollectionControl(account){ return accountSubtypeValue(account)==='COLLECTION_CLEARING_CONTROL'||accountRoleValue(account)==='COLLECTOR_CLEARING_CONTROL'; }
function accountBoolean(account,primary,fallback,defaultValue=true){ const v=account?.[primary]??account?.[fallback]; if(v===undefined||v===null||v==='') return defaultValue; return v===true||v===1||String(v).toLowerCase()==='true'; }
function accountApiError(e,fallback='Failed to save account.'){ return e?.message||e?.error||e?.detail||fallback; }
function resetAccountEditorState(){ document.querySelectorAll('.account-editor-modal').forEach(m=>m.remove()); const msg=document.querySelector('#account-editor-message'); if(msg)msg.innerHTML=''; window.currentEditingAccountId=null; }
function accountOptions(selectedId,excludeId){ return (accountingState.accounts||[]).filter(a=>String(a.id)!==String(excludeId||'')).map(a=>`<option value="${escapeHtml(a.id)}" ${String(a.id)===String(selectedId||'')?'selected':''}>${escapeHtml(getAccountLabel(a))}</option>`).join(''); }
async function refreshAccountsAfterSave(modal){ modal.remove(); await accountingLoadAccounts(); const msg=document.querySelector('#account-editor-message'); if(msg)msg.innerHTML='<div class="alert success">Account updated successfully.</div>'; }

const accountCreateTypeOptions=['ASSET','LIABILITY','EQUITY','INCOME','EXPENSE'];
const accountCreateSubtypes={ASSET:['CASH','BANK','LOAN_RECEIVABLE','INTEREST_RECEIVABLE','PENALTY_RECEIVABLE','ACCOUNTS_RECEIVABLE','COLLECTION_CLEARING','COLLECTION_CLEARING_CONTROL','SUSPENSE','FIXED_ASSET','OTHER_ASSET'],LIABILITY:['ACCOUNTS_PAYABLE','BORROWING','INSURANCE_PAYABLE','STAMP_DUTY_PAYABLE','VAT_PAYABLE','STATUTORY_PAYABLE','UNAPPLIED_CUSTOMER_FUNDS','BANK_OVERDRAFT','OTHER_LIABILITY'],EQUITY:['CAPITAL','RETAINED_EARNINGS','CURRENT_EARNINGS','OTHER_EQUITY'],INCOME:['INTEREST_INCOME','PENALTY_INCOME','FEE_INCOME','PROCESSING_FEE_INCOME','DOCUMENTATION_FEE_INCOME','INVESTIGATION_FEE_INCOME','OTHER_INCOME'],EXPENSE:['OPERATING_EXPENSE','SALARY_EXPENSE','RENT_EXPENSE','UTILITIES_EXPENSE','TRANSPORT_EXPENSE','OFFICE_EXPENSE','WRITE_OFF_EXPENSE','FINANCE_COST','OTHER_EXPENSE']};
const accountCreateNormalBalance={ASSET:'DEBIT',EXPENSE:'DEBIT',LIABILITY:'CREDIT',EQUITY:'CREDIT',INCOME:'CREDIT'};
function accountCreateLabel(value){ return String(value||'').toLowerCase().replace(/(^|_)\w/g,m=>m.replace('_',' ').toUpperCase()).trim(); }
function accountCreateSubtypeOptions(type){ const supplied=accountingState.settings?.account_subtypes||accountingState.settings?.accountSubtypes||accountingState.account_subtypes||accountingState.accountSubtypes; const fromBackend=Array.isArray(supplied?.[type])?supplied[type]:Array.isArray(supplied)?supplied.filter(x=>String(x.account_type||x.type||'').toUpperCase()===type).map(x=>x.value||x.code||x.account_subtype||x.subtype):null; return (fromBackend&&fromBackend.length?fromBackend:accountCreateSubtypes[type]||[]).map(String); }
async function openCreateGeneralAccount(){
  resetAccountEditorState();
  if(!(accountingState.accounts||[]).length) accountingState.accounts=accountItems(await api('/admin/accounting/accounts?active=true'));
  if(!(collectionState.collectors||[]).length) api('/admin/collectors').then(r=>{collectionState.collectors=collectionItems(r);}).catch(()=>{});
  const modal=document.createElement('div'); modal.className='modal-overlay historical-accounting-modal account-editor-modal';
  modal.innerHTML=`<div class="modal-card wide"><div class="modal-header"><h2 id="create-account-title">Create Account</h2><button class="icon-button" data-close>×</button></div><div id="create-account-message"></div><div class="accounting-grid"><label>Account code<input id="ca-new-code" autocomplete="off"></label><label>Account name<input id="ca-new-name" autocomplete="off"></label><label>Account type<select id="ca-new-type"><option value="">Select account type</option>${accountCreateTypeOptions.map(t=>`<option value="${t}">${accountCreateLabel(t)}</option>`).join('')}</select></label><label>Account subtype<select id="ca-new-subtype"><option value="">Select account subtype</option></select></label><label>Normal balance<select id="ca-new-normal"><option value="">Select normal balance</option><option value="DEBIT">Debit</option><option value="CREDIT">Credit</option></select></label><label>Account role<input id="ca-new-role" list="ca-new-role-options" placeholder="Optional"><datalist id="ca-new-role-options"><option value="MAIN_BANK_ACCOUNT"><option value="DOCUMENTATION_FEE_INCOME"><option value="LOAN_PRINCIPAL_RECEIVABLE"><option value="INTEREST_RECEIVABLE"></datalist></label><label id="ca-new-parent-label">Parent account, optional<select id="ca-new-parent"><option value="">No parent account</option>${accountOptions('',null)}</select></label><label>Posting allowed<select id="ca-new-posting"><option value="true">Yes</option><option value="false">No</option></select></label><label>Active status<select id="ca-new-active"><option value="true">Active</option><option value="false">Inactive</option></select></label><label id="ca-new-collector-label" style="display:none">Collector<select id="ca-new-collector"><option value="">Select collector</option>${(collectionState.collectors||[]).map(c=>`<option value="${escapeHtml(c.id)}">${escapeHtml(collectionCollectorName(c))}</option>`).join('')}</select></label></div><div class="modal-actions"><button class="secondary" data-close>Cancel</button><button id="save-create-account">Save Account</button></div></div>`;
  document.body.appendChild(modal); modal.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal.remove());
  const typeEl=modal.querySelector('#ca-new-type'), subtypeEl=modal.querySelector('#ca-new-subtype'), normalEl=modal.querySelector('#ca-new-normal'), titleEl=modal.querySelector('#create-account-title'), collectorLabel=modal.querySelector('#ca-new-collector-label'), postingEl=modal.querySelector('#ca-new-posting');
  const updateSubtypes=()=>{ const type=typeEl.value; subtypeEl.innerHTML='<option value="">Select account subtype</option>'+accountCreateSubtypeOptions(type).map(st=>`<option value="${escapeHtml(st)}">${escapeHtml(accountCreateLabel(st))}</option>`).join(''); normalEl.value=accountCreateNormalBalance[type]||''; updateConditionalFields(); };
  const updateConditionalFields=()=>{ const st=subtypeEl.value; titleEl.textContent=st==='COLLECTION_CLEARING'?'Create Collection Clearing Account':(st==='COLLECTION_CLEARING_CONTROL'?'Create Collection Clearing Control Account':'Create Account'); collectorLabel.style.display=st==='COLLECTION_CLEARING'?'':'none'; if(st==='COLLECTION_CLEARING_CONTROL') postingEl.value='false'; };
  typeEl.onchange=updateSubtypes; subtypeEl.onchange=updateConditionalFields;
  modal.querySelector('#save-create-account').onclick=async()=>{ const msg=modal.querySelector('#create-account-message'); msg.innerHTML=''; const subtype=subtypeEl.value; const code=modal.querySelector('#ca-new-code').value.trim(); const name=modal.querySelector('#ca-new-name').value.trim(); const errors=[]; if(!code)errors.push('Account code is required.'); if(!name)errors.push('Account name is required.'); if(!typeEl.value)errors.push('Account type is required.'); if(!subtype)errors.push('Account subtype is required.'); if(!normalEl.value)errors.push('Normal balance is required.'); if((accountingState.accounts||[]).some(a=>String(a.code||a.account_code).trim().toUpperCase()===code.toUpperCase()))errors.push('Account code already exists.'); if(subtype==='COLLECTION_CLEARING'&&!modal.querySelector('#ca-new-collector').value)errors.push('Collector is required for a collection clearing account.'); if(errors.length){ msg.innerHTML=`<div class="alert error">${errors.map(escapeHtml).join('<br>')}</div>`; return; } const body={account_code:code,account_name:name,account_type:typeEl.value,account_subtype:subtype,normal_balance:normalEl.value,account_role:modal.querySelector('#ca-new-role').value.trim()||null,parent_account_id:modal.querySelector('#ca-new-parent').value||null,posting_allowed:postingEl.value==='true',is_active:modal.querySelector('#ca-new-active').value==='true'}; if(subtype==='COLLECTION_CLEARING'){ body.collector_id=modal.querySelector('#ca-new-collector').value; body.is_collection_account=true; } try{ await api('/admin/accounting/accounts',{method:'POST',body}); modal.remove(); await accountingLoadAccounts(); const pageMsg=document.querySelector('#account-editor-message'); if(pageMsg)pageMsg.innerHTML=`<div class="alert success">${subtype==='COLLECTION_CLEARING'?'Collection account created successfully.':'Account created successfully.'}</div>`; }catch(e){ msg.innerHTML=`<div class="alert error">${escapeHtml(accountApiError(e,'Failed to create account.'))}</div>`; } };
}

function openGeneralAccountEditor(account){ if(!account){ const msg=document.querySelector('#account-editor-message'); if(msg)msg.innerHTML='<div class="alert error">The selected account could not be loaded.</div>'; return; } resetAccountEditorState(); const accountId=Number(account.id??account.account_id); const accountLabel=getAccountLabel(account); window.currentEditingAccountId=accountId; const readonly=account.system_account||account.is_system; const modal=document.createElement('div'); modal.className='modal-overlay historical-accounting-modal account-editor-modal'; modal.innerHTML=`<div class="modal-card wide"><div class="modal-header"><h2>Edit Account — ${escapeHtml(accountLabel)}</h2><button class="icon-button" data-close>×</button></div><div id="general-account-message"></div><div class="accounting-grid"><label>Account code<input id="ga-code" value="${escapeHtml(accountFieldValue(account,'account_code','code'))}"></label><label>Account name<input id="ga-name" value="${escapeHtml(accountFieldValue(account,'account_name','name'))}"></label><label>Account type<input id="ga-type" value="${escapeHtml(accountFieldValue(account,'account_type','type'))}" ${readonly?'readonly':''}></label><label>Account subtype<input id="ga-subtype" value="${escapeHtml(accountFieldValue(account,'account_subtype','subtype'))}"></label><label>Normal balance<input id="ga-normal" value="${escapeHtml(accountFieldValue(account,'normal_balance','normalBalance'))}" ${readonly?'readonly':''}></label><label>Account role<input id="ga-role" value="${escapeHtml(accountFieldValue(account,'account_role','accountRole'))}"></label><label>Parent account<select id="ga-parent"><option value="">No parent account</option>${accountOptions(accountFieldValue(account,'parent_account_id','parent_id','parentAccountId'),account.id)}</select></label><label>Posting allowed<select id="ga-posting"><option value="true" ${accountBoolean(account,'posting_allowed','allow_manual_posting')?'selected':''}>Yes</option><option value="false" ${!accountBoolean(account,'posting_allowed','allow_manual_posting')?'selected':''}>No</option></select></label><label>Active status<select id="ga-active"><option value="true" ${accountBoolean(account,'is_active','active')?'selected':''}>Active</option><option value="false" ${!accountBoolean(account,'is_active','active')?'selected':''}>Inactive</option></select></label><label>System account status<input value="${readonly?'System controlled':'No'}" readonly></label></div>${readonly?'<div class="alert warning">System-controlled account: unsafe type and normal-balance changes are read-only.</div>':''}<div class="modal-actions"><button class="secondary" data-close>Cancel</button><button id="save-general-account">Save Account</button></div></div>`; document.body.appendChild(modal); modal.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal.remove()); modal.querySelector('#save-general-account').onclick=async()=>{ const msg=modal.querySelector('#general-account-message'); msg.innerHTML=''; const body={account_code:modal.querySelector('#ga-code').value.trim(),account_name:modal.querySelector('#ga-name').value.trim(),account_type:modal.querySelector('#ga-type').value.trim(),account_subtype:modal.querySelector('#ga-subtype').value.trim(),normal_balance:modal.querySelector('#ga-normal').value.trim(),account_role:modal.querySelector('#ga-role').value.trim(),parent_account_id:modal.querySelector('#ga-parent').value||null,posting_allowed:modal.querySelector('#ga-posting').value==='true',is_active:modal.querySelector('#ga-active').value==='true'}; try{ await api(`/admin/accounting/accounts/${encodeURIComponent(account.id)}`,{method:'PATCH',body}); await refreshAccountsAfterSave(modal); }catch(e){ msg.innerHTML=`<div class="alert error">${escapeHtml(accountApiError(e))}</div>`; } }; }
function openCollectionControlAccountEditor(account){ resetAccountEditorState(); window.currentEditingAccountId=Number(account?.id??account?.account_id); const modal=document.createElement('div'); modal.className='modal-overlay historical-accounting-modal account-editor-modal'; modal.innerHTML=`<div class="modal-card wide"><div class="modal-header"><h2>Edit Collection Clearing Control Account</h2><button class="icon-button" data-close>×</button></div><div id="control-account-message"></div><div class="accounting-grid"><label>Account code<input id="ca-code" value="${escapeHtml(accountFieldValue(account,'account_code','code'))}"></label><label>Account name<input id="ca-name" value="${escapeHtml(accountFieldValue(account,'account_name','name'))}"></label><label>Account type<input id="ca-type" value="${escapeHtml(accountFieldValue(account,'account_type','type'))}" readonly></label><label>Account subtype<input id="ca-subtype" value="${escapeHtml(accountFieldValue(account,'account_subtype','subtype')||'COLLECTION_CLEARING_CONTROL')}"></label><label>Posting allowed<select id="ca-posting"><option value="false" ${!accountBoolean(account,'posting_allowed','allow_manual_posting',false)?'selected':''}>No</option><option value="true" ${accountBoolean(account,'posting_allowed','allow_manual_posting',false)?'selected':''}>Yes</option></select></label><label>Active status<select id="ca-active"><option value="true" ${accountBoolean(account,'is_active','active')?'selected':''}>Active</option><option value="false" ${!accountBoolean(account,'is_active','active')?'selected':''}>Inactive</option></select></label></div><div class="alert warning">Control accounts cannot be linked to an individual collector.</div><div class="modal-actions"><button class="secondary" data-close>Cancel</button><button id="save-control-account">Save Account</button></div></div>`; document.body.appendChild(modal); modal.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal.remove()); modal.querySelector('#save-control-account').onclick=async()=>{ const msg=modal.querySelector('#control-account-message'); msg.innerHTML=''; const body={account_code:modal.querySelector('#ca-code').value.trim(),account_name:modal.querySelector('#ca-name').value.trim(),account_type:modal.querySelector('#ca-type').value.trim(),account_subtype:modal.querySelector('#ca-subtype').value.trim(),posting_allowed:modal.querySelector('#ca-posting').value==='true',is_active:modal.querySelector('#ca-active').value==='true',collector_id:null}; try{ await api(`/admin/accounting/accounts/${encodeURIComponent(account.id)}`,{method:'PATCH',body}); await refreshAccountsAfterSave(modal); }catch(e){ msg.innerHTML=`<div class="alert error">${escapeHtml(accountApiError(e))}</div>`; } }; }
async function openAccountEditor(accountId){ try{ if(!accountId||Number.isNaN(Number(accountId))){ throw new Error('Selected account ID is not numeric. Reload the Chart of Accounts and try again.'); } if(!(accountingState.accounts||[]).length) accountingState.accounts=accountItems(await api('/admin/accounting/accounts')); let account=(accountingState.accounts||[]).find(item=>Number(item.id)===Number(accountId)); if(!account) account=await api(`/admin/accounting/accounts/${encodeURIComponent(accountId)}`); console.log('Opening account editor',{accountId,account}); if(!account?.id){ throw new Error('The selected account was not found.'); } const subtype=String(account.account_subtype??account.subtype??'').trim().toUpperCase(); const isCollectionAccount=account.is_collection_account===true||account.is_collection_account===1; if(subtype==='COLLECTION_CLEARING'&&isCollectionAccount){ if(!(collectionState.collectors||[]).length) await collectionBootstrapData(); openCollectionAccountForm(account); return; } if(subtype==='COLLECTION_CLEARING_CONTROL'){ openCollectionControlAccountEditor(account); return; } openGeneralAccountEditor(account); }catch(error){ console.error('Failed to open account editor',error); const msg=document.querySelector('#account-editor-message'); if(msg)msg.innerHTML=`<div class="alert error">${escapeHtml(error?.message||'The account editor could not be opened.')}</div>`; else alert(error?.message||'The account editor could not be opened.'); } }
function openCollectionAccountForm(existing = {}){
  resetAccountEditorState(); window.currentEditingAccountId=existing?.id?Number(existing.id):null;
  const modal=document.createElement('div'); modal.className='modal-overlay historical-accounting-modal account-editor-modal';
  const collectors=collectionState.collectors||[];
  const parents=(accountingState.accounts||collectionState.accounts||[]).filter(a=>String(acctType(a)).toUpperCase()==='ASSET');
  modal.innerHTML=`<div class="modal-card wide"><div class="modal-header"><h2>${existing.id?'Edit':'Create'} Collection Clearing Account</h2><button class="icon-button" data-close>×</button></div><div id="collection-account-message"></div><div class="accounting-grid"><label>Subtype<select id="coa-subtype"><option value="COLLECTION_CLEARING" selected>Collection Clearing</option></select></label><label>Account code<input id="coa-code" value="${escapeHtml(existing.code||existing.account_code||'')}"></label><label>Account name<input id="coa-name" value="${escapeHtml(existing.name||existing.account_name||'') || 'Collection Account – '}"></label><label>Collector<select id="coa-collector"><option value="">Select collector</option>${collectors.map(c=>`<option value="${escapeHtml(c.id)}" ${String(c.id)===String(existing.collector_id||existing.collectorId)?'selected':''}>${escapeHtml(collectionCollectorName(c))}</option>`).join('')}</select></label><label>Parent/control account<select id="coa-parent"><option value="">Select parent/control account</option>${parents.map(a=>`<option value="${escapeHtml(a.id)}" ${String(a.id)===String(existing.parent_account_id||existing.parent_id||existing.parentAccountId)?'selected':''}>${escapeHtml(collectionAccountLabel(a))}</option>`).join('')}</select></label><label>Posting allowed<select id="coa-posting"><option value="true">Yes</option><option value="false" ${(existing.posting_allowed===false||existing.allow_manual_posting===false)?'selected':''}>No</option></select></label><label>Active status<select id="coa-active"><option value="true">Active</option><option value="false" ${(existing.active===false||existing.is_active===false)?'selected':''}>Inactive</option></select></label></div><div class="modal-actions"><button class="secondary" data-close>Cancel</button><button id="save-collection-account">Save Account</button></div></div>`;
  document.body.appendChild(modal); modal.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal.remove());
  modal.querySelector('#save-collection-account').onclick=async()=>{ const msg=modal.querySelector('#collection-account-message'); try{ await api(existing.id?`/admin/accounting/accounts/${encodeURIComponent(existing.id)}`:'/admin/accounting/accounts',{method:existing.id?'PATCH':'POST',body:{account_code:modal.querySelector('#coa-code').value.trim(),account_name:modal.querySelector('#coa-name').value.trim(),account_subtype:'COLLECTION_CLEARING',collector_id:modal.querySelector('#coa-collector').value,parent_account_id:modal.querySelector('#coa-parent').value||null,posting_allowed:modal.querySelector('#coa-posting').value==='true',is_active:modal.querySelector('#coa-active').value==='true'}}); if(existing.id){ await refreshAccountsAfterSave(modal); }else{ msg.innerHTML='<div class="alert success">Collection clearing account saved.</div>'; await accountingLoadAccounts(); } }catch(e){msg.innerHTML=`<div class="alert error">${escapeHtml(accountApiError(e))}</div>`;} };
}
document.addEventListener('click', async e=>{ const edit=e.target.closest('.edit-account-btn'); if(edit){ e.preventDefault(); await openAccountEditor(Number(edit.dataset.accountId)); return; } const collectionAdd=e.target.closest('[data-collection-account-form]'); if(collectionAdd){ e.preventDefault(); if(!(collectionState.collectors||[]).length || !(accountingState.accounts||[]).length) await collectionBootstrapData(); openCollectionAccountForm({}); return; } const add=e.target.closest('[data-account-form]'); if(!add)return; if(add.classList.contains('edit-account-btn'))return; e.preventDefault(); await openCreateGeneralAccount(); });


// Collector Management UI additions
function collectorId(c){return c?.id||c?.collector_id||c?.collectorId||c?.staff_id||c?.staffId||'';}
function collectorStaffName(c){return c?.staff_name||c?.staffName||c?.full_name||c?.name||c?.username||'—';}
function collectorMobile(c){return c?.mobile||c?.phone||c?.staff_mobile||c?.staffMobile||'—';}
function collectorCode(c){return c?.collector_code||c?.collectorCode||c?.employee_code||c?.employeeCode||'—';}
function collectorAccountName(c){return c?.collection_account_name||c?.collectionAccountName||c?.default_collection_account_name||c?.defaultCollectionAccountName||c?.default_collection_account?.name||c?.defaultCollectionAccount?.name||'';}
function collectorHasPostingAccount(c){return !!((c?.default_collection_account_id||c?.defaultCollectionAccountId||c?.collection_account_id||c?.collectionAccountId||c?.default_collection_account?.id||c?.defaultCollectionAccount?.id) && (c?.collection_account_code||c?.collectionAccountCode||c?.default_collection_account_code||c?.defaultCollectionAccountCode||c?.default_collection_account?.code||c?.defaultCollectionAccount?.code) && collectorAccountName(c));}
function collectorActive(c){return String(c?.status||'ACTIVE').toUpperCase()==='ACTIVE' && c?.active!==false && c?.is_active!==false;}
function collectorReadiness(c){ if(!collectorActive(c)) return 'Inactive'; if((c?.can_collect_cash??c?.canCollectCash)!==false && !collectorHasPostingAccount(c)) return 'Missing Account'; if((c?.can_collect_cash??c?.canCollectCash)===false) return 'Cannot Collect Cash'; return 'Ready';}
async function loadCollectorsManagement(){
  const root=document.querySelector('#collections-collectors-root'); if(!root)return; root.innerHTML='<h2>Collectors</h2><p>Loading...</p>';
  try{ await collectionBootstrapData(); let rows=collectionState.collectors; if(!rows.length) rows=collectionItems(await api('/admin/collectors')); collectionState.collectors=rows;
    root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Collections</div><h2>Collectors</h2><p class="muted">Enable existing Staff & Roles users as cash collectors and create posting collection accounts under 1050 Collector Cash Clearing – Control.</p></div><button data-add-collector>Add Collector</button></div><div id="collector-management-message"></div>${!rows.length?'<div class="alert warning">No active collectors are configured.<br><button data-add-collector>Set Up Collector</button></div>':''}<div class="table-scroll collection-responsive-table"><table><thead><tr>${['Collector Code','Staff Name','Mobile','Status','Can Collect Cash','Readiness','Collection Account','Current Undeposited Balance','Actions'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(c=>{ const readiness=collectorReadiness(c); const acct=collectorAccountName(c); return `<tr class="${readiness==='Missing Account'?'alert-warning-row':''}"><td data-label="Collector Code">${escapeHtml(collectorCode(c))}</td><td data-label="Staff Name">${escapeHtml(collectorStaffName(c))}</td><td data-label="Mobile">${escapeHtml(collectorMobile(c))}</td><td data-label="Status"><span class="badge">${collectorActive(c)?'Active':'Inactive'}</span></td><td data-label="Can Collect Cash">${(c.can_collect_cash??c.canCollectCash)!==false?'Yes':'No'}</td><td data-label="Readiness"><span class="badge">${escapeHtml(readiness)}</span></td><td data-label="Collection Account">${acct?escapeHtml(acct):'<strong>Not configured</strong><br><button class="warning" data-create-collector-account="'+escapeHtml(collectorId(c))+'">Create Collection Account</button>'}</td><td data-label="Current Undeposited Balance"><strong>${formatCurrency(c.current_undeposited_balance||c.currentUndepositedBalance||c.closing_balance||0)}</strong></td><td data-label="Actions"><button data-enable-collector="${escapeHtml(collectorId(c))}">Enable as Collector</button> <button data-edit-collector="${escapeHtml(collectorId(c))}">Edit</button> <button data-toggle-collector="${escapeHtml(collectorId(c))}" data-status="ACTIVE">Activate</button> <button data-toggle-collector="${escapeHtml(collectorId(c))}" data-status="INACTIVE">Deactivate</button> <button data-collector-detail="${escapeHtml(collectorId(c))}">View Balance</button> <button data-create-collector-account="${escapeHtml(collectorId(c))}">Create Collection Account</button></td></tr>`;}).join('')||'<tr><td colspan="9">No collectors found.</td></tr>'}</tbody></table></div>`
  }catch(e){root.innerHTML=`<div class="alert error">${escapeHtml(e.message||'Failed to load collectors.')}</div>`;}
}
async function openCollectorSetupWizard(opts={}){
  const modal=document.createElement('div'); modal.className='modal-overlay historical-accounting-modal collector-setup-modal'; modal.innerHTML='<div class="modal-card wide"><div class="modal-header"><h2>Add Collector</h2><button class="icon-button" data-close>×</button></div><p>Loading staff...</p></div>'; document.body.appendChild(modal); modal.querySelector('[data-close]').onclick=()=>modal.remove();
  let staff=[]; try{ staff=collectionItems(await api('/admin/collectors/staff-options')); }catch(e){ modal.querySelector('.modal-card').innerHTML=`<div class="modal-header"><h2>Add Collector</h2><button class="icon-button" data-close>×</button></div><div class="alert error">${escapeHtml(e?.status===404?'Collector API endpoint was not found. Check frontend/API route configuration.':(e.message||'Failed to load staff options.'))}</div>`; modal.querySelector('[data-close]').onclick=()=>modal.remove(); return; }
  const names=staff.filter(s=>Number.isFinite(Number(s.id??s.staff_id)));
  modal.querySelector('.modal-card').innerHTML=`<div class="modal-header"><h2>Add Collector</h2><button class="icon-button" data-close>×</button></div><div id="collector-wizard-message"></div><div class="accounting-grid"><label>Step 1: Select existing staff member<input id="collector-staff-search" placeholder="Search name, employee code, or mobile"><select id="collector-staff"><option value="">Select staff</option>${names.map(s=>`<option value="${escapeHtml(s.id??s.staff_id)}" data-name="${escapeHtml(collectorStaffName(s))}">${escapeHtml([s.employee_code||s.employeeCode,collectorStaffName(s),s.mobile].filter(Boolean).join(' — '))}</option>`).join('')}</select></label><label>Collector code<input id="collector-code" placeholder="COL-SANJANA"></label><label>Can collect cash<select id="collector-can-cash"><option value="true">Yes</option><option value="false">No</option></select></label><label>Status<select id="collector-status"><option value="ACTIVE">Active</option><option value="INACTIVE">Inactive</option></select></label><label>Create collection account automatically<select id="collector-auto-account"><option value="true">Yes</option><option value="false">No</option></select></label></div><div class="subcard"><h3>Step 3: Account preview</h3><p><strong>Parent account:</strong> 1050 Collector Cash Clearing – Control</p><p><strong>New posting account:</strong> <span id="collector-account-preview">1051 Collection Account – Collector</span></p><ul><li>Asset</li><li>Collection Clearing</li><li>Debit normal balance</li><li>Posting allowed</li></ul></div><div class="modal-actions sticky-modal-footer"><button class="secondary" data-close>Cancel</button><button id="save-collector">Save Collector</button></div>`;
  modal.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal.remove()); const staffEl=modal.querySelector('#collector-staff'), codeEl=modal.querySelector('#collector-code'), searchEl=modal.querySelector('#collector-staff-search'), preview=modal.querySelector('#collector-account-preview');
  const sync=()=>{const opt=staffEl.options[staffEl.selectedIndex]; const name=opt?.dataset.name||'Collector'; if(!codeEl.value) codeEl.value='COL-'+name.toUpperCase().replace(/[^A-Z0-9]+/g,'-').replace(/^-|-$/g,''); preview.textContent=`1051 Collection Account – ${name}`;}; staffEl.onchange=sync; searchEl.oninput=()=>{const q=searchEl.value.toLowerCase(); [...staffEl.options].forEach((o,i)=>{if(i)o.hidden=!o.textContent.toLowerCase().includes(q);});}; sync();
  modal.querySelector('#save-collector').onclick=async()=>{const msg=modal.querySelector('#collector-wizard-message'); const saveBtn=modal.querySelector('#save-collector'); const selectedStaffId=Number(staffEl.value); if(!staffEl.value){msg.innerHTML='<div class="alert error">Select an existing staff member.</div>';return;} if(!Number.isFinite(selectedStaffId)){msg.innerHTML='<div class="alert error">Selected staff option does not have a numeric database ID.</div>';return;} try{saveBtn.disabled=true; await api('/admin/collectors',{method:'POST',body:{staff_id:selectedStaffId,collector_code:codeEl.value.trim(),can_collect_cash:true,status:'ACTIVE',create_collection_account:true}}); await collectionBootstrapData(); await loadCollectorsManagement(); setInlineAlert(document.querySelector('#collector-management-message'),'Collector created successfully.','success'); modal.remove();}catch(e){msg.innerHTML=`<div class="alert error">${escapeHtml(e?.status===404?'Collector API endpoint was not found. Check frontend/API route configuration.':(e.message||'Failed to save collector.'))}</div>`;}finally{saveBtn.disabled=false;}};
}
document.addEventListener('click',e=>{if(e.target.closest('[data-add-collector]')){e.preventDefault();openCollectorSetupWizard();} const id=e.target.closest('[data-create-collector-account]')?.dataset.createCollectorAccount; if(id){e.preventDefault(); openCollectionAccountForm({collector_id:id,account_name:'Collection Account – '+(collectionState.collectors.find(c=>String(collectorId(c))===String(id))?collectorStaffName(collectionState.collectors.find(c=>String(collectorId(c))===String(id))):'')});} const t=e.target.closest('[data-toggle-collector]'); if(t){e.preventDefault(); api(`/admin/collections/collectors/${encodeURIComponent(t.dataset.toggleCollector)}`,{method:'PATCH',body:{status:t.dataset.status}}).then(loadCollectorsManagement).catch(err=>alert(err.message));} if(e.target.closest('[data-enable-collector],[data-edit-collector]')){e.preventDefault();openCollectorSetupWizard();}});
(function(){const st=document.createElement('style');st.textContent='@media(max-width:700px){.collector-setup-modal .modal-card{width:100%;max-width:none;margin:0;min-height:100vh}.collection-responsive-table table,.collection-responsive-table thead,.collection-responsive-table tbody,.collection-responsive-table tr,.collection-responsive-table td{display:block;width:100%}.collection-responsive-table thead{display:none}.collection-responsive-table tr{border:1px solid var(--border,#ddd);border-radius:12px;margin:0 0 12px;padding:8px;overflow:hidden}.collection-responsive-table td{display:flex;justify-content:space-between;gap:10px;border:0}.collection-responsive-table td:before{content:attr(data-label);font-weight:700}.sticky-modal-footer{position:sticky;bottom:0;z-index:2}}';document.head.appendChild(st);})();

// Investor Funding module UI
const investorFundingRoutes = {
  investors: '/admin/investors',
  agreements: '/admin/investor-funding/agreements',
  transactions: '/admin/investor-funding/principal-transactions',
  accruals: '/admin/investor-funding/interest-accruals',
  payments: '/admin/investor-funding/interest-payments',
  balances: '/admin/investor-funding/reports/balances',
  interestReport: '/admin/investor-funding/reports/interest',
  reconciliation: '/admin/investor-funding/reconciliation',
  settings: '/admin/accounting/settings/investor-funding',
};
const investorFundingState = { investors: [], agreements: [], accounts: [], settings: normalizeInvestorFundingSettings({}), settingsError: null, settingsLoaded: false, settingsLoading: false, settingsPromise: null, lastFundingResult: null, investorOptionsCache: null };
const investorItems = d => Array.isArray(d) ? d : (d?.items || d?.data || d?.results || d?.investors || d?.agreements || d?.accruals || d?.payments || d?.rows || []);
const investorField = (o, ...keys) => keys.reduce((v, k) => v ?? o?.[k], null) ?? '';
const investorMoney = v => formatCurrency(v);
const investorDate = v => v ? formatDateOnlyDisplay(String(v).slice(0, 10)) : '—';
const investorRate = (rate, period) => `${Number(rate || 0).toFixed(2)}% per ${String(period || 'MONTHLY').toLowerCase().replace('monthly','month').replace('annual','year').replace('_',' ')}`;
const investorMaskAccount = v => { const s=String(v||''); return s.length>4 ? `•••• ${s.slice(-4)}` : s; };
const investorAccountLabel = a => [a?.code||a?.account_code, a?.name||a?.account_name].filter(Boolean).join(' ');
const investorAccountType = a => String(a?.account_type||a?.type||'').toUpperCase();
const investorAccountSubtype = a => String(a?.account_subtype||a?.subtype||'').toUpperCase();
const investorAccountRoleText = a => String(a?.role||a?.account_role||a?.system_role||a?.purpose||a?.account_subtype||a?.subtype||'').toUpperCase();
const investorAccountSearchText = a => [a?.code,a?.account_code,a?.name,a?.account_name,investorAccountSubtype(a),investorAccountRoleText(a)].filter(Boolean).join(' ').toUpperCase();
const investorIsActivePostingAccount = a => (a?.is_active??a?.active??true)!==false && (a?.posting_allowed??a?.allow_posting??true)!==false;
const investorIsBank = a => investorIsActivePostingAccount(a) && investorAccountType(a)==='ASSET' && ['BANK','CASH'].includes(investorAccountSubtype(a));
const investorToday = () => todayDateOnly();
function investorSettingsApiError(e){ if(e?.status===401) return 'Your session has expired. Please sign in again.'; if(e?.status===403) return 'You do not have permission to view Investor Funding settings.'; if(e?.status===404) return 'Investor Funding settings endpoint was not found.'; if(e?.status===422) return e?.message || 'Investor Funding settings contain validation errors.'; if(e?.status===500) return 'Investor Funding settings could not be loaded.'; return e?.message || 'Investor Funding settings could not be loaded.'; }
function investorApiError(e, resource='funding'){ const message=String(e?.message||''); const code=message.toLowerCase(); const isAgreement=resource==='agreement-create'||resource==='agreement'; if(resource==='settings') return investorSettingsApiError(e); if(e?.status===401) return 'Your session has expired. Please sign in again.'; if(e?.status===403) return resource==='investor'?'You do not have permission to perform this investor action.':isAgreement?'You do not have permission to perform this funding agreement action.':'You do not have permission to perform this investor funding action.'; if(code.includes('investor_not_found')) return isAgreement?'The selected investor was not found.':'The investor was not found.'; if(code.includes('investor_inactive')) return 'The selected investor is not active.'; if(code.includes('investor_agreement_not_found')) return 'The investor funding agreement was not found.'; if(code.includes('investor_funding_not_found')) return resource==='funding'?'The investor funding record was not found.':isAgreement?'The investor funding agreement was not found.':'The investor was not found.'; if(e?.status===404){ if(resource==='investor-create' && (!message || code.includes('request failed with status 404'))) return 'The Investor API endpoint was not found.'; if(resource==='investor-options') return 'Investor options endpoint was not found.'; return resource==='funding'?'The investor funding record was not found.':isAgreement?'The investor funding agreement was not found.':'The investor was not found.'; } if(e?.status===422) return e.message || (isAgreement?'The funding agreement request contains validation errors.':resource==='funding'?'The investor funding request contains validation errors.':'The investor request contains validation errors.'); if(e?.status===500) return isAgreement?'The server could not process the funding agreement request.':resource==='funding'?'The server could not process the investor funding request.':'The server could not process the investor request.'; if(e?.name==='AbortError') return isAgreement?'Funding agreement request timed out. Please retry.':resource==='funding'?'Investor funding request timed out. Please retry.':'Investor request timed out. Please retry.'; return e?.message || (isAgreement?'Funding agreement request failed.':resource==='funding'?'Investor funding request failed.':'Investor request failed.'); }
function getExistingAdminContentRoot() {
  return (
    document.querySelector('#admin-panel .admin-layout > .admin-content') ||
    document.querySelector('.admin-layout > .admin-content')
  );
}
function ensureInvestorFundingSection(sectionName, rootId) {
  const adminContent = getExistingAdminContentRoot();
  if (!adminContent) {
    console.error('Existing admin-content root not found');
    return null;
  }
  let section = adminContent.querySelector(`.admin-section[data-section="${sectionName}"]`);
  if (!section) {
    section = document.createElement('section');
    section.className = 'admin-section hidden investor-funding-section';
    section.dataset.section = sectionName;
    section.innerHTML = `<div id="${rootId}"></div>`;
    adminContent.appendChild(section);
  } else {
    section.classList.add('investor-funding-section');
    if (!section.querySelector(`#${rootId}`)) section.innerHTML = `<div id="${rootId}"></div>`;
  }
  return section;
}
function logInvestorFundingPlacementCheck() {
  const adminContent = getExistingAdminContentRoot();
  console.log('Investor Funding placement check', {
    adminContent,
    parent: adminContent?.parentElement,
    investorSection: adminContent?.querySelector('[data-section="investor-funding-investors"]'),
    investorRoot: adminContent?.querySelector('#investor-funding-investors-root'),
    directChildren: Array.from(adminContent?.children || []).map(element => ({
      tag: element.tagName,
      section: element.dataset.section || '',
      id: element.id || '',
    }))
  });
}
function ensureInvestorFundingNavigation(){
  const host=document.querySelector('.admin-sidebar,.sidebar,.admin-menu,nav,.admin-nav');
  if(host && !document.querySelector('[data-investor-funding-nav]')) host.insertAdjacentHTML('beforeend', `<div data-investor-funding-nav class="menu-group"><div class="eyebrow">Investor Funding</div>${[['Investors','investor-funding-investors'],['Funding Agreements','investor-funding-agreements'],['Record Investor Funding','investor-funding-record'],['Interest Accruals','investor-funding-accruals'],['Interest Payments','investor-funding-payments'],['Investor Balances','investor-funding-balances'],['Investor Reports','investor-funding-reports'],['Investor Reconciliation','investor-funding-reconciliation']].map(([l,s])=>`<button class="admin-menu-item" data-section-link="${s}">${l}</button>`).join('')}</div>`);
  [['investor-funding-investors','investor-funding-investors-root'],['investor-funding-agreements','investor-funding-agreements-root'],['investor-funding-record','investor-funding-record-root'],['investor-funding-accruals','investor-funding-accruals-root'],['investor-funding-payments','investor-funding-payments-root'],['investor-funding-balances','investor-funding-balances-root'],['investor-funding-reports','investor-funding-reports-root'],['investor-funding-reconciliation','investor-funding-reconciliation-root'],['investor-funding-agreement-detail','investor-funding-agreement-detail-root']].forEach(([sec,id])=>ensureInvestorFundingSection(sec,id));
  logInvestorFundingPlacementCheck();
}
function showInvestorFundingSection(sectionName) {
  const adminContent = getExistingAdminContentRoot();
  if (!adminContent) return;
  adminContent.querySelectorAll(':scope > .admin-section').forEach(section => {
    section.classList.toggle('hidden', section.dataset.section !== sectionName);
  });
}
function normalizeInvestorFundingSettings(raw) { const source = raw?.data ?? raw?.settings ?? raw ?? {}; return { configured: source.configured === true, investorBorrowingsAccountId: source.investor_borrowings_control_account_id ?? source.accounts?.investor_borrowings_control?.id ?? null, investorInterestExpenseAccountId: source.investor_interest_expense_account_id ?? source.accounts?.investor_interest_expense?.id ?? null, investorInterestPayableAccountId: source.investor_interest_payable_account_id ?? source.accounts?.investor_interest_payable?.id ?? null, withholdingTaxAccountId: source.investor_withholding_tax_payable_account_id ?? source.accounts?.withholding_tax_payable?.id ?? null, defaultFundingBankAccountId: source.default_investor_funding_bank_account_id ?? source.accounts?.default_funding_bank?.id ?? null, calculationMethod: source.default_interest_calculation_method ?? 'MONTHLY_AVERAGE_DAILY_BALANCE', interestRatePeriod: source.default_interest_rate_period ?? 'MONTHLY', interestPaymentFrequency: source.default_interest_payment_frequency ?? 'MONTHLY', compoundingMethod: source.default_compounding_method ?? 'NONE', dayCountBasis: source.default_day_count_basis ?? 'ACTUAL_365', interestPaymentMethod: source.default_interest_payment_method ?? 'BANK_TRANSFER', autoPostInterest: source.auto_post_investor_interest === true, allowHistoricalTransactions: source.allow_historical_investor_transactions !== false, allowInterestCapitalization: source.allow_interest_capitalization === true, missingSettings: source.missing_settings ?? [] }; }
async function loadInvestorFundingSettings(force=false){ if(!force&&investorFundingState.settingsLoaded) return investorFundingState.settings; if(!force&&investorFundingState.settingsPromise) return investorFundingState.settingsPromise; investorFundingState.settingsLoading=true; investorFundingState.settingsError=null; investorFundingState.settingsPromise=(async()=>{ try{ const response=await api(investorFundingRoutes.settings); console.log('Investor funding settings response', response); investorFundingState.settings=normalizeInvestorFundingSettings(response); investorFundingState.settingsLoaded=true; return investorFundingState.settings; }catch(e){ investorFundingState.settings=normalizeInvestorFundingSettings({}); investorFundingState.settingsError=e; investorFundingState.settingsLoaded=true; return investorFundingState.settings; }finally{ investorFundingState.settingsLoading=false; investorFundingState.settingsPromise=null; } })(); return investorFundingState.settingsPromise; }
async function investorBootstrap(){ const [acc]=await Promise.allSettled([api('/admin/accounting/accounts')]); investorFundingState.accounts=investorItems(acc.value); await loadInvestorFundingSettings(); const [inv, agr] = await Promise.allSettled([api(investorFundingRoutes.investors), api(investorFundingRoutes.agreements)]); investorFundingState.investors=investorItems(inv.value); investorFundingState.agreements=investorItems(agr.value); }
function investorRequiredSettingsMissing(){ const s=investorFundingState.settings||{}; const base=[['Investor Borrowings Control Account','investorBorrowingsAccountId'],['Investor Interest Expense Account','investorInterestExpenseAccountId'],['Accrued Investor Interest Payable Account','investorInterestPayableAccountId']]; const missing=base.filter(([,k])=>!s[k]).map(([l])=>l); (s.missingSettings||[]).forEach(m=>{ const label=String(m).replace(/_/g,' ').replace(/\b\w/g,c=>c.toUpperCase()); if(label&&!missing.includes(label)) missing.push(label); }); return missing; }
function investorConfigWarning(){ const s=investorFundingState.settings||{}; if(investorFundingState.settingsLoading) return '<div class="alert info">Loading Investor Funding configuration...</div>'; if(investorFundingState.settingsError){ const unavailable=investorFundingState.settingsError.status===404?'Investor Funding accounting settings endpoint is unavailable.<br>Deploy the Investor Funding settings API before posting funding or interest entries.':investorSettingsApiError(investorFundingState.settingsError); return `<div class="alert warning"><strong>${escapeHtml(unavailable).replaceAll('&lt;br&gt;','<br>')}</strong></div>`; } const missing=investorRequiredSettingsMissing(); return s.configured===false||missing.length?`<div class="alert warning"><strong>Investor funding accounting configuration is incomplete.</strong>${missing.length?`<ul>${missing.map(l=>`<li>${escapeHtml(l)}</li>`).join('')}</ul>`:''}<button data-accounting-section="accounting-settings">Configure Investor Accounts</button></div>`:''; }
function investorOptions(rows, labeler){ return rows.map(r=>`<option value="${escapeHtml(r.id||r.investor_id||r.agreement_id)}">${escapeHtml(labeler(r))}</option>`).join(''); }
function clearInvestorPageChrome(){
  document.querySelectorAll('.modal-overlay,.modal-backdrop,.drawer-backdrop,.dark-overlay,.overlay-backdrop,[data-modal-backdrop],[data-drawer-backdrop]').forEach(el=>el.remove());
  ['modal-open','drawer-open','overlay-active','panel-open','split-view','dark-overlay'].forEach(cls=>{ document.body.classList.remove(cls); document.documentElement.classList.remove(cls); });
  document.body.style.overflow=''; document.documentElement.style.overflow='';
  document.querySelectorAll('.drawer,.side-drawer,.overlay-panel,.bottom-sheet,.investor-form-panel').forEach(el=>{ if(!el.closest('#investor-funding-investors-root')) el.replaceChildren(); });
}
function safeNumber(value, fallback = 0) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}
function formatLkr(value) {
  const amount = safeNumber(value);
  return `Rs. ${amount.toLocaleString('en-LK', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
}
function escapeInvestorHtml(value) {
  return String(value ?? '').replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;').replaceAll("'", '&#039;');
}
function normalizeInvestorList(raw){ const source=raw?.data??raw??{}; const rows=Array.isArray(source)?source:(source.items??source.investors??source.data?.items??source.data?.investors??[]); return Array.isArray(rows)?rows:[]; }
function normalizeInvestor(item = {}) {
  const idValue = item.id ?? item.investor_id ?? null;
  const id = Number(idValue);
  const investorNumber = String(item.investor_number ?? '').trim();
  const investorType = String(item.investor_type ?? 'OTHER').trim().toUpperCase();
  const fullName = String(item.full_name ?? '').trim();
  const companyName = String(item.company_name ?? '').trim();
  const displayName = String(item.display_name ?? (investorType === 'COMPANY' ? companyName : fullName) ?? fullName ?? companyName ?? investorNumber ?? 'Investor').trim() || 'Investor';
  const identification = String(item.nic ?? item.company_registration_number ?? '').trim();
  const mobile = String(item.mobile ?? '').trim();
  const status = String(item.status ?? 'INACTIVE').trim().toUpperCase();
  return { id: Number.isFinite(id) ? id : null, investorNumber: investorNumber || '—', displayName, investorType: investorType || 'OTHER', identification: identification || '—', mobile: mobile || '—', activeAgreements: safeNumber(item.active_agreements ?? item.active_agreement_count ?? 0), principalBalance: safeNumber(item.principal_balance ?? item.current_principal_balance ?? 0), accruedInterest: safeNumber(item.accrued_interest ?? item.accrued_interest_balance ?? 0), status, raw: item };
}
function investorListErrorMessage(e){ if(e?.status===401) return 'Your session has expired. Please sign in again.'; if(e?.status===403) return 'You do not have permission to view investors.'; if(e?.status===404) return 'Investor list endpoint was not found.'; if(e?.status===500) return 'Investors could not be loaded due to a server error.'; return e?.message || 'Investors could not be loaded.'; }
function getInvestorApiErrorMessage(error){ return investorListErrorMessage(error); }
function getInvestorContentRoot(){ const adminContent=getExistingAdminContentRoot(); if(!adminContent) return null; return adminContent.querySelector('#investor-funding-investors-root') || ensureInvestorFundingSection('investor-funding-investors','investor-funding-investors-root')?.querySelector('#investor-funding-investors-root'); }
function isDedicatedInvestorRoot(root) { return root?.id === 'investor-funding-investors-root'; }
function clearInvestorPageError(){ const root=getInvestorContentRoot(); root?.querySelector('#investor-message')?.replaceChildren(); }
function renderInvestorLoadError(message){ const root=getInvestorContentRoot(); if(!root) return; const body=investorPageShell(root); if(!body) return; body.innerHTML=`<div class="alert error"><strong>${escapeInvestorHtml(message || 'Investors could not be loaded.')}</strong><br><button type="button" data-refresh-investors>Retry</button></div>`; }
function renderInvestorPageError(message){ const root=getInvestorContentRoot(); if(!root) return; const body=root.querySelector('#investor-page-body') || investorPageShell(root); if(!body) return; body.innerHTML=`<div class="alert error"><strong>${escapeInvestorHtml(message || 'Investor page could not be rendered.')}</strong><br><button type="button" data-refresh-investors>Retry</button></div>`; }
function investorPageShell(root){ clearInvestorPageChrome(); if(!isDedicatedInvestorRoot(root)){ console.error('Refusing to render Investors into an unsafe root', root); return null; } root.replaceChildren(); root.innerHTML='<!-- investors-ui-v2 --><section class="page-card investor-page investors-dashboard-v2" data-ui-version="investors-v2"><header class="investor-hero"><div><div class="eyebrow">INVESTOR FUNDING</div><h1>Investors</h1><p class="muted">Manage investors, funding agreements, balances, and accrued interest.</p></div><button type="button" id="add-investor-btn" class="investor-primary-action" data-add-investor>Add Investor</button></header><div id="investor-message"></div><div id="investor-page-body"><p class="investor-loading">Loading investors...</p></div></section>'; console.log('Investor page root', root); return root.querySelector('#investor-page-body'); }
function renderInvestorRow(investor) {
  if (!investor) return '';
  const investorId = Number.isInteger(investor.id) ? investor.id : '';
  const statusClass = investor.status === 'ACTIVE' ? 'status-active' : investor.status === 'SUSPENDED' ? 'status-warning' : 'status-inactive';
  const typeClass = `type-${String(investor.investorType || 'other').toLowerCase().replace(/[^a-z0-9-]/g, '-')}`;
  return `<tr><td data-label="Investor Number"><span class="investor-number-link">${escapeInvestorHtml(investor.investorNumber)}</span></td><td data-label="Investor Name"><strong class="investor-name-cell">${escapeInvestorHtml(investor.displayName)}</strong></td><td data-label="Type"><span class="investor-type-badge ${typeClass}">${escapeInvestorHtml(investor.investorType)}</span></td><td data-label="NIC / Registration No.">${escapeInvestorHtml(investor.identification)}</td><td data-label="Mobile">${escapeInvestorHtml(investor.mobile)}</td><td data-label="Active Agreements" class="number-cell">${safeNumber(investor.activeAgreements)}</td><td data-label="Principal Balance" class="money-cell investor-money-emphasis">${formatLkr(investor.principalBalance)}</td><td data-label="Accrued Interest" class="money-cell">${formatLkr(investor.accruedInterest)}</td><td data-label="Status"><span class="status-badge ${statusClass}">${escapeInvestorHtml(investor.status)}</span></td><td data-label="Actions"><div class="table-actions investor-row-actions"><button type="button" class="btn-small view-investor-btn" title="View investor" aria-label="View investor" data-investor-id="${investorId}" ${investorId ? '' : 'disabled'}>View</button><button type="button" class="btn-small edit-investor-btn" title="Edit investor" aria-label="Edit investor" data-investor-edit="${investorId}" data-investor-id="${investorId}" ${investorId ? '' : 'disabled'}>Edit</button><button type="button" class="btn-small new-agreement-btn" title="Create new funding agreement" aria-label="Create new funding agreement" data-new-agreement="${investorId}" data-investor-id="${investorId}" ${investorId ? '' : 'disabled'}>New Agreement</button></div></td></tr>`;
}
function renderInvestorTable(investors) {
  const rows = Array.isArray(investors) ? investors : [];
  if (rows.length === 0) return `<div class="empty-state investor-empty"><h3>No investors found</h3><p>Create the first investor to begin recording funding agreements.</p><button type="button" id="empty-add-investor" class="investor-primary-action" data-add-investor>Add Investor</button></div>`;
  return `<section class="investor-table-card" aria-label="Investors"><div class="table-scroll collection-responsive-table investor-table"><table class="data-table"><thead><tr>${['Investor Number','Investor Name','Type','NIC / Registration No.','Mobile','Active Agreements','Principal Balance','Accrued Interest','Status','Actions'].map(h=>`<th>${escapeInvestorHtml(h)}</th>`).join('')}</tr></thead><tbody>${rows.map(renderInvestorRow).join('')}</tbody></table></div></section>`;
}
function renderInvestorSummary(investors){ const totals={ totalInvestors:investors.length, activeInvestors:investors.filter(investor=>investor.status==='ACTIVE').length, activeAgreements:investors.reduce((sum,investor)=>sum+safeNumber(investor.activeAgreements),0), principalBalance:investors.reduce((sum,investor)=>sum+safeNumber(investor.principalBalance),0), accruedInterest:investors.reduce((sum,investor)=>sum+safeNumber(investor.accruedInterest),0) }; const cards=[['Total Investors',totals.totalInvestors,'All investor profiles','👥'],['Active Investors',totals.activeInvestors,'Investors ready for funding','✅'],['Active Agreements',totals.activeAgreements,'Open funding agreements','📄'],['Total Principal',formatLkr(totals.principalBalance),'Principal currently funded','₨'],['Accrued Interest',formatLkr(totals.accruedInterest),'Interest accrued to date','%']]; return `<div class="investor-kpi-grid">${cards.map(([label,value,helper,icon])=>`<article class="investor-kpi-card"><div class="investor-kpi-icon" aria-hidden="true">${escapeInvestorHtml(icon)}</div><div><div class="metric-label">${escapeInvestorHtml(label)}</div><div class="metric-value">${escapeInvestorHtml(value)}</div><p>${escapeInvestorHtml(helper)}</p></div></article>`).join('')}</div>`; }
function renderInvestorListBody(root, investors, filters={search:'',type:'',status:''}){ const page=root.closest('.investor-page')||root.querySelector('.investor-page'); const body=page.querySelector('#investor-page-body'); const q=String(filters.search||'').toLowerCase(); const safeInvestors=Array.isArray(investors)?investors:[]; const rows=safeInvestors.filter(i=>(!filters.type||i.investorType===filters.type)&&(!filters.status||i.status===filters.status)&&(!q||[i.investorNumber,i.displayName,i.identification,i.mobile].some(v=>String(v||'').toLowerCase().includes(q)))); const types=[...new Set(safeInvestors.map(i=>i.investorType).filter(Boolean).filter(t=>t!=='—'))]; const controls=`${renderInvestorSummary(safeInvestors)}${investorConfigWarning()}<section class="filter-bar accounting-filters investor-filters" aria-label="Investor filters"><label class="investor-search-field"><span class="sr-only">Search investors</span><input id="investor-search" placeholder="Search by investor number, name, NIC or mobile..." value="${escapeInvestorHtml(filters.search||'')}"></label><label><span class="sr-only">Investor type</span><select id="investor-type-filter"><option value="">All types</option>${types.map(t=>`<option value="${escapeInvestorHtml(t)}" ${filters.type===t?'selected':''}>${escapeInvestorHtml(t)}</option>`).join('')}</select></label><label><span class="sr-only">Investor status</span><select id="investor-status-filter"><option value="">All statuses</option>${['ACTIVE','INACTIVE','SUSPENDED'].map(st=>`<option value="${st}" ${filters.status===st?'selected':''}>${st}</option>`).join('')}</select></label><button type="button" class="secondary investor-refresh-button" data-refresh-investors>Refresh</button></section>`; body.innerHTML=controls+`<div id="investor-list-content">${renderInvestorTable(rows)}</div>`; ['#investor-search','#investor-type-filter','#investor-status-filter'].forEach(sel=>body.querySelector(sel)?.addEventListener('input',()=>renderInvestorListBody(root, safeInvestors, {search:body.querySelector('#investor-search')?.value||'',type:body.querySelector('#investor-type-filter')?.value||'',status:body.querySelector('#investor-status-filter')?.value||''}))); }
function attachInvestorPageActions(root){ if(!root || root.dataset.investorActionsAttached==='true') return; root.dataset.investorActionsAttached='true'; root.addEventListener('click', event=>{ const viewButton=event.target.closest('.view-investor-btn'); if(viewButton){ event.preventDefault(); event.stopPropagation(); const inv=investorFundingState.investors.find(i=>String(i.id)===String(viewButton.dataset.investorId)); if(inv) openInvestorForm(inv); return; } }); }
function renderInvestorPage(investors, response){ const root=getInvestorContentRoot(); if(!root) return; clearInvestorPageError(); const body=investorPageShell(root); renderInvestorListBody(root, Array.isArray(investors)?investors:[], {}); attachInvestorPageActions(root); }
async function loadInvestorsPage(){ const root=getInvestorContentRoot(); if(!root)return; const previous={search:root.querySelector('#investor-search')?.value||'',type:root.querySelector('#investor-type-filter')?.value||'',status:root.querySelector('#investor-status-filter')?.value||''}; investorPageShell(root); let response; try{ await loadInvestorFundingSettings(); response=await api('/admin/investors',{ method:'GET' }); console.log('Investors response', response); }catch(error){ console.error('Investor API request failed', error); renderInvestorLoadError(getInvestorApiErrorMessage(error)); return; } let investors; try{ investors=normalizeInvestorList(response).map(normalizeInvestor); console.log('Normalized investors', investors); investorFundingState.investors=investors; }catch(error){ console.error('Investor normalization failed', error, response); renderInvestorPageError('Investor data could not be processed.'); return; } try{ clearInvestorPageError(); const renderRoot=getInvestorContentRoot(); renderInvestorListBody(renderRoot, investors, previous); attachInvestorPageActions(renderRoot); }catch(error){ console.error('Investor page rendering failed', { error, message:error?.message, stack:error?.stack, investors }); renderInvestorPageError(`Investor page could not be rendered: ${error?.message || 'Unknown rendering error'}`); } }
function openInvestorForm(existing={}){
  const modal=document.createElement('div'); modal.className='modal-overlay historical-accounting-modal';
  modal.innerHTML=`<div class="modal-card wide"><div class="modal-header"><h2>${existing.id?'Edit':'Add'} Investor</h2><button class="icon-button" data-close>×</button></div><div id="investor-form-msg"></div><div class="accounting-grid"><label>Investor type<select id="if-type"><option value="INDIVIDUAL">Individual</option><option value="COMPANY">Company</option></select></label><label data-individual>Full name<input id="if-full" value="${escapeHtml(existing.full_name||existing.name||'')}"></label><label data-company>Company name<input id="if-company" value="${escapeHtml(existing.company_name||'')}"></label><label data-individual>NIC<input id="if-nic" value="${escapeHtml(existing.nic||existing.nic_number||'')}"></label><label data-company>Company registration number<input id="if-reg" value="${escapeHtml(existing.company_registration_number||'')}"></label><label>Tax identification number<input id="if-tax" value="${escapeHtml(existing.tax_identification_number||'')}"></label><label>Mobile<input id="if-mobile" value="${escapeHtml(existing.mobile||'')}"></label><label>Email<input id="if-email" type="email" value="${escapeHtml(existing.email||'')}"></label><label>Address<textarea id="if-address">${escapeHtml(existing.address||'')}</textarea></label><label>Bank name<input id="if-bank" value="${escapeHtml(existing.bank_name||'')}"></label><label>Bank branch<input id="if-branch" value="${escapeHtml(existing.bank_branch||'')}"></label><label>Bank account name<input id="if-acct-name" value="${escapeHtml(existing.bank_account_name||'')}"></label><label>Bank account number<input id="if-acct-no" value="${escapeHtml(existing.bank_account_number||'')}"></label><label>Notes<textarea id="if-notes">${escapeHtml(existing.notes||'')}</textarea></label><label>Status<select id="if-status"><option>ACTIVE</option><option>INACTIVE</option></select></label></div><div class="modal-actions sticky-modal-footer"><button class="secondary" data-close>Cancel</button><button id="save-investor">Save Investor</button></div></div>`;
  document.body.appendChild(modal); const type=modal.querySelector('#if-type'), statusEl=modal.querySelector('#if-status'), msg=modal.querySelector('#investor-form-msg'), saveButton=modal.querySelector('#save-investor');
  type.value=existing.investor_type||existing.type||'INDIVIDUAL'; statusEl.value=existing.status||'ACTIVE';
  const field=id=>modal.querySelector(id).value.trim();
  const nullable=id=>field(id)||null;
  const sync=()=>{ modal.querySelectorAll('[data-individual]').forEach(e=>e.style.display=type.value==='INDIVIDUAL'?'':'none'); modal.querySelectorAll('[data-company]').forEach(e=>e.style.display=type.value==='COMPANY'?'':'none');};
  type.onchange=sync; sync(); modal.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal.remove());
  let savingInvestor=false;
  saveButton.onclick=async()=>{
    if(savingInvestor) return;
    msg.innerHTML='';
    const payload={investor_type:type.value,full_name:field('#if-full'),company_name:nullable('#if-company'),nic:nullable('#if-nic'),company_registration_number:nullable('#if-reg'),tax_identification_number:nullable('#if-tax'),mobile:nullable('#if-mobile'),email:nullable('#if-email'),address:nullable('#if-address'),bank_name:nullable('#if-bank'),bank_branch:nullable('#if-branch'),bank_account_name:nullable('#if-acct-name'),bank_account_number:nullable('#if-acct-no'),notes:nullable('#if-notes'),status:statusEl.value};
    const errors=[];
    if(!payload.investor_type) errors.push('Investor type is required.');
    if(!payload.status) errors.push('Status is required.');
    if(payload.investor_type==='INDIVIDUAL'&&!payload.full_name) errors.push('Full name is required for an individual investor.');
    if(payload.investor_type==='COMPANY'&&!payload.company_name) errors.push('Company name is required for a company investor.');
    if(payload.email&&!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email)) errors.push('Enter a valid email address.');
    if(errors.length){ msg.innerHTML=`<div class="alert error">${errors.map(escapeHtml).join('<br>')}</div>`; return; }
    savingInvestor=true; saveButton.disabled=true;
    try{
      const path=existing.id?`${investorFundingRoutes.investors}/${encodeURIComponent(existing.id)}`:'/admin/investors';
      if(!existing.id) console.log('Create investor request',{path:'/admin/investors',payloadKeys:Object.keys(payload)});
      const response=await api(path,{method:existing.id?'PATCH':'POST',body:payload});
      if(!existing.id){ console.log('Create investor response',response); const investorId=response.id??response.investor_id; if(!Number.isInteger(Number(investorId))){ throw new Error('Investor was created but the response did not include a valid investor ID.'); } }
      invalidateInvestorOptionsCache(); const refreshedInvestorOptions=await loadInvestorAgreementOptions(true).catch(()=>null); if(refreshedInvestorOptions) refreshOpenAgreementInvestorSelect(refreshedInvestorOptions);
      modal.remove(); await loadInvestorsPage();
      const listMsg=document.querySelector('#investor-message');
      if(listMsg){ const investorId=response.id??response.investor_id??existing.id; const investorNumber=response.investor_number?`<br>Investor Number: ${escapeHtml(response.investor_number)}`:''; const action=investorId?`<br><button data-new-agreement="${escapeHtml(investorId)}">Create Funding Agreement</button>`:''; listMsg.innerHTML=`<div class="alert success">${existing.id?'Investor updated successfully.':'Investor created successfully.'}${investorNumber}${!existing.id?action:''}</div>`; }
    }catch(e){ msg.innerHTML=`<div class="alert error">${escapeHtml(investorApiError(e, existing.id?'investor':'investor-create'))}</div>`; }
    finally{ savingInvestor=false; saveButton.disabled=false; }
  };
}
function invalidateInvestorOptionsCache(){ investorFundingState.investorOptionsCache=null; }
function normalizeInvestorOptionsResponse(response){ const investorOptions=Array.isArray(response)?response:(response?.items??response?.investors??[]); const normalizedInvestors=investorOptions.map(item=>({id:Number(item.id??item.investor_id),investorNumber:item.investor_number??'',displayName:item.display_name??item.full_name??item.company_name??item.investor_number??'Investor',status:String(item.status??'').trim().toUpperCase(),nic:item.nic??''})).filter(item=>Number.isInteger(item.id)&&item.status==='ACTIVE'); console.log('Normalized investor options', normalizedInvestors); return normalizedInvestors; }
async function loadInvestorAgreementOptions(fresh=true){ if(!fresh&&Array.isArray(investorFundingState.investorOptionsCache)) return investorFundingState.investorOptionsCache; const response=await api('/admin/investors/options'); console.log('Investor options raw response', response); const normalized=normalizeInvestorOptionsResponse(response); investorFundingState.investorOptionsCache=normalized; return normalized; }
function investorAgreementOptionHtml(investors){ return '<option value="">Select investor</option>'+investors.map(i=>`<option value="${escapeHtml(i.id)}">${escapeHtml([i.investorNumber,i.displayName].filter(Boolean).join(' — '))}</option>`).join(''); }
function refreshOpenAgreementInvestorSelect(investors){ const select=document.querySelector('#ag-investor'); if(!select) return; const current=select.value; select.innerHTML=investorAgreementOptionHtml(investors); if(current) select.value=current; select.disabled=false; const save=document.querySelector('#save-agreement'); if(save) save.disabled=false; const help=document.querySelector('#ag-investor-help'); if(help) help.innerHTML=investors.length?'':'No active investors are available.<br><button type="button" data-add-investor>Add Investor</button>'; }
function accountMatchesRole(a, role){ const type=investorAccountType(a); const subtype=investorAccountSubtype(a); const roleText=investorAccountRoleText(a); const text=investorAccountSearchText(a); if(!investorIsActivePostingAccount(a)) return false; if(role==='funding') return type==='ASSET'&&['BANK','CASH'].includes(subtype); if(role==='liability') return type==='LIABILITY'&&(roleText.includes('INVESTOR_BORROW')||roleText.includes('INVESTOR BORROW')||text.includes('INVESTOR BORROW')||subtype.includes('INVESTOR_BORROW')); if(role==='expense') return type==='EXPENSE'&&(roleText.includes('INVESTOR_INTEREST_EXPENSE')||roleText.includes('INVESTOR INTEREST EXPENSE')||text.includes('INVESTOR INTEREST EXPENSE')); if(role==='payable') return type==='LIABILITY'&&(roleText.includes('INVESTOR_INTEREST_PAYABLE')||roleText.includes('INVESTOR INTEREST PAYABLE')||text.includes('INVESTOR INTEREST PAYABLE')||text.includes('ACCRUED INVESTOR INTEREST')); if(role==='tax') return type==='LIABILITY'&&(roleText.includes('WITHHOLDING_TAX_PAYABLE')||roleText.includes('WITHHOLDING TAX PAYABLE')||text.includes('WITHHOLDING TAX PAYABLE')); return true; }
function agreementAccountOptions(acc, role){ const rows=acc.filter(a=>accountMatchesRole(a,role)); return '<option value="">Select account</option>'+rows.map(account=>`<option value="${escapeHtml(account.id)}">${escapeHtml(account.account_code||'')} — ${escapeHtml(account.account_name||account.name||'')}</option>`).join(''); }
function agreementForm(existing={}){
  const acc=investorFundingState.accounts;
  const modal=document.createElement('div');
  modal.className='modal-overlay historical-accounting-modal';
  const bankOpts=agreementAccountOptions(acc,'funding'), liabilityOpts=agreementAccountOptions(acc,'liability'), expenseOpts=agreementAccountOptions(acc,'expense'), payableOpts=agreementAccountOptions(acc,'payable'), taxOpts=agreementAccountOptions(acc,'tax');
  const settings=investorFundingState.settings||{}; const requiredMissing=investorRequiredSettingsMissing();
  modal.innerHTML=`<div class="modal-card wide"><div class="modal-header"><h2>${existing.id?'Edit':'Create'} Funding Agreement</h2><button class="icon-button" data-close>×</button></div><div id="agreement-msg"><div class="alert info">Loading investors...</div></div><div class="accounting-grid"><label>Investor<select id="ag-investor" disabled><option value="">Loading investors...</option></select><small id="ag-investor-help"></small></label><label>Agreement name<input id="ag-name" value="${escapeHtml(existing.agreement_name||'')}"></label><label>Agreement date<input id="ag-date" type="date" value="${escapeHtml(String(existing.agreement_date||investorToday()).slice(0,10))}"></label><label>Start date<input id="ag-start" type="date" value="${escapeHtml(String(existing.start_date||investorToday()).slice(0,10))}"></label><label>Maturity date<input id="ag-maturity" type="date" value="${escapeHtml(String(existing.maturity_date||'').slice(0,10))}"></label><label>Original expected principal<input id="ag-principal" type="number" step="0.01" value="${escapeHtml(existing.original_expected_principal||existing.original_principal||'')}"></label><label>Interest rate<input id="ag-rate" type="number" step="0.01" value="${escapeHtml(existing.interest_rate||2)}"><small id="ag-rate-display"></small></label><label>Interest rate period<select id="ag-period"><option value="MONTHLY">Monthly</option><option value="ANNUAL">Annual</option></select></label><label>Interest calculation method<select id="ag-method"><option value="MONTHLY_AVERAGE_DAILY_BALANCE">Monthly Average Daily Balance</option><option value="DAILY_BALANCE">Daily Balance</option><option value="FIXED_MONTHLY">Fixed Monthly</option></select></label><label>Interest payment frequency<select id="ag-frequency"><option>MONTHLY</option><option>QUARTERLY</option><option>AT_MATURITY</option></select></label><label>Compounding method<select id="ag-compounding"><option>NONE</option><option>CAPITALIZE_MONTHLY</option></select></label><label>Day-count basis<select id="ag-day"><option>ACTUAL_365</option><option>ACTUAL_360</option><option>30_360</option></select></label><label>Interest payment method<select id="ag-pay-method"><option>BANK_TRANSFER</option><option>CAPITALIZE</option></select></label><label>Funding bank account<select id="ag-bank">${bankOpts}</select></label><label>Investor liability account<select id="ag-liability">${liabilityOpts}</select></label><label>Investor interest expense account<select id="ag-expense">${expenseOpts}</select></label><label>Accrued interest payable account<select id="ag-payable">${payableOpts}</select></label><label>Withholding tax account<select id="ag-tax-account">${taxOpts}</select></label><label>Withholding tax rate<input id="ag-tax" type="number" step="0.01" value="${escapeHtml(existing.withholding_tax_rate||0)}"></label><label>Allow additional funding<select id="ag-add"><option value="true">Yes</option><option value="false">No</option></select></label><label>Allow partial repayment<select id="ag-partial"><option value="true">Yes</option><option value="false">No</option></select></label><label>Auto-accrual enabled<select id="ag-auto"><option value="true">Yes</option><option value="false">No</option></select></label><label>Auto-capitalize interest<select id="ag-cap"><option value="false">No</option><option value="true">Yes</option></select></label><label>Status<select id="ag-status"><option>ACTIVE</option><option>DRAFT</option><option>CLOSED</option></select></label></div><div class="modal-actions sticky-modal-footer"><button class="secondary" data-close>Cancel</button><button id="save-agreement" disabled>Save Agreement</button></div></div>`;
  document.body.appendChild(modal); modal.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal.remove());
  [['#ag-bank',existing.funding_account_id??settings.defaultFundingBankAccountId],['#ag-liability',existing.investor_liability_account_id??settings.investorBorrowingsAccountId],['#ag-expense',existing.interest_expense_account_id??settings.investorInterestExpenseAccountId],['#ag-payable',existing.accrued_interest_payable_account_id??settings.investorInterestPayableAccountId],['#ag-tax-account',existing.withholding_tax_account_id??settings.withholdingTaxAccountId],['#ag-method',existing.calculation_method??existing.interest_calculation_method??settings.calculationMethod],['#ag-period',existing.interest_rate_period??settings.interestRatePeriod],['#ag-frequency',existing.interest_payment_frequency??settings.interestPaymentFrequency],['#ag-compounding',existing.compounding_method??settings.compoundingMethod],['#ag-day',existing.day_count_basis??settings.dayCountBasis],['#ag-pay-method',existing.interest_payment_method??settings.interestPaymentMethod]].forEach(([sel,val])=>{ const el=modal.querySelector(sel); if(el&&val!=null) el.value=String(val); });
  const rate=modal.querySelector('#ag-rate'), period=modal.querySelector('#ag-period'), display=modal.querySelector('#ag-rate-display'), saveBtn=modal.querySelector('#save-agreement'), msg=modal.querySelector('#agreement-msg'), investorSelect=modal.querySelector('#ag-investor'), investorHelp=modal.querySelector('#ag-investor-help');
  let submitting=false; const sync=()=>display.textContent=investorRate(rate.value,period.value); rate.oninput=period.onchange=sync; sync();
  const fillInvestors=async()=>{ msg.innerHTML='<div class="alert info">Loading investors...</div>'; investorSelect.disabled=true; saveBtn.disabled=true; investorSelect.innerHTML='<option value="">Loading investors...</option>'; try{ const investors=await loadInvestorAgreementOptions(true); investorSelect.innerHTML=investorAgreementOptionHtml(investors); if(existing.investor_id) investorSelect.value=String(existing.investor_id); investorSelect.disabled=false; saveBtn.disabled=requiredMissing.length&&modal.querySelector('#ag-status')?.value!=='DRAFT'; msg.innerHTML=requiredMissing.length?investorConfigWarning():''; investorHelp.innerHTML=investors.length?'':'No active investors are available.<br><button type="button" data-add-investor>Add Investor</button>'; }catch(e){ investorHelp.innerHTML=''; msg.innerHTML=`<div class="alert error">Investor list could not be loaded.<br>${escapeHtml(investorApiError(e,'investor-options'))}<br><button type="button" data-retry-investors>Retry</button></div>`; } };
  msg.addEventListener('click',e=>{ if(e.target.closest('[data-retry-investors]')) fillInvestors(); }); investorHelp.addEventListener('click',e=>{ if(e.target.closest('[data-add-investor]')) openInvestorForm(); }); fillInvestors();
  const val=s=>modal.querySelector(s).value;
  function validateAgreement(payload){ if(!payload.investor_id||!Number.isInteger(payload.investor_id)) return 'Select an investor.'; if(!payload.agreement_name.trim()) return 'Agreement name is required.'; if(!payload.agreement_date) return 'Agreement date is required.'; if(!payload.start_date) return 'Start date is required.'; if(!(payload.original_principal_amount>0)) return 'Principal expectation must be greater than zero.'; if(!Number.isFinite(payload.interest_rate)||payload.interest_rate<0) return 'Interest rate must be valid.'; if(!payload.interest_rate_period) return 'Interest rate period is required.'; if(!payload.calculation_method) return 'Interest calculation method is required.'; if(payload.status!=='DRAFT'&&!payload.funding_account_id) return 'Funding account is required.'; if(payload.status!=='DRAFT'&&!payload.investor_liability_account_id) return 'Investor liability account is required.'; if(payload.status!=='DRAFT'&&!payload.interest_expense_account_id) return 'Interest expense account is required.'; if(payload.status!=='DRAFT'&&!payload.accrued_interest_payable_account_id) return 'Accrued interest payable account is required.'; if(!payload.status) return 'Status is required.'; if(payload.withholding_tax_rate>0&&!payload.withholding_tax_account_id) return 'Withholding tax payable account is required when withholding tax rate is greater than zero.'; return ''; }
  async function createInvestorAgreement(){
    if(submitting) return; const selectedInvestorId=investorSelect.value;
    const payload={investor_id:Number(selectedInvestorId),agreement_name:val('#ag-name').trim(),agreement_date:val('#ag-date'),start_date:val('#ag-start'),maturity_date:val('#ag-maturity')||null,original_principal_amount:Number(val('#ag-principal')||0),interest_rate:Number(rate.value||0),interest_rate_period:period.value,calculation_method:val('#ag-method'),interest_payment_frequency:val('#ag-frequency'),compounding_method:val('#ag-compounding'),day_count_basis:val('#ag-day'),interest_payment_method:val('#ag-pay-method'),funding_account_id:Number(val('#ag-bank')),investor_liability_account_id:Number(val('#ag-liability')),interest_expense_account_id:Number(val('#ag-expense')),accrued_interest_payable_account_id:Number(val('#ag-payable')),withholding_tax_account_id:val('#ag-tax-account')?Number(val('#ag-tax-account')):null,withholding_tax_rate:Number(val('#ag-tax')||0),allow_additional_funding:val('#ag-add')==='true',allow_partial_withdrawal:val('#ag-partial')==='true',auto_accrual_enabled:val('#ag-auto')==='true',auto_capitalize_interest:val('#ag-cap')==='true',status:val('#ag-status')};
    const validation=validateAgreement(payload); if(validation){ msg.innerHTML=`<div class="alert error">${escapeHtml(validation)}</div>`; return; }
    const capitalizationWarning=payload.compounding_method==='CAPITALIZE_MONTHLY'&&payload.auto_capitalize_interest?'<div class="alert warning">Monthly capitalization will add accrued interest to investor principal and increase future interest.</div>':'';
    try{ submitting=true; saveBtn.disabled=true; msg.innerHTML=capitalizationWarning; console.log('Create investor agreement request',{path:'/admin/investor-agreements',investorId:selectedInvestorId,payloadKeys:Object.keys(payload)}); const response=(await api(existing.id?`${investorFundingRoutes.agreements}/${encodeURIComponent(existing.id)}`:'/admin/investor-agreements',{method:existing.id?'PATCH':'POST',body:payload}))||{}; console.log('Create investor agreement response',response); const agreementId=response.id??response.agreement_id; const success=`<div class="alert success"><strong>Funding agreement created successfully.</strong><br>Agreement number: ${escapeHtml(response.agreement_number||agreementId||'—')}<br>Investor: ${escapeHtml(response.investor_name||investorSelect.options[investorSelect.selectedIndex]?.textContent||'—')}<br>Interest rate: ${escapeHtml(investorRate(response.interest_rate??payload.interest_rate,response.interest_rate_period??payload.interest_rate_period))}<br>Start date: ${escapeHtml(response.start_date||payload.start_date)}<br>Status: ${escapeHtml(response.status||payload.status)}<br><button data-record-funding="${escapeHtml(agreementId||'')}">Record Investor Funding</button></div>`; modal.remove(); await loadAgreementsPage(); const root=document.querySelector('#investor-funding-agreements-root'); if(root) root.insertAdjacentHTML('afterbegin',success); }catch(e){ msg.innerHTML=`<div class="alert error">${escapeHtml(investorApiError(e,'agreement-create'))}</div>`; }finally{ submitting=false; if(document.body.contains(modal)) saveBtn.disabled=false; }
  }
  saveBtn.addEventListener('click',createInvestorAgreement);
}
function normalizeAgreementList(raw) { const source = raw?.data ?? raw ?? {}; const rows = Array.isArray(source) ? source : (source.items ?? source.agreements ?? source.data?.items ?? source.data?.agreements ?? []); return Array.isArray(rows) ? rows : []; }
function normalizeFundingAgreement(item = {}) { const missingRaw = item.missing_periods ?? item.missing_accrual_periods ?? item.accrual_missing_periods ?? 0; const missingPeriods = Array.isArray(missingRaw) ? missingRaw.length : safeNumber(missingRaw, 0); const currentPrincipal = safeNumber(item.current_principal_balance ?? item.principal_balance ?? item.current_principal ?? 0); const postedPrincipal = safeNumber(item.posted_principal ?? item.posted_principal_balance ?? item.total_posted_funding ?? item.funded_amount ?? currentPrincipal, 0); return { id: Number(item.id ?? item.agreement_id), agreementNumber: item.agreement_number ?? '—', agreementName: item.agreement_name ?? '—', investorId: Number(item.investor_id ?? item.investor?.id), investorName: item.investor_name ?? item.investor?.display_name ?? item.investor?.full_name ?? item.investor?.company_name ?? '—', investorNumber: item.investor_number ?? item.investor?.investor_number ?? '', startDate: item.start_date ?? item.agreement_date ?? null, maturityDate: item.maturity_date ?? null, originalPrincipal: safeNumber(item.original_principal_amount ?? item.original_expected_principal ?? 0), currentPrincipal, postedPrincipal, hasPostedFunding: (item.has_posted_funding ?? item.has_funding_transaction ?? item.has_posted_principal) ?? postedPrincipal > 0, interestRate: safeNumber(item.interest_rate ?? 0), ratePeriod: String(item.interest_rate_period ?? '').trim().toUpperCase(), calculationMethod: String(item.calculation_method ?? '').trim().toUpperCase(), accruedInterest: safeNumber(item.accrued_interest ?? item.accrued_interest_balance ?? item.accrued_unpaid_interest ?? 0), lastAccruedThrough: item.last_accrued_through ?? item.last_accrued_date ?? null, nextAccrualDate: item.next_accrual_date ?? null, missingPeriods, accrualStatus: item.accrual_status ?? item.interest_accrual_status ?? '', status: String(item.status ?? 'DRAFT').trim().toUpperCase(), raw: item }; }
function agreementDate(value, emptyLabel = '—') { if (!value) return emptyLabel; const parts = String(value).slice(0, 10).split('-').map(Number); if (parts.length !== 3 || parts.some(part => !Number.isFinite(part))) return escapeInvestorHtml(String(value)); const date = new Date(parts[0], parts[1] - 1, parts[2]); return date.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }).replace(',', ''); }
function agreementMethodLabel(value) { const text = String(value || '').trim(); if (!text) return '—'; return text.toLowerCase().split('_').filter(Boolean).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' '); }
function agreementRatePeriodLabel(value) { const period = String(value || '').trim().toUpperCase(); if (period === 'MONTHLY') return 'MONTHLY'; if (period === 'ANNUAL') return 'ANNUAL'; return period || '—'; }
function investorCatchUpError(e){ if(e?.status===401) return 'Your session has expired.'; if(e?.status===422) return e.message || 'Historical interest contains validation or accounting-period errors.'; if(e?.status===500) return 'Historical interest could not be calculated.'; return e?.message || 'Historical interest could not be calculated.'; }
function agreementAccrualStatusLabel(a){ const raw=String(a.accrualStatus||'').trim(); if(raw) return raw.toLowerCase().split(/[_ -]+/).filter(Boolean).map(w=>w.charAt(0).toUpperCase()+w.slice(1)).join(' '); if(!a.hasPostedFunding) return 'No Funding Yet'; if(a.missingPeriods>0) return 'Catch-up Required'; return 'Up to Date'; }
function agreementAccrualStatusClass(label){ const v=String(label||'').toLowerCase(); if(v.includes('up to date')) return 'status-active'; if(v.includes('no funding')) return 'status-inactive'; if(v.includes('locked')||v.includes('catch')) return 'status-warning'; if(v.includes('error')||v.includes('fail')) return 'status-danger'; return 'status-warning'; }
function catchUpItems(d){ return investorItems(d.periods || d.missing_periods || d.preview_periods || d.accruals || d.rows || d); }
function catchUpVal(o, keys, fallback='—'){ for(const k of keys){ if(o?.[k]!==undefined&&o?.[k]!==null&&o?.[k]!=='') return o[k]; } return fallback; }
function renderCatchUpPreview(d){ const periods=catchUpItems(d); const locked=periods.filter(p=>String(catchUpVal(p,['accounting_period_status','period_status','status'],'')).toLowerCase().includes('locked')); const fallbackTotal=periods.reduce((sum,p)=>sum+safeNumber(catchUpVal(p,['interest','gross_interest','interest_amount'],0),0),0); const total=safeNumber(d.total_interest ?? d.total_interest_to_post ?? d.total_gross_interest ?? fallbackTotal, 0); const skipped=investorItems(d.skipped_periods); const currentNote=d.current_month_included===false||d.incomplete_current_month ? `<div class="alert info">The current month is not included in automatic catch-up.<br>Next scheduled accrual:<br>${agreementDate(d.next_scheduled_accrual ?? d.next_accrual_date, '—')}</div>` : ''; const noFunding=d.has_posted_funding===false||d.no_funding===true ? '<div class="alert info"><strong>No investor funding has been posted.</strong><br>Interest will begin from the effective date of the first posted funding transaction.</div>' : ''; return `${noFunding}${currentNote}${locked.length?`<div class="alert warning">${locked.map(p=>`${escapeInvestorHtml(catchUpVal(p,['period_label','period','month'],'Period'))} — Accounting period locked`).join('<br>')}</div>`:''}<div class="subcard"><h3>Historical Interest Catch-up</h3><div class="accounting-grid">${[['Actual funding start',agreementDate(d.actual_funding_start ?? d.funding_start_date ?? d.first_funding_date)],['Accrue through',agreementDate(d.accrue_through ?? d.accrued_through_date ?? d.as_of_date)],['Missing periods',d.missing_periods_count ?? d.missing_periods ?? periods.length],['Total interest to be posted',investorMoney(total)]].map(([l,v])=>`<div class="metric"><div class="metric-label">${escapeInvestorHtml(l)}</div><div>${escapeInvestorHtml(String(v??'—'))}</div></div>`).join('')}</div><div class="table-scroll"><table><thead><tr>${['Period','Days','Average Daily Balance','Rate','Interest','Accounting Period Status','Journal Preview'].map(h=>`<th>${escapeInvestorHtml(h)}</th>`).join('')}</tr></thead><tbody>${periods.map(p=>`<tr><td>${escapeInvestorHtml(catchUpVal(p,['period_label','period','month']))}</td><td>${escapeInvestorHtml(catchUpVal(p,['days','number_of_days']))}</td><td>${investorMoney(catchUpVal(p,['average_daily_balance','avg_daily_balance'],0))}</td><td>${escapeInvestorHtml(catchUpVal(p,['rate_label','interest_rate'],''))}</td><td>${investorMoney(catchUpVal(p,['interest','gross_interest','interest_amount'],0))}</td><td>${escapeInvestorHtml(catchUpVal(p,['accounting_period_status','period_status','status']))}</td><td>${escapeInvestorHtml(agreementDate(catchUpVal(p,['journal_date','period_end','period_end_date'],''),'—'))}<br>Dr Investor Interest Expense<br>Cr Accrued Investor Interest Payable</td></tr>`).join('')||'<tr><td colspan="7">No missing periods returned.</td></tr>'}</tbody></table></div>${skipped.length?`<p><strong>Skipped periods:</strong> ${escapeInvestorHtml(skipped.map(x=>catchUpVal(x,['period_label','period','reason'],x)).join(', '))}</p>`:''}</div>`; }
async function refreshInvestorFundingAfterCatchUp(agreementId){ await loadAgreementsPage(); const balancesRoot=document.querySelector('#investor-funding-balances-root'); const reconciliationRoot=document.querySelector('#investor-funding-reconciliation-root'); if(balancesRoot&&balancesRoot.innerHTML.trim()) await loadBalancesPage(); if(reconciliationRoot&&reconciliationRoot.innerHTML.trim()) await loadReconciliationPage(); }
async function openInterestCatchUpPreview(agreementId){ const a=investorFundingState.agreements.find(x=>String(x.id)===String(agreementId))||{}; const modal=document.createElement('div'); modal.className='modal-overlay historical-accounting-modal'; modal.innerHTML=`<div class="modal-card wide"><div class="modal-header"><h2>Historical Interest Catch-up</h2><button class="icon-button" data-close>×</button></div><div id="catchup-msg"></div><div id="catchup-preview" class="subcard">Loading historical interest preview...</div><div class="modal-actions sticky-modal-footer"><button class="secondary" data-close>Cancel</button><button id="confirm-catchup" disabled>Post Historical Interest</button></div></div>`; document.body.appendChild(modal); modal.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal.remove()); const msg=modal.querySelector('#catchup-msg'), box=modal.querySelector('#catchup-preview'), btn=modal.querySelector('#confirm-catchup'); if(a.hasPostedFunding===false){ box.innerHTML='<div class="alert info"><strong>No investor funding has been posted.</strong><br>Interest will begin from the effective date of the first posted funding transaction.</div>'; return; } try{ const preview=await api(`/admin/investor-agreements/${encodeURIComponent(agreementId)}/interest-catch-up/preview`,{method:'POST',body:{as_of_date:investorToday()}}); box.innerHTML=renderCatchUpPreview(preview||{}); btn.disabled=false; btn.onclick=async()=>{ if(btn.disabled) return; btn.disabled=true; msg.innerHTML=''; try{ const res=await api(`/admin/investor-agreements/${encodeURIComponent(agreementId)}/interest-catch-up`,{method:'POST',body:{as_of_date:investorToday(),preview_only:false}}); const journals=investorItems(res.journal_numbers ?? res.journals ?? res.journal_entries).map(j=>j.journal_number??j.number??j).join(', ') || '—'; msg.innerHTML=`<div class="alert success"><strong>Historical interest posted successfully.</strong><br>Periods posted: ${escapeInvestorHtml(res.periods_posted ?? res.posted_periods ?? res.processed_periods ?? '—')}<br>Total interest: ${investorMoney(res.total_interest ?? res.total_interest_posted ?? 0)}<br>Accrued through date: ${agreementDate(res.accrued_through_date ?? res.accrue_through ?? res.last_accrued_through)}<br>Journal numbers: ${escapeInvestorHtml(journals)}<br>Skipped periods: ${escapeInvestorHtml((investorItems(res.skipped_periods).map(x=>x.period_label??x.period??x).join(', ')) || 'None')}<br>Failed periods: ${escapeInvestorHtml((investorItems(res.failed_periods).map(x=>x.period_label??x.period??x).join(', ')) || 'None')}</div>`; await refreshInvestorFundingAfterCatchUp(agreementId); }catch(e){ msg.innerHTML=`<div class="alert error">${escapeInvestorHtml(investorCatchUpError(e))}</div>`; btn.disabled=false; } }; }catch(e){ box.innerHTML=`<div class="alert error">${escapeInvestorHtml(investorCatchUpError(e))}</div>`; } }

function renderAgreementSummary(agreements) { const rows = Array.isArray(agreements) ? agreements : []; const cards = [['Total Agreements', rows.length, 'All funding agreements', '📄'], ['Active Agreements', rows.filter(a => a.status === 'ACTIVE').length, 'Currently active agreements', '✅'], ['Original Principal', formatLkr(rows.reduce((sum, a) => sum + safeNumber(a.originalPrincipal), 0)), 'Total committed principal', '₨'], ['Current Principal', formatLkr(rows.reduce((sum, a) => sum + safeNumber(a.currentPrincipal), 0)), 'Outstanding principal balance', '₨'], ['Accrued Interest', formatLkr(rows.reduce((sum, a) => sum + safeNumber(a.accruedInterest), 0)), 'Interest accrued to date', '%']]; return `<div class="investor-kpi-grid">${cards.map(([label,value,helper,icon])=>`<article class="investor-kpi-card"><div class="investor-kpi-icon" aria-hidden="true">${escapeInvestorHtml(icon)}</div><div><div class="metric-label">${escapeInvestorHtml(label)}</div><div class="metric-value">${escapeInvestorHtml(value)}</div><p>${escapeInvestorHtml(helper)}</p></div></article>`).join('')}</div>`; }
function renderAgreementTable(rows, selectedStatus = '') { const visible = selectedStatus ? rows.filter(agreement => agreement.status === selectedStatus) : rows; if (!visible.length) return `<div class="empty-state investor-empty"><h3>No Funding Agreements</h3><p>Create a funding agreement to begin recording investor principal and interest.</p><button type="button" class="investor-primary-action" data-add-agreement>Create Agreement</button></div>`; const disabled=investorRequiredSettingsMissing().length||investorFundingState.settingsError?' disabled title="Investor funding accounting configuration is incomplete."':''; return `<section class="investor-table-card"><div class="table-scroll collection-responsive-table investor-table"><table class="data-table"><thead><tr>${['Agreement Number','Investor','Start Date','Maturity Date','Original Principal','Current Principal','Interest Rate','Rate Period','Calculation Method','Accrued Interest','Last Accrued Through','Next Accrual Date','Missing Periods','Accrual Status','Status','Actions'].map(h=>`<th>${escapeInvestorHtml(h)}</th>`).join('')}</tr></thead><tbody>${visible.map(a=>{ const accrualLabel=agreementAccrualStatusLabel(a); const catchUp=a.hasPostedFunding!==false&&a.missingPeriods>0&&Number.isFinite(a.id)?` <button type="button" class="btn-small" data-interest-catch-up="${escapeInvestorHtml(a.id)}"${disabled}>Calculate Historical Interest</button>`:''; const noFunding=a.hasPostedFunding===false?'<div class="muted">No investor funding has been posted.<br>Interest will begin from the effective date of the first posted funding transaction.</div>':''; return `<tr><td data-label="Agreement Number"><strong>${escapeInvestorHtml(a.agreementNumber)}</strong></td><td data-label="Investor">${escapeInvestorHtml([a.investorNumber, a.investorName].filter(Boolean).join(' — '))}</td><td data-label="Start Date">${agreementDate(a.startDate)}</td><td data-label="Maturity Date">${agreementDate(a.maturityDate, 'No fixed maturity')}</td><td data-label="Original Principal" class="money-cell">${formatLkr(a.originalPrincipal)}</td><td data-label="Current Principal" class="money-cell investor-money-emphasis">${formatLkr(a.currentPrincipal)}</td><td data-label="Interest Rate">${escapeInvestorHtml(investorRate(a.interestRate, a.ratePeriod || 'MONTHLY'))}</td><td data-label="Rate Period">${escapeInvestorHtml(agreementRatePeriodLabel(a.ratePeriod))}</td><td data-label="Calculation Method">${escapeInvestorHtml(agreementMethodLabel(a.calculationMethod))}</td><td data-label="Accrued Interest" class="money-cell">${formatLkr(a.accruedInterest)}</td><td data-label="Last Accrued Through">${agreementDate(a.lastAccruedThrough)}</td><td data-label="Next Accrual Date">${agreementDate(a.nextAccrualDate)}</td><td data-label="Missing Periods" class="number-cell">${escapeInvestorHtml(a.missingPeriods)}</td><td data-label="Accrual Status"><span class="status-badge ${agreementAccrualStatusClass(accrualLabel)}">${escapeInvestorHtml(accrualLabel)}</span>${noFunding}</td><td data-label="Status"><span class="status-badge ${a.status === 'ACTIVE' ? 'status-active' : a.status === 'CLOSED' ? 'status-inactive' : 'status-warning'}">${escapeInvestorHtml(a.status)}</span></td><td data-label="Actions"><div class="table-actions investor-row-actions"><button type="button" class="btn-small" data-agreement-detail="${escapeInvestorHtml(a.id)}" ${Number.isFinite(a.id)?'':'disabled'}>View</button> <button type="button" class="btn-small" data-agreement-edit="${escapeInvestorHtml(a.id)}" ${Number.isFinite(a.id)?'':'disabled'}>Edit</button> <button type="button" class="btn-small" data-record-funding="${escapeInvestorHtml(a.id)}"${disabled} ${Number.isFinite(a.id)?'':'disabled'}>Record Funding</button> <button type="button" class="btn-small" data-accrue-interest="${escapeInvestorHtml(a.id)}"${disabled} ${Number.isFinite(a.id)?'':'disabled'}>Accrue Interest</button>${catchUp} <button type="button" class="btn-small" data-close-agreement="${escapeInvestorHtml(a.id)}" ${Number.isFinite(a.id)?'':'disabled'}>Close Agreement</button></div></td></tr>`; }).join('')}</tbody></table></div></section>`; }
function renderAgreementListBody(root, agreements, filters = { status: '' }) { const statuses = [...new Set(agreements.map(a => a.status).filter(Boolean))]; root.querySelector('#agreement-page-body').innerHTML = `${renderAgreementSummary(agreements)}${investorConfigWarning()}<section class="filter-bar accounting-filters investor-filters"><label><span class="sr-only">Agreement status</span><select id="agreement-status-filter"><option value="">All statuses</option>${statuses.map(status=>`<option value="${escapeInvestorHtml(status)}" ${filters.status===status?'selected':''}>${escapeInvestorHtml(status)}</option>`).join('')}</select></label><button type="button" class="secondary investor-refresh-button" data-refresh-agreements>Refresh</button></section><div id="agreement-list-content">${renderAgreementTable(agreements, filters.status)}</div>`; root.querySelector('#agreement-status-filter')?.addEventListener('input',()=>renderAgreementListBody(root, agreements, { status: root.querySelector('#agreement-status-filter')?.value || '' })); }
function agreementPageShell(root) { if (root?.id !== 'investor-funding-agreements-root') { console.error('Refusing to render Funding Agreements into an unsafe root', root); return null; } root.replaceChildren(); root.innerHTML = '<section class="page-card investor-page agreements-dashboard-v2"><header class="investor-hero"><div><div class="eyebrow">INVESTOR FUNDING</div><h1>Funding Agreements</h1><p class="muted">Create and manage investor funding agreements.</p></div><button type="button" class="investor-primary-action" data-add-agreement>Create Agreement</button></header><div id="agreement-message"></div><div id="agreement-page-body"><p class="investor-loading">Loading funding agreements...</p></div></section>'; return root.querySelector('#agreement-page-body'); }
async function loadAgreementsPage(){ const root=document.querySelector('#investor-funding-agreements-root'); if(!root)return; agreementPageShell(root); try{ const [accounts] = await Promise.allSettled([api('/admin/accounting/accounts'), loadInvestorFundingSettings()]); investorFundingState.accounts=investorItems(accounts.value); const response=await api('/admin/investor-agreements',{ method:'GET' }); console.log('Funding agreements raw response', response); const agreements=normalizeAgreementList(response).map(normalizeFundingAgreement); console.log('Normalized funding agreements', agreements); investorFundingState.agreements=agreements; renderAgreementListBody(root, agreements, { status: root.querySelector('#agreement-status-filter')?.value || '' }); }catch(e){ const body=root.querySelector('#agreement-page-body') || agreementPageShell(root); if(body) body.innerHTML=`<div class="alert error"><strong>Funding agreements could not be loaded.</strong><br><button type="button" data-refresh-agreements>Retry</button></div>`; } }
function investorFundingOptionsError(e){ if(e?.status===401) return 'Your session has expired. Please sign in again.'; if(e?.status===404) return 'Investor or agreement options endpoint was not found.'; if(e?.status===422) return e.message||'Investor funding options contain validation errors.'; if(e?.name==='AbortError') return 'Investor funding options could not be loaded.'; return e?.message&&String(e.message).trim()?e.message:'Investor funding options could not be loaded.'; }
function normalizeRecordInvestorOptions(response){ const investorRows=Array.isArray(response)?response:(response?.items??response?.investors??[]); return investorRows.map(item=>({id:Number(item.id??item.investor_id),investorNumber:item.investor_number??'',displayName:item.display_name??item.full_name??item.company_name??item.investor_number??'Investor',status:String(item.status??'').trim().toUpperCase()})).filter(item=>Number.isInteger(item.id)&&item.status==='ACTIVE'); }
function normalizeRecordAgreementOptions(response){ const agreementRows=Array.isArray(response)?response:(response?.items??response?.agreements??[]); return agreementRows.map(item=>({id:Number(item.id??item.agreement_id),investorId:Number(item.investor_id??item.investor?.id),agreementNumber:item.agreement_number??'',agreementName:item.agreement_name??'',status:String(item.status??'').trim().toUpperCase(),currentPrincipal:Number(item.current_principal_balance??item.current_principal??0),allowAdditionalFunding:item.allow_additional_funding!==false,fundingAccountId:item.funding_account_id??item.bank_account_id??item.funding_bank_account_id??null,liabilityAccountId:item.investor_liability_account_id??item.liability_account_id??null})).filter(item=>Number.isInteger(item.id)&&item.status==='ACTIVE').filter(item=>item.currentPrincipal<=0||item.allowAdditionalFunding); }
function recordFundingInvestorOptionsHtml(investors, placeholder='Select investor'){ return `<option value="">${escapeHtml(placeholder)}</option>`+investors.map(i=>`<option value="${escapeHtml(i.id)}">${escapeHtml([i.investorNumber,i.displayName].filter(Boolean).join(' — '))}</option>`).join(''); }
function recordFundingAgreementOptionsHtml(agreements, placeholder='Select agreement'){ return `<option value="">${escapeHtml(placeholder)}</option>`+agreements.map(a=>`<option value="${escapeHtml(a.id)}">${escapeHtml([a.agreementNumber,a.agreementName].filter(Boolean).join(' — ')||a.id)}</option>`).join(''); }
async function loadRecordFundingPage(){ const root=document.querySelector('#investor-funding-record-root'); if(!root)return; root.innerHTML='<h2>Record Investor Funding</h2><p>Loading Investor Funding configuration...</p>'; try{ await investorBootstrap(); const bankOpts=investorOptions(investorFundingState.accounts.filter(investorIsBank), investorAccountLabel); const disabled=investorRequiredSettingsMissing().length||investorFundingState.settingsError?' disabled':''; root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Investor Funding</div><h2>Record Investor Funding</h2></div></div>${investorConfigWarning()}<div id="funding-msg"></div><div class="accounting-grid"><label>Investor<select id="fund-investor" disabled><option value="">Loading investors...</option></select></label><label>Agreement<select id="fund-agreement" disabled><option value="">Select investor first</option></select></label><label>Transaction date<input id="fund-date" type="date" value="${investorToday()}"></label><label>Amount<input id="fund-amount" type="number" step="0.01" min="0" value="1000000"></label><label>Receiving bank account<select id="fund-bank">${bankOpts}</select></label><label>Reference<input id="fund-reference"></label><label>Remarks<textarea id="fund-remarks"></textarea></label></div><div id="historical-funding-panel"></div><div id="funding-preview" class="subcard"></div><div id="funding-result"></div><div class="modal-actions sticky-modal-footer"><button id="preview-funding" class="secondary">Preview</button><button id="confirm-funding"${disabled}>Confirm Funding</button><button class="secondary" data-section-link="investor-funding-agreements">Cancel</button></div>`; if(investorFundingState.settings.defaultFundingBankAccountId) root.querySelector('#fund-bank').value=String(investorFundingState.settings.defaultFundingBankAccountId); wireFundingForm(root, Boolean(disabled)); }catch(e){root.innerHTML=`<div class="alert error">${escapeHtml(investorApiError(e))}</div>`;} }
function wireFundingForm(root, configDisabled=false){ const investorSelect=root.querySelector('#fund-investor'), agreementSelect=root.querySelector('#fund-agreement'), confirmBtn=root.querySelector('#confirm-funding'), msg=root.querySelector('#funding-msg'), preview=root.querySelector('#funding-preview'), hist=root.querySelector('#historical-funding-panel'); let agreements=[], agreementAbort=null, selectedAgreement=null; const validId=v=>String(v||'').trim()!==''&&Number.isInteger(Number(v)); const setConfirm=()=>{ confirmBtn.disabled=configDisabled||!validId(investorSelect.value)||!validId(agreementSelect.value); }; const accountLabel=id=>{ const a=investorFundingState.accounts.find(x=>String(x.id)===String(id)); return a?investorAccountLabel(a):''; }; const showError=t=>{ msg.innerHTML=`<div class="alert error">${escapeHtml(t)}</div>`; };
  const validate=()=>{ if(!validId(investorSelect.value)){ showError('Select an investor.'); return false; } if(!validId(agreementSelect.value)){ showError('Select a funding agreement.'); return false; } if(!root.querySelector('#fund-date').value){ showError('Select a valid transaction date.'); return false; } if(!(Number(root.querySelector('#fund-amount').value||0)>0)){ showError('Enter a funding amount greater than zero.'); return false; } if(!validId(root.querySelector('#fund-bank').value)){ showError('Select a receiving bank account.'); return false; } msg.innerHTML=''; return true; };
  const render=()=>{ const amount=Number(root.querySelector('#fund-amount').value||0); const date=root.querySelector('#fund-date').value; if(isHistoricalDate(date)){ const today=investorToday(); const months=Math.max(0,(new Date(today).getFullYear()-new Date(date).getFullYear())*12+new Date(today).getMonth()-new Date(date).getMonth()); hist.innerHTML=`<div class="alert warning"><strong>Historical investor funding</strong><br>Transaction date: ${escapeHtml(date)}<br>Current date: ${escapeHtml(today)}<br>Completed months: ${months}<br>Estimated historical accrual periods: ${months}<br>Accounting-period status: verify open period.<br>Historical month-end interest journals may be created for completed periods.</div>`; } else hist.innerHTML=''; const bank=root.querySelector('#fund-bank option:checked')?.textContent||accountLabel(selectedAgreement?.fundingAccountId)||'1010 Main Bank Account'; const liability=accountLabel(selectedAgreement?.liabilityAccountId)||'2300 Investor Borrowings'; preview.innerHTML=`<h3>Accounting preview</h3><div class="accounting-grid"><p><strong>Debit</strong><br>${escapeHtml(bank)}<br>${investorMoney(amount)}</p><p><strong>Credit</strong><br>${escapeHtml(liability)}<br>${investorMoney(amount)}</p></div><p>Dr ${escapeHtml(bank)}<br>Cr ${escapeHtml(liability)}</p>`; };
  const loadAgreements=async()=>{ const selectedInvestorId=investorSelect.value; agreementAbort?.abort(); selectedAgreement=null; agreements=[]; agreementSelect.disabled=true; agreementSelect.innerHTML='<option value="">Loading agreements...</option>'; msg.innerHTML=''; setConfirm(); if(!validId(selectedInvestorId)){ agreementSelect.innerHTML='<option value="">Select investor first</option>'; render(); return; } const controller=new AbortController(); agreementAbort=controller; try{ const response=await api(`/admin/investor-agreements/options?investor_id=${encodeURIComponent(selectedInvestorId)}`,{signal:controller.signal}); console.log('Agreement options response', response); if(controller.signal.aborted) return; agreements=normalizeRecordAgreementOptions(response).filter(a=>!Number.isInteger(a.investorId)||a.investorId===Number(selectedInvestorId)); agreementSelect.innerHTML=recordFundingAgreementOptionsHtml(agreements); agreementSelect.disabled=false; if(agreements.length===1){ agreementSelect.value=String(agreements[0].id); selectedAgreement=agreements[0]; if(selectedAgreement.fundingAccountId) root.querySelector('#fund-bank').value=String(selectedAgreement.fundingAccountId); } render(); setConfirm(); }catch(e){ if(e?.name==='AbortError') return; agreementSelect.innerHTML='<option value="">Agreement list could not be loaded.</option>'; showError(`Agreement list could not be loaded. ${investorFundingOptionsError(e)}`); setConfirm(); } };
  investorSelect.addEventListener('change',()=>{ agreementSelect.value=''; selectedAgreement=null; msg.innerHTML=''; root.querySelector('#funding-result').innerHTML=''; loadAgreements(); }); agreementSelect.addEventListener('change',()=>{ selectedAgreement=agreements.find(a=>String(a.id)===String(agreementSelect.value))||null; console.log('Selected investor/agreement',{investorId:investorSelect.value,agreementId:agreementSelect.value}); if(selectedAgreement?.fundingAccountId) root.querySelector('#fund-bank').value=String(selectedAgreement.fundingAccountId); render(); setConfirm(); }); ['#fund-date','#fund-amount','#fund-bank','#fund-reference','#fund-remarks'].forEach(s=>root.querySelector(s)?.addEventListener('input',render)); root.querySelector('#preview-funding').onclick=()=>{ if(validate()) render(); }; confirmBtn.onclick=async()=>{ if(!validate()) return; const selectedInvestorId=investorSelect.value, selectedAgreementId=agreementSelect.value; console.log('Selected investor/agreement',{investorId:selectedInvestorId,agreementId:selectedAgreementId}); const payload={investor_id:Number(selectedInvestorId),transaction_date:root.querySelector('#fund-date').value,amount:Number(root.querySelector('#fund-amount').value||0),bank_account_id:Number(root.querySelector('#fund-bank').value),reference:root.querySelector('#fund-reference').value,remarks:root.querySelector('#fund-remarks').value}; try{ confirmBtn.disabled=true; const res=await api(`/admin/investor-agreements/${encodeURIComponent(selectedAgreementId)}/funding`,{method:'POST',body:payload}); root.querySelector('#funding-result').innerHTML=`<div class="alert success"><strong>Investor funding recorded successfully.</strong><br>Transaction number: ${escapeHtml(res.transaction_number||res.id||'—')}<br>Investor: ${escapeHtml(res.investor_name||investorSelect.options[investorSelect.selectedIndex]?.textContent||'—')}<br>Agreement: ${escapeHtml(res.agreement_number||agreementSelect.options[agreementSelect.selectedIndex]?.textContent||'—')}<br>Amount: ${investorMoney(res.amount||payload.amount)}<br>Bank account: ${escapeHtml(res.bank_account_name||root.querySelector('#fund-bank option:checked')?.textContent||'—')}<br>Journal number: ${escapeHtml(res.journal_number||'—')}<br>New principal balance: ${investorMoney(res.new_principal_balance)}</div>`; }catch(e){ showError(investorApiError(e)); } finally{ setConfirm(); } };
  const loadInvestors=async()=>{ investorSelect.disabled=true; investorSelect.innerHTML='<option value="">Loading investors...</option>'; agreementSelect.disabled=true; agreementSelect.innerHTML='<option value="">Select investor first</option>'; setConfirm(); try{ const response=await api('/admin/investors/options'); console.log('Investor options response', response); const investors=normalizeRecordInvestorOptions(response); investorSelect.innerHTML=recordFundingInvestorOptionsHtml(investors); investorSelect.disabled=false; if(investors.length===1){ investorSelect.value=String(investors[0].id); await loadAgreements(); } setConfirm(); }catch(e){ investorSelect.innerHTML='<option value="">Investor list could not be loaded.</option>'; msg.innerHTML=`<div class="alert error">Investor list could not be loaded. ${escapeHtml(investorFundingOptionsError(e))}<br><button type="button" data-retry-funding-investors>Retry</button></div>`; } render(); };
  msg.addEventListener('click',e=>{ if(e.target.closest('[data-retry-funding-investors]')) loadInvestors(); }); render(); loadInvestors(); }
function openRepaymentForm(agreementId){ const a=investorFundingState.agreements.find(x=>String(x.id)===String(agreementId))||{}; const principal=Number(investorField(a,'current_principal','principal_balance')||0); const modal=document.createElement('div'); modal.className='modal-overlay historical-accounting-modal'; modal.innerHTML=`<div class="modal-card wide"><div class="modal-header"><h2>Repay Investor Principal</h2><button class="icon-button" data-close>×</button></div><div id="repay-msg"></div><div class="accounting-grid"><label>Repayment date<input id="rp-date" type="date" value="${investorToday()}"></label><label>Amount<input id="rp-amount" type="number" step="0.01" max="${principal}"></label><label>Bank account<select id="rp-bank">${investorOptions(investorFundingState.accounts.filter(investorIsBank), investorAccountLabel)}</select></label><label>Reference<input id="rp-ref"></label><label>Remarks<textarea id="rp-remarks"></textarea></label></div><div id="rp-preview" class="subcard"></div><div class="modal-actions sticky-modal-footer"><button class="secondary" data-close>Cancel</button><button id="rp-save">Confirm Repayment</button></div></div>`; document.body.appendChild(modal); modal.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal.remove()); const render=()=>{ const amt=Number(modal.querySelector('#rp-amount').value||0); modal.querySelector('#rp-save').disabled=amt>principal; modal.querySelector('#rp-preview').innerHTML=`<p>Principal before: <strong>${investorMoney(principal)}</strong> · after: <strong>${investorMoney(principal-amt)}</strong></p><p>Dr Investor Borrowings ${investorMoney(amt)}<br>Cr Main Bank Account ${investorMoney(amt)}</p>${amt>principal?'<div class="alert error">Amount exceeds available principal.</div>':''}`;}; modal.querySelector('#rp-amount').oninput=render; render(); modal.querySelector('#rp-save').onclick=async()=>{ try{ await api(`${investorFundingRoutes.transactions}/repayments`,{method:'POST',body:{agreement_id:agreementId,repayment_date:modal.querySelector('#rp-date').value,amount:Number(modal.querySelector('#rp-amount').value||0),bank_account_id:modal.querySelector('#rp-bank').value,reference:modal.querySelector('#rp-ref').value,remarks:modal.querySelector('#rp-remarks').value}}); modal.remove(); loadAgreementsPage(); }catch(e){ modal.querySelector('#repay-msg').innerHTML=`<div class="alert error">${escapeHtml(investorApiError(e))}</div>`; } }; }
async function loadAgreementDetail(agreementId){ showAdminSection('investor-funding-agreement-detail'); const root=document.querySelector('#investor-funding-agreement-detail-root'); if(!root)return; root.innerHTML='<h2>Agreement Detail</h2><p>Loading...</p>'; try{ const d=await api(`${investorFundingRoutes.agreements}/${encodeURIComponent(agreementId)}`); const tx=investorItems(d.principal_transactions||d.transactions); const cards=[['Original Principal',investorMoney(d.original_principal)],['Current Principal',investorMoney(d.current_principal)],['Interest Rate',investorRate(d.interest_rate,d.interest_rate_period)],['Calculation Method',d.interest_calculation_method],['Accrued Unpaid Interest',investorMoney(d.accrued_unpaid_interest)],['Interest Paid',investorMoney(d.interest_paid)],['Capitalized Interest',investorMoney(d.capitalized_interest)],['Start Date',investorDate(d.start_date)],['Maturity Date',investorDate(d.maturity_date)],['Last Accrued Through',investorDate(d.last_accrued_through)],['Next Accrual Date',investorDate(d.next_accrual_date)],['Status',d.status],['Reconciliation Status',d.reconciliation_status||'Needs Review']]; root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Investor Funding</div><h2>${escapeHtml(d.agreement_number||agreementId)}</h2></div><button data-section-link="investor-funding-agreements">Back</button></div><div class="tabs">${['Overview','Principal Transactions','Interest Accruals','Interest Payments','Daily Balance','Accounting','Documents','Audit History'].map(t=>`<button>${t}</button>`).join('')}</div><div class="accounting-grid">${cards.map(([l,v])=>`<div class="metric"><div class="metric-label">${escapeHtml(l)}</div><div>${escapeHtml(String(v??'—'))}</div></div>`).join('')}</div><div class="subcard"><h3>Principal Transaction Ledger</h3><div class="table-scroll"><table><thead><tr>${['Date','Transaction Number','Type','Increase','Decrease','Principal Balance','Bank Account','Reference','Journal','Status','Actions'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${tx.map(t=>`<tr><td>${investorDate(t.transaction_date||t.date)}</td><td>${escapeHtml(t.transaction_number||t.id)}</td><td><span class="badge">${escapeHtml(t.type||'Funding')}</span></td><td>${investorMoney(t.increase)}</td><td>${investorMoney(t.decrease)}</td><td>${investorMoney(t.principal_balance)}</td><td>${escapeHtml(t.bank_account_name||'—')}</td><td>${escapeHtml(t.reference||'—')}</td><td>${escapeHtml(t.journal_number||'—')}</td><td><span class="badge">${escapeHtml(t.status||'POSTED')}</span></td><td><button data-investor-reverse="${escapeHtml(t.id)}" data-kind="funding">Reverse</button></td></tr>`).join('')}</tbody></table></div></div><div class="subcard"><h3>Preview Interest</h3><div class="accounting-grid"><label>Period start<input id="ip-start" type="date" value="2026-07-01"></label><label>Period end<input id="ip-end" type="date" value="2026-07-31"></label></div><button id="ip-run">Preview Interest</button><div id="ip-results"></div><details id="ip-detail"><summary>Daily Balance Detail</summary><div id="ip-daily"></div></details></div><div class="subcard"><h3>Accounting</h3><button data-accounting-section="accounting-ledger">Investor Borrowings General Ledger</button> <button data-accounting-section="accounting-ledger">Accrued Investor Interest Payable General Ledger</button> <button data-accounting-section="accounting-ledger">Investor Interest Expense General Ledger</button> <button data-accounting-section="accounting-journals">Related Journal Entries</button></div>`; root.querySelector('#ip-run').onclick=()=>renderInterestPreview(root,d); }catch(e){root.innerHTML=`<div class="alert error">${escapeHtml(investorApiError(e))}</div>`;} }
function renderInterestPreview(root,d){ const principal=Number(d.current_principal||1000000), rate=Number(d.interest_rate||2), gross=principal*rate/100, tax=Number(d.withholding_tax_rate||0)*gross/100; root.querySelector('#ip-results').innerHTML=`<div class="accounting-grid">${[['Opening principal',principal],['Closing principal',principal],['Number of days',31],['Sum of daily balances',principal*31],['Average daily balance',principal],['Monthly rate',`${rate.toFixed(2)}% per month`],['Gross interest',gross],['Withholding tax',tax],['Net interest payable',gross-tax],['Calculation method',d.interest_calculation_method||'Monthly Average Daily Balance']].map(([l,v])=>`<div class="metric"><div class="metric-label">${escapeHtml(l)}</div><div>${typeof v==='number'?investorMoney(v):escapeHtml(v)}</div></div>`).join('')}</div><div class="subcard"><h3>Post Interest Accrual</h3><p>Period: 1 Jul 2026 – 31 Jul 2026<br>Average daily balance: ${investorMoney(principal)}<br>Rate: ${rate.toFixed(2)}% per month<br>Interest: ${investorMoney(gross)}</p><p>Journal:<br>Dr Investor Interest Expense<br>Cr Accrued Investor Interest Payable</p><button data-confirm-accrual="${escapeHtml(d.id)}"${investorRequiredSettingsMissing().length||investorFundingState.settingsError?' disabled':''}>Confirm Accrual</button><button class="secondary">Cancel</button></div>`; root.querySelector('#ip-daily').innerHTML=`<div class="table-scroll"><table><thead><tr>${['Date','Opening balance','Funding increases','Principal repayments','Capitalized interest','Closing balance','Daily weighting'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody><tr><td>2026-07-01 … 2026-07-31</td><td>${investorMoney(principal)}</td><td>${investorMoney(0)}</td><td>${investorMoney(0)}</td><td>${investorMoney(0)}</td><td>${investorMoney(principal)}</td><td>31 days</td></tr></tbody></table></div>`; }
async function loadAccrualsPage(){ const root=document.querySelector('#investor-funding-accruals-root'); if(!root)return; root.innerHTML='<h2>Interest Accruals</h2><p>Loading...</p>'; try{ const [dash, rowsRes]=await Promise.allSettled([api(`${investorFundingRoutes.accruals}/dashboard`),api(investorFundingRoutes.accruals)]); const d=dash.value||{}; const rows=investorItems(rowsRes.value); root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Investor Funding</div><h2>Interest Accruals</h2></div></div><div class="accounting-grid">${[['Agreements requiring accrual',d.agreements_requiring_accrual],['Accruals posted this month',d.accruals_posted_this_month],['Accruals awaiting payment',d.accruals_awaiting_payment],['Accrual exceptions',d.accrual_exceptions],['Total investor principal',investorMoney(d.total_investor_principal)],['Total accrued interest',investorMoney(d.total_accrued_interest)]].map(([l,v])=>`<div class="metric"><div class="metric-label">${escapeHtml(l)}</div><div>${escapeHtml(String(v??'0'))}</div></div>`).join('')}</div><div class="subcard"><h3>Run Interest Accrual</h3><div class="accounting-grid"><label>Month<input id="run-month" type="month" value="2026-07"></label><label>Agreement optional<input id="run-agreement"></label><label><input id="run-preview" type="checkbox" checked> Preview only</label><label><input id="run-post" type="checkbox"> Post</label></div><button data-run-investor-accrual>Run Interest Accrual</button></div>${investorTable(['Accrual Month','Investor','Agreement','Opening Principal','Average Daily Balance','Rate','Gross Interest','Withholding Tax','Net Payable','Paid','Outstanding','Status','Journal','Actions'], rows.map(r=>[r.accrual_month,r.investor_name,r.agreement_number,investorMoney(r.opening_principal),investorMoney(r.average_daily_balance),investorRate(r.interest_rate,r.interest_rate_period),investorMoney(r.gross_interest),investorMoney(r.withholding_tax),investorMoney(r.net_payable),investorMoney(r.paid),investorMoney(r.outstanding),r.status,r.journal_number,`<button>View</button> <button data-pay-accrual="${escapeHtml(r.id)}">Pay</button> <button data-capitalize-interest="${escapeHtml(r.id)}">Capitalize</button> <button data-investor-reverse="${escapeHtml(r.id)}" data-kind="accrual">Reverse</button>`]))}`; }catch(e){root.innerHTML=`<div class="alert error">${escapeHtml(investorApiError(e))}</div>`;} }
function investorTable(headers, rows){ return `<div class="table-scroll collection-responsive-table"><table><thead><tr>${headers.map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map(r=>`<tr>${r.map(c=>`<td>${c??'—'}</td>`).join('')}</tr>`).join('')||`<tr><td colspan="${headers.length}">No records found.</td></tr>`}</tbody></table></div>`; }
async function loadPaymentsPage(){ const root=document.querySelector('#investor-funding-payments-root'); if(!root)return; root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Investor Funding</div><h2>Interest Payments</h2></div><button data-open-interest-payment>Record Interest Payment</button></div><div id="interest-payment-form" class="subcard"><h3>Interest Payment</h3><div class="accounting-grid"><label>Accrual<input id="pay-accrual"></label><label>Payment date<input type="date" value="${investorToday()}"></label><label>Gross amount<input value="0.00"></label><label>Withholding tax<input value="0.00"></label><label>Net amount<input value="0.00"></label><label>Paying bank account<input></label><label>Reference<input></label><label>Remarks<textarea></textarea></label></div><p>Preview without tax:<br>Dr Accrued Investor Interest Payable<br>Cr Bank</p><p>Preview with tax:<br>Dr Accrued Investor Interest Payable<br>Cr Withholding Tax Payable<br>Cr Bank</p></div>`; }
function normalizeInvestorBalanceInvestors(raw){ return normalizeInvestorList(raw).map(i=>normalizeInvestor(i)).filter(i=>Number.isInteger(Number(i.id))); }
function normalizeInvestorBalanceAgreements(raw){ return normalizeAgreementList(raw).map(a=>({id:Number(a.id??a.agreement_id),agreementNumber:a.agreement_number??'',agreementName:a.agreement_name??a.name??'Agreement',investorId:Number(a.investor_id??a.investor?.id),status:String(a.status??'').trim().toUpperCase(),raw:a})).filter(a=>Number.isInteger(a.id)); }
function investorBalanceOptionText(number,name,fallback){ return [number,name||fallback].filter(Boolean).join(' — ')||fallback; }
function investorBalanceErrorMessage(e){ const message=String(e?.message||''); const code=message.toLowerCase(); if(e?.status===401) return 'Your session has expired. Please sign in again.'; if(e?.status===403) return 'You do not have permission to view the Investor Balance Report.'; if(code.includes('investor_not_found')||code.includes('agreement_not_found')||code.includes('investor_agreement_not_found')) return 'The selected investor or agreement no longer exists.'; if(e?.status===404&&code.includes('not_found')&&code.includes('the requested url was not found')) return 'Investor Balance Report endpoint is not available. Deploy the balance-report API and try again.'; if(e?.status===404) return message||'Investor Balance Report endpoint is not available. Deploy the balance-report API and try again.'; if(e?.status===500) return 'Investor balance report could not be generated.'; return message||'Investor balance report could not be generated.'; }
function investorBalanceRows(response){ if(Array.isArray(response)) return response; if(Array.isArray(response?.items)) return response.items; if(Array.isArray(response?.data?.items)) return response.data.items; return []; }
function investorBalanceSummary(response,rows){ const summary=response?.summary??response?.data?.summary??{}; const uniqueInvestors=new Set(rows.map(r=>r.investor_id??r.investorId??r.investor_number).filter(v=>v!=null&&v!=='')); const uniqueAgreements=new Set(rows.map(r=>r.agreement_id??r.agreementId??r.agreement_number).filter(v=>v!=null&&v!=='')); return {totalInvestors:safeNumber(summary.total_investors??summary.totalInvestors??uniqueInvestors.size),totalAgreements:safeNumber(summary.total_agreements??summary.totalAgreements??uniqueAgreements.size),originalPrincipal:safeNumber(summary.original_principal??summary.originalPrincipal??summary.original_principal_amount??rows.reduce((t,r)=>t+safeNumber(r.original_principal??r.originalPrincipal??r.original_principal_amount),0)),currentPrincipal:safeNumber(summary.current_principal??summary.currentPrincipal??summary.current_principal_balance??summary.principal_balance??rows.reduce((t,r)=>t+safeNumber(r.current_principal??r.currentPrincipal??r.current_principal_balance??r.principal_balance),0)),accruedInterest:safeNumber(summary.accrued_interest??summary.accruedInterest??summary.accrued_interest_balance??rows.reduce((t,r)=>t+safeNumber(r.accrued_interest??r.accruedInterest??r.accrued_interest_balance),0)),totalPayable:safeNumber(summary.total_payable??summary.totalPayable??summary.total_liability??rows.reduce((t,r)=>t+safeNumber(r.total_payable??r.totalPayable??r.total_liability),0))}; }
async function loadBalancesPage(){
  const root=document.querySelector('#investor-funding-balances-root'); if(!root)return;
  root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Investor Funding</div><h2>Investor Balance Report</h2></div></div><form class="accounting-filters"><label>As-of date<input name="as_of_date" type="date" value="${investorToday()}"></label><label>Investor<select name="investor_id" id="balance-investor"><option value="">All investors</option></select></label><label>Agreement<select name="agreement_id" id="balance-agreement"><option value="">All agreements</option></select></label><label>Status<select name="status"><option value="ALL">All statuses</option><option>ACTIVE</option><option>CLOSED</option></select></label><button type="submit">Run Report</button></form><div class="report-results"><div class="alert info">Loading report options...</div></div>`;
  const form=root.querySelector('form'), box=root.querySelector('.report-results'), investorSelect=root.querySelector('#balance-investor'), agreementSelect=root.querySelector('#balance-agreement'), runButton=form.querySelector('button[type="submit"]');
  let investors=[], agreements=[], requestState='loading', isLoading=false;
  const setRequestState=(state)=>{ requestState=state; root.dataset.balanceRequestState=state; };
  const renderAgreementOptions=()=>{ const current=agreementSelect.value; const selectedInvestorId=investorSelect.value?Number(investorSelect.value):null; const filtered=selectedInvestorId?agreements.filter(a=>a.investorId===selectedInvestorId):agreements; agreementSelect.innerHTML='<option value="">All agreements</option>'+filtered.map(a=>`<option value="${escapeHtml(a.id)}">${escapeHtml(investorBalanceOptionText(a.agreementNumber,a.agreementName,'Agreement'))}</option>`).join(''); if(current&&filtered.some(a=>String(a.id)===String(current))) agreementSelect.value=current; };
  investorSelect.onchange=()=>renderAgreementOptions();
  const renderReport=(response)=>{ const rows=investorBalanceRows(response); if(!rows.length){ setRequestState('empty'); box.innerHTML='<div class="alert info">No investor balances found for the selected filters.</div>'; return; } setRequestState('success'); const summary=investorBalanceSummary(response,rows); const cards=[['Total Investors',summary.totalInvestors],['Total Agreements',summary.totalAgreements],['Original Principal',investorMoney(summary.originalPrincipal)],['Current Principal',investorMoney(summary.currentPrincipal)],['Accrued Interest',investorMoney(summary.accruedInterest)],['Total Payable',investorMoney(summary.totalPayable)]]; const headers=['Investor','Agreement','Status','Original Principal','Total Funding','Principal Repaid','Current Principal','Gross Interest Accrued','Interest Paid','Withholding Tax','Accrued Interest','Total Payable']; box.innerHTML=`<div class="accounting-grid">${cards.map(([l,v])=>`<div class="metric"><div class="metric-label">${escapeHtml(l)}</div><div>${escapeHtml(String(v??'0'))}</div></div>`).join('')}</div>${investorTable(headers, rows.map(r=>[escapeHtml([r.investor_number??r.investorNumber,r.investor_name??r.investorName].filter(Boolean).join(' — ')||'—'),escapeHtml([r.agreement_number??r.agreementNumber,r.agreement_name??r.agreementName].filter(Boolean).join(' — ')||'—'),escapeHtml(r.status??'—'),investorMoney(r.original_principal??r.originalPrincipal??r.original_principal_amount),investorMoney(r.total_funding??r.totalFunding??r.funding_added??r.posted_principal),investorMoney(r.principal_repaid??r.principalRepaid),investorMoney(r.current_principal??r.currentPrincipal??r.current_principal_balance??r.principal_balance),investorMoney(r.gross_interest_accrued??r.grossInterestAccrued??r.gross_interest??r.interest_accrued),investorMoney(r.interest_paid??r.interestPaid),investorMoney(r.withholding_tax??r.withholdingTax??r.tax_withheld),investorMoney(r.accrued_interest??r.accruedInterest??r.accrued_interest_balance),investorMoney(r.total_payable??r.totalPayable??r.total_liability)]))}`; };
  const run=async(e)=>{ e&&e.preventDefault(); if(isLoading) return; const asOfDate=form.querySelector('[name="as_of_date"]').value; const selectedInvestorId=investorSelect.value; const selectedAgreementId=agreementSelect.value; const selectedStatus=form.querySelector('[name="status"]').value; const params=new URLSearchParams(); params.set('as_of_date',asOfDate); if(selectedInvestorId){ params.set('investor_id',String(Number(selectedInvestorId))); } if(selectedAgreementId){ params.set('agreement_id',String(Number(selectedAgreementId))); } if(selectedStatus&&selectedStatus!=='ALL'){ params.set('status',selectedStatus); } const path=`/admin/investor-funding/reports/balances?${params.toString()}`; console.log('Investor balance route',path); console.log('Investor balance filters',{asOfDate,selectedInvestorId,selectedAgreementId,selectedStatus}); try{ isLoading=true; setRequestState('loading'); runButton.disabled=true; box.innerHTML='<div class="alert info">Loading Investor Balance Report...</div>'; const response=await api(path); renderReport(response); }catch(e){ setRequestState('error'); box.innerHTML=`<div class="alert error">${escapeHtml(investorBalanceErrorMessage(e))}</div>`; }finally{ isLoading=false; runButton.disabled=false; } };
  form.onsubmit=run;
  try{ const [investorResponse,agreementResponse]=await Promise.all([api(investorFundingRoutes.investors),api('/admin/investor-agreements')]); investors=normalizeInvestorBalanceInvestors(investorResponse); agreements=normalizeInvestorBalanceAgreements(agreementResponse); investorSelect.innerHTML='<option value="">All investors</option>'+investors.map(i=>`<option value="${escapeHtml(i.id)}">${escapeHtml(investorBalanceOptionText(i.investorNumber,i.displayName,'Investor'))}</option>`).join(''); renderAgreementOptions(); await run(); }catch(e){ setRequestState('error'); box.innerHTML=`<div class="alert error">${escapeHtml(investorBalanceErrorMessage(e))}</div>`; runButton.disabled=false; }
}
async function loadReportsPage(){ const root=document.querySelector('#investor-funding-reports-root'); if(!root)return; await investorReport(root,'Investor Interest Report', investorFundingRoutes.interestReport, `<label>Date from<input name="date_from" type="date"></label><label>Date to<input name="date_to" type="date" value="${investorToday()}"></label><label>Investor<input name="investor"></label><label>Agreement<input name="agreement"></label><label>Status<input name="status"></label>`, ['Month','Investor','Agreement','Average Daily Balance','Interest Rate','Gross Interest','Tax','Net Payable','Paid','Outstanding','Journal']); }
async function investorReport(root,title,url,filters,headers){ root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Investor Funding</div><h2>${title}</h2></div></div><form class="accounting-filters">${filters}<button>Run Report</button></form><div class="report-results">Loading...</div>`; const form=root.querySelector('form'), box=root.querySelector('.report-results'); const run=async(e)=>{e&&e.preventDefault(); try{ const rows=investorItems(await api(`${url}?${new URLSearchParams(new FormData(form)).toString()}`)); box.innerHTML=investorTable(headers, rows.map(r=>headers.map(h=>{ const k=h.toLowerCase().replaceAll(' ','_').replaceAll('-','_'); const v=r[k]; return /principal|funding|repaid|interest|liability|tax|paid|outstanding|balance/.test(k)&&!String(h).includes('Rate')?investorMoney(v):escapeHtml(v??'—'); }))); }catch(e){box.innerHTML=`<div class="alert error">${escapeHtml(investorApiError(e))}</div>`;}}; form.onsubmit=run; await run(); }
async function loadReconciliationPage(){ const root=document.querySelector('#investor-funding-reconciliation-root'); if(!root)return; root.innerHTML='<h2>Investor Reconciliation</h2><p>Loading...</p>'; try{ const d=await api(investorFundingRoutes.reconciliation); const block=(title,items,status)=>`<div class="subcard"><h3>${title}</h3><div class="accounting-grid">${items.map(([l,v])=>`<div class="metric"><div class="metric-label">${escapeHtml(l)}</div><div>${investorMoney(v)}</div></div>`).join('')}</div><div class="alert ${status==='Balanced'?'success':status==='Mismatch'?'error':'warning'}">${escapeHtml(status||'Needs Review')}</div></div>`; root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Investor Funding</div><h2>Investor Reconciliation</h2></div></div>${block('Principal reconciliation',[['Investor subledger balance',d.principal_subledger_balance],['Investor Borrowings GL balance',d.investor_borrowings_gl_balance],['Difference',d.principal_difference]],d.principal_status)}${block('Interest reconciliation',[['Accrued interest subledger',d.accrued_interest_subledger],['Interest Payable GL balance',d.interest_payable_gl_balance],['Difference',d.interest_difference]],d.interest_status)}${block('Interest expense reconciliation',[['Posted accrual total',d.posted_accrual_total],['Interest Expense GL activity',d.interest_expense_gl_activity],['Difference',d.expense_difference]],d.expense_status)}`; }catch(e){root.innerHTML=`<div class="alert error">${escapeHtml(investorApiError(e))}</div>`;} }

// Bank Reconciliation UI. Reconciliation state is taken from each bank journal line,
// never from its journal header.
const bankReconciliationApi='/admin/accounting/bank-reconciliations';
const bankReconciliationState={current:null,currentId:null,transactions:[],transactionsLoading:false,transactionsError:null,requestSequence:0,selectedJournalLineIds:new Set(),matchPending:false,accounts:[]};
function isBankAccount(a={}){return String(acctSubtype(a)||a.category||a.account_category||'').toUpperCase().replaceAll(' ','_')==='BANK';}
function bankReconciliationItems(d){if(Array.isArray(d))return d;for(const k of ['reconciliations','items','results','data'])if(Array.isArray(d?.[k]))return d[k];return [];}
function bankTransactionCandidate(payload){if(Array.isArray(payload))return payload;const candidates=[payload?.transactions,payload?.lines,payload?.gl_lines,payload?.bank_gl_lines,payload?.bank_transactions,payload?.eligible_transactions,payload?.items,payload?.data?.transactions,payload?.data?.lines,payload?.data?.gl_lines,payload?.data?.bank_transactions,payload?.data?.eligible_transactions,payload?.reconciliation?.transactions];for(const candidate of candidates)if(Array.isArray(candidate))return candidate;return null;}
function getBankReconciliationTransactions(payload){return bankTransactionCandidate(payload)||[];}
function getJournalLineId(row={}){return row.journal_line_id??row.line_id??row.gl_line_id??row.id??null;}
function normalizeBankGlLine(row={}){const candidate=getJournalLineId(row),numericId=Number(candidate),id=Number.isInteger(numericId)&&numericId>0?numericId:null,isReconciled=row.is_reconciled===true,isReconcilable=row.is_reconcilable===true||(row.is_posted===true&&!isReconciled),journalStatus=String(row.journal_status??row.status??(row.is_posted===true?'POSTED':'')).trim().toUpperCase(),blockReason=row.reconciliation_block_reason??(!isReconcilable?(journalStatus&&journalStatus!=='POSTED'?'Journal entry is not posted.':'This journal line is not eligible for reconciliation.'):'');if(id===null)console.warn('Bank GL transaction has no valid journal-line ID',{journalNumber:row.journal_number??row.journal_no??row.entry_number??null});return {id,journalEntryId:row.journal_entry_id??row.entry_id??null,journalNumber:row.journal_number??row.journal_no??row.entry_number??'—',date:row.posting_date??row.journal_date??row.transaction_date??row.date??null,description:row.description??row.narration??row.memo??'—',reference:row.reference??row.reference_number??row.source_reference??'—',debit:row.debit??row.debit_amount??'0.00',credit:row.credit??row.credit_amount??'0.00',runningBalance:row.running_balance??row.balance??'0.00',journalStatus,isPosted:row.is_posted===true,isReconcilable,isReconciled,blockReason,raw:row};}
function brField(o,keys,fallback=''){for(const k of keys)if(o?.[k]!==undefined&&o[k]!==null)return o[k];return fallback;}
function brStatus(value){const raw=String(value||'DRAFT').toUpperCase().replaceAll('_',' ');return `<span class="reconciliation-status ${raw.toLowerCase().replaceAll(' ','-')}">${escapeHtml(raw)}</span>`;}
function isLineReconciled(line){return line?.is_reconciled===true;}
function reconciliationDetail(line){return {number:line?.reconciliation_number??'—',date:line?.reconciled_date??'—',reference:line?.statement_reference??'—',by:line?.reconciled_by_name??line?.reconciled_by??'—'};}
function renderGlReconciliation(line){if(!isLineReconciled(line))return '<span class="muted">—</span>';const d=reconciliationDetail(line);return `<button type="button" class="reconciliation-status reconciled" data-reconciliation-detail="${encodeURIComponent(JSON.stringify(d))}">✓ RECONCILED</button><small class="muted">${escapeHtml(d.number)}<br>${escapeHtml(formatDateOnlyDisplay(d.date)||d.date)}</small>`;}
function showReconciliationDetail(encoded){let d={};try{d=JSON.parse(decodeURIComponent(encoded));}catch(_e){}const modal=document.createElement('div');modal.className='modal';modal.innerHTML=`<div class="modal-card" role="dialog" aria-modal="true" aria-labelledby="reconciliation-detail-title"><button class="icon-button" data-close type="button" aria-label="Close">×</button><h2 id="reconciliation-detail-title">Reconciliation detail</h2>${[['Reconciliation No.',d.number],['Reconciled Date',formatDateOnlyDisplay(d.date)||d.date],['Statement Reference',d.reference],['Reconciled By',d.by]].map(([l,v])=>`<p><strong>${l}</strong><br>${escapeHtml(v||'—')}</p>`).join('')}</div>`;modal.onclick=e=>{if(e.target===modal||e.target.closest('[data-close]'))modal.remove();};document.body.appendChild(modal);}
function bankReconciliationError(e){const raw=String(e?.message||e?.error||'Bank reconciliation request failed.');const s=raw.toLowerCase();if(s.includes('already reconciled'))return 'One or more selected bank lines are already reconciled. Refresh the workspace and select unreconciled lines.';if(s.includes('wrong bank')||s.includes('bank account'))return 'The selected GL line does not belong to this bank account.';if(s.includes('difference')||s.includes('not zero'))return 'Bank reconciliation cannot be completed while a difference remains.';if(s.includes('completed')||s.includes('not editable'))return 'This completed reconciliation is read-only. Reopen it with authorization before editing.';return raw;}
async function loadBankAccounts(){if(bankReconciliationState.accounts.length)return bankReconciliationState.accounts;const d=await api('/admin/accounting/accounts?active=true');bankReconciliationState.accounts=accountItems(d).filter(isBankAccount);return bankReconciliationState.accounts;}
function reconciliationId(r){return brField(r,['id','reconciliation_id','bank_reconciliation_id']);}
function reconciliationNumber(r){return brField(r,['reconciliation_no','reconciliation_number','number'],reconciliationId(r)||'—');}
async function accountingLoadBankReconciliation(){
 const root=document.querySelector('#accounting-bank-reconciliation-root');if(!root)return;root.className='bank-reconciliation-page';root.innerHTML='<h2>Bank Reconciliation</h2><p>Loading reconciliations...</p>';
 try{const accounts=await loadBankAccounts();root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Accounting</div><h2>Bank Reconciliation</h2><p class="muted">Match bank statement transactions to General Ledger bank entries.</p></div><button id="new-bank-reconciliation" type="button">+ New Reconciliation</button></div><form id="bank-reconciliation-filters" class="accounting-filters"><label>Bank Account<select name="bank_account_id"><option value="">All bank accounts</option>${accounts.map(a=>`<option value="${escapeHtml(a.id)}">${escapeHtml(getAccountLabel(a))}</option>`).join('')}</select></label><label>Date From<input name="date_from" type="date"></label><label>Date To<input name="date_to" type="date"></label><label>Status<select name="status"><option value="">All</option>${['DRAFT','IN_PROGRESS','COMPLETED','REOPENED'].map(s=>`<option>${s}</option>`).join('')}</select></label><label>Reconciliation No.<input name="reconciliation_no"></label><button type="submit">Apply Filters</button></form><div id="bank-reconciliation-message"></div><div id="bank-reconciliation-list"><p>Loading...</p></div>`;root.querySelector('#new-bank-reconciliation').onclick=()=>renderNewBankReconciliation(root,accounts);root.querySelector('form').onsubmit=e=>{e.preventDefault();loadBankReconciliationList(root,new FormData(e.currentTarget));};await loadBankReconciliationList(root);
 }catch(e){root.innerHTML=`<div class="alert error">${escapeHtml(bankReconciliationError(e))}</div>`;}
}
async function loadBankReconciliationList(root,form){const box=root.querySelector('#bank-reconciliation-list');box.innerHTML='<p>Loading reconciliations...</p>';try{const q=new URLSearchParams();if(form)for(const [k,v]of form)if(v)q.set(k,v);const rows=bankReconciliationItems(await api(`${bankReconciliationApi}?${q}`));box.innerHTML=`<div class="table-scroll"><table><thead><tr>${['Reconciliation No.','Bank Account','Period','Statement Closing Balance','GL Closing Balance','Difference','Status','Completed Date','Actions'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.length?rows.map(r=>`<tr><td>${escapeHtml(reconciliationNumber(r))}</td><td>${escapeHtml(brField(r,['bank_account_label','bank_account_name','account_name'],'—'))}</td><td>${escapeHtml(formatDateOnlyDisplay(brField(r,['statement_date_from','date_from'])))} – ${escapeHtml(formatDateOnlyDisplay(brField(r,['statement_date_to','date_to'])))}</td><td>${formatCurrency(brField(r,['statement_closing_balance'],0))}</td><td>${formatCurrency(brField(r,['gl_closing_balance','reconciled_gl_closing_balance'],0))}</td><td>${formatCurrency(brField(r,['difference'],0))}</td><td>${brStatus(r.status)}</td><td>${escapeHtml(formatDateOnlyDisplay(brField(r,['completed_date','completed_at']))||'—')}</td><td><button data-br-open="${escapeHtml(reconciliationId(r))}">${String(r.status).toUpperCase()==='COMPLETED'?'View':'Continue'}</button> <button class="secondary" data-br-print="${escapeHtml(reconciliationId(r))}">Print</button> ${String(r.status).toUpperCase()==='COMPLETED'&&accountingCan('accounting.bank_reconciliation.reopen')?`<button class="secondary" data-br-reopen="${escapeHtml(reconciliationId(r))}">Reopen</button>`:''}</td></tr>`).join(''):'<tr><td colspan="9">No bank reconciliations found.</td></tr>'}</tbody></table></div>`;}catch(e){box.innerHTML=`<div class="alert error">${escapeHtml(bankReconciliationError(e))}</div>`;}}
function renderNewBankReconciliation(root,accounts){root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Accounting</div><h2>New Bank Reconciliation</h2><p class="muted">The reconciliation will be saved as DRAFT.</p></div><button class="secondary" data-br-list>Back</button></div><div id="bank-reconciliation-message"></div><form id="new-bank-reconciliation-form" class="subcard accounting-grid"><label>Bank Account *<select name="bank_account_id" required><option value="">Select bank account</option>${accounts.map(a=>`<option value="${escapeHtml(a.id)}">${escapeHtml(getAccountLabel(a))}</option>`).join('')}</select></label><label>Statement Date From *<input name="statement_date_from" type="date" required></label><label>Statement Date To *<input name="statement_date_to" type="date" required></label><label>Statement Opening Balance *<input name="statement_opening_balance" type="number" step="0.01" required></label><label>Statement Closing Balance *<input name="statement_closing_balance" type="number" step="0.01" required></label><label>Notes<textarea name="notes" rows="3"></textarea></label><div class="action-row"><button type="submit">Save as Draft</button></div></form>`;root.querySelector('[data-br-list]').onclick=accountingLoadBankReconciliation;root.querySelector('form').onsubmit=async e=>{e.preventDefault();const button=e.submitter;button.disabled=true;const f=new FormData(e.currentTarget),body=Object.fromEntries(f);body.bank_account_id=Number(body.bank_account_id);body.statement_opening_balance=Number(body.statement_opening_balance);body.statement_closing_balance=Number(body.statement_closing_balance);body.status='DRAFT';try{const created=await api(bankReconciliationApi,{method:'POST',body});await openBankReconciliation(reconciliationId(created)||reconciliationId(created.data));}catch(err){root.querySelector('#bank-reconciliation-message').innerHTML=`<div class="alert error">${escapeHtml(bankReconciliationError(err))}</div>`;button.disabled=false;}};}
function reconciliationTotals(r){return [['Statement Opening Balance',brField(r,['statement_opening_balance'],0)],['Statement Closing Balance',brField(r,['statement_closing_balance'],0)],['GL Balance',brField(r,['gl_balance','gl_closing_balance'],0)],['Reconciled Debits',brField(r,['reconciled_debits'],0)],['Reconciled Credits',brField(r,['reconciled_credits'],0)],['Unreconciled Debits',brField(r,['unreconciled_debits'],0)],['Unreconciled Credits',brField(r,['unreconciled_credits'],0)],['Difference',brField(r,['difference'],0)]];}
async function openBankReconciliation(id,{print=false}={}){const root=document.querySelector('#accounting-bank-reconciliation-root'),requestId=++bankReconciliationState.requestSequence,idKey=String(id);bankReconciliationState.currentId=idKey;showAdminSectionWithBankReconciliation('accounting-bank-reconciliation');if(location.pathname!=='/admin/accounting/bank-reconciliation')history.pushState({section:'accounting-bank-reconciliation'},'', '/admin/accounting/bank-reconciliation');root.innerHTML='<h2>Bank Reconciliation</h2><p>Loading workspace...</p>';try{const raw=await api(`${bankReconciliationApi}/${encodeURIComponent(id)}`);if(requestId!==bankReconciliationState.requestSequence||idKey!==bankReconciliationState.currentId)return;const r=raw.reconciliation||raw.data||raw,embedded=bankTransactionCandidate(raw)??bankTransactionCandidate(r);bankReconciliationState.current=r;bankReconciliationState.selectedJournalLineIds.clear();bankReconciliationState.transactions=[];bankReconciliationState.transactionsError=null;if(embedded!==null){bankReconciliationState.transactions=getBankReconciliationTransactions({transactions:embedded}).map(normalizeBankGlLine);bankReconciliationState.transactionsLoading=false;renderBankReconciliationWorkspace(root,r);if(print)setTimeout(()=>window.print(),100);return;}bankReconciliationState.transactionsLoading=true;renderBankReconciliationWorkspace(root,r);try{const linePayload=await api(`${bankReconciliationApi}/${encodeURIComponent(id)}/transactions`);if(requestId!==bankReconciliationState.requestSequence||idKey!==bankReconciliationState.currentId)return;bankReconciliationState.transactions=getBankReconciliationTransactions(linePayload).map(normalizeBankGlLine);bankReconciliationState.transactionsError=null;}catch(lineError){if(requestId!==bankReconciliationState.requestSequence||idKey!==bankReconciliationState.currentId)return;bankReconciliationState.transactions=[];bankReconciliationState.transactionsError=lineError;}finally{if(requestId===bankReconciliationState.requestSequence&&idKey===bankReconciliationState.currentId){bankReconciliationState.transactionsLoading=false;renderBankReconciliationWorkspace(root,r);if(print)setTimeout(()=>window.print(),100);}}}catch(e){if(requestId===bankReconciliationState.requestSequence&&idKey===bankReconciliationState.currentId)root.innerHTML=`<div class="alert error">${escapeHtml(bankReconciliationError(e))}</div>`;}}
function persistedBankMatchCount(r,rows){const apiCount=brField(r,['matched_transaction_count','reconciled_line_count','matched_line_count'],null);if(apiCount!==null&&Number.isFinite(Number(apiCount)))return Number(apiCount);const currentNumber=String(reconciliationNumber(r));return rows.filter(line=>line.isReconciled&&String(reconciliationDetail(line.raw||line).number)===currentNumber).length;}
function requestErrorMessage(e){return String(e?.message||e?.error||'Bank reconciliation request failed.');}
function bankReconciliationInvalidLines(e){const data=e?.data?.data??e?.data??{};const lines=data.invalid_lines??data.errors?.invalid_lines??data.detail?.invalid_lines??[];return Array.isArray(lines)?lines:[];}
function bankReconciliationInvalidLinesHtml(lines){if(!lines.length)return '';return `<div class="alert error"><strong>The following transactions cannot be reconciled:</strong><div class="table-scroll"><table><thead><tr><th>Journal No.</th><th>Description</th><th>Status</th><th>Reason</th></tr></thead><tbody>${lines.map(line=>`<tr><td>${escapeHtml(line.journal_number??line.journal_no??line.entry_number??'—')}</td><td>${escapeHtml(line.description??line.narration??line.memo??'—')}</td><td>${escapeHtml(String(line.journal_status??line.status??'INELIGIBLE').toUpperCase())}</td><td>${escapeHtml(line.reconciliation_block_reason??line.reason??line.message??'This journal line is not eligible for reconciliation.')}</td></tr>`).join('')}</tbody></table></div></div>`;}
function renderBankReconciliationWorkspace(root,r){const rows=bankReconciliationState.transactions,status=String(r.status||'DRAFT').toUpperCase(),editable=status!=='COMPLETED',difference=Number(brField(r,['difference'],0))||0,matchedCount=persistedBankMatchCount(r,rows),hasTransactions=rows.length>0,eligibleIds=new Set(rows.filter(line=>line.id!==null&&line.isReconcilable&&!line.isReconciled).map(line=>String(line.id)));for(const id of bankReconciliationState.selectedJournalLineIds)if(!eligibleIds.has(String(id)))bankReconciliationState.selectedJournalLineIds.delete(id);const canComplete=!bankReconciliationState.matchPending&&!bankReconciliationState.selectedJournalLineIds.size&&difference===0&&matchedCount>0,body=bankReconciliationState.transactionsLoading?'<tr><td colspan="9">Loading bank GL transactions…</td></tr>':bankReconciliationState.transactionsError?'<tr><td colspan="9"><div class="alert error">Unable to load bank GL transactions. <button type="button" data-br-retry-lines>Retry</button></div></td></tr>':rows.length?rows.map(line=>{const source=line.raw||line,currentNo=reconciliationDetail(source).number,selectable=editable&&!line.isReconciled&&line.isReconcilable&&line.id!==null,disabledReason=line.blockReason||(line.id===null?'Bank GL line has no valid journal-line ID.':'This journal line is not eligible for reconciliation.'),lineStatus=line.journalStatus&&line.journalStatus!=='POSTED'?'NOT POSTED':'INELIGIBLE';return `<tr><td>${selectable?`<input type="checkbox" class="bank-reconciliation-line-checkbox" value="${escapeHtml(line.id)}" data-journal-line-id="${escapeHtml(line.id)}" aria-label="Select posted bank GL line" ${bankReconciliationState.selectedJournalLineIds.has(String(line.id))?'checked':''}>`:editable&&!line.isReconciled?`<input type="checkbox" class="bank-reconciliation-line-checkbox" aria-label="${escapeHtml(disabledReason)}" title="${escapeHtml(disabledReason)}" disabled>`:'—'}</td><td>${escapeHtml(formatDateOnlyDisplay(line.date)||'—')}</td><td>${escapeHtml(line.journalNumber)}</td><td>${escapeHtml(line.description)}</td><td>${escapeHtml(line.reference)}</td><td>${moneyCell(line.debit)}</td><td>${moneyCell(line.credit)}</td><td>${moneyCell(line.runningBalance)}</td><td>${line.isReconciled?`${renderGlReconciliation(source)}${currentNo!=='—'?`<br><small>${escapeHtml(currentNo)}</small>`:''}`:line.isReconcilable?'<span class="reconciliation-status unreconciled">UNRECONCILED</span>':`<span class="reconciliation-status ineligible" title="${escapeHtml(disabledReason)}">${lineStatus}</span><br><small class="muted">${escapeHtml(disabledReason)}</small>`}${editable&&line.isReconciled&&String(currentNo)===String(reconciliationNumber(r))?`<br><button type="button" class="link-button" data-br-unmatch="${escapeHtml(line.id)}">Remove Match</button>`:''}</td></tr>`;}).join(''):'<tr><td colspan="9">No bank GL transactions found for this period.</td></tr>';
 const completionWarning=editable&&hasTransactions&&matchedCount===0?'<div class="alert warning">Mark bank transactions as reconciled before completing this reconciliation.</div>':'';
 root.innerHTML=`<div class="card-header"><div><div class="eyebrow">Bank Reconciliation</div><h2>${escapeHtml(reconciliationNumber(r))}</h2><p>${escapeHtml(brField(r,['bank_account_label','bank_account_name','account_name'],'—'))} · ${escapeHtml(formatDateOnlyDisplay(brField(r,['statement_date_from','date_from'])))} – ${escapeHtml(formatDateOnlyDisplay(brField(r,['statement_date_to','date_to'])))} · ${brStatus(status)}</p></div><div data-no-print><button type="button" class="secondary" data-br-list>Back</button> <button type="button" class="secondary" data-br-print-current>Print Reconciliation</button> <button type="button" class="secondary" data-br-csv>Export CSV</button></div></div><div id="bank-reconciliation-message">${completionWarning}</div><div class="reconciliation-print-meta"><p>Prepared By: ${escapeHtml(brField(r,['prepared_by_name','prepared_by'],'—'))} · Completed By: ${escapeHtml(brField(r,['completed_by_name','completed_by'],'—'))}</p></div><div class="summary-grid"><div class="summary-card"><span>Matched transaction count</span><strong>${matchedCount}</strong></div>${reconciliationTotals(r).map(([l,v])=>`<div class="summary-card"><span>${l}</span><strong class="${l==='Difference'&&Number(v)!==0?'difference-error':''}">${formatCurrency(v)}</strong></div>`).join('')}</div><div class="table-scroll"><table><thead><tr>${['Select','Date','Journal No.','Description','Reference','Debit','Credit','Running Balance','Reconciled'].map(h=>`<th>${h}</th>`).join('')}</tr></thead><tbody>${body}</tbody></table></div><div class="sticky-actions" data-no-print>${editable?`<button type="button" id="mark-bank-reconciled" ${!bankReconciliationState.selectedJournalLineIds.size||bankReconciliationState.matchPending?'disabled':''}>${bankReconciliationState.matchPending?'Saving…':'Mark Reconciled'}</button><button type="button" id="complete-bank-reconciliation" ${canComplete?'':'disabled'}>Complete Reconciliation</button>`:'<span class="muted">Completed reconciliations are read-only.</span>'}</div>`;
 root.querySelector('[data-br-list]').onclick=accountingLoadBankReconciliation;root.querySelector('[data-br-print-current]').onclick=()=>window.print();root.querySelector('[data-br-csv]').onclick=()=>exportBankReconciliationCsv(r,rows);root.querySelector('[data-br-retry-lines]')?.addEventListener('click',()=>openBankReconciliation(reconciliationId(r)));root.querySelectorAll('.bank-reconciliation-line-checkbox:not(:disabled)').forEach(cb=>cb.onchange=()=>{const id=cb.dataset.journalLineId||cb.value;cb.checked?bankReconciliationState.selectedJournalLineIds.add(id):bankReconciliationState.selectedJournalLineIds.delete(id);const mark=root.querySelector('#mark-bank-reconciled');if(mark)mark.disabled=!bankReconciliationState.selectedJournalLineIds.size||bankReconciliationState.matchPending;const complete=root.querySelector('#complete-bank-reconciliation');if(complete)complete.disabled=true;});const mark=root.querySelector('#mark-bank-reconciled');if(mark)mark.onclick=e=>{e.preventDefault();markBankLinesReconciled();};const complete=root.querySelector('#complete-bank-reconciliation');if(complete)complete.onclick=e=>{e.preventDefault();completeBankReconciliation(r);};}
async function markBankLinesReconciled(){const r=bankReconciliationState.current,root=document.querySelector('#accounting-bank-reconciliation-root');if(!r||String(r.status||'').toUpperCase()==='COMPLETED'||bankReconciliationState.matchPending)return;const eligibleIds=new Set(bankReconciliationState.transactions.filter(line=>line.isReconcilable&&!line.isReconciled&&line.id!==null).map(line=>String(line.id))),selectedIds=Array.from(root.querySelectorAll('.bank-reconciliation-line-checkbox:checked')).map(checkbox=>checkbox.dataset.journalLineId||checkbox.value).filter(value=>eligibleIds.has(String(value))).map(value=>Number(value)).filter(value=>Number.isInteger(value)&&value>0),journalLineIds=[...new Set(selectedIds)];if(!journalLineIds.length){root.querySelector('#bank-reconciliation-message').innerHTML='<div class="alert error">Select at least one posted bank GL transaction.</div>';return;}const id=reconciliationId(r);console.debug('Bank reconciliation selected IDs',{reconciliationId:id,journalLineIds,count:journalLineIds.length});bankReconciliationState.matchPending=true;renderBankReconciliationWorkspace(root,r);try{await api(`${bankReconciliationApi}/${encodeURIComponent(id)}/lines`,{method:'POST',body:{journal_line_ids:journalLineIds,reconciled_date:brField(r,['statement_date_to','date_to']),statement_reference:brField(r,['statement_reference'],null)}});bankReconciliationState.matchPending=false;window.dispatchEvent(new CustomEvent('bank-reconciliation-updated',{detail:{journalLineIds}}));await openBankReconciliation(id);}catch(e){bankReconciliationState.matchPending=false;const invalidLines=e?.status===422?bankReconciliationInvalidLines(e):[];for(const line of invalidLines){const invalidId=getJournalLineId(line);if(invalidId!==null)bankReconciliationState.selectedJournalLineIds.delete(String(invalidId));}renderBankReconciliationWorkspace(root,r);root.querySelector('#bank-reconciliation-message').innerHTML=bankReconciliationInvalidLinesHtml(invalidLines)||`<div class="alert error">${escapeHtml(requestErrorMessage(e))}</div>`;}}
async function updateBankMatches(action,lineIds){if(action==='add'){lineIds.forEach(id=>bankReconciliationState.selectedJournalLineIds.add(String(id)));return markBankLinesReconciled();}const r=bankReconciliationState.current,root=document.querySelector('#accounting-bank-reconciliation-root');try{await api(`${bankReconciliationApi}/${encodeURIComponent(reconciliationId(r))}/matches`,{method:'DELETE',body:{journal_line_ids:lineIds}});window.dispatchEvent(new CustomEvent('bank-reconciliation-updated',{detail:{journalLineIds:lineIds}}));await openBankReconciliation(reconciliationId(r));}catch(e){root.querySelector('#bank-reconciliation-message').innerHTML=`<div class="alert error">${escapeHtml(requestErrorMessage(e))}</div>`;}}
async function completeBankReconciliation(r){const root=document.querySelector('#accounting-bank-reconciliation-root'),rows=bankReconciliationState.transactions,difference=Number(brField(r,['difference'],0))||0,matchedCount=persistedBankMatchCount(r,rows);if(bankReconciliationState.matchPending){root.querySelector('#bank-reconciliation-message').innerHTML='<div class="alert error">Wait for Mark Reconciled to finish before completing.</div>';return;}if(bankReconciliationState.selectedJournalLineIds.size){root.querySelector('#bank-reconciliation-message').innerHTML='<div class="alert error">Click Mark Reconciled to save the selected bank transactions before completing.</div>';return;}if(rows.length&&matchedCount===0){root.querySelector('#bank-reconciliation-message').innerHTML='<div class="alert error">Mark bank transactions as reconciled before completing this reconciliation.</div>';return;}if(difference!==0){root.querySelector('#bank-reconciliation-message').innerHTML='<div class="alert error">Bank reconciliation cannot be completed while a difference remains.</div>';return;}const totals=Object.fromEntries(reconciliationTotals(r));if(!confirm(`Complete reconciliation?\nMatched transaction count: ${matchedCount}\nReconciled Debits: ${formatCurrency(totals['Reconciled Debits'])}\nReconciled Credits: ${formatCurrency(totals['Reconciled Credits'])}\nUnreconciled Debits: ${formatCurrency(totals['Unreconciled Debits'])}\nUnreconciled Credits: ${formatCurrency(totals['Unreconciled Credits'])}\nDifference: ${formatCurrency(difference)}`))return;const button=root.querySelector('#complete-bank-reconciliation');if(button)button.disabled=true;try{await api(`${bankReconciliationApi}/${encodeURIComponent(reconciliationId(r))}/complete`,{method:'POST'});window.dispatchEvent(new CustomEvent('bank-reconciliation-updated'));await openBankReconciliation(reconciliationId(r));}catch(e){if(button)button.disabled=false;root.querySelector('#bank-reconciliation-message').innerHTML=`<div class="alert error">${escapeHtml(requestErrorMessage(e))}</div>`;}}
function exportBankReconciliationCsv(r,rows){const fields=['Date','Journal No.','Description','Reference','Debit','Credit','Running Balance','Reconciled','Reconciliation No.'],quote=v=>`"${String(v??'').replaceAll('"','""')}"`,csv=[fields,...rows.map(x=>[x.date,x.journalNumber,x.description,x.reference,x.debit,x.credit,x.runningBalance,x.isReconciled?'RECONCILED':'UNRECONCILED',reconciliationDetail(x.raw||x).number])].map(row=>row.map(quote).join(',')).join('\n');const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([csv],{type:'text/csv'}));a.download=`${reconciliationNumber(r)}.csv`;a.click();URL.revokeObjectURL(a.href);}
document.addEventListener('click',async e=>{const detail=e.target.closest('[data-reconciliation-detail]');if(detail){e.preventDefault();showReconciliationDetail(detail.dataset.reconciliationDetail);return;}const open=e.target.closest('[data-br-open]');if(open)await openBankReconciliation(open.dataset.brOpen);const print=e.target.closest('[data-br-print]');if(print)await openBankReconciliation(print.dataset.brPrint,{print:true});const unmatch=e.target.closest('[data-br-unmatch]');if(unmatch)await updateBankMatches('remove',[unmatch.dataset.brUnmatch]);const reopen=e.target.closest('[data-br-reopen]');if(reopen&&confirm('Reopen this completed reconciliation?')){try{await api(`${bankReconciliationApi}/${encodeURIComponent(reopen.dataset.brReopen)}/reopen`,{method:'POST'});await openBankReconciliation(reopen.dataset.brReopen);}catch(err){alert(bankReconciliationError(err));}}});
const showAdminSectionWithBankReconciliation=showAdminSection;
showAdminSection=function(section='dashboard'){showAdminSectionWithBankReconciliation(section);if(section==='accounting-bank-reconciliation'){if(location.pathname!=='/admin/accounting/bank-reconciliation')history.pushState({section},'', '/admin/accounting/bank-reconciliation');accountingLoadBankReconciliation();}};
window.addEventListener('popstate',()=>{if(location.pathname==='/admin/accounting/bank-reconciliation')showAdminSection('accounting-bank-reconciliation');});
window.addEventListener('bank-reconciliation-updated',()=>{if(!document.querySelector('#accounting-ledger-root')?.closest('.admin-section')?.classList.contains('hidden'))document.querySelector('#run-ledger')?.click();});
function openInvestorReversal(id, kind){ const modal=document.createElement('div'); modal.className='modal-overlay historical-accounting-modal'; modal.innerHTML=`<div class="modal-card"><div class="modal-header"><h2>Reverse ${escapeHtml(kind||'transaction')}</h2><button class="icon-button" data-close>×</button></div><div class="alert warning">This will not delete the original transaction. A reversing journal will be created.</div><label>Reversal date<input id="rv-date" type="date" value="${investorToday()}"></label><label>Reason<textarea id="rv-reason"></textarea></label><label><input id="rv-confirm" type="checkbox"> I confirm this reversal</label><div id="rv-msg"></div><div class="modal-actions"><button class="secondary" data-close>Cancel</button><button id="rv-save">Reverse</button></div></div>`; document.body.appendChild(modal); modal.querySelectorAll('[data-close]').forEach(b=>b.onclick=()=>modal.remove()); modal.querySelector('#rv-save').onclick=async()=>{ if(!modal.querySelector('#rv-confirm').checked||!modal.querySelector('#rv-reason').value.trim()){ modal.querySelector('#rv-msg').innerHTML='<div class="alert error">Reason and confirmation are required.</div>'; return;} try{ await api(`/admin/investor-funding/${encodeURIComponent(kind||'transactions')}/${encodeURIComponent(id)}/reverse`,{method:'POST',body:{reversal_date:modal.querySelector('#rv-date').value,reason:modal.querySelector('#rv-reason').value}}); modal.remove(); }catch(e){modal.querySelector('#rv-msg').innerHTML=`<div class="alert error">${escapeHtml(investorApiError(e))}</div>`;} }; }
const investorFundingShowAdminSection = showAdminSection;
showAdminSection = function(section='dashboard'){
  ensureInvestorFundingNavigation();
  investorFundingShowAdminSection(section);
  if(section.startsWith('investor-funding-')) showInvestorFundingSection(section);
  document.querySelectorAll('[data-section-link]').forEach(button => {
    button.classList.toggle('active', button.dataset.sectionLink === section);
  });
  if(section==='investor-funding-investors') loadInvestorsPage();
  if(section==='investor-funding-agreements') loadAgreementsPage();
  if(section==='investor-funding-record') loadRecordFundingPage();
  if(section==='investor-funding-accruals') loadAccrualsPage();
  if(section==='investor-funding-payments') loadPaymentsPage();
  if(section==='investor-funding-balances') loadBalancesPage();
  if(section==='investor-funding-reports') loadReportsPage();
  if(section==='investor-funding-reconciliation') loadReconciliationPage();
  if(section==='accounting-settings') setTimeout(injectInvestorFundingSettingsPanel, 0);
};
document.addEventListener('click', async e=>{
  const addInv=e.target.closest('[data-add-investor]'); if(addInv){ e.preventDefault(); openInvestorForm({}); return; }
  const editInv=e.target.closest('[data-investor-edit]'); if(editInv){ e.preventDefault(); const inv=investorFundingState.investors.find(i=>String(i.id)===String(editInv.dataset.investorEdit))||{}; openInvestorForm(inv); return; }
  const refreshInv=e.target.closest('[data-refresh-investors]'); if(refreshInv){ e.preventDefault(); loadInvestorsPage(); return; }
  const refreshAg=e.target.closest('[data-refresh-agreements]'); if(refreshAg){ e.preventDefault(); loadAgreementsPage(); return; }
  const addAg=e.target.closest('[data-add-agreement],[data-new-agreement]'); if(addAg){ e.preventDefault(); await investorBootstrap(); agreementForm({investor_id:addAg.dataset.newAgreement}); return; }
  const editAg=e.target.closest('[data-agreement-edit]'); if(editAg){ e.preventDefault(); await investorBootstrap(); agreementForm(investorFundingState.agreements.find(a=>String(a.id)===String(editAg.dataset.agreementEdit))||{}); return; }
  const rec=e.target.closest('[data-record-funding]'); if(rec){ e.preventDefault(); showAdminSection('investor-funding-record'); setTimeout(()=>{ const el=document.querySelector('#fund-agreement'); if(el) el.value=rec.dataset.recordFunding; },100); return; }
  const repay=e.target.closest('[data-repay-principal]'); if(repay){ e.preventDefault(); await investorBootstrap(); openRepaymentForm(repay.dataset.repayPrincipal); return; }
  const catchUp=e.target.closest('[data-interest-catch-up]'); if(catchUp){ e.preventDefault(); openInterestCatchUpPreview(catchUp.dataset.interestCatchUp); return; }
  const detail=e.target.closest('[data-agreement-detail]'); if(detail){ e.preventDefault(); loadAgreementDetail(detail.dataset.agreementDetail); return; }
  const rev=e.target.closest('[data-investor-reverse]'); if(rev){ e.preventDefault(); openInvestorReversal(rev.dataset.investorReverse, rev.dataset.kind); return; }
  const confirmAcc=e.target.closest('[data-confirm-accrual]'); if(confirmAcc){ e.preventDefault(); try{ await api(`${investorFundingRoutes.accruals}`,{method:'POST',body:{agreement_id:confirmAcc.dataset.confirmAccrual,period_start:'2026-07-01',period_end:'2026-07-31'}}); alert('Interest accrual posted.'); }catch(err){ alert(investorApiError(err)); } return; }
  const cap=e.target.closest('[data-capitalize-interest]'); if(cap){ e.preventDefault(); if(confirm('Capitalizing interest will increase the investor principal balance and may increase future interest.\n\nPreview:\nDr Investor Interest Expense\nCr Investor Borrowings')) api(`${investorFundingRoutes.accruals}/${encodeURIComponent(cap.dataset.capitalizeInterest)}/capitalize`,{method:'POST'}).catch(err=>alert(investorApiError(err))); return; }
});
ensureInvestorFundingNavigation();


(function(){document.documentElement.dataset.investorsUi='v2';})();
// Extend Accounting Settings with investor funding controls without changing Chart of Accounts editing.
function investorSettingsField(name,label,html){ return `<label>${label}${html}</label>`; }
function investorSettingsSelect(name,label,rows,value){ return investorSettingsField(name,label,`<select data-investor-setting="${name}"><option value="">Select account</option>${rows.map(a=>`<option value="${escapeHtml(a.id)}" ${String(a.id)===String(value)?'selected':''}>${escapeHtml(investorAccountLabel(a))}</option>`).join('')}</select>`); }
async function injectInvestorFundingSettingsPanel(){
  const root=document.querySelector('#accounting-settings-root');
  if(!root || root.querySelector('[data-investor-settings-panel]')) return;
  const loading=document.createElement('div'); loading.className='subcard'; loading.dataset.investorSettingsPanel=''; loading.innerHTML='<h3>Investor Funding</h3><p>Loading Investor Funding configuration...</p>'; root.appendChild(loading);
  try{ if(!(investorFundingState.accounts||[]).length){ const acc=await api('/admin/accounting/accounts'); investorFundingState.accounts=investorItems(acc); } await loadInvestorFundingSettings(true); }
  finally{ const s=investorFundingState.settings||{}; const accounts=investorFundingState.accounts||[]; loading.innerHTML=`<h3>Investor Funding</h3><p class="muted">Default mappings for investor borrowings, interest accruals, payments, capitalization, and reconciliation.</p>${investorConfigWarning()}<div class="accounting-grid">${[
    investorSettingsSelect('investor_borrowings_control_account_id','Investor Borrowings Control Account',accounts.filter(a=>accountMatchesRole(a,'liability')),s.investorBorrowingsAccountId),
    investorSettingsSelect('investor_interest_expense_account_id','Investor Interest Expense Account',accounts.filter(a=>accountMatchesRole(a,'expense')),s.investorInterestExpenseAccountId),
    investorSettingsSelect('investor_interest_payable_account_id','Accrued Investor Interest Payable Account',accounts.filter(a=>accountMatchesRole(a,'payable')),s.investorInterestPayableAccountId),
    investorSettingsSelect('investor_withholding_tax_payable_account_id','Withholding Tax Payable Account',accounts.filter(a=>accountMatchesRole(a,'tax')),s.withholdingTaxAccountId),
    investorSettingsSelect('default_investor_funding_bank_account_id','Default Funding Bank Account',accounts.filter(a=>accountMatchesRole(a,'funding')),s.defaultFundingBankAccountId),
    investorSettingsField('default_interest_calculation_method','Default Calculation Method',`<select data-investor-setting="default_interest_calculation_method"><option>MONTHLY_AVERAGE_DAILY_BALANCE</option><option>DAILY_BALANCE</option><option>FIXED_MONTHLY</option></select>`),
    investorSettingsField('default_interest_rate_period','Default Rate Period',`<select data-investor-setting="default_interest_rate_period"><option>MONTHLY</option><option>ANNUAL</option></select>`),
    investorSettingsField('default_interest_payment_frequency','Default Payment Frequency',`<select data-investor-setting="default_interest_payment_frequency"><option>MONTHLY</option><option>QUARTERLY</option><option>AT_MATURITY</option></select>`),
    investorSettingsField('default_compounding_method','Default Compounding Method',`<select data-investor-setting="default_compounding_method"><option>NONE</option><option>CAPITALIZE_MONTHLY</option></select>`),
    investorSettingsField('default_day_count_basis','Default Day Count Basis',`<select data-investor-setting="default_day_count_basis"><option>ACTUAL_365</option><option>ACTUAL_360</option><option>30_360</option></select>`),
    investorSettingsField('auto_post_investor_interest','Auto-post Investor Interest',`<input type="checkbox" data-investor-setting="auto_post_investor_interest" ${s.autoPostInterest?'checked':''}>`),
    investorSettingsField('allow_historical_investor_transactions','Allow Historical Transactions',`<input type="checkbox" data-investor-setting="allow_historical_investor_transactions" ${s.allowHistoricalTransactions?'checked':''}>`),
    investorSettingsField('allow_interest_capitalization','Allow Interest Capitalization',`<input type="checkbox" data-investor-setting="allow_interest_capitalization" ${s.allowInterestCapitalization?'checked':''}>`)
  ].join('')}</div><button data-save-investor-settings>Save Investor Funding Settings</button>`;
  ['default_interest_calculation_method','default_interest_rate_period','default_interest_payment_frequency','default_compounding_method','default_day_count_basis'].forEach(k=>{ const el=loading.querySelector(`[data-investor-setting="${k}"]`); const map={default_interest_calculation_method:s.calculationMethod,default_interest_rate_period:s.interestRatePeriod,default_interest_payment_frequency:s.interestPaymentFrequency,default_compounding_method:s.compoundingMethod,default_day_count_basis:s.dayCountBasis}; if(el) el.value=map[k]; }); }
}
document.addEventListener('click', e=>{
  const status=e.target.closest('[data-investor-status]');
  if(status){ e.preventDefault(); api(`${investorFundingRoutes.investors}/${encodeURIComponent(status.dataset.investorStatus)}/status`,{method:'PATCH',body:{status:status.dataset.status}}).then(()=>{ invalidateInvestorOptionsCache(); return loadInvestorsPage(); }).catch(err=>alert(investorApiError(err))); }
  const close=e.target.closest('[data-close-agreement]');
  if(close){ e.preventDefault(); if(confirm('Close this investor funding agreement?')) api(`${investorFundingRoutes.agreements}/${encodeURIComponent(close.dataset.closeAgreement)}/close`,{method:'POST'}).then(loadAgreementsPage).catch(err=>alert(investorApiError(err))); }
  const run=e.target.closest('[data-run-investor-accrual]');
  if(run){ e.preventDefault(); const root=document.querySelector('#investor-funding-accruals-root'); const month=root?.querySelector('#run-month')?.value; const agreement_id=root?.querySelector('#run-agreement')?.value||null; const preview_only=root?.querySelector('#run-preview')?.checked; const post=root?.querySelector('#run-post')?.checked; api(`${investorFundingRoutes.accruals}/run`,{method:'POST',body:{month,agreement_id,preview_only,post}}).then(loadAccrualsPage).catch(err=>alert(investorApiError(err))); }
  const saveSettings=e.target.closest('[data-save-investor-settings]');
  if(saveSettings){ e.preventDefault(); const panel=document.querySelector('[data-investor-settings-panel]'); const body=Object.fromEntries([...panel.querySelectorAll('[data-investor-setting]')].map(i=>[i.dataset.investorSetting,i.type==='checkbox'?i.checked:i.value])); api(investorFundingRoutes.settings,{method:'PATCH',body}).then(async()=>{ investorFundingState.settingsLoaded=false; await loadInvestorFundingSettings(true); panel.remove(); await injectInvestorFundingSettingsPanel(); alert('Investor funding settings saved.'); }).catch(err=>alert(investorApiError(err,'settings'))); }
});
