export interface Movement {
  id: string;
  materialId: string;
  material: {
    id: string;
    code: string;
    name: string;
  };
  addressingId: string;
  addressing: {
    id: string;
    location: { id: string; name: string };
    subLocation: { id: string; name: string };
    row: { id: string; name: string };
    shelf: { id: string; name: string };
    position: { id: string; name: string };
  };
  movementTypeId: string;
  movementType: {
    id: string;
    name: string;
    direction: 'IN' | 'OUT';
  };
  quantity: number;
  date: string;
  observation?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface GetMovementsResponse {
  movements: Movement[];
  meta: {
    totalItems: number;
    totalPages: number;
    itemsPerPage: number;
  };
}

export async function fetchMovements(
  _page: number = 0,
  _limit: number = 20,
  _params?: {
    orderBy?: string;
    orderDirection?: 'asc' | 'desc';
    materialId?: string;
    movementTypeId?: string;
  },
): Promise<GetMovementsResponse> {
  // Mock implementation
  return {
    movements: [
      {
        id: '1',
        materialId: '1',
        material: {
          id: '1',
          code: 'MAT001',
          name: 'Mouse Wireless',
        },
        addressingId: '1',
        addressing: {
          id: '1',
          location: { id: '1', name: 'Armazém Principal' },
          subLocation: { id: '1', name: 'Corredor A' },
          row: { id: '1', name: 'Fileira 1' },
          shelf: { id: '1', name: 'Prateleira 1' },
          position: { id: '1', name: 'Posição 1' },
        },
        movementTypeId: '1',
        movementType: {
          id: '1',
          name: 'Compra',
          direction: 'IN',
        },
        quantity: 50,
        date: new Date().toISOString(),
        observation: 'Compra de materiais',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
      {
        id: '2',
        materialId: '2',
        material: {
          id: '2',
          code: 'MAT002',
          name: 'Teclado Mecânico',
        },
        addressingId: '2',
        addressing: {
          id: '2',
          location: { id: '1', name: 'Armazém Principal' },
          subLocation: { id: '1', name: 'Corredor A' },
          row: { id: '1', name: 'Fileira 1' },
          shelf: { id: '1', name: 'Prateleira 1' },
          position: { id: '2', name: 'Posição 2' },
        },
        movementTypeId: '2',
        movementType: {
          id: '2',
          name: 'Venda',
          direction: 'OUT',
        },
        quantity: 10,
        date: new Date().toISOString(),
        observation: 'Venda para cliente',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ],
    meta: {
      totalItems: 2,
      totalPages: 1,
      itemsPerPage: 20,
    },
  };
}
