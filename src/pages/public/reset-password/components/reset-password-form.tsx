import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useAuth } from '@/hooks/use-auth';
import { PasswordInput } from '@/pages/public/sign-up/components/password-input';

import type { ResetPasswordFormData } from '../schemas/reset-password-schema';
import { resetPasswordSchema } from '../schemas/reset-password-schema';

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const {
    exchangePasswordForToken: {
      exchangePasswordForToken,
      exchangePasswordForTokenMutation,
    },
  } = useAuth();
  const navigate = useNavigate();

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  async function onSubmit(data: ResetPasswordFormData) {
    try {
      await exchangePasswordForToken(token, data.password);
    } catch {
      return;
    }
    void navigate('/sign-in', { replace: true });
  }

  return (
    <Form {...form}>
      <form
        onSubmit={(e) => void form.handleSubmit(onSubmit)(e)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova senha</FormLabel>
              <FormControl>
                <PasswordInput placeholder="Mínimo 6 caracteres" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar nova senha</FormLabel>
              <FormControl>
                <PasswordInput
                  placeholder="Digite a senha novamente"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button
          type="submit"
          disabled={
            exchangePasswordForTokenMutation.isPending ||
            !form.formState.isValid
          }
          className="w-full"
          size="lg"
        >
          {exchangePasswordForTokenMutation.isPending
            ? 'Salvando...'
            : 'Salvar nova senha'}
        </Button>

        <Button variant="ghost" className="w-full" asChild>
          <Link to="/sign-in">Cancelar</Link>
        </Button>
      </form>
    </Form>
  );
}
