import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchPositions } from '@/api/stock/fetch-positions';

export function usePosition() {
  const queryClient = useQueryClient();

  const useGetPositions = (
    page = 0,
    limit = 20,
    params?: {
      shelfId?: string;
      name?: string;
      description?: string;
      orderBy?: string;
      orderDirection?: string;
    },
  ) => {
    return useQuery({
      queryKey: ['positions', page, limit, params],
      queryFn: () => fetchPositions({ page, limit, ...params }),
    });
  };

  const useGetPositionsStats = () => {
    return useQuery({
      queryKey: ['positionsStats'],
      queryFn: () => fetchPositions({ page: 0, limit: 1 }),
    });
  };

  const useCreatePosition = () => {
    return useMutation({
      mutationFn: async ({
        code,
        name,
        shelfId,
        description,
        active,
      }: {
        code?: string;
        name: string;
        shelfId: string;
        description?: string;
        active?: boolean;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Creating position', {
          code: code || `POS-${Date.now()}`,
          name,
          shelfId,
          description,
          active: active ?? true,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['positions'] });
      },
    });
  };

  const useEditPosition = () => {
    return useMutation({
      mutationFn: async ({
        id,
        code,
        name,
        shelfId,
        description,
        active,
      }: {
        id: string;
        code?: string;
        name: string;
        shelfId: string;
        description?: string;
        active?: boolean;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Editing position', {
          id,
          code,
          name,
          shelfId,
          description,
          active,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['positions'] });
      },
    });
  };

  const useDeletePosition = () => {
    return useMutation({
      mutationFn: async ({ id }: { id: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Deleting position', id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['positions'] });
      },
    });
  };

  return {
    useGetPositions,
    useGetPositionsStats,
    useCreatePosition,
    useEditPosition,
    useDeletePosition,
  };
}
