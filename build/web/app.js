const defaultApiConfig = {
  baseUrl: 'https://grow-microfinance-api-production.up.railway.app',
  endpoints: {
    login: '/auth/login',
    adminDashboard: '/admin/dashboard',
    adminLoanApplications: '/api/loan-applications',
    adminLoanApplicationApprove: '/loan-applications/{id}/approve',
    staffTodayCollections: '/staff/today-collections',
    staffPayments: '/staff/payments',
    staffActiveLoans: '/staff/active-loans',
    staffLoanApplications: '/loan-applications',
    staffLoanApplicationApprove: '/staff/loan-applications/{id}/approve',
    loanApplicationReject: '/loan-applications/{id}/reject',
    loanRepayments: '/loans/{id}/repayments',
    customerProfile: '/customer/me',
    customerLoans: '/customer/loans',
    customerLoanPayments: '/customer/loans/{id}/payments',
    loanApplications: '/api/loan-applications',
    adminCustomers: '/customers',
    customers: '/customers',
    leads: '/leads',
    leadConvert: '/leads/{id}/convert-to-customer',
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

const storageKeys = { token: 'gm_jwt', role: 'gm_role' };

const appMain = document.querySelector('.app-main');
const loginCard = document.querySelector('#login-card');
const loginForm = document.querySelector('#login-form');
const loginMessage = document.querySelector('#login-message');
const loginSubmit = document.querySelector('#login-submit');
const loginSubmitLabel = document.querySelector('#login-submit-label');
const loginSpinner = document.querySelector('#login-spinner');
const dashboards = document.querySelector('#dashboards');
const userRoleChip = document.querySelector('#user-role');
const logoutBtn = document.querySelector('#logout-btn');

let toastContainer;

const adminPanel = document.querySelector('#admin-panel');
const adminMetrics = document.querySelector('#admin-metrics');
const adminApplications = document.querySelector('#admin-applications');
const adminApplicationsMessage = document.querySelector('#admin-applications-message');
const adminMenuItems = document.querySelectorAll('.admin-menu-item');
const adminSections = document.querySelectorAll('.admin-section');
const adminLoanApplicationsSection = document.querySelector('[data-section="loan-applications"]');
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
const adminDocumentsSection = document.querySelector(
  '.admin-content .admin-section[data-section="documents"]'
);

let adminLoanApplicationsMessage;
let adminLoanApplicationsTableBody;
let adminLoanApplicationsTable;
let adminRefreshLoanApplicationsBtn;
let adminLoanApplicationsInitialized = false;
let adminLoanApplicationsStatusFilter;

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

async function api(path, { method = 'GET', body } = {}) {
  const { token } = getSession();
  const shouldSendJson = body !== undefined || !['GET', 'HEAD'].includes(method);
  const headers = { Accept: 'application/json' };
  if (shouldSendJson) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  // When the backend expects JSON but no body is provided (e.g., submit endpoint),
  // send an empty object to avoid framework parsers returning HTML 400 pages.
  const payload = body !== undefined ? JSON.stringify(body) : shouldSendJson ? '{}' : undefined;

  let response;
  const url = `${apiConfig.baseUrl}${path}`;
  const requestOptions = { method, headers, body: payload };
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
    throw new Error("Couldn't reach the server. Please check your connection.");
  }

  const { data, raw } = await parseResponse(response.clone());
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
    throw error;
  }
  return enrichedData;
}

api.get = (path, options = {}) => api(path, { ...options, method: 'GET' });

async function apiRequest(path, { method = 'GET', body } = {}) {
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
  const amount = Number(value ?? 0);
  return amount ? `$${amount.toFixed(2)}` : '—';
}

