/**
 * Settings module static config — roles matrix, sessions, billing, prefs.
 * Account/org fields are hydrated from userData / organizationData at runtime.
 */

export const SETTINGS_NAV = [
  { to: '/dashboard/settings/account', id: 'account', label: 'Account', icon: 'User' },
  { to: '/dashboard/settings/organization', id: 'organization', label: 'Organization', icon: 'Building2' },
  { to: '/dashboard/settings/security', id: 'security', label: 'Security', icon: 'Shield' },
  { to: '/dashboard/settings/notifications', id: 'notifications', label: 'Notifications', icon: 'Bell' },
  {
    to: '/dashboard/settings/roles-permissions',
    id: 'roles',
    label: 'Roles & Permissions',
    icon: 'KeyRound',
  },
  { to: '/dashboard/settings/billing', id: 'billing', label: 'Billing', icon: 'CreditCard' },
];

export const TIMEZONES = [
  'Asia/Dubai (GMT+4)',
  'Asia/Karachi (GMT+5)',
  'Europe/London (GMT+0)',
  'America/New_York (GMT-4)',
  'UTC',
];

export const LANGUAGES = [
  { value: 'en', label: 'English' },
  { value: 'ar', label: 'Arabic' },
  { value: 'ur', label: 'Urdu' },
];

export const JOB_TITLES = [
  'Super Administrator',
  'Product Manager',
  'Engineering Lead',
  'Designer',
  'Operations',
];

/** Roles shown in settings (aligned with product roles list). */
export const SETTINGS_ROLES = [
  { id: 'super-admin', label: 'Super Admin', description: 'Full platform control' },
  { id: 'org-owner', label: 'Organization Owner', description: 'Owns billing and org lifecycle' },
  { id: 'org-admin', label: 'Organization Admin', description: 'Manages users and departments' },
  { id: 'dept-manager', label: 'Department Manager', description: 'Owns department projects & teams' },
  { id: 'team-lead', label: 'Team Lead', description: 'Leads squad delivery' },
  { id: 'employee', label: 'Employee', description: 'Standard contributor access' },
  { id: 'hr', label: 'HR', description: 'People ops and onboarding' },
  { id: 'guest', label: 'Guest', description: 'Limited read-only access' },
];

/** Map userData.role strings → settings role ids for counts. */
export const ROLE_COUNT_MAP = {
  'Super Admin': 'super-admin',
  'Org Owner': 'org-owner',
  'Org Admin': 'org-admin',
  'Dept Manager': 'dept-manager',
  'Team Lead': 'team-lead',
  Employee: 'employee',
  HR: 'hr',
  Guest: 'guest',
};

export const PERMISSIONS = [
  { id: 'manage_users', label: 'Manage Users' },
  { id: 'manage_roles', label: 'Manage Roles' },
  { id: 'delete_projects', label: 'Delete Projects' },
  { id: 'manage_billing', label: 'View Billing' },
  { id: 'manage_org', label: 'Edit Organization' },
  { id: 'invite_members', label: 'Invite Members' },
  { id: 'view_audit', label: 'View Audit Logs' },
  { id: 'manage_files', label: 'Manage Files' },
];

/** permissionId → roleId → boolean */
export const PERMISSION_MATRIX = {
  manage_users: {
    'super-admin': true,
    'org-owner': true,
    'org-admin': true,
    'dept-manager': false,
    'team-lead': false,
    employee: false,
    hr: true,
    guest: false,
  },
  manage_roles: {
    'super-admin': true,
    'org-owner': true,
    'org-admin': true,
    'dept-manager': false,
    'team-lead': false,
    employee: false,
    hr: false,
    guest: false,
  },
  delete_projects: {
    'super-admin': true,
    'org-owner': true,
    'org-admin': true,
    'dept-manager': true,
    'team-lead': false,
    employee: false,
    hr: false,
    guest: false,
  },
  manage_billing: {
    'super-admin': true,
    'org-owner': true,
    'org-admin': false,
    'dept-manager': false,
    'team-lead': false,
    employee: false,
    hr: false,
    guest: false,
  },
  manage_org: {
    'super-admin': true,
    'org-owner': true,
    'org-admin': true,
    'dept-manager': false,
    'team-lead': false,
    employee: false,
    hr: false,
    guest: false,
  },
  invite_members: {
    'super-admin': true,
    'org-owner': true,
    'org-admin': true,
    'dept-manager': true,
    'team-lead': true,
    employee: false,
    hr: true,
    guest: false,
  },
  view_audit: {
    'super-admin': true,
    'org-owner': true,
    'org-admin': true,
    'dept-manager': false,
    'team-lead': false,
    employee: false,
    hr: false,
    guest: false,
  },
  manage_files: {
    'super-admin': true,
    'org-owner': true,
    'org-admin': true,
    'dept-manager': true,
    'team-lead': true,
    employee: true,
    hr: true,
    guest: false,
  },
};

