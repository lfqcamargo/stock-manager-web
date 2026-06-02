import { CheckCircle, Loader2, XCircle } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';

interface ConfirmAccountStatusProps {
  status: 'loading' | 'success' | 'error' | 'invalid';
  email?: string;
}

export function ConfirmAccountStatus({
  status,
  email,
}: ConfirmAccountStatusProps) {
  if (status === 'loading') {
    return (
      <div className="flex flex-col items-center gap-4 py-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">
          Confirmando sua conta...
        </p>
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="space-y-4">
        <div className="flex flex-col items-center gap-3 py-2">
          <CheckCircle className="h-10 w-10 text-green-500" />
          <div className="text-center space-y-1">
            <p className="text-sm font-medium text-foreground">
              Conta confirmada com sucesso
            </p>
            {email && (
              <p className="text-sm text-muted-foreground">
                Bem-vindo,{' '}
                <span className="font-medium text-foreground">{email}</span>
              </p>
            )}
          </div>
        </div>

        <Button className="w-full" size="lg" asChild>
          <Link
            to={
              email ? `/sign-in?email=${encodeURIComponent(email)}` : '/sign-in'
            }
          >
            Ir para o login
          </Link>
        </Button>
      </div>
    );
  }

  if (status === 'invalid') {
    return (
      <div className="space-y-4">
        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            Este link de confirmação é inválido ou expirou. Solicite um novo
            e-mail de confirmação.
          </p>
        </div>

        <Button className="w-full" size="lg" asChild>
          <Link to="/sign-in">Voltar para o login</Link>
        </Button>
      </div>
    );
  }

  // error
  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-3 py-2">
        <XCircle className="h-10 w-10 text-destructive" />
        <p className="text-sm text-muted-foreground text-center">
          Não foi possível confirmar sua conta. Tente novamente ou entre em
          contato com o suporte.
        </p>
      </div>

      <Button className="w-full" size="lg" asChild>
        <Link to="/sign-in">Voltar para o login</Link>
      </Button>
    </div>
  );
}
