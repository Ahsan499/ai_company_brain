import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { buildParams, unwrapItem, unwrapList } from '../lib/api';

export const organizationKeys = {
  all: ['organizations'],
  lists: () => [...organizationKeys.all, 'list'],
  list: (filters) => [...organizationKeys.lists(), filters],
  details: () => [...organizationKeys.all, 'detail'],
  detail: (id) => [...organizationKeys.details(), id],
};

export function useOrganizations(filters = {}) {
  const {
    search = '',
    query = '',
    status = 'all',
    plan = 'all',
    page = 1,
    perPage = 6,
  } = filters;

  const params = buildParams({
    search: search || query || undefined,
    status,
    plan,
    page,
    per_page: perPage,
  });

  return useQuery({
    queryKey: organizationKeys.list(params),
    queryFn: async () => {
      const res = await apiClient.get('/organizations', { params });
      return unwrapList(res);
    },
    placeholderData: (prev) => prev,
  });
}

export function useOrganization(id, options = {}) {
  return useQuery({
    queryKey: organizationKeys.detail(id),
    queryFn: async () => {
      const res = await apiClient.get(`/organizations/${id}`);
      return unwrapItem(res);
    },
    enabled: Boolean(id) && options.enabled !== false,
  });
}

export function useCreateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/organizations', payload);
      return unwrapItem(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
    },
  });
}

export function useUpdateOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await apiClient.put(`/organizations/${id}`, payload);
      return unwrapItem(res);
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      queryClient.invalidateQueries({ queryKey: organizationKeys.detail(vars.id) });
      if (data?.id) {
        queryClient.setQueryData(organizationKeys.detail(data.id), data);
      }
    },
  });
}

export function useDeleteOrganization() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/organizations/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: organizationKeys.lists() });
      queryClient.removeQueries({ queryKey: organizationKeys.detail(id) });
    },
  });
}
