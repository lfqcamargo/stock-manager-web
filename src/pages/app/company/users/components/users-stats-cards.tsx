import {
  Calendar,
  Shield,
  TrendingUp,
  User,
  UserCheck,
  UserCog,
  Users,
  UserX,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatRelativeTime } from '@/utils/format-date';
import { formatRole } from '@/utils/format-role';

interface UsersStatsCardsProps {
  totalItems?: number;
  totalActive?: number;
  totalInactive?: number;
  lastCreated?: string;
  countByRole?: Record<string, number>;
}

export function UsersStatsCards({
  totalItems = 0,
  totalActive = 0,
  totalInactive = 0,
  lastCreated,
  countByRole = {},
}: UsersStatsCardsProps) {
  const roleIcons: Record<string, React.ReactNode> = {
    ADMIN: <Shield className="h-8 w-8" />,
    MANAGER: <UserCog className="h-8 w-8" />,
    EMPLOYEE: <User className="h-8 w-8" />,
  };

  const roleColors: Record<string, string> = {
    ADMIN: 'text-purple-600',
    MANAGER: 'text-blue-600',
    EMPLOYEE: 'text-green-600',
  };

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total de Usuários */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Usuários
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <Users className="h-8 w-8 text-primary mx-auto" />
            <div className="text-3xl font-bold">{totalItems}</div>
            <div className="text-xs text-muted-foreground">
              {totalItems} cadastrados na empresa
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status dos Usuários */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Status dos Usuários
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <UserCheck className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {totalActive}
              </div>
              <div className="text-xs text-muted-foreground">Ativos</div>
            </div>
            <div className="text-center">
              <UserX className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-500">
                {totalInactive}
              </div>
              <div className="text-xs text-muted-foreground">Inativos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribuição por Cargo */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Distribuição por Cargo
          </CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-4">
            {['ADMIN', 'MANAGER', 'EMPLOYEE'].map((role) => (
              <div key={role} className="flex flex-col items-center gap-2">
                <div className={roleColors[role]}>{roleIcons[role]}</div>
                <span className={`text-lg font-bold ${roleColors[role]}`}>
                  {countByRole[role] || 0}
                </span>
                <span className="text-xs text-muted-foreground">
                  {formatRole(role)}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Atividade Recente */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Atividade Recente
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <Calendar className="h-8 w-8 text-indigo-600 mx-auto" />
            <div className="text-2xl font-bold text-indigo-600">
              {lastCreated && formatDate(lastCreated).split(' ')[0]}
            </div>
            <div className="text-xs text-muted-foreground">
              Último cadastro {lastCreated && formatRelativeTime(lastCreated)}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
