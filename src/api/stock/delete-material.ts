import { api } from '@/lib/axios';

export async function deleteMaterial(id: string): Promise<void> {
  await api.delete(`/materials/${id}`);
}
