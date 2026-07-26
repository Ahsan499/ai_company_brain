/**
 * Audit log catalog — security/compliance trail.
 * Actors and targets reference real IDs from other *Data.js modules.
 * Reference “today”: 2026-07-26.
 */

export const REFERENCE_TODAY = '2026-07-26';

export const AUDIT_ACTIONS = [
  'create',
  'update',
  'delete',
  'login',
  'permission_change',
  'invite',
  'remove',
];

export const AUDIT_ACTION_META = {
  create: {
    label: 'Created',
    verb: 'created',
    tone: 'bg-emerald-50 text-emerald-700 ring-emerald-500/15',
    iconTone: 'bg-emerald-50 text-emerald-700 ring-emerald-500/15',
  },
  update: {
    label: 'Updated',
    verb: 'updated',
    tone: 'bg-primary/8 text-primary ring-primary/15',
    iconTone: 'bg-primary/8 text-primary ring-primary/15',
  },
  delete: {
    label: 'Deleted',
    verb: 'deleted',
    tone: 'bg-rose-50 text-rose-700 ring-rose-500/15',
    iconTone: 'bg-rose-50 text-rose-700 ring-rose-500/15',
  },
  login: {
    label: 'Logged in',
    verb: 'logged in',
    tone: 'bg-amber-50 text-amber-800 ring-amber-500/20',
    iconTone: 'bg-amber-50 text-amber-800 ring-amber-500/20',
  },
  permission_change: {
    label: 'Permission',
    verb: 'changed permissions on',
    tone: 'bg-amber-50 text-amber-800 ring-amber-500/20',
    iconTone: 'bg-amber-50 text-amber-800 ring-amber-500/20',
  },
  invite: {
    label: 'Invited',
    verb: 'invited',
    tone: 'bg-sky-50 text-sky-700 ring-sky-500/15',
    iconTone: 'bg-sky-50 text-sky-700 ring-sky-500/15',
  },
  remove: {
    label: 'Removed',
    verb: 'removed',
    tone: 'bg-rose-50 text-rose-700 ring-rose-500/15',
    iconTone: 'bg-rose-50 text-rose-700 ring-rose-500/15',
  },
};

export const AUDIT_MODULES = [
  'Organization',
  'User',
  'Department',
  'Project',
  'Task',
  'Team',
  'Meeting',
  'File',
  'Settings',
];

const MODULE_PATH = {
  Organization: (id) => `/dashboard/organizations/${id}`,
  User: (id) => `/dashboard/users/${id}`,
  Department: (id) => `/dashboard/departments/${id}`,
  Project: (id) => `/dashboard/projects/${id}`,
  Task: (id) => `/dashboard/tasks/${id}`,
  Team: (id) => `/dashboard/teams/${id}`,
  Meeting: (id) => `/dashboard/meetings/${id}`,
  File: (id) => `/dashboard/files/${id}`,
  Settings: () => null,
};

function log(
  id,
  actorId,
  actorName,
  actorInitials,
  action,
  module,
  entityId,
  entityName,
  timestamp,
  ip,
  device,
  diffs = null,
  metadata = null
) {
  const pathFn = MODULE_PATH[module];
  const href = entityId && pathFn ? pathFn(entityId) : null;
  return {
    id,
    actorId,
    actorName,
    actorInitials,
    action,
    module,
    entityId,
    entityName,
    href,
    timestamp,
    ip,
    device,
    diffs,
    metadata,
  };
}

const IP = {
  dubai: '185.76.44.12',
  karachi: '39.42.118.203',
  lahore: '119.160.88.41',
  london: '51.148.22.90',
  vpn: '104.28.214.55',
};

const DEV = {
  mac: 'Chrome 126 · macOS 15.5',
  win: 'Edge 126 · Windows 11',
  ios: 'Safari · iOS 18.5',
  android: 'Chrome · Android 15',
  safari: 'Safari 18 · macOS 15.5',
};

/**
 * 72 entries spanning ~2026-07-05 → 2026-07-26 (newest first in source order).
 */
