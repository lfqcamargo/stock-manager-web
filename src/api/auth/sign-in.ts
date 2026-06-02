import { api } from '@/lib/axios';

export interface SignInRequest {
  email: string;
  password: string;
}

export async function signIn({
  email,
  password,
}: SignInRequest): Promise<void> {
  await api.post('/session', { email, password });
}
