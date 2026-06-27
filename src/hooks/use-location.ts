import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createLocation } from '@/api/stock/create-location';
import { deleteLocation } from '@/api/stock/delete-location';
import { editLocation } from '@/api/stock/edit-location';
import { fetchLocations } from '@/api/stock/fetch-locations';
import { findLocationById } from '@/api/stock/find-location-by-id';

export function useLocation() {
  const queryClient = useQueryClient();

  const useGetLocations = (
    page = 0,
    limit = 20,
    params?: {
      name?: string;
      code?: string;
      description?: string;
      orderBy?: string;
      orderDirection?: string;
    },
  ) => {
    return useQuery({
      queryKey: ['locations', page, limit, params],
      queryFn: () => fetchLocations({ page, limit, ...params }),
    });
  };

  const useCreateLocation = () => {
    return useMutation({
      mutationFn: createLocation,
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['locations'] });
        toast.success('Localização criada com sucesso');
      },
    });
  };

  const useEditLocation = () => {
    return useMutation({
      mutationFn: editLocation,
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['locations'] });
        toast.success('Localização atualizada com sucesso');
      },
    });
  };

  const useDeleteLocation = () => {
    return useMutation({
      mutationFn: ({ id }: { id: string }) => deleteLocation(id),
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['locations'] });
        toast.success('Localização excluída com sucesso');
      },
    });
  };

  const useGetLocationById = (id: string) => {
    return useQuery({
      queryKey: ['location', id],
      queryFn: () => findLocationById(id),
      enabled: !!id,
    });
  };

  return {
    useGetLocations,
    useGetLocationById,
    useCreateLocation,
    useEditLocation,
    useDeleteLocation,
  };
}