export const AUDIT_LOGS = [
  log('al-072', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'login', 'Settings', null, 'Workspace', '2026-07-26T14:42:00', IP.dubai, DEV.mac, null, { session: 'sess_9f2a', mfa: true }),
  log('al-071', 'usr-raza', 'M. Raza', 'MR', 'update', 'Task', 'tsk-001', 'Build Projects list & board views', '2026-07-26T13:18:00', IP.karachi, DEV.mac, [{ field: 'status', before: 'Todo', after: 'In Progress' }]),
  log('al-070', 'usr-lina', 'Lina Noor', 'LN', 'create', 'File', 'file-002', 'header.fig', '2026-07-26T12:05:00', IP.dubai, DEV.safari),
  log('al-069', 'usr-sara', 'Sara Khan', 'SK', 'update', 'Project', 'prj-acb-core', 'AI Company Brain Core', '2026-07-26T11:40:00', IP.dubai, DEV.mac, [{ field: 'progress', before: '64%', after: '68%' }]),
  log('al-068', 'usr-omar', 'Omar Farooq', 'OF', 'update', 'Task', 'tsk-007', 'Implement token bucket limiter', '2026-07-26T10:22:00', IP.lahore, DEV.win, [{ field: 'priority', before: 'High', after: 'Urgent' }]),
  log('al-067', 'usr-hira', 'Hira Ali', 'HA', 'invite', 'User', 'usr-guest', 'Jordan Lee', '2026-07-26T09:15:00', IP.dubai, DEV.mac, null, { role: 'Guest' }),
  log('al-066', 'usr-bilal', 'Bilal Ahmed', 'BA', 'update', 'Meeting', 'mtg-005', 'Cold Chain ops huddle', '2026-07-26T08:50:00', IP.karachi, DEV.android, [{ field: 'status', before: 'Scheduled', after: 'Completed' }]),
  log('al-065', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'permission_change', 'User', 'usr-omar', 'Omar Farooq', '2026-07-25T18:30:00', IP.dubai, DEV.mac, [{ field: 'role', before: 'Employee', after: 'Team Lead' }]),
  log('al-064', 'usr-nadia', 'Nadia Rehman', 'NR', 'create', 'Task', 'tsk-018', 'Compile site criteria', '2026-07-25T16:12:00', IP.karachi, DEV.mac),
  log('al-063', 'usr-kamran', 'Kamran Shah', 'KS', 'update', 'Project', 'prj-mfa-rollout', 'Clinic MFA Rollout', '2026-07-25T15:05:00', IP.lahore, DEV.win, [{ field: 'status', before: 'Planning', after: 'Active' }]),
  log('al-062', 'usr-imran', 'Imran Qureshi', 'IQ', 'create', 'File', 'file-013', 'q2-control-matrix.xlsx', '2026-07-25T14:20:00', IP.dubai, DEV.mac),
  log('al-061', 'usr-mehwish', 'Mehwish Rauf', 'MR', 'update', 'Task', 'tsk-024', 'Gather bank reconciliations', '2026-07-25T13:00:00', IP.karachi, DEV.mac, [{ field: 'status', before: 'In Progress', after: 'In Review' }]),
  log('al-060', 'usr-lina', 'Lina Noor', 'LN', 'update', 'Task', 'tsk-011', 'Motion spring presets', '2026-07-25T11:45:00', IP.dubai, DEV.safari, [{ field: 'status', before: 'In Progress', after: 'Done' }]),
  log('al-059', 'usr-raza', 'M. Raza', 'MR', 'login', 'Settings', null, 'Workspace', '2026-07-25T09:02:00', IP.karachi, DEV.mac, null, { mfa: true }),
  log('al-058', 'usr-noor', 'Noor Hassan', 'NH', 'update', 'Project', 'prj-pos', 'Store POS Checklist', '2026-07-24T17:40:00', IP.lahore, DEV.ios, [{ field: 'progress', before: '40%', after: '52%' }]),
  log('al-057', 'usr-haris', 'Haris Naveed', 'HN', 'create', 'Meeting', 'mtg-010', 'Partner districts onboarding', '2026-07-24T16:10:00', IP.dubai, DEV.mac),
  log('al-056', 'usr-saima', 'Prof. Saima Riaz', 'SR', 'update', 'Team', 'team-canvas-partnerships', 'Partnerships', '2026-07-24T15:00:00', IP.london, DEV.mac, [{ field: 'lead', before: 'Haris Naveed', after: 'Prof. Saima Riaz' }]),
  log('al-055', 'usr-fahad', 'Fahad Mirza', 'FM', 'create', 'File', 'file-014', 'ramadan-moodboard.png', '2026-07-24T13:25:00', IP.dubai, DEV.mac),
  log('al-054', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'create', 'Project', 'prj-design-sys', 'Design System 2.0', '2026-07-24T11:00:00', IP.dubai, DEV.mac),
  log('al-053', 'usr-amna', 'Dr. Amna Siddiqui', 'AS', 'update', 'Department', 'dept-pulse-clinical', 'Clinical', '2026-07-24T10:15:00', IP.karachi, DEV.win, [{ field: 'manager', before: 'Kamran Shah', after: 'Dr. Amna Siddiqui' }]),
  log('al-052', 'usr-usman', 'Usman Tariq', 'UT', 'update', 'Task', 'tsk-016', 'Fleet assignment rules', '2026-07-23T19:05:00', IP.karachi, DEV.android, [{ field: 'assignee', before: 'Bilal Ahmed', after: 'Usman Tariq' }]),
  log('al-051', 'usr-sara', 'Sara Khan', 'SK', 'create', 'Meeting', 'mtg-001', 'Product Sync', '2026-07-23T17:30:00', IP.dubai, DEV.mac),
  log('al-050', 'usr-zain', 'Zain Malik', 'ZM', 'permission_change', 'User', 'usr-mehwish', 'Mehwish Rauf', '2026-07-23T16:00:00', IP.dubai, DEV.mac, [{ field: 'role', before: 'Employee', after: 'Org Admin' }]),
  log('al-049', 'usr-omar', 'Omar Farooq', 'OF', 'create', 'File', 'file-003', 'limiter-rfc.md', '2026-07-23T14:40:00', IP.lahore, DEV.win),
  log('al-048', 'usr-raza', 'M. Raza', 'MR', 'update', 'Team', 'team-nova-backend', 'Backend', '2026-07-23T12:20:00', IP.karachi, DEV.mac, [{ field: 'members', before: '2', after: '3' }]),
  log('al-047', 'usr-bilal', 'Bilal Ahmed', 'BA', 'create', 'Task', 'tsk-015', 'Alert thresholds for freezers', '2026-07-23T10:05:00', IP.karachi, DEV.mac),
  log('al-046', 'usr-lina', 'Lina Noor', 'LN', 'login', 'Settings', null, 'Workspace', '2026-07-23T08:40:00', IP.dubai, DEV.safari, null, { mfa: true }),
  log('al-045', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'remove', 'User', 'usr-ayesha', 'Ayesha Bukhari', '2026-07-22T18:15:00', IP.dubai, DEV.mac, null, { reason: 'Workspace suspended' }),
  log('al-044', 'usr-hira', 'Hira Ali', 'HA', 'update', 'Task', 'tsk-013', 'Welcome email templates', '2026-07-22T16:50:00', IP.dubai, DEV.mac, [{ field: 'status', before: 'Todo', after: 'In Progress' }]),
  log('al-043', 'usr-nadia', 'Nadia Rehman', 'NR', 'update', 'Project', 'prj-harbor-exp', 'Regional Expansion Map', '2026-07-22T15:10:00', IP.karachi, DEV.mac, [{ field: 'priority', before: 'Medium', after: 'High' }]),
  log('al-042', 'usr-imran', 'Imran Qureshi', 'IQ', 'create', 'Meeting', 'mtg-007', 'Q2 Audit kickoff', '2026-07-22T13:00:00', IP.dubai, DEV.mac),
  log('al-041', 'usr-kamran', 'Kamran Shah', 'KS', 'create', 'File', 'file-017', 'mfa-rollout-plan.docx', '2026-07-22T11:30:00', IP.lahore, DEV.win),
  log('al-040', 'usr-sara', 'Sara Khan', 'SK', 'update', 'Organization', 'org-nova', 'NovaTech Solutions', '2026-07-22T09:45:00', IP.dubai, DEV.mac, [{ field: 'plan', before: 'Growth', after: 'Enterprise' }]),
  log('al-039', 'usr-raza', 'M. Raza', 'MR', 'delete', 'File', 'file-023', 'vite.config.snippet.js', '2026-07-21T20:00:00', IP.karachi, DEV.mac, null, { note: 'Duplicate draft removed' }),
  log('al-038', 'usr-omar', 'Omar Farooq', 'OF', 'update', 'Task', 'tsk-008', 'Add OpenTelemetry traces', '2026-07-21T17:25:00', IP.lahore, DEV.win, [{ field: 'status', before: 'In Progress', after: 'In Review' }]),
  log('al-037', 'usr-lina', 'Lina Noor', 'LN', 'create', 'Task', 'tsk-010', 'Document color tokens', '2026-07-21T15:40:00', IP.dubai, DEV.safari),
  log('al-036', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'create', 'Team', 'team-nova-frontend', 'Frontend', '2026-07-21T14:00:00', IP.dubai, DEV.mac),
  log('al-035', 'usr-mehwish', 'Mehwish Rauf', 'MR', 'login', 'Settings', null, 'Workspace', '2026-07-21T09:10:00', IP.karachi, DEV.mac, null, { mfa: false }),
  log('al-034', 'usr-noor', 'Noor Hassan', 'NH', 'create', 'Meeting', 'mtg-016', 'Store POS checklist alignment', '2026-07-20T16:30:00', IP.lahore, DEV.ios),
  log('al-033', 'usr-haris', 'Haris Naveed', 'HN', 'update', 'Project', 'prj-partner-districts', 'Partner Districts Onboarding', '2026-07-20T14:50:00', IP.dubai, DEV.mac, [{ field: 'progress', before: '22%', after: '35%' }]),
  log('al-032', 'usr-bilal', 'Bilal Ahmed', 'BA', 'update', 'Project', 'prj-cold-chain', 'Cold Chain Hub', '2026-07-20T12:15:00', IP.karachi, DEV.mac, [{ field: 'status', before: 'Active', after: 'On Hold' }, { field: 'progress', before: '55%', after: '55%' }]),
  log('al-031', 'usr-saima', 'Prof. Saima Riaz', 'SR', 'invite', 'User', 'usr-haris', 'Haris Naveed', '2026-07-20T10:00:00', IP.london, DEV.mac, null, { role: 'Employee' }),
  log('al-030', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'permission_change', 'Department', 'dept-nova-eng', 'Engineering', '2026-07-19T18:40:00', IP.dubai, DEV.mac, [{ field: 'visibility', before: 'Org', after: 'Restricted' }]),
  log('al-029', 'usr-raza', 'M. Raza', 'MR', 'create', 'Task', 'tsk-009', 'Document tenant routing', '2026-07-19T16:20:00', IP.karachi, DEV.mac),
  log('al-028', 'usr-lina', 'Lina Noor', 'LN', 'update', 'File', 'file-006', 'token-palette.png', '2026-07-19T14:05:00', IP.dubai, DEV.safari, [{ field: 'folder', before: 'Design', after: 'Assets' }]),
  log('al-027', 'usr-sara', 'Sara Khan', 'SK', 'update', 'Task', 'tsk-004', 'Product review of milestone UX', '2026-07-19T11:30:00', IP.dubai, DEV.mac, [{ field: 'status', before: 'In Review', after: 'Done' }]),
  log('al-026', 'usr-kamran', 'Kamran Shah', 'KS', 'create', 'Meeting', 'mtg-008', 'MFA rollout checkpoint', '2026-07-18T17:00:00', IP.lahore, DEV.win),
  log('al-025', 'usr-fahad', 'Fahad Mirza', 'FM', 'update', 'Project', 'prj-ramadan', 'Ramadan Campaign Board', '2026-07-18T15:20:00', IP.dubai, DEV.mac, [{ field: 'priority', before: 'Low', after: 'Medium' }]),
  log('al-024', 'usr-usman', 'Usman Tariq', 'UT', 'login', 'Settings', null, 'Workspace', '2026-07-18T08:55:00', IP.vpn, DEV.android, null, { mfa: true, note: 'VPN session' }),
  log('al-023', 'usr-imran', 'Imran Qureshi', 'IQ', 'update', 'Project', 'prj-q2-audit', 'Q2 Compliance Audit', '2026-07-17T19:10:00', IP.dubai, DEV.mac, [{ field: 'progress', before: '70%', after: '78%' }]),
  log('al-022', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'create', 'Department', 'dept-nova-design', 'Design', '2026-07-17T16:45:00', IP.dubai, DEV.mac),
  log('al-021', 'usr-hira', 'Hira Ali', 'HA', 'create', 'Task', 'tsk-014', 'Manager approval flow UI', '2026-07-17T14:00:00', IP.dubai, DEV.mac),
  log('al-020', 'usr-omar', 'Omar Farooq', 'OF', 'update', 'Project', 'prj-api-gw', 'API Gateway v2', '2026-07-17T11:20:00', IP.lahore, DEV.win, [{ field: 'progress', before: '38%', after: '42%' }]),
  log('al-019', 'usr-nadia', 'Nadia Rehman', 'NR', 'create', 'File', 'file-011', 'hub-photo-north.jpg', '2026-07-16T17:30:00', IP.karachi, DEV.mac),
  log('al-018', 'usr-raza', 'M. Raza', 'MR', 'remove', 'Team', 'team-nova-devops', 'DevOps', '2026-07-16T15:10:00', IP.karachi, DEV.mac, null, { memberRemoved: 'Omar Farooq', note: 'Reassigned to Backend' }),
  log('al-017', 'usr-lina', 'Lina Noor', 'LN', 'create', 'Meeting', 'mtg-002', 'Design Review', '2026-07-16T13:00:00', IP.dubai, DEV.safari),
  log('al-016', 'usr-sara', 'Sara Khan', 'SK', 'invite', 'User', 'usr-omar', 'Omar Farooq', '2026-07-16T10:40:00', IP.dubai, DEV.mac, null, { role: 'Employee' }),
  log('al-015', 'usr-amna', 'Dr. Amna Siddiqui', 'AS', 'update', 'Project', 'prj-patient-intake', 'Patient Intake Digitization', '2026-07-15T18:00:00', IP.karachi, DEV.win, [{ field: 'status', before: 'Planning', after: 'Active' }]),
  log('al-014', 'usr-bilal', 'Bilal Ahmed', 'BA', 'create', 'Meeting', 'mtg-013', 'Fleet readiness review', '2026-07-15T15:30:00', IP.karachi, DEV.mac),
  log('al-013', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'update', 'Settings', null, 'Workspace security', '2026-07-15T12:00:00', IP.dubai, DEV.mac, [{ field: 'mfa_required', before: 'Optional', after: 'Required' }, { field: 'session_ttl', before: '14d', after: '7d' }]),
  log('al-012', 'usr-mehwish', 'Mehwish Rauf', 'MR', 'create', 'File', 'file-004', 'hipaa-checklist.xlsx', '2026-07-14T16:45:00', IP.karachi, DEV.mac),
  log('al-011', 'usr-haris', 'Haris Naveed', 'HN', 'create', 'Task', 'tsk-033', 'Draft onboarding agenda', '2026-07-14T14:20:00', IP.dubai, DEV.mac),
  log('al-010', 'usr-noor', 'Noor Hassan', 'NH', 'update', 'Task', 'tsk-030', 'Merch alignment notes', '2026-07-14T11:05:00', IP.lahore, DEV.ios, [{ field: 'status', before: 'Todo', after: 'Done' }]),
  log('al-009', 'usr-raza', 'M. Raza', 'MR', 'permission_change', 'User', 'usr-lina', 'Lina Noor', '2026-07-13T17:50:00', IP.karachi, DEV.mac, [{ field: 'role', before: 'Employee', after: 'Dept Manager' }]),
  log('al-008', 'usr-fahad', 'Fahad Mirza', 'FM', 'create', 'Meeting', 'mtg-009', 'Ramadan campaign sync', '2026-07-13T15:00:00', IP.dubai, DEV.mac),
  log('al-007', 'usr-sara', 'Sara Khan', 'SK', 'update', 'Team', 'team-nova-product', 'Product Ops', '2026-07-12T16:30:00', IP.dubai, DEV.mac, [{ field: 'projects', before: '1', after: '2' }]),
  log('al-006', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'create', 'Organization', 'org-orbit', 'Orbit Media Labs', '2026-07-11T13:00:00', IP.dubai, DEV.mac),
  log('al-005', 'usr-lina', 'Lina Noor', 'LN', 'delete', 'Task', 'tsk-012', 'Review with Product', '2026-07-10T18:20:00', IP.dubai, DEV.safari, null, { note: 'Duplicate of product review task' }),
  log('al-004', 'usr-omar', 'Omar Farooq', 'OF', 'login', 'Settings', null, 'Workspace', '2026-07-09T09:05:00', IP.lahore, DEV.win, null, { mfa: true }),
  log('al-003', 'usr-raza', 'M. Raza', 'MR', 'create', 'Project', 'prj-api-gw', 'API Gateway v2', '2026-07-08T14:40:00', IP.karachi, DEV.mac),
  log('al-002', 'usr-hira', 'Hira Ali', 'HA', 'update', 'Department', 'dept-nova-hr', 'HR', '2026-07-07T11:15:00', IP.dubai, DEV.mac, [{ field: 'status', before: 'Active', after: 'Active' }, { field: 'memberCount', before: '4', after: '5' }]),
  log('al-001', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'login', 'Settings', null, 'Workspace', '2026-07-05T08:30:00', IP.dubai, DEV.mac, null, { mfa: true, firstOfPeriod: true }),
];

