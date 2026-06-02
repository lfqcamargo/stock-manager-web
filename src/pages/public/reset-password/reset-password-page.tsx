import { Link, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';

import { ResetPasswordFooter } from './components/reset-password-footer';
import { ResetPasswordForm } from './components/reset-password-form';
import { ResetPasswordHeader } from './components/reset-password-header';

export function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  if (!token) {
    return (
      <div className="space-y-6">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight text-foreground">
            Link inválido
          </h2>
          <p className="text-sm text-muted-foreground">
            Este link de redefinição de senha é inválido ou expirou.
          </p>
        </div>

        <div className="rounded-lg border border-destructive/30 bg-destructive/5 p-4">
          <p className="text-sm text-destructive">
            Solicite um novo link de recuperação de senha.
          </p>
        </div>

        <Button className="w-full" size="lg" asChild>
          <Link to="/forgot-password">Solicitar novo link</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <ResetPasswordHeader />
      <ResetPasswordForm token={token} />
      <ResetPasswordFooter />
    </div>
  );
}
