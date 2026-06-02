import { useAuth } from '@/hooks/use-auth';

import { AppRoutes } from './app-routes';
import { PublicRoutes } from './public-routes';

export function Routes() {
  const { isAuthenticated, isLoading } = useAuth();

  // Aguarda a validação da sessão antes de decidir qual rota renderizar.
  // Evita o flash de login quando o usuário já tem sessão válida.
  if (isLoading) {
    return null;
  }

  return isAuthenticated ? <AppRoutes /> : <PublicRoutes />;
}
