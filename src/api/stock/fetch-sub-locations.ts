import { api } from '@/lib/axios';

export interface SubLocation {
  id: string;
  code: string;
  name: string;
  description?: string;
  locationId: string;
  location?: {
    id: string;
    code: string;
    name: string;
    description?: string;
  };
}

export interface FetchSubLocationsResponse {
  subLocations: SubLocation[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    currentPage: number;
  };
}

export async function fetchSubLocations({
  page = 0,
  limit = 20,
  locationId,
  name,
  code,
  description,
  orderBy,
  orderDirection,
}: {
  page?: number;
  limit?: number;
  locationId?: string;
  name?: string;
  code?: string;
  description?: string;
  orderBy?: string;
  orderDirection?: string;
}): Promise<FetchSubLocationsResponse> {
  const response = await api.get<FetchSubLocationsResponse>('/sub-locations', {
    params: {
      page: page + 1,
      itemsPerPage: limit,
      locationId,
      name,
      code,
      description,
      orderBy,
      orderDirection,
    },
  });
  return response.data;
}
