export interface Row {
  id: string;
  code: string;
  name: string;
  subLocationId: string;
  subLocationName: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FetchRowsResponse {
  rows: Row[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    totalActiveRows: number;
    lastCreated?: string;
  };
}

// Mock data
const MOCK_ROWS: Row[] = [
  {
    id: '1',
    code: 'ROW-001',
    name: 'Linha 1',
    subLocationId: '1',
    subLocationName: 'Zona A',
    description: 'Primeira linha da Zona A',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    code: 'ROW-002',
    name: 'Linha 2',
    subLocationId: '1',
    subLocationName: 'Zona A',
    description: 'Segunda linha da Zona A',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function fetchRows({
  page = 0,
  limit = 20,
  subLocationId,
  name,
  description,
  orderBy,
  orderDirection,
}: {
  page?: number;
  limit?: number;
  subLocationId?: string;
  name?: string;
  description?: string;
  orderBy?: string;
  orderDirection?: string;
}): Promise<FetchRowsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    rows: MOCK_ROWS,
    meta: {
      totalItems: MOCK_ROWS.length,
      totalPages: 1,
      itemsPerPage: limit,
      totalActiveRows: MOCK_ROWS.filter((r) => r.active).length,
      lastCreated: MOCK_ROWS[0]?.createdAt,
    },
  };
}
