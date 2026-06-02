import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Loader2, Mail } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

import {
  type ForgotPasswordFormData,
  forgotPasswordSchema,
} from '../schemas/validations';

export function ForgotPasswordForm() {
  const { forgotPassword } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  async function handleForgotPassword(data: ForgotPasswordFormData) {
    await forgotPassword.forgotPassword(data.email);
  }

  function onFormSubmit(data: ForgotPasswordFormData) {
    void handleForgotPassword(data);
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(onFormSubmit)(e)}
      className="space-y-4 md:space-y-6"
    >
      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground text-sm font-medium">
          E-mail
        </Label>
        <div className="relative">
          <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform md:h-5 md:w-5" />
          <Input
            type="email"
            id="email"
            className="h-10 pl-9 text-sm md:h-11 md:pl-10 md:text-base"
            placeholder="seu@email.com"
            disabled={isSubmitting}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-destructive mb-2 pl-1 text-sm">
            {errors.email.message}
          </p>
        )}
      </div>

      {/* Info */}
      <div className="bg-chart-1/10 border-chart-1/20 rounded-xl border p-4">
        <p className="text-chart-1/80 text-xs md:text-sm">
          <strong>Dica:</strong> Verifique sua caixa de entrada e pasta de spam.
          O link expira em 24 horas.
        </p>
      </div>

      {/* Send Button */}
      <Button
        type="submit"
        className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-full rounded-xl text-sm font-medium shadow-lg transition-all duration-200 hover:shadow-xl md:h-11 md:text-base"
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Enviando...
          </>
        ) : (
          'Enviar link de recuperação'
        )}
      </Button>

      {/* Divider */}
      <div className="relative my-4 md:my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-card text-muted-foreground px-2">ou</span>
        </div>
      </div>

      {/* Back to Sign In */}
      <div className="text-center">
        <Link
          to="/"
          className="text-primary hover:text-primary/80 inline-flex items-center text-sm font-medium transition-colors md:text-base"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Voltar para o login
        </Link>
      </div>
    </form>
  );
}
