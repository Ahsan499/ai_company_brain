import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { buildParams, unwrapItem, unwrapList } from '../lib/api';
import { departmentKeys } from './useDepartments';
import { organizationKeys } from './useOrganizations';
import { teamKeys } from './useTeams';
import { userKeys } from './useUsers';

export const projectKeys = {
  all: ['projects'],
  lists: () => [...projectKeys.all, 'list'],
  list: (filters) => [...projectKeys.lists(), filters],
  details: () => [...projectKeys.all, 'detail'],
  detail: (id) => [...projectKeys.details(), id],
  members: (id) => [...projectKeys.detail(id), 'members'],
  tasks: (id) => [...projectKeys.detail(id), 'tasks'],
  teams: (id) => [...projectKeys.detail(id), 'teams'],
};

const toSafeArray = (value) => (Array.isArray(value) ? value : []);

export function normalizeProject(project) {
  if (!project) return project;

  const members = toSafeArray(project.members).map((member) => ({
    userId: member.userId ?? member.id,
    id: member.userId ?? member.id,
    name: member.name ?? 'Unknown',
    initials: member.initials ?? member.name?.slice(0, 1)?.toUpperCase() ?? '?',
    projectRole: member.projectRole ?? member.roleInProject ?? 'Contributor',
    roleInProject: member.roleInProject ?? member.projectRole ?? 'Contributor',
    email: member.email,
    status: member.status,
  }));

  return {
    ...project,
    organizationName:
      project.organizationName ||
      (typeof project.organization === 'string' ? project.organization : project.organization?.name) ||
      '—',
    departmentName:
      project.departmentName ||
      (typeof project.department === 'string' ? project.department : project.department?.name) ||
      '—',
    memberCount: project.memberCount ?? members.length,
    members,
    tasksDone: project.tasksDone ?? project.taskCounts?.done ?? 0,
    tasksTotal: project.tasksTotal ?? project.taskCounts?.total ?? 0,
    taskCounts: project.taskCounts ?? {
      total: project.tasksTotal ?? 0,
      done: project.tasksDone ?? 0,
      inProgress: 0,
      overdue: 0,
    },
    milestones: toSafeArray(project.milestones),
    activity: toSafeArray(project.activity),
  };
}

function normalizeProjectMember(member) {
  return {
    userId: member.userId ?? member.id,
    id: member.userId ?? member.id,
    name: member.name ?? 'Unknown',
    email: member.email ?? null,
    initials: member.initials ?? member.name?.slice(0, 1)?.toUpperCase() ?? '?',
    projectRole: member.projectRole ?? member.roleInProject ?? 'Contributor',
    roleInProject: member.roleInProject ?? member.projectRole ?? 'Contributor',
    status: member.status ?? 'active',
  };
}

function normalizeTaskPreview(task) {
  const subtasks = toSafeArray(task.subtasks).map((subtask) => ({
    id: subtask.id,
    title: subtask.title,
    done: Boolean(subtask.done),
  }));

  return {
    ...task,
    projectId: task.projectId ?? task.project?.id,
    projectName: task.projectName ?? task.project?.name ?? '—',
    assigneeId: task.assigneeId ?? task.assignee?.id ?? null,
    assigneeName: task.assigneeName ?? task.assignee?.name ?? 'Unassigned',
    assigneeInitials:
      task.assigneeInitials ??
      task.assignee?.initials ??
      task.assigneeName?.slice(0, 1)?.toUpperCase() ??
      '?',
    subtasks,
    subtaskCount: task.subtaskCount ?? subtasks.length,
    subtasksDone: task.subtasksDone ?? subtasks.filter((s) => s.done).length,
    comments: toSafeArray(task.comments),
  };
}

const invalidateProjectCountParents = (queryClient) => {
  queryClient.invalidateQueries({ queryKey: departmentKeys.all });
  queryClient.invalidateQueries({ queryKey: organizationKeys.all });
  queryClient.invalidateQueries({ queryKey: teamKeys.all });
  queryClient.invalidateQueries({ queryKey: userKeys.all });
};

