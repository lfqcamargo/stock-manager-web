import { ArrowDownCircle, ArrowUpCircle, ListChecks } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MovementTypeStatsCardsProps {
  totalItems?: number;
  totalInboundTypes?: number;
  totalOutboundTypes?: number;
}

export function MovementTypeStatsCards({
  totalItems = 0,
  totalInboundTypes = 0,
  totalOutboundTypes = 0,
}: MovementTypeStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Total de Tipos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Tipos</CardTitle>
          <ListChecks className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalItems}</div>
          <p className="text-xs text-muted-foreground">Tipos cadastrados</p>
        </CardContent>
      </Card>

      {/* Tipos de Entrada */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Tipos de Entrada
          </CardTitle>
          <ArrowUpCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalInboundTypes}</div>
          <p className="text-xs text-muted-foreground">Aumentam o estoque</p>
        </CardContent>
      </Card>

      {/* Tipos de Saída */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Tipos de Saída</CardTitle>
          <ArrowDownCircle className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{totalOutboundTypes}</div>
          <p className="text-xs text-muted-foreground">Diminuem o estoque</p>
        </CardContent>
      </Card>
    </div>
  );
}
