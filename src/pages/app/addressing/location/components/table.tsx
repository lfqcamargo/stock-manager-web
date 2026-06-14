import {
  ArrowUpDown,
  Edit,
  MapPin,
  MoreHorizontal,
  Search,
  Trash2,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { type Location } from '@/api/stock/fetch-locations';
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
import { useLocation } from '@/hooks/use-location';
import { formatDate } from '@/utils/format-date';

import { EditLocationDialog } from './edit-dialog';

interface LocationsTableProps {
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

type SortField = 'nome' | 'descricao' | 'dataCriacao';
type SortDirection = 'asc' | 'desc';

export function LocationsTable({ onDelete }: LocationsTableProps) {
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(
    null,
  );
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [descriptionFilter, setDescriptionFilter] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('nome');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchParams, setSearchParams] = useSearchParams();

  const page = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1');

  const orderByMap: Record<SortField, 'name' | 'createdAt'> = {
    nome: 'name',
    descricao: 'name', // Descrição não é ordenável no backend, usar name
    dataCriacao: 'createdAt',
  } as const;

  // Aplicar debounce nos filtros de texto
  const debouncedNameFilter = useDebounce(nameFilter, 2000);
  const debouncedDescriptionFilter = useDebounce(descriptionFilter, 2000);

  const { useGetLocations } = useLocation();
  const { data: locationsData, isLoading } = useGetLocations(page, 20, {
    name: debouncedNameFilter || undefined,
    description: debouncedDescriptionFilter || undefined,
    orderBy: orderByMap[sortField],
    orderDirection: sortDirection,
  });

  const processedData = useMemo(() => {
    if (!locationsData?.locations)
      return { filteredLocations: [], totalPages: 0 };

    // Todos os filtros são feitos no servidor
    return {
      filteredLocations: locationsData.locations,
      totalPages: locationsData.meta.totalPages,
    };
  }, [locationsData?.locations, locationsData?.meta?.totalPages]);

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
    setDescriptionFilter('');
  }

  function handleEdit(location: Location) {
    setSelectedLocation(location);
    setIsEditDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nome..."
              className="pl-10 h-11"
              value={nameFilter}
              onChange={(e) => setNameFilter(e.target.value)}
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Descrição..."
              className="pl-10 h-11"
              value={descriptionFilter}
              onChange={(e) => setDescriptionFilter(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>
            Mostrando {processedData.filteredLocations.length} de{' '}
            {locationsData?.meta.totalItems} localizações
            {processedData.totalPages > 1 &&
              ` • Página ${page + 1} de ${processedData.totalPages}`}
          </span>
        </div>
        <div className="h-3.5">
          {(nameFilter || descriptionFilter) && (
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
              <TableHead className="hidden lg:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('descricao')}
                >
                  Descrição
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
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
                    <TableCell className="hidden lg:table-cell">
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 rounded" />
                    </TableCell>
                  </TableRow>
                ))
              : processedData.filteredLocations.map((location: Location) => (
                  <TableRow key={location.id} className="group">
                    <TableCell>
                      <div className="font-medium">{location.name}</div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm text-muted-foreground">
                        {location.description || '—'}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {formatDate(location.createdAt)}
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
                            onClick={() => handleEdit(location)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar localização
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(location.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir localização
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
      {selectedLocation && (
        <EditLocationDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedLocation(null);
          }}
          location={selectedLocation}
        />
      )}
      {processedData.totalPages > 0 && (
        <Pagination
          currentPage={page}
          itemCount={locationsData?.meta.totalItems || 0}
          itemsPerPage={locationsData?.meta.itemsPerPage || 0}
          onPageChange={handlePaginate}
        />
      )}
    </div>
  );
}
