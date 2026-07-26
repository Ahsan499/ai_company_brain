/**
 * Source of truth for Meetings.
 * Linked to project/team IDs and user IDs from existing catalogs.
 * Reference “today”: 2026-07-26 (matches app static clock).
 */

export const CURRENT_USER_ID = 'usr-ahsan';
export const REFERENCE_TODAY = '2026-07-26';

export const MEETING_STATUSES = ['upcoming', 'ongoing', 'completed', 'cancelled'];

export const MEETING_STATUS_META = {
  upcoming: {
    label: 'Upcoming',
    tone: 'bg-blue-50 text-primary ring-primary/15',
  },
  ongoing: {
    label: 'Ongoing',
    tone: 'bg-emerald-50 text-emerald-700 ring-emerald-500/15',
  },
  completed: {
    label: 'Completed',
    tone: 'bg-slate-100 text-slate-600 ring-slate-300/50',
  },
  cancelled: {
    label: 'Cancelled',
    tone: 'bg-rose-50 text-rose-700 ring-rose-500/15',
  },
};

export const RSVP_META = {
  accepted: { label: 'Accepted', tone: 'text-emerald-700 bg-emerald-50 ring-emerald-500/15' },
  pending: { label: 'Pending', tone: 'text-amber-700 bg-amber-50 ring-amber-500/15' },
  declined: { label: 'Declined', tone: 'text-rose-700 bg-rose-50 ring-rose-500/15' },
};

function attendee(userId, name, initials, rsvpStatus = 'accepted') {
  return { userId, name, initials, rsvpStatus };
}

function agenda(id, title, done = false) {
  return { id, title, done };
}

