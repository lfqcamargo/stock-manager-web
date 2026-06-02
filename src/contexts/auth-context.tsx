import type { UseMutationResult } from '@tanstack/react-query';
import { createContext } from 'react';

import type { User } from '@/@types/user';
import type {
  ConfirmAccountRequest,
  ConfirmAccountResponse,
} from '@/api/auth/confirm-account';
import type { ExchangePasswordForTokenRequest } from '@/api/auth/exchange-password-for-token';
import type { ForgotPasswordRequest } from '@/api/auth/forgot-password';
import type { SignInRequest } from '@/api/auth/sign-in';
import type { SignUpRequest } from '@/api/auth/sign-up';

export interface AuthContextData {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: User | null;
  signIn: {
    signIn: (email: string, password: string) => Promise<void>;
    signInMutation: UseMutationResult<User, unknown, SignInRequest>;
  };
  signUp: {
    signUp: (
      cnpj: string,
      companyName: string,
      userName: string,
      email: string,
      password: string,
    ) => Promise<void>;
    signUpMutation: UseMutationResult<void, unknown, SignUpRequest>;
  };
  confirmAccount: {
    confirmAccount: (token: string) => Promise<ConfirmAccountResponse>;
    confirmAccountMutation: UseMutationResult<
      ConfirmAccountResponse,
      unknown,
      ConfirmAccountRequest
    >;
  };
  signOut: {
    signOut: () => Promise<void>;
    signOutMutation: UseMutationResult<void, unknown, void>;
  };
  forgotPassword: {
    forgotPassword: (email: string) => Promise<void>;
    forgotPasswordMutation: UseMutationResult<
      void,
      unknown,
      ForgotPasswordRequest
    >;
  };
  exchangePasswordForToken: {
    exchangePasswordForToken: (
      token: string,
      password: string,
    ) => Promise<void>;
    exchangePasswordForTokenMutation: UseMutationResult<
      void,
      unknown,
      ExchangePasswordForTokenRequest
    >;
  };
}

export const AuthContext = createContext<AuthContextData>(
  {} as AuthContextData,
);
