import { api } from '@/lib/axios';

export interface CreateGroupRequest {
  code: string;
  name: string;
  description?: string;
  active: boolean;
}

export async function createGroup({
  code,
  name,
  description,
  active,
}: CreateGroupRequest): Promise<void> {
  await api.post('/groups', {
    code,
    name,
    description,
    active,
  });
}
