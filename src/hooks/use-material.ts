import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { createMaterial } from '@/api/stock/create-material';
import { deleteMaterial } from '@/api/stock/delete-material';
import { editMaterial } from '@/api/stock/edit-material';
import { fetchMaterials } from '@/api/stock/fetch-materials';
import type { UnitMeasure } from '@/lib/unit-measure-enum';

export function useMaterial() {
  const queryClient = useQueryClient();

  const useGetMaterials = (
    page: number = 0,
    limit: number = 20,
    params?: {
      orderBy?: 'name' | 'code' | 'unit' | 'active' | 'groupId';
      orderDirection?: 'asc' | 'desc';
      active?: boolean;
      groupId?: string;
      code?: string;
      name?: string;
      description?: string;
    },
  ) => {
    return useQuery({
      queryKey: ['materials', page, limit, params],
      queryFn: async () => await fetchMaterials(page, limit, params),
    });
  };

  const useGetMaterialsStats = () => {
    return useQuery({
      queryKey: ['materials-stats'],
      queryFn: async () => await fetchMaterials(0, 1),
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
      }) => await createMaterial(data),
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['materials'] });
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
      }) => await editMaterial(data),
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['materials'] });
      },
    });
  };

  const useDeleteMaterial = () => {
    return useMutation({
      mutationFn: async (data: { id: string }) => await deleteMaterial(data.id),
      onSuccess: () => {
        void queryClient.invalidateQueries({ queryKey: ['materials'] });
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
