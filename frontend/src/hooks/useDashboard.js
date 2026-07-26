import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { unwrapList } from '../lib/api';

/**
 * Dashboard Home aggregates that already have backend sources (Orgs + Users).
 * Projects / Tasks / Meetings widgets stay on dummy data until those modules are wired.
 */
export function useDashboardOverview() {
  return useQuery({
    queryKey: ['dashboard', 'overview-stats'],
    queryFn: async () => {
      const [orgs, users] = await Promise.all([
        apiClient.get('/organizations', { params: { per_page: 1 } }),
        apiClient.get('/users', { params: { per_page: 1, status: 'active' } }),
      ]);

      const orgMeta = unwrapList(orgs).meta;
      const userMeta = unwrapList(users).meta;

      return {
        organizationsTotal: orgMeta.total ?? 0,
        activeUsersTotal: userMeta.total ?? 0,
      };
    },
    staleTime: 60_000,
  });
}
