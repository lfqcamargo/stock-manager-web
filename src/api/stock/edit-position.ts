import { api } from '@/lib/axios';

export interface EditPositionRequest {
  id: string;
  code: string;
  name: string;
  description?: string | null;
}

export async function editPosition({
  id,
  code,
  name,
  description,
}: EditPositionRequest): Promise<void> {
  await api.put(`/positions/${id}`, {
    code,
    name,
    description: description ?? null,
  });
}
