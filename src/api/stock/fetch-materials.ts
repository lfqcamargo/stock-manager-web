import { api } from '@/lib/axios';
import type { UnitMeasure } from '@/lib/unit-measure-enum';

export interface MaterialDetails {
  id: string;
  code: string;
  name: string;
  description?: string;
  groupId: string;
  group: string;
  unit: UnitMeasure;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetMaterialsResponse {
  materials: MaterialDetails[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    totalActiveMaterials: number;
    itemCount: number;
    lastCreated?: string;
  };
}

export async function fetchMaterials(
  page: number = 0,
  limit: number = 20,
  params?: {
    orderBy?: keyof MaterialDetails;
    orderDirection?: 'asc' | 'desc';
    search?: string;
    active?: boolean;
    groupId?: string;
    code?: string;
    name?: string;
  },
): Promise<GetMaterialsResponse> {
  const response = await api.get<GetMaterialsResponse>('/stock/materials', {
    params: {
      page: page + 1,
      limit,
      ...params,
    },
  });
  return response.data;
}
