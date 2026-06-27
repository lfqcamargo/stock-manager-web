import { api } from '@/lib/axios';

export async function deleteLocation(id: string): Promise<void> {
  await api.delete(`/locations/${id}`);
}
