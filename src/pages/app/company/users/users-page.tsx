import { parse } from 'date-fns';
import { ptBR } from 'date-fns/locale/pt-BR';
import { LayoutGrid, Table } from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';
import { useSearchParams } from 'react-router-dom';

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDebounce } from '@/hooks/use-debounce';
import { useUsers } from '@/hooks/use-users';

import { UsersTable } from './components/table';
import { UsersCards } from './components/users-cards';
import { UsersFilters } from './components/users-filters';
import { UsersStatsCards } from './components/users-stats-cards';

export function UsersPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');

  // Initialize filters from searchParams
  const rawPage = searchParams.get('page');
  const parsedPage = parseInt(rawPage ?? '1', 10);
  const page = isNaN(parsedPage) || parsedPage < 1 ? 1 : parsedPage;
  const itemsPerPage = 20;
  const nameFilter = searchParams.get('name') ?? '';
  const emailFilter = searchParams.get('email') ?? '';
  const roleFilter = searchParams.get('role') ?? 'all';
  const activeFilter = searchParams.get('active') ?? 'all';
  const createdAtStartStr = searchParams.get('createdAtStart');
  const createdAtEndStr = searchParams.get('createdAtEnd');
  const sortBy = searchParams.get('sortBy') ?? 'name';
  const sortDirection = searchParams.get('sortDirection') ?? 'asc';

  // Parse date strings to Date objects for DateRangePicker first
  const dateRange: DateRange | undefined =
    createdAtStartStr || createdAtEndStr
      ? {
          from: createdAtStartStr
            ? parse(createdAtStartStr, 'yyyy-MM-dd', new Date(), {
                locale: ptBR,
              })
            : undefined,
          to: createdAtEndStr
            ? parse(createdAtEndStr, 'yyyy-MM-dd', new Date(), { locale: ptBR })
            : undefined,
        }
      : undefined;

  const debouncedNameFilter = useDebounce(nameFilter);
  const debouncedEmailFilter = useDebounce(emailFilter);
  const debouncedRoleFilter = useDebounce(roleFilter);
  const debouncedActiveFilter = useDebounce(activeFilter);
  const debouncedCreatedAtStartFilter = useDebounce(createdAtStartStr);
  const debouncedCreatedAtEndFilter = useDebounce(createdAtEndStr);

  const { users, meta, isLoading, editUserMutation, deleteUserMutation } =
    useUsers({
      page,
      itemsPerPage,
      name: debouncedNameFilter || undefined,
      email: debouncedEmailFilter || undefined,
      role:
        debouncedRoleFilter === 'all'
          ? undefined
          : (debouncedRoleFilter as 'ADMIN' | 'MANAGER' | 'EMPLOYEE'),
      active:
        debouncedActiveFilter === 'all' ? undefined : debouncedActiveFilter,
      createdAtStart: debouncedCreatedAtStartFilter || undefined,
      createdAtEnd: debouncedCreatedAtEndFilter || undefined,
      orderBy: sortBy as 'name' | 'email' | 'role' | 'active' | 'createdAt',
      orderDirection: sortDirection as 'asc' | 'desc',
    });

  const totalActive = users.filter((u) => u.active).length;
  const totalInactive = users.length - totalActive;
  const lastCreated = users[0]?.createdAt;
  const hasFilters =
    !!nameFilter ||
    !!emailFilter ||
    roleFilter !== 'all' ||
    activeFilter !== 'all' ||
    !!dateRange;

  const countByRole = users.reduce(
    (acc, user) => {
      acc[user.role] = (acc[user.role] || 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

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

  // Handle date range change
  const handleDateRangeChange = (range: DateRange | undefined) => {
    updateSearchParams({
      createdAtStart: range?.from
        ? range.from.toISOString().split('T')[0]
        : null,
      createdAtEnd: range?.to ? range.to.toISOString().split('T')[0] : null,
    });
  };

  const handlePaginate = (newPage: number) => {
    const validPage = Math.max(1, newPage);
    setSearchParams((state) => {
      state.set('page', validPage.toString());
      return state;
    });
  };

  const handleClearFilters = () => {
    updateSearchParams({
      name: null,
      email: null,
      role: null,
      active: null,
      createdAtStart: null,
      createdAtEnd: null,
      sortBy: null,
      sortDirection: null,
    });
  };

  return (
    <div className="flex-1 space-y-4 md:space-y-6">
      <UsersStatsCards
        totalItems={meta?.totalItems || 0}
        totalActive={totalActive}
        totalInactive={totalInactive}
        lastCreated={lastCreated}
        countByRole={countByRole}
      />

      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between">
          <h2 className="font-semibold text-lg">Usuários</h2>
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
          <UsersFilters
            nameFilter={nameFilter}
            emailFilter={emailFilter}
            roleFilter={roleFilter}
            activeFilter={activeFilter}
            dateRange={dateRange}
            onDateRangeChange={handleDateRangeChange}
            onUpdateSearchParams={updateSearchParams}
            onClearFilters={handleClearFilters}
            hasFilters={hasFilters}
          />

          {viewMode === 'table' ? (
            <UsersTable
              onDelete={(id) => deleteUserMutation.mutate(id)}
              isLoading={isLoading}
              editUserMutation={editUserMutation}
              users={users}
              meta={meta}
              sortBy={sortBy}
              sortDirection={sortDirection}
              onUpdateSearchParams={updateSearchParams}
              onPaginate={handlePaginate}
            />
          ) : (
            <UsersCards
              onDelete={(id) => deleteUserMutation.mutate(id)}
              isLoading={isLoading}
              editUserMutation={editUserMutation}
              users={users}
              meta={meta}
              onPaginate={handlePaginate}
            />
          )}
        </div>
      </div>
    </div>
  );
}
