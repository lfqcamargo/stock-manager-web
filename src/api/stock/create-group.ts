import { api } from '@/lib/axios';

export interface CreateGroupRequest {
  code: string;
  name: string;
  description?: string;
  active: boolean;
  photoUrl?: string | null;
}

export async function createGroup({
  code,
  name,
  description,
  active,
  photoUrl,
}: CreateGroupRequest): Promise<void> {
  await api.post('/groups', {
    code,
    name,
    description,
    active,
    photoUrl,
  });
}
