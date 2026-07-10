import { useQuery } from '@tanstack/react-query';
import {
  ArrowLeft,
  FileUp,
  LayoutGrid,
  Plus,
  Table,
  Warehouse,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { fetchLocations } from '@/api/stock/fetch-locations';
import { fetchMaterials } from '@/api/stock/fetch-materials';
import { fetchPositions } from '@/api/stock/fetch-positions';
import { fetchRows } from '@/api/stock/fetch-rows';
import { fetchShelfs } from '@/api/stock/fetch-shelfs';
import { fetchSubLocations } from '@/api/stock/fetch-sub-locations';
import { ImportCsvDialog } from '@/components/import-csv-dialog';
import { MaterialCombobox } from '@/components/material-combobox';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { csvColumns } from '@/config/csv-columns';
import { useAddressing } from '@/hooks/use-addressing';
import { useRole } from '@/hooks/use-role';

import { AddressingCards } from './components/addressing-cards';
import { AddressingStatsCards } from './components/addressing-stats-cards';
import { CreateAddressingDialog } from './components/create-dialog';
import { AddressingTable } from './components/table';

export type AddressingSortField = 'createdAt' | 'amount';
export type AddressingSortDirection = 'asc' | 'desc';

export function AddressingPage() {
  const { canWrite } = useRole();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  const [searchParams, setSearchParams] = useSearchParams();

  // ── Filtros ──────────────────────────────────────────────────────────────────
  const [locationFilter, setLocationFilter] = useState('all');
  const [subLocationFilter, setSubLocationFilter] = useState('all');
  const [rowFilter, setRowFilter] = useState('all');
  const [shelfFilter, setShelfFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [materialSearch, setMaterialSearch] = useState('');
  const matSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleMaterialSearchChange = useCallback((search: string) => {
    if (matSearchTimerRef.current) clearTimeout(matSearchTimerRef.current);
    matSearchTimerRef.current = setTimeout(
      () => setMaterialSearch(search),
      300,
    );
  }, []);

  // ── Sort ─────────────────────────────────────────────────────────────────────
  const [sortField, setSortField] = useState<AddressingSortField>('createdAt');
  const [sortDir, setSortDir] = useState<AddressingSortDirection>('desc');

  // ── Paginação ────────────────────────────────────────────────────────────────
  const page = z.coerce
    .number()
    .transform((p) => p - 1)
    .parse(searchParams.get('page') ?? '1');

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

  // ── Query principal ──────────────────────────────────────────────────────────
  const { useGetAddressings, useDeleteAddressing } = useAddressing();
  const { mutate: deleteAddressingFn } = useDeleteAddressing();

  const { data, isLoading } = useGetAddressings(page, 20, {
    locationId: locationFilter !== 'all' ? locationFilter : undefined,
    subLocationId: subLocationFilter !== 'all' ? subLocationFilter : undefined,
    rowId: rowFilter !== 'all' ? rowFilter : undefined,
    shelfId: shelfFilter !== 'all' ? shelfFilter : undefined,
    positionId: positionFilter !== 'all' ? positionFilter : undefined,
    materialId: materialFilter !== 'all' ? materialFilter : undefined,
    active: activeFilter === 'all' ? undefined : activeFilter === 'true',
    orderBy: sortField,
    orderDirection: sortDir,
  });

  const addressings = data?.addressings ?? [];
  const meta = data?.meta;

  // ── Helpers ──────────────────────────────────────────────────────────────────
  function resetPage() {
    setSearchParams((s) => {
      s.set('page', '1');
      return s;
    });
  }

  function handlePaginate(newPage: number) {
    setSearchParams((s) => {
      s.set('page', newPage.toString());
      return s;
    });
  }

  function handleSort(f: AddressingSortField) {
    if (sortField === f) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(f);
      setSortDir(f === 'createdAt' ? 'desc' : 'asc');
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
    setActiveFilter('all');
    resetPage();
  }

  function handleDelete(id: string) {
    deleteAddressingFn({ id });
  }

  const hasActiveFilter =
    locationFilter !== 'all' ||
    subLocationFilter !== 'all' ||
    rowFilter !== 'all' ||
    shelfFilter !== 'all' ||
    positionFilter !== 'all' ||
    materialFilter !== 'all' ||
    activeFilter !== 'all';

  return (
    <div className="flex-1 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 p-4 md:p-6 lg:p-8 shadow-sm">
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
                Endereçamento
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Vincule materiais às suas localizações específicas no estoque
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            {canWrite && (
              <Button
                variant="outline"
                onClick={() => setIsImportDialogOpen(true)}
                className="rounded-lg md:rounded-xl h-9 md:h-10 lg:h-11 w-full md:w-auto"
              >
                <FileUp className="mr-2 h-4 w-4" />
                Importar CSV
              </Button>
            )}
            {canWrite && (
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-9 md:h-10 lg:h-11 w-full md:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span className="md:inline">Novo Endereçamento</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <AddressingStatsCards />

      {/* Filtros + Toggle + Conteúdo */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm overflow-hidden">
        {/* Cabeçalho com toggle */}
        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Lista de Endereçamentos</h2>
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

        {/* Filtros — sempre visíveis */}
        <div className="px-4 md:px-6 pt-4 md:pt-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
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
              onSearchChange={handleMaterialSearchChange}
              isLoading={matFetching}
              showAllOption
              allLabel="Todos os materiais"
              placeholder="Material"
              triggerClassName="h-10"
            />

            {/* Status */}
            <Select
              value={activeFilter}
              onValueChange={handleFilterChange(setActiveFilter)}
            >
              <SelectTrigger className="h-10">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os status</SelectItem>
                <SelectItem value="true">Ativo</SelectItem>
                <SelectItem value="false">Inativo</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Resumo */}
          <div className="flex items-center justify-between text-sm text-muted-foreground pb-4">
            <div className="flex items-center gap-2">
              <Warehouse className="h-4 w-4" />
              <span>
                {meta ? `${meta.totalItems} endereçamentos` : 'Carregando...'}
                {meta &&
                  meta.totalPages > 1 &&
                  ` • Página ${page + 1} de ${meta.totalPages}`}
              </span>
            </div>
            {hasActiveFilter && (
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                Limpar filtros
              </Button>
            )}
          </div>
        </div>

        {/* Conteúdo da view */}
        {viewMode === 'table' ? (
          <AddressingTable
            isLoading={isLoading}
            addressings={addressings}
            meta={meta}
            page={page}
            sortField={sortField}
            sortDir={sortDir}
            onSort={handleSort}
            onPaginate={handlePaginate}
            onDelete={canWrite ? handleDelete : undefined}
          />
        ) : (
          <div className="px-4 md:px-6 pb-4 md:pb-6">
            <AddressingCards
              isLoading={isLoading}
              addressings={addressings}
              meta={meta}
              onPaginate={handlePaginate}
              onDelete={canWrite ? handleDelete : undefined}
            />
          </div>
        )}
      </div>

      {/* Dialogs */}
      {canWrite && (
        <CreateAddressingDialog
          open={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
        />
      )}
      {canWrite && (
        <ImportCsvDialog
          open={isImportDialogOpen}
          onOpenChange={setIsImportDialogOpen}
          entity="addressings"
          entityLabel="Endereçamentos"
          queryKeys={['addressings']}
          columns={csvColumns.addressings}
        />
      )}
    </div>
  );
}
