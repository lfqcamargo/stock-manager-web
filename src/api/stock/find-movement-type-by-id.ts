import { api } from '@/lib/axios';

import type { MovementType } from './fetch-movement-types';

export async function findMovementTypeById(id: string): Promise<MovementType> {
  const response = await api.get<MovementType>(`/movement-types/${id}`);
  return response.data;
}
