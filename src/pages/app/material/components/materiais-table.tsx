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

import type { MaterialDetails } from '@/api/stock/fetch-materials';
import type { GetMaterialsResponse } from '@/api/stock/fetch-materials';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { getInitials } from '@/utils/get-initials';

import { EditMaterialDialog } from './edit-material-dialog';

interface MateriaisTableProps {
  onDelete: (id: string) => void;
  isLoading?: boolean;
  materials: MaterialDetails[];
  meta?: GetMaterialsResponse['meta'];
  sortBy: string;
  sortDirection: string;
  onUpdateSearchParams: (updates: Record<string, string | null>) => void;
  onPaginate: (newPage: number) => void;
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
  sortBy,
  sortDirection,
  onUpdateSearchParams,
  onPaginate,
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

  return (
    <div className="space-y-6">
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
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('nome')}
                >
                  Material
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
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
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
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-lg">
                          {material.photoUrl ? (
                            <AvatarImage
                              src={material.photoUrl}
                              alt={material.name}
                            />
                          ) : null}
                          <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
                            {getInitials(material.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{material.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="font-medium">
                      {material.code}
                    </TableCell>
                    <TableCell>{material.group}</TableCell>
                    <TableCell>{material.unit}</TableCell>
                    <TableCell>
                      <StatusBadge status={material.active} />
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
