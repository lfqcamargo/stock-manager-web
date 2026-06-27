import { api } from '@/lib/axios';

export interface Movement {
  id: string;
  addressingId: string;
  movementTypeId: string;
  userId: string;
  quantity: number;
  date: string;
  observation: string | null;
  createdAt: string;
}

export interface FetchMovementsResponse {
  movements: Movement[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    currentPage: number;
  };
}

export async function fetchMovements({
  page = 0,
  limit = 20,
  addressingId,
  movementTypeId,
  userId,
  dateFrom,
  dateTo,
  minQuantity,
  maxQuantity,
  orderBy,
  orderDirection,
}: {
  page?: number;
  limit?: number;
  addressingId?: string;
  movementTypeId?: string;
  userId?: string;
  dateFrom?: string;
  dateTo?: string;
  minQuantity?: number;
  maxQuantity?: number;
  orderBy?: string;
  orderDirection?: string;
}): Promise<FetchMovementsResponse> {
  const response = await api.get<FetchMovementsResponse>('/movements', {
    params: {
      page: page + 1,
      itemsPerPage: limit,
      addressingId,
      movementTypeId,
      userId,
      dateFrom,
      dateTo,
      minQuantity,
      maxQuantity,
      orderBy,
      orderDirection,
    },
  });
  return response.data;
}
