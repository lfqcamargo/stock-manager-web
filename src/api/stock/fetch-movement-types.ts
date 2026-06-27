import { api } from '@/lib/axios';

export interface MovementType {
  id: string;
  name: string;
  direction: 'IN' | 'OUT';
}

export interface FetchMovementTypesResponse {
  movementTypes: MovementType[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    currentPage: number;
  };
}

export async function fetchMovementTypes({
  page = 0,
  limit = 20,
  name,
  direction,
  orderBy,
  orderDirection,
}: {
  page?: number;
  limit?: number;
  name?: string;
  direction?: 'IN' | 'OUT';
  orderBy?: string;
  orderDirection?: string;
}): Promise<FetchMovementTypesResponse> {
  const response = await api.get<FetchMovementTypesResponse>(
    '/movement-types',
    {
      params: {
        page: page + 1,
        itemsPerPage: limit,
        name,
        direction,
        orderBy,
        orderDirection,
      },
    },
  );
  return response.data;
}
