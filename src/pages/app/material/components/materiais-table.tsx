import {
  ArrowUpDown,
  Edit,
  MoreHorizontal,
  Package,
  Search,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { type MaterialDetails } from '@/api/stock/fetch-materials';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
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
import { useDebounce } from '@/hooks/use-debounce';
import { useGroup } from '@/hooks/use-group';
import { useMaterial } from '@/hooks/use-material';
import { formatDate } from '@/utils/format-date';

import { EditMaterialDialog } from './edit-material-dialog';
import { MaterialStatsCards } from './material-stats-cards';

interface MateriaisTableProps {
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

type SortField =
  | 'codigo'
  | 'nome'
  | 'grupo'
  | 'unidade'
  | 'status'
  | 'dataCriacao';
type SortDirection = 'asc' | 'desc';

export function MateriaisTable({ onDelete }: MateriaisTableProps) {
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialDetails | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [codeFilter, setCodeFilter] = useState<string>('');
  const [nameFilter, setNameFilter] = useState<string>('');
  const [groupIdFilter, setGroupIdFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('nome');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchParams, setSearchParams] = useSearchParams();

  const page = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1');

  const { useGetMaterials, useGetMaterialsStats } = useMaterial();
  const { useGetGroups } = useGroup();
  const { data: groupsData } = useGetGroups(0, 9999);

  const orderByMap: Record<
    SortField,
    'name' | 'code' | 'unit' | 'createdAt' | 'active' | 'groupId'
  > = {
    nome: 'name',
    codigo: 'code',
    unidade: 'unit',
    dataCriacao: 'createdAt',
    status: 'active',
    grupo: 'groupId',
  } as const;

  const activeFilter =
    statusFilter !== 'all' ? statusFilter === 'ativo' : undefined;
  const groupIdFilterValue =
    groupIdFilter !== 'all' ? groupIdFilter : undefined;

  // Aplicar debounce nos filtros de texto (reduzido para 500ms)
  const debouncedCodeFilter = useDebounce(codeFilter, 500);
  const debouncedNameFilter = useDebounce(nameFilter, 500);

  const { data: materialsData, isLoading } = useGetMaterials(page, 20, {
    orderBy: orderByMap[sortField],
    orderDirection: sortDirection,
    active: activeFilter,
    code: debouncedCodeFilter || undefined,
    name: debouncedNameFilter || undefined,
    groupId: groupIdFilterValue,
  });
  const { data: statsData } = useGetMaterialsStats();

  const processedData = useMemo(() => {
    if (!materialsData?.materials)
      return { filteredMaterials: [], totalPages: 0 };

    // Todos os filtros são feitos no servidor
    return {
      filteredMaterials: materialsData.materials,
      totalPages: materialsData.meta.totalPages,
    };
  }, [materialsData?.materials, materialsData?.meta?.totalPages]);

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
    setCodeFilter('');
    setNameFilter('');
    setGroupIdFilter('all');
  }

  function handleEdit(material: MaterialDetails) {
    setSelectedMaterial(material);
    setIsEditDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <MaterialStatsCards
        totalItems={statsData?.meta.totalItems}
        totalActive={statsData?.meta.totalActiveMaterials}
        itemCount={statsData?.meta.itemCount}
        lastCreated={statsData?.meta.lastCreated}
      />

      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Código..."
              className="pl-10 h-11"
              value={codeFilter}
              onChange={(e) => setCodeFilter(e.target.value)}
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nome..."
              className="pl-10 h-11"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          <Select value={groupIdFilter} onValueChange={setGroupIdFilter}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Grupo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os grupos</SelectItem>
              {groupsData?.groups?.map((group) => (
                <SelectItem key={group.id} value={group.id}>
                  {group.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="h-11">
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
          <Package className="h-4 w-4" />
          <span>
            Mostrando {processedData.filteredMaterials.length} de{' '}
            {materialsData?.meta.totalItems} materiais
            {processedData.totalPages > 1 &&
              ` • Página ${page + 1} de ${processedData.totalPages}`}
          </span>
        </div>
        <div className="h-3.5">
          {(statusFilter !== 'all' ||
            codeFilter ||
            nameFilter ||
            groupIdFilter !== 'all') && (
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
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('grupo')}
                >
                  Grupo
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('unidade')}
                >
                  Unidade
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
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
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
              : processedData.filteredMaterials.map(
                  (material: MaterialDetails) => (
                    <TableRow key={material.id} className="group">
                      <TableCell className="font-medium">
                        {material.code}
                      </TableCell>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="font-medium">{material.name}</div>
                        </div>
                      </TableCell>
                      <TableCell>{material.group}</TableCell>
                      <TableCell>{material.unit}</TableCell>
                      <TableCell>
                        {material.active ? (
                          <Badge className="bg-green-100 text-green-800">
                            Ativo
                          </Badge>
                        ) : (
                          <Badge variant="secondary">Inativo</Badge>
                        )}
                      </TableCell>
                      <TableCell className="hidden md:table-cell">
                        <div className="flex items-center gap-2 text-sm">
                          <Package className="h-4 w-4 text-muted-foreground" />
                          {formatDate(material.createdAt)}
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
                            <DropdownMenuItem
                              onClick={() => handleEdit(material)}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar material
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(material.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir material
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ),
                )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      {selectedMaterial && (
        <EditMaterialDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedMaterial(null);
          }}
          material={selectedMaterial}
        />
      )}
      {processedData.totalPages > 0 && (
        <Pagination
          currentPage={page}
          itemCount={materialsData?.meta.totalItems || 0}
          itemsPerPage={materialsData?.meta.itemsPerPage || 0}
          onPageChange={handlePaginate}
        />
      )}
    </div>
  );
}
