export interface Addressing {
  id: string;
  code: string;
  name: string;
  locationId: string;
  locationName: string;
  subLocationId: string;
  subLocationName: string;
  rowId: string;
  rowName: string;
  shelfId: string;
  shelfName: string;
  positionId: string;
  positionName: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
  amount?: number; // Optional for mock
  material?: {
    id: string;
    code: string;
    name: string;
  };
  location?: {
    id: string;
    name: string;
  };
  subLocation?: {
    id: string;
    name: string;
  };
  row?: {
    id: string;
    name: string;
  };
  shelf?: {
    id: string;
    name: string;
  };
  position?: {
    id: string;
    name: string;
  };
}

export interface FetchAddressingsResponse {
  addressings: Addressing[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    totalActiveAddressings: number;
    lastCreated?: string;
  };
}

// Mock data
const MOCK_ADDRESSINGS: Addressing[] = [
  {
    id: '1',
    code: 'ADDR-001',
    name: 'Endereço Principal',
    locationId: '1',
    locationName: 'Armazém Principal',
    location: { id: '1', name: 'Armazém Principal' },
    subLocationId: '1',
    subLocationName: 'Zona A',
    subLocation: { id: '1', name: 'Zona A' },
    rowId: '1',
    rowName: 'Linha 1',
    row: { id: '1', name: 'Linha 1' },
    shelfId: '1',
    shelfName: 'Prateleira 1',
    shelf: { id: '1', name: 'Prateleira 1' },
    positionId: '1',
    positionName: 'Posição 1',
    position: { id: '1', name: 'Posição 1' },
    description: 'Endereço principal para materiais',
    active: true,
    amount: 10,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function fetchAddressings({
  page = 0,
  limit = 20,
  locationId,
  subLocationId,
  rowId,
  shelfId,
  positionId,
  name,
  description,
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
  name?: string;
  description?: string;
  orderBy?: string;
  orderDirection?: string;
}): Promise<FetchAddressingsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    addressings: MOCK_ADDRESSINGS,
    meta: {
      totalItems: MOCK_ADDRESSINGS.length,
      totalPages: 1,
      itemsPerPage: limit,
      totalActiveAddressings: MOCK_ADDRESSINGS.filter((a) => a.active).length,
      lastCreated: MOCK_ADDRESSINGS[0]?.createdAt,
    },
  };
}
