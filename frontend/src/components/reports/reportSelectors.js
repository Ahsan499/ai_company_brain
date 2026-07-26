/**
 * Derived report aggregations — view layer over existing module data.
 * No standalone entity dataset.
 */

import {
  PROJECTS,
  PROJECT_STATUSES,
  PROJECT_STATUS_META,
  PROJECT_PRIORITIES,
  PRIORITY_META,
  getProjectById,
} from '../projects/projectData';
import {
  TASKS,
  TASK_STATUSES,
  TASK_STATUS_META,
  isOverdue,
  projectTaskStats,
} from '../tasks/taskData';
import { TEAMS } from '../teams/teamData';
import { USERS } from '../users/userData';
import {
  TIME_ENTRIES,
  REFERENCE_TODAY,
  filterTimeEntries,
  formatHours,
  hoursByProject,
  hoursByUser,
  minutesToHours,
  resolveDateRange,
  sumMinutes,
} from '../time-tracking/timeEntryData';
import { ORGANIZATIONS } from '../organizations/organizationData';
import { DEPARTMENTS } from '../departments/departmentData';

export { REFERENCE_TODAY, resolveDateRange, formatHours, ORGANIZATIONS, DEPARTMENTS };

function daysBetween(aIso, bIso) {
  try {
    const a = new Date(`${aIso}T12:00:00`);
    const b = new Date(`${bIso}T12:00:00`);
    return Math.round((b - a) / 86400000);
  } catch {
    return 0;
  }
}

function inDateRange(iso, after, before) {
  if (!iso) return true;
  if (after && iso < after) return false;
  if (before && iso > before) return false;
  return true;
}

/** Filter projects / tasks by org + department (and optional date on createdAt). */
export function filterScopedEntities(
  { organizationId = 'all', departmentId = 'all', after = '', before = '' } = {}
) {
  const projects = PROJECTS.filter((p) => {
    if (organizationId !== 'all' && p.organizationId !== organizationId) return false;
    if (departmentId !== 'all' && p.departmentId !== departmentId) return false;
    return true;
  });
  const projectIds = new Set(projects.map((p) => p.id));

  const tasks = TASKS.filter((t) => {
    if (organizationId !== 'all' && t.organizationId !== organizationId) return false;
    if (departmentId !== 'all' && t.departmentId !== departmentId) return false;
    if (projectIds.size && !projectIds.has(t.projectId)) return false;
    return true;
  });

  const teams = TEAMS.filter((t) => {
    if (organizationId !== 'all' && t.organizationId !== organizationId) return false;
    if (departmentId !== 'all' && t.departmentId !== departmentId) return false;
    return true;
  });

  const entries = filterTimeEntries(TIME_ENTRIES, {
    dateAfter: after,
    dateBefore: before,
  }).filter((e) => {
    const proj = getProjectById(e.projectId);
    if (!proj) return false;
    if (organizationId !== 'all' && proj.organizationId !== organizationId) return false;
    if (departmentId !== 'all' && proj.departmentId !== departmentId) return false;
    return true;
  });

  return { projects, tasks, teams, entries, projectIds };
}

export function getOverviewStats(scope) {
  const { projects, tasks, entries } = scope;
  const activeProjects = projects.filter((p) => p.status === 'active').length;
  const done = tasks.filter((t) => t.status === 'done').length;
  const inProgress = tasks.filter((t) => t.status === 'in-progress').length;
  const overdue = tasks.filter((t) => isOverdue(t.dueDate, t.status)).length;
  const hoursLogged = sumMinutes(entries);
  const activeUsers = USERS.filter((u) => u.status === 'active').length;

  return {
    activeProjects,
    totalTasks: tasks.length,
    done,
    inProgress,
    overdue,
    hoursLabel: formatHours(hoursLogged),
    hoursMinutes: hoursLogged,
    activeUsers,
  };
}

/** Weekly completion trend (done tasks by dueDate week) — last 8 weeks. */
export function getTaskCompletionTrend(tasks, today = REFERENCE_TODAY) {
  const end = new Date(`${today}T12:00:00`);
  const weeks = [];
  for (let i = 7; i >= 0; i -= 1) {
    const weekEnd = new Date(end);
    weekEnd.setDate(weekEnd.getDate() - i * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);
    const after = weekStart.toISOString().slice(0, 10);
    const before = weekEnd.toISOString().slice(0, 10);
    const label = weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    const completed = tasks.filter(
      (t) => t.status === 'done' && inDateRange(t.dueDate, after, before)
    ).length;
    weeks.push({ label, completed, after, before });
  }
  return weeks;
}

export function getProjectsByStatus(projects) {
  return PROJECT_STATUSES.map((status) => ({
    key: status,
    name: PROJECT_STATUS_META[status]?.label || status,
    value: projects.filter((p) => p.status === status).length,
    color:
      status === 'active'
        ? '#2563EB'
        : status === 'completed'
          ? '#10B981'
          : status === 'on-hold'
            ? '#F59E0B'
            : '#94A3B8',
  })).filter((d) => d.value > 0);
}

