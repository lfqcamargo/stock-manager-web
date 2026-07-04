import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { createRow } from '@/api/stock/create-row';
import { deleteRow } from '@/api/stock/delete-row';
import { editRow } from '@/api/stock/edit-row';
import { fetchRows } from '@/api/stock/fetch-rows';
import { findRowById } from '@/api/stock/find-row-by-id';

export function useRow() {
  const queryClient = useQueryClient();

  const useGetRows = (
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
      queryKey: ['rows', page, limit, params],
      queryFn: () => fetchRows({ page, limit, ...params }),
    });
  };

  const useCreateRow = () => {
    return useMutation({
      mutationFn: createRow,
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['rows'] });
        toast.success('Fileira criada com sucesso');
      },
    });
  };

  const useEditRow = () => {
    return useMutation({
      mutationFn: editRow,
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['rows'] });
        toast.success('Fileira atualizada com sucesso');
      },
    });
  };

  const useDeleteRow = () => {
    return useMutation({
      mutationFn: ({ id }: { id: string }) => deleteRow(id),
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['rows'] });
        toast.success('Fileira excluída com sucesso');
      },
    });
  };

  const useGetRowById = (id: string) => {
    return useQuery({
      queryKey: ['row', id],
      queryFn: () => findRowById(id),
      enabled: !!id,
    });
  };

  return { useGetRows, useGetRowById, useCreateRow, useEditRow, useDeleteRow };
}
