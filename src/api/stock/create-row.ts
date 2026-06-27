import { api } from '@/lib/axios';

export interface CreateRowRequest {
  code: string;
  name: string;
  description?: string;
}

export async function createRow(data: CreateRowRequest): Promise<void> {
  await api.post('/rows', data);
}
