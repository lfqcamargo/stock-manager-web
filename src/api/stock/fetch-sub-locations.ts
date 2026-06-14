export interface SubLocation {
  id: string;
  code: string;
  name: string;
  locationId: string;
  locationName: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FetchSubLocationsResponse {
  subLocations: SubLocation[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    totalActiveSubLocations: number;
    lastCreated?: string;
  };
}

// Mock data
const MOCK_SUB_LOCATIONS: SubLocation[] = [
  {
    id: '1',
    code: 'SUB-001',
    name: 'Zona A',
    locationId: '1',
    locationName: 'Armazém Principal',
    description: 'Zona A do armazém principal',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    code: 'SUB-002',
    name: 'Zona B',
    locationId: '1',
    locationName: 'Armazém Principal',
    description: 'Zona B do armazém principal',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function fetchSubLocations({
  page = 0,
  limit = 20,
  itemsPerPage,
  locationId,
  name,
  description,
  orderBy,
  orderDirection,
}: {
  page?: number;
  limit?: number;
  itemsPerPage?: number;
  locationId?: string;
  name?: string;
  description?: string;
  orderBy?: string;
  orderDirection?: string;
}): Promise<FetchSubLocationsResponse> {
  const actualLimit = itemsPerPage || limit;
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    subLocations: MOCK_SUB_LOCATIONS,
    meta: {
      totalItems: MOCK_SUB_LOCATIONS.length,
      totalPages: 1,
      itemsPerPage: limit,
      totalActiveSubLocations: MOCK_SUB_LOCATIONS.filter((s) => s.active)
        .length,
      lastCreated: MOCK_SUB_LOCATIONS[0]?.createdAt,
    },
  };
}
