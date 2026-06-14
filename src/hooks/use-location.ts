import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchLocations } from '@/api/stock/fetch-locations';

export function useLocation() {
  const queryClient = useQueryClient();

  const useGetLocations = (
    page = 0,
    limit = 20,
    params?: {
      orderBy?: string;
      orderDirection?: string;
      search?: string;
      active?: boolean;
    },
  ) => {
    return useQuery({
      queryKey: ['locations', page, limit, params],
      queryFn: () => fetchLocations({ page, limit, ...params }),
    });
  };

  const useGetLocationsStats = () => {
    return useQuery({
      queryKey: ['locationsStats'],
      queryFn: () => fetchLocations({ page: 0, limit: 1 }),
    });
  };

  const useCreateLocation = () => {
    return useMutation({
      mutationFn: async ({
        code,
        name,
        description,
        active,
      }: {
        code?: string;
        name: string;
        description?: string;
        active?: boolean;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Creating location', {
          code: code || `LOC-${Date.now()}`,
          name,
          description,
          active: active ?? true,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['locations'] });
      },
    });
  };

  const useEditLocation = () => {
    return useMutation({
      mutationFn: async ({
        id,
        code,
        name,
        description,
        active,
      }: {
        id: string;
        code?: string;
        name: string;
        description?: string;
        active?: boolean;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Editing location', {
          id,
          code,
          name,
          description,
          active,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['locations'] });
      },
    });
  };

  const useDeleteLocation = () => {
    return useMutation({
      mutationFn: async ({ id }: { id: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Deleting location', id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['locations'] });
      },
    });
  };

  return {
    useGetLocations,
    useGetLocationsStats,
    useCreateLocation,
    useEditLocation,
    useDeleteLocation,
  };
}
