import { api } from '@/lib/axios';

export interface CreateLocationRequest {
  code: string;
  name: string;
  description?: string;
}

export async function createLocation(
  data: CreateLocationRequest,
): Promise<void> {
  await api.post('/locations', data);
}
