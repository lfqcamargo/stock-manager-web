import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import {
  AlertCircle,
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  MapPin,
  Package,
} from 'lucide-react';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { z } from 'zod';

import { fetchAddressings } from '@/api/stock/fetch-addressings';
import { fetchLocations } from '@/api/stock/fetch-locations';
import { fetchMaterials } from '@/api/stock/fetch-materials';
import { fetchPositions } from '@/api/stock/fetch-positions';
import { fetchRows } from '@/api/stock/fetch-rows';
import { fetchShelfs } from '@/api/stock/fetch-shelfs';
import { fetchSubLocations } from '@/api/stock/fetch-sub-locations';
import { EntityCombobox } from '@/components/entity-combobox';
import { MaterialCombobox } from '@/components/material-combobox';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';
import { Textarea } from '@/components/ui/textarea';
import { useMovement } from '@/hooks/use-movement';
import { useMovementType } from '@/hooks/use-movement-type';
import { cn } from '@/lib/utils';

const schema = z.object({
  addressingId: z.string().min(1, 'Endereçamento é obrigatório'),
  movementTypeId: z.string().min(1, 'Tipo de movimento é obrigatório'),
  quantity: z.coerce
    .number()
    .int('Informe um número inteiro')
    .positive('Quantidade deve ser maior que zero'),
  date: z.string().min(1, 'Data é obrigatória'),
  observation: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export function CreateMovementPage() {
  const navigate = useNavigate();

  const [locationFilter, setLocationFilter] = useState('');
  const [subLocationFilter, setSubLocationFilter] = useState('');
  const [rowFilter, setRowFilter] = useState('');
  const [shelfFilter, setShelfFilter] = useState('');
  const [positionFilter, setPositionFilter] = useState('');
  const [materialFilter, setMaterialFilter] = useState('');
  const [materialSearch, setMaterialSearch] = useState('');
  const matSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMatSearchChange = useCallback((search: string) => {
    if (matSearchTimerRef.current) clearTimeout(matSearchTimerRef.current);
    matSearchTimerRef.current = setTimeout(
      () => setMaterialSearch(search),
      300,
    );
  }, []);

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { date: new Date().toISOString().split('T')[0] },
  });

  const { useGetMovementTypes } = useMovementType();
  const { useCreateMovement } = useMovement();
  const { data: typesData } = useGetMovementTypes(0, 100);
  const { mutateAsync: createMovementFn } = useCreateMovement();

  const { data: locData } = useQuery({
    queryKey: ['locations', 0, 100, { orderBy: 'code', orderDirection: 'asc' }],
    queryFn: () =>
      fetchLocations({
        page: 0,
        limit: 100,
        orderBy: 'code',
        orderDirection: 'asc',
      }),
  });
  const { data: subLocData } = useQuery({
    queryKey: [
      'subLocations',
      0,
      100,
      {
        locationId: locationFilter || undefined,
        orderBy: 'code',
        orderDirection: 'asc',
      },
    ],
    queryFn: () =>
      fetchSubLocations({
        page: 0,
        limit: 100,
        locationId: locationFilter || undefined,
        orderBy: 'code',
        orderDirection: 'asc',
      }),
  });
  const { data: rowData } = useQuery({
    queryKey: ['rows', 0, 100, { orderBy: 'code', orderDirection: 'asc' }],
    queryFn: () =>
      fetchRows({
        page: 0,
        limit: 100,
        orderBy: 'code',
        orderDirection: 'asc',
      }),
  });
  const { data: shelfData } = useQuery({
    queryKey: ['shelfs', 0, 100, { orderBy: 'code', orderDirection: 'asc' }],
    queryFn: () =>
      fetchShelfs({
        page: 0,
        limit: 100,
        orderBy: 'code',
        orderDirection: 'asc',
      }),
  });
  const { data: positionData } = useQuery({
    queryKey: ['positions', 0, 100, { orderBy: 'code', orderDirection: 'asc' }],
    queryFn: () =>
      fetchPositions({
        page: 0,
        limit: 100,
        orderBy: 'code',
        orderDirection: 'asc',
      }),
  });
  const { data: matData, isFetching: matFetching } = useQuery({
    queryKey: [
      'materials',
      0,
      100,
      {
        orderBy: 'code',
        orderDirection: 'asc',
        active: true,
        name: materialSearch || undefined,
      },
    ],
    queryFn: () =>
      fetchMaterials(0, 100, {
        orderBy: 'code',
        orderDirection: 'asc',
        active: true,
        name: materialSearch || undefined,
      }),
  });

  const { data: addressingsData, isLoading: isLoadingAddressings } = useQuery({
    queryKey: [
      'addressings',
      0,
      100,
      {
        active: true,
        locationId: locationFilter || undefined,
        subLocationId: subLocationFilter || undefined,
        rowId: rowFilter || undefined,
        shelfId: shelfFilter || undefined,
        positionId: positionFilter || undefined,
        materialId: materialFilter || undefined,
      },
    ],
    queryFn: () =>
      fetchAddressings({
        page: 0,
        limit: 100,
        active: true,
        locationId: locationFilter || undefined,
        subLocationId: subLocationFilter || undefined,
        rowId: rowFilter || undefined,
        shelfId: shelfFilter || undefined,
        positionId: positionFilter || undefined,
        materialId: materialFilter || undefined,
      }),
  });

  const addressings = addressingsData?.addressings ?? [];

  const selectedTypeId = useWatch({ control, name: 'movementTypeId' });
  const selectedAddressingId = useWatch({ control, name: 'addressingId' });
  const quantity = useWatch({ control, name: 'quantity' });

  const selectedType = typesData?.movementTypes.find(
    (t) => t.id === selectedTypeId,
  );
  const selectedAddressing = useMemo(
    () => addressings.find((a) => a.id === selectedAddressingId),
    [addressings, selectedAddressingId],
  );

  const qty = Number(quantity) || 0;
  const currentAmount = selectedAddressing?.amount ?? 0;
  const isIN = selectedType?.direction === 'IN';
  const isOUT = selectedType?.direction === 'OUT';
  const projectedAmount =
    selectedAddressing && selectedType
      ? isIN
        ? currentAmount + qty
        : currentAmount - qty
      : null;
  const willGoNegative =
    isOUT && projectedAmount !== null && projectedAmount < 0;

  useEffect(() => {
    setValue('addressingId', '');
  }, [
    locationFilter,
    subLocationFilter,
    rowFilter,
    shelfFilter,
    positionFilter,
    materialFilter,
    setValue,
  ]);

  function clearFilters() {
    setLocationFilter('');
    setSubLocationFilter('');
    setRowFilter('');
    setShelfFilter('');
    setPositionFilter('');
    setMaterialFilter('');
  }

  async function onSubmit(data: FormData) {
    await createMovementFn({
      addressingId: data.addressingId,
      movementTypeId: data.movementTypeId,
      quantity: data.quantity,
      date: data.date,
      observation: data.observation || undefined,
    });
    reset({ date: new Date().toISOString().split('T')[0] });
    clearFilters();
    void navigate('/movement/movement');
  }

  const hasActiveFilter = !!(
    locationFilter ||
    subLocationFilter ||
    rowFilter ||
    shelfFilter ||
    positionFilter ||
    materialFilter
  );

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex-1 space-y-4 md:space-y-6"
    >
      {/* Header */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-start gap-3 md:gap-4">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 md:h-10 md:w-10 rounded-lg md:rounded-xl shadow-sm shrink-0"
              onClick={() => void navigate('/movement/movement')}
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="space-y-0.5">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
                Nova Movimentação
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Filtre o endereçamento e registre a movimentação de estoque
              </p>
            </div>
          </div>
          <div className="flex gap-3 md:shrink-0">
            <Button
              type="button"
              variant="outline"
              onClick={() => void navigate('/movement/movement')}
              disabled={isSubmitting}
              className="flex-1 md:flex-none"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 md:flex-none"
            >
              {isSubmitting ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Salvando...
                </span>
              ) : (
                'Salvar Movimentação'
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* ── Coluna esquerda: filtros + endereçamento ── */}
        <div className="space-y-4 md:space-y-6">
          {/* Filtros */}
          <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-4 w-4 text-muted-foreground" />
              <h2 className="font-semibold">Filtros de endereçamento</h2>
              {hasActiveFilter && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="ml-auto h-auto py-1 px-2 text-xs text-muted-foreground"
                  onClick={clearFilters}
                >
                  Limpar filtros
                </Button>
              )}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Localização
                </Label>
                <EntityCombobox
                  options={(locData?.locations ?? []).map((l) => ({
                    id: l.id,
                    code: l.code,
                    name: l.name,
                  }))}
                  value={locationFilter}
                  onValueChange={(v) => {
                    setLocationFilter(v);
                    setSubLocationFilter('');
                    setValue('addressingId', '');
                  }}
                  placeholder="Todas as localizações"
                  searchPlaceholder="Buscar por código ou nome..."
                  clearLabel="Todas as localizações"
                  triggerClassName="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Sub-localização
                </Label>
                <EntityCombobox
                  options={(subLocData?.subLocations ?? []).map((s) => ({
                    id: s.id,
                    code: s.code,
                    name: s.name,
                  }))}
                  value={subLocationFilter}
                  onValueChange={(v) => {
                    setSubLocationFilter(v);
                    setValue('addressingId', '');
                  }}
                  placeholder="Todas as sub-localizações"
                  searchPlaceholder="Buscar por código ou nome..."
                  clearLabel="Todas as sub-localizações"
                  triggerClassName="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Fileira</Label>
                <EntityCombobox
                  options={(rowData?.rows ?? []).map((r) => ({
                    id: r.id,
                    code: r.code,
                    name: r.name,
                  }))}
                  value={rowFilter}
                  onValueChange={(v) => {
                    setRowFilter(v);
                    setValue('addressingId', '');
                  }}
                  placeholder="Todas as fileiras"
                  searchPlaceholder="Buscar por código ou nome..."
                  clearLabel="Todas as fileiras"
                  triggerClassName="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Prateleira
                </Label>
                <EntityCombobox
                  options={(shelfData?.shelfs ?? []).map((s) => ({
                    id: s.id,
                    code: s.code,
                    name: s.name,
                  }))}
                  value={shelfFilter}
                  onValueChange={(v) => {
                    setShelfFilter(v);
                    setValue('addressingId', '');
                  }}
                  placeholder="Todas as prateleiras"
                  searchPlaceholder="Buscar por código ou nome..."
                  clearLabel="Todas as prateleiras"
                  triggerClassName="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">Posição</Label>
                <EntityCombobox
                  options={(positionData?.positions ?? []).map((p) => ({
                    id: p.id,
                    code: p.code,
                    name: p.name,
                  }))}
                  value={positionFilter}
                  onValueChange={(v) => {
                    setPositionFilter(v);
                    setValue('addressingId', '');
                  }}
                  placeholder="Todas as posições"
                  searchPlaceholder="Buscar por código ou nome..."
                  clearLabel="Todas as posições"
                  triggerClassName="h-10"
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs text-muted-foreground">
                  Material
                </Label>
                <MaterialCombobox
                  materials={(matData?.materials ?? []).map((m) => ({
                    ...m,
                    description: undefined,
                  }))}
                  value={materialFilter || 'all'}
                  onValueChange={(v) => {
                    setMaterialFilter(v === 'all' ? '' : v);
                    setValue('addressingId', '');
                  }}
                  onSearchChange={handleMatSearchChange}
                  isLoading={matFetching}
                  showAllOption
                  allLabel="Todos os materiais"
                  placeholder="Todos os materiais"
                  triggerClassName="h-10"
                />
              </div>
            </div>
          </div>

          {/* Seleção de endereçamento */}
          <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6">
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-semibold">Endereçamento</h2>
              <span className="text-xs text-muted-foreground">
                {isLoadingAddressings
                  ? 'Carregando...'
                  : `${addressings.length} encontrado${addressings.length !== 1 ? 's' : ''}`}
              </span>
            </div>
            <Controller
              name="addressingId"
              control={control}
              render={({ field }) => (
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? ''}
                >
                  <SelectTrigger className="h-11">
                    <SelectValue placeholder="Selecione o endereçamento" />
                  </SelectTrigger>
                  <SelectContent>
                    {addressings.length === 0 ? (
                      <div className="px-3 py-4 text-center text-sm text-muted-foreground">
                        {isLoadingAddressings
                          ? 'Carregando...'
                          : hasActiveFilter
                            ? 'Nenhum endereçamento com esses filtros'
                            : 'Nenhum endereçamento ativo'}
                      </div>
                    ) : (
                      addressings.map((a) => {
                        const loc = [
                          a.location?.code,
                          a.subLocation?.code,
                          a.row?.code,
                          a.shelf?.code,
                          a.position?.code,
                        ]
                          .filter(Boolean)
                          .join(' / ');
                        const mat = a.material
                          ? ` · ${a.material.code} — ${a.material.name}`
                          : '';
                        return (
                          <SelectItem key={a.id} value={a.id}>
                            {loc}
                            {mat}
                          </SelectItem>
                        );
                      })
                    )}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.addressingId && (
              <p className="mt-1.5 text-sm text-destructive">
                {errors.addressingId.message}
              </p>
            )}
          </div>

          {/* Card do endereçamento selecionado */}
          {selectedAddressing && (
            <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm overflow-hidden">
              {/* Localização */}
              <div className="px-4 py-3 border-b border-border/30">
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                  <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                    Localização
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 text-xs">
                  {[
                    [
                      'Local',
                      `${selectedAddressing.location.code} — ${selectedAddressing.location.name}`,
                    ],
                    [
                      'Sub-local',
                      `${selectedAddressing.subLocation.code} — ${selectedAddressing.subLocation.name}`,
                    ],
                    [
                      'Fileira',
                      `${selectedAddressing.row.code} — ${selectedAddressing.row.name}`,
                    ],
                    [
                      'Prateleira',
                      `${selectedAddressing.shelf.code} — ${selectedAddressing.shelf.name}`,
                    ],
                    [
                      'Posição',
                      `${selectedAddressing.position.code} — ${selectedAddressing.position.name}`,
                    ],
                  ].map(([label, value]) => (
                    <div key={label}>
                      <span className="text-muted-foreground">{label}: </span>
                      <span className="font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Material */}
              {selectedAddressing.material && (
                <div className="px-4 py-3 border-b border-border/30">
                  <div className="flex items-center gap-2 mb-1">
                    <Package className="h-3.5 w-3.5 text-muted-foreground" />
                    <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                      Material
                    </span>
                  </div>
                  <span className="text-sm font-medium">
                    {selectedAddressing.material.code} —{' '}
                    {selectedAddressing.material.name}
                  </span>
                  <span className="text-xs text-muted-foreground ml-2">
                    ({selectedAddressing.material.unit})
                  </span>
                </div>
              )}

              {/* Saldo */}
              <div className="px-4 py-4">
                <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
                  Saldo
                </span>
                <div className="mt-3 flex items-stretch gap-3">
                  <div className="flex-1 rounded-lg bg-muted/40 border border-border/50 p-4 text-center">
                    <p className="text-xs text-muted-foreground mb-1">Atual</p>
                    <p className="text-3xl font-bold tabular-nums">
                      {currentAmount}
                    </p>
                  </div>
                  <div className="flex flex-col items-center justify-center gap-1 shrink-0 w-12">
                    {qty > 0 && selectedType ? (
                      <>
                        <div
                          className={cn(
                            'flex items-center justify-center h-8 w-8 rounded-full',
                            isIN
                              ? 'bg-green-100 text-green-600 dark:bg-green-950 dark:text-green-400'
                              : 'bg-red-100 text-red-600 dark:bg-red-950 dark:text-red-400',
                          )}
                        >
                          {isIN ? (
                            <ArrowUp className="h-4 w-4" />
                          ) : (
                            <ArrowDown className="h-4 w-4" />
                          )}
                        </div>
                        <span
                          className={cn(
                            'text-xs font-bold tabular-nums',
                            isIN
                              ? 'text-green-600 dark:text-green-400'
                              : 'text-red-600 dark:text-red-400',
                          )}
                        >
                          {isIN ? '+' : '-'}
                          {qty}
                        </span>
                      </>
                    ) : (
                      <ArrowRight className="h-5 w-5 text-muted-foreground/30" />
                    )}
                  </div>
                  <div
                    className={cn(
                      'flex-1 rounded-lg border p-4 text-center',
                      projectedAmount === null
                        ? 'bg-muted/20 border-border/50'
                        : willGoNegative
                          ? 'bg-red-50 border-red-200 dark:bg-red-950/30 dark:border-red-800'
                          : 'bg-green-50 border-green-200 dark:bg-green-950/30 dark:border-green-800',
                    )}
                  >
                    <p className="text-xs text-muted-foreground mb-1">
                      Após movimentação
                    </p>
                    {projectedAmount === null ? (
                      <p className="text-3xl font-bold text-muted-foreground/30 tabular-nums">
                        —
                      </p>
                    ) : (
                      <p
                        className={cn(
                          'text-3xl font-bold tabular-nums',
                          willGoNegative
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-green-600 dark:text-green-400',
                        )}
                      >
                        {projectedAmount}
                      </p>
                    )}
                  </div>
                </div>
                {willGoNegative && (
                  <p className="mt-2 text-xs text-red-600 dark:text-red-400 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 shrink-0" />
                    Saldo insuficiente — a operação resultará em saldo negativo.
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

        {/* ── Coluna direita: tipo, quantidade, data, observação ── */}
        <div className="space-y-4 md:space-y-6">
          <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 space-y-5">
            <h2 className="font-semibold">Dados da Movimentação</h2>

            {/* Tipo de Movimento */}
            <div className="space-y-1.5">
              <Label>Tipo de Movimento</Label>
              <Controller
                name="movementTypeId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {typesData?.movementTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name} (
                          {type.direction === 'IN' ? 'Entrada' : 'Saída'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.movementTypeId && (
                <p className="text-sm text-destructive">
                  {errors.movementTypeId.message}
                </p>
              )}
            </div>

            {/* Aviso saída sem saldo suficiente */}
            {selectedType?.direction === 'OUT' && !willGoNegative && (
              <Alert
                variant="destructive"
                className="border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-800 dark:bg-amber-950/30 dark:text-amber-400 [&>svg]:text-amber-600"
              >
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Tipo de saída selecionado. Confirme o saldo antes de salvar.
                </AlertDescription>
              </Alert>
            )}

            <Separator />

            {/* Quantidade e Data */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  placeholder="0"
                  className="h-11"
                  {...register('quantity')}
                />
                {errors.quantity && (
                  <p className="text-sm text-destructive">
                    {errors.quantity.message}
                  </p>
                )}
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  className="h-11"
                  {...register('date')}
                />
                {errors.date && (
                  <p className="text-sm text-destructive">
                    {errors.date.message}
                  </p>
                )}
              </div>
            </div>

            {/* Observação */}
            <div className="space-y-1.5">
              <Label htmlFor="observation">
                Observação{' '}
                <span className="text-muted-foreground font-normal">
                  (opcional)
                </span>
              </Label>
              <Textarea
                id="observation"
                placeholder="Observação da movimentação..."
                className="resize-none min-h-[120px]"
                {...register('observation')}
              />
            </div>
          </div>

          {/* Resumo da operação */}
          {selectedAddressing && selectedType && qty > 0 && (
            <div
              className={cn(
                'rounded-lg md:rounded-2xl border p-4 md:p-6 space-y-2',
                willGoNegative
                  ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
                  : 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950/20',
              )}
            >
              <h3
                className={cn(
                  'font-semibold text-sm',
                  willGoNegative
                    ? 'text-red-700 dark:text-red-400'
                    : 'text-green-700 dark:text-green-400',
                )}
              >
                Resumo da operação
              </h3>
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tipo:</span>
                  <span className="font-medium">
                    {selectedType.name} ({isIN ? 'Entrada' : 'Saída'})
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Quantidade:</span>
                  <span
                    className={cn(
                      'font-bold',
                      isIN
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-red-600 dark:text-red-400',
                    )}
                  >
                    {isIN ? '+' : '-'}
                    {qty}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Saldo atual:</span>
                  <span className="font-medium">{currentAmount}</span>
                </div>
                <Separator className="my-1" />
                <div className="flex justify-between">
                  <span className="text-muted-foreground font-medium">
                    Saldo após:
                  </span>
                  <span
                    className={cn(
                      'font-bold text-base',
                      willGoNegative
                        ? 'text-red-600 dark:text-red-400'
                        : 'text-green-600 dark:text-green-400',
                    )}
                  >
                    {projectedAmount}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </form>
  );
}
