import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createSubLocation } from '@/api/stock/create-sub-location';
import { deleteSubLocation } from '@/api/stock/delete-sub-location';
import { editSubLocation } from '@/api/stock/edit-sub-location';
import { fetchSubLocations } from '@/api/stock/fetch-sub-locations';
import { findSubLocationById } from '@/api/stock/find-sub-location-by-id';

export function useSubLocation() {
  const queryClient = useQueryClient();

  const useGetSubLocations = (
    page = 0,
    limit = 20,
    params?: {
      locationId?: string;
      name?: string;
      code?: string;
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

  const useCreateSubLocation = () => {
    return useMutation({
      mutationFn: createSubLocation,
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['subLocations'] });
        toast.success('Sub-localização criada com sucesso');
      },
    });
  };

  const useEditSubLocation = () => {
    return useMutation({
      mutationFn: editSubLocation,
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['subLocations'] });
        toast.success('Sub-localização atualizada com sucesso');
      },
    });
  };

  const useDeleteSubLocation = () => {
    return useMutation({
      mutationFn: ({ id }: { id: string }) => deleteSubLocation(id),
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['subLocations'] });
        toast.success('Sub-localização excluída com sucesso');
      },
    });
  };

  const useGetSubLocationById = (id: string) => {
    return useQuery({
      queryKey: ['subLocation', id],
      queryFn: () => findSubLocationById(id),
      enabled: !!id,
    });
  };

  return {
    useGetSubLocations,
    useGetSubLocationById,
    useCreateSubLocation,
    useEditSubLocation,
    useDeleteSubLocation,
  };
}
