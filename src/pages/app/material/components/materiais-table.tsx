import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit,
  MoreHorizontal,
  Package,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';

import type { Group } from '@/api/stock/fetch-groups';
import type { MaterialDetails } from '@/api/stock/fetch-materials';
import type { GetMaterialsResponse } from '@/api/stock/fetch-materials';
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

import { EditMaterialDialog } from './edit-material-dialog';
import { MaterialStatsCards } from './material-stats-cards';

interface MateriaisTableProps {
  onDelete: (id: string) => void;
  isLoading?: boolean;
  materials: MaterialDetails[];
  meta?: GetMaterialsResponse['meta'];
  statsData?: GetMaterialsResponse;
  groups: Group[];
  codeFilter: string;
  nameFilter: string;
  descriptionFilter: string;
  groupIdFilter: string;
  activeFilter: string;
  sortBy: string;
  sortDirection: string;
  onUpdateSearchParams: (updates: Record<string, string | null>) => void;
  onPaginate: (newPage: number) => void;
  onClearFilters: () => void;
}

type SortField = 'codigo' | 'nome' | 'grupo' | 'unidade' | 'status';
type SortDirection = 'asc' | 'desc';

const sortFieldMapping: Record<
  SortField,
  'code' | 'name' | 'groupId' | 'unit' | 'active'
> = {
  codigo: 'code',
  nome: 'name',
  grupo: 'groupId',
  unidade: 'unit',
  status: 'active',
};

const reverseSortFieldMapping: Record<string, SortField> = {
  code: 'codigo',
  name: 'nome',
  groupId: 'grupo',
  unit: 'unidade',
  active: 'status',
};

export function MateriaisTable({
  onDelete,
  isLoading,
  materials,
  meta,
  statsData,
  groups,
  codeFilter,
  nameFilter,
  descriptionFilter,
  groupIdFilter,
  activeFilter,
  sortBy,
  sortDirection,
  onUpdateSearchParams,
  onPaginate,
  onClearFilters,
}: MateriaisTableProps) {
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialDetails | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const currentSortField = reverseSortFieldMapping[sortBy] || 'nome';
  const currentSortDirection = sortDirection as SortDirection;

  function handleSort(field: SortField) {
    const newSortBy = sortFieldMapping[field];
    const newSortDirection =
      currentSortField === field && currentSortDirection === 'asc'
        ? 'desc'
        : 'asc';

    onUpdateSearchParams({
      sortBy: newSortBy,
      sortDirection: newSortDirection,
    });
  }

  function handleEdit(material: MaterialDetails) {
    setSelectedMaterial(material);
    setIsEditDialogOpen(true);
  }

  const hasFilters =
    activeFilter !== 'all' ||
    codeFilter ||
    nameFilter ||
    descriptionFilter ||
    groupIdFilter !== 'all';

  return (
    <div className="space-y-6">
      <MaterialStatsCards
        totalItems={statsData?.meta.totalItems}
        totalActive={statsData?.meta.totalActiveMaterials}
        itemCount={statsData?.meta.itemCount}
      />

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <Input
          placeholder="Código"
          className="h-11"
          value={codeFilter}
          onChange={(e) =>
            onUpdateSearchParams({ code: e.target.value || null })
          }
        />
        <Input
          placeholder="Nome"
          className="h-11"
          value={nameFilter}
          onChange={(e) =>
            onUpdateSearchParams({ name: e.target.value || null })
          }
        />
        <Input
          placeholder="Descrição"
          className="h-11"
          value={descriptionFilter}
          onChange={(e) =>
            onUpdateSearchParams({ description: e.target.value || null })
          }
        />
        <Select
          value={groupIdFilter}
          onValueChange={(value) =>
            onUpdateSearchParams({ groupId: value === 'all' ? null : value })
          }
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Grupo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os grupos</SelectItem>
            {groups.map((group) => (
              <SelectItem key={group.id} value={group.id}>
                {group.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={activeFilter}
          onValueChange={(value) =>
            onUpdateSearchParams({ active: value === 'all' ? null : value })
          }
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Ativo</SelectItem>
            <SelectItem value="false">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <span>
            Mostrando {materials.length} de {meta?.totalItems || 0} materiais
            {meta &&
              meta.totalPages > 1 &&
              ` • Página ${meta.currentPage || 1} de ${meta.totalPages}`}
          </span>
        </div>
        <div className="h-3.5">
          {hasFilters && (
            <Button variant="ghost" size="sm" onClick={onClearFilters}>
              Limpar filtros
            </Button>
          )}
        </div>
      </div>

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
                  {currentSortField === 'codigo' ? (
                    currentSortDirection === 'asc' ? (
                      <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-2 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('nome')}
                >
                  Nome
                  {currentSortField === 'nome' ? (
                    currentSortDirection === 'asc' ? (
                      <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-2 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('grupo')}
                >
                  Grupo
                  {currentSortField === 'grupo' ? (
                    currentSortDirection === 'asc' ? (
                      <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-2 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('unidade')}
                >
                  Unidade
                  {currentSortField === 'unidade' ? (
                    currentSortDirection === 'asc' ? (
                      <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-2 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('status')}
                >
                  Status
                  {currentSortField === 'status' ? (
                    currentSortDirection === 'asc' ? (
                      <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-2 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
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
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 rounded" />
                    </TableCell>
                  </TableRow>
                ))
              : materials.map((material: MaterialDetails) => (
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
                ))}
          </TableBody>
        </Table>
      </div>

      {selectedMaterial && (
        <EditMaterialDialog
          key={selectedMaterial.id}
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedMaterial(null);
          }}
          material={selectedMaterial}
        />
      )}
      {meta && meta.totalPages > 0 && (
        <Pagination
          currentPage={meta.currentPage || 1}
          itemCount={meta.totalItems || 0}
          itemsPerPage={meta.itemsPerPage || 20}
          onPageChange={onPaginate}
        />
      )}
    </div>
  );
}
