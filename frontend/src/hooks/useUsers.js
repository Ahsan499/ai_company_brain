import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { buildParams, unwrapItem, unwrapList } from '../lib/api';

export const userKeys = {
  all: ['users'],
  lists: () => [...userKeys.all, 'list'],
  list: (filters) => [...userKeys.lists(), filters],
  details: () => [...userKeys.all, 'detail'],
  detail: (id) => [...userKeys.details(), id],
  tasks: (id) => [...userKeys.detail(id), 'tasks'],
  projects: (id) => [...userKeys.detail(id), 'projects'],
};

export function useUsers(filters = {}) {
  const {
    search = '',
    query = '',
    role = 'all',
    department = 'all',
    status = 'all',
    organizationId = 'all',
    page = 1,
    perPage = 8,
  } = filters;

  const params = buildParams({
    search: search || query || undefined,
    role,
    department,
    status,
    organization_id: organizationId,
    page,
    per_page: perPage,
  });

  return useQuery({
    queryKey: userKeys.list(params),
    queryFn: async () => {
      const res = await apiClient.get('/users', { params });
      return unwrapList(res);
    },
    placeholderData: (prev) => prev,
  });
}

export function useUser(id, options = {}) {
  return useQuery({
    queryKey: userKeys.detail(id),
    queryFn: async () => {
      const res = await apiClient.get(`/users/${id}`);
      return unwrapItem(res);
    },
    enabled: Boolean(id) && options.enabled !== false,
  });
}

export function useUserTasks(id, filters = {}) {
  const { page = 1, perPage = 20 } = filters;
  const params = buildParams({ page, per_page: perPage });

  return useQuery({
    queryKey: [...userKeys.tasks(id), params],
    queryFn: async () => {
      const res = await apiClient.get(`/users/${id}/tasks`, { params });
      return unwrapList(res);
    },
    enabled: Boolean(id),
  });
}

export function useUserProjects(id, filters = {}) {
  const { page = 1, perPage = 20 } = filters;
  const params = buildParams({ page, per_page: perPage });

  return useQuery({
    queryKey: [...userKeys.projects(id), params],
    queryFn: async () => {
      const res = await apiClient.get(`/users/${id}/projects`, { params });
      return unwrapList(res);
    },
    enabled: Boolean(id),
  });
}

export function useCreateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/users', payload);
      return unwrapItem(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
    },
  });
}

export function useUpdateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await apiClient.put(`/users/${id}`, payload);
      return unwrapItem(res);
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.invalidateQueries({ queryKey: userKeys.detail(vars.id) });
      if (data?.id) {
        queryClient.setQueryData(userKeys.detail(data.id), data);
      }
    },
  });
}

export function useDeleteUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/users/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: userKeys.lists() });
      queryClient.removeQueries({ queryKey: userKeys.detail(id) });
    },
  });
}
