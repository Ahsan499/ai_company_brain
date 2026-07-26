/**
 * Derived profile aggregations — view layer over existing module data.
 * Reusable for any userId (own profile or teammate).
 */

import {
  FolderPlus,
  Pencil,
  Trash2,
  LogIn,
  KeyRound,
  UserPlus,
  UserMinus,
  Activity,
} from 'lucide-react';
import { getUserById } from '../users/userData';
import { getProjectsByUser } from '../projects/projectData';
import { getTasksByAssignee } from '../tasks/taskData';
import { getTeamsByUser } from '../teams/teamData';
import {
  AUDIT_LOGS,
  AUDIT_ACTION_META,
  formatRelativeTime,
} from '../audit-logs/auditLogData';
import {
  TIME_ENTRIES,
  REFERENCE_TODAY,
  getEntriesByUser,
  sumMinutes,
  formatHours,
  getWeekStart,
  getWeekDates,
  buildTimesheetRows,
  filterTimeEntries,
} from '../time-tracking/timeEntryData';

export const PROFILE_CURRENT_USER_ID = 'usr-ahsan';

export const PROFILE_BIOS = {
  'usr-ahsan':
    'Founder and Super Administrator of AI Company Brain. Focused on product strategy, platform architecture, and helping teams ship knowledge workflows that feel as sharp as Linear.',
};

export const PROFILE_SKILLS = {
  'usr-ahsan': [
    'React',
    'Product Strategy',
    'Team Leadership',
    'Enterprise SaaS',
    'Design Systems',
    'AI Workflows',
  ],
};

const ACTION_ICONS = {
  create: FolderPlus,
  update: Pencil,
  delete: Trash2,
  login: LogIn,
  permission_change: KeyRound,
  invite: UserPlus,
  remove: UserMinus,
};

const ACTION_COLORS = {
  create: 'bg-gradient-to-br from-[#059669] to-[#10B981]',
  update: 'bg-gradient-to-br from-primary to-[#1D4ED8]',
  delete: 'bg-gradient-to-br from-[#EF4444] to-[#F87171]',
  login: 'bg-gradient-to-br from-[#D97706] to-[#F59E0B]',
  permission_change: 'bg-gradient-to-br from-[#D97706] to-[#F59E0B]',
  invite: 'bg-gradient-to-br from-primary to-[#3B82F6]',
  remove: 'bg-gradient-to-br from-[#EF4444] to-[#F87171]',
};

export function getProfileUser(userId = PROFILE_CURRENT_USER_ID) {
  return getUserById(userId);
}

export function getUserStats(userId) {
  const tasks = getTasksByAssignee(userId);
  const projects = getProjectsByUser(userId);
  const teams = getTeamsByUser(userId);

  const monthStart = `${REFERENCE_TODAY.slice(0, 8)}01`;
  const monthEntries = filterTimeEntries(TIME_ENTRIES, {
    userId,
    dateAfter: monthStart,
    dateBefore: REFERENCE_TODAY,
  });

  return {
    tasksCompleted: tasks.filter((t) => t.status === 'done').length,
    tasksTotal: tasks.length,
    activeProjects: projects.filter((p) => p.status === 'active').length,
    projectsTotal: projects.length,
    hoursThisMonth: formatHours(sumMinutes(monthEntries)),
    hoursThisMonthMinutes: sumMinutes(monthEntries),
    teamsJoined: teams.length,
  };
}

export function getUserProfileProjects(userId) {
  return getProjectsByUser(userId);
}

export function getUserProfileTasks(userId) {
  return getTasksByAssignee(userId);
}

export function getUserProfileTeams(userId) {
  return getTeamsByUser(userId);
}

export function getUserBio(userId) {
  return (
    PROFILE_BIOS[userId] ||
    'Contributor on AI Company Brain — collaborating across projects, tasks, and knowledge workflows.'
  );
}

export function getUserSkills(userId) {
  return PROFILE_SKILLS[userId] || ['Collaboration', 'Delivery', 'Communication'];
}

/** Format audit logs as ActivityTimeline items. */
export function getUserActivity(userId, limit = 20) {
  return AUDIT_LOGS.filter((l) => l.actorId === userId)
    .sort((a, b) => b.timestamp.localeCompare(a.timestamp))
    .slice(0, limit)
    .map((l) => {
      const meta = AUDIT_ACTION_META[l.action] || AUDIT_ACTION_META.update;
      return {
        id: l.id,
        icon: ACTION_ICONS[l.action] || Activity,
        title: `${meta.label} · ${l.entityName}`,
        detail: `${meta.verb} ${l.module.toLowerCase()}`,
        time: formatRelativeTime(l.timestamp),
        color: ACTION_COLORS[l.action] || ACTION_COLORS.update,
      };
    });
}

export function getUserTimesheet(userId, today = REFERENCE_TODAY) {
  const weekDates = getWeekDates(getWeekStart(today));
  const entries = getEntriesByUser(userId);
  const rows = buildTimesheetRows(entries, userId, weekDates);
  return { weekDates, rows, totalMinutes: sumMinutes(entries.filter((e) => weekDates.includes(e.date))) };
}

export function getTimezoneLabel(user) {
  if (!user?.location) return 'Asia/Dubai (GMT+4)';
  if (String(user.location).includes('Karachi') || String(user.location).includes('PK')) {
    return 'Asia/Karachi (GMT+5)';
  }
  if (String(user.location).includes('London')) return 'Europe/London (GMT+0)';
  return 'Asia/Dubai (GMT+4)';
}
