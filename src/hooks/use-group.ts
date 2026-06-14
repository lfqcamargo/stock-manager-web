import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { GetGroupsResponse } from '@/api/stock/fetch-groups';

// Mock data
const mockGroupsData: GetGroupsResponse = {
  groups: [
    {
      id: '1',
      code: 'GRP001',
      name: 'Eletrônicos',
      description: 'Produtos eletrônicos',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      code: 'GRP002',
      name: 'Móveis',
      description: 'Móveis para escritório',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  meta: {
    totalItems: 2,
    totalPages: 1,
    itemsPerPage: 20,
    totalActiveGroups: 2,
    totalEmptyGroups: 0,
    lastCreated: new Date().toISOString(),
  },
};

export function useGroup() {
  const queryClient = useQueryClient();

  const useGetGroups = (
    page: number = 0,
    limit: number = 20,
    params?: {
      orderBy?: string;
      orderDirection?: 'asc' | 'desc';
      search?: string;
      active?: boolean;
    },
  ) => {
    return useQuery({
      queryKey: ['groups', page, limit, params],
      queryFn: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        return mockGroupsData;
      },
    });
  };

  const useGetGroupsStats = () => {
    return useQuery({
      queryKey: ['groups-stats'],
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockGroupsData;
      },
    });
  };

  const useCreateGroup = () => {
    return useMutation({
      mutationFn: async (data: {
        code: string;
        name: string;
        description?: string;
        active: boolean;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Creating group:', data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['groups'] });
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
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Editing group:', data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['groups'] });
      },
    });
  };

  const useDeleteGroup = () => {
    return useMutation({
      mutationFn: async (data: { id: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Deleting group:', data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['groups'] });
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
