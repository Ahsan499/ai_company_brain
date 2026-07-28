import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { buildParams, unwrapItem, unwrapList } from '../lib/api';

export const reportsKeys = {
  all: ['reports'],
  overview: (params) => [...reportsKeys.all, 'overview', params],
  taskCompletionTrend: (params) => [...reportsKeys.all, 'task-completion-trend', params],
  projectsByStatus: (params) => [...reportsKeys.all, 'projects-by-status', params],
  projectsByDepartment: (params) => [...reportsKeys.all, 'projects-by-department', params],
  tasksByStatus: (params) => [...reportsKeys.all, 'tasks-by-status', params],
  tasksByPriority: (params) => [...reportsKeys.all, 'tasks-by-priority', params],
  overdueTasks: (params) => [...reportsKeys.all, 'overdue-tasks', params],
  teamPerformance: (params) => [...reportsKeys.all, 'team-performance', params],
};

function withPermissionMessage(error) {
  if (error?.response?.status === 403) {
    const wrapped = new Error("You don't have permission to view this report.");
    wrapped.cause = error;
    return wrapped;
  }
  return error;
}

function buildReportParams(filters = {}) {
  return buildParams({
    organization_id: filters.organizationId,
    department_id: filters.departmentId,
    date_from: filters.dateFrom || undefined,
    date_to: filters.dateTo || undefined,
    page: filters.page,
    per_page: filters.perPage,
  });
}

export function useReportsOverview(filters = {}) {
  const params = buildReportParams(filters);
  return useQuery({
    queryKey: reportsKeys.overview(params),
    queryFn: async () => {
      try {
        const res = await apiClient.get('/reports/overview', { params });
        return unwrapItem(res);
      } catch (error) {
        throw withPermissionMessage(error);
      }
    },
    placeholderData: (prev) => prev,
  });
}

export function useTaskCompletionTrend(filters = {}) {
  const params = buildReportParams(filters);
  return useQuery({
    queryKey: reportsKeys.taskCompletionTrend(params),
    queryFn: async () => {
      try {
        const res = await apiClient.get('/reports/task-completion-trend', { params });
        return unwrapItem(res);
      } catch (error) {
        throw withPermissionMessage(error);
      }
    },
    placeholderData: (prev) => prev,
  });
}

export function useProjectsByStatus(filters = {}) {
  const params = buildReportParams(filters);
  return useQuery({
    queryKey: reportsKeys.projectsByStatus(params),
    queryFn: async () => {
      try {
        const res = await apiClient.get('/reports/projects-by-status', { params });
        return unwrapItem(res);
      } catch (error) {
        throw withPermissionMessage(error);
      }
    },
    placeholderData: (prev) => prev,
  });
}

export function useProjectsByDepartment(filters = {}) {
  const params = buildReportParams(filters);
  return useQuery({
    queryKey: reportsKeys.projectsByDepartment(params),
    queryFn: async () => {
      try {
        const res = await apiClient.get('/reports/projects-by-department', { params });
        return unwrapItem(res);
      } catch (error) {
        throw withPermissionMessage(error);
      }
    },
    placeholderData: (prev) => prev,
  });
}

export function useTasksByStatus(filters = {}) {
  const params = buildReportParams(filters);
  return useQuery({
    queryKey: reportsKeys.tasksByStatus(params),
    queryFn: async () => {
      try {
        const res = await apiClient.get('/reports/tasks-by-status', { params });
        return unwrapItem(res);
      } catch (error) {
        throw withPermissionMessage(error);
      }
    },
    placeholderData: (prev) => prev,
  });
}

export function useTasksByPriority(filters = {}) {
  const params = buildReportParams(filters);
  return useQuery({
    queryKey: reportsKeys.tasksByPriority(params),
    queryFn: async () => {
      try {
        const res = await apiClient.get('/reports/tasks-by-priority', { params });
        return unwrapItem(res);
      } catch (error) {
        throw withPermissionMessage(error);
      }
    },
    placeholderData: (prev) => prev,
  });
}

function normalizeOverdueTask(task) {
  const dueDate = task?.dueDate;
  const today = new Date().toISOString().slice(0, 10);
  const daysOverdue =
    dueDate && dueDate < today
      ? Math.max(1, Math.ceil((new Date(`${today}T00:00:00`) - new Date(`${dueDate}T00:00:00`)) / 86400000))
      : 0;

  return {
    ...task,
    daysOverdue,
  };
}

export function useOverdueTasks(filters = {}) {
  const params = buildReportParams(filters);
  return useQuery({
    queryKey: reportsKeys.overdueTasks(params),
    queryFn: async () => {
      try {
        const res = await apiClient.get('/reports/overdue-tasks', { params });
        const data = unwrapList(res);
        return {
          ...data,
          data: data.data.map(normalizeOverdueTask),
        };
      } catch (error) {
        throw withPermissionMessage(error);
      }
    },
    placeholderData: (prev) => prev,
  });
}

export function useTeamPerformance(filters = {}) {
  const params = buildReportParams(filters);
  return useQuery({
    queryKey: reportsKeys.teamPerformance(params),
    queryFn: async () => {
      try {
        const res = await apiClient.get('/reports/team-performance', { params });
        return unwrapItem(res);
      } catch (error) {
        throw withPermissionMessage(error);
      }
    },
    placeholderData: (prev) => prev,
  });
}
