import { Loader2, Mail, RefreshCw, XCircle } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';

type ConfirmationState = 'loading' | 'error';

export function ConfirmationCreateCompanyAndUserPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const [state, setState] = useState<ConfirmationState>(() =>
    token ? 'loading' : 'error',
  );
  const { confirmAccountMutation } = useAuth();
  const navigate = useNavigate();

  const isPending = confirmAccountMutation.isPending;

  useEffect(() => {
    const STORAGE_KEY = `confirmation-started-${token}`;
    const hasStartedFromStorage =
      sessionStorage.getItem(STORAGE_KEY) === 'true';

    if (hasStartedFromStorage || !token || isPending) {
      return;
    }

    sessionStorage.setItem(STORAGE_KEY, 'true');

    void (async () => {
      try {
        const result = await confirmAccountMutation.mutateAsync({ token });
        // Limpamos o storage depois do sucesso
        sessionStorage.removeItem(STORAGE_KEY);
        void navigate(`/?email=${encodeURIComponent(result.email)}`);
      } catch {
        sessionStorage.removeItem(STORAGE_KEY);
        setState('error');
      }
    })();
  }, [token, isPending, confirmAccountMutation, navigate]);

  return (
    <div className="p-6 md:p-8">
      {isPending && state === 'loading' && (
        <div className="text-center">
          <div className="mb-6 md:mb-8">
            <div className="relative mx-auto mb-4 h-16 w-16 md:h-20 md:w-20">
              <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg md:h-20 md:w-20">
                <Loader2 className="text-primary-foreground h-8 w-8 animate-spin md:h-10 md:w-10" />
              </div>
              <div className="bg-chart-1 absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full md:h-6 md:w-6">
                <Mail className="h-2.5 w-2.5 text-white md:h-3 md:w-3" />
              </div>
            </div>
            <h1 className="text-foreground mb-2 text-xl font-bold md:text-2xl">
              Verificando e-mail
            </h1>
            <p className="text-muted-foreground text-sm md:text-base">
              Aguarde enquanto confirmamos sua conta...
            </p>
          </div>
        </div>
      )}

      {state === 'error' && (
        <div className="text-center">
          <div className="mb-6 md:mb-8">
            <div className="relative mx-auto mb-4 h-16 w-16 md:h-20 md:w-20">
              <div className="bg-destructive flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg md:h-20 md:w-20">
                <XCircle className="text-destructive-foreground h-8 w-8 md:h-10 md:w-10" />
              </div>
            </div>
            <h1 className="text-foreground mb-2 text-xl font-bold md:text-2xl">
              Erro na Confirmação
            </h1>
            <p className="text-muted-foreground text-sm md:text-base mb-6">
              Não foi possível confirmar seu e-mail. O link pode ter expirado.
            </p>
          </div>

          <div className="space-y-3 max-w-md mx-auto">
            <Button
              asChild
              className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-full rounded-xl text-sm font-medium shadow-lg transition-all duration-200 hover:shadow-xl md:h-11 md:text-base"
            >
              <Link to="/sign-up">
                <RefreshCw className="mr-2 h-4 w-4" />
                Criar nova conta
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              className="h-10 w-full rounded-xl text-sm font-medium md:h-11 md:text-base"
            >
              <Link to="/">Voltar ao login</Link>
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
