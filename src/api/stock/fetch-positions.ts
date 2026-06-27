import { api } from '@/lib/axios';

export interface Position {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface FetchPositionsResponse {
  positions: Position[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    currentPage: number;
  };
}

export async function fetchPositions({
  page = 0,
  limit = 20,
  name,
  code,
  description,
  orderBy,
  orderDirection,
}: {
  page?: number;
  limit?: number;
  name?: string;
  code?: string;
  description?: string;
  orderBy?: string;
  orderDirection?: string;
}): Promise<FetchPositionsResponse> {
  const response = await api.get<FetchPositionsResponse>('/positions', {
    params: {
      page: page + 1,
      itemsPerPage: limit,
      name,
      code,
      description,
      orderBy,
      orderDirection,
    },
  });
  return response.data;
}
