import { api } from '@/lib/axios';

export interface ConfirmAccountRequest {
  token: string;
}

export interface ConfirmAccountResponse {
  email: string;
}

export async function confirmAccountCompany({
  token,
}: ConfirmAccountRequest): Promise<ConfirmAccountResponse> {
  const response = await api.post<ConfirmAccountResponse>(
    `/auth/confirmation-create-user-by-token/${token}`,
  );

  return response.data;
}
