import { Boxes, Package, PackageCheck, PackageX } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface MaterialStatsCardsProps {
  totalItems?: number;
  totalActive?: number;
  itemCount?: number;
}

export function MaterialStatsCards({
  totalItems = 0,
  totalActive = 0,
}: MaterialStatsCardsProps) {
  const totalInactive = totalItems - totalActive;
  const coveragePercent =
    totalItems > 0 ? Math.round((totalActive / totalItems) * 100) : 0;

  return (
    <div className="grid gap-4 md:grid-cols-3">
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
              cadastrados no sistema
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
                {totalInactive}
              </div>
              <div className="text-xs text-muted-foreground">Inativos</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Aproveitamento */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Aproveitamento</CardTitle>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold">{coveragePercent}%</div>
            <div className="text-xs text-muted-foreground">
              dos materiais estão ativos
            </div>
            <div className="w-full bg-muted rounded-full h-2">
              <div
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${coveragePercent}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
