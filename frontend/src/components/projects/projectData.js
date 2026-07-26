/**
 * Static projects catalog — linked to orgs, departments, and users.
 * Task lists live in components/tasks/taskData.js (single source of truth).
 */

export const PROJECT_STATUSES = ['planning', 'active', 'on-hold', 'completed'];
export const PROJECT_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

export const PROJECT_STATUS_META = {
  planning: {
    label: 'Planning',
    tone: 'bg-slate-100 text-slate-600 ring-slate-300/50',
    column: 'from-slate-50 to-white',
  },
  active: {
    label: 'Active',
    tone: 'bg-blue-50 text-primary ring-primary/15',
    column: 'from-[#EFF6FF]/80 to-white',
  },
  'on-hold': {
    label: 'On Hold',
    tone: 'bg-amber-50 text-amber-700 ring-amber-500/15',
    column: 'from-amber-50/60 to-white',
  },
  completed: {
    label: 'Completed',
    tone: 'bg-emerald-50 text-emerald-700 ring-emerald-500/15',
    column: 'from-emerald-50/50 to-white',
  },
};

export const PRIORITY_META = {
  low: { label: 'Low', tone: 'bg-slate-100 text-slate-500 ring-slate-300/50', bar: 'bg-slate-400' },
  medium: { label: 'Medium', tone: 'bg-sky-50 text-sky-700 ring-sky-500/15', bar: 'bg-sky-500' },
  high: { label: 'High', tone: 'bg-amber-50 text-amber-700 ring-amber-500/15', bar: 'bg-amber-500' },
  urgent: { label: 'Urgent', tone: 'bg-rose-50 text-rose-700 ring-rose-500/15', bar: 'bg-rose-500' },
};


function member(userId, projectRole, initials, name) {
  return { userId, projectRole, initials, name };
}

function milestone(id, title, dueDate, done) {
  return { id, title, dueDate, done };
}

