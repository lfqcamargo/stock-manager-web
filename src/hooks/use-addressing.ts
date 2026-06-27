import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createAddressing } from '@/api/stock/create-addressing';
import { deleteAddressing } from '@/api/stock/delete-addressing';
import { editAddressing } from '@/api/stock/edit-addressing';
import { fetchAddressings } from '@/api/stock/fetch-addressings';
import { findAddressingById } from '@/api/stock/find-addressing-by-id';

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
      materialId?: string;
      active?: boolean;
      minAmount?: number;
      maxAmount?: number;
      orderBy?: string;
      orderDirection?: string;
    },
  ) => {
    return useQuery({
      queryKey: ['addressings', page, limit, params],
      queryFn: () => fetchAddressings({ page, limit, ...params }),
    });
  };

  const useCreateAddressing = () => {
    return useMutation({
      mutationFn: createAddressing,
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['addressings'] });
        toast.success('Endereçamento criado com sucesso');
      },
    });
  };

  const useEditAddressing = () => {
    return useMutation({
      mutationFn: editAddressing,
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['addressings'] });
        toast.success('Endereçamento atualizado com sucesso');
      },
    });
  };

  const useDeleteAddressing = () => {
    return useMutation({
      mutationFn: ({ id }: { id: string }) => deleteAddressing(id),
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['addressings'] });
        toast.success('Endereçamento excluído com sucesso');
      },
    });
  };

  const useGetAddressingById = (id: string) => {
    return useQuery({
      queryKey: ['addressing', id],
      queryFn: () => findAddressingById(id),
      enabled: !!id,
    });
  };

  return {
    useGetAddressings,
    useGetAddressingById,
    useCreateAddressing,
    useEditAddressing,
    useDeleteAddressing,
  };
}
