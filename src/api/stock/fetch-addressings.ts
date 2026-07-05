import { api } from '@/lib/axios';

export interface AddressingLocation {
  id: string;
  code: string;
  name: string;
  description?: string;
}

export interface Addressing {
  id: string;
  amount: number;
  active: boolean;
  location: AddressingLocation;
  subLocation: AddressingLocation;
  row: AddressingLocation;
  shelf: AddressingLocation;
  position: AddressingLocation;
  material: {
    id: string;
    code: string;
    name: string;
    description?: string;
    unit: string;
    active: boolean;
    photoUrl?: string | null;
    groupId: string;
  } | null;
}

export interface FetchAddressingsResponse {
  addressings: Addressing[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    currentPage: number;
  };
}

export async function fetchAddressings({
  page = 0,
  limit = 20,
  locationId,
  subLocationId,
  rowId,
  shelfId,
  positionId,
  materialId,
  active,
  minAmount,
  maxAmount,
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
  active?: boolean;
  minAmount?: number;
  maxAmount?: number;
  orderBy?: string;
  orderDirection?: string;
}): Promise<FetchAddressingsResponse> {
  const response = await api.get<FetchAddressingsResponse>('/addressings', {
    params: {
      page: page + 1,
      itemsPerPage: limit,
      locationId,
      subLocationId,
      rowId,
      shelfId,
      positionId,
      materialId,
      active,
      minAmount,
      maxAmount,
      orderBy,
      orderDirection,
    },
  });
  return response.data;
}
