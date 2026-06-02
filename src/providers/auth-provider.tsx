import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { User } from '@/@types/user';
import type { ConfirmAccountRequest } from '@/api/auth/confirm-account';
import { confirmAccount as confirmAccountApi } from '@/api/auth/confirm-account';
import type { ExchangePasswordForTokenRequest } from '@/api/auth/exchange-password-for-token';
import { exchangePasswordForToken as exchangePasswordForTokenApi } from '@/api/auth/exchange-password-for-token';
import {
  forgotPassword as forgotPasswordApi,
  type ForgotPasswordRequest,
} from '@/api/auth/forgot-password';
import { signIn as signInApi, type SignInRequest } from '@/api/auth/sign-in';
import { signOut as signOutApi } from '@/api/auth/sign-out';
import type { SignUpRequest } from '@/api/auth/sign-up';
import { signUp as signUpApi } from '@/api/auth/sign-up';
import { getProfile } from '@/api/user/get-profile';
import { ToastError } from '@/components/toast-error';
import { AuthContext, type AuthContextData } from '@/contexts/auth-context';

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Valida a sessão no mount: tenta buscar o perfil usando o cookie existente.
  // Se o cookie expirou, o interceptor do axios tenta o refresh automaticamente.
  // Se tudo falhar, o usuário fica como null (não autenticado).
  useEffect(() => {
    getProfile()
      .then((userData) => setUser(userData))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

  // Escuta o evento disparado pelo interceptor do axios quando o refresh falha
  useEffect(() => {
    function handleUnauthorized() {
      setUser(null);
    }

    window.addEventListener('auth:unauthorized', handleUnauthorized);
    return () => {
      window.removeEventListener('auth:unauthorized', handleUnauthorized);
    };
  }, []);

  const isAuthenticated = !!user;

  const signInMutation = useMutation({
    mutationFn: async ({ email, password }: SignInRequest) => {
      await signInApi({ email, password });
      const userData = await getProfile();
      return userData;
    },
    onSuccess: (userData) => {
      setUser(userData);
    },
    onError: (error) => {
      ToastError(error);
    },
  });

  async function signIn(email: string, password: string) {
    await signInMutation.mutateAsync({ email, password });
  }

  const signUpMutation = useMutation({
    mutationFn: ({
      cnpj,
      companyName,
      userName,
      email,
      password,
    }: SignUpRequest) =>
      signUpApi({ cnpj, companyName, userName, email, password }),
    onSuccess: () => {
      toast.success('Email de verificação enviado com sucesso');
    },
    onError: (error) => {
      ToastError(error);
    },
  });

  async function signUp(
    cnpj: string,
    companyName: string,
    userName: string,
    email: string,
    password: string,
  ) {
    await signUpMutation.mutateAsync({
      cnpj,
      companyName,
      userName,
      email,
      password,
    });
  }

  const confirmAccountMutation = useMutation({
    mutationFn: ({ token }: ConfirmAccountRequest) =>
      confirmAccountApi({ token }),
    onSuccess: () => {
      toast.success('Conta confirmada com sucesso');
    },
    onError: (error) => {
      ToastError(error);
    },
  });

  async function confirmAccount(token: string) {
    return await confirmAccountMutation.mutateAsync({ token });
  }

  const signOutMutation = useMutation({
    mutationFn: () => signOutApi(),
    onSuccess: () => {
      toast.success('Sessão encerrada com sucesso');
    },
    onError: (error) => {
      ToastError(error);
    },
  });

  async function signOut() {
    await signOutMutation.mutateAsync();
    setUser(null);
  }

  const forgotPasswordMutation = useMutation({
    mutationFn: ({ email }: ForgotPasswordRequest) =>
      forgotPasswordApi({ email }),
    onSuccess: () => {
      toast.success('E-mail de recuperação enviado com sucesso');
    },
    onError: (error) => {
      ToastError(error);
    },
  });

  async function forgotPassword(email: string) {
    await forgotPasswordMutation.mutateAsync({ email });
  }

  const exchangePasswordForTokenMutation = useMutation({
    mutationFn: ({ token, password }: ExchangePasswordForTokenRequest) =>
      exchangePasswordForTokenApi({ token, password }),
    onSuccess: () => {
      toast.success('Senha trocada com sucesso');
    },
    onError: (error) => {
      ToastError(error);
    },
  });

  async function exchangePasswordForToken(token: string, password: string) {
    await exchangePasswordForTokenMutation.mutateAsync({ token, password });
  }

  const value: AuthContextData = {
    user,
    isAuthenticated,
    isLoading,
    signIn: {
      signIn: signIn,
      signInMutation: signInMutation,
    },
    signUp: {
      signUp: signUp,
      signUpMutation: signUpMutation,
    },
    signOut: {
      signOut: signOut,
      signOutMutation: signOutMutation,
    },
    confirmAccount: {
      confirmAccount: confirmAccount,
      confirmAccountMutation: confirmAccountMutation,
    },
    forgotPassword: {
      forgotPassword: forgotPassword,
      forgotPasswordMutation: forgotPasswordMutation,
    },
    exchangePasswordForToken: {
      exchangePasswordForToken: exchangePasswordForToken,
      exchangePasswordForTokenMutation: exchangePasswordForTokenMutation,
    },
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
