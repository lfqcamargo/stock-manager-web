import { useQuery } from '@tanstack/react-query';
import { parse } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  Package,
  Search,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { fetchLocations } from '@/api/stock/fetch-locations';
import { fetchMaterials } from '@/api/stock/fetch-materials';
import { fetchMovementTypes } from '@/api/stock/fetch-movement-types';
import type { Movement } from '@/api/stock/fetch-movements';
import { fetchPositions } from '@/api/stock/fetch-positions';
import { fetchRows } from '@/api/stock/fetch-rows';
import { fetchShelfs } from '@/api/stock/fetch-shelfs';
import { fetchSubLocations } from '@/api/stock/fetch-sub-locations';
import { MaterialCombobox } from '@/components/material-combobox';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useDebounce } from '@/hooks/use-debounce';
import { useMovement } from '@/hooks/use-movement';
import { formatDate } from '@/utils/format-date';

type SortField = 'quantity' | 'date' | 'createdAt';
type SortDirection = 'asc' | 'desc';

interface SortIconProps {
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
}

function SortIcon({ field, sortField, sortDirection }: SortIconProps) {
  if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
  return sortDirection === 'asc' ? (
    <ArrowUp className="ml-2 h-4 w-4" />
  ) : (
    <ArrowDown className="ml-2 h-4 w-4" />
  );
}

