import { api } from '@/lib/axios';

import type { Movement } from './fetch-movements';

export async function findMovementById(id: string): Promise<Movement> {
  const response = await api.get<Movement>(`/movements/${id}`);
  return response.data;
}
