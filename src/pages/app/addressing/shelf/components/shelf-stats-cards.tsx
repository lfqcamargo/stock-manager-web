import {
  Calendar,
  CheckCircle,
  Package,
  TrendingUp,
  XCircle,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatRelativeTime } from '@/utils/format-date';

interface ShelfStatsCardsProps {
  totalItems?: number;
  totalActive?: number;
  totalInactive?: number;
  itemCount?: number;
  lastCreated?: string;
}

export function ShelfStatsCards({
  totalItems = 0,
  totalActive = 0,
  totalInactive = 0,
  itemCount = 0,
  lastCreated,
}: ShelfStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total de Prateleiras */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Prateleiras
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <Package className="h-8 w-8 text-primary mx-auto" />
            <div className="text-3xl font-bold">{totalItems}</div>
            <div className="text-xs text-muted-foreground">
              {itemCount} cadastradas no sistema
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status das Prateleiras */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Status das Prateleiras
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <CheckCircle className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {totalActive}
              </div>
              <div className="text-xs text-muted-foreground">Ativas</div>
            </div>
            <div className="text-center">
              <XCircle className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-500">
                {totalInactive}
              </div>
              <div className="text-xs text-muted-foreground">Inativas</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribuição por Fileira */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Distribuição por Fileira
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <Package className="h-8 w-8 text-blue-600 mx-auto" />
            <div className="text-2xl font-bold text-blue-600">
              {totalActive + totalInactive}
            </div>
            <div className="text-xs text-muted-foreground">
              Prateleiras organizadas
            </div>
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
