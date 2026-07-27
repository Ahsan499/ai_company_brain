import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { buildParams, unwrapItem, unwrapList } from '../lib/api';
import { projectKeys } from './useProjects';

export const taskKeys = {
  all: ['tasks'],
  lists: () => [...taskKeys.all, 'list'],
  list: (filters) => [...taskKeys.lists(), filters],
  details: () => [...taskKeys.all, 'detail'],
  detail: (id) => [...taskKeys.details(), id],
  subtasks: (taskId) => [...taskKeys.detail(taskId), 'subtasks'],
  comments: (taskId) => [...taskKeys.detail(taskId), 'comments'],
  timeSummary: (taskId) => [...taskKeys.detail(taskId), 'time-summary'],
};

const toSafeArray = (value) => (Array.isArray(value) ? value : []);

export function normalizeTask(task) {
  if (!task) return task;

  const subtasks = toSafeArray(task.subtasks).map((subtask) => ({
    id: subtask.id,
    title: subtask.title,
    done: Boolean(subtask.done),
  }));

  const comments = toSafeArray(task.comments).map((comment) => ({
    id: comment.id,
    userId: comment.userId ?? comment.author?.id,
    userName: comment.userName ?? comment.author?.name ?? 'Unknown',
    initials:
      comment.initials ??
      comment.author?.initials ??
      comment.userName?.slice(0, 1)?.toUpperCase() ??
      '?',
    text: comment.text ?? comment.body ?? '',
    time: comment.time ?? null,
    author: comment.author ?? {
      id: comment.userId,
      name: comment.userName,
      initials: comment.initials,
    },
  }));

  return {
    ...task,
    projectId: task.projectId ?? task.project?.id ?? null,
    projectName: task.projectName ?? task.project?.name ?? '—',
    organizationName: task.organizationName ?? '—',
    departmentName: task.departmentName ?? '—',
    assigneeId: task.assigneeId ?? task.assignee?.id ?? null,
    assigneeName: task.assigneeName ?? task.assignee?.name ?? 'Unassigned',
    assigneeInitials:
      task.assigneeInitials ??
      task.assignee?.initials ??
      task.assigneeName?.slice(0, 1)?.toUpperCase() ??
      '?',
    createdById: task.createdById ?? null,
    createdByName: task.createdByName ?? '—',
    subtasks,
    comments,
    subtaskCount: task.subtaskCount ?? subtasks.length,
    subtasksDone: task.subtasksDone ?? subtasks.filter((subtask) => subtask.done).length,
    commentCount: task.commentCount ?? comments.length,
  };
}

function normalizeSubtask(subtask) {
  return {
    id: subtask.id,
    title: subtask.title,
    done: Boolean(subtask.done),
  };
}

function normalizeComment(comment) {
  return {
    id: comment.id,
    userId: comment.userId ?? comment.author?.id,
    userName: comment.userName ?? comment.author?.name ?? 'Unknown',
    initials:
      comment.initials ??
      comment.author?.initials ??
      comment.userName?.slice(0, 1)?.toUpperCase() ??
      '?',
    text: comment.text ?? comment.body ?? '',
    time: comment.time ?? null,
    author: comment.author ?? {
      id: comment.userId,
      name: comment.userName,
      initials: comment.initials,
    },
  };
}

const invalidateTaskAndProject = (queryClient, taskLike) => {
  queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
  if (taskLike?.id) {
    queryClient.invalidateQueries({ queryKey: taskKeys.detail(taskLike.id) });
  }
  if (taskLike?.projectId) {
    queryClient.invalidateQueries({ queryKey: projectKeys.detail(taskLike.projectId) });
    queryClient.invalidateQueries({ queryKey: projectKeys.tasks(taskLike.projectId) });
    queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
  }
};

