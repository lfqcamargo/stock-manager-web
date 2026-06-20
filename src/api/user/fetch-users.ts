import type { User } from '@/@types/user';
import { api } from '@/lib/axios';

export interface FetchUsersQueryParams {
  page?: number;
  itemsPerPage?: number;
  email?: string;
  name?: string;
  role?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  active?: string;
  createdAtStart?: string;
  createdAtEnd?: string;
  deletedAt?: string;
  orderBy?: 'name' | 'email' | 'role' | 'active' | 'createdAt';
  orderDirection?: 'asc' | 'desc';
}

export interface FetchUsersResponse {
  users: User[];
  meta: {
    page: number;
    itemsPerPage: number;
    totalItems: number;
    totalPages: number;
  };
}

export async function fetchUsers(
  params?: FetchUsersQueryParams,
): Promise<FetchUsersResponse> {
  const response = await api.get<FetchUsersResponse>('/users', {
    params,
  });
  return response.data;
}
