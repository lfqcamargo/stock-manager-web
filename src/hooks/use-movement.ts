import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type {
  GetMovementsResponse,
  Movement,
} from '@/api/stock/fetch-movements';

// Mock data
const mockMovementsData: GetMovementsResponse = {
  movements: [
    {
      id: '1',
      materialId: '1',
      material: {
        id: '1',
        code: 'MAT001',
        name: 'Mouse Wireless',
      },
      addressingId: '1',
      addressing: {
        id: '1',
        location: { id: '1', name: 'Armazém Principal' },
        subLocation: { id: '1', name: 'Corredor A' },
        row: { id: '1', name: 'Fileira 1' },
        shelf: { id: '1', name: 'Prateleira 1' },
        position: { id: '1', name: 'Posição 1' },
      },
      movementTypeId: '1',
      movementType: {
        id: '1',
        name: 'Compra',
        direction: 'IN',
      },
      quantity: 50,
      date: new Date().toISOString(),
      observation: 'Compra de materiais',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      materialId: '2',
      material: {
        id: '2',
        code: 'MAT002',
        name: 'Teclado Mecânico',
      },
      addressingId: '2',
      addressing: {
        id: '2',
        location: { id: '1', name: 'Armazém Principal' },
        subLocation: { id: '1', name: 'Corredor A' },
        row: { id: '1', name: 'Fileira 1' },
        shelf: { id: '1', name: 'Prateleira 1' },
        position: { id: '2', name: 'Posição 2' },
      },
      movementTypeId: '2',
      movementType: {
        id: '2',
        name: 'Venda',
        direction: 'OUT',
      },
      quantity: 10,
      date: new Date().toISOString(),
      observation: 'Venda para cliente',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  meta: {
    totalItems: 2,
    totalPages: 1,
    itemsPerPage: 20,
  },
};

export function useMovement() {
  const queryClient = useQueryClient();

  const useGetMovements = (
    _page: number = 0,
    _limit: number = 20,
    _params?: {
      orderBy?: string;
      orderDirection?: 'asc' | 'desc';
      materialId?: string;
      movementTypeId?: string;
    },
  ) => {
    return useQuery({
      queryKey: ['movements', _page, _limit, _params],
      queryFn: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        return mockMovementsData;
      },
    });
  };

  const useCreateMovement = () => {
    return useMutation({
      mutationFn: async (data: {
        materialId: string;
        addressingId: string;
        movementTypeId: string;
        quantity: number;
        date: string;
        observation?: string;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Creating movement:', data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['movements'] });
      },
    });
  };

  const useEditMovement = () => {
    return useMutation({
      mutationFn: async (data: {
        id: string;
        materialId: string;
        addressingId: string;
        movementTypeId: string;
        quantity: number;
        date: string;
        observation?: string;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Editing movement:', data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['movements'] });
      },
    });
  };

  const useDeleteMovement = () => {
    return useMutation({
      mutationFn: async (data: { id: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Deleting movement:', data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['movements'] });
      },
    });
  };

  return {
    useGetMovements,
    useCreateMovement,
    useEditMovement,
    useDeleteMovement,
  };
}
