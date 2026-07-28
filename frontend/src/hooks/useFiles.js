import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { buildParams, unwrapItem, unwrapList } from '../lib/api';
import { projectKeys } from './useProjects';
import { taskKeys } from './useTasks';

export const fileKeys = {
  all: ['files'],
  lists: () => [...fileKeys.all, 'list'],
  list: (filters) => [...fileKeys.lists(), filters],
  details: () => [...fileKeys.all, 'detail'],
  detail: (id) => [...fileKeys.details(), id],
  comments: (id) => [...fileKeys.detail(id), 'comments'],
  projectFiles: (projectId, filters) => [...fileKeys.all, 'project', projectId, filters],
  taskFiles: (taskId, filters) => [...fileKeys.all, 'task', taskId, filters],
};

export const folderKeys = {
  all: ['folders'],
  lists: () => [...folderKeys.all, 'list'],
  list: (filters) => [...folderKeys.lists(), filters],
  details: () => [...folderKeys.all, 'detail'],
  detail: (id) => [...folderKeys.details(), id],
  contents: (id) => [...folderKeys.detail(id), 'contents'],
};

const toSafeArray = (value) => (Array.isArray(value) ? value : []);

function normalizeFolder(folder) {
  if (!folder) return folder;
  return {
    ...folder,
    parentId: folder.parentId ?? folder.parent?.id ?? null,
    createdByName: folder.createdByName ?? folder.createdBy?.name ?? 'Unknown',
  };
}

function normalizeFile(file) {
  if (!file) return file;
  return {
    ...file,
    folderId: file.folderId ?? file.folder?.id ?? null,
    projectName: file.projectName ?? file.project?.name ?? null,
    taskTitle: file.taskTitle ?? file.task?.title ?? null,
    uploadedByName: file.uploadedByName ?? file.uploadedBy?.name ?? 'Unknown',
    uploadedByInitials: file.uploadedByInitials ?? file.uploadedBy?.initials ?? '?',
    versions: toSafeArray(file.versions ?? file.versionHistory),
    comments: toSafeArray(file.comments),
  };
}

export function useFolders(filters = {}) {
  const { parentId = 'all', search = '', page = 1, perPage = 100 } = filters;
  const params = buildParams({
    parent_id:
      parentId === 'all'
        ? undefined
        : parentId === null
          ? 'root'
          : parentId,
    search: search || undefined,
    page,
    per_page: perPage,
  });

  return useQuery({
    queryKey: folderKeys.list(params),
    queryFn: async () => {
      const res = await apiClient.get('/folders', { params });
      const data = unwrapList(res);
      return { ...data, data: data.data.map(normalizeFolder) };
    },
    placeholderData: (prev) => prev,
  });
}

export function useFolderContents(id, options = {}) {
  return useQuery({
    queryKey: folderKeys.contents(id),
    queryFn: async () => {
      const res = await apiClient.get(`/folders/${id}/contents`);
      const payload = unwrapItem(res);
      return {
        folder: normalizeFolder(payload?.folder),
        breadcrumb: toSafeArray(payload?.breadcrumb),
        folders: toSafeArray(payload?.folders?.data ?? payload?.folders).map(normalizeFolder),
        files: toSafeArray(payload?.files?.data ?? payload?.files).map(normalizeFile),
      };
    },
    enabled: Boolean(id) && options.enabled !== false,
  });
}

export function useCreateFolder() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload) => {
      const res = await apiClient.post('/folders', payload);
      return normalizeFolder(unwrapItem(res));
    },
    onSuccess: (_data) => {
      queryClient.invalidateQueries({ queryKey: folderKeys.lists() });
    },
  });
}

export function useFiles(filters = {}) {
  const {
    folderId = 'all',
    search = '',
    type = 'all',
    projectId = 'all',
    taskId = 'all',
    page = 1,
    perPage = 100,
  } = filters;
  const params = buildParams({
    folder_id: folderId,
    search: search || undefined,
    type,
    project_id: projectId,
    task_id: taskId,
    page,
    per_page: perPage,
  });

  return useQuery({
    queryKey: fileKeys.list(params),
    queryFn: async () => {
      const res = await apiClient.get('/files', { params });
      const data = unwrapList(res);
      return { ...data, data: data.data.map(normalizeFile) };
    },
    placeholderData: (prev) => prev,
  });
}

export function useFile(id, options = {}) {
  return useQuery({
    queryKey: fileKeys.detail(id),
    queryFn: async () => {
      const res = await apiClient.get(`/files/${id}`);
      return normalizeFile(unwrapItem(res));
    },
    enabled: Boolean(id) && options.enabled !== false,
  });
}

