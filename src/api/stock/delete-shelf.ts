import { api } from '@/lib/axios';

export async function deleteShelf(id: string): Promise<void> {
  await api.delete(`/shelfs/${id}`);
}
