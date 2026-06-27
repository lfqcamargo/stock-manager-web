import { api } from '@/lib/axios';

import type { Shelf } from './fetch-shelfs';

export async function findShelfById(id: string): Promise<Shelf> {
  const response = await api.get<Shelf>(`/shelfs/${id}`);
  return response.data;
}
