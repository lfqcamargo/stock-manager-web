import { api } from '@/lib/axios';

export interface CreateMovementTypeRequest {
  name: string;
  direction: 'IN' | 'OUT';
}

export async function createMovementType(
  data: CreateMovementTypeRequest,
): Promise<void> {
  await api.post('/movement-types', data);
}
