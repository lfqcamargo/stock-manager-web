import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

export function SignInFooter() {
  return (
    <div className="space-y-4">
      <Separator />
      <p className="text-center text-sm text-muted-foreground">
        Não tem uma conta?{' '}
        <Button
          variant="link"
          className="h-auto p-0 text-sm font-medium"
          asChild
        >
          <Link to="/sign-up">Criar conta</Link>
        </Button>
      </p>
    </div>
  );
}
