/**
 * Source of truth for time entries.
 * Linked to users (userData), tasks (taskData), and projects (projectData).
 * Reference “today”: 2026-07-26.
 */

export const CURRENT_USER_ID = 'usr-ahsan';
export const REFERENCE_TODAY = '2026-07-26';

function entry(id, userId, userName, initials, taskId, taskTitle, projectId, projectName, teamId, teamName, date, durationMinutes, note, billable) {
  return {
    id,
    userId,
    userName,
    initials,
    taskId,
    taskTitle,
    projectId,
    projectName,
    teamId,
    teamName,
    date,
    durationMinutes,
    note,
    billable,
  };
}

export const TIME_ENTRIES = [
  entry('te-035', 'usr-saima', 'Prof. Saima Riaz', 'SR', 'tsk-034', 'Approve success metrics', 'prj-partner-districts', 'Partner Districts Onboarding', 'team-canvas-partnerships', 'Partnerships', '2026-06-30', 120, 'QA walkthrough', false),
  entry('te-043', 'usr-bilal', 'Bilal Ahmed', 'BA', 'tsk-015', 'Alert thresholds for freezers', 'prj-cold-chain', 'Cold Chain Hub', 'team-harbor-hub', 'Hub Ops', '2026-06-30', 45, 'Focused implementation block', false),
  entry('te-016', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-005', 'Security checklist for project files tab', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-01', 75, 'Bugfix + fix', true),
  entry('te-052', 'usr-omar', 'Omar Farooq', 'OF', 'tsk-007', 'Implement token bucket limiter', 'prj-api-gw', 'API Gateway v2', 'team-nova-backend', 'Backend', '2026-07-01', 30, 'Code review follow-ups', true),
  entry('te-054', 'usr-imran', 'Imran Qureshi', 'IQ', 'tsk-026', 'Partner sign-off', 'prj-q2-audit', 'Q2 Compliance Audit', 'team-ledger-compliance', 'Compliance', '2026-07-01', 60, 'Planning and estimation', false),
  entry('te-037', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-006', 'Promote tasks into standalone module', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-02', 180, 'Code review follow-ups', true),
  entry('te-017', 'usr-bilal', 'Bilal Ahmed', 'BA', 'tsk-015', 'Alert thresholds for freezers', 'prj-cold-chain', 'Cold Chain Hub', 'team-harbor-hub', 'Hub Ops', '2026-07-03', 150, 'Bugfix + fix', true),
  entry('te-031', 'usr-kamran', 'Kamran Shah', 'KS', 'tsk-022', 'Admin MFA policy', 'prj-mfa-rollout', 'Clinic MFA Rollout', 'team-pulse-clinical', 'Clinical Ops', '2026-07-03', 90, 'Planning and estimation', false),
  entry('te-033', 'usr-haris', 'Haris Naveed', 'HN', 'tsk-033', 'Draft onboarding agenda', 'prj-partner-districts', 'Partner Districts Onboarding', 'team-canvas-partnerships', 'Partnerships', '2026-07-03', 90, 'Refactor for clarity', true),
  entry('te-056', 'usr-haris', 'Haris Naveed', 'HN', 'tsk-032', 'Partner school outreach', 'prj-syllabus', 'Term 2 Syllabus Pack', 'team-canvas-partnerships', 'Partnerships', '2026-07-04', 75, 'Bugfix + fix', false),
  entry('te-018', 'usr-mehwish', 'Mehwish Rauf', 'MR', 'tsk-024', 'Gather bank reconciliations', 'prj-q2-audit', 'Q2 Compliance Audit', 'team-ledger-compliance', 'Compliance', '2026-07-05', 120, 'Design sync leftovers', false),
  entry('te-053', 'usr-usman', 'Usman Tariq', 'UT', 'tsk-016', 'Fleet assignment rules', 'prj-cold-chain', 'Cold Chain Hub', 'team-harbor-hub', 'Hub Ops', '2026-07-05', 150, 'QA walkthrough', true),
  entry('te-023', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-005', 'Security checklist for project files tab', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-06', 120, 'Docs and polish', true),
  entry('te-045', 'usr-haris', 'Haris Naveed', 'HN', 'tsk-032', 'Partner school outreach', 'prj-syllabus', 'Term 2 Syllabus Pack', 'team-canvas-partnerships', 'Partnerships', '2026-07-06', 60, 'Stakeholder demo prep', true),
  entry('te-022', 'usr-sara', 'Sara Khan', 'SK', 'tsk-004', 'Product review of milestone UX', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-product', 'Product Ops', '2026-07-07', 30, 'Design sync leftovers', true),
  entry('te-051', 'usr-noor', 'Noor Hassan', 'NH', 'tsk-030', 'Merch alignment notes', 'prj-pos', 'Store POS Checklist', 'team-summit-merch', 'Merchandising', '2026-07-07', 45, 'QA walkthrough', true),
  entry('te-039', 'usr-lina', 'Lina Noor', 'LN', 'tsk-011', 'Motion spring presets', 'prj-design-sys', 'Design System 2.0', 'team-nova-frontend', 'Frontend', '2026-07-08', 150, 'Docs and polish', true),
  entry('te-055', 'usr-zain', 'Zain Malik', 'ZM', 'tsk-025', 'Guest auditor access', 'prj-q2-audit', 'Q2 Compliance Audit', 'team-ledger-compliance', 'Compliance', '2026-07-08', 180, 'Bugfix + fix', true),
  entry('te-042', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-005', 'Security checklist for project files tab', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-10', 30, 'Stakeholder demo prep', true),
  entry('te-044', 'usr-lina', 'Lina Noor', 'LN', 'tsk-003', 'Design project workspace header', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-frontend', 'Frontend', '2026-07-10', 45, 'Refactor for clarity', false),
  entry('te-026', 'usr-imran', 'Imran Qureshi', 'IQ', 'tsk-026', 'Partner sign-off', 'prj-q2-audit', 'Q2 Compliance Audit', 'team-ledger-compliance', 'Compliance', '2026-07-11', 75, 'Pairing session', true),
  entry('te-034', 'usr-lina', 'Lina Noor', 'LN', 'tsk-010', 'Document color tokens', 'prj-design-sys', 'Design System 2.0', 'team-nova-frontend', 'Frontend', '2026-07-11', 60, 'Refactor for clarity', true),
  entry('te-041', 'usr-mehwish', 'Mehwish Rauf', 'MR', 'tsk-024', 'Gather bank reconciliations', 'prj-q2-audit', 'Q2 Compliance Audit', 'team-ledger-compliance', 'Compliance', '2026-07-14', 180, 'Code review follow-ups', false),
  entry('te-050', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-035', 'Command palette empty state polish', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-14', 60, 'Planning and estimation', false),
  entry('te-029', 'usr-zain', 'Zain Malik', 'ZM', 'tsk-025', 'Guest auditor access', 'prj-q2-audit', 'Q2 Compliance Audit', 'team-ledger-compliance', 'Compliance', '2026-07-19', 180, 'Refactor for clarity', false),
  entry('te-001', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-005', 'Security checklist for project files tab', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-20', 60, 'Bugfix + fix', false),
  entry('te-002', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-006', 'Promote tasks into standalone module', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-20', 45, 'Pairing session', true),
  entry('te-021', 'usr-nadia', 'Nadia Rehman', 'NR', 'tsk-018', 'Compile site criteria', 'prj-harbor-exp', 'Regional Expansion Map', 'team-harbor-hub', 'Hub Ops', '2026-07-20', 75, 'Design sync leftovers', true),
  entry('te-024', 'usr-imran', 'Imran Qureshi', 'IQ', 'tsk-026', 'Partner sign-off', 'prj-q2-audit', 'Q2 Compliance Audit', 'team-ledger-compliance', 'Compliance', '2026-07-20', 180, 'Pairing session', false),
  entry('te-003', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-005', 'Security checklist for project files tab', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-21', 60, 'Planning and estimation', false),
  entry('te-004', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-006', 'Promote tasks into standalone module', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-21', 90, 'Code review follow-ups', false),
  entry('te-030', 'usr-raza', 'M. Raza', 'MR', 'tsk-001', 'Build Projects list & board views', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-21', 45, 'Refactor for clarity', true),
  entry('te-047', 'usr-omar', 'Omar Farooq', 'OF', 'tsk-007', 'Implement token bucket limiter', 'prj-api-gw', 'API Gateway v2', 'team-nova-backend', 'Backend', '2026-07-21', 150, 'Design sync leftovers', true),
  entry('te-005', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-005', 'Security checklist for project files tab', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-22', 60, 'Docs and polish', true),
  entry('te-006', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-006', 'Promote tasks into standalone module', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-22', 90, 'Refactor for clarity', true),
  entry('te-019', 'usr-nadia', 'Nadia Rehman', 'NR', 'tsk-018', 'Compile site criteria', 'prj-harbor-exp', 'Regional Expansion Map', 'team-harbor-hub', 'Hub Ops', '2026-07-22', 45, 'Stakeholder demo prep', true),
  entry('te-040', 'usr-hira', 'Hira Ali', 'HA', 'tsk-013', 'Welcome email templates', 'prj-onboarding', 'People Ops Onboarding', 'team-nova-people', 'People Ops', '2026-07-22', 90, 'Planning and estimation', true),
  entry('te-007', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-005', 'Security checklist for project files tab', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-23', 150, 'Bugfix + fix', true),
  entry('te-008', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-006', 'Promote tasks into standalone module', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-23', 90, 'Focused implementation block', true),
  entry('te-020', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-035', 'Command palette empty state polish', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-23', 75, 'Pairing session', true),
  entry('te-025', 'usr-usman', 'Usman Tariq', 'UT', 'tsk-016', 'Fleet assignment rules', 'prj-cold-chain', 'Cold Chain Hub', 'team-harbor-hub', 'Hub Ops', '2026-07-23', 90, 'Stakeholder demo prep', true),
  entry('te-032', 'usr-raza', 'M. Raza', 'MR', 'tsk-001', 'Build Projects list & board views', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-23', 90, 'Refactor for clarity', true),
  entry('te-048', 'usr-noor', 'Noor Hassan', 'NH', 'tsk-030', 'Merch alignment notes', 'prj-pos', 'Store POS Checklist', 'team-summit-merch', 'Merchandising', '2026-07-23', 30, 'Code review follow-ups', false),
  entry('te-009', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-005', 'Security checklist for project files tab', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-24', 90, 'Planning and estimation', true),
  entry('te-010', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-006', 'Promote tasks into standalone module', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-24', 90, 'Pairing session', false),
  entry('te-027', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-006', 'Promote tasks into standalone module', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-24', 30, 'Code review follow-ups', false),
  entry('te-038', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-035', 'Command palette empty state polish', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-24', 60, 'Pairing session', true),
  entry('te-011', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-005', 'Security checklist for project files tab', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-25', 120, 'Code review follow-ups', true),
  entry('te-012', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-006', 'Promote tasks into standalone module', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-25', 45, 'Design sync leftovers', true),
  entry('te-028', 'usr-lina', 'Lina Noor', 'LN', 'tsk-011', 'Motion spring presets', 'prj-design-sys', 'Design System 2.0', 'team-nova-frontend', 'Frontend', '2026-07-25', 150, 'Stakeholder demo prep', false),
  entry('te-046', 'usr-usman', 'Usman Tariq', 'UT', 'tsk-016', 'Fleet assignment rules', 'prj-cold-chain', 'Cold Chain Hub', 'team-harbor-hub', 'Hub Ops', '2026-07-25', 180, 'Planning and estimation', false),
  entry('te-049', 'usr-kamran', 'Kamran Shah', 'KS', 'tsk-022', 'Admin MFA policy', 'prj-mfa-rollout', 'Clinic MFA Rollout', 'team-pulse-clinical', 'Clinical Ops', '2026-07-25', 45, 'Docs and polish', false),
  entry('te-013', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-005', 'Security checklist for project files tab', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-26', 120, 'QA walkthrough', true),
  entry('te-014', 'usr-ahsan', 'Ahsan Taqweem', 'AT', 'tsk-006', 'Promote tasks into standalone module', 'prj-acb-core', 'AI Company Brain Core', 'team-nova-backend', 'Backend', '2026-07-26', 45, 'Planning and estimation', false),
  entry('te-015', 'usr-bilal', 'Bilal Ahmed', 'BA', 'tsk-019', 'Ops capacity model', 'prj-harbor-exp', 'Regional Expansion Map', 'team-harbor-hub', 'Hub Ops', '2026-07-26', 120, 'Stakeholder demo prep', false),
  entry('te-036', 'usr-mehwish', 'Mehwish Rauf', 'MR', 'tsk-024', 'Gather bank reconciliations', 'prj-q2-audit', 'Q2 Compliance Audit', 'team-ledger-compliance', 'Compliance', '2026-07-26', 90, 'Docs and polish', false),
];

export function getTimeEntryById(id) {
  return TIME_ENTRIES.find((e) => e.id === id) || null;
}

export function getEntriesByUser(userId) {
  return TIME_ENTRIES.filter((e) => e.userId === userId);
}

export function getEntriesByTask(taskId) {
  return TIME_ENTRIES.filter((e) => e.taskId === taskId);
}

export function getEntriesByProject(projectId) {
  return TIME_ENTRIES.filter((e) => e.projectId === projectId);
}

export function sumMinutes(entries) {
  return entries.reduce((acc, e) => acc + (e.durationMinutes || 0), 0);
}

export function minutesToHours(minutes, decimals = 1) {
  const h = (minutes || 0) / 60;
  return Number(h.toFixed(decimals));
}

export function formatHours(minutes) {
  const m = minutes || 0;
  const h = Math.floor(m / 60);
  const rem = m % 60;
  if (h === 0) return `${rem}m`;
  if (rem === 0) return `${h}h`;
  return `${h}h ${rem}m`;
}

export function formatHoursDecimal(minutes) {
  return minutesToHours(minutes, 1).toFixed(1);
}

function toLocalISO(d) {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
}

/** Monday of the week containing isoDate (YYYY-MM-DD). Week starts Monday. */
export function getWeekStart(isoDate = REFERENCE_TODAY) {
  const d = new Date(`${isoDate}T12:00:00`);
  const day = d.getDay(); // 0 Sun
  const diff = day === 0 ? -6 : 1 - day;
  d.setDate(d.getDate() + diff);
  return toLocalISO(d);
}

export function getWeekDates(weekStartIso) {
  const start = new Date(`${weekStartIso}T12:00:00`);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(start.getDate() + i);
    return toLocalISO(d);
  });
}

export function filterTimeEntries(
  list,
  {
    userId = 'all',
    projectId = 'all',
    teamId = 'all',
    dateAfter = '',
    dateBefore = '',
  } = {}
) {
  return list.filter((e) => {
    if (userId !== 'all' && e.userId !== userId) return false;
    if (projectId !== 'all' && e.projectId !== projectId) return false;
    if (teamId !== 'all' && e.teamId !== teamId) return false;
    if (dateAfter && e.date < dateAfter) return false;
    if (dateBefore && e.date > dateBefore) return false;
    return true;
  });
}

export function buildTimesheetRows(entries, userId, weekDates) {
  const mine = entries.filter((e) => e.userId === userId && weekDates.includes(e.date));
  const byKey = new Map();
  mine.forEach((e) => {
    const key = e.taskId || e.projectId;
    if (!byKey.has(key)) {
      byKey.set(key, {
        key,
        taskId: e.taskId,
        taskTitle: e.taskTitle,
        projectId: e.projectId,
        projectName: e.projectName,
        days: Object.fromEntries(weekDates.map((d) => [d, 0])),
      });
    }
    byKey.get(key).days[e.date] += e.durationMinutes;
  });
  return Array.from(byKey.values()).map((row) => ({
    ...row,
    rowTotal: weekDates.reduce((acc, d) => acc + row.days[d], 0),
  }));
}

export function hoursByProject(entries) {
  const map = new Map();
  entries.forEach((e) => {
    const name = e.projectName || 'Unknown';
    map.set(name, (map.get(name) || 0) + e.durationMinutes);
  });
  return Array.from(map.entries())
    .map(([name, minutes]) => ({ name, hours: minutesToHours(minutes, 1), minutes }))
    .sort((a, b) => b.minutes - a.minutes);
}

export function hoursByUser(entries) {
  const map = new Map();
  entries.forEach((e) => {
    if (!map.has(e.userId)) {
      map.set(e.userId, {
        userId: e.userId,
        userName: e.userName,
        initials: e.initials,
        teamName: e.teamName,
        minutes: 0,
        billable: 0,
        nonBillable: 0,
      });
    }
    const row = map.get(e.userId);
    row.minutes += e.durationMinutes;
    if (e.billable) row.billable += e.durationMinutes;
    else row.nonBillable += e.durationMinutes;
  });
  return Array.from(map.values()).sort((a, b) => b.minutes - a.minutes);
}

export function resolveDateRange(preset, customAfter = '', customBefore = '') {
  const today = REFERENCE_TODAY;
  if (preset === 'custom') {
    return { after: customAfter || '', before: customBefore || today };
  }
  if (preset === 'this-week') {
    const start = getWeekStart(today);
    return { after: start, before: today };
  }
  if (preset === 'last-week') {
    const thisStart = getWeekStart(today);
    const d = new Date(`${thisStart}T12:00:00`);
    d.setDate(d.getDate() - 7);
    const after = toLocalISO(d);
    const beforeDate = new Date(`${thisStart}T12:00:00`);
    beforeDate.setDate(beforeDate.getDate() - 1);
    return { after, before: toLocalISO(beforeDate) };
  }
  if (preset === 'this-month') {
    return { after: today.slice(0, 8) + '01', before: today };
  }
  if (preset === 'this-quarter') {
    const month = Number(today.slice(5, 7));
    const qStartMonth = month <= 3 ? 1 : month <= 6 ? 4 : month <= 9 ? 7 : 10;
    const after = `${today.slice(0, 4)}-${String(qStartMonth).padStart(2, '0')}-01`;
    return { after, before: today };
  }
  return { after: '', before: today };
}

export function getTaskLoggedMinutes(taskId) {
  return sumMinutes(getEntriesByTask(taskId));
}

export function getProjectLoggedMinutes(projectId) {
  return sumMinutes(getEntriesByProject(projectId));
}

export function getUserWeekMinutes(userId, today = REFERENCE_TODAY) {
  const week = getWeekDates(getWeekStart(today));
  return sumMinutes(
    TIME_ENTRIES.filter((e) => e.userId === userId && week.includes(e.date))
  );
}
