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
  photoUrl?: string;
}

export interface GetMaterialsResponse {
  materials: MaterialDetails[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    totalActiveMaterials: number;
    itemCount: number;
    currentPage: number;
    lastCreated?: string;
  };
}

export async function fetchMaterials(
  page: number = 0,
  limit: number = 20,
  params?: {
    orderBy?: 'name' | 'code' | 'unit' | 'active' | 'groupId';
    orderDirection?: 'asc' | 'desc';
    groupId?: string;
    code?: string;
    name?: string;
    description?: string;
    active?: boolean;
  },
): Promise<GetMaterialsResponse> {
  const response = await api.get<GetMaterialsResponse>('/materials', {
    params: {
      page: page + 1,
      itemsPerPage: limit,
      ...params,
    },
  });
  return response.data;
}

export async function fetchMaterialById(id: string): Promise<MaterialDetails> {
  const response = await api.get<MaterialDetails>(`/materials/${id}`);
  return response.data;
}
