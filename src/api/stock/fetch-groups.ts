import { api } from '@/lib/axios';

export interface Group {
  id: string;
  code: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GetGroupsResponse {
  groups: Group[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    totalActiveGroups: number;
    totalEmptyGroups: number;
    lastCreated?: string;
  };
}

export async function fetchGroups(
  page: number = 0,
  limit: number = 20,
  params?: {
    orderBy?: keyof Group;
    orderDirection?: 'asc' | 'desc';
    search?: string;
    active?: boolean;
  },
): Promise<GetGroupsResponse> {
  const response = await api.get<GetGroupsResponse>('/stock/groups', {
    params: {
      page: page + 1,
      limit,
      ...params,
    },
  });
  return response.data;
}
