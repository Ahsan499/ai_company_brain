import { useMutation } from '@tanstack/react-query';
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

// NOTE: Password and notification-preference persistence endpoints are not present
// in current API routes, so these remain UI-only in settings sections for now.
