import { api } from '@/lib/axios';

export interface EditAddressingRequest {
  id: string;
  active: boolean;
  materialId: string | null;
}

export async function editAddressing({
  id,
  active,
  materialId,
}: EditAddressingRequest): Promise<void> {
  await api.put(`/addressings/${id}`, { active, materialId });
}
