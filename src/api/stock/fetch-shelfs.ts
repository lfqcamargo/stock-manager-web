export interface Shelf {
  id: string;
  code: string;
  name: string;
  rowId: string;
  rowName: string;
  description?: string;
  active: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface FetchShelfsResponse {
  shelfs: Shelf[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    totalActiveShelfs: number;
    lastCreated?: string;
  };
}

// Mock data
const MOCK_SHELFS: Shelf[] = [
  {
    id: '1',
    code: 'SHELF-001',
    name: 'Prateleira 1',
    rowId: '1',
    rowName: 'Linha 1',
    description: 'Primeira prateleira da Linha 1',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    code: 'SHELF-002',
    name: 'Prateleira 2',
    rowId: '1',
    rowName: 'Linha 1',
    description: 'Segunda prateleira da Linha 1',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export async function fetchShelfs({
  page = 0,
  limit = 20,
  rowId,
  name,
  description,
  orderBy,
  orderDirection,
}: {
  page?: number;
  limit?: number;
  rowId?: string;
  name?: string;
  description?: string;
  orderBy?: string;
  orderDirection?: string;
}): Promise<FetchShelfsResponse> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return {
    shelfs: MOCK_SHELFS,
    meta: {
      totalItems: MOCK_SHELFS.length,
      totalPages: 1,
      itemsPerPage: limit,
      totalActiveShelfs: MOCK_SHELFS.filter((s) => s.active).length,
      lastCreated: MOCK_SHELFS[0]?.createdAt,
    },
  };
}
