import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import type { GetMaterialsResponse } from '@/api/stock/fetch-materials';
import type { UnitMeasure } from '@/lib/unit-measure-enum';

// Mock data
const mockMaterialsData: GetMaterialsResponse = {
  materials: [
    {
      id: '1',
      code: 'MAT001',
      name: 'Mouse Wireless',
      description: 'Mouse sem fio',
      groupId: '1',
      group: 'Eletrônicos',
      unit: 'UN',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
    {
      id: '2',
      code: 'MAT002',
      name: 'Teclado Mecânico',
      description: 'Teclado mecânico',
      groupId: '1',
      group: 'Eletrônicos',
      unit: 'UN',
      active: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    },
  ],
  meta: {
    totalItems: 2,
    totalPages: 1,
    itemsPerPage: 20,
    totalActiveMaterials: 2,
    itemCount: 2,
    lastCreated: new Date().toISOString(),
  },
};

export function useMaterial() {
  const queryClient = useQueryClient();

  const useGetMaterials = (
    page: number = 0,
    limit: number = 20,
    params?: {
      orderBy?: string;
      orderDirection?: 'asc' | 'desc';
      search?: string;
      active?: boolean;
      groupId?: string;
      code?: string;
      name?: string;
    },
  ) => {
    return useQuery({
      queryKey: ['materials', page, limit, params],
      queryFn: async () => {
        // Simulate API call
        await new Promise((resolve) => setTimeout(resolve, 500));
        return mockMaterialsData;
      },
    });
  };

  const useGetMaterialsStats = () => {
    return useQuery({
      queryKey: ['materials-stats'],
      queryFn: async () => {
        await new Promise((resolve) => setTimeout(resolve, 300));
        return mockMaterialsData;
      },
    });
  };

  const useCreateMaterial = () => {
    return useMutation({
      mutationFn: async (data: {
        groupId: string;
        code: string;
        name: string;
        description?: string;
        unit: UnitMeasure;
        active: boolean;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Creating material:', data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['materials'] });
      },
    });
  };

  const useEditMaterial = () => {
    return useMutation({
      mutationFn: async (data: {
        id: string;
        groupId: string;
        code: string;
        name: string;
        description?: string;
        unit: UnitMeasure;
        active: boolean;
      }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Editing material:', data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['materials'] });
      },
    });
  };

  const useDeleteMaterial = () => {
    return useMutation({
      mutationFn: async (data: { id: string }) => {
        await new Promise((resolve) => setTimeout(resolve, 500));
        console.log('Deleting material:', data);
      },
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['materials'] });
      },
    });
  };

  return {
    useGetMaterials,
    useGetMaterialsStats,
    useCreateMaterial,
    useEditMaterial,
    useDeleteMaterial,
  };
}
