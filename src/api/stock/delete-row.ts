import { api } from '@/lib/axios';

export async function deleteRow(id: string): Promise<void> {
  await api.delete(`/rows/${id}`);
}
