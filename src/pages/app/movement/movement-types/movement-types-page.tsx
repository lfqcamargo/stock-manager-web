import { ArrowLeft, FileUp, LayoutGrid, Plus, Table } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { ImportCsvDialog } from '@/components/import-csv-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { csvColumns } from '@/config/csv-columns';
import { useDebounce } from '@/hooks/use-debounce';
import { useMovementType } from '@/hooks/use-movement-type';
import { useRole } from '@/hooks/use-role';

import { CreateMovementTypeDialog } from './components/create-movement-type-dialog';
import { MovementTypeStatsCards } from './components/movement-type-stats-cards';
import { MovementTypesCards } from './components/movement-types-cards';
import { MovementTypesTable } from './components/movement-types-table';

export function MovementTypesPage() {
  const { canWrite } = useRole();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchParams, setSearchParams] = useSearchParams();

  const page = z.coerce
    .number()
    .transform((p) => p - 1)
    .parse(searchParams.get('page') ?? '1');

  const nameFilter = searchParams.get('name') ?? '';
  const directionFilter = searchParams.get('direction') ?? 'all';
  const debouncedNameFilter = useDebounce(nameFilter, 600);

  const directionFilterValue =
    directionFilter !== 'all' ? (directionFilter as 'IN' | 'OUT') : undefined;

  const { useGetMovementTypes, useDeleteMovementType } = useMovementType();
  const { data: typesData, isLoading } = useGetMovementTypes(page, 20, {
    name: debouncedNameFilter || undefined,
    direction: directionFilterValue,
  });
  const { mutate: deleteMovementTypeFn } = useDeleteMovementType();

  const totalInboundTypes =
    typesData?.movementTypes.filter((t) => t.direction === 'IN').length ?? 0;
  const totalOutboundTypes =
    typesData?.movementTypes.filter((t) => t.direction === 'OUT').length ?? 0;

  function handleDeleteMovementType(id: string) {
    deleteMovementTypeFn({ id });
  }

  function handlePaginate(newPage: number) {
    setSearchParams((state) => {
      state.set('page', newPage.toString());
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
                Tipos de Movimentação
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Configure os tipos de movimentação disponíveis no sistema
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
                onClick={() => setIsAddDialogOpen(true)}
                className="rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-9 md:h-10 lg:h-11 w-full md:w-auto"
              >
                <Plus className="mr-2 h-4 w-4" />
                <span className="md:inline">Novo Tipo</span>
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Stats */}
      <MovementTypeStatsCards
        totalItems={typesData?.meta.totalItems}
        totalInboundTypes={totalInboundTypes}
        totalOutboundTypes={totalOutboundTypes}
      />

      {/* View Toggle & Content */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Lista de Tipos</h2>
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

        <div className="p-6">
          {viewMode === 'table' ? (
            <MovementTypesTable
              onDelete={canWrite ? handleDeleteMovementType : undefined}
            />
          ) : (
            <MovementTypesCards
              onDelete={canWrite ? handleDeleteMovementType : undefined}
              isLoading={isLoading}
              movementTypes={typesData?.movementTypes ?? []}
              meta={typesData?.meta}
              onPaginate={handlePaginate}
            />
          )}
        </div>
      </div>

      {canWrite && (
        <CreateMovementTypeDialog
          open={isAddDialogOpen}
          onOpenChange={setIsAddDialogOpen}
        />
      )}

      {canWrite && (
        <ImportCsvDialog
          open={isImportDialogOpen}
          onOpenChange={setIsImportDialogOpen}
          entity="movement-types"
          entityLabel="Tipos de Movimentação"
          queryKeys={['movementTypes']}
          columns={csvColumns.movementTypes}
        />
      )}
    </div>
  );
}
