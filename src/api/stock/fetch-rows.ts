import { api } from '@/lib/axios';

export interface Row {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface FetchRowsResponse {
  rows: Row[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    currentPage: number;
  };
}

export async function fetchRows({
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
}): Promise<FetchRowsResponse> {
  const response = await api.get<FetchRowsResponse>('/rows', {
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
