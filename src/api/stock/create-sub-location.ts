import { api } from '@/lib/axios';

export interface CreateSubLocationRequest {
  code: string;
  name: string;
  locationId: string;
  description?: string;
}

export async function createSubLocation(
  data: CreateSubLocationRequest,
): Promise<void> {
  await api.post('/sub-locations', data);
}
