import { api } from '@/lib/axios';

export interface EditGroupRequest {
  id: string;
  code: string;
  name: string;
  description?: string;
  active: boolean;
}

export async function editGroup({
  id,
  code,
  name,
  description,
  active,
}: EditGroupRequest): Promise<void> {
  await api.put(`/groups/${id}`, {
    code,
    name,
    description,
    active,
  });
}
