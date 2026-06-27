import { api } from '@/lib/axios';

export interface EditMovementTypeRequest {
  id: string;
  name: string;
  direction: 'IN' | 'OUT';
}

export async function editMovementType({
  id,
  name,
  direction,
}: EditMovementTypeRequest): Promise<void> {
  await api.put(`/movement-types/${id}`, { name, direction });
}
