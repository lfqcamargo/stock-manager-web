import { ArrowLeft, FileUp, LayoutGrid, Plus, Table } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { ImportCsvDialog } from '@/components/import-csv-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { csvColumns } from '@/config/csv-columns';
import { useDebounce } from '@/hooks/use-debounce';
import { useGroup } from '@/hooks/use-group';

import { CreateGroupDialog } from './components/create-group-dialog';
import { GroupStatsCards } from './components/group-stats-cards';
import { GroupsCards } from './components/groups-cards';
import { GroupsFilters } from './components/groups-filters';
import { GroupsTable } from './components/groups-table';

export function GroupPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isImportDialogOpen, setIsImportDialogOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from searchParams
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const codeFilter = searchParams.get('code') ?? '';
  const nameFilter = searchParams.get('name') ?? '';
  const descriptionFilter = searchParams.get('description') ?? '';
  const activeFilter = searchParams.get('active') ?? 'all';
  const sortBy = searchParams.get('sortBy') ?? 'name';
  const sortDirection = searchParams.get('sortDirection') ?? 'asc';

  const debouncedCodeFilter = useDebounce(codeFilter);
  const debouncedNameFilter = useDebounce(nameFilter);
  const debouncedDescriptionFilter = useDebounce(descriptionFilter);
  // Select não precisa de debounce — reage imediatamente
  const debouncedActiveFilter = activeFilter;

  const { useGetGroups, useGetGroupsStats, useDeleteGroup } = useGroup();
  const { data: groupsData, isLoading } = useGetGroups(page - 1, 20, {
    code: debouncedCodeFilter || undefined,
    name: debouncedNameFilter || undefined,
    description: debouncedDescriptionFilter || undefined,
    active:
      debouncedActiveFilter === 'all'
        ? undefined
        : debouncedActiveFilter === 'true',
    orderBy: sortBy as 'name' | 'description' | 'code' | 'active',
    orderDirection: sortDirection as 'asc' | 'desc',
  });
  const { data: statsData } = useGetGroupsStats();
  const { mutate: deleteGroupFn } = useDeleteGroup();

  function handleDeleteGroup(id: string) {
    deleteGroupFn({ id });
  }

  // Update searchParams when filters change
  const updateSearchParams = (updates: Record<string, string | null>) => {
    setSearchParams((state) => {
      const newParams = new URLSearchParams(state);
      Object.entries(updates).forEach(([key, value]) => {
        if (value) {
          newParams.set(key, value);
        } else {
          newParams.delete(key);
        }
      });
      newParams.set('page', '1');
      return newParams;
    });
  };

  const handlePaginate = (newPage: number) => {
    setSearchParams((state) => {
      state.set('page', newPage.toString());
      return state;
    });
  };

  const handleClearFilters = () => {
    updateSearchParams({
      code: null,
      name: null,
      description: null,
      active: null,
      sortBy: null,
      sortDirection: null,
    });
  };

  const hasFilters =
    !!codeFilter ||
    !!nameFilter ||
    !!descriptionFilter ||
    activeFilter !== 'all';

  return (
    <div className="flex-1 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8">
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
                Grupos de Material
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Gerencie os grupos de material da sua empresa
              </p>
            </div>
          </div>
          <div className="flex flex-col gap-2 md:flex-row md:items-center">
            <Button
              variant="outline"
              onClick={() => setIsImportDialogOpen(true)}
              className="rounded-lg md:rounded-xl h-9 md:h-10 lg:h-11 w-full md:w-auto"
            >
              <FileUp className="mr-2 h-4 w-4" />
              Importar CSV
            </Button>
            <Button
              onClick={() => setIsAddDialogOpen(true)}
              className="rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-9 md:h-10 lg:h-11 w-full md:w-auto"
            >
              <Plus className="mr-2 h-4 w-4" />
              <span className="md:inline">Novo Grupo</span>
            </Button>
          </div>
        </div>
      </div>

      <GroupStatsCards
        totalItems={statsData?.meta.totalItems}
        totalActiveGroups={statsData?.meta.totalActiveGroups}
        totalEmptyGroups={statsData?.meta.totalEmptyGroups}
      />

      {/* View Toggle & Content */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Lista de Grupos</h2>
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

        <div className="p-6 space-y-6">
          <GroupsFilters
            codeFilter={codeFilter}
            nameFilter={nameFilter}
            descriptionFilter={descriptionFilter}
            activeFilter={activeFilter}
            onUpdateSearchParams={updateSearchParams}
            onClearFilters={handleClearFilters}
            hasFilters={hasFilters}
          />

          {viewMode === 'table' ? (
            <GroupsTable
              onDelete={handleDeleteGroup}
              isLoading={isLoading}
              groups={groupsData?.groups || []}
              meta={groupsData?.meta}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onUpdateSearchParams={updateSearchParams}
              onPaginate={handlePaginate}
            />
          ) : (
            <GroupsCards
              onDelete={handleDeleteGroup}
              isLoading={isLoading}
              groups={groupsData?.groups || []}
              meta={groupsData?.meta}
              onPaginate={handlePaginate}
            />
          )}
        </div>
      </div>

      <CreateGroupDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />

      <ImportCsvDialog
        open={isImportDialogOpen}
        onOpenChange={setIsImportDialogOpen}
        entity="groups"
        entityLabel="Grupos"
        queryKeys={['groups']}
        columns={csvColumns.groups}
      />
    </div>
  );
}
