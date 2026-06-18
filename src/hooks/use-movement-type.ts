import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  GetMovementTypesResponse,
  MovementType,
} from '@/api/stock/fetch-movement-types';

// Mock data
const mockMovementTypesData: GetMovementTypesResponse = {
  movementTypes: [
    {
      id: '1',
      name: 'Compra',
      direction: 'IN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      name: 'Venda',
      direction: 'OUT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '3',
      name: 'Devolução',
      direction: 'IN',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '4',
      name: 'Transferência',
      direction: 'OUT',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  meta: {
    totalItems: 4,
    totalPages: 1,
    itemsPerPage: 20,
    totalInboundTypes: 2,
    totalOutboundTypes: 2,
  },
};

export function useMovementType() {
  const queryClient = useQueryClient();

  const useGetMovementTypes = (
    _page: number = 0,
    _limit: number = 20,
    _params?: {
      orderBy?: string;
      orderDirection?: 'asc' | 'desc';
      name?: string;
      direction?: 'IN' | 'OUT';
    },
  ) => {
    return useQuery({
      queryKey: ['movementTypes', _page, _limit, _params],
      queryFn: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        return mockMovementTypesData;
      },
    });
  };

  const useGetMovementTypesStats = () => {
    return useQuery({
      queryKey: ['movementTypes-stats'],
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockMovementTypesData;
      },
    });
  };

  const useCreateMovementType = () => {
    return useMutation({
      mutationFn: async (data: { name: string; direction: 'IN' | 'OUT' }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Creating movement type:', data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['movementTypes'] });
      },
    });
  };

  const useEditMovementType = () => {
    return useMutation({
      mutationFn: async (data: {
        id: string;
        name: string;
        direction: 'IN' | 'OUT';
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Editing movement type:', data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['movementTypes'] });
      },
    });
  };

  const useDeleteMovementType = () => {
    return useMutation({
      mutationFn: async (data: { id: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Deleting movement type:', data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['movementTypes'] });
      },
    });
  };

  return {
    useGetMovementTypes,
    useGetMovementTypesStats,
    useCreateMovementType,
    useEditMovementType,
    useDeleteMovementType,
  };
}
