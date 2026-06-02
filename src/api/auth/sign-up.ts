import { api } from '@/lib/axios';

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
}

type SignUpResponse = void;

export async function signUp({
  name,
  email,
  password,
}: SignUpRequest): Promise<SignUpResponse> {
  await api.post('/auth/create-temp-user', {
    name,
    email,
    password,
  });
}
