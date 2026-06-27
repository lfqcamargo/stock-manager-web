import { api } from '@/lib/axios';

export async function deletePosition(id: string): Promise<void> {
  await api.delete(`/positions/${id}`);
}
