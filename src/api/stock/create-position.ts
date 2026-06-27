import { api } from '@/lib/axios';

export interface CreatePositionRequest {
  code: string;
  name: string;
  description?: string;
}

export async function createPosition(
  data: CreatePositionRequest,
): Promise<void> {
  await api.post('/positions', data);
}
