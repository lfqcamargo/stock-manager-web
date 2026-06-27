import { api } from '@/lib/axios';

import type { Location } from './fetch-locations';

export async function findLocationById(id: string): Promise<Location> {
  const response = await api.get<Location>(`/locations/${id}`);
  return response.data;
}