export function getAuditLogById(id) {
  return AUDIT_LOGS.find((l) => l.id === id) || null;
}

export function getEntityHref(module, entityId) {
  const fn = MODULE_PATH[module];
  if (!fn || !entityId) return null;
  return fn(entityId);
}

export function formatExactTime(iso) {
  try {
    return new Date(iso).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

export function formatRelativeTime(iso, nowIso = `${REFERENCE_TODAY}T15:00:00`) {
  try {
    const then = new Date(iso).getTime();
    const now = new Date(nowIso).getTime();
    const mins = Math.max(0, Math.round((now - then) / 60000));
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins}m ago`;
    const hours = Math.round(mins / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.round(hours / 24);
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days}d ago`;
    return formatExactTime(iso).split(',')[0];
  } catch {
    return iso;
  }
}

function dateKey(iso) {
  return iso.slice(0, 10);
}

export function groupLogsByDate(logs, today = REFERENCE_TODAY) {
  const yesterday = (() => {
    const d = new Date(`${today}T12:00:00`);
    d.setDate(d.getDate() - 1);
    return d.toISOString().slice(0, 10);
  })();

  const weekStart = (() => {
    const d = new Date(`${today}T12:00:00`);
    const day = d.getDay();
    const diff = day === 0 ? -6 : 1 - day;
    d.setDate(d.getDate() + diff);
    return d.toISOString().slice(0, 10);
  })();

  const buckets = {
    Today: [],
    Yesterday: [],
    'This Week': [],
  };
  const older = new Map();

  [...logs]
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .forEach((entry) => {
      const day = dateKey(entry.timestamp);
      if (day === today) buckets.Today.push(entry);
      else if (day === yesterday) buckets.Yesterday.push(entry);
      else if (day >= weekStart && day < yesterday) buckets['This Week'].push(entry);
      else {
        if (!older.has(day)) older.set(day, []);
        older.get(day).push(entry);
      }
    });

  const result = [];
  ['Today', 'Yesterday', 'This Week'].forEach((label) => {
    if (buckets[label].length) {
      result.push({ label, dateKey: label, items: buckets[label] });
    }
  });

  [...older.keys()]
    .sort((a, b) => b.localeCompare(a))
    .forEach((day) => {
      let label;
      try {
        label = new Date(`${day}T12:00:00`).toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
          year: 'numeric',
        });
      } catch {
        label = day;
      }
      result.push({ label, dateKey: day, items: older.get(day) });
    });

  return result;
}

export function filterAuditLogs(
  logs,
  {
    query = '',
    action = 'all',
    module = 'all',
    actorId = 'all',
    dateAfter = '',
    dateBefore = '',
  } = {}
) {
  const q = query.trim().toLowerCase();
  return logs.filter((l) => {
    if (action !== 'all' && l.action !== action) return false;
    if (module !== 'all' && l.module !== module) return false;
    if (actorId !== 'all' && l.actorId !== actorId) return false;
    const day = dateKey(l.timestamp);
    if (dateAfter && day < dateAfter) return false;
    if (dateBefore && day > dateBefore) return false;
    if (!q) return true;
    return [l.actorName, l.entityName, l.module, l.action, l.ip, l.device]
      .filter(Boolean)
      .join(' ')
      .toLowerCase()
      .includes(q);
  });
}

/** Distinct actors present in the log catalog (for filter dropdown). */
export function getAuditActors() {
  const map = new Map();
  AUDIT_LOGS.forEach((l) => {
    if (!map.has(l.actorId)) {
      map.set(l.actorId, {
        id: l.actorId,
        name: l.actorName,
        initials: l.actorInitials,
      });
    }
  });
  return Array.from(map.values()).sort((a, b) => a.name.localeCompare(b.name));
}