export const PROJECTS = [
  {
    id: 'prj-acb-core',
    name: 'AI Company Brain Core',
    organizationId: 'org-nova',
    organizationName: 'NovaTech Solutions',
    departmentId: 'dept-nova-eng',
    departmentName: 'Engineering',
    status: 'active',
    priority: 'urgent',
    progress: 68,
    dueDate: '2026-09-30',
    createdAt: '2026-03-01',
    description:
      'Flagship enterprise knowledge platform — auth, dashboard shell, organizations, and AI search foundations.',
    members: [
      member('usr-ahsan', 'Project Lead', 'AT', 'Ahsan Taqweem'),
      member('usr-raza', 'Tech Lead', 'MR', 'M. Raza'),
      member('usr-sara', 'Product Owner', 'SK', 'Sara Khan'),
      member('usr-lina', 'Design Lead', 'LN', 'Lina Noor'),
      member('usr-omar', 'Contributor', 'OF', 'Omar Farooq'),
    ],
    tasksDone: 14,
    tasksTotal: 20,
    milestones: [
      milestone('ms1', 'Auth & shell complete', '2026-05-01', true),
      milestone('ms2', 'Organizations & Users', '2026-07-15', true),
      milestone('ms3', 'Projects & Tasks modules', '2026-08-20', false),
      milestone('ms4', 'AI search beta', '2026-09-30', false),
    ],
    activity: [
      { id: 'a1', text: 'Lina Noor polished Command Palette UI', time: '2h ago' },
      { id: 'a2', text: 'Departments module marked ready for review', time: 'Yesterday' },
      { id: 'a3', text: 'Sprint planning locked for Projects phase', time: '3 days ago' },
    ],
  },
  {
    id: 'prj-api-gw',
    name: 'API Gateway v2',
    organizationId: 'org-nova',
    organizationName: 'NovaTech Solutions',
    departmentId: 'dept-nova-eng',
    departmentName: 'Engineering',
    status: 'active',
    priority: 'high',
    progress: 42,
    dueDate: '2026-08-15',
    createdAt: '2026-05-12',
    description: 'Next-gen API gateway with rate limiting, observability, and multi-tenant routing.',
    members: [
      member('usr-raza', 'Project Lead', 'MR', 'M. Raza'),
      member('usr-omar', 'Contributor', 'OF', 'Omar Farooq'),
      member('usr-ahsan', 'Sponsor', 'AT', 'Ahsan Taqweem'),
    ],
    tasksDone: 5,
    tasksTotal: 12,
    milestones: [
      milestone('ms1', 'Gateway scaffold', '2026-06-01', true),
      milestone('ms2', 'Auth middleware', '2026-07-10', true),
      milestone('ms3', 'Load testing pass', '2026-08-15', false),
    ],
    activity: [
      { id: 'a1', text: 'Omar opened PR for rate limiter', time: '5h ago' },
    ],
  },
  {
    id: 'prj-design-sys',
    name: 'Design System 2.0',
    organizationId: 'org-nova',
    organizationName: 'NovaTech Solutions',
    departmentId: 'dept-nova-design',
    departmentName: 'Design',
    status: 'planning',
    priority: 'medium',
    progress: 18,
    dueDate: '2026-10-01',
    createdAt: '2026-06-18',
    description: 'Unified tokens, components, and motion guidelines for AI Company Brain.',
    members: [
      member('usr-lina', 'Project Lead', 'LN', 'Lina Noor'),
      member('usr-sara', 'Contributor', 'SK', 'Sara Khan'),
    ],
    tasksDone: 2,
    tasksTotal: 11,
    milestones: [
      milestone('ms1', 'Token audit', '2026-07-01', true),
      milestone('ms2', 'Component inventory', '2026-08-15', false),
    ],
    activity: [
      { id: 'a1', text: 'Lina published glassmorphism guidelines', time: '1d ago' },
    ],
  },
  {
    id: 'prj-onboarding',
    name: 'People Ops Onboarding',
    organizationId: 'org-nova',
    organizationName: 'NovaTech Solutions',
    departmentId: 'dept-nova-hr',
    departmentName: 'HR',
    status: 'active',
    priority: 'medium',
    progress: 55,
    dueDate: '2026-08-30',
    createdAt: '2026-04-01',
    description: 'Digitize employee onboarding checklists and welcome journeys.',
    members: [
      member('usr-hira', 'Project Lead', 'HA', 'Hira Ali'),
      member('usr-sara', 'Contributor', 'SK', 'Sara Khan'),
    ],
    tasksDone: 6,
    tasksTotal: 10,
    milestones: [
      milestone('ms1', 'Checklist MVP', '2026-06-01', true),
      milestone('ms2', 'Manager approvals', '2026-08-30', false),
    ],
    activity: [
      { id: 'a1', text: 'Hira closed Q3 onboarding ticket', time: '3h ago' },
    ],
  },
  {
    id: 'prj-cold-chain',
    name: 'Cold Chain Hub',
    organizationId: 'org-harbor',
    organizationName: 'Harbor Logistics',
    departmentId: 'dept-harbor-ops',
    departmentName: 'Operations',
    status: 'active',
    priority: 'high',
    progress: 61,
    dueDate: '2026-09-12',
    createdAt: '2025-11-01',
    description: 'Temperature-controlled logistics workflows and capacity dashboards.',
    members: [
      member('usr-bilal', 'Project Lead', 'BA', 'Bilal Ahmed'),
      member('usr-nadia', 'Sponsor', 'NR', 'Nadia Rehman'),
      member('usr-usman', 'Contributor', 'UT', 'Usman Tariq'),
    ],
    tasksDone: 9,
    tasksTotal: 15,
    milestones: [
      milestone('ms1', 'Sensor integrations', '2026-02-01', true),
      milestone('ms2', 'Ops dashboard live', '2026-09-12', false),
    ],
    activity: [
      { id: 'a1', text: 'Ops published weekly capacity report', time: '5h ago' },
    ],
  },
  {
    id: 'prj-harbor-exp',
    name: 'Regional Expansion Map',
    organizationId: 'org-harbor',
    organizationName: 'Harbor Logistics',
    departmentId: 'dept-harbor-exec',
    departmentName: 'Executive',
    status: 'planning',
    priority: 'medium',
    progress: 12,
    dueDate: '2026-12-01',
    createdAt: '2026-06-01',
    description: 'Plan new hub openings across Sindh and Punjab corridors.',
    members: [
      member('usr-nadia', 'Project Lead', 'NR', 'Nadia Rehman'),
      member('usr-bilal', 'Contributor', 'BA', 'Bilal Ahmed'),
    ],
    tasksDone: 1,
    tasksTotal: 8,
    milestones: [
      milestone('ms1', 'Site shortlist', '2026-09-01', false),
    ],
    activity: [
      { id: 'a1', text: 'Nadia scheduled expansion workshop', time: '2d ago' },
    ],
  },
  {
    id: 'prj-patient-intake',
    name: 'Patient Intake Digitization',
    organizationId: 'org-pulse',
    organizationName: 'Pulse Health Group',
    departmentId: 'dept-pulse-clinical',
    departmentName: 'Clinical',
    status: 'active',
    priority: 'high',
    progress: 47,
    dueDate: '2026-08-28',
    createdAt: '2025-12-10',
    description: 'Digital intake forms, triage queues, and clinic handoff protocols.',
    members: [
      member('usr-amna', 'Project Lead', 'AS', 'Dr. Amna Siddiqui'),
      member('usr-kamran', 'Contributor', 'KS', 'Kamran Shah'),
    ],
    tasksDone: 7,
    tasksTotal: 14,
    milestones: [
      milestone('ms1', 'Form library', '2026-03-01', true),
      milestone('ms2', 'Clinic A pilot', '2026-08-28', false),
    ],
    activity: [
      { id: 'a1', text: 'Clinical uploaded onboarding handbook', time: '4d ago' },
    ],
  },
  {
    id: 'prj-mfa-rollout',
    name: 'Clinic MFA Rollout',
    organizationId: 'org-pulse',
    organizationName: 'Pulse Health Group',
    departmentId: 'dept-pulse-it',
    departmentName: 'IT',
    status: 'completed',
    priority: 'urgent',
    progress: 100,
    dueDate: '2026-06-30',
    createdAt: '2026-02-01',
    description: 'Enforce MFA for all admin and clinician accounts.',
    members: [
      member('usr-kamran', 'Project Lead', 'KS', 'Kamran Shah'),
      member('usr-amna', 'Sponsor', 'AS', 'Dr. Amna Siddiqui'),
    ],
    tasksDone: 8,
    tasksTotal: 8,
    milestones: [
      milestone('ms1', 'Pilot clinics', '2026-04-01', true),
      milestone('ms2', 'Full rollout', '2026-06-30', true),
    ],
    activity: [
      { id: 'a1', text: 'IT enabled MFA for all admins', time: '1d ago' },
    ],
  },
  {
    id: 'prj-q2-audit',
    name: 'Q2 Compliance Audit',
    organizationId: 'org-ledger',
    organizationName: 'Ledger & Co.',
    departmentId: 'dept-ledger-finance',
    departmentName: 'Finance',
    status: 'on-hold',
    priority: 'high',
    progress: 35,
    dueDate: '2026-08-05',
    createdAt: '2026-04-15',
    description: 'External audit readiness for Q2 client portfolios.',
    members: [
      member('usr-mehwish', 'Project Lead', 'MR', 'Mehwish Rauf'),
      member('usr-imran', 'Sponsor', 'IQ', 'Imran Qureshi'),
      member('usr-zain', 'Guest Auditor', 'ZM', 'Zain Malik'),
    ],
    tasksDone: 4,
    tasksTotal: 11,
    milestones: [
      milestone('ms1', 'Evidence folder', '2026-05-20', true),
      milestone('ms2', 'Auditor walkthrough', '2026-08-05', false),
    ],
    activity: [
      { id: 'a1', text: 'Compliance closed Q2 audit checklist items', time: '3h ago' },
    ],
  },
  {
    id: 'prj-ramadan',
    name: 'Ramadan Campaign Board',
    organizationId: 'org-summit',
    organizationName: 'Summit Retail Group',
    departmentId: 'dept-summit-mkt',
    departmentName: 'Marketing',
    status: 'active',
    priority: 'urgent',
    progress: 73,
    dueDate: '2026-03-20',
    createdAt: '2025-12-01',
    description: 'Omnichannel Ramadan merchandising and e-commerce push.',
    members: [
      member('usr-noor', 'Project Lead', 'NH', 'Noor Hassan'),
      member('usr-fahad', 'Sponsor', 'FM', 'Fahad Mirza'),
    ],
    tasksDone: 16,
    tasksTotal: 22,
    milestones: [
      milestone('ms1', 'Creative lock', '2026-01-15', true),
      milestone('ms2', 'Campaign live', '2026-03-01', true),
      milestone('ms3', 'Post-campaign report', '2026-03-20', false),
    ],
    activity: [
      { id: 'a1', text: 'E-commerce launched Ramadan campaign board', time: 'Yesterday' },
    ],
  },
  {
    id: 'prj-pos',
    name: 'Store POS Checklist',
    organizationId: 'org-summit',
    organizationName: 'Summit Retail Group',
    departmentId: 'dept-summit-exec',
    departmentName: 'Executive',
    status: 'completed',
    priority: 'medium',
    progress: 100,
    dueDate: '2026-06-01',
    createdAt: '2026-01-10',
    description: 'Standardize POS opening/closing procedures across stores.',
    members: [
      member('usr-fahad', 'Project Lead', 'FM', 'Fahad Mirza'),
      member('usr-noor', 'Contributor', 'NH', 'Noor Hassan'),
    ],
    tasksDone: 9,
    tasksTotal: 9,
    milestones: [
      milestone('ms1', 'Pilot 12 stores', '2026-04-01', true),
      milestone('ms2', 'Full rollout', '2026-06-01', true),
    ],
    activity: [
      { id: 'a1', text: 'Stores rolled out new POS checklist', time: '6h ago' },
    ],
  },
  {
    id: 'prj-syllabus',
    name: 'Term 2 Syllabus Pack',
    organizationId: 'org-canvas',
    organizationName: 'Canvas Education',
    departmentId: 'dept-canvas-exec',
    departmentName: 'Executive',
    status: 'active',
    priority: 'medium',
    progress: 58,
    dueDate: '2026-08-15',
    createdAt: '2026-05-01',
    description: 'Publish Term 2 curriculum packs for partner school districts.',
    members: [
      member('usr-saima', 'Project Lead', 'SR', 'Prof. Saima Riaz'),
      member('usr-haris', 'Contributor', 'HN', 'Haris Naveed'),
    ],
    tasksDone: 5,
    tasksTotal: 9,
    milestones: [
      milestone('ms1', 'Draft modules', '2026-06-15', true),
      milestone('ms2', 'District distribution', '2026-08-15', false),
    ],
    activity: [
      { id: 'a1', text: 'Curriculum published Term 2 syllabus pack draft', time: '8h ago' },
    ],
  },
  {
    id: 'prj-partner-districts',
    name: 'Partner Districts Onboarding',
    organizationId: 'org-canvas',
    organizationName: 'Canvas Education',
    departmentId: 'dept-canvas-support',
    departmentName: 'Support',
    status: 'planning',
    priority: 'low',
    progress: 8,
    dueDate: '2026-11-01',
    createdAt: '2026-07-01',
    description: 'Onboard two new school districts onto Canvas Education tooling.',
    members: [
      member('usr-haris', 'Project Lead', 'HN', 'Haris Naveed'),
      member('usr-saima', 'Sponsor', 'SR', 'Prof. Saima Riaz'),
    ],
    tasksDone: 0,
    tasksTotal: 6,
    milestones: [
      milestone('ms1', 'Kickoff workshops', '2026-09-01', false),
    ],
    activity: [
      { id: 'a1', text: 'Partnerships added 2 school districts', time: '3d ago' },
    ],
  },
];