export function useUploadFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      file,
      name,
      folderId,
      projectId,
      taskId,
      onProgress,
    }) => {
      const formData = new FormData();
      formData.append('file', file);
      if (name) formData.append('name', name);
      if (folderId) formData.append('folder_id', folderId);
      if (projectId) formData.append('project_id', projectId);
      if (taskId) formData.append('task_id', taskId);

      const res = await apiClient.post('/files', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (event) => {
          if (!onProgress || !event?.total) return;
          onProgress(Math.round((event.loaded * 100) / event.total));
        },
      });
      return normalizeFile(unwrapItem(res));
    },
    onSuccess: (file) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
      queryClient.invalidateQueries({ queryKey: folderKeys.lists() });
      if (file?.folderId) queryClient.invalidateQueries({ queryKey: folderKeys.contents(file.folderId) });
      if (file?.projectId) queryClient.invalidateQueries({ queryKey: fileKeys.projectFiles(file.projectId) });
      if (file?.taskId) queryClient.invalidateQueries({ queryKey: fileKeys.taskFiles(file.taskId) });
    },
  });
}

export function useDownloadFile() {
  return useMutation({
    mutationFn: async ({ id, filename }) => {
      const res = await apiClient.get(`/files/${id}/download`, { responseType: 'blob' });
      const blob = new Blob([res.data]);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = filename || `file-${id}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
      return true;
    },
  });
}

export function useFileComments(id, options = {}) {
  return useQuery({
    queryKey: fileKeys.comments(id),
    queryFn: async () => {
      const res = await apiClient.get(`/files/${id}/comments`);
      return toSafeArray(unwrapItem(res));
    },
    enabled: Boolean(id) && options.enabled !== false,
  });
}

export function useCreateFileComment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ fileId, text }) => {
      const res = await apiClient.post(`/files/${fileId}/comments`, { text });
      return unwrapItem(res);
    },
    onSuccess: (_data, vars) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.comments(vars.fileId) });
      queryClient.invalidateQueries({ queryKey: fileKeys.detail(vars.fileId) });
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
    },
  });
}

export function useProjectFiles(projectId, filters = {}) {
  const { page = 1, perPage = 50 } = filters;
  const params = buildParams({ page, per_page: perPage });
  return useQuery({
    queryKey: fileKeys.projectFiles(projectId, params),
    queryFn: async () => {
      const res = await apiClient.get(`/projects/${projectId}/files`, { params });
      const data = unwrapList(res);
      return { ...data, data: data.data.map(normalizeFile) };
    },
    enabled: Boolean(projectId),
  });
}

export function useTaskFiles(taskId, filters = {}) {
  const { page = 1, perPage = 50 } = filters;
  const params = buildParams({ page, per_page: perPage });
  return useQuery({
    queryKey: fileKeys.taskFiles(taskId, params),
    queryFn: async () => {
      const res = await apiClient.get(`/tasks/${taskId}/files`, { params });
      const data = unwrapList(res);
      return { ...data, data: data.data.map(normalizeFile) };
    },
    enabled: Boolean(taskId),
  });
}

export function useUpdateFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...payload }) => {
      const res = await apiClient.put(`/files/${id}`, payload);
      return normalizeFile(unwrapItem(res));
    },
    onSuccess: (file, vars) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fileKeys.detail(vars.id) });
      queryClient.setQueryData(fileKeys.detail(vars.id), file);
    },
  });
}

export function useDeleteFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id }) => {
      await apiClient.delete(`/files/${id}`);
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
      queryClient.removeQueries({ queryKey: fileKeys.detail(id) });
      queryClient.invalidateQueries({ queryKey: folderKeys.lists() });
    },
  });
}

export function useMoveFile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, folderId }) => {
      const res = await apiClient.put(`/files/${id}`, { folder_id: folderId || null });
      return normalizeFile(unwrapItem(res));
    },
    onSuccess: (file, vars) => {
      queryClient.invalidateQueries({ queryKey: fileKeys.lists() });
      queryClient.invalidateQueries({ queryKey: fileKeys.detail(vars.id) });
      queryClient.invalidateQueries({ queryKey: folderKeys.lists() });
      if (file?.taskId) queryClient.invalidateQueries({ queryKey: taskKeys.detail(file.taskId) });
      if (file?.projectId) queryClient.invalidateQueries({ queryKey: projectKeys.detail(file.projectId) });
    },
  });
}
