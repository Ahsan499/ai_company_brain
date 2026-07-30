import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import apiClient from '../lib/apiClient';
import { getApiErrorMessage, unwrapItem } from '../lib/api';

export const knowledgeKeys = {
  all: ['knowledge'],
  status: () => [...knowledgeKeys.all, 'status'],
  health: () => [...knowledgeKeys.all, 'health'],
};

export function useKnowledgeHealth() {
  return useQuery({
    queryKey: knowledgeKeys.health(),
    queryFn: async () => {
      const res = await apiClient.get('/brain/health');
      return unwrapItem(res);
    },
    retry: 1,
    refetchInterval: 60_000,
  });
}

export function useKnowledgeStatus() {
  return useQuery({
    queryKey: knowledgeKeys.status(),
    queryFn: async () => {
      const res = await apiClient.get('/brain/status');
      return unwrapItem(res);
    },
    retry: 1,
    refetchInterval: 45_000,
  });
}

export function useKnowledgeQuery() {
  return useMutation({
    mutationFn: async ({ question, nResults = 5, skipLlm = false }) => {
      const res = await apiClient.post('/brain/query', {
        question,
        n_results: nResults,
        skip_llm: Boolean(skipLlm),
      });
      return unwrapItem(res);
    },
  });
}

export function useIngestDrive() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ folderId = null, maxFiles = null } = {}) => {
      const payload = {};
      if (folderId != null && folderId !== '') {
        payload.folder_id = folderId;
      }
      if (maxFiles != null) {
        payload.max_files = maxFiles;
      }
      const res = await apiClient.post('/brain/ingestion/drive/folder', payload);
      return unwrapItem(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: knowledgeKeys.status() });
    },
  });
}

export function useIngestSlack() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async () => {
      const res = await apiClient.post('/brain/ingestion/slack/all');
      return unwrapItem(res);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: knowledgeKeys.status() });
    },
  });
}

export { getApiErrorMessage };
