import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchRows } from '@/api/stock/fetch-rows';

export function useRow() {
  const queryClient = useQueryClient();

  const useGetRows = (
    page = 0,
    limit = 20,
    params?: {
      subLocationId?: string;
      name?: string;
      description?: string;
      orderBy?: string;
      orderDirection?: string;
    },
  ) => {
    return useQuery({
      queryKey: ['rows', page, limit, params],
      queryFn: () => fetchRows({ page, limit, ...params }),
    });
  };

  const useGetRowsStats = () => {
    return useQuery({
      queryKey: ['rowsStats'],
      queryFn: () => fetchRows({ page: 0, limit: 1 }),
    });
  };

  const useCreateRow = () => {
    return useMutation({
      mutationFn: async ({
        code,
        name,
        subLocationId,
        description,
        active,
      }: {
        code?: string;
        name: string;
        subLocationId: string;
        description?: string;
        active?: boolean;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Creating row', {
          code: code || `ROW-${Date.now()}`,
          name,
          subLocationId,
          description,
          active: active ?? true,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['rows'] });
      },
    });
  };

  const useEditRow = () => {
    return useMutation({
      mutationFn: async ({
        id,
        code,
        name,
        subLocationId,
        description,
        active,
      }: {
        id: string;
        code?: string;
        name: string;
        subLocationId: string;
        description?: string;
        active?: boolean;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Editing row', {
          id,
          code,
          name,
          subLocationId,
          description,
          active,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['rows'] });
      },
    });
  };

  const useDeleteRow = () => {
    return useMutation({
      mutationFn: async ({ id }: { id: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Deleting row', id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['rows'] });
      },
    });
  };

  return {
    useGetRows,
    useGetRowsStats,
    useCreateRow,
    useEditRow,
    useDeleteRow,
  };
}
