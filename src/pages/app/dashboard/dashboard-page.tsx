import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/use-auth';
import { useDashboard } from '@/hooks/use-dashboard';

import { KpiCards } from './components/kpi-cards';
import { LowStockTable } from './components/low-stock-table';
import { MovementsChart } from './components/movements-chart';
import { QuickActions } from './components/quick-actions';
import { RecentMovements } from './components/recent-movements';

export function DashboardPage() {
  const { user } = useAuth();
  const { data, isLoading, isFetching, refetch } = useDashboard();

  const firstName = user?.name?.split(' ')[0] ?? '';

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">
            Olá, {firstName} 👋
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Aqui está o resumo do seu estoque hoje.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => void refetch()}
          disabled={isFetching}
          className="gap-2"
        >
          <RefreshCw
            className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`}
          />
          Atualizar
        </Button>
      </div>

      {/* KPI cards */}
      <KpiCards kpis={data?.kpis} isLoading={isLoading} />

      {/* Chart — full width */}
      <MovementsChart data={data?.movementsByDay} isLoading={isLoading} />

      {/* Bottom grid: low stock + right column */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Low stock table — takes 2 cols */}
        <div className="lg:col-span-2">
          <LowStockTable items={data?.lowStockItems} isLoading={isLoading} />
        </div>

        {/* Right column: recent movements + quick actions */}
        <div className="flex flex-col gap-4">
          <QuickActions />
        </div>
      </div>

      {/* Recent movements — full width */}
      <RecentMovements
        movements={data?.recentMovements}
        isLoading={isLoading}
      />
    </div>
  );
}
