export interface Position {
  id: string;
  code: string;
  name: string;
  shelfId: string;
  shelfName: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FetchPositionsResponse {
  positions: Position[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    totalActivePositions: number;
    lastCreated?: string;
  };
}

// Mock data
const MOCK_POSITIONS: Position[] = [
  {
    id: '1',
    code: 'POS-001',
    name: 'Posição 1',
    shelfId: '1',
    shelfName: 'Prateleira 1',
    description: 'Primeira posição da Prateleira 1',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    code: 'POS-002',
    name: 'Posição 2',
    shelfId: '1',
    shelfName: 'Prateleira 1',
    description: 'Segunda posição da Prateleira 1',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function fetchPositions({
  page = 0,
  limit = 20,
  shelfId,
  name,
  description,
  orderBy,
  orderDirection,
}: {
  page?: number;
  limit?: number;
  shelfId?: string;
  name?: string;
  description?: string;
  orderBy?: string;
  orderDirection?: string;
}): Promise<FetchPositionsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    positions: MOCK_POSITIONS,
    meta: {
      totalItems: MOCK_POSITIONS.length,
      totalPages: 1,
      itemsPerPage: limit,
      totalActivePositions: MOCK_POSITIONS.filter((p) => p.active).length,
      lastCreated: MOCK_POSITIONS[0]?.createdAt,
    },
  };
}
