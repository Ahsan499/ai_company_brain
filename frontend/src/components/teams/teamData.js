/**
 * Source of truth for Teams — squads within departments, assigned to projects.
 * Linked to organization, department, user, and project IDs.
 */

export const TEAMS = [
  {
    id: 'team-nova-backend',
    name: 'Backend',
    organizationId: 'org-nova',
    organizationName: 'NovaTech Solutions',
    departmentId: 'dept-nova-eng',
    departmentName: 'Engineering',
    leadId: 'usr-raza',
    leadName: 'M. Raza',
    leadInitials: 'MR',
    memberIds: ['usr-raza', 'usr-omar', 'usr-ahsan'],
    projectIds: ['prj-acb-core', 'prj-api-gw'],
    description:
      'API services, data models, and platform reliability for NovaTech product surfaces.',
    createdAt: '2025-09-12',
    status: 'active',
    iconTone: 'from-[#EFF6FF] to-[#BFDBFE] text-primary',
    color: '#2563EB',
  },
  {
    id: 'team-nova-frontend',
    name: 'Frontend',
    organizationId: 'org-nova',
    organizationName: 'NovaTech Solutions',
    departmentId: 'dept-nova-eng',
    departmentName: 'Engineering',
    leadId: 'usr-ahsan',
    leadName: 'Ahsan Taqweem',
    leadInitials: 'AT',
    memberIds: ['usr-ahsan', 'usr-omar', 'usr-lina'],
    projectIds: ['prj-acb-core', 'prj-design-sys'],
    description:
      'SPA architecture, design-system integration, and interaction quality across dashboards.',
    createdAt: '2025-09-18',
    status: 'active',
    iconTone: 'from-[#ECFEFF] to-[#A5F3FC] text-cyan-700',
    color: '#0891B2',
  },
  {
    id: 'team-nova-devops',
    name: 'DevOps',
    organizationId: 'org-nova',
    organizationName: 'NovaTech Solutions',
    departmentId: 'dept-nova-eng',
    departmentName: 'Engineering',
    leadId: 'usr-raza',
    leadName: 'M. Raza',
    leadInitials: 'MR',
    memberIds: ['usr-raza', 'usr-omar'],
    projectIds: ['prj-api-gw'],
    description: 'CI/CD, environments, observability, and release hygiene for Engineering.',
    createdAt: '2025-11-02',
    status: 'active',
    iconTone: 'from-[#F5F3FF] to-[#DDD6FE] text-violet-700',
    color: '#7C3AED',
  },
  {
    id: 'team-nova-product',
    name: 'Product Ops',
    organizationId: 'org-nova',
    organizationName: 'NovaTech Solutions',
    departmentId: 'dept-nova-product',
    departmentName: 'Product',
    leadId: 'usr-sara',
    leadName: 'Sara Khan',
    leadInitials: 'SK',
    memberIds: ['usr-sara', 'usr-guest'],
    projectIds: ['prj-acb-core', 'prj-onboarding'],
    description: 'Roadmap facilitation, discovery rituals, and cross-squad prioritization.',
    createdAt: '2025-08-01',
    status: 'active',
    iconTone: 'from-[#FFF7ED] to-[#FED7AA] text-amber-700',
    color: '#D97706',
  },
  {
    id: 'team-nova-design',
    name: 'Design Systems',
    organizationId: 'org-nova',
    organizationName: 'NovaTech Solutions',
    departmentId: 'dept-nova-design',
    departmentName: 'Design',
    leadId: 'usr-lina',
    leadName: 'Lina Noor',
    leadInitials: 'LN',
    memberIds: ['usr-lina', 'usr-sara'],
    projectIds: ['prj-design-sys', 'prj-acb-core'],
    description: 'Tokens, components, and UX patterns shared across NovaTech products.',
    createdAt: '2025-10-05',
    status: 'active',
    iconTone: 'from-[#FDF2F8] to-[#FBCFE8] text-pink-700',
    color: '#DB2777',
  },
  {
    id: 'team-nova-people',
    name: 'People Ops',
    organizationId: 'org-nova',
    organizationName: 'NovaTech Solutions',
    departmentId: 'dept-nova-hr',
    departmentName: 'HR',
    leadId: 'usr-hira',
    leadName: 'Hira Ali',
    leadInitials: 'HA',
    memberIds: ['usr-hira'],
    projectIds: ['prj-onboarding'],
    description: 'Hiring pipelines, onboarding programs, and people systems for NovaTech.',
    createdAt: '2026-01-14',
    status: 'active',
    iconTone: 'from-[#ECFDF5] to-[#A7F3D0] text-emerald-700',
    color: '#059669',
  },
  {
    id: 'team-harbor-hub',
    name: 'Hub Ops',
    organizationId: 'org-harbor',
    organizationName: 'Harbor Logistics',
    departmentId: 'dept-harbor-ops',
    departmentName: 'Operations',
    leadId: 'usr-bilal',
    leadName: 'Bilal Ahmed',
    leadInitials: 'BA',
    memberIds: ['usr-bilal', 'usr-usman', 'usr-nadia'],
    projectIds: ['prj-cold-chain', 'prj-harbor-exp'],
    description: 'Cold-chain hubs, dispatch coordination, and regional ops playbooks.',
    createdAt: '2025-07-20',
    status: 'active',
    iconTone: 'from-[#EFF6FF] to-[#BFDBFE] text-primary',
    color: '#2563EB',
  },
  {
    id: 'team-harbor-fleet',
    name: 'Fleet',
    organizationId: 'org-harbor',
    organizationName: 'Harbor Logistics',
    departmentId: 'dept-harbor-ops',
    departmentName: 'Operations',
    leadId: 'usr-bilal',
    leadName: 'Bilal Ahmed',
    leadInitials: 'BA',
    memberIds: ['usr-bilal', 'usr-usman'],
    projectIds: ['prj-cold-chain'],
    description: 'Vehicle readiness, route QA, and driver enablement for Harbor routes.',
    createdAt: '2025-12-01',
    status: 'active',
    iconTone: 'from-[#FFFBEB] to-[#FDE68A] text-amber-700',
    color: '#B45309',
  },
  {
    id: 'team-pulse-clinical',
    name: 'Clinical Ops',
    organizationId: 'org-pulse',
    organizationName: 'Pulse Health Group',
    departmentId: 'dept-pulse-clinical',
    departmentName: 'Clinical',
    leadId: 'usr-amna',
    leadName: 'Dr. Amna Siddiqui',
    leadInitials: 'AS',
    memberIds: ['usr-amna', 'usr-kamran'],
    projectIds: ['prj-patient-intake'],
    description: 'Intake workflows, clinician tooling, and patient experience programs.',
    createdAt: '2025-06-18',
    status: 'active',
    iconTone: 'from-[#ECFDF5] to-[#A7F3D0] text-emerald-700',
    color: '#047857',
  },
  {
    id: 'team-pulse-it',
    name: 'Health IT',
    organizationId: 'org-pulse',
    organizationName: 'Pulse Health Group',
    departmentId: 'dept-pulse-it',
    departmentName: 'IT',
    leadId: 'usr-kamran',
    leadName: 'Kamran Shah',
    leadInitials: 'KS',
    memberIds: ['usr-kamran', 'usr-amna'],
    projectIds: ['prj-mfa-rollout', 'prj-patient-intake'],
    description: 'Clinic identity, MFA rollout, and EHR-adjacent integrations.',
    createdAt: '2025-08-22',
    status: 'active',
    iconTone: 'from-[#EEF2FF] to-[#C7D2FE] text-indigo-700',
    color: '#4F46E5',
  },
  {
    id: 'team-ledger-compliance',
    name: 'Compliance',
    organizationId: 'org-ledger',
    organizationName: 'Ledger & Co.',
    departmentId: 'dept-ledger-finance',
    departmentName: 'Finance',
    leadId: 'usr-mehwish',
    leadName: 'Mehwish Rauf',
    leadInitials: 'MR',
    memberIds: ['usr-mehwish', 'usr-imran', 'usr-zain'],
    projectIds: ['prj-q2-audit'],
    description: 'Policy controls, evidence collection, and audit readiness for Ledger.',
    createdAt: '2025-05-09',
    status: 'active',
    iconTone: 'from-[#FEF2F2] to-[#FECACA] text-rose-700',
    color: '#E11D48',
  },
  {
    id: 'team-summit-merch',
    name: 'Merchandising',
    organizationId: 'org-summit',
    organizationName: 'Summit Retail Group',
    departmentId: 'dept-summit-mkt',
    departmentName: 'Marketing',
    leadId: 'usr-noor',
    leadName: 'Noor Hassan',
    leadInitials: 'NH',
    memberIds: ['usr-noor', 'usr-fahad'],
    projectIds: ['prj-ramadan', 'prj-pos'],
    description: 'Campaign merchandising, store checklists, and seasonal launch kits.',
    createdAt: '2025-10-28',
    status: 'active',
    iconTone: 'from-[#FFF7ED] to-[#FED7AA] text-orange-700',
    color: '#EA580C',
  },
  {
    id: 'team-canvas-partnerships',
    name: 'Partnerships',
    organizationId: 'org-canvas',
    organizationName: 'Canvas Education',
    departmentId: 'dept-canvas-support',
    departmentName: 'Support',
    leadId: 'usr-haris',
    leadName: 'Haris Naveed',
    leadInitials: 'HN',
    memberIds: ['usr-haris', 'usr-saima'],
    projectIds: ['prj-partner-districts'],
    description: 'District onboarding, partner success, and support playbooks.',
    createdAt: '2025-09-30',
    status: 'active',
    iconTone: 'from-[#EFF6FF] to-[#BFDBFE] text-primary',
    color: '#1D4ED8',
  },
  {
    id: 'team-orbit-creative',
    name: 'Creative',
    organizationId: 'org-orbit',
    organizationName: 'Orbit Media Labs',
    departmentId: 'dept-orbit-mkt',
    departmentName: 'Marketing',
    leadId: 'usr-ayesha',
    leadName: 'Ayesha Bukhari',
    leadInitials: 'AB',
    memberIds: ['usr-ayesha'],
    projectIds: [],
    description: 'Brand systems, campaign creative, and content production for Orbit.',
    createdAt: '2026-02-10',
    status: 'active',
    iconTone: 'from-[#FDF2F8] to-[#FBCFE8] text-fuchsia-700',
    color: '#C026D3',
  },
];

export function getTeamById(id) {
  return TEAMS.find((t) => t.id === id) || null;
}

export function getTeamsByDepartment(departmentId) {
  return TEAMS.filter((t) => t.departmentId === departmentId);
}

export function getTeamsByOrganization(organizationId) {
  return TEAMS.filter((t) => t.organizationId === organizationId);
}

export function getTeamsByUser(userId) {
  return TEAMS.filter((t) => t.memberIds.includes(userId));
}

export function getTeamsLedByUser(userId) {
  return TEAMS.filter((t) => t.leadId === userId);
}

export function getTeamsByProject(projectId) {
  return TEAMS.filter((t) => t.projectIds.includes(projectId));
}

export function filterTeams(list, { query = '', organizationId = 'all', departmentId = 'all' } = {}) {
  const q = query.trim().toLowerCase();
  return list.filter((t) => {
    if (organizationId !== 'all' && t.organizationId !== organizationId) return false;
    if (departmentId !== 'all' && t.departmentId !== departmentId) return false;
    if (!q) return true;
    const hay = [t.name, t.organizationName, t.departmentName, t.leadName, t.description]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}

export function formatTeamDate(iso) {
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
