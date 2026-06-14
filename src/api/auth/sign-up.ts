import { api } from '@/lib/axios';

export interface SignUpRequest {
  companyName: string;
  companyCnpj: string;
  userName: string;
  userEmail: string;
  userPassword: string;
}

type SignUpResponse = void;

export async function signUp({
  companyName,
  companyCnpj,
  userName,
  userEmail,
  userPassword,
}: SignUpRequest): Promise<SignUpResponse> {
  await api.post('/auth/create-temp-company', {
    companyName,
    companyCnpj,
    userName,
    userEmail,
    userPassword,
  });
}
