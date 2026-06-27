import { api } from '@/lib/axios';

export async function deleteMovementType(id: string): Promise<void> {
  await api.delete(`/movement-types/${id}`);
}
