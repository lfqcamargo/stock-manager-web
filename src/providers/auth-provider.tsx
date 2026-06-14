import { useMutation } from '@tanstack/react-query';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

import type { User } from '@/@types/user';
import { confirmAccountCompany as confirmAccountApi } from '@/api/auth/confirm-account-company';
import { exchangePasswordForToken as exchangePasswordForTokenApi } from '@/api/auth/exchange-password-for-token';
import { forgotPassword as forgotPasswordApi } from '@/api/auth/forgot-password';
import { signIn as signInApi } from '@/api/auth/sign-in';
import { signOut as signOutApi } from '@/api/auth/sign-out';
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

  useEffect(() => {
    getProfile()
      .then((userData) => setUser(userData))
      .catch(() => setUser(null))
      .finally(() => setIsLoading(false));
  }, []);

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
    mutationFn: async (data: { email: string; password: string }) => {
      await signInApi(data);
      return await getProfile();
    },
    onSuccess: (userData) => {
      setUser(userData);
    },
    onError: (error) => {
      ToastError(error);
    },
  });

  const signUpMutation = useMutation({
    mutationFn: signUpApi,
    onSuccess: () => {
      toast.success('Empresa registrada, para confirmar verifique seu e-mail');
    },
    onError: (error) => {
      ToastError(error);
    },
  });

  const signOutMutation = useMutation({
    mutationFn: signOutApi,
    onSuccess: () => {
      setUser(null);
      toast.success('Sessão encerrada com sucesso');
    },
    onError: (error) => {
      ToastError(error);
    },
  });

  const confirmAccountMutation = useMutation({
    mutationFn: confirmAccountApi,
    onSuccess: () => {
      toast.success('Conta confirmada com sucesso');
    },
    onError: (error) => {
      ToastError(error);
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: forgotPasswordApi,
    onSuccess: () => {
      toast.success('E-mail de recuperação enviado com sucesso');
    },
    onError: (error) => {
      ToastError(error);
    },
  });

  const exchangePasswordForTokenMutation = useMutation({
    mutationFn: exchangePasswordForTokenApi,
    onSuccess: () => {
      toast.success(`Alterado a senha com sucesso`);
    },
    onError: (error) => {
      ToastError(error);
    },
  });

  const value: AuthContextData = {
    user,
    isAuthenticated,
    isLoading,
    signInMutation,
    signUpMutation,
    signOutMutation,
    confirmAccountMutation,
    forgotPasswordMutation,
    exchangePasswordForTokenMutation,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
