import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createGroup } from '@/api/stock/create-group';
import { deleteGroup } from '@/api/stock/delete-group';
import { editGroup } from '@/api/stock/edit-group';
import { fetchGroups } from '@/api/stock/fetch-groups';

export function useGroup() {
  const queryClient = useQueryClient();

  const useGetGroups = (
    page: number = 0,
    limit: number = 20,
    params?: {
      orderBy?: 'name' | 'description' | 'code' | 'active';
      orderDirection?: 'asc' | 'desc';
      code?: string;
      name?: string;
      description?: string;
      active?: boolean;
    },
  ) => {
    return useQuery({
      queryKey: ['groups', page, limit, params],
      queryFn: async () => await fetchGroups(page, limit, params),
    });
  };

  const useGetGroupsStats = () => {
    return useQuery({
      queryKey: ['groups-stats'],
      queryFn: async () => await fetchGroups(0, 1),
    });
  };

  const useCreateGroup = () => {
    return useMutation({
      mutationFn: async (data: {
        code: string;
        name: string;
        description?: string;
        active: boolean;
      }) => await createGroup(data),
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['groups'] });
      },
    });
  };

  const useEditGroup = () => {
    return useMutation({
      mutationFn: async (data: {
        id: string;
        code: string;
        name: string;
        description?: string;
        active: boolean;
      }) => await editGroup(data),
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['groups'] });
      },
    });
  };

  const useDeleteGroup = () => {
    return useMutation({
      mutationFn: async (data: { id: string }) => await deleteGroup(data.id),
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['groups'] });
      },
    });
  };

  return {
    useGetGroups,
    useGetGroupsStats,
    useCreateGroup,
    useEditGroup,
    useDeleteGroup,
  };
}
