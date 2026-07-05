import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type {
  Addressing,
  FetchAddressingsResponse,
} from '@/api/stock/fetch-addressings';
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

import type { AddressingSortDirection, AddressingSortField } from '../addressing-page';
import { EditAddressingDialog } from './edit-dialog';

interface AddressingTableProps {
  isLoading: boolean;
  addressings: Addressing[];
  meta?: FetchAddressingsResponse['meta'];
  page: number;
  sortField: AddressingSortField;
  sortDir: AddressingSortDirection;
  onSort: (field: AddressingSortField) => void;
  onPaginate: (newPage: number) => void;
  onDelete: ((id: string) => void) | undefined;
}

function SortIcon({
  field,
  sortField,
  sortDir,
}: {
  field: AddressingSortField;
  sortField: AddressingSortField;
  sortDir: AddressingSortDirection;
}) {
  if (sortField !== field) return <ArrowUpDown className="ml-2 h-4 w-4" />;
  return sortDir === 'asc' ? (
    <ArrowUp className="ml-2 h-4 w-4" />
  ) : (
    <ArrowDown className="ml-2 h-4 w-4" />
  );
}

export function AddressingTable({
  isLoading,
  addressings,
  meta,
  page,
  sortField,
  sortDir,
  onSort,
  onPaginate,
  onDelete,
}: AddressingTableProps) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Addressing | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const materialsFromAddressings = Array.from(
    new Map(
      addressings
        .filter((a) => a.material)
        .map((a) => [a.material!.id, a.material!]),
    ).values(),
  );

  return (
    <div className="space-y-4 p-4 md:p-6 pt-0">
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>Localização</TableHead>
              <TableHead className="hidden md:table-cell">
                Sub-local / Fileira
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                Prateleira / Posição
              </TableHead>
              <TableHead>Material</TableHead>
              <TableHead className="text-right">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent ml-auto flex"
                  onClick={() => onSort('amount')}
                >
                  Saldo{' '}
                  <SortIcon field="amount" sortField={sortField} sortDir={sortDir} />
                </Button>
              </TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right w-20">Ações</TableHead>
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
            ) : addressings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={7}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhum endereçamento encontrado
                </TableCell>
              </TableRow>
            ) : (
              addressings.map((addr) => (
                <TableRow key={addr.id} className="group">
                  <TableCell>
                    <div className="font-medium text-sm">{addr.location.code}</div>
                    <div className="text-xs text-muted-foreground">{addr.location.name}</div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    <div>{addr.subLocation.code}</div>
                    <div className="text-muted-foreground">{addr.row.code}</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">
                    <div>{addr.shelf.code}</div>
                    <div className="text-muted-foreground">{addr.position.code}</div>
                  </TableCell>
                  <TableCell>
                    {addr.material ? (
                      <div>
                        <div className="font-medium text-sm">{addr.material.code}</div>
                        <div className="text-xs text-muted-foreground truncate max-w-[140px]">
                          {addr.material.name}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-sm">—</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge
                      variant={addr.amount > 0 ? 'default' : 'outline'}
                      className="tabular-nums"
                    >
                      {addr.amount}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={addr.active ? 'default' : 'destructive'}>
                      {addr.active ? 'Ativo' : 'Inativo'}
                    </Badge>
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
                          onClick={() =>
                            void navigate(`/addressing/addressing/${addr.id}`)
                          }
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        {onDelete && (
                          <>
                            <DropdownMenuItem
                              onClick={() => {
                                setSelected(addr);
                                setEditOpen(true);
                              }}
                            >
                              <Edit className="mr-2 h-4 w-4" />
                              Editar
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onDelete(addr.id)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Excluir
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {selected && (
        <EditAddressingDialog
          open={editOpen}
          onOpenChange={(o) => {
            setEditOpen(o);
            if (!o) setSelected(null);
          }}
          addressing={selected}
          materials={materialsFromAddressings}
        />
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={page + 1}
          itemCount={meta.totalItems}
          itemsPerPage={meta.itemsPerPage}
          onPageChange={onPaginate}
        />
      )}
    </div>
  );
}
