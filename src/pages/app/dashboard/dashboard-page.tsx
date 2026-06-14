import {
  Activity,
  ArrowUpRight,
  Package,
  TrendingUp,
  Users,
  Warehouse,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useAuth } from '@/hooks/use-auth';

const stats = [
  {
    label: 'Materiais',
    value: '156',
    change: '+8',
    trend: 'up',
    icon: Package,
  },
  {
    label: 'Localizações',
    value: '24',
    change: '+2',
    trend: 'up',
    icon: Warehouse,
  },
  {
    label: 'Movimentos',
    value: '342',
    change: '+15',
    trend: 'up',
    icon: Activity,
  },
  {
    label: 'Usuários',
    value: '5',
    change: '0',
    trend: 'neutral',
    icon: Users,
  },
];

const recentActivity = [
  {
    user: 'João Silva',
    action: 'Adicionou material "Parafuso Aço"',
    time: 'há 5 min',
  },
  {
    user: 'Maria Santos',
    action: 'Realizou saída de estoque',
    time: 'há 18 min',
  },
  { user: 'Ana Costa', action: 'Criou nova localização', time: 'há 45 min' },
  { user: 'Carlos Pereira', action: 'Atualizou material', time: 'há 1h' },
  {
    user: 'Luiz Oliveira',
    action: 'Realizou entrada de estoque',
    time: 'há 2h',
  },
];

const quickLinks = [
  { label: 'Novo Material', href: '/material/material' },
  { label: 'Nova Localização', href: '/addressing/location' },
  { label: 'Nova Movimentação', href: '/movement/movement' },
];

function getInitials(name: string) {
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-6">
      {/* Saudação */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          Olá, {user?.name?.split(' ')[0]} 👋
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Aqui está o resumo do seu estoque hoje.
        </p>
      </div>

      {/* Cards de métricas */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardDescription className="text-sm font-medium">
                {stat.label}
              </CardDescription>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-bold">{stat.value}</p>
              <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                <Badge
                  variant="secondary"
                  className="text-xs px-1.5 py-0 font-medium text-green-600 bg-green-50 dark:bg-green-950 dark:text-green-400"
                >
                  {stat.change}
                </Badge>
                no mês
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Seção principal */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Atividade recente */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Atividade recente</CardTitle>
            <CardDescription>Últimas ações no estoque</CardDescription>
          </CardHeader>
          <CardContent className="space-y-0">
            {recentActivity.map((item, index) => (
              <div key={index}>
                <div className="flex items-center gap-3 py-3">
                  <Avatar className="h-8 w-8 shrink-0">
                    <AvatarFallback className="text-xs bg-primary/10 text-primary">
                      {getInitials(item.user)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium leading-none truncate">
                      {item.user}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {item.action}
                    </p>
                  </div>
                  <span className="text-xs text-muted-foreground shrink-0">
                    {item.time}
                  </span>
                </div>
                {index < recentActivity.length - 1 && <Separator />}
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Links rápidos */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Ações rápidas</CardTitle>
            <CardDescription>
              Acesse rapidamente as funções principais
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            {quickLinks.map((link, index) => (
              <a
                key={index}
                href={link.href}
                className="flex items-center gap-2 p-2 rounded-md hover:bg-accent transition-colors text-sm font-medium"
              >
                <ArrowUpRight className="h-4 w-4" />
                {link.label}
              </a>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
