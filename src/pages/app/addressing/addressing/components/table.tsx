import { useQuery } from '@tanstack/react-query';
import {
  ArrowUpDown,
  Edit,
  MapPin,
  MoreHorizontal,
  Package,
  Trash2,
  X,
} from 'lucide-react';
import { useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { z } from 'zod';

import { type Addressing } from '@/api/stock/fetch-addressings';
import { type MaterialDetails } from '@/api/stock/fetch-materials';
import { fetchSubLocations } from '@/api/stock/fetch-sub-locations';
import { MaterialSearchDialog } from '@/components/material-search-dialog';
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
import { useLocation } from '@/hooks/use-location';
import { usePosition } from '@/hooks/use-position';
import { useRow } from '@/hooks/use-row';
import { useShelf } from '@/hooks/use-shelf';
import { formatDate } from '@/utils/format-date';

import { EditAddressingDialog } from './edit-dialog';

interface AddressingTableProps {
  onDelete: (id: string) => void;
  isLoading?: boolean;
}

type SortField = 'amount' | 'status' | 'dataAtualizacao';
type SortDirection = 'asc' | 'desc';

export function AddressingTable({ onDelete }: AddressingTableProps) {
  const [selectedAddressing, setSelectedAddressing] =
    useState<Addressing | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialDetails | null>(null);
  const [locationIdFilter, setLocationIdFilter] = useState<string>('all');
  const [subLocationIdFilter, setSubLocationIdFilter] = useState<string>('all');
  const [rowIdFilter, setRowIdFilter] = useState<string>('all');
  const [shelfIdFilter, setShelfIdFilter] = useState<string>('all');
  const [positionIdFilter, setPositionIdFilter] = useState<string>('all');
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [sortField, setSortField] = useState<SortField>('dataAtualizacao');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [searchParams, setSearchParams] = useSearchParams();

  const page = z.coerce
    .number()
    .transform((page) => page - 1)
    .parse(searchParams.get('page') ?? '1');

  // Buscar dados para os selects de filtro
  const { useGetLocationsStats } = useLocation();
  const { data: locationsData } = useGetLocationsStats();

  const { useGetRowsStats } = useRow();
  const { data: rowsData } = useGetRowsStats();

  const { useGetShelfsStats } = useShelf();
  const { data: shelfsData } = useGetShelfsStats();

  const { useGetPositionsStats } = usePosition();
  const { data: positionsData } = useGetPositionsStats();

  const { data: subLocationsData } = useQuery({
    queryKey: ['sub-locations-all', locationIdFilter],
    queryFn: () =>
      fetchSubLocations({
        locationId: locationIdFilter !== 'all' ? locationIdFilter : undefined,
        page: 1,
        itemsPerPage: 9999,
      }),
    staleTime: 5 * 60 * 1000,
  });

  const orderByMap: Record<SortField, 'createdAt' | 'amount' | 'active'> = {
    amount: 'amount',
    status: 'active',
    dataAtualizacao: 'createdAt',
  } as const;

  const { useGetAddressings } = useAddressing();
  const { data: addressingData, isLoading } = useGetAddressings(page, 20, {
    materialId: selectedMaterial?.id,
    locationId: locationIdFilter !== 'all' ? locationIdFilter : undefined,
    subLocationId:
      subLocationIdFilter !== 'all' ? subLocationIdFilter : undefined,
    rowId: rowIdFilter !== 'all' ? rowIdFilter : undefined,
    shelfId: shelfIdFilter !== 'all' ? shelfIdFilter : undefined,
    positionId: positionIdFilter !== 'all' ? positionIdFilter : undefined,
    active: activeFilter !== 'all' ? activeFilter === 'ativo' : undefined,
    orderBy: orderByMap[sortField],
    orderDirection: sortDirection,
  });

  const processedData = useMemo(() => {
    if (!addressingData?.addressings)
      return { filteredAddressings: [], totalPages: 0 };

    // Todos os filtros são feitos no servidor
    return {
      filteredAddressings: addressingData.addressings,
      totalPages: addressingData.meta.totalPages,
    };
  }, [addressingData?.addressings, addressingData?.meta?.totalPages]);

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
    setSelectedMaterial(null);
    setLocationIdFilter('all');
    setSubLocationIdFilter('all');
    setRowIdFilter('all');
    setShelfIdFilter('all');
    setPositionIdFilter('all');
    setActiveFilter('all');
  }

  function handleMaterialSelect(material: MaterialDetails) {
    setSelectedMaterial(material);
    setMaterialDialogOpen(false);
  }

  function handleEdit(addressing: Addressing) {
    setSelectedAddressing(addressing);
    setIsEditDialogOpen(true);
  }

  const hasActiveFilters =
    selectedMaterial !== null ||
    locationIdFilter !== 'all' ||
    subLocationIdFilter !== 'all' ||
    rowIdFilter !== 'all' ||
    shelfIdFilter !== 'all' ||
    positionIdFilter !== 'all' ||
    activeFilter !== 'all';

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="relative">
            <Button
              type="button"
              variant="outline"
              className="w-full h-11 justify-start"
              onClick={() => setMaterialDialogOpen(true)}
            >
              <Package className="mr-2 h-4 w-4" />
              {selectedMaterial
                ? `${selectedMaterial.code} - ${selectedMaterial.name}`
                : 'Selecionar Material'}
            </Button>
            {selectedMaterial && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1 h-8 w-8"
                onClick={() => setSelectedMaterial(null)}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          <Select
            value={locationIdFilter}
            onValueChange={(value) => {
              setLocationIdFilter(value);
              setSubLocationIdFilter('all');
            }}
          >
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
          <Select
            value={subLocationIdFilter}
            onValueChange={setSubLocationIdFilter}
          >
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Sub-Localização" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as sub-localizações</SelectItem>
              {subLocationsData?.subLocations?.map((subLocation) => (
                <SelectItem key={subLocation.id} value={subLocation.id}>
                  {subLocation.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={rowIdFilter} onValueChange={setRowIdFilter}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Fileira" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as fileiras</SelectItem>
              {rowsData?.rows?.map((row) => (
                <SelectItem key={row.id} value={row.id}>
                  {row.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={shelfIdFilter} onValueChange={setShelfIdFilter}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Prateleira" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as prateleiras</SelectItem>
              {shelfsData?.shelfs?.map((shelf) => (
                <SelectItem key={shelf.id} value={shelf.id}>
                  {shelf.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={positionIdFilter} onValueChange={setPositionIdFilter}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Posição" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as posições</SelectItem>
              {positionsData?.positions?.map((position) => (
                <SelectItem key={position.id} value={position.id}>
                  {position.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={activeFilter} onValueChange={setActiveFilter}>
            <SelectTrigger className="h-11">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos</SelectItem>
              <SelectItem value="ativo">Ativo</SelectItem>
              <SelectItem value="inativo">Inativo</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Material Search Dialog */}
      <MaterialSearchDialog
        open={materialDialogOpen}
        onOpenChange={setMaterialDialogOpen}
        onSelect={handleMaterialSelect}
        selectedMaterial={selectedMaterial}
      />

      {/* Results Summary */}
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4" />
          <span>
            Mostrando {processedData.filteredAddressings.length} de{' '}
            {addressingData?.meta.totalItems} endereçamentos
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
                  onClick={() => handleSort('dataAtualizacao')}
                >
                  Material
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('dataAtualizacao')}
                >
                  Local
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('dataAtualizacao')}
                >
                  Sub-Local
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden xl:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('dataAtualizacao')}
                >
                  Fileira
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden xl:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('dataAtualizacao')}
                >
                  Prateleira
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden xl:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('dataAtualizacao')}
                >
                  Posição
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('amount')}
                >
                  Quantidade
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('status')}
                >
                  Status
                  <ArrowUpDown className="ml-2 h-4 w-4" />
                </Button>
              </TableHead>
              <TableHead className="hidden xl:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('dataAtualizacao')}
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
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-4 w-24" />
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <Skeleton className="h-4 w-16" />
                  </TableCell>
                  <TableCell className="hidden lg:table-cell">
                    <Skeleton className="h-6 w-16 rounded" />
                  </TableCell>
                  <TableCell className="hidden xl:table-cell">
                    <Skeleton className="h-4 w-20" />
                  </TableCell>
                  <TableCell className="text-right">
                    <Skeleton className="h-8 w-8 rounded" />
                  </TableCell>
                </TableRow>
              ))
            ) : processedData.filteredAddressings.length === 0 ? (
              <TableRow>
                <TableCell
                  colSpan={10}
                  className="text-center py-8 text-muted-foreground"
                >
                  {hasActiveFilters
                    ? 'Nenhum endereçamento encontrado'
                    : 'Nenhum endereçamento cadastrado'}
                </TableCell>
              </TableRow>
            ) : (
              processedData.filteredAddressings.map(
                (addressing: Addressing) => (
                  <TableRow key={addressing.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="h-4 w-4 text-muted-foreground" />
                        <div>
                          <div className="font-medium">
                            {addressing.material
                              ? `${addressing.material.code} - ${addressing.material.name}`
                              : 'Sem material'}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            ID: {addressing.id.slice(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm font-medium">
                        {addressing.location.name}
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm font-medium">
                        {addressing.subLocation.name}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="text-sm font-medium">
                        {addressing.row.name}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="text-sm font-medium">
                        {addressing.shelf.name}
                      </div>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="text-sm font-medium">
                        {addressing.position.name}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge variant="outline">{addressing.amount || 0}</Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Badge
                        variant={addressing.active ? 'default' : 'secondary'}
                      >
                        {addressing.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <div className="text-sm text-muted-foreground">
                        {formatDate(addressing.createdAt)}
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
                            onClick={() => handleEdit(addressing)}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Editar endereçamento
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(addressing.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir endereçamento
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
      {selectedAddressing && (
        <EditAddressingDialog
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedAddressing(null);
          }}
          addressing={selectedAddressing}
        />
      )}
      {processedData.totalPages > 0 && (
        <Pagination
          currentPage={page}
          itemCount={addressingData?.meta.totalItems || 0}
          itemsPerPage={addressingData?.meta.itemsPerPage || 0}
          onPageChange={handlePaginate}
        />
      )}
    </div>
  );
}
