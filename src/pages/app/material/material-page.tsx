import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useDebounce } from '@/hooks/use-debounce';
import { useGroup } from '@/hooks/use-group';
import { useMaterial } from '@/hooks/use-material';

import { CreateMaterialDialog } from './components/create-material-dialog';
import { MateriaisTable } from './components/materiais-table';

export function MaterialPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  // Initialize filters from searchParams
  const page = parseInt(searchParams.get('page') ?? '1', 10);
  const codeFilter = searchParams.get('code') ?? '';
  const nameFilter = searchParams.get('name') ?? '';
  const descriptionFilter = searchParams.get('description') ?? '';
  const groupIdFilter = searchParams.get('groupId') ?? 'all';
  const activeFilter = searchParams.get('active') ?? 'all';
  const sortBy = searchParams.get('sortBy') ?? 'name';
  const sortDirection = searchParams.get('sortDirection') ?? 'asc';

  const debouncedCodeFilter = useDebounce(codeFilter);
  const debouncedNameFilter = useDebounce(nameFilter);
  const debouncedDescriptionFilter = useDebounce(descriptionFilter);
  const debouncedGroupIdFilter = useDebounce(groupIdFilter);
  const debouncedActiveFilter = useDebounce(activeFilter);

  const { useGetMaterials, useGetMaterialsStats, useDeleteMaterial } =
    useMaterial();
  const { useGetGroups } = useGroup();
  const { data: materialsData, isLoading } = useGetMaterials(page - 1, 20, {
    code: debouncedCodeFilter || undefined,
    name: debouncedNameFilter || undefined,
    description: debouncedDescriptionFilter || undefined,
    groupId: debouncedGroupIdFilter === 'all' ? undefined : groupIdFilter,
    active:
      debouncedActiveFilter === 'all'
        ? undefined
        : debouncedActiveFilter === 'true',
    orderBy: sortBy as 'name' | 'code' | 'unit' | 'active' | 'groupId',
    orderDirection: sortDirection as 'asc' | 'desc',
  });
  const { data: statsData } = useGetMaterialsStats();
  const { data: groupsData } = useGetGroups(0, 9999);
  const { mutateAsync: deleteMaterialFn } = useDeleteMaterial();

  async function handleDeleteMaterial(id: string) {
    await deleteMaterialFn({ id });
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
      groupId: null,
      active: null,
      sortBy: null,
      sortDirection: null,
    });
  };

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
                Materiais
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Gerencie todos os materiais do seu estoque
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-9 md:h-10 lg:h-11 w-full md:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="md:inline">Novo Material</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm overflow-hidden">
        <MateriaisTable
          onDelete={handleDeleteMaterial}
          isLoading={isLoading}
          materials={materialsData?.materials || []}
          meta={materialsData?.meta}
          statsData={statsData}
          groups={groupsData?.groups || []}
          codeFilter={codeFilter}
          nameFilter={nameFilter}
          descriptionFilter={descriptionFilter}
          groupIdFilter={groupIdFilter}
          activeFilter={activeFilter}
          sortBy={sortBy}
          sortDirection={sortDirection}
          onUpdateSearchParams={updateSearchParams}
          onPaginate={handlePaginate}
          onClearFilters={handleClearFilters}
        />
      </div>

      <CreateMaterialDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
