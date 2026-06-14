import { api } from '@/lib/axios';

export interface ForgotPasswordRequest {
  email: string;
}

export type ForgotPasswordResponse = void;

export async function forgotPassword({
  email,
}: ForgotPasswordRequest): Promise<ForgotPasswordResponse> {
  await api.post(`/auth/generate-new-password-token`, { email });
}
