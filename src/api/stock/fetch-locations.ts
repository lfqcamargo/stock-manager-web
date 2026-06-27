import { api } from '@/lib/axios';

export interface Location {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface FetchLocationsResponse {
  locations: Location[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    currentPage: number;
  };
}

export async function fetchLocations({
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
}): Promise<FetchLocationsResponse> {
  const response = await api.get<FetchLocationsResponse>('/locations', {
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
