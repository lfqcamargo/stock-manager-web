import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createGroup } from '@/api/stock/create-group';
import { deleteGroup } from '@/api/stock/delete-group';
import { editGroup } from '@/api/stock/edit-group';
import { fetchGroupById, fetchGroups } from '@/api/stock/fetch-groups';

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

  const useGetGroupById = (id: string) => {
    return useQuery({
      queryKey: ['group', id],
      queryFn: async () => await fetchGroupById(id),
      enabled: !!id,
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
        photoUrl?: string | null;
      }) => await createGroup(data),
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['groups'] });
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
        photoUrl?: string | null;
      }) => await editGroup(data),
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['groups'] });
      },
    });
  };

  const useDeleteGroup = () => {
    return useMutation({
      mutationFn: async (data: { id: string }) => await deleteGroup(data.id),
      onSuccess: () => {
        queryClient.removeQueries({ queryKey: ['groups'] });
      },
    });
  };

  return {
    useGetGroups,
    useGetGroupById,
    useGetGroupsStats,
    useCreateGroup,
    useEditGroup,
    useDeleteGroup,
  };
}
