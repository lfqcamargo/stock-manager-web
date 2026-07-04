import {
  Activity,
  ArrowDown,
  ArrowUp,
  Package,
  TrendingDown,
  TrendingUp,
  Users,
  Warehouse,
} from 'lucide-react';

import type { DashboardKpis } from '@/api/stock/fetch-dashboard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

interface KpiCardsProps {
  kpis?: DashboardKpis;
  isLoading: boolean;
}

export function KpiCards({ kpis, isLoading }: KpiCardsProps) {
  const cards = [
    {
      title: 'Materiais ativos',
      value: kpis?.activeMaterials,
      total: kpis?.totalMaterials,
      suffix: `/ ${kpis?.totalMaterials ?? '—'} total`,
      icon: Package,
      color: 'text-blue-500',
      bg: 'bg-blue-50 dark:bg-blue-950/40',
    },
    {
      title: 'Endereços ativos',
      value: kpis?.activeAddressings,
      total: kpis?.totalAddressings,
      suffix: `/ ${kpis?.totalAddressings ?? '—'} total`,
      icon: Warehouse,
      color: 'text-violet-500',
      bg: 'bg-violet-50 dark:bg-violet-950/40',
    },
    {
      title: 'Entradas este mês',
      value: kpis?.inMovementsThisMonth,
      suffix: 'movimentos',
      icon: ArrowUp,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      trend: kpis
        ? kpis.inMovementsThisMonth > kpis.outMovementsThisMonth
          ? 'up'
          : 'down'
        : null,
    },
    {
      title: 'Saídas este mês',
      value: kpis?.outMovementsThisMonth,
      suffix: 'movimentos',
      icon: ArrowDown,
      color: 'text-rose-500',
      bg: 'bg-rose-50 dark:bg-rose-950/40',
    },
    {
      title: 'Usuários ativos',
      value: kpis?.activeUsers,
      total: kpis?.totalUsers,
      suffix: `/ ${kpis?.totalUsers ?? '—'} total`,
      icon: Users,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
    },
    {
      title: 'Movimentações no mês',
      value: kpis?.totalMovementsThisMonth,
      suffix: 'no total',
      icon: Activity,
      color: 'text-cyan-500',
      bg: 'bg-cyan-50 dark:bg-cyan-950/40',
    },
  ];

  if (isLoading) {
    return (
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-28" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-1" />
              <Skeleton className="h-3 w-24" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <Card key={card.title} className="relative overflow-hidden">
            <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
              <CardTitle className="text-xs font-medium text-muted-foreground leading-tight">
                {card.title}
              </CardTitle>
              <div className={`rounded-lg p-1.5 ${card.bg}`}>
                <Icon className={`h-3.5 w-3.5 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-end gap-1.5">
                <p className="text-2xl font-bold tabular-nums">
                  {card.value ?? '—'}
                </p>
                {card.trend === 'up' && (
                  <TrendingUp className="h-4 w-4 text-emerald-500 mb-1" />
                )}
                {card.trend === 'down' && (
                  <TrendingDown className="h-4 w-4 text-rose-500 mb-1" />
                )}
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                {card.suffix}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
