import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { deleteUser as deleteUserApi } from '@/api/user/delete-user';
import type { EditUserBody } from '@/api/user/edit-user';
import { editUser as editUserApi } from '@/api/user/edit-user';
import type { FetchUsersQueryParams } from '@/api/user/fetch-users';
import { fetchUsers as fetchUsersApi } from '@/api/user/fetch-users';
import { ToastError } from '@/components/toast-error';

export const useUsers = (params?: FetchUsersQueryParams) => {
  const queryClient = useQueryClient();

  const usersQuery = useQuery({
    queryKey: ['users', params],
    queryFn: () => fetchUsersApi(params),
  });

  const editUserMutation = useMutation({
    mutationFn: async (data: { id: string; data: EditUserBody }) =>
      editUserApi(data.id, data.data),
    onSuccess: () => {
      toast.success('Usuário atualizado com sucesso');
      void queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      ToastError(error);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: deleteUserApi,
    onSuccess: () => {
      toast.success('Usuário deletado com sucesso');
      void queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error) => {
      ToastError(error);
    },
  });

  return {
    users: usersQuery.data?.users ?? [],
    meta: usersQuery.data?.meta,
    isLoading: usersQuery.isLoading,
    isError: usersQuery.isError,
    editUserMutation,
    deleteUserMutation,
  };
};
