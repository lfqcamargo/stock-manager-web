import { api } from '@/lib/axios';

export interface Shelf {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface FetchShelfsResponse {
  shelfs: Shelf[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    currentPage: number;
  };
}

export async function fetchShelfs({
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
}): Promise<FetchShelfsResponse> {
  const response = await api.get<FetchShelfsResponse>('/shelfs', {
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