export const MEETINGS = [
  {
    id: 'mtg-001',
    title: 'Product Sync',
    date: '2026-07-26',
    startTime: '10:00',
    durationMinutes: 45,
    status: 'upcoming',
    type: 'video',
    location: 'Zoom · Product Room',
    joinUrl: 'https://meet.novatech.io/product-sync',
    projectId: 'prj-acb-core',
    projectName: 'AI Company Brain Core',
    teamId: 'team-nova-product',
    teamName: 'Product Ops',
    organizerId: 'usr-sara',
    organizerName: 'Sara Khan',
    organizerInitials: 'SK',
    attendees: [
      attendee('usr-sara', 'Sara Khan', 'SK', 'accepted'),
      attendee('usr-ahsan', 'Ahsan Taqweem', 'AT', 'accepted'),
      attendee('usr-raza', 'M. Raza', 'MR', 'accepted'),
      attendee('usr-lina', 'Lina Noor', 'LN', 'pending'),
    ],
    description:
      'Weekly product pulse — blockers, shipping risks, and priority calls for ACB Core.',
    agenda: [
      agenda('a1', 'Sprint health snapshot', true),
      agenda('a2', 'Tasks module feedback', false),
      agenda('a3', 'Teams → Meetings handoff', false),
    ],
    notes: null,
    recurring: 'Weekly',
    createdAt: '2026-07-01',
    createdById: 'usr-sara',
    createdByName: 'Sara Khan',
  },
  {
    id: 'mtg-002',
    title: 'Design Review',
    date: '2026-07-26',
    startTime: '13:30',
    durationMinutes: 60,
    status: 'upcoming',
    type: 'video',
    location: 'Google Meet · Design Crit',
    joinUrl: 'https://meet.novatech.io/design-review',
    projectId: 'prj-design-sys',
    projectName: 'Design System 2.0',
    teamId: 'team-nova-design',
    teamName: 'Design Systems',
    organizerId: 'usr-lina',
    organizerName: 'Lina Noor',
    organizerInitials: 'LN',
    attendees: [
      attendee('usr-lina', 'Lina Noor', 'LN', 'accepted'),
      attendee('usr-ahsan', 'Ahsan Taqweem', 'AT', 'accepted'),
      attendee('usr-sara', 'Sara Khan', 'SK', 'pending'),
    ],
    description: 'Critique of token updates and Meeting drawer visual language.',
    agenda: [
      agenda('a1', 'Token diff walkthrough', false),
      agenda('a2', 'Drawer density review', false),
    ],
    notes: null,
    recurring: null,
    createdAt: '2026-07-22',
    createdById: 'usr-lina',
    createdByName: 'Lina Noor',
  },
  {
    id: 'mtg-003',
    title: 'Sprint Planning',
    date: '2026-07-26',
    startTime: '16:00',
    durationMinutes: 90,
    status: 'upcoming',
    type: 'in-person',
    location: 'NovaTech HQ · Lab 3',
    joinUrl: null,
    projectId: 'prj-acb-core',
    projectName: 'AI Company Brain Core',
    teamId: 'team-nova-backend',
    teamName: 'Backend',
    organizerId: 'usr-raza',
    organizerName: 'M. Raza',
    organizerInitials: 'MR',
    attendees: [
      attendee('usr-raza', 'M. Raza', 'MR', 'accepted'),
      attendee('usr-ahsan', 'Ahsan Taqweem', 'AT', 'accepted'),
      attendee('usr-omar', 'Omar Farooq', 'OF', 'accepted'),
      attendee('usr-sara', 'Sara Khan', 'SK', 'accepted'),
    ],
    description: 'Lock Meetings module scope and capacity for the next sprint.',
    agenda: [
      agenda('a1', 'Capacity check', false),
      agenda('a2', 'Story sizing', false),
      agenda('a3', 'Risks & dependencies', false),
    ],
    notes: null,
    recurring: 'Biweekly',
    createdAt: '2026-07-18',
    createdById: 'usr-raza',
    createdByName: 'M. Raza',
  },
  {
    id: 'mtg-004',
    title: 'API Gateway standup',
    date: '2026-07-26',
    startTime: '09:15',
    durationMinutes: 15,
    status: 'ongoing',
    type: 'video',
    location: 'Zoom · Eng Standup',
    joinUrl: 'https://meet.novatech.io/api-gw',
    projectId: 'prj-api-gw',
    projectName: 'API Gateway v2',
    teamId: 'team-nova-devops',
    teamName: 'DevOps',
    organizerId: 'usr-omar',
    organizerName: 'Omar Farooq',
    organizerInitials: 'OF',
    attendees: [
      attendee('usr-omar', 'Omar Farooq', 'OF', 'accepted'),
      attendee('usr-raza', 'M. Raza', 'MR', 'accepted'),
      attendee('usr-ahsan', 'Ahsan Taqweem', 'AT', 'pending'),
    ],
    description: 'Quick status on rate-limit rollout and observability gaps.',
    agenda: [agenda('a1', 'Yesterday / today / blockers', false)],
    notes: null,
    recurring: 'Daily',
    createdAt: '2026-06-01',
    createdById: 'usr-omar',
    createdByName: 'Omar Farooq',
  },
  {
    id: 'mtg-005',
    title: 'Cold Chain ops huddle',
    date: '2026-07-25',
    startTime: '11:00',
    durationMinutes: 30,
    status: 'completed',
    type: 'video',
    location: 'Teams · Harbor Ops',
    joinUrl: 'https://meet.harbor.ops/cold-chain',
    projectId: 'prj-cold-chain',
    projectName: 'Cold Chain Hub',
    teamId: 'team-harbor-hub',
    teamName: 'Hub Ops',
    organizerId: 'usr-bilal',
    organizerName: 'Bilal Ahmed',
    organizerInitials: 'BA',
    attendees: [
      attendee('usr-bilal', 'Bilal Ahmed', 'BA', 'accepted'),
      attendee('usr-usman', 'Usman Tariq', 'UT', 'accepted'),
      attendee('usr-nadia', 'Nadia Rehman', 'NR', 'accepted'),
    ],
    description: 'Hub temperature exceptions and regional dispatch load.',
    agenda: [
      agenda('a1', 'Exception review', true),
      agenda('a2', 'Weekend coverage', true),
    ],
    notes:
      'Agreed to raise alert threshold to 4°C delta. Usman owns weekend rota draft by Monday.',
    recurring: 'Weekly',
    createdAt: '2026-07-10',
    createdById: 'usr-bilal',
    createdByName: 'Bilal Ahmed',
  },
  {
    id: 'mtg-006',
    title: 'Patient intake walkthrough',
    date: '2026-07-24',
    startTime: '14:00',
    durationMinutes: 60,
    status: 'completed',
    type: 'in-person',
    location: 'Pulse Clinic · Conference A',
    joinUrl: null,
    projectId: 'prj-patient-intake',
    projectName: 'Patient Intake Digitization',
    teamId: 'team-pulse-clinical',
    teamName: 'Clinical Ops',
    organizerId: 'usr-amna',
    organizerName: 'Dr. Amna Siddiqui',
    organizerInitials: 'AS',
    attendees: [
      attendee('usr-amna', 'Dr. Amna Siddiqui', 'AS', 'accepted'),
      attendee('usr-kamran', 'Kamran Shah', 'KS', 'accepted'),
    ],
    description: 'Validate intake form flow with clinic staff.',
    agenda: [
      agenda('a1', 'Form demo', true),
      agenda('a2', 'Feedback capture', true),
    ],
    notes: 'Staff preferred fewer mandatory fields on page 1. Kamran will ship a patch next sprint.',
    recurring: null,
    createdAt: '2026-07-15',
    createdById: 'usr-amna',
    createdByName: 'Dr. Amna Siddiqui',
  },
  {
    id: 'mtg-007',
    title: 'Q2 Audit kickoff',
    date: '2026-07-23',
    startTime: '10:30',
    durationMinutes: 75,
    status: 'completed',
    type: 'video',
    location: 'Zoom · Compliance',
    joinUrl: 'https://meet.ledger.co/q2-audit',
    projectId: 'prj-q2-audit',
    projectName: 'Q2 Compliance Audit',
    teamId: 'team-ledger-compliance',
    teamName: 'Compliance',
    organizerId: 'usr-mehwish',
    organizerName: 'Mehwish Rauf',
    organizerInitials: 'MR',
    attendees: [
      attendee('usr-mehwish', 'Mehwish Rauf', 'MR', 'accepted'),
      attendee('usr-imran', 'Imran Qureshi', 'IQ', 'accepted'),
      attendee('usr-zain', 'Zain Malik', 'ZM', 'declined'),
    ],
    description: 'Scope evidence packs and owners for Q2 controls.',
    agenda: [
      agenda('a1', 'Control matrix', true),
      agenda('a2', 'Owner assignments', true),
    ],
    notes: 'Zain declined — Imran covers access logs. Evidence deadline Aug 5.',
    recurring: null,
    createdAt: '2026-07-12',
    createdById: 'usr-mehwish',
    createdByName: 'Mehwish Rauf',
  },
  {
    id: 'mtg-008',
    title: 'MFA rollout checkpoint',
    date: '2026-07-28',
    startTime: '11:00',
    durationMinutes: 40,
    status: 'upcoming',
    type: 'video',
    location: 'Meet · Health IT',
    joinUrl: 'https://meet.pulse.health/mfa',
    projectId: 'prj-mfa-rollout',
    projectName: 'Clinic MFA Rollout',
    teamId: 'team-pulse-it',
    teamName: 'Health IT',
    organizerId: 'usr-kamran',
    organizerName: 'Kamran Shah',
    organizerInitials: 'KS',
    attendees: [
      attendee('usr-kamran', 'Kamran Shah', 'KS', 'accepted'),
      attendee('usr-amna', 'Dr. Amna Siddiqui', 'AS', 'pending'),
    ],
    description: 'Clinic MFA adoption metrics and support desk volume.',
    agenda: [
      agenda('a1', 'Adoption dashboard', false),
      agenda('a2', 'Helpdesk themes', false),
    ],
    notes: null,
    recurring: null,
    createdAt: '2026-07-20',
    createdById: 'usr-kamran',
    createdByName: 'Kamran Shah',
  },
  {
    id: 'mtg-009',
    title: 'Ramadan campaign sync',
    date: '2026-07-29',
    startTime: '15:00',
    durationMinutes: 50,
    status: 'upcoming',
    type: 'in-person',
    location: 'Summit HQ · Studio',
    joinUrl: null,
    projectId: 'prj-ramadan',
    projectName: 'Ramadan Campaign Board',
    teamId: 'team-summit-merch',
    teamName: 'Merchandising',
    organizerId: 'usr-noor',
    organizerName: 'Noor Hassan',
    organizerInitials: 'NH',
    attendees: [
      attendee('usr-noor', 'Noor Hassan', 'NH', 'accepted'),
      attendee('usr-fahad', 'Fahad Mirza', 'FM', 'accepted'),
    ],
    description: 'Creative assets checklist and store POS readiness.',
    agenda: [
      agenda('a1', 'Asset freeze date', false),
      agenda('a2', 'POS checklist owners', false),
    ],
    notes: null,
    recurring: null,
    createdAt: '2026-07-21',
    createdById: 'usr-noor',
    createdByName: 'Noor Hassan',
  },
  {
    id: 'mtg-010',
    title: 'Partner districts onboarding',
    date: '2026-07-30',
    startTime: '09:30',
    durationMinutes: 60,
    status: 'upcoming',
    type: 'video',
    location: 'Zoom · Canvas Partnerships',
    joinUrl: 'https://meet.canvas.edu/partners',
    projectId: 'prj-partner-districts',
    projectName: 'Partner Districts Onboarding',
    teamId: 'team-canvas-partnerships',
    teamName: 'Partnerships',
    organizerId: 'usr-haris',
    organizerName: 'Haris Naveed',
    organizerInitials: 'HN',
    attendees: [
      attendee('usr-haris', 'Haris Naveed', 'HN', 'accepted'),
      attendee('usr-saima', 'Prof. Saima Riaz', 'SR', 'accepted'),
    ],
    description: 'District success playbook and first-week checklist.',
    agenda: [
      agenda('a1', 'Playbook review', false),
      agenda('a2', 'Support SLAs', false),
    ],
    notes: null,
    recurring: 'Monthly',
    createdAt: '2026-07-19',
    createdById: 'usr-haris',
    createdByName: 'Haris Naveed',
  },
  {
    id: 'mtg-011',
    title: 'Frontend architecture hour',
    date: '2026-07-27',
    startTime: '14:00',
    durationMinutes: 60,
    status: 'upcoming',
    type: 'video',
    location: 'Zoom · Frontend',
    joinUrl: 'https://meet.novatech.io/fe-arch',
    projectId: 'prj-acb-core',
    projectName: 'AI Company Brain Core',
    teamId: 'team-nova-frontend',
    teamName: 'Frontend',
    organizerId: 'usr-ahsan',
    organizerName: 'Ahsan Taqweem',
    organizerInitials: 'AT',
    attendees: [
      attendee('usr-ahsan', 'Ahsan Taqweem', 'AT', 'accepted'),
      attendee('usr-omar', 'Omar Farooq', 'OF', 'accepted'),
      attendee('usr-lina', 'Lina Noor', 'LN', 'accepted'),
    ],
    description: 'Route structure for Meetings and drawer patterns.',
    agenda: [
      agenda('a1', 'URL + drawer pattern', false),
      agenda('a2', 'Calendar grid approach', false),
    ],
    notes: null,
    recurring: null,
    createdAt: '2026-07-24',
    createdById: 'usr-ahsan',
    createdByName: 'Ahsan Taqweem',
  },
  {
    id: 'mtg-012',
    title: 'People Ops onboarding dry-run',
    date: '2026-07-22',
    startTime: '11:30',
    durationMinutes: 45,
    status: 'completed',
    type: 'video',
    location: 'Meet · People Ops',
    joinUrl: 'https://meet.novatech.io/onboarding',
    projectId: 'prj-onboarding',
    projectName: 'People Ops Onboarding',
    teamId: 'team-nova-people',
    teamName: 'People Ops',
    organizerId: 'usr-hira',
    organizerName: 'Hira Ali',
    organizerInitials: 'HA',
    attendees: [
      attendee('usr-hira', 'Hira Ali', 'HA', 'accepted'),
      attendee('usr-sara', 'Sara Khan', 'SK', 'accepted'),
      attendee('usr-ahsan', 'Ahsan Taqweem', 'AT', 'declined'),
    ],
    description: 'Walk through day-1 checklist for new joiners.',
    agenda: [
      agenda('a1', 'Checklist dry-run', true),
      agenda('a2', 'Tooling access gaps', true),
    ],
    notes: 'Need Slack invite automation before next cohort. Sara owns ticket.',
    recurring: null,
    createdAt: '2026-07-08',
    createdById: 'usr-hira',
    createdByName: 'Hira Ali',
  },
  {
    id: 'mtg-013',
    title: 'Fleet readiness review',
    date: '2026-07-21',
    startTime: '16:30',
    durationMinutes: 35,
    status: 'cancelled',
    type: 'in-person',
    location: 'Harbor Depot · Bay 2',
    joinUrl: null,
    projectId: 'prj-cold-chain',
    projectName: 'Cold Chain Hub',
    teamId: 'team-harbor-fleet',
    teamName: 'Fleet',
    organizerId: 'usr-bilal',
    organizerName: 'Bilal Ahmed',
    organizerInitials: 'BA',
    attendees: [
      attendee('usr-bilal', 'Bilal Ahmed', 'BA', 'accepted'),
      attendee('usr-usman', 'Usman Tariq', 'UT', 'pending'),
    ],
    description: 'Cancelled due to depot maintenance window.',
    agenda: [agenda('a1', 'Vehicle checklist', false)],
    notes: null,
    recurring: null,
    createdAt: '2026-07-14',
    createdById: 'usr-bilal',
    createdByName: 'Bilal Ahmed',
  },
  {
    id: 'mtg-014',
    title: 'Expansion map workshop',
    date: '2026-08-02',
    startTime: '10:00',
    durationMinutes: 120,
    status: 'upcoming',
    type: 'in-person',
    location: 'Harbor HQ · Strategy Room',
    joinUrl: null,
    projectId: 'prj-harbor-exp',
    projectName: 'Regional Expansion Map',
    teamId: 'team-harbor-hub',
    teamName: 'Hub Ops',
    organizerId: 'usr-nadia',
    organizerName: 'Nadia Rehman',
    organizerInitials: 'NR',
    attendees: [
      attendee('usr-nadia', 'Nadia Rehman', 'NR', 'accepted'),
      attendee('usr-bilal', 'Bilal Ahmed', 'BA', 'accepted'),
      attendee('usr-usman', 'Usman Tariq', 'UT', 'pending'),
    ],
    description: 'Prioritize next three hubs for Q4 expansion.',
    agenda: [
      agenda('a1', 'Demand heatmap', false),
      agenda('a2', 'Capex scenarios', false),
    ],
    notes: null,
    recurring: null,
    createdAt: '2026-07-25',
    createdById: 'usr-nadia',
    createdByName: 'Nadia Rehman',
  },
  {
    id: 'mtg-015',
    title: 'Syllabus pack review',
    date: '2026-07-20',
    startTime: '13:00',
    durationMinutes: 55,
    status: 'completed',
    type: 'video',
    location: 'Zoom · Academics',
    joinUrl: 'https://meet.canvas.edu/syllabus',
    projectId: 'prj-syllabus',
    projectName: 'Term 2 Syllabus Pack',
    teamId: null,
    teamName: null,
    organizerId: 'usr-saima',
    organizerName: 'Prof. Saima Riaz',
    organizerInitials: 'SR',
    attendees: [
      attendee('usr-saima', 'Prof. Saima Riaz', 'SR', 'accepted'),
      attendee('usr-haris', 'Haris Naveed', 'HN', 'accepted'),
    ],
    description: 'Finalize Term 2 syllabus pack for partner districts.',
    agenda: [
      agenda('a1', 'Content completeness', true),
      agenda('a2', 'Accessibility pass', true),
    ],
    notes: 'Approved for partner distribution. Haris will notify districts Friday.',
    recurring: null,
    createdAt: '2026-07-05',
    createdById: 'usr-saima',
    createdByName: 'Prof. Saima Riaz',
  },
  {
    id: 'mtg-016',
    title: 'Store POS checklist alignment',
    date: '2026-08-04',
    startTime: '12:00',
    durationMinutes: 40,
    status: 'upcoming',
    type: 'video',
    location: 'Meet · Summit Retail',
    joinUrl: 'https://meet.summit.retail/pos',
    projectId: 'prj-pos',
    projectName: 'Store POS Checklist',
    teamId: 'team-summit-merch',
    teamName: 'Merchandising',
    organizerId: 'usr-fahad',
    organizerName: 'Fahad Mirza',
    organizerInitials: 'FM',
    attendees: [
      attendee('usr-fahad', 'Fahad Mirza', 'FM', 'accepted'),
      attendee('usr-noor', 'Noor Hassan', 'NH', 'pending'),
    ],
    description: 'Align regional managers on POS open/close checklist.',
    agenda: [agenda('a1', 'Checklist v2 walkthrough', false)],
    notes: null,
    recurring: null,
    createdAt: '2026-07-26',
    createdById: 'usr-fahad',
    createdByName: 'Fahad Mirza',
  },
  {
    id: 'mtg-017',
    title: 'Creative brand sync',
    date: '2026-07-31',
    startTime: '16:00',
    durationMinutes: 45,
    status: 'upcoming',
    type: 'video',
    location: 'Zoom · Orbit Creative',
    joinUrl: 'https://meet.orbit.media/creative',
    projectId: null,
    projectName: null,
    teamId: 'team-orbit-creative',
    teamName: 'Creative',
    organizerId: 'usr-ayesha',
    organizerName: 'Ayesha Bukhari',
    organizerInitials: 'AB',
    attendees: [attendee('usr-ayesha', 'Ayesha Bukhari', 'AB', 'accepted')],
    description: 'Solo planning session for Orbit brand system refresh.',
    agenda: [
      agenda('a1', 'Moodboard shortlist', false),
      agenda('a2', 'Type pairing', false),
    ],
    notes: null,
    recurring: null,
    createdAt: '2026-07-26',
    createdById: 'usr-ayesha',
    createdByName: 'Ayesha Bukhari',
  },
  {
    id: 'mtg-018',
    title: 'Leadership weekly',
    date: '2026-07-19',
    startTime: '09:00',
    durationMinutes: 60,
    status: 'completed',
    type: 'video',
    location: 'Zoom · Exec',
    joinUrl: 'https://meet.novatech.io/leadership',
    projectId: 'prj-acb-core',
    projectName: 'AI Company Brain Core',
    teamId: null,
    teamName: null,
    organizerId: 'usr-ahsan',
    organizerName: 'Ahsan Taqweem',
    organizerInitials: 'AT',
    attendees: [
      attendee('usr-ahsan', 'Ahsan Taqweem', 'AT', 'accepted'),
      attendee('usr-sara', 'Sara Khan', 'SK', 'accepted'),
      attendee('usr-raza', 'M. Raza', 'MR', 'accepted'),
    ],
    description: 'Cross-org priorities and ACB milestone risks.',
    agenda: [
      agenda('a1', 'Milestone review', true),
      agenda('a2', 'Hiring updates', true),
    ],
    notes: 'Greenlight Meetings module as next ship. Sara owns announcement.',
    recurring: 'Weekly',
    createdAt: '2026-06-15',
    createdById: 'usr-ahsan',
    createdByName: 'Ahsan Taqweem',
  },
];

