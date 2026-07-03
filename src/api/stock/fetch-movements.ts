import { api } from '@/lib/axios';

export interface Movement {
  id: string;
  addressingId: string;
  movementTypeId: string;
  movementTypeName: string;
  movementTypeDirection: 'IN' | 'OUT';
  userId: string;
  userName: string;
  quantity: number;
  date: string;
  observation: string | null;
  createdAt: string;
  locationId: string;
  locationCode: string;
  locationName: string;
  subLocationId: string;
  subLocationCode: string;
  subLocationName: string;
  rowId: string;
  rowCode: string;
  rowName: string;
  shelfId: string;
  shelfCode: string;
  shelfName: string;
  positionId: string;
  positionCode: string;
  positionName: string;
  materialId: string;
  materialCode: string;
  materialName: string;
  materialDescription: string;
  materialUnit: string;
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
  locationId,
  subLocationId,
  rowId,
  shelfId,
  positionId,
  materialId,
  movementTypeId,
  direction,
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
  locationId?: string;
  subLocationId?: string;
  rowId?: string;
  shelfId?: string;
  positionId?: string;
  materialId?: string;
  movementTypeId?: string;
  direction?: 'IN' | 'OUT';
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
      locationId,
      subLocationId,
      rowId,
      shelfId,
      positionId,
      materialId,
      movementTypeId,
      direction,
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