export function MovementsTable() {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filtros espaciais em cascata
  const [locationFilter, setLocationFilter] = useState('all');
  const [subLocationFilter, setSubLocationFilter] = useState('all');
  const [rowFilter, setRowFilter] = useState('all');
  const [shelfFilter, setShelfFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');

  // Filtros de conteúdo
  const [materialFilter, setMaterialFilter] = useState('all');
  const [materialSearch, setMaterialSearch] = useState('');
  const matSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleMatSearchChange = useCallback((search: string) => {
    if (matSearchTimerRef.current) clearTimeout(matSearchTimerRef.current);
    matSearchTimerRef.current = setTimeout(() => setMaterialSearch(search), 300);
  }, []);
  const [directionFilter, setDirectionFilter] = useState('all');
  const [typeFilter, setTypeFilter] = useState('all');
  const [observationFilter, setObservationFilter] = useState('');

  const debouncedObs = useDebounce(observationFilter, 500);

  const page = z.coerce
    .number()
    .transform((p) => p - 1)
    .parse(searchParams.get('page') ?? '1');

  // Filtro de data — armazenado no searchParams igual à página de usuários
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

  // ── Dados de referência — exatamente o mesmo padrão do AddressingTable ───────
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
      { orderBy: 'name', orderDirection: 'asc', active: true, name: materialSearch || undefined },
    ],
    queryFn: () =>
      fetchMaterials(0, 100, {
        orderBy: 'name',
        orderDirection: 'asc',
        active: true,
        name: materialSearch || undefined,
      }),
  });

  const { data: typesData, isLoading: isLoadingTypes } = useQuery({
    queryKey: ['movementTypes', 0, 100, undefined],
    queryFn: () => fetchMovementTypes({ page: 0, limit: 100 }),
  });

  // Tipos filtrados pela direção selecionada
  const filteredTypes =
    directionFilter === 'all'
      ? (typesData?.movementTypes ?? [])
      : (typesData?.movementTypes ?? []).filter(
          (t) => t.direction === directionFilter,
        );

  // ── Query principal de movimentos ────────────────────────────────────────────
  const { useGetMovements } = useMovement();
  const { data: movementsData, isLoading: isLoadingMovements } =
    useGetMovements(page, 20, {
      locationId: locationFilter !== 'all' ? locationFilter : undefined,
      subLocationId:
        subLocationFilter !== 'all' ? subLocationFilter : undefined,
      rowId: rowFilter !== 'all' ? rowFilter : undefined,
      shelfId: shelfFilter !== 'all' ? shelfFilter : undefined,
      positionId: positionFilter !== 'all' ? positionFilter : undefined,
      materialId: materialFilter !== 'all' ? materialFilter : undefined,
      direction:
        directionFilter !== 'all'
          ? (directionFilter as 'IN' | 'OUT')
          : undefined,
      movementTypeId: typeFilter !== 'all' ? typeFilter : undefined,
      dateFrom: dateFromStr ?? undefined,
      dateTo: dateToStr ?? undefined,
      orderBy: sortField,
      orderDirection: sortDirection,
    });

  const isLoading = isLoadingMovements || isLoadingTypes;

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

  function handlePaginate(p: number) {
    setSearchParams((s) => {
      s.set('page', p.toString());
      return s;
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
    <div className="space-y-6 p-4 md:p-6">
      {/* ── Filtros ─────────────────────────────────────────────────────────── */}
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

        {/* Sub-localização (cascata por locationId) */}
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

        {/* Período (data da movimentação) */}
        <div className="sm:col-span-2 lg:col-span-3 xl:col-span-2">
          <DateRangePicker
            date={dateRange}
            onDateChange={handleDateRangeChange}
            placeholder="Período da movimentação"
            className="h-10 w-full"
          />
        </div>
      </div>

      {/* ── Resumo ──────────────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
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

      {/* ── Tabela ──────────────────────────────────────────────────────────── */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Endereço</TableHead>
              <TableHead className="hidden sm:table-cell">Material</TableHead>
              <TableHead>Tipo / Direção</TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent ml-auto flex"
                  onClick={() => handleSort('quantity')}
                >
                  Qtd{' '}
                  <SortIcon
                    field="quantity"
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('date')}
                >
                  Data{' '}
                  <SortIcon
                    field="date"
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">Observação</TableHead>
              <TableHead className="w-20 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : movements.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  Nenhuma movimentação encontrada
                </TableCell>
              </TableRow>
            ) : (
              movements.map((movement: Movement) => {
                const addrLabel = [
                  movement.locationCode,
                  movement.subLocationCode,
                  movement.rowCode,
                  movement.shelfCode,
                  movement.positionCode,
                ]
                  .filter(Boolean)
                  .join(' / ');

                return (
                  <TableRow
                    key={movement.id}
                    className="group cursor-pointer hover:bg-muted/40"
                    onClick={() => {
                      void navigate(`/movement/movement/${movement.id}`);
                    }}
                  >
                    <TableCell>
                      <div
                        className="truncate text-sm max-w-[160px]"
                        title={addrLabel}
                      >
                        {addrLabel || movement.addressingId}
                      </div>
                    </TableCell>

                    <TableCell className="hidden sm:table-cell">
                      <div>
                        <div className="text-sm font-medium">
                          {movement.materialName}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {movement.materialCode}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={
                            movement.movementTypeDirection === 'IN'
                              ? 'default'
                              : 'destructive'
                          }
                          className="w-fit gap-1"
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
                        <span className="text-xs text-muted-foreground">
                          {movement.movementTypeName}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right font-mono font-medium tabular-nums">
                      {movement.quantity}
                    </TableCell>

                    <TableCell className="hidden text-sm md:table-cell">
                      {formatDate(movement.date)}
                    </TableCell>

                    <TableCell className="hidden max-w-[180px] truncate text-sm text-muted-foreground lg:table-cell">
                      {movement.observation ?? '—'}
                    </TableCell>

                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              void navigate(
                                `/movement/movement/${movement.id}`,
                              );
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" /> Ver detalhes
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ── Paginação ────────────────────────────────────────────────────────── */}
      {movementsData && movementsData.meta.totalPages > 1 && (
        <Pagination
          currentPage={page + 1}
          itemCount={movementsData.meta.totalItems}
          itemsPerPage={movementsData.meta.itemsPerPage}
          onPageChange={handlePaginate}
        />
      )}
    </div>
  );
}
