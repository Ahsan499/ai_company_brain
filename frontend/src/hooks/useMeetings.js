import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { buildParams, unwrapItem, unwrapList } from '../lib/api';
import { projectKeys } from './useProjects';
import { teamKeys } from './useTeams';

export const meetingKeys = {
  all: ['meetings'],
  lists: () => [...meetingKeys.all, 'list'],
  list: (filters) => [...meetingKeys.lists(), filters],
  details: () => [...meetingKeys.all, 'detail'],
  detail: (id) => [...meetingKeys.details(), id],
  attendees: (id) => [...meetingKeys.detail(id), 'attendees'],
  agendaItems: (id) => [...meetingKeys.detail(id), 'agenda-items'],
};

const toSafeArray = (value) => (Array.isArray(value) ? value : []);

export function normalizeMeeting(meeting) {
  if (!meeting) return meeting;
  return {
    ...meeting,
    projectName:
      meeting.projectName ??
      (typeof meeting.project === 'object' ? meeting.project?.name : null) ??
      null,
    teamName:
      meeting.teamName ??
      (typeof meeting.team === 'object' ? meeting.team?.name : null) ??
      null,
    organizerName:
      meeting.organizerName ??
      (typeof meeting.organizer === 'object' ? meeting.organizer?.name : null) ??
      'Unknown',
    organizerInitials:
      meeting.organizerInitials ??
      (typeof meeting.organizer === 'object' ? meeting.organizer?.initials : null) ??
      '?',
    createdByName:
      meeting.createdByName ?? meeting.creator?.name ?? '—',
    attendees: toSafeArray(meeting.attendees),
    agenda: toSafeArray(meeting.agenda ?? meeting.agendaItems),
  };
}

/* ─── Queries ─── */

export function useMeetings(filters = {}) {
  const {
    search = '',
    projectId = 'all',
    teamId = 'all',
    organizerId = 'all',
    dateFrom = '',
    dateTo = '',
    myMeetings = false,
    page = 1,
    perPage = 100,
  } = filters;

  const params = buildParams({
    search: search || undefined,
    project_id: projectId,
    team_id: teamId,
    organizer_id: organizerId,
    date_from: dateFrom || undefined,
    date_to: dateTo || undefined,
    my_meetings: myMeetings || undefined,
    page,
    per_page: perPage,
  });

  return useQuery({
    queryKey: meetingKeys.list(params),
    queryFn: async () => {
      const res = await apiClient.get('/meetings', { params });
      const data = unwrapList(res);
      return {
        ...data,
        data: data.data.map(normalizeMeeting),
      };
    },
    placeholderData: (prev) => prev,
  });
}

export function useMeeting(id, options = {}) {
  return useQuery({
    queryKey: meetingKeys.detail(id),
    queryFn: async () => {
      const res = await apiClient.get(`/meetings/${id}`);
      return normalizeMeeting(unwrapItem(res));
    },
    enabled: Boolean(id) && options.enabled !== false,
  });
}

export function useMeetingAttendees(id) {
  return useQuery({
    queryKey: meetingKeys.attendees(id),
    queryFn: async () => {
      const res = await apiClient.get(`/meetings/${id}/attendees`);
      return toSafeArray(unwrapItem(res));
    },
    enabled: Boolean(id),
  });
}

export function useMeetingAgendaItems(id) {
  return useQuery({
    queryKey: meetingKeys.agendaItems(id),
    queryFn: async () => {
      const res = await apiClient.get(`/meetings/${id}`);
      const meeting = normalizeMeeting(unwrapItem(res));
      return toSafeArray(meeting.agenda);
    },
    enabled: Boolean(id),
  });
}

/* ─── Mutations ─── */

function invalidateMeetingParents(queryClient, meeting) {
  if (meeting?.projectId) {
    queryClient.invalidateQueries({ queryKey: projectKeys.all });
  }
  if (meeting?.teamId) {
    queryClient.invalidateQueries({ queryKey: teamKeys.all });
  }
}

export function useCreateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/meetings', payload);
      return normalizeMeeting(unwrapItem(res));
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
      invalidateMeetingParents(queryClient, data);
    },
  });
}

