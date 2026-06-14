import { useQuery } from '@tanstack/react-query';
import { AlertTriangle, CheckCircle, MapPin, Package } from 'lucide-react';

import { fetchAddressings } from '@/api/stock/fetch-addressings';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function AddressingStatsCards() {
  const { data: addressingData } = useQuery({
    queryKey: ['addressing'],
    queryFn: () => fetchAddressings({}),
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Calcular estatísticas baseadas nos dados
  const totalAddressings = addressingData?.meta.totalItems || 0;
  const activeAddressings =
    addressingData?.addressings?.filter((a) => a.active).length || 0;
  const withMaterial =
    addressingData?.addressings?.filter((a) => a.material).length || 0;
  const withoutMaterial = totalAddressings - withMaterial;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Endereçamentos
          </CardTitle>
          <MapPin className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalAddressings}</div>
          <p className="text-xs text-muted-foreground">
            Endereçamentos cadastrados
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Endereçamentos Ativos
          </CardTitle>
          <CheckCircle className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{activeAddressings}</div>
          <p className="text-xs text-muted-foreground">Com status ativo</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Com Material</CardTitle>
          <Package className="h-4 w-4 text-blue-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{withMaterial}</div>
          <p className="text-xs text-muted-foreground">
            Vinculados a materiais
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Sem Material</CardTitle>
          <AlertTriangle className="h-4 w-4 text-orange-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{withoutMaterial}</div>
          <p className="text-xs text-muted-foreground">Aguardando material</p>
        </CardContent>
      </Card>
    </div>
  );
}