function formatDate(value) {
  if (!value) return '';
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
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

  const base = getApiBaseUrl().replace(/\/+$/, '');
  if (filePath.startsWith('/')) return `${base}${filePath}`;
  return `${base}/${filePath}`;
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
  };

  const badgeClass = badgeClassMap[normalized] || 'badge-neutral';
  return `<span class="badge ${badgeClass}">${normalized}</span>`;
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
    const status = app.status || app.application_status || '-';
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
      <td>${Number(appliedAmount).toLocaleString('en-LK', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })}</td>
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
    // Some deployments include a default status filter in the endpoint config; strip it so "All"
    // truly fetches every application unless a user-selected filter is applied.
    let path = endpoint('adminLoanApplications') || endpoint('loanApplications') || '/api/loan-applications';
    path = path.replace(/([?&])status=[^&]*/gi, '').replace(/[?&]$/, '');

    const separator = path.includes('?') ? '&' : '?';
    path += `${separator}status=${encodeURIComponent(statusFilter || 'ALL')}`;

    const response = await api(path);
    console.log('Admin loan applications (all statuses)', response);

    const normalizedApplications = normalizeApplicationsResponse(response);
    const sortedApplications = [...normalizedApplications].sort((a, b) => {
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
  resetCustomerKycProfileState();
  if (customerDetailBody) customerDetailBody.innerHTML = '';
  setInlineAlert(customerDetailMessage, '');
  customerDetailLoading?.classList.add('hidden');
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
    showToast('Calling API... (debug)', 'info');
    await apiRequest(`/customers/${encodeURIComponent(customerId)}/kyc-profile`, {
      method: 'PATCH',
      body: JSON.stringify(body),
    });
    showToast('KYC profile saved.');
    await loadCustomerDetail(customerId);
  } catch (error) {
    console.error('Failed to save KYC profile', error);
    showToast('Failed to save KYC profile.', 'error');
  } finally {
    if (button) {
      button.disabled = false;
      button.textContent = originalText || 'Save KYC profile';
    }
  }
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

  const detailFields = [
    { label: 'Customer code', value: code },
    { label: 'Full name', value: name },
    { label: 'NIC', value: nic },
    { label: 'Mobile', value: mobile },
    { label: 'Address', value: address },
    { label: 'Business type', value: businessType },
    { label: 'KYC status', value: renderCustomerStatusBadge(kycStatus) },
    { label: 'Eligibility status', value: renderCustomerStatusBadge(eligibilityStatus) },
  ];

  customerDetailBody.innerHTML = `
    <div class="detail-grid">
      ${detailFields
        .map(
          ({ label, value }) => `
            <div class="detail-row">
              <p class="muted">${label}</p>
              <div class="detail-value">${value || '—'}</div>
            </div>
          `,
        )
        .join('')}
    </div>
  `;

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

  const extendedKycSection = document.createElement('div');
  extendedKycSection.className = 'customer-kyc-actions';

  const extendedHeader = document.createElement('div');
  extendedHeader.className = 'section-header';
  const extendedTitle = document.createElement('h3');
  extendedTitle.textContent = 'Extended KYC profile';
  extendedHeader.appendChild(extendedTitle);
  extendedKycSection.appendChild(extendedHeader);

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
    createSelectField('Civil status', 'civilStatus', [
      { value: '', text: 'Select status' },
      { value: 'SINGLE', text: 'Single' },
      { value: 'MARRIED', text: 'Married' },
      { value: 'WIDOWED', text: 'Widowed' },
      { value: 'DIVORCED', text: 'Divorced' },
    ], { id: 'civil_status' }),
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
    createInputField('Number of dependents', 'dependentsCount', { type: 'number', id: 'dependents_count' }),
  ]);

  appendSection('Customer type & income', [
    createSelectField('Customer type', 'customerType', [
      { value: '', text: 'Select type' },
      { value: 'SALARIED', text: 'Salaried' },
      { value: 'SELF_EMPLOYED', text: 'Self-employed' },
      { value: 'OTHER', text: 'Other' },
    ], { id: 'customer_type' }),
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
    createCheckboxField('I confirm the above information is accurate and true.', 'consentDataProcessing', { id: 'consent_confirm' }),
    createCheckboxField(
      'I authorize Grow Microfinance to verify this information with banks/employers if necessary.',
      'consentCreditChecks',
      { id: 'consent_authorize' },
    ),
  ]);

  extendedKycSection.appendChild(extendedForm);

  const saveKycProfileBtn = document.createElement('button');
  saveKycProfileBtn.type = 'button';
  saveKycProfileBtn.className = 'primary';
  saveKycProfileBtn.textContent = 'Save KYC profile';
  saveKycProfileBtn.id = 'save-kyc-profile-btn';

  const existingSaveKycProfileBtn = document.getElementById('save-kyc-profile-btn');
  if (existingSaveKycProfileBtn) existingSaveKycProfileBtn.remove();

  saveKycProfileBtn.addEventListener('click', async () => {
    console.log('[KYC] Save button clicked', { customerId });
    showToast('Saving KYC... (debug)', 'info');
    try {
      if (customerId) await saveCustomerKycProfile(customerId, saveKycProfileBtn);
      else {
        console.warn('[KYC] Missing customerId in click handler');
        showToast('Customer ID missing (debug).', 'error');
      }
    } catch (e) {
      console.error('[KYC] Click handler failed', e);
      showToast(`Save failed (debug): ${e.message || e}`, 'error');
    }
  });

  extendedKycSection.appendChild(saveKycProfileBtn);

  customerDetailBody.appendChild(extendedKycSection);

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
    customerDetailState.customer = customer;
    populateCustomerKycProfileFromCustomer(customer);
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

  if (target === 'loan-applications') {
    ensureAdminLoanApplicationsUI();
    renderAdminLoanApplications();
    loadAdminLoanApplicationsAll();
  } else if (target === 'documents') {
    loadAdminDocuments();
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
  dashboards.classList.toggle('hidden', !role);
  userRoleChip.classList.toggle('hidden', !role);
  logoutBtn.classList.toggle('hidden', !role);
  loginCard?.classList.toggle('hidden', !!role);

  adminPanel.classList.toggle('hidden', role !== 'admin');
  if (role === 'admin') showAdminSection('dashboard');
  else {
    resetAdminLoanApplicationsState();
    resetAdminCustomersState();
    resetAdminLeadsState();
  }
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
    const tenure = app.tenure_months ?? app.loan_details?.tenure_months;
    const amount = app.applied_amount ?? app.loan_details?.applied_amount;
    const loanType = app.loan_type ?? app.loan_details?.loan_type ?? 'Loan';
    node.querySelector('.review-meta').textContent =
      `${loanType} • ${amount ? formatCurrency(amount) : 'Amount pending'}${
        tenure ? ` • ${tenure} mo` : ''
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
  setInlineAlert(adminApplicationsMessage, '');
  try {
    const [data, applicationsResponse] = await Promise.all([
      api(endpoint('adminDashboard')),
      api(`${endpoint('staffLoanApplications')}?status=STAFF_APPROVED`),
    ]);

    const metrics = [
      { label: 'Total customers', value: data.total_customers ?? '—', hint: 'Across all segments' },
      { label: 'Active loans', value: data.active_loans ?? '—', hint: 'Current portfolio' },
      { label: 'Payments today', value: data.payments_today ?? '—', hint: 'Recorded settlements' },
    ];
    renderMetrics(adminMetrics, metrics);

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
  const tenure = app.tenure_months ?? app.loan_details?.tenure_months;
  const fields = [
    ['Customer', app.customer_name || app.customer || '—'],
    ['Loan type', app.loan_type || app.loan_details?.loan_type || '—'],
    [
      'Requested amount',
      formatCurrency(app.applied_amount ?? app.loan_details?.applied_amount ?? app.amount ?? app.approved_amount),
    ],
    ['Tenure', tenure ? `${tenure} months` : '—'],
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
    const status = (app.status || '').toUpperCase();
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
        app?.approved_tenure ??
        app?.tenure_months ??
        app?.loan_details?.loan_tenure ??
        app?.tenure ??
        appSummary?.approved_tenure ??
        appSummary?.tenure_months ??
        appSummary?.loan_details?.loan_tenure ??
        appSummary?.tenure;

    const handleApprove = async () => {
      try {
        setInlineAlert(applicationModalMessage, 'Submitting approval...', 'success');
        const endpointKey = role === 'staff' ? 'staffLoanApplicationApprove' : 'adminLoanApplicationApprove';
        await api(endpoint(endpointKey, { id: appId }), {
          method: 'POST',
          body: { approved_amount: approvedAmount, approved_tenure: approvedTenure },
        });
        setInlineAlert(applicationModalMessage, 'Application approved.', 'success');
        closeApplicationDetail();
        if (role === 'staff') await loadStaff();
        if (role === 'admin') await loadAdmin();
      } catch (err) {
        console.error(err);
        setInlineAlert(applicationModalMessage, err.message || 'Failed to approve', 'error');
      }
    };

    const handleReject = async () => {
      const reason = prompt('Reason for rejection (optional)') || '';
      try {
        setInlineAlert(applicationModalMessage, 'Submitting rejection...', 'success');
        await api(endpoint('loanApplicationReject', { id: appId }), {
          method: 'POST',
          body: reason ? { reason } : {},
        });
        setInlineAlert(applicationModalMessage, 'Application rejected.', 'success');
        if (role === 'staff') await loadStaff();
        if (role === 'admin') await loadAdmin();
      } catch (err) {
        console.error(err);
        setInlineAlert(applicationModalMessage, err.message || 'Failed to reject', 'error');
      }
    };

    if (role === 'staff' && status === 'SUBMITTED') {
      addAction('Reject', handleReject, 'ghost');
      addAction('Approve', handleApprove, 'primary');
    } else if (role === 'admin' && status === 'STAFF_APPROVED') {
      addAction('Reject', handleReject, 'ghost');
      addAction('Approve', handleApprove, 'primary');
    } else {
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
  const payload = {
    loan_type: selectedLoanType,
    loan_purpose: values.loan_purpose || '',
    loan_details: loanDetails,
    applicant_details: applicantDetails,
    type_specific: typeSpecific,
  };
  switch (selectedLoanType) {
    case 'Grow Online Business Loan':
      typeSpecific.store_url = values.store_url || '';
      typeSpecific.store_platform = values.store_platform || '';
      break;
    case 'Grow Business Loan':
      typeSpecific.business_name = values.business_name || '';
      typeSpecific.business_registration = values.business_registration || '';
      typeSpecific.business_address = values.business_address || '';
      typeSpecific.business_type = values.business_type || '';
      typeSpecific.monthly_sales = Number(values.monthly_sales) || 0;
      break;
    case 'Grow Personal Loan':
      typeSpecific.employment_status = values.employment_status || '';
      typeSpecific.employment_type = values.employment_type || '';
      typeSpecific.employer_name = values.employer_name || '';
      typeSpecific.net_monthly_salary = Number(values.net_monthly_salary) || 0;
      typeSpecific.guarantor_name = values.guarantor_name || '';
      typeSpecific.guarantor_contact = values.guarantor_contact || '';
      break;
    case 'Grow Team Loan':
      typeSpecific.group_name = values.group_name || values.team_name || '';
      typeSpecific.number_of_members =
        Number(values.number_of_members ?? values.member_count) || 0;
      typeSpecific.team_leader_name = values.team_leader_name || '';
      typeSpecific.team_leader_nic = values.team_leader_nic || '';
      typeSpecific.team_leader_mobile = values.team_leader_mobile || '';
      typeSpecific.group_savings_amount = Number(values.group_savings_amount) || 0;
      typeSpecific.group_business_activity = values.group_business_activity || '';
      typeSpecific.meeting_location = values.meeting_location || '';
      payload.group_name = typeSpecific.group_name;
      payload.number_of_members = typeSpecific.number_of_members;
      payload.team_leader_name = typeSpecific.team_leader_name;
      payload.team_leader_nic = typeSpecific.team_leader_nic;
      payload.team_leader_mobile = typeSpecific.team_leader_mobile;
      payload.group_savings_amount = typeSpecific.group_savings_amount;
      payload.group_business_activity = typeSpecific.group_business_activity;
      payload.meeting_location = typeSpecific.meeting_location;
      payload.team_name = values.team_name || typeSpecific.group_name;
      payload.member_count = values.member_count || typeSpecific.number_of_members;
      break;
    default:
      break;
  }

  return payload;
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
      ['Group savings amount', formatCurrency(data.type_specific.group_savings_amount)],
      ['Group business activity', data.type_specific.group_business_activity || '—'],
      ['Meeting location', data.type_specific.meeting_location || '—']
    );
  }

  reviewSummary.innerHTML = '';
  [...rows, ...typeSpecificRows].forEach(([label, value]) => {
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
  const payload = normalizeApplicationPayload(buildApplicationPayload());
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

async function uploadDocumentsIfNeeded() {
  if (!currentDraftId || selectedDocuments.size === 0) return;
  for (const [docType, file] of selectedDocuments.entries()) {
    const formData = new FormData();
    formData.append('file', file);
    // Align document_type values with the backend's expected enums (same as mobile app)
    // so submitted applications aren't rejected for "missing" files.
    formData.append('document_type', mapDocumentTypeToApi(docType));
    await apiMultipart(`${endpoint('loanApplications')}/${currentDraftId}/documents`, formData);
  }
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

  if (window.location.pathname === '/lead') {
    showPublicLeadPage();
    return;
  }

  if (window.location.pathname === '/kyc') {
    showPublicKycPage();
    return;
  }

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
    const token =
      data.access_token || data.token || data.accessToken || data.jwt;
    if (!token || !data.role) {
      throw new Error('Invalid response from server.');
    }
    saveSession(token, data.role);
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

newApplicationBtn?.addEventListener('click', async () => {
  const eligibleCustomer = await ensureCustomerEligibilityForApplication();
  if (!eligibleCustomer) return;

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

adminMenuItems.forEach((item) => {
  item.addEventListener('click', () => {
    const target = item.dataset.section || 'dashboard';
    if (target === 'documents') handleDocumentRoute(documentRouteBase, { pushState: true });
    else if (target === 'customers') handleCustomerRoute(customerRouteHomePath, { pushState: true });
    else if (target === 'leads') handleLeadsRoute(leadsRouteBase, { pushState: true });
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
  else if (staffRoutes[path]) renderStaffRoute(path);
  else if (handleLeadsRoute(path)) {
    // handled
  } else if (!handleDocumentRoute(path)) {
    clearCustomerRouteView();
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

closeApplicationModal?.addEventListener('click', closeApplicationDetail);

prevStepBtn?.addEventListener('click', goToPrevStep);
nextStepBtn?.addEventListener('click', goToNextStep);
saveDraftBtn?.addEventListener('click', () => saveDraft(true));
submitApplicationBtn?.addEventListener('click', submitApplication);

bootstrap();
