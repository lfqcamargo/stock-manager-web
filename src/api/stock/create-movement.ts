import { api } from '@/lib/axios';

import type { Movement } from './fetch-movements';

export interface CreateMovementRequest {
  addressingId: string;
  movementTypeId: string;
  quantity: number;
  date?: string;
  observation?: string;
}

export async function createMovement(
  data: CreateMovementRequest,
): Promise<Movement> {
  const response = await api.post<Movement>('/movements', data);
  return response.data;
}
