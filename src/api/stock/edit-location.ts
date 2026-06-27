import { api } from '@/lib/axios';

export interface EditLocationRequest {
  id: string;
  code: string;
  name: string;
  description?: string | null;
}

export async function editLocation({
  id,
  code,
  name,
  description,
}: EditLocationRequest): Promise<void> {
  await api.put(`/locations/${id}`, {
    code,
    name,
    description: description ?? null,
  });
}
