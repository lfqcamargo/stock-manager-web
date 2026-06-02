import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function ForgotPasswordFooter() {
  return (
    <div className="space-y-4">
      <Separator />
      <p className="text-center text-sm text-muted-foreground">
        Lembrou a senha?{' '}
        <Button
          variant="link"
          className="h-auto p-0 text-sm font-medium"
          asChild
        >
          <Link to="/sign-in">Voltar para o login</Link>
        </Button>
      </p>
    </div>
  );
}
