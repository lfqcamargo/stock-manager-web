import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createMovement } from '@/api/stock/create-movement';
import { fetchMovements } from '@/api/stock/fetch-movements';
import { findMovementById } from '@/api/stock/find-movement-by-id';

export function useMovement() {
  const queryClient = useQueryClient();

  const useGetMovements = (
    page = 0,
    limit = 20,
    params?: {
      locationId?: string;
      subLocationId?: string;
      rowId?: string;
      shelfId?: string;
      positionId?: string;
      materialId?: string;
      movementTypeId?: string;
      direction?: 'IN' | 'OUT';
      userId?: string;
      dateFrom?: string;
      dateTo?: string;
      minQuantity?: number;
      maxQuantity?: number;
      orderBy?: string;
      orderDirection?: string;
    },
  ) => {
    return useQuery({
      queryKey: ['movements', page, limit, params],
      queryFn: () => fetchMovements({ page, limit, ...params }),
    });
  };

  const useGetMovementById = (id: string) => {
    return useQuery({
      queryKey: ['movement', id],
      queryFn: () => findMovementById(id),
      enabled: !!id,
    });
  };

  const useCreateMovement = () => {
    return useMutation({
      mutationFn: createMovement,
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['movements'] });
        void queryClient.invalidateQueries({ queryKey: ['addressings'] });
        toast.success('Movimentação registrada com sucesso');
      },
    });
  };

  return {
    useGetMovements,
    useGetMovementById,
    useCreateMovement,
  };
}
