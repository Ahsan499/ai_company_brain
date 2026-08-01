import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { unwrapItem, unwrapList } from '../lib/api';

export const notificationKeys = {
  all: ['notifications'],
  lists: () => [...notificationKeys.all, 'list'],
  list: (filters) => [...notificationKeys.lists(), filters],
  unreadCount: () => [...notificationKeys.all, 'unread-count'],
};

const POLL_MS = 30_000;

function formatRelativeTime(iso) {
  if (!iso) return '';
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return '';
  const seconds = Math.round((Date.now() - then) / 1000);
  if (seconds < 60) return 'Just now';
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days === 1) return 'Yesterday';
  if (days < 7) return `${days}d ago`;
  return new Date(iso).toLocaleDateString();
}

export function normalizeNotification(n) {
  if (!n) return n;
  return {
    id: n.id,
    type: n.type,
    category: n.category || n.data?.category || 'system',
    event: n.event || n.data?.event || null,
    title: n.title || n.data?.title || 'Notification',
    description: n.description || n.data?.description || '',
    url: n.url || n.data?.url || null,
    avatar: n.avatar || n.data?.avatar || 'SY',
    unread: Boolean(n.unread ?? n.read_at == null),
    mention: n.category === 'mention' || n.data?.event === 'mention',
    time: formatRelativeTime(n.created_at),
    createdAt: n.created_at,
    data: n.data || {},
  };
}

export function useNotifications(filters = {}) {
  return useQuery({
    queryKey: notificationKeys.list(filters),
    queryFn: async () => {
      const res = await apiClient.get('/notifications', {
        params: { per_page: filters.perPage ?? 50 },
      });
      const { data, meta } = unwrapList(res);
      return {
        data: data.map(normalizeNotification),
        meta,
      };
    },
    refetchInterval: POLL_MS,
  });
}

export function useUnreadCount() {
  return useQuery({
    queryKey: notificationKeys.unreadCount(),
    queryFn: async () => {
      const res = await apiClient.get('/notifications/unread-count');
      const data = unwrapItem(res);
      return Number(data?.unread_count ?? data?.unreadCount ?? 0);
    },
    refetchInterval: POLL_MS,
  });
}

export function useMarkAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      const res = await apiClient.patch(`/notifications/${id}/read`);
      return normalizeNotification(unwrapItem(res));
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}

export function useMarkAllAsRead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.patch('/notifications/read-all');
      return unwrapItem(res);
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: notificationKeys.all });
    },
  });
}
