import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  BookMarked,
  Columns3,
  FolderTree,
  Hash,
  Layers,
  MapPin,
  Package,
  Rows3,
  Tag,
  Warehouse,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { findAddressingById } from '@/api/stock/find-addressing-by-id';
import { findLocationById } from '@/api/stock/find-location-by-id';
import { findPositionById } from '@/api/stock/find-position-by-id';
import { findRowById } from '@/api/stock/find-row-by-id';
import { findShelfById } from '@/api/stock/find-shelf-by-id';
import { findSubLocationById } from '@/api/stock/find-sub-location-by-id';
import { fetchMaterialById } from '@/api/stock/fetch-materials';
import { fetchGroupById } from '@/api/stock/fetch-groups';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

// ── Helper ───────────────────────────────────────────────────────────────────
function InfoItem({
  icon: Icon,
  label,
  value,
  mono = false,
}: {
  icon: React.ElementType;
  label: string;
  value?: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="space-y-1">
      <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span>{label}</span>
      </div>
      <div className={`text-sm font-medium ${mono ? 'font-mono' : ''}`}>
        {value ?? <span className="text-muted-foreground">—</span>}
      </div>
    </div>
  );
}

function LocationCard({
  icon: Icon,
  title,
  code,
  name,
  description,
}: {
  icon: React.ElementType;
  title: string;
  code: string;
  name: string;
  description?: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3 space-y-1">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span>{title}</span>
      </div>
      <div className="font-mono text-xs text-primary">{code}</div>
      <div className="text-sm font-semibold leading-tight">{name}</div>
      {description && (
        <div className="text-xs text-muted-foreground truncate">{description}</div>
      )}
    </div>
  );
}

