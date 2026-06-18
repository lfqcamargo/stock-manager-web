import { api } from '@/lib/axios';

export async function deleteUser(id: string): Promise<void> {
  await api.delete(`/users/${id}`);
}