export function useUpdateMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await apiClient.put(`/meetings/${id}`, payload);
      return normalizeMeeting(unwrapItem(res));
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(vars.id) });
      if (data?.id) queryClient.setQueryData(meetingKeys.detail(data.id), data);
      invalidateMeetingParents(queryClient, data);
    },
  });
}

export function useDeleteMeeting() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id) => {
      await apiClient.delete(`/meetings/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
      queryClient.removeQueries({ queryKey: meetingKeys.detail(id) });
    },
  });
}

export function useUpdateMeetingStatus() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await apiClient.patch(`/meetings/${id}/status`, { status });
      return normalizeMeeting(unwrapItem(res));
    },
    onSuccess: (data, vars) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.lists() });
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(vars.id) });
      if (data?.id) queryClient.setQueryData(meetingKeys.detail(data.id), data);
    },
  });
}

export function useAddAttendee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ meetingId, userId }) => {
      const res = await apiClient.post(`/meetings/${meetingId}/attendees`, { user_id: userId });
      return normalizeMeeting(unwrapItem(res));
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.attendees(vars.meetingId) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(vars.meetingId) });
    },
  });
}

export function useRemoveAttendee() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ meetingId, userId }) => {
      const res = await apiClient.delete(`/meetings/${meetingId}/attendees/${userId}`);
      return normalizeMeeting(unwrapItem(res));
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.attendees(vars.meetingId) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(vars.meetingId) });
    },
  });
}

export function useUpdateRsvp() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ meetingId, userId, rsvpStatus }) => {
      const res = await apiClient.patch(
        `/meetings/${meetingId}/attendees/${userId}/rsvp`,
        { rsvp_status: rsvpStatus }
      );
      return normalizeMeeting(unwrapItem(res));
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.attendees(vars.meetingId) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(vars.meetingId) });
    },
  });
}

export function useCreateAgendaItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ meetingId, title }) => {
      const res = await apiClient.post(`/meetings/${meetingId}/agenda-items`, { title });
      return unwrapItem(res);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.agendaItems(vars.meetingId) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(vars.meetingId) });
    },
  });
}

export function useUpdateAgendaItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ meetingId, agendaItemId, ...payload }) => {
      const res = await apiClient.patch(
        `/meetings/${meetingId}/agenda-items/${agendaItemId}`,
        payload
      );
      return unwrapItem(res);
    },
    onMutate: async ({ meetingId, agendaItemId, done }) => {
      if (done === undefined) return {};

      await queryClient.cancelQueries({ queryKey: meetingKeys.agendaItems(meetingId) });
      const previousItems = queryClient.getQueryData(meetingKeys.agendaItems(meetingId));

      if (previousItems) {
        queryClient.setQueryData(
          meetingKeys.agendaItems(meetingId),
          previousItems.map((item) =>
            item.id === agendaItemId ? { ...item, done } : item
          )
        );
      }

      // Also optimistically update the detail cache's agenda array
      const previousDetail = queryClient.getQueryData(meetingKeys.detail(meetingId));
      if (previousDetail?.agenda) {
        queryClient.setQueryData(meetingKeys.detail(meetingId), {
          ...previousDetail,
          agenda: previousDetail.agenda.map((item) =>
            item.id === agendaItemId ? { ...item, done } : item
          ),
        });
      }

      return { previousItems, previousDetail };
    },
    onError: (_error, vars, context) => {
      if (context?.previousItems) {
        queryClient.setQueryData(meetingKeys.agendaItems(vars.meetingId), context.previousItems);
      }
      if (context?.previousDetail) {
        queryClient.setQueryData(meetingKeys.detail(vars.meetingId), context.previousDetail);
      }
    },
    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.agendaItems(vars.meetingId) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(vars.meetingId) });
    },
  });
}

export function useDeleteAgendaItem() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ meetingId, agendaItemId }) => {
      await apiClient.delete(`/meetings/${meetingId}/agenda-items/${agendaItemId}`);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: meetingKeys.agendaItems(vars.meetingId) });
      queryClient.invalidateQueries({ queryKey: meetingKeys.detail(vars.meetingId) });
    },
  });
}
