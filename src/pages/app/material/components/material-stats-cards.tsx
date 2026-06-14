import {
  Boxes,
  Calendar,
  Package,
  PackageCheck,
  PackageX,
  TrendingUp,
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { formatDate, formatRelativeTime } from '@/utils/format-date';

interface MaterialStatsCardsProps {
  totalItems?: number;
  totalActive?: number;
  itemCount?: number;
  lastCreated?: string;
}

export function MaterialStatsCards({
  totalItems = 0,
  totalActive = 0,
  itemCount = 0,
  lastCreated,
}: MaterialStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Total de Materiais */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Materiais
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <Package className="h-8 w-8 text-primary mx-auto" />
            <div className="text-3xl font-bold">{totalItems}</div>
            <div className="text-xs text-muted-foreground">
              {itemCount} cadastrados no sistema
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status dos Materiais */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Status dos Materiais
          </CardTitle>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <PackageCheck className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {totalActive}
              </div>
              <div className="text-xs text-muted-foreground">Ativos</div>
            </div>
            <div className="text-center">
              <PackageX className="h-6 w-6 text-red-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-red-500">
                {totalItems - totalActive}
              </div>
              <div className="text-xs text-muted-foreground">Inativos</div>
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
