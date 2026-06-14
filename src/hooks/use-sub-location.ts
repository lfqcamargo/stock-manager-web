import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchSubLocations } from '@/api/stock/fetch-sub-locations';

export function useSubLocation() {
  const queryClient = useQueryClient();

  const useGetSubLocations = (
    page = 0,
    limit = 20,
    params?: {
      locationId?: string;
      name?: string;
      description?: string;
      orderBy?: string;
      orderDirection?: string;
    },
  ) => {
    return useQuery({
      queryKey: ['subLocations', page, limit, params],
      queryFn: () => fetchSubLocations({ page, limit, ...params }),
    });
  };

  const useGetSubLocationsStats = () => {
    return useQuery({
      queryKey: ['subLocationsStats'],
      queryFn: () => fetchSubLocations({ page: 0, limit: 1 }),
    });
  };

  const useCreateSubLocation = () => {
    return useMutation({
      mutationFn: async ({
        code,
        name,
        locationId,
        description,
        active,
      }: {
        code?: string;
        name: string;
        locationId: string;
        description?: string;
        active?: boolean;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Creating subLocation', {
          code: code || `SUB-${Date.now()}`,
          name,
          locationId,
          description,
          active: active ?? true,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['subLocations'] });
      },
    });
  };

  const useEditSubLocation = () => {
    return useMutation({
      mutationFn: async ({
        id,
        code,
        name,
        locationId,
        description,
        active,
      }: {
        id: string;
        code?: string;
        name: string;
        locationId: string;
        description?: string;
        active?: boolean;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Editing subLocation', {
          id,
          code,
          name,
          locationId,
          description,
          active,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['subLocations'] });
      },
    });
  };

  const useDeleteSubLocation = () => {
    return useMutation({
      mutationFn: async ({ id }: { id: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Deleting subLocation', id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['subLocations'] });
      },
    });
  };

  return {
    useGetSubLocations,
    useGetSubLocationsStats,
    useCreateSubLocation,
    useEditSubLocation,
    useDeleteSubLocation,
  };
}
