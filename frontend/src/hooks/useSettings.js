import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { unwrapItem } from '../lib/api';

export function useUpdateProfile() {
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await apiClient.patch(`/users/${id}`, payload);
      return unwrapItem(res);
    },
  });
}

export const notificationPreferenceKeys = {
  all: ['notification-preferences'],
};

export function useNotificationPreferences() {
  return useQuery({
    queryKey: notificationPreferenceKeys.all,
    queryFn: async () => {
      const res = await apiClient.get('/settings/notification-preferences');
      return unwrapItem(res);
    },
  });
}

export function useUpdateNotificationPreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.patch('/settings/notification-preferences', payload);
      return unwrapItem(res);
    },
    onSuccess: (data) => {
      qc.setQueryData(notificationPreferenceKeys.all, data);
    },
  });
}
