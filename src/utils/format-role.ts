export function formatRole(role: string): string {
  const roleLabels: Record<string, string> = {
    ADMIN: 'Administrador',
    MANAGER: 'Gerente',
    EMPLOYEE: 'Funcionário',
  };

  return roleLabels[role.toUpperCase()] || 'Desconhecido';
}