export function getTasksByStatus(tasks) {
  return TASK_STATUSES.map((status) => ({
    key: status,
    name: TASK_STATUS_META[status]?.label || status,
    value: tasks.filter((t) => t.status === status).length,
    color:
      status === 'done'
        ? '#10B981'
        : status === 'in-progress'
          ? '#2563EB'
          : status === 'in-review'
            ? '#8B5CF6'
            : '#94A3B8',
  }));
}

export function getTasksByPriority(tasks) {
  const keys = PROJECT_PRIORITIES || ['low', 'medium', 'high', 'urgent'];
  return keys.map((priority) => ({
    key: priority,
    name: PRIORITY_META[priority]?.label || priority,
    value: tasks.filter((t) => t.priority === priority).length,
    color:
      priority === 'urgent'
        ? '#EF4444'
        : priority === 'high'
          ? '#F59E0B'
          : priority === 'medium'
            ? '#2563EB'
            : '#94A3B8',
  }));
}

export function getRecentCompletions(tasks, projects, limit = 8) {
  const doneTasks = tasks
    .filter((t) => t.status === 'done')
    .map((t) => ({
      id: t.id,
      type: 'task',
      title: t.title,
      meta: t.projectName,
      date: t.dueDate,
      href: `/dashboard/tasks/${t.id}`,
    }));

  const doneProjects = projects
    .filter((p) => p.status === 'completed')
    .map((p) => ({
      id: p.id,
      type: 'project',
      title: p.name,
      meta: p.departmentName,
      date: p.dueDate,
      href: `/dashboard/projects/${p.id}`,
    }));

  return [...doneTasks, ...doneProjects]
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''))
    .slice(0, limit);
}

export function getProjectsReportRows(projects) {
  const today = REFERENCE_TODAY;
  return projects.map((p) => {
    const stats = projectTaskStats(p.id);
    const delayed =
      p.status !== 'completed' && p.dueDate && p.dueDate < today;
    const ratio =
      stats.total === 0 ? 0 : Math.round((stats.done / stats.total) * 100);
    return {
      id: p.id,
      name: p.name,
      status: p.status,
      departmentName: p.departmentName,
      departmentId: p.departmentId,
      progress: p.progress,
      onTime: !delayed,
      delayed,
      tasksDone: stats.done,
      tasksTotal: stats.total,
      completionRatio: ratio,
      dueDate: p.dueDate,
    };
  });
}

export function getProjectsByDepartment(projects) {
  const map = new Map();
  projects.forEach((p) => {
    const name = p.departmentName || 'Unassigned';
    map.set(name, (map.get(name) || 0) + 1);
  });
  return Array.from(map.entries())
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

export function getOverdueTasks(tasks) {
  const today = REFERENCE_TODAY;
  return tasks
    .filter((t) => isOverdue(t.dueDate, t.status))
    .map((t) => ({
      ...t,
      daysOverdue: Math.max(1, daysBetween(t.dueDate, today)),
    }))
    .sort((a, b) => b.daysOverdue - a.daysOverdue);
}

export function getTeamPerformance(teams, tasks, entries) {
  return teams.map((team) => {
    const memberSet = new Set(team.memberIds || []);
    const teamTasks = tasks.filter((t) => memberSet.has(t.assigneeId));
    const completed = teamTasks.filter((t) => t.status === 'done');
    const cycleDays = completed.map((t) =>
      Math.max(1, daysBetween(t.createdAt, t.dueDate || t.createdAt))
    );
    const avgCompletion =
      cycleDays.length === 0
        ? null
        : Math.round(cycleDays.reduce((a, b) => a + b, 0) / cycleDays.length);

    const minutes = sumMinutes(
      entries.filter(
        (e) => e.teamId === team.id || memberSet.has(e.userId)
      )
    );

    return {
      id: team.id,
      name: team.name,
      organizationName: team.organizationName,
      departmentName: team.departmentName,
      memberCount: memberSet.size,
      tasksCompleted: completed.length,
      tasksTotal: teamTasks.length,
      avgCompletionDays: avgCompletion,
      hoursMinutes: minutes,
      hoursLabel: formatHours(minutes),
      color: team.color || '#2563EB',
    };
  }).sort((a, b) => b.tasksCompleted - a.tasksCompleted);
}

export function getHoursByDepartment(entries) {
  const map = new Map();
  entries.forEach((e) => {
    const proj = getProjectById(e.projectId);
    const name = proj?.departmentName || 'Unassigned';
    map.set(name, (map.get(name) || 0) + e.durationMinutes);
  });
  return Array.from(map.entries())
    .map(([name, minutes]) => ({
      name,
      hours: minutesToHours(minutes, 1),
      minutes,
    }))
    .sort((a, b) => b.minutes - a.minutes);
}

export function getTimeReportBundle(entries) {
  return {
    byProject: hoursByProject(entries),
    byUser: hoursByUser(entries),
    byDepartment: getHoursByDepartment(entries),
    totalMinutes: sumMinutes(entries),
  };
}

export function departmentsForOrg(organizationId = 'all') {
  if (organizationId === 'all') return DEPARTMENTS;
  return DEPARTMENTS.filter((d) => d.organizationId === organizationId);
}
