import {
  ArrowUpDown,
  Edit,
  Eye,
  MoreHorizontal,
  Rows3,
  Search,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import type { Row } from '@/api/stock/fetch-rows';
import { Pagination } from '@/components/pagination';
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
import { useRow } from '@/hooks/use-row';

import { EditRowDialog } from './edit-dialog';

interface Props {
  onDelete: (id: string) => void;
}

export function RowsTable({ onDelete }: Props) {
  const [selected, setSelected] = useState<Row | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [codeFilter, setCodeFilter] = useState('');
  const [sortField, setSortField] = useState<'name' | 'code'>('name');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = z.coerce
    .number()
    .transform((p) => p - 1)
    .parse(searchParams.get('page') ?? '1');
  const debouncedName = useDebounce(nameFilter, 600);
  const debouncedCode = useDebounce(codeFilter, 600);

  const { useGetRows } = useRow();
  const { data, isLoading } = useGetRows(page, 20, {
    name: debouncedName || undefined,
    code: debouncedCode || undefined,
    orderBy: sortField,
    orderDirection: sortDir,
  });

  function handleSort(f: 'name' | 'code') {
    if (sortField === f) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(f);
      setSortDir('asc');
    }
    setSearchParams((s) => {
      s.set('page', '1');
      return s;
    });
  }

  const rows = data?.rows ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código..."
            className="pl-10 h-11"
            value={codeFilter}
            onChange={(e) => setCodeFilter(e.target.value)}
          />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            className="pl-10 h-11"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Rows3 className="h-4 w-4" />
          <span>
            {meta
              ? `${rows.length} de ${meta.totalItems} fileiras`
              : 'Carregando...'}
            {meta &&
              meta.totalPages > 1 &&
              ` • Página ${page + 1} de ${meta.totalPages}`}
          </span>
        </div>
        {(nameFilter || codeFilter) && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setNameFilter('');
              setCodeFilter('');
            }}
          >
            Limpar filtros
          </Button>
        )}
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('code')}
                >
                  Código <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('name')}
                >
                  Nome <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">Descrição</TableHead>
              <TableHead className="text-right w-20">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <TableRow key={i}>
                  <TableCell>
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : rows.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhuma fileira encontrada
                </TableCell>
              </TableRow>
            ) : (
              rows.map((row) => (
                <TableRow key={row.id} className="group">
                  <TableCell>
                    <span className="font-mono text-sm">{row.code}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{row.name}</span>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {row.description || '—'}
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
                          onClick={() => navigate(`/addressing/row/${row.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" />
                          Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(row);
                            setEditOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" />
                          Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(row.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Excluir
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

      {selected && (
        <EditRowDialog
          open={editOpen}
          onOpenChange={(o) => {
            setEditOpen(o);
            if (!o) setSelected(null);
          }}
          row={selected}
        />
      )}
      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={page + 1}
          itemCount={meta.totalItems}
          itemsPerPage={meta.itemsPerPage}
          onPageChange={(p) =>
            setSearchParams((s) => {
              s.set('page', p.toString());
              return s;
            })
          }
        />
      )}
    </div>
  );
}
