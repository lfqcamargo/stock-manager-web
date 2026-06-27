import { api } from '@/lib/axios';

export interface EditShelfRequest {
  id: string;
  code: string;
  name: string;
  description?: string | null;
}

export async function editShelf({
  id,
  code,
  name,
  description,
}: EditShelfRequest): Promise<void> {
  await api.put(`/shelfs/${id}`, {
    code,
    name,
    description: description ?? null,
  });
}
