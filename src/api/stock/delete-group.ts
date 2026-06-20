import { api } from '@/lib/axios';

export async function deleteGroup(id: string): Promise<void> {
  await api.delete(`/groups/${id}`);
}
