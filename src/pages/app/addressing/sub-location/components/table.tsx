import {
  ArrowUpDown,
  Edit,
  MapPin,
  MoreHorizontal,
  Search,
  Trash2,
} from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { type Location } from '@/api/stock/fetch-locations';
import { type SubLocation } from '@/api/stock/fetch-sub-locations';
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
import { formatDate } from '@/utils/format-date';

import { EditSubLocationDialog } from './edit-dialog';

interface SubLocationsTableProps {
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

type SortField = 'nome' | 'descricao' | 'localizacao' | 'dataCriacao';
type SortDirection = 'asc' | 'desc';

export function SubLocationsTable({ onDelete }: SubLocationsTableProps) {
  const [selectedSubLocation, setSelectedSubLocation] =
    useState<SubLocation | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [nameFilter, setNameFilter] = useState<string>('');
  const [descriptionFilter, setDescriptionFilter] = useState<string>('');
  const [locationFilter, setLocationFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('nome');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [searchParams, setSearchParams] = useSearchParams();

  const page = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1');

  const { useGetLocationsStats } = useLocation();
  const { data: locationsData } = useGetLocationsStats();

  const orderByMap: Record<SortField, 'name' | 'createdAt' | 'locationId'> = {
    nome: 'name',
    descricao: 'name',
    localizacao: 'locationId',
    dataCriacao: 'createdAt',
  } as const;

  const locationIdFilterValue =
    locationFilter !== 'all' ? locationFilter : undefined;

  // Aplicar debounce nos filtros de texto (reduzido para 500ms)
  const debouncedNameFilter = useDebounce(nameFilter, 500);
  const debouncedDescriptionFilter = useDebounce(descriptionFilter, 500);

  const { useGetSubLocations } = useSubLocation();
  const { data: subLocationsData, isLoading } = useGetSubLocations(page, 20, {
    locationId: locationIdFilterValue,
    name: debouncedNameFilter || undefined,
    description: debouncedDescriptionFilter || undefined,
    orderBy: orderByMap[sortField],
    orderDirection: sortDirection,
  });

  // Removido auto-seleção da primeira localização para permitir "todas"

  const processedData = useMemo(() => {
    if (!subLocationsData?.subLocations)
      return { filteredSubLocations: [], totalPages: 0 };

    // Todos os filtros são feitos no servidor
    return {
      filteredSubLocations: subLocationsData.subLocations,
      totalPages: subLocationsData.meta.totalPages,
    };
  }, [subLocationsData?.subLocations, subLocationsData?.meta?.totalPages]);

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
    setLocationFilter('all');
  }

  function handleEdit(subLocation: SubLocation) {
    setSelectedSubLocation(subLocation);
    setIsEditDialogOpen(true);
  }

  function handleLocationChange(locationId: string) {
    setLocationFilter(locationId);
    // Resetar página quando trocar de location
    setSearchParams((state) => {
      state.set('page', '1');
      return state;
    });
  }

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
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Descrição..."
              className="pl-10 h-11"
              value={descriptionFilter}
              onChange={(e) => setDescriptionFilter(e.target.value)}
            />
          </div>
          <Select value={locationFilter} onValueChange={handleLocationChange}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Localização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as localizações</SelectItem>
              {locationsData?.locations?.map((location) => (
                <SelectItem key={location.id} value={location.id}>
                  {location.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>
            Mostrando {processedData.filteredSubLocations.length} de{' '}
            {subLocationsData?.meta.totalItems} sub-localizações
            {processedData.totalPages > 1 &&
              ` • Página ${page + 1} de ${processedData.totalPages}`}
          </span>
        </div>
        <div className="h-3.5">
          {(nameFilter ||
            descriptionFilter ||
            (locationFilter !== 'all' &&
              locationsData?.locations &&
              locationsData.locations.length > 0 &&
              locationFilter !== locationsData.locations[0].id)) && (
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
              <TableHead className="hidden xl:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('localizacao')}
                >
                  Localização
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
            {isLoading ? (
              Array.from({ length: 5 }).map((_, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-40" />
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <Skeleton className="h-4 w-32" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : processedData.filteredSubLocations.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={5}
                  className="text-center py-8 text-muted-foreground"
                >
                  Nenhuma sub-localização encontrada
                </TableCell>
              </TableRow>
            ) : (
              processedData.filteredSubLocations.map(
                (subLocation: SubLocation) => (
                  <TableRow key={subLocation.id} className="group">
                    <TableCell>
                      <div className="font-medium">{subLocation.name}</div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm text-muted-foreground">
                        {subLocation.description || '—'}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="text-sm text-muted-foreground">
                        {subLocation.locationName || '—'}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        {formatDate(subLocation.createdAt)}
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
                            onClick={() => handleEdit(subLocation)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar sub-localização
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(subLocation.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir sub-localização
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ),
              )
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      {selectedSubLocation && (
        <EditSubLocationDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedSubLocation(null);
          }}
          sublocation={selectedSubLocation}
        />
      )}
      {processedData.totalPages > 0 && locationIdFilterValue && (
        <Pagination
          currentPage={page}
          itemCount={subLocationsData?.meta.totalItems || 0}
          itemsPerPage={subLocationsData?.meta.itemsPerPage || 0}
          onPageChange={handlePaginate}
        />
      )}
    </div>
  );
}
