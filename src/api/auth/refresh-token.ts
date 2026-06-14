import { api } from '@/lib/axios';

export async function refreshToken(): Promise<void> {
  await api.post('/auth/session/refresh');
}
