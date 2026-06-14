export interface Location {
  id: string;
  code: string;
  name: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FetchLocationsResponse {
  locations: Location[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    totalActiveLocations: number;
    lastCreated?: string;
  };
}

// Mock data
const MOCK_LOCATIONS: Location[] = [
  {
    id: '1',
    code: 'LOC-001',
    name: 'Armazém Principal',
    description: 'Armazém principal da empresa',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    code: 'LOC-002',
    name: 'Armazém Secundário',
    description: 'Armazém para materiais menos usados',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function fetchLocations({
  page = 0,
  limit = 20,
  orderBy,
  orderDirection,
  search,
  active,
}: {
  page?: number;
  limit?: number;
  orderBy?: string;
  orderDirection?: string;
  search?: string;
  active?: boolean;
}): Promise<FetchLocationsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    locations: MOCK_LOCATIONS,
    meta: {
      totalItems: MOCK_LOCATIONS.length,
      totalPages: 1,
      itemsPerPage: limit,
      totalActiveLocations: MOCK_LOCATIONS.filter((l) => l.active).length,
      lastCreated: MOCK_LOCATIONS[0]?.createdAt,
    },
  };
}
