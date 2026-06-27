import { api } from '@/lib/axios';

export interface CreateShelfRequest {
  code: string;
  name: string;
  description?: string;
}

export async function createShelf(data: CreateShelfRequest): Promise<void> {
  await api.post('/shelfs', data);
}
