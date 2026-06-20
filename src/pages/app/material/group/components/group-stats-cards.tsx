import { Boxes, Package, PackageCheck, PackageX } from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface GroupStatsCardsProps {
  totalItems?: number;
  totalActiveGroups?: number;
  totalEmptyGroups?: number;
}

export function GroupStatsCards({
  totalItems = 0,
  totalActiveGroups = 0,
  totalEmptyGroups = 0,
}: GroupStatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {/* Total de Grupos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Grupos</CardTitle>
          <Boxes className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-center space-y-2">
            <Boxes className="h-8 w-8 text-primary mx-auto" />
            <div className="text-3xl font-bold">{totalItems}</div>
            <div className="text-xs text-muted-foreground">
              cadastrados no sistema
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Status dos Grupos */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Status dos Grupos
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <PackageCheck className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-2xl font-bold text-green-600">
                {totalActiveGroups}
              </div>
              <div className="text-xs text-muted-foreground">Com materiais</div>
            </div>
            <div className="text-center">
              <PackageX className="h-6 w-6 text-yellow-500 mx-auto mb-2" />
              <div className="text-2xl font-bold text-yellow-500">
                {totalEmptyGroups}
              </div>
              <div className="text-xs text-muted-foreground">Vazios</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Distribuição de Materiais */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Distribuição de Materiais
          </CardTitle>
          <Package className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            <div className="text-center">
              <PackageCheck className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-blue-600">
                {totalActiveGroups}
              </div>
              <div className="text-xs text-muted-foreground">Ativos</div>
            </div>
            <div className="text-center">
              <PackageX className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-xl font-bold text-orange-600">
                {totalItems - totalActiveGroups}
              </div>
              <div className="text-xs text-muted-foreground">Inativos</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
