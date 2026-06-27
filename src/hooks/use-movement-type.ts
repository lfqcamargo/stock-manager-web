import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createMovementType } from '@/api/stock/create-movement-type';
import { deleteMovementType } from '@/api/stock/delete-movement-type';
import { editMovementType } from '@/api/stock/edit-movement-type';
import { fetchMovementTypes } from '@/api/stock/fetch-movement-types';
import { findMovementTypeById } from '@/api/stock/find-movement-type-by-id';

export function useMovementType() {
  const queryClient = useQueryClient();

  const useGetMovementTypes = (
    page = 0,
    limit = 20,
    params?: {
      name?: string;
      direction?: 'IN' | 'OUT';
      orderBy?: string;
      orderDirection?: string;
    },
  ) => {
    return useQuery({
      queryKey: ['movementTypes', page, limit, params],
      queryFn: () => fetchMovementTypes({ page, limit, ...params }),
    });
  };

  const useGetMovementTypeById = (id: string) => {
    return useQuery({
      queryKey: ['movementType', id],
      queryFn: () => findMovementTypeById(id),
      enabled: !!id,
    });
  };

  const useCreateMovementType = () => {
    return useMutation({
      mutationFn: createMovementType,
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['movementTypes'] });
        toast.success('Tipo de movimentação criado com sucesso');
      },
    });
  };

  const useEditMovementType = () => {
    return useMutation({
      mutationFn: editMovementType,
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['movementTypes'] });
        toast.success('Tipo de movimentação atualizado com sucesso');
      },
    });
  };

  const useDeleteMovementType = () => {
    return useMutation({
      mutationFn: ({ id }: { id: string }) => deleteMovementType(id),
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['movementTypes'] });
        toast.success('Tipo de movimentação excluído com sucesso');
      },
    });
  };

  return {
    useGetMovementTypes,
    useGetMovementTypeById,
    useCreateMovementType,
    useEditMovementType,
    useDeleteMovementType,
  };
}
