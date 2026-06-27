import { api } from '@/lib/axios';

export async function deleteSubLocation(id: string): Promise<void> {
  await api.delete(`/sub-locations/${id}`);
}
