import {
  ArrowUpDown,
  Edit,
  Eye,
  MapPin,
  MoreHorizontal,
  Search,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import type { SubLocation } from '@/api/stock/fetch-sub-locations';
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
import { useLocation } from '@/hooks/use-location';
import { useSubLocation } from '@/hooks/use-sub-location';

import { EditSubLocationDialog } from './edit-dialog';

interface Props {
  onDelete: (id: string) => void;
}

export function SubLocationsTable({ onDelete }: Props) {
  const [selected, setSelected] = useState<SubLocation | null>(null);
  const [editOpen, setEditOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState('');
  const [codeFilter, setCodeFilter] = useState('');
  const [locationFilter, setLocationFilter] = useState('all');
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

  const { useGetLocations } = useLocation();
  const { data: locationsData } = useGetLocations(0, 100);

  const { useGetSubLocations } = useSubLocation();
  const { data, isLoading } = useGetSubLocations(page, 20, {
    locationId: locationFilter !== 'all' ? locationFilter : undefined,
    name: debouncedName || undefined,
    code: debouncedCode || undefined,
    orderBy: sortField,
    orderDirection: sortDir,
  });

  function handleSort(field: 'name' | 'code') {
    if (sortField === field) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(field);
      setSortDir('asc');
    }
    setSearchParams((s) => {
      s.set('page', '1');
      return s;
    });
  }

  function handlePaginate(p: number) {
    setSearchParams((s) => {
      s.set('page', (p + 1).toString());
      return s;
    });
  }

  const subLocations = data?.subLocations ?? [];
  const meta = data?.meta;

  return (
    <div className="space-y-6 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome..."
            className="pl-10 h-11"
            value={nameFilter}
            onChange={(e) => setNameFilter(e.target.value)}
          />
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por código..."
            className="pl-10 h-11"
            value={codeFilter}
            onChange={(e) => setCodeFilter(e.target.value)}
          />
        </div>
        <Select
          value={locationFilter}
          onValueChange={(v) => {
            setLocationFilter(v);
            setSearchParams((s) => {
              s.set('page', '1');
              return s;
            });
          }}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Filtrar por localização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as localizações</SelectItem>
            {locationsData?.locations?.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.code} — {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>
            {meta
              ? `${subLocations.length} de ${meta.totalItems} sub-localizações`
              : 'Carregando...'}
            {meta &&
              meta.totalPages > 1 &&
              ` • Página ${page + 1} de ${meta.totalPages}`}
          </span>
        </div>
        {(nameFilter || codeFilter || locationFilter !== 'all') && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setNameFilter('');
              setCodeFilter('');
              setLocationFilter('all');
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
              <TableHead className="hidden md:table-cell">
                Localização
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
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-28" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell>
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : subLocations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhuma sub-localização encontrada
                </TableCell>
              </TableRow>
            ) : (
              subLocations.map((sub) => (
                <TableRow key={sub.id} className="group">
                  <TableCell>
                    <span className="font-mono text-sm">{sub.code}</span>
                  </TableCell>
                  <TableCell>
                    <span className="font-medium">{sub.name}</span>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm text-muted-foreground">
                    {sub.location
                      ? `${sub.location.code} — ${sub.location.name}`
                      : sub.locationId}
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm text-muted-foreground">
                    {sub.description || '—'}
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
                          onClick={() => navigate(`/addressing/sub-location/${sub.id}`)}
                        >
                          <Eye className="mr-2 h-4 w-4" /> Visualizar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => {
                            setSelected(sub);
                            setEditOpen(true);
                          }}
                        >
                          <Edit className="mr-2 h-4 w-4" /> Editar
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => onDelete(sub.id)}
                          className="text-destructive focus:text-destructive"
                        >
                          <Trash2 className="mr-2 h-4 w-4" /> Excluir
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
        <EditSubLocationDialog
          open={editOpen}
          onOpenChange={(o) => {
            setEditOpen(o);
            if (!o) setSelected(null);
          }}
          sublocation={selected}
        />
      )}

      {meta && meta.totalPages > 1 && (
        <Pagination
          currentPage={page}
          itemCount={meta.totalItems}
          itemsPerPage={meta.itemsPerPage}
          onPageChange={handlePaginate}
        />
      )}
    </div>
  );
}
