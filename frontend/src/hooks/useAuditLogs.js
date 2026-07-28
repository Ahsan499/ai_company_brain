import { useQuery } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { buildParams, unwrapList } from '../lib/api';

export const auditLogKeys = {
  all: ['audit-logs'],
  lists: () => [...auditLogKeys.all, 'list'],
  list: (filters) => [...auditLogKeys.lists(), filters],
};

function mapAuditPermissionError(error) {
  if (error?.response?.status === 403) {
    const wrapped = new Error("You don't have permission to view audit logs.");
    wrapped.cause = error;
    return wrapped;
  }
  return error;
}

export function useAuditLogs(filters = {}) {
  const {
    actorId = 'all',
    actionType = 'all',
    entityType = 'all',
    dateFrom = '',
    dateTo = '',
    search = '',
    page = 1,
    perPage = 20,
  } = filters;

  const params = buildParams({
    actor_id: actorId,
    action_type: actionType,
    entity_type: entityType,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    search: search || undefined,
    page,
    per_page: perPage,
  });

  return useQuery({
    queryKey: auditLogKeys.list(params),
    queryFn: async () => {
      try {
        const res = await apiClient.get('/audit-logs', { params });
        return unwrapList(res);
      } catch (error) {
        throw mapAuditPermissionError(error);
      }
    },
    placeholderData: (prev) => prev,
  });
}
