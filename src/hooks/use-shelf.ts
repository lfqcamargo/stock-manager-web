import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchShelfs } from '@/api/stock/fetch-shelfs';

export function useShelf() {
  const queryClient = useQueryClient();

  const useGetShelfs = (
    page = 0,
    limit = 20,
    params?: {
      rowId?: string;
      name?: string;
      description?: string;
      orderBy?: string;
      orderDirection?: string;
    },
  ) => {
    return useQuery({
      queryKey: ['shelfs', page, limit, params],
      queryFn: () => fetchShelfs({ page, limit, ...params }),
    });
  };

  const useGetShelfsStats = () => {
    return useQuery({
      queryKey: ['shelfsStats'],
      queryFn: () => fetchShelfs({ page: 0, limit: 1 }),
    });
  };

  const useCreateShelf = () => {
    return useMutation({
      mutationFn: async ({
        code,
        name,
        rowId,
        description,
        active,
      }: {
        code?: string;
        name: string;
        rowId: string;
        description?: string;
        active?: boolean;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Creating shelf', {
          code: code || `SHELF-${Date.now()}`,
          name,
          rowId,
          description,
          active: active ?? true,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['shelfs'] });
      },
    });
  };

  const useEditShelf = () => {
    return useMutation({
      mutationFn: async ({
        id,
        code,
        name,
        rowId,
        description,
        active,
      }: {
        id: string;
        code?: string;
        name: string;
        rowId: string;
        description?: string;
        active?: boolean;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Editing shelf', {
          id,
          code,
          name,
          rowId,
          description,
          active,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['shelfs'] });
      },
    });
  };

  const useDeleteShelf = () => {
    return useMutation({
      mutationFn: async ({ id }: { id: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Deleting shelf', id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['shelfs'] });
      },
    });
  };

  return {
    useGetShelfs,
    useGetShelfsStats,
    useCreateShelf,
    useEditShelf,
    useDeleteShelf,
  };
}
