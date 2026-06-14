import { api } from '@/lib/axios';

export interface ExchangePasswordForTokenRequest {
  token: string;
  password: string;
}

export interface ExchangePasswordForTokenResponse {
  email: string;
}

export async function exchangePasswordForToken({
  token,
  password,
}: ExchangePasswordForTokenRequest): Promise<ExchangePasswordForTokenResponse> {
  const response = await api.patch<ExchangePasswordForTokenResponse>(
    `/auth/exchange-password-for-token`,
    {
      token,
      password,
    },
  );

  return response.data;
}
