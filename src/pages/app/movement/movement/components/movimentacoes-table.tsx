import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Eye,
  MoreHorizontal,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type {
  FetchMovementsResponse,
  Movement,
} from '@/api/stock/fetch-movements';
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
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { formatDate } from '@/utils/format-date';

import type { SortDirection, SortField } from '../movement-page';

interface SortIconProps {
  field: SortField;
  sortField: SortField;
  sortDirection: SortDirection;
}

function SortIcon({ field, sortField, sortDirection }: SortIconProps) {
  if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
  return sortDirection === 'asc' ? (
    <ArrowUp className="ml-2 h-4 w-4" />
  ) : (
    <ArrowDown className="ml-2 h-4 w-4" />
  );
}

interface MovementsTableProps {
  isLoading: boolean;
  movements: Movement[];
  movementsData?: FetchMovementsResponse;
  page: number;
  sortField: SortField;
  sortDirection: SortDirection;
  onSort: (field: SortField) => void;
  onPaginate: (newPage: number) => void;
}

export function MovementsTable({
  isLoading,
  movements,
  movementsData,
  page,
  sortField,
  sortDirection,
  onSort,
  onPaginate,
}: MovementsTableProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-4 p-4 md:p-6 pt-0">
      {/* ── Tabela ──────────────────────────────────────────────────────────── */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Endereço</TableHead>
              <TableHead className="hidden sm:table-cell">Material</TableHead>
              <TableHead>Tipo / Direção</TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent ml-auto flex"
                  onClick={() => onSort('quantity')}
                >
                  Qtd{' '}
                  <SortIcon
                    field="quantity"
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => onSort('date')}
                >
                  Data{' '}
                  <SortIcon
                    field="date"
                    sortField={sortField}
                    sortDirection={sortDirection}
                  />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">Observação</TableHead>
              <TableHead className="w-20 text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  {Array.from({ length: 7 }).map((_, j) => (
                    <TableCell key={j}>
                      <Skeleton className="h-4 w-24" />
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : movements.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="py-8 text-center text-muted-foreground"
                >
                  Nenhuma movimentação encontrada
                </TableCell>
              </TableRow>
            ) : (
              movements.map((movement: Movement) => {
                const addrLabel = [
                  movement.locationCode,
                  movement.subLocationCode,
                  movement.rowCode,
                  movement.shelfCode,
                  movement.positionCode,
                ]
                  .filter(Boolean)
                  .join(' / ');

                return (
                  <TableRow
                    key={movement.id}
                    className="group cursor-pointer hover:bg-muted/40"
                    onClick={() => {
                      void navigate(`/movement/movement/${movement.id}`);
                    }}
                  >
                    <TableCell>
                      <div
                        className="truncate text-sm max-w-[160px]"
                        title={addrLabel}
                      >
                        {addrLabel || movement.addressingId}
                      </div>
                    </TableCell>

                    <TableCell className="hidden sm:table-cell">
                      <div>
                        <div className="text-sm font-medium">
                          {movement.materialName}
                        </div>
                        <div className="font-mono text-xs text-muted-foreground">
                          {movement.materialCode}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex flex-col gap-1">
                        <Badge
                          variant={
                            movement.movementTypeDirection === 'IN'
                              ? 'default'
                              : 'destructive'
                          }
                          className="w-fit gap-1"
                        >
                          {movement.movementTypeDirection === 'IN' ? (
                            <TrendingUp className="h-3 w-3" />
                          ) : (
                            <TrendingDown className="h-3 w-3" />
                          )}
                          {movement.movementTypeDirection === 'IN'
                            ? 'Entrada'
                            : 'Saída'}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {movement.movementTypeName}
                        </span>
                      </div>
                    </TableCell>

                    <TableCell className="text-right font-mono font-medium tabular-nums">
                      {movement.quantity}
                    </TableCell>

                    <TableCell className="hidden text-sm md:table-cell">
                      {formatDate(movement.date)}
                    </TableCell>

                    <TableCell className="hidden max-w-[180px] truncate text-sm text-muted-foreground lg:table-cell">
                      {movement.observation ?? '—'}
                    </TableCell>

                    <TableCell
                      className="text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="opacity-0 transition-opacity group-hover:opacity-100"
                          >
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuLabel>Ações</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem
                            onClick={() => {
                              void navigate(
                                `/movement/movement/${movement.id}`,
                              );
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

      {/* ── Paginação ────────────────────────────────────────────────────────── */}
      {movementsData && movementsData.meta.totalPages > 1 && (
        <Pagination
          currentPage={page + 1}
          itemCount={movementsData.meta.totalItems}
          itemsPerPage={movementsData.meta.itemsPerPage}
          onPageChange={onPaginate}
        />
      )}
    </div>
  );
}