export function getProjectById(id) {
  return PROJECTS.find((p) => p.id === id) || null;
}

export function getProjectsByDepartment(departmentId) {
  return PROJECTS.filter((p) => p.departmentId === departmentId);
}

export function getProjectsByOrganization(organizationId) {
  return PROJECTS.filter((p) => p.organizationId === organizationId);
}

export function getProjectsByUser(userId) {
  return PROJECTS.filter((p) => p.members.some((m) => m.userId === userId));
}

export function filterProjects(
  list,
  {
    query = '',
    organizationId = 'all',
    departmentId = 'all',
    status = 'all',
    priority = 'all',
  } = {}
) {
  const q = query.trim().toLowerCase();
  return list.filter((p) => {
    if (organizationId !== 'all' && p.organizationId !== organizationId) return false;
    if (departmentId !== 'all' && p.departmentId !== departmentId) return false;
    if (status !== 'all' && p.status !== status) return false;
    if (priority !== 'all' && p.priority !== priority) return false;
    if (!q) return true;
    const hay = [p.name, p.organizationName, p.departmentName, p.description]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}

export function formatProjectDate(iso) {
  try {
    return new Date(iso).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function daysRemaining(iso) {
  try {
    const due = new Date(iso);
    const now = new Date('2026-07-26');
    const diff = Math.ceil((due - now) / (1000 * 60 * 60 * 24));
    return diff;
  } catch {
    return null;
  }
}

export function groupProjectsByStatus(list) {
  return PROJECT_STATUSES.map((status) => ({
    status,
    meta: PROJECT_STATUS_META[status],
    items: list.filter((p) => p.status === status),
  }));
}
