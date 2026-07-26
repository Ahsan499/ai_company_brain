import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { buildParams, unwrapItem, unwrapList } from '../lib/api';
import { departmentKeys } from './useDepartments';

export const teamKeys = {
  all: ['teams'],
  lists: () => [...teamKeys.all, 'list'],
  list: (filters) => [...teamKeys.lists(), filters],
  details: () => [...teamKeys.all, 'detail'],
  detail: (id) => [...teamKeys.details(), id],
  members: (id) => [...teamKeys.detail(id), 'members'],
  projects: (id) => [...teamKeys.detail(id), 'projects'],
};

export function useTeams(filters = {}) {
  const {
    search = '',
    query = '',
    organizationId = 'all',
    departmentId = 'all',
    page = 1,
    perPage = 6,
  } = filters;

  const params = buildParams({
    search: search || query || undefined,
    organization_id: organizationId,
    department_id: departmentId,
    page,
    per_page: perPage,
  });

  return useQuery({
    queryKey: teamKeys.list(params),
    queryFn: async () => {
      const res = await apiClient.get('/teams', { params });
      return unwrapList(res);
    },
    placeholderData: (prev) => prev,
  });
}

export function useTeam(id, options = {}) {
  return useQuery({
    queryKey: teamKeys.detail(id),
    queryFn: async () => {
      const res = await apiClient.get(`/teams/${id}`);
      return unwrapItem(res);
    },
    enabled: Boolean(id) && options.enabled !== false,
  });
}

export function useTeamMembers(id, filters = {}) {
  const { page = 1, perPage = 50 } = filters;
  const params = buildParams({ page, per_page: perPage });

  return useQuery({
    queryKey: [...teamKeys.members(id), params],
    queryFn: async () => {
      const res = await apiClient.get(`/teams/${id}/members`, { params });
      return unwrapList(res);
    },
    enabled: Boolean(id),
  });
}

export function useTeamProjects(id, filters = {}) {
  const { page = 1, perPage = 50 } = filters;
  const params = buildParams({ page, per_page: perPage });

  return useQuery({
    queryKey: [...teamKeys.projects(id), params],
    queryFn: async () => {
      const res = await apiClient.get(`/teams/${id}/projects`, { params });
      return unwrapList(res);
    },
    enabled: Boolean(id),
  });
}

export function useCreateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/teams', payload);
      return unwrapItem(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
}

export function useUpdateTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await apiClient.put(`/teams/${id}`, payload);
      return unwrapItem(res);
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(vars.id) });
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
      if (data?.id) {
        queryClient.setQueryData(teamKeys.detail(data.id), data);
      }
    },
  });
}

export function useDeleteTeam() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/teams/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
      queryClient.removeQueries({ queryKey: teamKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: departmentKeys.all });
    },
  });
}

export function useAddTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, userId }) => {
      const res = await apiClient.post(`/teams/${teamId}/members`, { userId });
      return unwrapItem(res);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(vars.teamId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(vars.teamId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
    },
  });
}

export function useRemoveTeamMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ teamId, userId }) => {
      await apiClient.delete(`/teams/${teamId}/members/${userId}`);
      return { teamId, userId };
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: teamKeys.members(vars.teamId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.detail(vars.teamId) });
      queryClient.invalidateQueries({ queryKey: teamKeys.lists() });
    },
  });
}
