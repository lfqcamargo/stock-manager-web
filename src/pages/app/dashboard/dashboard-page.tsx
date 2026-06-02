import { Activity, ArrowUpRight, TrendingUp, Users } from 'lucide-react';

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
    label: 'Usuários',
    value: '1.240',
    change: '+12%',
    trend: 'up',
    icon: Users,
  },
  {
    label: 'Atividade',
    value: '3.892',
    change: '+8%',
    trend: 'up',
    icon: Activity,
  },
  {
    label: 'Crescimento',
    value: '24,5%',
    change: '+4%',
    trend: 'up',
    icon: TrendingUp,
  },
  {
    label: 'Conversão',
    value: '5,2%',
    change: '+1%',
    trend: 'up',
    icon: ArrowUpRight,
  },
];

const recentActivity = [
  { user: 'Ana Silva', action: 'Criou uma nova conta', time: 'há 2 min' },
  { user: 'Carlos Mendes', action: 'Atualizou o perfil', time: 'há 15 min' },
  { user: 'Beatriz Costa', action: 'Realizou login', time: 'há 32 min' },
  { user: 'Diego Rocha', action: 'Alterou a senha', time: 'há 1h' },
  { user: 'Fernanda Lima', action: 'Criou uma nova conta', time: 'há 2h' },
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
          Aqui está um resumo do que está acontecendo hoje.
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
                em relação ao mês anterior
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Atividade recente */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Atividade recente</CardTitle>
            <CardDescription>
              Últimas ações realizadas na plataforma
            </CardDescription>
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

        {/* Card de boas-vindas / placeholder */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="text-base">Sobre este template</CardTitle>
            <CardDescription>
              Ponto de partida para novos projetos
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <p className="text-sm text-muted-foreground">
              Este template inclui autenticação completa, sidebar responsiva,
              suporte a temas e uma estrutura escalável pronta para uso.
            </p>
            <Separator />
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                React + TypeScript + Vite
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                shadcn/ui + Tailwind CSS
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                React Query + Axios
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                React Hook Form + Zod
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                React Router DOM
              </li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
