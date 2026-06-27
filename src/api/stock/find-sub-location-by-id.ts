import { api } from '@/lib/axios';

import type { SubLocation } from './fetch-sub-locations';

export async function findSubLocationById(id: string): Promise<SubLocation> {
  const response = await api.get<SubLocation>(`/sub-locations/${id}`);
  return response.data;
}
