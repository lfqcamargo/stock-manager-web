import {
  ArrowUpDown,
  Edit,
  MoreHorizontal,
  Search,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import type { MovementType } from '@/api/stock/fetch-movement-types';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
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
import { useMovementType } from '@/hooks/use-movement-type';

import { EditMovementTypeDialog } from './edit-movement-type-dialog';

interface MovementTypesTableProps {
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

type SortField = 'nome' | 'direcao' | 'dataCriacao';
type SortDirection = 'asc' | 'desc';

export function MovementTypesTable(_props: MovementTypesTableProps) {
  const [selectedType, setSelectedType] = useState<MovementType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [directionFilter, setDirectionFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('nome');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchParams, setSearchParams] = useSearchParams();
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [typeToDelete, setTypeToDelete] = useState<MovementType | null>(null);

  const page = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1');

  const orderByMap: Record<SortField, 'name' | 'direction' | 'createdAt'> = {
    nome: 'name',
    direcao: 'direction',
    dataCriacao: 'createdAt',
  } as const;

  const directionFilterValue =
    directionFilter !== 'all' ? (directionFilter as 'IN' | 'OUT') : undefined;

  // Aplicar debounce no filtro de nome
  const debouncedNameFilter = useDebounce(nameFilter, 2000);

  const { useGetMovementTypes, useDeleteMovementType } = useMovementType();
  const { data: typesData, isLoading } = useGetMovementTypes(page, 20, {
    name: debouncedNameFilter || undefined,
    direction: directionFilterValue,
    orderBy: orderByMap[sortField],
    orderDirection: sortDirection,
  });
  const { mutateAsync: deleteTypeFn } = useDeleteMovementType();

  const processedData = useMemo(() => {
    if (!typesData?.movementTypes) return { filteredTypes: [], totalPages: 0 };

    // Todos os filtros são feitos no servidor
    return {
      filteredTypes: typesData.movementTypes,
      totalPages: typesData.meta.totalPages,
    };
  }, [typesData?.movementTypes, typesData?.meta?.totalPages]);

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
    setNameFilter('');
    setDirectionFilter('all');
  }

  function handleEdit(type: MovementType) {
    setSelectedType(type);
    setIsEditDialogOpen(true);
  }

  function handleDeleteRequest(type: MovementType) {
    setTypeToDelete(type);
    setDeleteDialogOpen(true);
  }

  async function handleDeleteConfirmed() {
    if (!typeToDelete) return;
    await deleteTypeFn({ id: typeToDelete.id });
    setDeleteDialogOpen(false);
    setTypeToDelete(null);
  }

  const hasActiveFilters = nameFilter !== '' || directionFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nome..."
              className="pl-10 h-11"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          <Select value={directionFilter} onValueChange={setDirectionFilter}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Direção" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas direções</SelectItem>
              <SelectItem value="IN">Entrada</SelectItem>
              <SelectItem value="OUT">Saída</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <span>
            Mostrando {processedData.filteredTypes.length} de{' '}
            {typesData?.meta.totalItems} tipos de movimento
            {processedData.totalPages > 1 &&
              ` • Página ${page + 1} de ${processedData.totalPages}`}
          </span>
        </div>
        <div className="h-3.5">
          {hasActiveFilters && (
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
                  onClick={() => handleSort('direcao')}
                >
                  Direção
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : processedData.filteredTypes.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  {hasActiveFilters
                    ? 'Nenhum tipo de movimento encontrado'
                    : 'Nenhum tipo de movimento cadastrado'}
                </TableCell>
              </TableRow>
            ) : (
              processedData.filteredTypes.map((type) => (
                <TableRow key={type.id} className="group">
                  <TableCell className="font-medium">{type.name}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        type.direction === 'IN' ? 'default' : 'destructive'
                      }
                    >
                      {type.direction === 'IN' ? 'Entrada' : 'Saída'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(type.createdAt).toLocaleDateString('pt-BR')}
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
                        <DropdownMenuItem onClick={() => handleEdit(type)}>
                          <Edit className="mr-2 h-4 w-4" />
                          Editar tipo
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleDeleteRequest(type)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir tipo
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Paginação */}
      {processedData.totalPages > 0 && (
        <Pagination
          currentPage={page}
          itemCount={typesData?.meta.totalItems || 0}
          itemsPerPage={typesData?.meta.itemsPerPage || 0}
          onPageChange={handlePaginate}
        />
      )}

      {/* Dialog de edição */}
      {selectedType && (
        <EditMovementTypeDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedType(null);
          }}
          movementType={selectedType}
        />
      )}

      {/* Dialog de confirmação de exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar exclusão</DialogTitle>
          </DialogHeader>
          <p>
            Tem certeza que deseja excluir o tipo <b>{typeToDelete?.name}</b>?
            Esta ação não pode ser desfeita.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteDialogOpen(false)}
            >
              Cancelar
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfirmed}>
              Excluir
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
