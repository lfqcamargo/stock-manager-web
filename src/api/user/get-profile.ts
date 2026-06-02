import { api } from '@/lib/axios';

export interface GetProfileResponse {
  id: string;
  name: string;
  email: string;
  photoId?: string | null;
  createdAt: string;
  lastLogin: string | null;
}

export async function getProfile(): Promise<GetProfileResponse> {
  const response = await api.get('/users/me');
  return response.data;
}
