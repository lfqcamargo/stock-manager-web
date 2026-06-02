import { api } from '@/lib/axios';

export interface SignUpRequest {
  cnpj: string;
  companyName: string;
  userName: string;
  email: string;
  password: string;
}

type SignUpResponse = void;

export async function signUp({
  cnpj,
  companyName,
  userName,
  email,
  password,
}: SignUpRequest): Promise<SignUpResponse> {
  await api.post('/auth/create-temp-user', {
    cnpj,
    companyName,
    userName,
    email,
    password,
  });
}
