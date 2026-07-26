/**
 * Static enterprise organizations catalog for the Organizations module.
 * No API — client-side filter/pagination only.
 */

export const ORGANIZATION_PLANS = {
  starter: { label: 'Starter', tone: 'bg-slate-100 text-slate-600 ring-slate-300/50' },
  growth: { label: 'Growth', tone: 'bg-blue-50 text-primary ring-primary/15' },
  enterprise: { label: 'Enterprise', tone: 'bg-violet-50 text-violet-700 ring-violet-500/15' },
  scale: { label: 'Scale', tone: 'bg-cyan-50 text-cyan-700 ring-cyan-500/15' },
};

export const ORGANIZATIONS = [
  {
    id: 'org-nova',
    name: 'NovaTech Solutions',
    slug: 'novatech',
    industry: 'Software & SaaS',
    size: '201–500',
    memberCount: 248,
    departmentCount: 8,
    projectCount: 34,
    plan: 'enterprise',
    status: 'active',
    createdAt: '2024-03-12',
    owner: 'Ahsan Taqweem',
    ownerEmail: 'ahsan@novatech.io',
    location: 'Dubai, UAE',
    website: 'novatech.io',
    description:
      'Enterprise product studio building AI-assisted workflow platforms for mid-market teams.',
    initials: 'NT',
    gradient: 'from-[#3B82F6] to-[#1D4ED8]',
    members: [
      { id: 'm1', name: 'Ahsan Taqweem', email: 'ahsan@novatech.io', role: 'Owner', department: 'Executive', status: 'active', initials: 'AT' },
      { id: 'm2', name: 'Sara Khan', email: 'sara@novatech.io', role: 'Admin', department: 'Product', status: 'active', initials: 'SK' },
      { id: 'm3', name: 'M. Raza', email: 'raza@novatech.io', role: 'Manager', department: 'Engineering', status: 'active', initials: 'MR' },
      { id: 'm4', name: 'Lina Noor', email: 'lina@novatech.io', role: 'Member', department: 'Design', status: 'active', initials: 'LN' },
      { id: 'm5', name: 'Omar Farooq', email: 'omar@novatech.io', role: 'Member', department: 'Engineering', status: 'invited', initials: 'OF' },
      { id: 'm6', name: 'Hira Ali', email: 'hira@novatech.io', role: 'Member', department: 'HR', status: 'active', initials: 'HA' },
    ],
    activity: [
      { id: 'a1', text: 'Sara Khan invited 3 members to Product', time: '2h ago' },
      { id: 'a2', text: 'Engineering created project “API Gateway v2”', time: 'Yesterday' },
      { id: 'a3', text: 'Plan upgraded to Enterprise', time: '3 days ago' },
    ],
  },
  {
    id: 'org-harbor',
    name: 'Harbor Logistics',
    slug: 'harbor',
    industry: 'Logistics',
    size: '501–1000',
    memberCount: 612,
    departmentCount: 12,
    projectCount: 51,
    plan: 'scale',
    status: 'active',
    createdAt: '2023-11-02',
    owner: 'Nadia Rehman',
    ownerEmail: 'nadia@harborlogistics.com',
    location: 'Karachi, PK',
    website: 'harborlogistics.com',
    description: 'Regional freight and warehouse operations with digital tracking hubs.',
    initials: 'HL',
    gradient: 'from-[#0891B2] to-[#0E7490]',
    members: [
      { id: 'm1', name: 'Nadia Rehman', email: 'nadia@harborlogistics.com', role: 'Owner', department: 'Executive', status: 'active', initials: 'NR' },
      { id: 'm2', name: 'Bilal Ahmed', email: 'bilal@harborlogistics.com', role: 'Admin', department: 'Operations', status: 'active', initials: 'BA' },
      { id: 'm3', name: 'Fatima Zahra', email: 'fatima@harborlogistics.com', role: 'Manager', department: 'Finance', status: 'active', initials: 'FZ' },
      { id: 'm4', name: 'Usman Tariq', email: 'usman@harborlogistics.com', role: 'Member', department: 'Fleet', status: 'inactive', initials: 'UT' },
    ],
    activity: [
      { id: 'a1', text: 'Operations published weekly capacity report', time: '5h ago' },
      { id: 'a2', text: 'New department “Cold Chain” created', time: '2 days ago' },
    ],
  },
  {
    id: 'org-pulse',
    name: 'Pulse Health Group',
    slug: 'pulse-health',
    industry: 'Healthcare',
    size: '51–200',
    memberCount: 134,
    departmentCount: 6,
    projectCount: 18,
    plan: 'growth',
    status: 'active',
    createdAt: '2024-07-18',
    owner: 'Dr. Amna Siddiqui',
    ownerEmail: 'amna@pulsehealth.care',
    location: 'Lahore, PK',
    website: 'pulsehealth.care',
    description: 'Clinic network digitizing patient intake, scheduling, and care coordination.',
    initials: 'PH',
    gradient: 'from-[#059669] to-[#047857]',
    members: [
      { id: 'm1', name: 'Dr. Amna Siddiqui', email: 'amna@pulsehealth.care', role: 'Owner', department: 'Clinical', status: 'active', initials: 'AS' },
      { id: 'm2', name: 'Kamran Shah', email: 'kamran@pulsehealth.care', role: 'Admin', department: 'IT', status: 'active', initials: 'KS' },
      { id: 'm3', name: 'Sana Iqbal', email: 'sana@pulsehealth.care', role: 'Member', department: 'Nursing', status: 'active', initials: 'SI' },
    ],
    activity: [
      { id: 'a1', text: 'IT enabled MFA for all admins', time: '1d ago' },
      { id: 'a2', text: 'Clinical uploaded onboarding handbook', time: '4 days ago' },
    ],
  },
  {
    id: 'org-ledger',
    name: 'Ledger & Co.',
    slug: 'ledger',
    industry: 'Finance',
    size: '11–50',
    memberCount: 42,
    departmentCount: 4,
    projectCount: 9,
    plan: 'growth',
    status: 'active',
    createdAt: '2025-01-09',
    owner: 'Imran Qureshi',
    ownerEmail: 'imran@ledgerco.finance',
    location: 'Islamabad, PK',
    website: 'ledgerco.finance',
    description: 'Boutique advisory firm managing compliance workflows and client reporting.',
    initials: 'LC',
    gradient: 'from-[#D97706] to-[#B45309]',
    members: [
      { id: 'm1', name: 'Imran Qureshi', email: 'imran@ledgerco.finance', role: 'Owner', department: 'Advisory', status: 'active', initials: 'IQ' },
      { id: 'm2', name: 'Mehwish Rauf', email: 'mehwish@ledgerco.finance', role: 'Admin', department: 'Compliance', status: 'active', initials: 'MR' },
      { id: 'm3', name: 'Zain Malik', email: 'zain@ledgerco.finance', role: 'Member', department: 'Audit', status: 'invited', initials: 'ZM' },
    ],
    activity: [
      { id: 'a1', text: 'Compliance closed Q2 audit checklist', time: '3h ago' },
    ],
  },
  {
    id: 'org-orbit',
    name: 'Orbit Media Labs',
    slug: 'orbit-media',
    industry: 'Media & Marketing',
    size: '51–200',
    memberCount: 89,
    departmentCount: 5,
    projectCount: 22,
    plan: 'starter',
    status: 'inactive',
    createdAt: '2023-05-21',
    owner: 'Ayesha Bukhari',
    ownerEmail: 'ayesha@orbitmedia.lab',
    location: 'Remote',
    website: 'orbitmedia.lab',
    description: 'Creative studio paused after acquisition — workspace retained for archives.',
    initials: 'OM',
    gradient: 'from-[#7C3AED] to-[#5B21B6]',
    members: [
      { id: 'm1', name: 'Ayesha Bukhari', email: 'ayesha@orbitmedia.lab', role: 'Owner', department: 'Creative', status: 'active', initials: 'AB' },
      { id: 'm2', name: 'Danish Gill', email: 'danish@orbitmedia.lab', role: 'Member', department: 'Production', status: 'inactive', initials: 'DG' },
    ],
    activity: [
      { id: 'a1', text: 'Workspace marked inactive by Owner', time: '2 weeks ago' },
    ],
  },
  {
    id: 'org-summit',
    name: 'Summit Retail Group',
    slug: 'summit-retail',
    industry: 'Retail',
    size: '1000+',
    memberCount: 1280,
    departmentCount: 18,
    projectCount: 76,
    plan: 'enterprise',
    status: 'active',
    createdAt: '2022-09-14',
    owner: 'Fahad Mirza',
    ownerEmail: 'fahad@summitretail.com',
    location: 'Riyadh, SA',
    website: 'summitretail.com',
    description: 'Omnichannel retail brand coordinating store ops, merchandising, and e-commerce.',
    initials: 'SR',
    gradient: 'from-[#DC2626] to-[#991B1B]',
    members: [
      { id: 'm1', name: 'Fahad Mirza', email: 'fahad@summitretail.com', role: 'Owner', department: 'Executive', status: 'active', initials: 'FM' },
      { id: 'm2', name: 'Noor Hassan', email: 'noor@summitretail.com', role: 'Admin', department: 'Merchandising', status: 'active', initials: 'NH' },
      { id: 'm3', name: 'Rami Obeid', email: 'rami@summitretail.com', role: 'Manager', department: 'Stores', status: 'active', initials: 'RO' },
      { id: 'm4', name: 'Layla Nasser', email: 'layla@summitretail.com', role: 'Member', department: 'E-commerce', status: 'active', initials: 'LN' },
      { id: 'm5', name: 'Yusuf Karim', email: 'yusuf@summitretail.com', role: 'Member', department: 'Supply', status: 'active', initials: 'YK' },
    ],
    activity: [
      { id: 'a1', text: 'Stores rolled out new POS checklist', time: '6h ago' },
      { id: 'a2', text: 'E-commerce launched Ramadan campaign board', time: 'Yesterday' },
      { id: 'a3', text: '12 new store managers onboarded', time: '5 days ago' },
    ],
  },
  {
    id: 'org-canvas',
    name: 'Canvas Education',
    slug: 'canvas-edu',
    industry: 'Education',
    size: '51–200',
    memberCount: 156,
    departmentCount: 7,
    projectCount: 14,
    plan: 'growth',
    status: 'active',
    createdAt: '2024-10-30',
    owner: 'Prof. Saima Riaz',
    ownerEmail: 'saima@canvasedu.org',
    location: 'Peshawar, PK',
    website: 'canvasedu.org',
    description: 'EdTech nonprofit coordinating curriculum teams and partner schools.',
    initials: 'CE',
    gradient: 'from-[#2563EB] to-[#1E3A8A]',
    members: [
      { id: 'm1', name: 'Prof. Saima Riaz', email: 'saima@canvasedu.org', role: 'Owner', department: 'Academics', status: 'active', initials: 'SR' },
      { id: 'm2', name: 'Haris Naveed', email: 'haris@canvasedu.org', role: 'Admin', department: 'Partnerships', status: 'active', initials: 'HN' },
      { id: 'm3', name: 'Iqra Jamil', email: 'iqra@canvasedu.org', role: 'Member', department: 'Curriculum', status: 'active', initials: 'IJ' },
      { id: 'm4', name: 'Taha Yousaf', email: 'taha@canvasedu.org', role: 'Member', department: 'Support', status: 'invited', initials: 'TY' },
    ],
    activity: [
      { id: 'a1', text: 'Curriculum published Term 2 syllabus pack', time: '8h ago' },
      { id: 'a2', text: 'Partnerships added 2 school districts', time: '3 days ago' },
    ],
  },
];

export function getOrganizationById(id) {
  return ORGANIZATIONS.find((o) => o.id === id) || null;
}

export function filterOrganizations(list, { query = '', status = 'all', plan = 'all' } = {}) {
  const q = query.trim().toLowerCase();
  return list.filter((org) => {
    if (status !== 'all' && org.status !== status) return false;
    if (plan !== 'all' && org.plan !== plan) return false;
    if (!q) return true;
    const hay = [org.name, org.industry, org.owner, org.location, org.slug]
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}

export function formatOrgDate(iso) {
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
