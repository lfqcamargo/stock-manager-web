import { useQuery } from '@tanstack/react-query';
import {
  Activity,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  Search,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { fetchMovementTypes } from '@/api/stock/fetch-movement-types';
import { type Movement } from '@/api/stock/fetch-movements';
import { Pagination } from '@/components/pagination';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
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
import { useMovement } from '@/hooks/use-movement';

import { MovementDetailsDialog } from './movement-details-dialog';

interface MovementsTableProps {
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

type SortField = 'date' | 'quantity' | 'movementType';
type SortDirection = 'asc' | 'desc';

export function MovementsTable(_props: MovementsTableProps) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(
    null,
  );
  const [movementTypeFilter, setMovementTypeFilter] = useState<string>('all');
  const [minQuantityFilter, setMinQuantityFilter] = useState<string>('');
  const [maxQuantityFilter, setMaxQuantityFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  const [searchParams, setSearchParams] = useSearchParams();
  const page = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1');

  // Buscar tipos de movimento para o filtro
  const { data: movementTypesData } = useQuery({
    queryKey: ['movement-types-all'],
    queryFn: () => fetchMovementTypes({ page: 1, itemsPerPage: 9999 }),
    staleTime: 5 * 60 * 1000,
  });

  const orderByMap: Record<SortField, 'date' | 'quantity' | 'movementType'> = {
    date: 'date',
    quantity: 'quantity',
    movementType: 'movementType',
  } as const;

  // Aplicar debounce nos filtros de quantidade
  const debouncedMinQuantity = useDebounce(minQuantityFilter, 2000);
  const debouncedMaxQuantity = useDebounce(maxQuantityFilter, 2000);

  const { useGetMovements } = useMovement();
  const { data: movementsData, isLoading } = useGetMovements(page, 20, {
    movementTypeId:
      movementTypeFilter !== 'all' ? movementTypeFilter : undefined,
    minQuantity:
      debouncedMinQuantity !== '' ? Number(debouncedMinQuantity) : undefined,
    maxQuantity:
      debouncedMaxQuantity !== '' ? Number(debouncedMaxQuantity) : undefined,
    orderBy: orderByMap[sortField],
    orderDirection: sortDirection,
  });

  const processedData = useMemo(() => {
    if (!movementsData?.movements)
      return { filteredMovements: [], totalPages: 0 };

    // Todos os filtros são feitos no servidor
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
      setSortDirection('desc');
    }
    // Resetar para primeira página ao alterar ordenação
    setSearchParams((state) => {
      state.set('page', '1');
      return state;
    });
  }

  function handleClearFilters() {
    setMovementTypeFilter('all');
    setMinQuantityFilter('');
    setMaxQuantityFilter('');
  }

  const getTypeBadge = (direction: string) => {
    switch (direction) {
      case 'IN':
        return (
          <Badge variant="default" className="bg-green-100 text-green-800">
            Entrada
          </Badge>
        );
      case 'OUT':
        return (
          <Badge variant="default" className="bg-red-100 text-red-800">
            Saída
          </Badge>
        );
      default:
        return <Badge variant="secondary">-</Badge>;
    }
  };

  const formatQuantity = (quantity: number, direction: string) => {
    const prefix = direction === 'IN' ? '+' : direction === 'OUT' ? '-' : '';
    return `${prefix}${Math.abs(quantity)}`;
  };

  const hasActiveFilters =
    movementTypeFilter !== 'all' ||
    minQuantityFilter !== '' ||
    maxQuantityFilter !== '';

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Select
            value={movementTypeFilter}
            onValueChange={setMovementTypeFilter}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Tipo de Movimento" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os tipos</SelectItem>
              {movementTypesData?.movementTypes?.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Quantidade mínima..."
              className="pl-10 h-11"
              value={minQuantityFilter}
              onChange={(e) => setMinQuantityFilter(e.target.value)}
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="number"
              placeholder="Quantidade máxima..."
              className="pl-10 h-11"
              value={maxQuantityFilter}
              onChange={(e) => setMaxQuantityFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Activity className="h-4 w-4" />
          <span>
            Mostrando {processedData.filteredMovements.length} de{' '}
            {movementsData?.meta.totalItems} movimentações
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
                  onClick={() => handleSort('date')}
                >
                  Data/Hora
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('movementType')}
                >
                  Tipo
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Material</TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('quantity')}
                >
                  Quantidade
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>Usuário</TableHead>
              <TableHead>Observação</TableHead>
              <TableHead className="w-[50px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-3 w-16" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-6 w-16 rounded-full" />
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col space-y-1">
                      <Skeleton className="h-4 w-32" />
                      <Skeleton className="h-3 w-24" />
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-4 w-12" />
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Skeleton className="h-6 w-6 rounded-full" />
                      <Skeleton className="h-4 w-20" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-3 w-24" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : processedData.filteredMovements.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  {hasActiveFilters
                    ? 'Nenhuma movimentação encontrada'
                    : 'Nenhuma movimentação cadastrada'}
                </TableCell>
              </TableRow>
            ) : (
              processedData.filteredMovements.map((mov) => (
                <TableRow key={mov.id} className="group">
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {new Date(mov.date).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(mov.date).toLocaleTimeString('pt-BR', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getTypeBadge(mov.movementType.direction)}
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">
                        {mov.addressing.material?.name ?? '-'}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {mov.addressing.material?.code ?? '-'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-medium">
                    <span
                      className={
                        mov.movementType.direction === 'IN'
                          ? 'text-green-600'
                          : mov.movementType.direction === 'OUT'
                            ? 'text-red-600'
                            : 'text-blue-600'
                      }
                    >
                      {formatQuantity(mov.quantity, mov.movementType.direction)}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs">
                          {mov.user.name
                            .split(' ')
                            .map((n) => n[0])
                            .join('')}
                        </AvatarFallback>
                      </Avatar>
                      <span className="text-sm">{mov.user.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-xs">{mov.observation ?? '-'}</span>
                  </TableCell>
                  <TableCell>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button
                          variant="ghost"
                          className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedMovement(mov);
                            setDetailsOpen(true);
                          }}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
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

      {/* Dialogs */}
      {selectedMovement && (
        <MovementDetailsDialog
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          movement={{
            material: selectedMovement.addressing.material!,
            addressing: selectedMovement.addressing,
            movementType: selectedMovement.movementType,
            quantity: selectedMovement.quantity,
            date: selectedMovement.date,
            observation: selectedMovement.observation,
          }}
        />
      )}

      {/* Pagination */}
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
