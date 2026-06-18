import {
  ArrowUpDown,
  Edit,
  Eye,
  MoreHorizontal,
  Package,
  Search,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { type Movement } from '@/api/stock/fetch-movements';
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
import { useMaterial } from '@/hooks/use-material';
import { useMovement } from '@/hooks/use-movement';
import { useMovementType } from '@/hooks/use-movement-type';
import { formatDate } from '@/utils/format-date';

import { MovementDetailsDialog } from './movement-details-dialog';

interface MovementsTableProps {
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

type SortField = 'material' | 'tipo' | 'quantidade' | 'data' | 'dataCriacao';
type SortDirection = 'asc' | 'desc';

export function MovementsTable({ onDelete }: MovementsTableProps) {
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(
    null,
  );
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [materialFilter, setMaterialFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('data');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchParams, setSearchParams] = useSearchParams();

  const page = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1');

  const { useGetMovements } = useMovement();
  const { useGetMaterials } = useMaterial();
  const { useGetMovementTypes } = useMovementType();
  const { data: materialsData } = useGetMaterials(0, 9999);
  const { data: typesData } = useGetMovementTypes(0, 9999);

  const { data: movementsData, isLoading } = useGetMovements(page, 20, {});

  const processedData = useMemo(() => {
    if (!movementsData?.movements)
      return { filteredMovements: [], totalPages: 0 };

    return {
      filteredMovements: movementsData.movements,
      totalPages: movementsData.meta.totalPages,
    };
  }, [movementsData?.movements, movementsData?.meta?.totalPages]);

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
    setSearchParams((state) => {
      state.set('page', '1');
      return state;
    });
  }

  function handleClearFilters() {
    setMaterialFilter('all');
    setTypeFilter('all');
  }

  function handleViewDetails(movement: Movement) {
    setSelectedMovement(movement);
    setIsDetailsDialogOpen(true);
  }

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select value={materialFilter} onValueChange={setMaterialFilter}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Material" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os materiais</SelectItem>
              {materialsData?.materials?.map((material) => (
                <SelectItem key={material.id} value={material.id}>
                  {material.name}
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
              {typesData?.movementTypes?.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <span>
            Mostrando {processedData.filteredMovements.length} de{' '}
            {movementsData?.meta.totalItems} movimentações
            {processedData.totalPages > 1 &&
              ` • Página ${page + 1} de ${processedData.totalPages}`}
          </span>
        </div>
        <div className="h-3.5">
          {(materialFilter !== 'all' || typeFilter !== 'all') && (
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
                  onClick={() => handleSort('material')}
                >
                  Material
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('tipo')}
                >
                  Tipo
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('quantidade')}
                >
                  Quantidade
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('data')}
                >
                  Data
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
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
                      <Skeleton className="h-4 w-32" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 rounded" />
                    </TableCell>
                  </TableRow>
                ))
              : processedData.filteredMovements.map((movement) => (
                  <TableRow key={movement.id} className="group">
                    <TableCell>
                      <div className="space-y-1">
                        <div className="font-medium">
                          {movement.material.name}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {movement.material.code}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          movement.movementType.direction === 'IN'
                            ? 'default'
                            : 'destructive'
                        }
                      >
                        {movement.movementType.name}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {movement.quantity}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(movement.date)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        {formatDate(movement.createdAt)}
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
                            onClick={() => handleViewDetails(movement)}
                          >
                            <Eye className="mr-2 h-4 w-4" />
                            Ver detalhes
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(movement.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir
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
      {selectedMovement && (
        <MovementDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={(open) => {
            setIsDetailsDialogOpen(open);
            if (!open) setSelectedMovement(null);
          }}
          movement={selectedMovement}
        />
      )}
      {processedData.totalPages > 0 && (
        <Pagination
          currentPage={page}
          itemCount={movementsData?.meta.totalItems || 0}
          itemsPerPage={movementsData?.meta.itemsPerPage || 0}
          onPageChange={handlePaginate}
        />
      )}
    </div>
  );
}
