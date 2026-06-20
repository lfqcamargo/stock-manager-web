import { api } from '@/lib/axios';

export interface Group {
  id: string;
  code: string;
  name: string;
  description?: string;
  active: boolean;
}

export interface GetGroupsResponse {
  groups: Group[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    totalActiveGroups: number;
    totalEmptyGroups: number;
    currentPage: number;
    lastCreated?: string;
  };
}

export async function fetchGroups(
  page: number = 0,
  limit: number = 20,
  params?: {
    orderBy?: 'name' | 'description' | 'code' | 'active';
    orderDirection?: 'asc' | 'desc';
    code?: string;
    name?: string;
    description?: string;
    active?: boolean;
  },
): Promise<GetGroupsResponse> {
  const response = await api.get<GetGroupsResponse>('/groups', {
    params: {
      page: page + 1,
      itemsPerPage: limit,
      ...params,
    },
  });
  return response.data;
}
