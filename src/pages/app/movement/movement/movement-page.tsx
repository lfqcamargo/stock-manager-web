import { useQuery } from '@tanstack/react-query';
import { parse } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import {
  ArrowLeft,
  LayoutGrid,
  Package,
  Plus,
  Search,
  Table,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { fetchLocations } from '@/api/stock/fetch-locations';
import { fetchMaterials } from '@/api/stock/fetch-materials';
import { fetchMovementTypes } from '@/api/stock/fetch-movement-types';
import { fetchPositions } from '@/api/stock/fetch-positions';
import { fetchRows } from '@/api/stock/fetch-rows';
import { fetchShelfs } from '@/api/stock/fetch-shelfs';
import { fetchSubLocations } from '@/api/stock/fetch-sub-locations';
import { MaterialCombobox } from '@/components/material-combobox';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebounce } from '@/hooks/use-debounce';
import { useMovement } from '@/hooks/use-movement';

import { MovementsCards } from './components/movements-cards';
import { MovementsTable } from './components/movimentacoes-table';

export type SortField = 'quantity' | 'date' | 'createdAt';
export type SortDirection = 'asc' | 'desc';

export function MovementPage() {
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchParams, setSearchParams] = useSearchParams();

  // ── Sort state ───────────────────────────────────────────────────────────────
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // ── Filtros espaciais em cascata ─────────────────────────────────────────────
  const [locationFilter, setLocationFilter] = useState('all');
  const [subLocationFilter, setSubLocationFilter] = useState('all');
  const [rowFilter, setRowFilter] = useState('all');
  const [shelfFilter, setShelfFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');

  // ── Filtros de conteúdo ──────────────────────────────────────────────────────
  const [materialFilter, setMaterialFilter] = useState('all');
  const [materialSearch, setMaterialSearch] = useState('');
  const matSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMatSearchChange = useCallback((search: string) => {
    if (matSearchTimerRef.current) clearTimeout(matSearchTimerRef.current);
    matSearchTimerRef.current = setTimeout(
      () => setMaterialSearch(search),
      300,
    );
  }, []);

  const [directionFilter, setDirectionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [observationFilter, setObservationFilter] = useState('');

  const debouncedObs = useDebounce(observationFilter, 500);

  // ── Paginação ────────────────────────────────────────────────────────────────
  const page = z.coerce
    .number()
    .transform((p) => p - 1)
    .parse(searchParams.get('page') ?? '1');

  // ── Filtro de data ────────────────────────────────────────────────────────────
  const dateFromStr = searchParams.get('dateFrom');
  const dateToStr = searchParams.get('dateTo');
  const dateRange: DateRange | undefined =
    dateFromStr || dateToStr
      ? {
          from: dateFromStr
            ? parse(dateFromStr, 'yyyy-MM-dd', new Date(), { locale: ptBR })
            : undefined,
          to: dateToStr
            ? parse(dateToStr, 'yyyy-MM-dd', new Date(), { locale: ptBR })
            : undefined,
        }
      : undefined;

  function handleDateRangeChange(range: DateRange | undefined) {
    setSearchParams((s) => {
      const next = new URLSearchParams(s);
      if (range?.from) {
        next.set('dateFrom', range.from.toISOString().split('T')[0]);
      } else {
        next.delete('dateFrom');
      }
      if (range?.to) {
        next.set('dateTo', range.to.toISOString().split('T')[0]);
      } else {
        next.delete('dateTo');
      }
      next.set('page', '1');
      return next;
    });
  }

  // ── Dados de referência ──────────────────────────────────────────────────────
  const { data: locData } = useQuery({
    queryKey: ['locations', 0, 100, undefined],
    queryFn: () => fetchLocations({ page: 0, limit: 100 }),
  });

  const { data: subLocData } = useQuery({
    queryKey: [
      'subLocations',
      0,
      100,
      { locationId: locationFilter !== 'all' ? locationFilter : undefined },
    ],
    queryFn: () =>
      fetchSubLocations({
        page: 0,
        limit: 100,
        locationId: locationFilter !== 'all' ? locationFilter : undefined,
      }),
  });

  const { data: rowData } = useQuery({
    queryKey: ['rows', 0, 100, undefined],
    queryFn: () => fetchRows({ page: 0, limit: 100 }),
  });

  const { data: shelfData } = useQuery({
    queryKey: ['shelfs', 0, 100, undefined],
    queryFn: () => fetchShelfs({ page: 0, limit: 100 }),
  });

  const { data: positionData } = useQuery({
    queryKey: ['positions', 0, 100, undefined],
    queryFn: () => fetchPositions({ page: 0, limit: 100 }),
  });

  const { data: matData, isFetching: matFetching } = useQuery({
    queryKey: [
      'materials',
      0,
      100,
      {
        orderBy: 'name',
        orderDirection: 'asc',
        active: true,
        name: materialSearch || undefined,
      },
    ],
    queryFn: () =>
      fetchMaterials(0, 100, {
        orderBy: 'name',
        orderDirection: 'asc',
        active: true,
        name: materialSearch || undefined,
      }),
  });

  const { data: typesData } = useQuery({
    queryKey: ['movementTypes', 0, 100, undefined],
    queryFn: () => fetchMovementTypes({ page: 0, limit: 100 }),
  });

  const filteredTypes =
    directionFilter === 'all'
      ? (typesData?.movementTypes ?? [])
      : (typesData?.movementTypes ?? []).filter(
          (t) => t.direction === directionFilter,
        );

  // ── Query principal de movimentos ────────────────────────────────────────────
  const { useGetMovements } = useMovement();
  const { data: movementsData, isLoading } = useGetMovements(page, 20, {
    locationId: locationFilter !== 'all' ? locationFilter : undefined,
    subLocationId: subLocationFilter !== 'all' ? subLocationFilter : undefined,
    rowId: rowFilter !== 'all' ? rowFilter : undefined,
    shelfId: shelfFilter !== 'all' ? shelfFilter : undefined,
    positionId: positionFilter !== 'all' ? positionFilter : undefined,
    materialId: materialFilter !== 'all' ? materialFilter : undefined,
    direction:
      directionFilter !== 'all' ? (directionFilter as 'IN' | 'OUT') : undefined,
    movementTypeId: typeFilter !== 'all' ? typeFilter : undefined,
    dateFrom: dateFromStr ?? undefined,
    dateTo: dateToStr ?? undefined,
    orderBy: sortField,
    orderDirection: sortDirection,
  });

  // Filtro client-side de observação
  const movements = (movementsData?.movements ?? []).filter(
    (m) =>
      !debouncedObs ||
      (m.observation ?? '').toLowerCase().includes(debouncedObs.toLowerCase()),
  );

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function resetPage() {
    setSearchParams((s) => {
      s.set('page', '1');
      return s;
    });
  }

  function handlePaginate(newPage: number) {
    setSearchParams((state) => {
      state.set('page', (newPage + 1).toString());
      return state;
    });
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection(field === 'date' ? 'desc' : 'asc');
    }
    resetPage();
  }

  function handleFilterChange(
    setter: (v: string) => void,
    dependents?: Array<() => void>,
  ) {
    return (v: string) => {
      setter(v);
      dependents?.forEach((reset) => reset());
      resetPage();
    };
  }

  function clearFilters() {
    setLocationFilter('all');
    setSubLocationFilter('all');
    setRowFilter('all');
    setShelfFilter('all');
    setPositionFilter('all');
    setMaterialFilter('all');
    setDirectionFilter('all');
    setTypeFilter('all');
    setObservationFilter('');
    setSearchParams((s) => {
      const next = new URLSearchParams(s);
      next.delete('dateFrom');
      next.delete('dateTo');
      next.set('page', '1');
      return next;
    });
  }

  const hasActiveFilters =
    locationFilter !== 'all' ||
    subLocationFilter !== 'all' ||
    rowFilter !== 'all' ||
    shelfFilter !== 'all' ||
    positionFilter !== 'all' ||
    materialFilter !== 'all' ||
    directionFilter !== 'all' ||
    typeFilter !== 'all' ||
    observationFilter !== '' ||
    !!dateRange;

  return (
    <div className="flex-1 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 p-4 md:p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3 md:gap-4">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="h-9 w-9 md:h-10 md:w-10 rounded-lg md:rounded-xl shadow-sm hover:shadow transition-all duration-200"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="space-y-0.5 md:space-y-1">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
                Movimentações
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Gerencie todas as movimentações de estoque
              </p>
            </div>
          </div>
          <Button
            onClick={() => void navigate('/movement/movement/new')}
            className="rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-9 md:h-10 lg:h-11 w-full md:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="md:inline">Nova Movimentação</span>
          </Button>
        </div>
      </div>

      {/* Filtros + View Toggle + Content */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm overflow-hidden">
        {/* Cabeçalho com toggle de view */}
        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Lista de Movimentações</h2>
          <Tabs
            value={viewMode}
            onValueChange={(v) => setViewMode(v as 'table' | 'cards')}
            className="w-auto"
          >
            <TabsList>
              <TabsTrigger value="table" className="flex items-center gap-2">
                <Table className="h-4 w-4" />
                <span className="hidden sm:inline">Tabela</span>
              </TabsTrigger>
              <TabsTrigger value="cards" className="flex items-center gap-2">
                <LayoutGrid className="h-4 w-4" />
                <span className="hidden sm:inline">Cards</span>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* ── Filtros — sempre visíveis independente da view ─────────────────── */}
        <div className="px-4 md:px-6 pt-4 md:pt-6 space-y-4">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {/* Localização */}
            <Select
              value={locationFilter}
              onValueChange={handleFilterChange(setLocationFilter, [
                () => setSubLocationFilter('all'),
              ])}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Localização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as localizações</SelectItem>
                {locData?.locations?.map((l) => (
                  <SelectItem key={l.id} value={l.id}>
                    {l.code} — {l.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sub-localização */}
            <Select
              value={subLocationFilter}
              onValueChange={handleFilterChange(setSubLocationFilter)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Sub-localização" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as sub-localizações</SelectItem>
                {subLocData?.subLocations?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.code} — {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Fileira */}
            <Select
              value={rowFilter}
              onValueChange={handleFilterChange(setRowFilter)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Fileira" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as fileiras</SelectItem>
                {rowData?.rows?.map((r) => (
                  <SelectItem key={r.id} value={r.id}>
                    {r.code} — {r.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Prateleira */}
            <Select
              value={shelfFilter}
              onValueChange={handleFilterChange(setShelfFilter)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Prateleira" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as prateleiras</SelectItem>
                {shelfData?.shelfs?.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.code} — {s.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Posição */}
            <Select
              value={positionFilter}
              onValueChange={handleFilterChange(setPositionFilter)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Posição" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas as posições</SelectItem>
                {positionData?.positions?.map((p) => (
                  <SelectItem key={p.id} value={p.id}>
                    {p.code} — {p.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Material */}
            <MaterialCombobox
              materials={matData?.materials ?? []}
              value={materialFilter}
              onValueChange={handleFilterChange(setMaterialFilter)}
              onSearchChange={handleMatSearchChange}
              isLoading={matFetching}
              showAllOption
              allLabel="Todos os materiais"
              placeholder="Material"
              triggerClassName="h-10"
            />

            {/* Direção */}
            <Select
              value={directionFilter}
              onValueChange={handleFilterChange(setDirectionFilter, [
                () => setTypeFilter('all'),
              ])}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Direção" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Entrada e Saída</SelectItem>
                <SelectItem value="IN">Entrada (IN)</SelectItem>
                <SelectItem value="OUT">Saída (OUT)</SelectItem>
              </SelectContent>
            </Select>

            {/* Tipo de movimento */}
            <Select
              value={typeFilter}
              onValueChange={handleFilterChange(setTypeFilter)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Tipo de movimento" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os tipos</SelectItem>
                {filteredTypes.map((t) => (
                  <SelectItem key={t.id} value={t.id}>
                    {t.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Observação */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Observação..."
                className="h-10 pl-9"
                value={observationFilter}
                onChange={(e) => {
                  setObservationFilter(e.target.value);
                  resetPage();
                }}
              />
            </div>

            {/* Período */}
            <div className="sm:col-span-2 lg:col-span-3 xl:col-span-2">
              <DateRangePicker
                date={dateRange}
                onDateChange={handleDateRangeChange}
                placeholder="Período da movimentação"
                className="h-10 w-full"
              />
            </div>
          </div>

          {/* Resumo */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pb-4">
            <div className="flex items-center gap-2">
              <Package className="h-4 w-4" />
              <span>
                {movementsData
                  ? `${movementsData.meta.totalItems} movimentações`
                  : 'Carregando...'}
                {movementsData &&
                  movementsData.meta.totalPages > 1 &&
                  ` • Página ${page + 1} de ${movementsData.meta.totalPages}`}
              </span>
            </div>
            {hasActiveFilters && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpar filtros
              </Button>
            )}
          </div>
        </div>

        {/* ── Conteúdo da view ────────────────────────────────────────────────── */}
        {viewMode === 'table' ? (
          <MovementsTable
            isLoading={isLoading}
            movements={movements}
            movementsData={movementsData}
            page={page}
            sortField={sortField}
            sortDirection={sortDirection}
            onSort={handleSort}
            onPaginate={handlePaginate}
          />
        ) : (
          <div className="px-4 md:px-6 pb-4 md:pb-6">
            <MovementsCards
              isLoading={isLoading}
              movements={movements}
              meta={movementsData?.meta}
              onPaginate={handlePaginate}
            />
          </div>
        )}
      </div>
    </div>
  );
}
