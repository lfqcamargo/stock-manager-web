import {
  ArrowLeft,
  ArrowLeftRight,
  BookMarked,
  Calendar,
  CalendarDays,
  Columns3,
  FolderTree,
  Hash,
  Layers,
  MapPin,
  MessageSquare,
  Package,
  Rows3,
  Tag,
  TrendingDown,
  TrendingUp,
  User,
  Warehouse,
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';
import { useMovement } from '@/hooks/use-movement';
import { formatDate } from '@/utils/format-date';
import { getInitials } from '@/utils/get-initials';

// ── Helpers ───────────────────────────────────────────────────────────────────
function LabeledField({
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

function LocationItem({
  icon: Icon,
  label,
  code,
  name,
}: {
  icon: React.ElementType;
  label: string;
  code: string;
  name: string;
}) {
  return (
    <div className="rounded-lg border bg-muted/20 p-3 space-y-1">
      <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
        <Icon className="h-3.5 w-3.5 shrink-0" />
        <span>{label}</span>
      </div>
      <div className="font-mono text-xs text-primary">{code}</div>
      <div className="text-sm font-semibold leading-tight">{name}</div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────
export function MovementViewPage() {
  const { id } = useParams<{ id: string }>();

  const { useGetMovementById } = useMovement();
  const { data: movement, isLoading } = useGetMovementById(id!);

  return (
    <div className="flex-1 space-y-4 md:space-y-6">
      {/* ── Header ─────────────────────────────────────────────────────────── */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 p-4 md:p-6 lg:p-8 shadow-sm">
        <div className="flex items-start gap-3 md:gap-4">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="h-9 w-9 md:h-10 md:w-10 rounded-lg md:rounded-xl shadow-sm hover:shadow transition-all duration-200 shrink-0"
          >
            <Link to="/movement/movement">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div className="space-y-0.5 md:space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
                Detalhes da Movimentação
              </h1>
              {movement && (
                <Badge
                  variant={
                    movement.movementTypeDirection === 'IN'
                      ? 'default'
                      : 'destructive'
                  }
                  className="gap-1"
                >
                  {movement.movementTypeDirection === 'IN' ? (
                    <TrendingUp className="h-3 w-3" />
                  ) : (
                    <TrendingDown className="h-3 w-3" />
                  )}
                  {movement.movementTypeDirection === 'IN'
                    ? 'Entrada'
                    : 'Saída'}
                </Badge>
              )}
            </div>
            <p className="text-xs md:text-sm text-muted-foreground font-mono truncate max-w-sm">
              {movement?.id ?? '...'}
            </p>
          </div>
        </div>
      </div>

      {/* ── Content ────────────────────────────────────────────────────────── */}
      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <Card key={i} className={i === 2 ? 'lg:col-span-2' : ''}>
              <CardHeader>
                <Skeleton className="h-5 w-32" />
              </CardHeader>
              <CardContent className="space-y-4">
                {Array.from({ length: 3 }).map((_, j) => (
                  <Skeleton key={j} className="h-4 w-full" />
                ))}
              </CardContent>
            </Card>
          ))}
        </div>
      ) : !movement ? (
        <div className="text-center py-16 text-muted-foreground">
          Movimentação não encontrada.
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
          {/* ── Card: Informações do Movimento ───────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <ArrowLeftRight className="h-4 w-4 text-muted-foreground" />
                Informações do Movimento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <LabeledField
                icon={Tag}
                label="Tipo de Movimentação"
                value={
                  <span className="flex items-center gap-2 flex-wrap">
                    {movement.movementTypeName}
                    <Badge
                      variant={
                        movement.movementTypeDirection === 'IN'
                          ? 'default'
                          : 'destructive'
                      }
                      className="text-xs gap-1"
                    >
                      {movement.movementTypeDirection === 'IN' ? (
                        <TrendingUp className="h-3 w-3" />
                      ) : (
                        <TrendingDown className="h-3 w-3" />
                      )}
                      {movement.movementTypeDirection === 'IN'
                        ? 'Entrada'
                        : 'Saída'}
                    </Badge>
                  </span>
                }
              />
              <Separator />
              <LabeledField
                icon={Hash}
                label="Quantidade"
                value={`${movement.quantity} ${movement.materialUnit}`}
                mono
              />
              <Separator />
              <LabeledField
                icon={User}
                label="Usuário"
                value={movement.userName}
              />
              <Separator />
              <LabeledField
                icon={Calendar}
                label="Data da Movimentação"
                value={formatDate(movement.date)}
              />
              <Separator />
              <LabeledField
                icon={CalendarDays}
                label="Registrado em"
                value={formatDate(movement.createdAt)}
              />
            </CardContent>
          </Card>

          {/* ── Card: Observação ─────────────────────────────────────────── */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <MessageSquare className="h-4 w-4 text-muted-foreground" />
                Observação
              </CardTitle>
            </CardHeader>
            <CardContent>
              {movement.observation ? (
                <p className="text-sm leading-relaxed">
                  {movement.observation}
                </p>
              ) : (
                <p className="text-sm text-muted-foreground italic">
                  Sem observação registrada.
                </p>
              )}
            </CardContent>
          </Card>

          {/* ── Card: Endereçamento ───────────────────────────────────────── */}
          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Warehouse className="h-4 w-4 text-muted-foreground" />
                Endereçamento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                <LocationItem
                  icon={MapPin}
                  label="Localização"
                  code={movement.locationCode}
                  name={movement.locationName}
                />
                <LocationItem
                  icon={BookMarked}
                  label="Sub-localização"
                  code={movement.subLocationCode}
                  name={movement.subLocationName}
                />
                <LocationItem
                  icon={Rows3}
                  label="Fileira"
                  code={movement.rowCode}
                  name={movement.rowName}
                />
                <LocationItem
                  icon={Layers}
                  label="Prateleira"
                  code={movement.shelfCode}
                  name={movement.shelfName}
                />
                <LocationItem
                  icon={Columns3}
                  label="Posição"
                  code={movement.positionCode}
                  name={movement.positionName}
                />
              </div>
            </CardContent>
          </Card>

          <Card className="lg:col-span-2">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-base">
                <Package className="h-4 w-4 text-muted-foreground" />
                Material
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col md:flex-row gap-6">
                {/* Foto do material */}
                <div className="shrink-0">
                  <div className="h-24 w-24 rounded-xl border overflow-hidden bg-muted flex items-center justify-center">
                    {movement.materialPhotoUrl ? (
                      <img
                        src={movement.materialPhotoUrl}
                        alt={movement.materialName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <span className="text-2xl font-bold text-muted-foreground">
                        {getInitials(movement.materialName)}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  <LabeledField
                    icon={Hash}
                    label="Código"
                    value={movement.materialCode}
                    mono
                  />
                  <LabeledField
                    icon={Package}
                    label="Nome"
                    value={movement.materialName}
                  />
                  <LabeledField
                    icon={Tag}
                    label="Unidade"
                    value={movement.materialUnit}
                  />
                  <LabeledField
                    icon={FolderTree}
                    label="Grupo"
                    value={movement.materialGroupName || '—'}
                  />
                  {movement.materialDescription && (
                    <div className="col-span-full">
                      <LabeledField
                        icon={FolderTree}
                        label="Descrição"
                        value={movement.materialDescription}
                      />
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