export const ACTIVE_SESSIONS = [
  {
    id: 'sess-1',
    device: 'Chrome 126 · macOS 15.5',
    location: 'Dubai, UAE',
    ip: '185.76.44.12',
    lastActive: 'Active now',
    current: true,
  },
  {
    id: 'sess-2',
    device: 'Safari · iOS 18.5',
    location: 'Dubai, UAE',
    ip: '185.76.44.88',
    lastActive: '2 hours ago',
    current: false,
  },
  {
    id: 'sess-3',
    device: 'Edge 126 · Windows 11',
    location: 'Karachi, PK',
    ip: '39.42.118.203',
    lastActive: 'Yesterday',
    current: false,
  },
];

export const NOTIFICATION_GROUPS = [
  {
    id: 'channels',
    title: 'Channels',
    items: [
      {
        id: 'email',
        label: 'Email notifications',
        description: 'Receive updates at your work email',
        defaultOn: true,
      },
      {
        id: 'push',
        label: 'Push notifications',
        description: 'Browser and mobile push alerts',
        defaultOn: true,
      },
    ],
  },
  {
    id: 'activity',
    title: 'Activity',
    items: [
      {
        id: 'task_assigned',
        label: 'Task assigned',
        description: 'When someone assigns you a task',
        defaultOn: true,
      },
      {
        id: 'task_completed',
        label: 'Task completed',
        description: 'When a task you follow is marked done',
        defaultOn: false,
      },
      {
        id: 'meeting_reminders',
        label: 'Meeting reminders',
        description: '15 minutes before scheduled meetings',
        defaultOn: true,
      },
      {
        id: 'mentions',
        label: 'Mentions',
        description: 'When you are @mentioned in comments',
        defaultOn: true,
      },
      {
        id: 'weekly_digest',
        label: 'Weekly digest',
        description: 'Monday summary of projects and tasks',
        defaultOn: true,
      },
    ],
  },
];

export const CURRENT_PLAN = {
  name: 'Enterprise',
  price: '$499',
  cadence: 'per month',
  seats: 250,
  seatsUsed: 248,
  renewalDate: 'August 12, 2026',
  features: ['Unlimited projects', 'Audit logs', 'SSO ready', 'Priority support'],
};

export const PAYMENT_METHOD = {
  brand: 'Visa',
  last4: '4242',
  exp: '09/28',
  name: 'Ahsan Taqweem',
};

export const INVOICES = [
  {
    id: 'inv-2407',
    date: '2026-07-12',
    amount: '$499.00',
    status: 'paid',
    label: 'Jul 2026 · Enterprise',
  },
  {
    id: 'inv-2406',
    date: '2026-06-12',
    amount: '$499.00',
    status: 'paid',
    label: 'Jun 2026 · Enterprise',
  },
  {
    id: 'inv-2405',
    date: '2026-05-12',
    amount: '$499.00',
    status: 'paid',
    label: 'May 2026 · Enterprise',
  },
  {
    id: 'inv-2404',
    date: '2026-04-12',
    amount: '$299.00',
    status: 'paid',
    label: 'Apr 2026 · Growth',
  },
  {
    id: 'inv-2403',
    date: '2026-03-12',
    amount: '$299.00',
    status: 'failed',
    label: 'Mar 2026 · Growth',
  },
];

export const ORG_SIZES = ['1–50', '51–200', '201–500', '501–1000', '1000+'];
export const ORG_INDUSTRIES = [
  'Software & SaaS',
  'Logistics',
  'Healthcare',
  'Finance',
  'Education',
  'Retail',
  'Media',
];
