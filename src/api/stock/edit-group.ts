import { api } from '@/lib/axios';

export interface EditGroupRequest {
  id: string;
  code: string;
  name: string;
  description?: string;
  active: boolean;
  photoUrl?: string | null;
}

export async function editGroup({
  id,
  code,
  name,
  description,
  active,
  photoUrl,
}: EditGroupRequest): Promise<void> {
  await api.put(`/groups/${id}`, {
    code,
    name,
    description,
    active,
    photoUrl,
  });
}
