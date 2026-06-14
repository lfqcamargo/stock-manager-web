import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Lock, Mail } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

import type { SignInFormData } from '../schemas/sign-in-schema';
import { signInSchema } from '../schemas/sign-in-schema';

export function SignInForm() {
  const { signInMutation } = useAuth();
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);

  const emailFromUrl = searchParams.get('email') ?? '';
  const isPending = signInMutation.isPending;

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    mode: 'onChange',
    defaultValues: {
      email: emailFromUrl,
      password: '',
    },
  });

  const [email, password] = useWatch({ control, name: ['email', 'password'] });
  const activeButton = Boolean(
    !isSubmitting && !isPending && email && password,
  );

  async function onFormSubmit(data: SignInFormData) {
    await signInMutation.mutateAsync({
      email: data.email,
      password: data.password,
    });
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(onFormSubmit)(e)}
      className="space-y-4 md:space-y-6"
    >
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground text-sm font-medium">
          E-mail
        </Label>
        <div className="relative">
          <Mail className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 md:h-5 md:w-5" />
          <Input
            type="email"
            id="email"
            className="h-10 pl-9 text-sm md:h-11 md:pl-10 md:text-base"
            placeholder="seu@email.com"
            disabled={isSubmitting}
            aria-invalid={!!errors.email}
            {...register('email')}
          />
        </div>
        {errors.email && (
          <p className="text-destructive mb-2 pl-1 text-sm">
            {errors.email.message}
          </p>
        )}
      </div>

      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-foreground text-sm font-medium"
        >
          Senha
        </Label>
        <div className="relative">
          <Lock className="text-muted-foreground pointer-events-none absolute top-1/2 left-3 z-10 h-4 w-4 -translate-y-1/2 md:h-5 md:w-5" />
          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className="h-10 pr-11 pl-9 text-sm md:h-11 md:pr-12 md:pl-10 md:text-base"
            placeholder="Sua senha"
            disabled={isSubmitting}
            aria-invalid={!!errors.password}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 z-10 -translate-y-1/2"
            disabled={isSubmitting}
            tabIndex={-1}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <Eye className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-destructive mb-2 pl-1 text-sm">
            {errors.password.message}
          </p>
        )}
      </div>

      <div className="flex items-center justify-end text-sm">
        <Link
          to="/forgot-password"
          className="text-primary hover:text-primary/80 transition-colors"
        >
          Esqueceu a senha?
        </Link>
      </div>

      <Button
        type="submit"
        className="bg-primary text-primary-foreground hover:bg-primary/90 h-10 w-full rounded-xl text-sm font-medium shadow-lg transition-all duration-200 hover:shadow-xl md:h-11 md:text-base"
        disabled={!activeButton}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Entrando...
          </>
        ) : (
          'Entrar no Sistema'
        )}
      </Button>

      <div className="relative my-4 md:my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-card text-muted-foreground px-2">ou</span>
        </div>
      </div>

      <div className="text-center">
        <p className="text-muted-foreground text-sm md:text-base">
          Não tem uma conta?{' '}
          <Link
            to="/sign-up"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Criar conta
          </Link>
        </p>
      </div>
    </form>
  );
}
