import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createPosition } from '@/api/stock/create-position';
import { deletePosition } from '@/api/stock/delete-position';
import { editPosition } from '@/api/stock/edit-position';
import { fetchPositions } from '@/api/stock/fetch-positions';
import { findPositionById } from '@/api/stock/find-position-by-id';

export function usePosition() {
  const queryClient = useQueryClient();

  const useGetPositions = (
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
      queryKey: ['positions', page, limit, params],
      queryFn: () => fetchPositions({ page, limit, ...params }),
    });
  };

  const useCreatePosition = () => {
    return useMutation({
      mutationFn: createPosition,
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['positions'] });
        toast.success('Posição criada com sucesso');
      },
    });
  };

  const useEditPosition = () => {
    return useMutation({
      mutationFn: editPosition,
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['positions'] });
        toast.success('Posição atualizada com sucesso');
      },
    });
  };

  const useDeletePosition = () => {
    return useMutation({
      mutationFn: ({ id }: { id: string }) => deletePosition(id),
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['positions'] });
        toast.success('Posição excluída com sucesso');
      },
    });
  };

  const useGetPositionById = (id: string) => {
    return useQuery({
      queryKey: ['position', id],
      queryFn: () => findPositionById(id),
      enabled: !!id,
    });
  };

  return {
    useGetPositions,
    useGetPositionById,
    useCreatePosition,
    useEditPosition,
    useDeletePosition,
  };
}
