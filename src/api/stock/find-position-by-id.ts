import { api } from '@/lib/axios';

import type { Position } from './fetch-positions';

export async function findPositionById(id: string): Promise<Position> {
  const response = await api.get<Position>(`/positions/${id}`);
  return response.data;
}
