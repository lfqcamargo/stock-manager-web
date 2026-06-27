import { api } from '@/lib/axios';

export async function deleteAddressing(id: string): Promise<void> {
  await api.delete(`/addressings/${id}`);
}