export function useProjects(filters = {}) {
  const {
    search = '',
    query = '',
    organizationId = 'all',
    departmentId = 'all',
    status = 'all',
    priority = 'all',
    page = 1,
    perPage = 6,
  } = filters;

  const params = buildParams({
    search: search || query || undefined,
    organization_id: organizationId,
    department_id: departmentId,
    status,
    priority,
    page,
    per_page: perPage,
  });

  return useQuery({
    queryKey: projectKeys.list(params),
    queryFn: async () => {
      const res = await apiClient.get('/projects', { params });
      const data = unwrapList(res);
      return {
        ...data,
        data: data.data.map(normalizeProject),
      };
    },
    placeholderData: (prev) => prev,
  });
}

export function useProject(id, options = {}) {
  return useQuery({
    queryKey: projectKeys.detail(id),
    queryFn: async () => {
      const res = await apiClient.get(`/projects/${id}`);
      return normalizeProject(unwrapItem(res));
    },
    enabled: Boolean(id) && options.enabled !== false,
  });
}

export function useProjectMembers(id, filters = {}) {
  const { page = 1, perPage = 50 } = filters;
  const params = buildParams({ page, per_page: perPage });

  return useQuery({
    queryKey: [...projectKeys.members(id), params],
    queryFn: async () => {
      const res = await apiClient.get(`/projects/${id}/members`, { params });
      const data = unwrapList(res);
      return {
        ...data,
        data: data.data.map(normalizeProjectMember),
      };
    },
    enabled: Boolean(id),
  });
}

export function useProjectTasks(id, filters = {}) {
  const { page = 1, perPage = 50 } = filters;
  const params = buildParams({ page, per_page: perPage });

  return useQuery({
    queryKey: [...projectKeys.tasks(id), params],
    queryFn: async () => {
      const res = await apiClient.get(`/projects/${id}/tasks`, { params });
      const data = unwrapList(res);
      return {
        ...data,
        data: data.data.map(normalizeTaskPreview),
      };
    },
    enabled: Boolean(id),
  });
}

export function useProjectTeams(id, filters = {}) {
  const { page = 1, perPage = 50 } = filters;
  const params = buildParams({ page, per_page: perPage });

  return useQuery({
    queryKey: [...projectKeys.teams(id), params],
    queryFn: async () => {
      const res = await apiClient.get(`/projects/${id}/teams`, { params });
      return unwrapList(res);
    },
    enabled: Boolean(id),
  });
}

export function useCreateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/projects', payload);
      return normalizeProject(unwrapItem(res));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      invalidateProjectCountParents(queryClient);
    },
  });
}

export function useUpdateProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await apiClient.put(`/projects/${id}`, payload);
      return normalizeProject(unwrapItem(res));
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(vars.id) });
      if (data?.id) {
        queryClient.setQueryData(projectKeys.detail(data.id), data);
      }
      invalidateProjectCountParents(queryClient);
    },
  });
}

export function useDeleteProject() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/projects/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      queryClient.removeQueries({ queryKey: projectKeys.detail(id) });
      invalidateProjectCountParents(queryClient);
    },
  });
}

export function useAddProjectMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, userId, roleInProject = null }) => {
      const res = await apiClient.post(`/projects/${projectId}/members`, {
        userId,
        roleInProject,
      });
      return normalizeProject(unwrapItem(res));
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.members(vars.projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(vars.projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      if (data?.id) {
        queryClient.setQueryData(projectKeys.detail(data.id), data);
      }
    },
  });
}

export function useRemoveProjectMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ projectId, userId }) => {
      const res = await apiClient.delete(`/projects/${projectId}/members/${userId}`);
      return normalizeProject(unwrapItem(res));
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: projectKeys.members(vars.projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.detail(vars.projectId) });
      queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      if (data?.id) {
        queryClient.setQueryData(projectKeys.detail(data.id), data);
      }
    },
  });
}
