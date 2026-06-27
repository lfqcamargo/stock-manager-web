import { ArrowUpDown, Eye, MoreHorizontal, Package } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { fetchAddressings } from '@/api/stock/fetch-addressings';
import { fetchMovementTypes } from '@/api/stock/fetch-movement-types';
import type { Movement } from '@/api/stock/fetch-movements';
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
import { useMovement } from '@/hooks/use-movement';
import { useMovementType } from '@/hooks/use-movement-type';
import { formatDate } from '@/utils/format-date';
import { useQuery } from '@tanstack/react-query';

import { MovementDetailsDialog } from './movement-details-dialog';

type SortField = 'quantity' | 'date' | 'createdAt';
type SortDirection = 'asc' | 'desc';

export function MovementsTable() {
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(
    null,
  );
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [addressingFilter, setAddressingFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchParams, setSearchParams] = useSearchParams();

  const page = z.coerce
    .number()
    .transform((p) => p - 1)
    .parse(searchParams.get('page') ?? '1');

  const { useGetMovements } = useMovement();
  const { useGetMovementTypes } = useMovementType();

  const { data: typesData } = useGetMovementTypes(0, 100);

  const { data: addressingsData } = useQuery({
    queryKey: ['addressings', 0, 100, { active: true }],
    queryFn: () => fetchAddressings({ page: 0, limit: 100, active: true }),
  });

  const { data: movementsData, isLoading } = useGetMovements(page, 20, {
    addressingId: addressingFilter !== 'all' ? addressingFilter : undefined,
    movementTypeId: typeFilter !== 'all' ? typeFilter : undefined,
    orderBy: sortField,
    orderDirection: sortDirection,
  });

  const processedData = useMemo(() => {
    if (!movementsData?.movements)
      return { movements: [], totalPages: 0 };
    return {
      movements: movementsData.movements,
      totalPages: movementsData.meta.totalPages,
    };
  }, [movementsData?.movements, movementsData?.meta?.totalPages]);

  // Maps for quick lookup
  const typesMap = useMemo(() => {
    const map = new Map<string, { name: string; direction: 'IN' | 'OUT' }>();
    typesData?.movementTypes.forEach((t) => map.set(t.id, t));
    return map;
  }, [typesData]);

  const addressingsMap = useMemo(() => {
    const map = new Map<string, string>();
    addressingsData?.addressings.forEach((a) => {
      const label = [
        a.location?.name,
        a.subLocation?.name,
        a.row?.name,
        a.shelf?.name,
        a.position?.name,
      ]
        .filter(Boolean)
        .join(' / ');
      map.set(a.id, label || a.id);
    });
    return map;
  }, [addressingsData]);

  function handlePaginate(p: number) {
    setSearchParams((state) => {
      state.set('page', (p + 1).toString());
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

  const hasActiveFilters = addressingFilter !== 'all' || typeFilter !== 'all';

  return (
    <div className="space-y-6 p-4 md:p-6">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Select value={addressingFilter} onValueChange={setAddressingFilter}>
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Endereçamento" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os endereçamentos</SelectItem>
            {addressingsData?.addressings.map((a) => (
              <SelectItem key={a.id} value={a.id}>
                {[
                  a.location?.name,
                  a.subLocation?.name,
                  a.row?.name,
                  a.shelf?.name,
                  a.position?.name,
                ]
                  .filter(Boolean)
                  .join(' / ') || a.id}
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
            {typesData?.movementTypes.map((type) => (
              <SelectItem key={type.id} value={type.id}>
                {type.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Package className="h-4 w-4" />
          <span>
            {movementsData
              ? `${processedData.movements.length} de ${movementsData.meta.totalItems} movimentações`
              : 'Carregando...'}
            {processedData.totalPages > 1 &&
              ` • Página ${page + 1} de ${processedData.totalPages}`}
          </span>
        </div>
        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setAddressingFilter('all');
              setTypeFilter('all');
            }}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Endereçamento</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('quantity')}
                >
                  Quantidade <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('date')}
                >
                  Data <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">Observação</TableHead>
              <TableHead className="text-right w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
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
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : processedData.movements.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhuma movimentação encontrada
                </TableCell>
              </TableRow>
            ) : (
              processedData.movements.map((movement) => {
                const movType = typesMap.get(movement.movementTypeId);
                const addressingLabel =
                  addressingsMap.get(movement.addressingId) ??
                  movement.addressingId;
                return (
                  <TableRow key={movement.id} className="group">
                    <TableCell className="text-sm">{addressingLabel}</TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          movType?.direction === 'IN' ? 'default' : 'destructive'
                        }
                      >
                        {movType?.name ?? movement.movementTypeId}
                      </Badge>
                    </TableCell>
                    <TableCell className="font-medium">
                      {movement.quantity}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {formatDate(movement.date)}
                    </TableCell>
                    <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                      {movement.observation ?? '—'}
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
                            onClick={() => {
                              setSelectedMovement(movement);
                              setIsDetailsDialogOpen(true);
                            }}
                          >
                            <Eye className="mr-2 h-4 w-4" /> Ver detalhes
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {selectedMovement && (
        <MovementDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={(open) => {
            setIsDetailsDialogOpen(open);
            if (!open) setSelectedMovement(null);
          }}
          movement={selectedMovement}
          addressingLabel={addressingsMap.get(selectedMovement.addressingId)}
          movementType={typesMap.get(selectedMovement.movementTypeId)}
        />
      )}

      {processedData.totalPages > 1 && (
        <Pagination
          currentPage={page}
          itemCount={movementsData?.meta.totalItems ?? 0}
          itemsPerPage={movementsData?.meta.itemsPerPage ?? 20}
          onPageChange={handlePaginate}
        />
      )}
    </div>
  );
}
