import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Loader2, Lock } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

import {
  type ResetPasswordFormData,
  resetPasswordSchema,
} from '../schemas/validations';

export function ResetPasswordForm() {
  const [searchParams] = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { exchangePasswordForTokenMutation } = useAuth();

  const token = searchParams.get('token');

  useEffect(() => {
    if (!token) {
      toast.error(
        'Token de redefinição não encontrado. Solicite um novo link.',
      );
      void navigate('/forgot-password');
    }
  }, [token, navigate]);

  const {
    control,
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  const [password, confirmPassword] = useWatch({
    control,
    name: ['password', 'confirmPassword'],
  });

  const isPending = exchangePasswordForTokenMutation.isPending;
  const activeButton = Boolean(
    !isPending &&
    !isSubmitting &&
    password &&
    confirmPassword &&
    token &&
    password === confirmPassword,
  );

  async function handleResetPassword(data: ResetPasswordFormData) {
    if (!token) {
      toast.error('Token inválido. Solicite um novo link de recuperação.');
      return;
    }

    try {
      const { email } = await exchangePasswordForTokenMutation.mutateAsync({
        token,
        password: data.password,
      });
      void navigate(`/?email=${encodeURIComponent(email)}`);
    } catch {
      toast.error('Erro ao redefinir senha');
    }
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(handleResetPassword)(e)}
      className="space-y-4 md:space-y-6"
    >
      {/* Password */}
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-foreground text-sm font-medium"
        >
          Nova senha
        </Label>
        <div className="relative">
          <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform md:h-5 md:w-5" />
          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className="h-10 pr-11 pl-9 text-sm md:h-11 md:pr-12 md:pl-10 md:text-base"
            placeholder="Digite sua nova senha"
            disabled={isSubmitting || isPending}
            {...register('password')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform"
            disabled={isSubmitting || isPending}
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

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-foreground text-sm font-medium"
        >
          Confirmar nova senha
        </Label>
        <div className="relative">
          <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform md:h-5 md:w-5" />
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            className="h-10 pr-11 pl-9 text-sm md:h-11 md:pr-12 md:pl-10 md:text-base"
            placeholder="Confirme sua nova senha"
            disabled={isSubmitting || isPending}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform"
            disabled={isSubmitting || isPending}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <Eye className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-destructive mb-2 pl-1 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Reset Button */}
      <Button
        type="submit"
        className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-full rounded-xl text-sm font-medium shadow-lg transition-all duration-200 hover:shadow-xl md:h-11 md:text-base"
        disabled={!activeButton}
      >
        {isSubmitting || isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Redefinindo...
          </>
        ) : (
          'Redefinir senha'
        )}
      </Button>
    </form>
  );
}
