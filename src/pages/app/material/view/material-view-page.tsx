import { useQuery } from '@tanstack/react-query';
import {
  ArrowDown,
  ArrowLeft,
  ArrowUp,
  Barcode,
  CheckCircle2,
  FileText,
  Layers,
  MapPin,
  Package,
  Ruler,
  Tag,
  XCircle,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchAddressings } from '@/api/stock/fetch-addressings';
import { fetchMovements } from '@/api/stock/fetch-movements';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useMaterial } from '@/hooks/use-material';
import { getInitials } from '@/utils/get-initials';
import { unitMeasure } from '@/utils/unit-measure';

export function MaterialViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useGetMaterialById } = useMaterial();
  const { data: material, isLoading } = useGetMaterialById(id || '');

  const { data: addressingsData, isLoading: isLoadingAddressings } = useQuery({
    queryKey: ['addressings', 'material', id],
    queryFn: () => fetchAddressings({ materialId: id, limit: 999 }),
    enabled: !!id,
  });

  const { data: movementsData, isLoading: isLoadingMovements } = useQuery({
    queryKey: ['movements', 'material', id],
    queryFn: () =>
      fetchMovements({
        materialId: id,
        limit: 5,
        orderBy: 'date',
        orderDirection: 'desc',
      }),
    enabled: !!id,
  });

  const unitLabel = material
    ? (unitMeasure[material.unit] ?? material.unit)
    : '';

  const totalStock =
    addressingsData?.addressings.reduce((sum, a) => sum + a.amount, 0) ?? 0;
  const activeAddressings =
    addressingsData?.addressings.filter((a) => a.active).length ?? 0;
  const totalAddressings = addressingsData?.addressings.length ?? 0;

  return (
    <div className="flex-1 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8">
        <div className="flex items-start gap-3 md:gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 md:h-10 md:w-10 rounded-lg md:rounded-xl shadow-sm hover:shadow transition-all duration-200"
            onClick={() => {
              void navigate(-1);
            }}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-0.5 md:space-y-1">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
              Visualizar Material
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Detalhes completos do material
            </p>
          </div>
        </div>
      </div>

      {/* Loading state */}
      {isLoading ? (
        <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 shadow-sm p-4 md:p-6 lg:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <Skeleton className="h-32 w-32 rounded-xl shrink-0" />
            <div className="space-y-3 flex-1 w-full">
              <Skeleton className="h-7 w-48" />
              <Skeleton className="h-5 w-32" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-24 w-full rounded-xl" />
            ))}
          </div>
          <Skeleton className="h-40 w-full rounded-xl" />
          <Skeleton className="h-40 w-full rounded-xl" />
        </div>
      ) : material ? (
        <div className="space-y-4 md:space-y-6">
          {/* Hero — foto + identidade */}
          <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <div className="h-32 w-32 rounded-xl overflow-hidden shrink-0 shadow-md">
                {material.photoUrl ? (
                  <img
                    src={material.photoUrl}
                    alt={material.name}
                    className="h-full w-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : (
                  <div className="h-full w-full bg-primary flex items-center justify-center text-3xl font-bold text-primary-foreground">
                    {getInitials(material.name)}
                  </div>
                )}
              </div>

              <div className="flex-1 text-center sm:text-left space-y-2">
                <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                  <h2 className="text-2xl font-bold tracking-tight">
                    {material.name}
                  </h2>
                  <Badge
                    variant={material.active ? 'default' : 'destructive'}
                    className={`self-center sm:self-auto ${material.active ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  >
                    {material.active ? (
                      <CheckCircle2 className="h-3 w-3 mr-1" />
                    ) : (
                      <XCircle className="h-3 w-3 mr-1" />
                    )}
                    {material.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
                <p className="text-sm font-mono text-muted-foreground">
                  {material.code}
                </p>
                <p className="text-sm text-muted-foreground">
                  {material.group}
                </p>
                {material.description && (
                  <p className="text-sm text-muted-foreground max-w-prose">
                    {material.description}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Cards de destaque */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card className="border border-border/40 bg-card/50 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Barcode className="h-4 w-4" />
                  <CardTitle className="text-xs font-medium uppercase tracking-wide">
                    Código
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-xl font-bold font-mono">{material.code}</p>
              </CardContent>
            </Card>

            <Card className="border border-border/40 bg-card/50 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Ruler className="h-4 w-4" />
                  <CardTitle className="text-xs font-medium uppercase tracking-wide">
                    Unidade
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-xl font-bold">{material.unit}</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {unitLabel}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/40 bg-card/50 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Layers className="h-4 w-4" />
                  <CardTitle className="text-xs font-medium uppercase tracking-wide">
                    Grupo
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <p className="text-base font-semibold leading-tight">
                  {material.group}
                </p>
              </CardContent>
            </Card>

            <Card className="border border-border/40 bg-card/50 shadow-sm">
              <CardHeader className="pb-2 pt-4 px-4">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Tag className="h-4 w-4" />
                  <CardTitle className="text-xs font-medium uppercase tracking-wide">
                    Status
                  </CardTitle>
                </div>
              </CardHeader>
              <CardContent className="px-4 pb-4">
                <div className="flex items-center gap-2">
                  {material.active ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                  ) : (
                    <XCircle className="h-5 w-5 text-destructive" />
                  )}
                  <p
                    className={`text-base font-semibold ${material.active ? 'text-green-600' : 'text-destructive'}`}
                  >
                    {material.active ? 'Ativo' : 'Inativo'}
                  </p>
                </div>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {material.active ? 'Disponível para uso' : 'Fora de operação'}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Estoque */}
          <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-4">
              <Package className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Estoque</h3>
            </div>

            {isLoadingAddressings ? (
              <div className="grid grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-16 w-full rounded-lg" />
                ))}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-3 gap-4 mb-5">
                  <div className="rounded-lg bg-muted/30 p-3 text-center">
                    <p className="text-2xl font-bold">{totalStock}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Qtd. total em estoque
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-3 text-center">
                    <p className="text-2xl font-bold text-green-600">
                      {activeAddressings}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Endereços ativos
                    </p>
                  </div>
                  <div className="rounded-lg bg-muted/30 p-3 text-center">
                    <p className="text-2xl font-bold">{totalAddressings}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      Total de endereços
                    </p>
                  </div>
                </div>

                {addressingsData && addressingsData.addressings.length > 0 ? (
                  <div className="space-y-2">
                    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide mb-3">
                      Localizações
                    </p>
                    {addressingsData.addressings.map((addressing) => (
                      <div
                        key={addressing.id}
                        className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-background/50 text-sm"
                      >
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
                          <span className="text-muted-foreground">
                            {addressing.location.name} →{' '}
                            {addressing.subLocation.name} →{' '}
                            {addressing.row.name} → {addressing.shelf.name} →{' '}
                            {addressing.position.name}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 shrink-0">
                          <span className="font-semibold">
                            {addressing.amount} {material.unit}
                          </span>
                          <Badge
                            variant={
                              addressing.active ? 'default' : 'secondary'
                            }
                            className={`text-xs ${addressing.active ? 'bg-green-600 hover:bg-green-700' : ''}`}
                          >
                            {addressing.active ? 'Ativo' : 'Inativo'}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    Nenhum endereçamento cadastrado para este material.
                  </p>
                )}
              </>
            )}
          </div>

          {/* Últimas movimentações */}
          <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-4 w-4 text-muted-foreground" />
              <h3 className="font-semibold">Últimas Movimentações</h3>
            </div>

            {isLoadingMovements ? (
              <div className="space-y-2">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Skeleton key={i} className="h-12 w-full rounded-lg" />
                ))}
              </div>
            ) : movementsData && movementsData.movements.length > 0 ? (
              <div className="space-y-2">
                {movementsData.movements.map((movement) => (
                  <div
                    key={movement.id}
                    className="flex items-center justify-between p-3 rounded-lg border border-border/40 bg-background/50 text-sm"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`h-7 w-7 rounded-full flex items-center justify-center shrink-0 ${
                          movement.movementTypeDirection === 'IN'
                            ? 'bg-green-100 text-green-600'
                            : 'bg-red-100 text-red-500'
                        }`}
                      >
                        {movement.movementTypeDirection === 'IN' ? (
                          <ArrowDown className="h-3.5 w-3.5" />
                        ) : (
                          <ArrowUp className="h-3.5 w-3.5" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">
                          {movement.movementTypeName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {movement.locationName} · {movement.userName}
                        </p>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <p
                        className={`font-semibold ${
                          movement.movementTypeDirection === 'IN'
                            ? 'text-green-600'
                            : 'text-red-500'
                        }`}
                      >
                        {movement.movementTypeDirection === 'IN' ? '+' : '-'}
                        {movement.quantity} {movement.materialUnit}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(movement.date).toLocaleDateString('pt-BR')}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                Nenhuma movimentação registrada para este material.
              </p>
            )}
          </div>

          {/* Informações adicionais */}
          <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8 space-y-4">
            <h3 className="font-semibold text-sm">Informações Adicionais</h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Descrição
                </p>
                <p
                  className={
                    material.description
                      ? 'text-foreground'
                      : 'text-muted-foreground italic'
                  }
                >
                  {material.description ?? 'Sem descrição cadastrada'}
                </p>
              </div>

              {material.photoUrl && (
                <div className="space-y-1">
                  <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                    URL da Foto
                  </p>
                  <a
                    href={material.photoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:underline break-all"
                  >
                    {material.photoUrl}
                  </a>
                </div>
              )}
            </div>

            <Separator />

            <div className="space-y-1">
              <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                ID do Material
              </p>
              <p className="text-xs font-mono text-muted-foreground break-all">
                {material.id}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
