import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useAuth } from '@/hooks/use-auth';

import { PasswordInput } from '../../sign-up/components/password-input';
import type { SignInFormData } from '../schemas/sign-in-schema';
import { signInSchema } from '../schemas/sign-in-schema';

export function SignInForm() {
  const { signIn } = useAuth();
  const [searchParams] = useSearchParams();

  const emailFromUrl = searchParams.get('email') ?? '';

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      email: emailFromUrl,
      password: '',
    },
  });

  async function onSubmit(data: SignInFormData) {
    await signIn.signInMutation.mutateAsync({
      email: data.email,
      password: data.password,
    });
    // O redirecionamento é automático: quando setUser() é chamado no onSuccess
    // do mutation, isAuthenticated vira true e o Routes troca para AppRoutes.
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input type="email" placeholder="seu@email.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-center justify-between">
                <FormLabel>Senha</FormLabel>
                <Button variant="link" className="h-auto p-0 text-xs" asChild>
                  <Link to="/forgot-password">Esqueceu a senha?</Link>
                </Button>
              </div>
              <FormControl>
                <PasswordInput placeholder="Digite sua senha" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={form.formState.isSubmitting || !form.formState.isValid}
          className="w-full"
          size="lg"
        >
          {form.formState.isSubmitting ? 'Entrando...' : 'Entrar'}
        </Button>
      </form>
    </Form>
  );
}
