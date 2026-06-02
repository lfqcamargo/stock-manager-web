import { api } from '@/lib/axios';

export interface ExchangePasswordForTokenRequest {
  token: string;
  password: string;
}

export type ExchangePasswordForTokenResponse = void;

export async function exchangePasswordForToken({
  token,
  password,
}: ExchangePasswordForTokenRequest): Promise<void> {
  const response = await api.post<ExchangePasswordForTokenResponse>(
    `/auth/exchange-password-token/${token}`,
    {
      password,
    },
  );

  return response.data;
}
