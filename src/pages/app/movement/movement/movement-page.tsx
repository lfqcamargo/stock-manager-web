import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, LayoutGrid, Package, Plus, Table } from 'lucide-react';
import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { fetchAddressings } from '@/api/stock/fetch-addressings';
import { fetchMovementTypes } from '@/api/stock/fetch-movement-types';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useMovement } from '@/hooks/use-movement';

import { CreateMovementDialog } from './components/create-movement-dialog';
import { MovementsCards } from './components/movements-cards';
import { MovementsTable } from './components/movimentacoes-table';

export function MovementPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [addressingFilter, setAddressingFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [searchParams, setSearchParams] = useSearchParams();

  const page = z.coerce
    .number()
    .transform((p) => p - 1)
    .parse(searchParams.get('page') ?? '1');

  const { useGetMovements } = useMovement();

  const { data: typesData } = useQuery({
    queryKey: ['movementTypes', 0, 100, undefined],
    queryFn: () => fetchMovementTypes({ page: 0, limit: 100 }),
  });

  const { data: addressingsData } = useQuery({
    queryKey: ['addressings', 0, 100, { active: true }],
    queryFn: () => fetchAddressings({ page: 0, limit: 100, active: true }),
  });

  const { data: movementsData, isLoading } = useGetMovements(page, 20, {
    addressingId: addressingFilter !== 'all' ? addressingFilter : undefined,
    movementTypeId: typeFilter !== 'all' ? typeFilter : undefined,
    orderBy: 'date',
    orderDirection: 'desc',
  });

  const addressingsMap = useMemo(() => {
    const map = new Map<string, string>();
    addressingsData?.addressings.forEach((a) => {
      const label = [
        a.location?.name,
        a.subLocation?.name,
        a.row?.name,
        a.shelf?.name,
        a.position?.name,
      ]
        .filter(Boolean)
        .join(' / ');
      map.set(a.id, label || a.id);
    });
    return map;
  }, [addressingsData]);

  const hasActiveFilters = addressingFilter !== 'all' || typeFilter !== 'all';

  function handlePaginate(newPage: number) {
    setSearchParams((state) => {
      state.set('page', (newPage + 1).toString());
      return state;
    });
  }

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
            onClick={() => setIsAddDialogOpen(true)}
            className="rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-9 md:h-10 lg:h-11 w-full md:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="md:inline">Nova Movimentação</span>
          </Button>
        </div>
      </div>

      {/* View Toggle & Content */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm overflow-hidden">
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

        {viewMode === 'table' ? (
          <MovementsTable />
        ) : (
          <div className="p-6 space-y-6">
            {/* Filters for cards view */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Select value={addressingFilter} onValueChange={setAddressingFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Endereçamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os endereçamentos</SelectItem>
                  {addressingsData?.addressings.map((a) => (
                    <SelectItem key={a.id} value={a.id}>
                      {addressingsMap.get(a.id) || a.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="h-11">
                  <SelectValue placeholder="Tipo de movimento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  {typesData?.movementTypes.map((type) => (
                    <SelectItem key={type.id} value={type.id}>
                      {type.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Summary */}
            <div className="flex items-center justify-between text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Package className="h-4 w-4" />
                <span>
                  {movementsData
                    ? `${movementsData.movements.length} de ${movementsData.meta.totalItems} movimentações`
                    : 'Carregando...'}
                </span>
              </div>
              {hasActiveFilters && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setAddressingFilter('all');
                    setTypeFilter('all');
                  }}
                >
                  Limpar filtros
                </Button>
              )}
            </div>

            <MovementsCards
              isLoading={isLoading}
              movements={movementsData?.movements ?? []}
              meta={movementsData?.meta}
              onPaginate={handlePaginate}
            />
          </div>
        )}
      </div>

      <CreateMovementDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
