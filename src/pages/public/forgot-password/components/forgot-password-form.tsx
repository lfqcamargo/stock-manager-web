import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

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

import type { ForgotPasswordFormData } from '../schemas/forgot-password-schema';
import { forgotPasswordSchema } from '../schemas/forgot-password-schema';

export function ForgotPasswordForm() {
  const {
    forgotPassword: { forgotPassword, forgotPasswordMutation },
  } = useAuth();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: ForgotPasswordFormData) {
    await forgotPassword(data.email);
    form.reset();
  }

  // Após sucesso, exibe mensagem de confirmação no lugar do form
  if (forgotPasswordMutation.isSuccess) {
    return (
      <div className="rounded-lg border border-border bg-muted/40 p-4 space-y-2">
        <p className="text-sm font-medium text-foreground">E-mail enviado</p>
        <p className="text-sm text-muted-foreground">
          Se esse endereço estiver cadastrado, você receberá um link para
          redefinir sua senha em breve. Verifique também a caixa de spam.
        </p>
        <Button variant="link" className="h-auto p-0 text-sm" asChild>
          <Link to="/sign-in">Voltar para o login</Link>
        </Button>
      </div>
    );
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

        <Button
          type="submit"
          disabled={forgotPasswordMutation.isPending || !form.formState.isValid}
          className="w-full"
          size="lg"
        >
          {forgotPasswordMutation.isPending ? 'Enviando...' : 'Enviar link'}
        </Button>
      </form>
    </Form>
  );
}