export function useTasks(filters = {}) {
  const {
    search = '',
    query = '',
    projectId = 'all',
    assigneeId = 'all',
    status = 'all',
    priority = 'all',
    dueDateFrom = '',
    dueDateTo = '',
    myTasks = false,
    page = 1,
    perPage = 10,
  } = filters;

  const params = buildParams({
    search: search || query || undefined,
    project_id: projectId,
    assignee_id: assigneeId,
    status,
    priority,
    due_date_from: dueDateFrom || undefined,
    due_date_to: dueDateTo || undefined,
    my_tasks: myTasks || undefined,
    page,
    per_page: perPage,
  });

  return useQuery({
    queryKey: taskKeys.list(params),
    queryFn: async () => {
      const res = await apiClient.get('/tasks', { params });
      const data = unwrapList(res);
      return {
        ...data,
        data: data.data.map(normalizeTask),
      };
    },
    placeholderData: (prev) => prev,
  });
}

export function useTask(id, options = {}) {
  return useQuery({
    queryKey: taskKeys.detail(id),
    queryFn: async () => {
      const res = await apiClient.get(`/tasks/${id}`);
      return normalizeTask(unwrapItem(res));
    },
    enabled: Boolean(id) && options.enabled !== false,
  });
}

export function useUpdateTaskStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ id, status }) => {
      const res = await apiClient.patch(`/tasks/${id}/status`, { status });
      return normalizeTask(unwrapItem(res));
    },
    onMutate: async ({ id, status }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.lists() });
      await queryClient.cancelQueries({ queryKey: taskKeys.detail(id) });

      const previousLists = queryClient.getQueriesData({ queryKey: taskKeys.lists() });
      const previousDetail = queryClient.getQueryData(taskKeys.detail(id));

      const patchTask = (task) => (task?.id === id ? { ...task, status } : task);

      previousLists.forEach(([queryKey, listData]) => {
        if (!listData?.data) return;
        queryClient.setQueryData(queryKey, {
          ...listData,
          data: listData.data.map(patchTask),
        });
      });

      if (previousDetail?.id === id) {
        queryClient.setQueryData(taskKeys.detail(id), { ...previousDetail, status });
      }

      const linkedProjectId = previousDetail?.projectId;
      let previousProjectTasks = null;
      if (linkedProjectId) {
        await queryClient.cancelQueries({ queryKey: projectKeys.tasks(linkedProjectId) });
        previousProjectTasks = queryClient.getQueriesData({ queryKey: projectKeys.tasks(linkedProjectId) });
        previousProjectTasks.forEach(([queryKey, listData]) => {
          if (!listData?.data) return;
          queryClient.setQueryData(queryKey, {
            ...listData,
            data: listData.data.map(patchTask),
          });
        });
      }

      return { previousLists, previousDetail, previousProjectTasks };
    },
    onError: (_error, vars, context) => {
      context?.previousLists?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      if (context?.previousDetail) {
        queryClient.setQueryData(taskKeys.detail(vars.id), context.previousDetail);
      }
      context?.previousProjectTasks?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
    },
    onSuccess: (task) => {
      queryClient.setQueryData(taskKeys.detail(task.id), task);
    },
    onSettled: (_data, _error, vars) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(vars.id) });
      queryClient.invalidateQueries({ queryKey: projectKeys.all });
    },
  });
}

export function useSubtasks(taskId, filters = {}) {
  const { page = 1, perPage = 100 } = filters;
  const params = buildParams({ page, per_page: perPage });

  return useQuery({
    queryKey: [...taskKeys.subtasks(taskId), params],
    queryFn: async () => {
      const res = await apiClient.get(`/tasks/${taskId}/subtasks`, { params });
      const data = toSafeArray(unwrapItem(res));
      return data.map(normalizeSubtask);
    },
    enabled: Boolean(taskId),
  });
}

