import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createShelf } from '@/api/stock/create-shelf';
import { deleteShelf } from '@/api/stock/delete-shelf';
import { editShelf } from '@/api/stock/edit-shelf';
import { fetchShelfs } from '@/api/stock/fetch-shelfs';
import { findShelfById } from '@/api/stock/find-shelf-by-id';

export function useShelf() {
  const queryClient = useQueryClient();

  const useGetShelfs = (
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
      queryKey: ['shelfs', page, limit, params],
      queryFn: () => fetchShelfs({ page, limit, ...params }),
    });
  };

  const useCreateShelf = () => {
    return useMutation({
      mutationFn: createShelf,
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['shelfs'] });
        toast.success('Prateleira criada com sucesso');
      },
    });
  };

  const useEditShelf = () => {
    return useMutation({
      mutationFn: editShelf,
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['shelfs'] });
        toast.success('Prateleira atualizada com sucesso');
      },
    });
  };

  const useDeleteShelf = () => {
    return useMutation({
      mutationFn: ({ id }: { id: string }) => deleteShelf(id),
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['shelfs'] });
        toast.success('Prateleira excluída com sucesso');
      },
    });
  };

  const useGetShelfById = (id: string) => {
    return useQuery({
      queryKey: ['shelf', id],
      queryFn: () => findShelfById(id),
      enabled: !!id,
    });
  };

  return {
    useGetShelfs,
    useGetShelfById,
    useCreateShelf,
    useEditShelf,
    useDeleteShelf,
  };
}