export function AddressingViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data: addressing, isLoading } = useQuery({
    queryKey: ['addressing', id],
    queryFn: () => findAddressingById(id!),
    enabled: !!id,
  });

  const { data: location, isLoading: loadingLocation } = useQuery({
    queryKey: ['location', addressing?.locationId],
    queryFn: () => findLocationById(addressing!.locationId),
    enabled: !!addressing?.locationId,
  });

  const { data: subLocation, isLoading: loadingSubLocation } = useQuery({
    queryKey: ['subLocation', addressing?.subLocationId],
    queryFn: () => findSubLocationById(addressing!.subLocationId),
    enabled: !!addressing?.subLocationId,
  });

  const { data: row, isLoading: loadingRow } = useQuery({
    queryKey: ['row', addressing?.rowId],
    queryFn: () => findRowById(addressing!.rowId),
    enabled: !!addressing?.rowId,
  });

  const { data: shelf, isLoading: loadingShelf } = useQuery({
    queryKey: ['shelf', addressing?.shelfId],
    queryFn: () => findShelfById(addressing!.shelfId),
    enabled: !!addressing?.shelfId,
  });

  const { data: position, isLoading: loadingPosition } = useQuery({
    queryKey: ['position', addressing?.positionId],
    queryFn: () => findPositionById(addressing!.positionId),
    enabled: !!addressing?.positionId,
  });

  const { data: material, isLoading: loadingMaterial } = useQuery({
    queryKey: ['material', addressing?.materialId],
    queryFn: () => fetchMaterialById(addressing!.materialId!),
    enabled: !!addressing?.materialId,
  });

  const { data: group, isLoading: loadingGroup } = useQuery({
    queryKey: ['group', material?.groupId],
    queryFn: () => fetchGroupById(material!.groupId),
    enabled: !!material?.groupId,
  });

  const isLoadingAny =
    isLoading ||
    loadingLocation ||
    loadingSubLocation ||
    loadingRow ||
    loadingShelf ||
    loadingPosition;

  return (
    <div className="flex-1 space-y-4 md:space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8">
        <div className="flex items-start gap-3 md:gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 md:h-10 md:w-10 rounded-lg md:rounded-xl shadow-sm hover:shadow transition-all duration-200 shrink-0"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-0.5 md:space-y-1">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2">
              <Warehouse className="h-6 w-6 shrink-0" />
              Visualizar Endereçamento
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Detalhes completos do endereçamento e do material vinculado
            </p>
          </div>
        </div>
      </div>

      {isLoadingAny ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className={i === 2 ? 'lg:col-span-2' : ''}>
              <CardHeader><Skeleton className="h-5 w-32" /></CardHeader>
              <CardContent className="space-y-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : addressing ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">

          {/* ── Card: Localização ─────────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                Localização
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {location && (
                  <LocationCard
                    icon={MapPin}
                    title="Localização"
                    code={location.code}
                    name={location.name}
                    description={location.description}
                  />
                )}
                {subLocation && (
                  <LocationCard
                    icon={BookMarked}
                    title="Sub-localização"
                    code={subLocation.code}
                    name={subLocation.name}
                    description={subLocation.description}
                  />
                )}
                {row && (
                  <LocationCard
                    icon={Rows3}
                    title="Fileira"
                    code={row.code}
                    name={row.name}
                    description={row.description}
                  />
                )}
                {shelf && (
                  <LocationCard
                    icon={Layers}
                    title="Prateleira"
                    code={shelf.code}
                    name={shelf.name}
                    description={shelf.description}
                  />
                )}
                {position && (
                  <LocationCard
                    icon={Columns3}
                    title="Posição"
                    code={position.code}
                    name={position.name}
                    description={position.description}
                  />
                )}
              </div>
            </CardContent>
          </Card>

          {/* ── Card: Saldo e Status ──────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Hash className="h-4 w-4 text-muted-foreground" />
                Saldo e Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <div>
                  <div className="text-xs text-muted-foreground mb-1">Saldo atual</div>
                  <div className="text-4xl font-bold font-mono tabular-nums">
                    {addressing.amount}
                  </div>
                </div>
                <Badge
                  variant={addressing.amount > 0 ? 'default' : 'outline'}
                  className="text-sm"
                >
                  {addressing.amount > 0 ? 'Com estoque' : 'Sem estoque'}
                </Badge>
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="text-sm font-medium">Status do endereçamento</div>
                <Badge variant={addressing.active ? 'default' : 'secondary'}>
                  {addressing.active ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <p className="text-xs text-muted-foreground">
                {addressing.active
                  ? 'Este endereçamento está ativo e disponível para uso.'
                  : 'Este endereçamento está inativo e não pode receber movimentações.'}
              </p>
            </CardContent>
          </Card>

          {/* ── Card: Material ────────────────────────────────────────────── */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4 text-muted-foreground" />
                Material Vinculado
              </CardTitle>
            </CardHeader>
            <CardContent>
              {!addressing.materialId ? (
                <p className="text-sm text-muted-foreground italic">
                  Nenhum material vinculado a este endereçamento.
                </p>
              ) : loadingMaterial ? (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full rounded-lg" />
                  ))}
                </div>
              ) : material ? (
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Foto do material */}
                  <div className="shrink-0">
                    <div className="h-28 w-28 rounded-xl overflow-hidden border bg-muted flex items-center justify-center">
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
                        <Package className="h-10 w-10 text-muted-foreground/40" />
                      )}
                    </div>
                  </div>

                  {/* Informações do material */}
                  <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                    <InfoItem icon={Hash} label="Código" value={material.code} mono />
                    <InfoItem icon={Package} label="Nome" value={material.name} />
                    <InfoItem icon={Tag} label="Unidade" value={material.unit} />
                    <InfoItem
                      icon={Tag}
                      label="Status"
                      value={
                        <Badge variant={material.active ? 'default' : 'secondary'}>
                          {material.active ? 'Ativo' : 'Inativo'}
                        </Badge>
                      }
                    />
                    {material.description && (
                      <div className="col-span-full">
                        <InfoItem
                          icon={Package}
                          label="Descrição"
                          value={material.description}
                        />
                      </div>
                    )}

                    {/* Grupo */}
                    {(group || loadingGroup) && (
                      <div className="col-span-full">
                        <Separator className="my-2" />
                        <div className="text-xs text-muted-foreground mb-2 flex items-center gap-1.5">
                          <FolderTree className="h-3.5 w-3.5" />
                          Grupo
                        </div>
                        {loadingGroup ? (
                          <Skeleton className="h-16 w-48 rounded-lg" />
                        ) : group ? (
                          <div className="flex items-center gap-3">
                            {/* Foto do grupo */}
                            <div className="h-12 w-12 rounded-lg overflow-hidden border bg-muted flex items-center justify-center shrink-0">
                              {group.photoUrl ? (
                                <img
                                  src={group.photoUrl}
                                  alt={group.name}
                                  className="h-full w-full object-cover"
                                  onError={(e) => {
                                    (e.target as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              ) : (
                                <FolderTree className="h-5 w-5 text-muted-foreground/40" />
                              )}
                            </div>
                            <div>
                              <div className="font-mono text-xs text-muted-foreground">{group.code}</div>
                              <div className="text-sm font-semibold">{group.name}</div>
                              {group.description && (
                                <div className="text-xs text-muted-foreground">{group.description}</div>
                              )}
                            </div>
                            <Badge
                              variant={group.active ? 'default' : 'secondary'}
                              className="ml-auto"
                            >
                              {group.active ? 'Ativo' : 'Inativo'}
                            </Badge>
                          </div>
                        ) : null}
                      </div>
                    )}
                  </div>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : (
        <div className="text-center py-16 text-muted-foreground">
          Endereçamento não encontrado.
        </div>
      )}
    </div>
  );
}
