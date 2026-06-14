export interface MovementType {
  id: string;
  name: string;
  direction: 'IN' | 'OUT';
  createdAt: string;
  updatedAt: string;
}

export interface GetMovementTypesResponse {
  movementTypes: MovementType[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
    totalInboundTypes: number;
    totalOutboundTypes: number;
  };
}

export async function fetchMovementTypes(
  _page: number = 0,
  _limit: number = 20,
  _params?: {
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    name?: string;
    direction?: 'IN' | 'OUT';
  },
): Promise<GetMovementTypesResponse> {
  // Mock implementation
  return {
    movementTypes: [
      {
        id: '1',
        name: 'Compra',
        direction: 'IN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        name: 'Venda',
        direction: 'OUT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '3',
        name: 'Devolução',
        direction: 'IN',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '4',
        name: 'Transferência',
        direction: 'OUT',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    meta: {
      totalItems: 4,
      totalPages: 1,
      itemsPerPage: 20,
      totalInboundTypes: 2,
      totalOutboundTypes: 2,
    },
  };
}
