import { api } from '@/lib/axios';

export interface EditRowRequest {
  id: string;
  code: string;
  name: string;
  description?: string | null;
}

export async function editRow({
  id,
  code,
  name,
  description,
}: EditRowRequest): Promise<void> {
  await api.put(`/rows/${id}`, {
    code,
    name,
    description: description ?? null,
  });
}
