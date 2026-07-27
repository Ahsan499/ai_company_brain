import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { buildParams, unwrapItem, unwrapList } from '../lib/api';
import { useAuth } from '../context/AuthContext';
import { taskKeys } from './useTasks';
import { projectKeys } from './useProjects';

export const timeEntryKeys = {
  all: ['time-entries'],
  lists: () => [...timeEntryKeys.all, 'list'],
  list: (filters) => [...timeEntryKeys.lists(), filters],
  details: () => [...timeEntryKeys.all, 'detail'],
  detail: (id) => [...timeEntryKeys.details(), id],
  reportSummary: (filters) => [...timeEntryKeys.all, 'report-summary', filters],
  reportByProject: (filters) => [...timeEntryKeys.all, 'report-by-project', filters],
  reportByUser: (filters) => [...timeEntryKeys.all, 'report-by-user', filters],
};

export function normalizeTimeEntry(entry) {
  if (!entry) return entry;
  return {
    ...entry,
    userName:
      entry.userName ??
      (typeof entry.user === 'object' ? entry.user?.name : null) ??
      'Unknown',
    initials:
      entry.initials ??
      (typeof entry.user === 'object' ? entry.user?.initials : null) ??
      '?',
    taskTitle:
      entry.taskTitle ??
      (typeof entry.task === 'object' ? entry.task?.title : null) ??
      '—',
    projectName:
      entry.projectName ??
      (typeof entry.project === 'object' ? entry.project?.name : null) ??
      '—',
    teamName:
      entry.teamName ??
      (typeof entry.team === 'object' ? entry.team?.name : null) ??
      null,
  };
}

/* ─── Queries ─── */

/**
 * Fetch time entries. Defaults `userId` to the current authenticated user
 * unless the caller explicitly passes a different value (or 'all').
 */
export function useTimeEntries(filters = {}) {
  const { user } = useAuth();
  const {
    userId,
    taskId = 'all',
    projectId = 'all',
    dateFrom = '',
    dateTo = '',
    billable,
    page = 1,
    perPage = 100,
  } = filters;

  // Default to current user unless caller overrides
  const effectiveUserId = userId !== undefined ? userId : (user?.id ?? 'all');

  const params = buildParams({
    user_id: effectiveUserId,
    task_id: taskId,
    project_id: projectId,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    billable: billable !== undefined ? (billable ? '1' : '0') : undefined,
    page,
    per_page: perPage,
  });

  return useQuery({
    queryKey: timeEntryKeys.list(params),
    queryFn: async () => {
      const res = await apiClient.get('/time-entries', { params });
      const data = unwrapList(res);
      return {
        ...data,
        data: data.data.map(normalizeTimeEntry),
      };
    },
    placeholderData: (prev) => prev,
  });
}

export function useTimeReportSummary(filters = {}) {
  const params = buildParams({
    team_id: filters.teamId,
    project_id: filters.projectId,
    user_id: filters.userId,
    date_from: filters.dateFrom || undefined,
    date_to: filters.dateTo || undefined,
  });

  return useQuery({
    queryKey: timeEntryKeys.reportSummary(params),
    queryFn: async () => {
      const res = await apiClient.get('/time-entries/reports/summary', { params });
      return unwrapItem(res);
    },
    placeholderData: (prev) => prev,
  });
}

export function useTimeReportByProject(filters = {}) {
  const params = buildParams({
    team_id: filters.teamId,
    project_id: filters.projectId,
    user_id: filters.userId,
    date_from: filters.dateFrom || undefined,
    date_to: filters.dateTo || undefined,
  });

  return useQuery({
    queryKey: timeEntryKeys.reportByProject(params),
    queryFn: async () => {
      const res = await apiClient.get('/time-entries/reports/by-project', { params });
      return unwrapItem(res);
    },
    placeholderData: (prev) => prev,
  });
}

export function useTimeReportByUser(filters = {}) {
  const params = buildParams({
    team_id: filters.teamId,
    project_id: filters.projectId,
    user_id: filters.userId,
    date_from: filters.dateFrom || undefined,
    date_to: filters.dateTo || undefined,
  });

  return useQuery({
    queryKey: timeEntryKeys.reportByUser(params),
    queryFn: async () => {
      const res = await apiClient.get('/time-entries/reports/by-user', { params });
      return unwrapItem(res);
    },
    placeholderData: (prev) => prev,
  });
}

/* ─── Mutations ─── */

function invalidateTimeEntryParents(queryClient, entry) {
  // Invalidate the related task's time summary
  if (entry?.taskId) {
    queryClient.invalidateQueries({ queryKey: taskKeys.timeSummary(entry.taskId) });
    queryClient.invalidateQueries({ queryKey: taskKeys.detail(entry.taskId) });
  }
  // Invalidate parent project (totalHoursLogged)
  if (entry?.projectId) {
    queryClient.invalidateQueries({ queryKey: projectKeys.detail(entry.projectId) });
  }
  // Invalidate all report caches
  queryClient.invalidateQueries({ queryKey: [...timeEntryKeys.all, 'report-summary'] });
  queryClient.invalidateQueries({ queryKey: [...timeEntryKeys.all, 'report-by-project'] });
  queryClient.invalidateQueries({ queryKey: [...timeEntryKeys.all, 'report-by-user'] });
}

export function useCreateTimeEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/time-entries', payload);
      return normalizeTimeEntry(unwrapItem(res));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: timeEntryKeys.lists() });
      invalidateTimeEntryParents(queryClient, data);
    },
  });
}

export function useUpdateTimeEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await apiClient.put(`/time-entries/${id}`, payload);
      return normalizeTimeEntry(unwrapItem(res));
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: timeEntryKeys.lists() });
      queryClient.invalidateQueries({ queryKey: timeEntryKeys.detail(vars.id) });
      invalidateTimeEntryParents(queryClient, data);
    },
  });
}

export function useDeleteTimeEntry() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, taskId, projectId }) => {
      await apiClient.delete(`/time-entries/${id}`);
      return { id, taskId, projectId };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: timeEntryKeys.lists() });
      queryClient.removeQueries({ queryKey: timeEntryKeys.detail(data.id) });
      invalidateTimeEntryParents(queryClient, data);
    },
  });
}