export function getMeetingById(id) {
  return MEETINGS.find((m) => m.id === id) || null;
}

export function getMeetingsByProject(projectId) {
  return MEETINGS.filter((m) => m.projectId === projectId);
}

export function getMeetingsByTeam(teamId) {
  return MEETINGS.filter((m) => m.teamId === teamId);
}

export function getMeetingsByUser(userId) {
  return MEETINGS.filter(
    (m) =>
      m.organizerId === userId || m.attendees.some((a) => a.userId === userId)
  );
}

export function isMyMeeting(meeting, userId = CURRENT_USER_ID) {
  if (!meeting) return false;
  return (
    meeting.organizerId === userId ||
    meeting.attendees.some((a) => a.userId === userId)
  );
}

export function filterMeetings(
  list,
  {
    query = '',
    projectId = 'all',
    teamId = 'all',
    organizerId = 'all',
    myMeetingsOnly = false,
    dateAfter = '',
    dateBefore = '',
  } = {}
) {
  const q = query.trim().toLowerCase();
  return list.filter((m) => {
    if (myMeetingsOnly && !isMyMeeting(m)) return false;
    if (projectId !== 'all' && m.projectId !== projectId) return false;
    if (teamId !== 'all' && m.teamId !== teamId) return false;
    if (organizerId !== 'all' && m.organizerId !== organizerId) return false;
    if (dateAfter && m.date < dateAfter) return false;
    if (dateBefore && m.date > dateBefore) return false;
    if (!q) return true;
    const hay = [
      m.title,
      m.projectName,
      m.teamName,
      m.organizerName,
      m.description,
      m.location,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    return hay.includes(q);
  });
}

export function groupMeetingsByBucket(list, today = REFERENCE_TODAY) {
  const todayItems = [];
  const upcoming = [];
  const past = [];

  const sorted = [...list].sort((a, b) => {
    const ka = `${a.date}T${a.startTime}`;
    const kb = `${b.date}T${b.startTime}`;
    return ka.localeCompare(kb);
  });

  sorted.forEach((m) => {
    if (m.date === today) todayItems.push(m);
    else if (m.date > today) upcoming.push(m);
    else past.push(m);
  });

  // Past newest-first for reading convenience
  past.reverse();

  return [
    { id: 'today', label: 'Today', items: todayItems },
    { id: 'upcoming', label: 'Upcoming', items: upcoming },
    { id: 'past', label: 'Past', items: past },
  ];
}

export function getMeetingsForDate(list, date) {
  return list
    .filter((m) => m.date === date)
    .sort((a, b) => a.startTime.localeCompare(b.startTime));
}

export function formatMeetingDate(iso) {
  try {
    return new Date(`${iso}T12:00:00`).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return iso;
  }
}

export function formatMeetingTime(startTime, durationMinutes) {
  const [h, m] = startTime.split(':').map(Number);
  const start = new Date(2000, 0, 1, h, m);
  const end = new Date(start.getTime() + durationMinutes * 60000);
  const fmt = (d) =>
    d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
  return { startLabel: fmt(start), endLabel: fmt(end), range: `${fmt(start)} – ${fmt(end)}` };
}

export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes}m`;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return m ? `${h}h ${m}m` : `${h}h`;
}

/** Shape for Dashboard UpcomingMeetings widget */
export function getDashboardTodayMeetings(userId = CURRENT_USER_ID) {
  return getMeetingsForDate(MEETINGS, REFERENCE_TODAY)
    .filter((m) => m.status !== 'cancelled' && isMyMeeting(m, userId))
    .map((m) => ({
      id: m.id,
      time: formatMeetingTime(m.startTime, m.durationMinutes).startLabel,
      title: m.title,
      participants: m.attendees.map((a) => a.initials),
    }));
}
