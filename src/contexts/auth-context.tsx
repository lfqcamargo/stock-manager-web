import type { UseMutationResult } from '@tanstack/react-query';
import { createContext } from 'react';

import type { User } from '@/@types/user';
import type {
  ConfirmAccountRequest,
  ConfirmAccountResponse,
} from '@/api/auth/confirm-account-company';
import type {
  ExchangePasswordForTokenRequest,
  ExchangePasswordForTokenResponse,
} from '@/api/auth/exchange-password-for-token';
import type { ForgotPasswordRequest } from '@/api/auth/forgot-password';
import type { SignInRequest } from '@/api/auth/sign-in';
import type { SignUpRequest } from '@/api/auth/sign-up';

export interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signInMutation: UseMutationResult<User, unknown, SignInRequest>;
  signUpMutation: UseMutationResult<void, unknown, SignUpRequest>;
  signOutMutation: UseMutationResult<void, unknown, void>;
  confirmAccountMutation: UseMutationResult<
    ConfirmAccountResponse,
    unknown,
    ConfirmAccountRequest
  >;
  forgotPasswordMutation: UseMutationResult<
    void,
    unknown,
    ForgotPasswordRequest
  >;
  exchangePasswordForTokenMutation: UseMutationResult<
    ExchangePasswordForTokenResponse,
    unknown,
    ExchangePasswordForTokenRequest
  >;
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);
