import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { fetchAddressings } from '@/api/stock/fetch-addressings';

export function useAddressing() {
  const queryClient = useQueryClient();

  const useGetAddressings = (
    page = 0,
    limit = 20,
    params?: {
      locationId?: string;
      subLocationId?: string;
      rowId?: string;
      shelfId?: string;
      positionId?: string;
      name?: string;
      description?: string;
      orderBy?: string;
      orderDirection?: string;
    },
  ) => {
    return useQuery({
      queryKey: ['addressings', page, limit, params],
      queryFn: () => fetchAddressings({ page, limit, ...params }),
    });
  };

  const useGetAddressingsStats = () => {
    return useQuery({
      queryKey: ['addressingsStats'],
      queryFn: () => fetchAddressings({ page: 0, limit: 1 }),
    });
  };

  const useCreateAddressing = () => {
    return useMutation({
      mutationFn: async ({
        code,
        name,
        locationId,
        subLocationId,
        rowId,
        shelfId,
        positionId,
        description,
        active,
      }: {
        code?: string;
        name: string;
        locationId: string;
        subLocationId: string;
        rowId: string;
        shelfId: string;
        positionId: string;
        description?: string;
        active?: boolean;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Creating addressing', {
          code: code || `ADDR-${Date.now()}`,
          name,
          locationId,
          subLocationId,
          rowId,
          shelfId,
          positionId,
          description,
          active: active ?? true,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['addressings'] });
      },
    });
  };

  const useEditAddressing = () => {
    return useMutation({
      mutationFn: async ({
        id,
        code,
        name,
        locationId,
        subLocationId,
        rowId,
        shelfId,
        positionId,
        description,
        active,
      }: {
        id: string;
        code?: string;
        name: string;
        locationId: string;
        subLocationId: string;
        rowId: string;
        shelfId: string;
        positionId: string;
        description?: string;
        active?: boolean;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Editing addressing', {
          id,
          code,
          name,
          locationId,
          subLocationId,
          rowId,
          shelfId,
          positionId,
          description,
          active,
        });
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['addressings'] });
      },
    });
  };

  const useDeleteAddressing = () => {
    return useMutation({
      mutationFn: async ({ id }: { id: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Deleting addressing', id);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['addressings'] });
      },
    });
  };

  return {
    useGetAddressings,
    useGetAddressingsStats,
    useCreateAddressing,
    useEditAddressing,
    useDeleteAddressing,
  };
}
