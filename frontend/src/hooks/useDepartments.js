import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { buildParams, unwrapItem, unwrapList } from '../lib/api';

export const departmentKeys = {
  all: ['departments'],
  lists: () => [...departmentKeys.all, 'list'],
  list: (filters) => [...departmentKeys.lists(), filters],
  details: () => [...departmentKeys.all, 'detail'],
  detail: (id) => [...departmentKeys.details(), id],
  members: (id) => [...departmentKeys.detail(id), 'members'],
  teams: (id) => [...departmentKeys.detail(id), 'teams'],
  projects: (id) => [...departmentKeys.detail(id), 'projects'],
};

export function useDepartments(filters = {}) {
  const {
    search = '',
    query = '',
    organizationId = 'all',
    managerId = 'all',
    page = 1,
    perPage = 6,
  } = filters;

  const params = buildParams({
    search: search || query || undefined,
    organization_id: organizationId,
    manager_id: managerId,
    page,
    per_page: perPage,
  });

  return useQuery({
    queryKey: departmentKeys.list(params),
    queryFn: async () => {
      const res = await apiClient.get('/departments', { params });
      return unwrapList(res);
    },
    placeholderData: (prev) => prev,
  });
}

export function useDepartment(id, options = {}) {
  return useQuery({
    queryKey: departmentKeys.detail(id),
    queryFn: async () => {
      const res = await apiClient.get(`/departments/${id}`);
      return unwrapItem(res);
    },
    enabled: Boolean(id) && options.enabled !== false,
  });
}

export function useDepartmentMembers(id, filters = {}) {
  const { page = 1, perPage = 50 } = filters;
  const params = buildParams({ page, per_page: perPage });

  return useQuery({
    queryKey: [...departmentKeys.members(id), params],
    queryFn: async () => {
      const res = await apiClient.get(`/departments/${id}/members`, { params });
      return unwrapList(res);
    },
    enabled: Boolean(id),
  });
}

export function useDepartmentTeams(id, filters = {}) {
  const { page = 1, perPage = 50 } = filters;
  const params = buildParams({ page, per_page: perPage });

  return useQuery({
    queryKey: [...departmentKeys.teams(id), params],
    queryFn: async () => {
      const res = await apiClient.get(`/departments/${id}/teams`, { params });
      return unwrapList(res);
    },
    enabled: Boolean(id),
  });
}

export function useDepartmentProjects(id, filters = {}) {
  const { page = 1, perPage = 50 } = filters;
  const params = buildParams({ page, per_page: perPage });

  return useQuery({
    queryKey: [...departmentKeys.projects(id), params],
    queryFn: async () => {
      const res = await apiClient.get(`/departments/${id}/projects`, { params });
      return unwrapList(res);
    },
    enabled: Boolean(id),
  });
}

export function useCreateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/departments', payload);
      return unwrapItem(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
    },
  });
}

export function useUpdateDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await apiClient.put(`/departments/${id}`, payload);
      return unwrapItem(res);
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.invalidateQueries({ queryKey: departmentKeys.detail(vars.id) });
      if (data?.id) {
        queryClient.setQueryData(departmentKeys.detail(data.id), data);
      }
    },
  });
}

export function useDeleteDepartment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/departments/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: departmentKeys.lists() });
      queryClient.removeQueries({ queryKey: departmentKeys.detail(id) });
    },
  });
}
