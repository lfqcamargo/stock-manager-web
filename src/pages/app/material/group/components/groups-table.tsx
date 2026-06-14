import {
  ArrowUpDown,
  Boxes,
  Edit,
  MoreHorizontal,
  Search,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { type Group } from '@/api/stock/fetch-groups';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
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
import { useGroup } from '@/hooks/use-group';
import { formatDate } from '@/utils/format-date';

import { EditGroupDialog } from './edit-group-dialog';
import { GroupStatsCards } from './group-stats-cards';

interface GroupsTableProps {
  onDelete: (id: string) => void;
  searchTerm: string;
  onSearchChange: (term: string) => void;
  isLoading?: boolean;
}

type SortField = 'codigo' | 'nome' | 'descricao' | 'status' | 'dataCriacao';
type SortDirection = 'asc' | 'desc';

export function GroupsTable({
  onDelete,
  searchTerm,
  onSearchChange,
}: GroupsTableProps) {
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('nome');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchParams, setSearchParams] = useSearchParams();

  const page = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1');

  const { useGetGroups, useGetGroupsStats } = useGroup();
  const orderByMap: Record<
    SortField,
    'name' | 'description' | 'code' | 'createdAt' | 'active'
  > = {
    nome: 'name',
    descricao: 'description',
    codigo: 'code',
    dataCriacao: 'createdAt',
    status: 'active',
  } as const;
  const { data: groupsData, isLoading } = useGetGroups(page, 20, {
    orderBy: orderByMap[sortField],
    orderDirection: sortDirection,
  });
  const { data: statsData } = useGetGroupsStats();

  const processedData = useMemo(() => {
    if (!groupsData?.groups) return { filteredGroups: [], totalPages: 0 };

    let filteredGroups = [...groupsData.groups];

    if (searchTerm) {
      filteredGroups = filteredGroups.filter(
        (group) =>
          group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          group.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (group.description &&
            group.description.toLowerCase().includes(searchTerm.toLowerCase())),
      );
    }

    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'ativo';
      filteredGroups = filteredGroups.filter(
        (group) => group.active === isActive,
      );
    }

    // Nenhuma ordenação local: tudo via servidor

    return {
      filteredGroups,
      totalPages: groupsData.meta.totalPages,
    };
  }, [
    groupsData?.groups,
    groupsData?.meta?.totalPages,
    searchTerm,
    statusFilter,
    sortField,
    sortDirection,
  ]);

  function handlePaginate(page: number) {
    setSearchParams((state) => {
      state.set('page', (page + 1).toString());
      return state;
    });
  }

  function handleSort(field: SortField) {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
    // Resetar para primeira página ao alterar ordenação
    setSearchParams((state) => {
      state.set('page', '1');
      return state;
    });
  }

  function handleClearFilters() {
    setStatusFilter('all');
    onSearchChange('');
  }

  function handleEdit(group: Group) {
    setSelectedGroup(group);
    setIsEditDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <GroupStatsCards
        totalItems={statsData?.meta.totalItems}
        totalActiveGroups={statsData?.meta.totalActiveGroups}
        totalEmptyGroups={statsData?.meta.totalEmptyGroups}
        lastCreated={statsData?.meta.lastCreated}
      />

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código, nome ou descrição..."
            className="pl-10 h-11"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Boxes className="h-4 w-4" />
          <span>
            Mostrando {processedData.filteredGroups.length} de{' '}
            {groupsData?.meta.totalItems} grupos
            {processedData.totalPages > 1 &&
              ` • Página ${page + 1} de ${processedData.totalPages}`}
            {statusFilter !== 'all' || searchTerm}
          </span>
        </div>
        <div className="h-3.5">
          {(statusFilter !== 'all' || searchTerm) && (
            <Button variant="ghost" size="sm" onClick={handleClearFilters}>
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('codigo')}
                >
                  Código
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('nome')}
                >
                  Nome
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('descricao')}
                >
                  Descrição
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('status')}
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('dataCriacao')}
                >
                  Data Criação
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="text-right w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 rounded" />
                    </TableCell>
                  </TableRow>
                ))
              : processedData.filteredGroups.map((group: Group) => (
                  <TableRow key={group.id} className="group">
                    <TableCell className="font-medium">{group.code}</TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">{group.name}</div>
                        <div className="text-sm text-muted-foreground lg:hidden">
                          {group.description || '-'}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[300px] truncate">
                      {group.description || '-'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={group.active} />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <Boxes className="h-4 w-4 text-muted-foreground" />
                        {formatDate(group.createdAt)}
                      </div>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleEdit(group)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar grupo
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(group.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir grupo
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      {selectedGroup && (
        <EditGroupDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedGroup(null);
          }}
          group={selectedGroup}
        />
      )}
      {processedData.totalPages > 0 && (
        <Pagination
          currentPage={page}
          itemCount={groupsData?.meta.totalItems || 0}
          itemsPerPage={groupsData?.meta.itemsPerPage || 0}
          onPageChange={handlePaginate}
        />
      )}
    </div>
  );
}
