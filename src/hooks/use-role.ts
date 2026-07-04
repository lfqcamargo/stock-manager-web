import { useAuth } from '@/hooks/use-auth';

export function useRole() {
  const { user } = useAuth();
  const role = user?.role;

  return {
    role,
    isAdmin: role === 'ADMIN',
    isManager: role === 'MANAGER',
    isEmployee: role === 'EMPLOYEE',
    canWrite: role === 'ADMIN' || role === 'MANAGER',
  };
}
