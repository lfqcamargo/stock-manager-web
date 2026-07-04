import { useQuery } from '@tanstack/react-query';
import {
  ArrowUpDown,
  Edit,
  Eye,
  MoreHorizontal,
  Trash2,
  Warehouse,
} from 'lucide-react';
import { useCallback, useRef, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import type { Addressing } from '@/api/stock/fetch-addressings';
import { fetchLocations } from '@/api/stock/fetch-locations';
import { fetchMaterials } from '@/api/stock/fetch-materials';
import { fetchPositions } from '@/api/stock/fetch-positions';
import { fetchRows } from '@/api/stock/fetch-rows';
import { fetchShelfs } from '@/api/stock/fetch-shelfs';
import { fetchSubLocations } from '@/api/stock/fetch-sub-locations';
import { MaterialCombobox } from '@/components/material-combobox';
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
import { useAddressing } from '@/hooks/use-addressing';

import { EditAddressingDialog } from './edit-dialog';

interface Props {
  onDelete: ((id: string) => void) | undefined;
}

export function AddressingTable({ onDelete }: Props) {
  const [selected, setSelected] = useState<Addressing | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const [locationFilter, setLocationFilter] = useState('all');
  const [subLocationFilter, setSubLocationFilter] = useState('all');
  const [rowFilter, setRowFilter] = useState('all');
  const [shelfFilter, setShelfFilter] = useState('all');
  const [positionFilter, setPositionFilter] = useState('all');
  const [materialFilter, setMaterialFilter] = useState('all');
  const [materialSearch, setMaterialSearch] = useState('');
  const materialSearchTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const [activeFilter, setActiveFilter] = useState('all');

  const [sortField, setSortField] = useState<'createdAt' | 'amount'>(
    'createdAt',
  );
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('desc');
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const page = z.coerce
    .number()
    .transform((p) => p - 1)
    .parse(searchParams.get('page') ?? '1');

  // ── Reference data ──────────────────────────────────────────────────────────
  const { data: locData } = useQuery({
    queryKey: ['locations', 0, 100, undefined],
    queryFn: () => fetchLocations({ page: 0, limit: 100 }),
  });

  const { data: subLocData } = useQuery({
    queryKey: [
      'subLocations',
      0,
      100,
      { locationId: locationFilter !== 'all' ? locationFilter : undefined },
    ],
    queryFn: () =>
      fetchSubLocations({
        page: 0,
        limit: 100,
        locationId: locationFilter !== 'all' ? locationFilter : undefined,
      }),
  });

  const { data: rowData } = useQuery({
    queryKey: ['rows', 0, 100, undefined],
    queryFn: () => fetchRows({ page: 0, limit: 100 }),
  });

  const { data: shelfData } = useQuery({
    queryKey: ['shelfs', 0, 100, undefined],
    queryFn: () => fetchShelfs({ page: 0, limit: 100 }),
  });

  const { data: positionData } = useQuery({
    queryKey: ['positions', 0, 100, undefined],
    queryFn: () => fetchPositions({ page: 0, limit: 100 }),
  });

  const handleMaterialSearchChange = useCallback((search: string) => {
    if (materialSearchTimerRef.current) clearTimeout(materialSearchTimerRef.current);
    materialSearchTimerRef.current = setTimeout(() => {
      setMaterialSearch(search);
    }, 300);
  }, []);

  const { data: matData, isFetching: matFetching } = useQuery({
    queryKey: [
      'materials',
      0,
      100,
      { orderBy: 'name', orderDirection: 'asc', active: true, name: materialSearch || undefined },
    ],
    queryFn: () =>
      fetchMaterials(0, 100, {
        orderBy: 'name',
        orderDirection: 'asc',
        active: true,
        name: materialSearch || undefined,
      }),
  });

  // ── Main query ───────────────────────────────────────────────────────────────
  const { useGetAddressings } = useAddressing();
  const { data, isLoading } = useGetAddressings(page, 20, {
    locationId: locationFilter !== 'all' ? locationFilter : undefined,
    subLocationId: subLocationFilter !== 'all' ? subLocationFilter : undefined,
    rowId: rowFilter !== 'all' ? rowFilter : undefined,
    shelfId: shelfFilter !== 'all' ? shelfFilter : undefined,
    positionId: positionFilter !== 'all' ? positionFilter : undefined,
    materialId: materialFilter !== 'all' ? materialFilter : undefined,
    active: activeFilter === 'all' ? undefined : activeFilter === 'true',
    orderBy: sortField,
    orderDirection: sortDir,
  });

  function handleSort(f: 'createdAt' | 'amount') {
    if (sortField === f) setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    else {
      setSortField(f);
      setSortDir(f === 'createdAt' ? 'desc' : 'asc');
    }
    setSearchParams((s) => {
      s.set('page', '1');
      return s;
    });
  }

  function handleFilterChange(
    setter: (v: string) => void,
    dependents?: Array<() => void>,
  ) {
    return (v: string) => {
      setter(v);
      dependents?.forEach((reset) => reset());
      setSearchParams((s) => {
        s.set('page', '1');
        return s;
      });
    };
  }

  function clearFilters() {
    setLocationFilter('all');
    setSubLocationFilter('all');
    setRowFilter('all');
    setShelfFilter('all');
    setPositionFilter('all');
    setMaterialFilter('all');
    setActiveFilter('all');
    setSearchParams((s) => {
      s.set('page', '1');
      return s;
    });
  }

  const hasActiveFilter =
    locationFilter !== 'all' ||
    subLocationFilter !== 'all' ||
    rowFilter !== 'all' ||
    shelfFilter !== 'all' ||
    positionFilter !== 'all' ||
    materialFilter !== 'all' ||
    activeFilter !== 'all';

  const addressings = data?.addressings ?? [];
  const meta = data?.meta;

  const materialsFromAddressings = Array.from(
    new Map(
      addressings
        .filter((a) => a.material)
        .map((a) => [a.material!.id, a.material!]),
    ).values(),
  );

  return (
    <div className="space-y-6 p-6">
      {/* Filters */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {/* Localização */}
        <Select
          value={locationFilter}
          onValueChange={handleFilterChange(setLocationFilter, [
            () => setSubLocationFilter('all'),
          ])}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Localização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as localizações</SelectItem>
            {locData?.locations?.map((l) => (
              <SelectItem key={l.id} value={l.id}>
                {l.code} — {l.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Sub-localização (cascata: filtra por locationId) */}
        <Select
          value={subLocationFilter}
          onValueChange={handleFilterChange(setSubLocationFilter)}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Sub-localização" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as sub-localizações</SelectItem>
            {subLocData?.subLocations?.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.code} — {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Fileira */}
        <Select
          value={rowFilter}
          onValueChange={handleFilterChange(setRowFilter)}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Fileira" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as fileiras</SelectItem>
            {rowData?.rows?.map((r) => (
              <SelectItem key={r.id} value={r.id}>
                {r.code} — {r.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Prateleira */}
        <Select
          value={shelfFilter}
          onValueChange={handleFilterChange(setShelfFilter)}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Prateleira" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as prateleiras</SelectItem>
            {shelfData?.shelfs?.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.code} — {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Posição */}
        <Select
          value={positionFilter}
          onValueChange={handleFilterChange(setPositionFilter)}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Posição" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas as posições</SelectItem>
            {positionData?.positions?.map((p) => (
              <SelectItem key={p.id} value={p.id}>
                {p.code} — {p.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Material */}
        <MaterialCombobox
          materials={matData?.materials ?? []}
          value={materialFilter}
          onValueChange={handleFilterChange(setMaterialFilter)}
          onSearchChange={handleMaterialSearchChange}
          isLoading={matFetching}
          showAllOption
          allLabel="Todos os materiais"
          placeholder="Material"
          triggerClassName="h-11"
        />

        {/* Status */}
        <Select
          value={activeFilter}
          onValueChange={handleFilterChange(setActiveFilter)}
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os status</SelectItem>
            <SelectItem value="true">Ativo</SelectItem>
            <SelectItem value="false">Inativo</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Warehouse className="h-4 w-4" />
          <span>
            {meta
              ? `${addressings.length} de ${meta.totalItems} endereçamentos`
              : 'Carregando...'}
            {meta &&
              meta.totalPages > 1 &&
              ` • Página ${page + 1} de ${meta.totalPages}`}
          </span>
        </div>
        {hasActiveFilter && (
          <Button variant="ghost" size="sm" onClick={clearFilters}>
            Limpar filtros
          </Button>
        )}
      </div>

      {/* Table */}
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
                  onClick={() => handleSort('amount')}
                >
                  Saldo <ArrowUpDown className="ml-2 h-4 w-4" />
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
                    <div className="font-medium text-sm">
                      {addr.location.code}
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {addr.location.name}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-sm">
                    <div>{addr.subLocation.code}</div>
                    <div className="text-muted-foreground">{addr.row.code}</div>
                  </TableCell>
                  <TableCell className="hidden lg:table-cell text-sm">
                    <div>{addr.shelf.code}</div>
                    <div className="text-muted-foreground">
                      {addr.position.code}
                    </div>
                  </TableCell>
                  <TableCell>
                    {addr.material ? (
                      <div>
                        <div className="font-medium text-sm">
                          {addr.material.code}
                        </div>
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
