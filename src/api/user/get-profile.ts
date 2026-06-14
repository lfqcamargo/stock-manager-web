import type { User } from '@/@types/user';
import { api } from '@/lib/axios';

export interface GetProfileResponse {
  user: User;
}

export async function getProfile(): Promise<User> {
  const response = await api.get<GetProfileResponse>('/users/me');
  return response.data.user;
}