export function useCreateSubtask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, ...payload }) => {
      const res = await apiClient.post(`/tasks/${taskId}/subtasks`, payload);
      return normalizeSubtask(unwrapItem(res));
    },
    onSuccess: (_subtask, vars) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.subtasks(vars.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(vars.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useUpdateSubtask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, subtaskId, ...payload }) => {
      const res = await apiClient.patch(`/tasks/${taskId}/subtasks/${subtaskId}`, payload);
      return normalizeSubtask(unwrapItem(res));
    },
    onMutate: async ({ taskId, subtaskId, done }) => {
      await queryClient.cancelQueries({ queryKey: taskKeys.subtasks(taskId) });
      const previous = queryClient.getQueriesData({ queryKey: taskKeys.subtasks(taskId) });
      previous.forEach(([queryKey, data]) => {
        if (!Array.isArray(data)) return;
        queryClient.setQueryData(
          queryKey,
          data.map((subtask) =>
            subtask.id === subtaskId && typeof done === 'boolean'
              ? { ...subtask, done }
              : subtask
          )
        );
      });
      return { previous };
    },
    onError: (_error, vars, context) => {
      context?.previous?.forEach(([queryKey, data]) => {
        queryClient.setQueryData(queryKey, data);
      });
      queryClient.invalidateQueries({ queryKey: taskKeys.subtasks(vars.taskId) });
    },
    onSuccess: (_subtask, vars) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.subtasks(vars.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(vars.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useDeleteSubtask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, subtaskId }) => {
      await apiClient.delete(`/tasks/${taskId}/subtasks/${subtaskId}`);
      return { taskId, subtaskId };
    },
    onSuccess: (_result, vars) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.subtasks(vars.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(vars.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useTaskComments(taskId, filters = {}) {
  const { page = 1, perPage = 50 } = filters;
  const params = buildParams({ page, per_page: perPage });
  return useQuery({
    queryKey: [...taskKeys.comments(taskId), params],
    queryFn: async () => {
      const res = await apiClient.get(`/tasks/${taskId}/comments`, { params });
      const data = unwrapList(res);
      return {
        ...data,
        data: data.data.map(normalizeComment),
      };
    },
    enabled: Boolean(taskId),
  });
}

export function useCreateComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, text }) => {
      const res = await apiClient.post(`/tasks/${taskId}/comments`, { text });
      return normalizeComment(unwrapItem(res));
    },
    onSuccess: (_comment, vars) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.comments(vars.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(vars.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useDeleteComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ taskId, commentId }) => {
      await apiClient.delete(`/tasks/${taskId}/comments/${commentId}`);
      return { taskId, commentId };
    },
    onSuccess: (_result, vars) => {
      queryClient.invalidateQueries({ queryKey: taskKeys.comments(vars.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.detail(vars.taskId) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
    },
  });
}

export function useTaskTimeSummary(taskId) {
  return useQuery({
    queryKey: taskKeys.timeSummary(taskId),
    queryFn: async () => {
      const res = await apiClient.get(`/tasks/${taskId}/time-summary`);
      return unwrapItem(res);
    },
    enabled: Boolean(taskId),
  });
}

export function useCreateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/tasks', payload);
      return normalizeTask(unwrapItem(res));
    },
    onSuccess: (task) => {
      invalidateTaskAndProject(queryClient, task);
    },
  });
}

export function useUpdateTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await apiClient.put(`/tasks/${id}`, payload);
      return normalizeTask(unwrapItem(res));
    },
    onSuccess: (task, vars) => {
      queryClient.setQueryData(taskKeys.detail(vars.id), task);
      invalidateTaskAndProject(queryClient, task);
    },
  });
}

export function useDeleteTask() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, projectId }) => {
      await apiClient.delete(`/tasks/${id}`);
      return { id, projectId };
    },
    onSuccess: ({ id, projectId }) => {
      queryClient.removeQueries({ queryKey: taskKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: taskKeys.lists() });
      if (projectId) {
        queryClient.invalidateQueries({ queryKey: projectKeys.detail(projectId) });
        queryClient.invalidateQueries({ queryKey: projectKeys.tasks(projectId) });
        queryClient.invalidateQueries({ queryKey: projectKeys.lists() });
      }
    },
  });
}
