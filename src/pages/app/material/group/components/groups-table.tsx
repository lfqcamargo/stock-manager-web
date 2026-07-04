import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Boxes,
  Edit,
  Eye,
  Folder,
  MoreHorizontal,
  Trash2,
} from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Group } from '@/api/stock/fetch-groups';
import type { GetGroupsResponse } from '@/api/stock/fetch-groups';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
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

import { EditGroupDialog } from './edit-group-dialog';

interface GroupsTableProps {
  onDelete: ((id: string) => void) | undefined;
  isLoading?: boolean;
  groups: Group[];
  meta?: GetGroupsResponse['meta'];
  sortBy: string;
  sortDirection: string;
  onUpdateSearchParams: (updates: Record<string, string | null>) => void;
  onPaginate: (newPage: number) => void;
}

type SortField = 'codigo' | 'nome' | 'descricao' | 'status';
type SortDirection = 'asc' | 'desc';

const sortFieldMapping: Record<
  SortField,
  'code' | 'name' | 'description' | 'active'
> = {
  codigo: 'code',
  nome: 'name',
  descricao: 'description',
  status: 'active',
};

const reverseSortFieldMapping: Record<string, SortField> = {
  code: 'codigo',
  name: 'nome',
  description: 'descricao',
  active: 'status',
};

export function GroupsTable({
  onDelete,
  isLoading,
  groups,
  meta,
  sortBy,
  sortDirection,
  onUpdateSearchParams,
  onPaginate,
}: GroupsTableProps) {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  const currentSortField = reverseSortFieldMapping[sortBy] || 'nome';
  const currentSortDirection = sortDirection as SortDirection;

  function handleSort(field: SortField) {
    const newSortBy = sortFieldMapping[field];
    const newSortDirection =
      currentSortField === field && currentSortDirection === 'asc'
        ? 'desc'
        : 'asc';

    onUpdateSearchParams({
      sortBy: newSortBy,
      sortDirection: newSortDirection,
    });
  }

  function handleEdit(group: Group) {
    setSelectedGroup(group);
    setIsEditDialogOpen(true);
  }

  function handleView(group: Group) {
    void navigate(`/material/group/${group.id}`);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Boxes className="h-4 w-4 text-muted-foreground" />
          <span>
            Mostrando {groups.length} de {meta?.totalItems || 0} grupos
            {meta &&
              meta.totalPages > 1 &&
              ` • Página ${meta.currentPage || 1} de ${meta.totalPages}`}
          </span>
        </div>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('codigo')}
                >
                  Código
                  {currentSortField === 'codigo' ? (
                    currentSortDirection === 'asc' ? (
                      <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-2 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('nome')}
                >
                  Grupo
                  {currentSortField === 'nome' ? (
                    currentSortDirection === 'asc' ? (
                      <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-2 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead className="hidden lg:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('descricao')}
                >
                  Descrição
                  {currentSortField === 'descricao' ? (
                    currentSortDirection === 'asc' ? (
                      <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-2 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
                </Button>
              </TableHead>
              <TableHead>
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('status')}
                >
                  Status
                  {currentSortField === 'status' ? (
                    currentSortDirection === 'asc' ? (
                      <ArrowUp className="ml-2 h-4 w-4" />
                    ) : (
                      <ArrowDown className="ml-2 h-4 w-4" />
                    )
                  ) : (
                    <ArrowUpDown className="ml-2 h-4 w-4" />
                  )}
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
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-lg" />
                        <Skeleton className="h-4 w-32" />
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell>
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 rounded" />
                    </TableCell>
                  </TableRow>
                ))
              : groups.map((group: Group) => (
                  <TableRow key={group.id} className="group">
                    <TableCell className="font-medium">{group.code}</TableCell>
                    <TableCell>
                      <div
                        className="flex items-center gap-3 cursor-pointer"
                        onClick={() => handleView(group)}
                      >
                        <div className="h-9 w-9 rounded-lg overflow-hidden relative">
                          {group.photoUrl ? (
                            <img
                              src={group.photoUrl}
                              alt={group.name}
                              className="h-full w-full object-cover"
                              onError={(e) => {
                                (e.target as HTMLImageElement).style.display =
                                  'none';
                              }}
                            />
                          ) : null}
                          {!group.photoUrl ? (
                            <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                              <Folder className="h-4 w-4 text-primary" />
                            </div>
                          ) : null}
                        </div>
                        <div className="font-medium">{group.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell max-w-[300px] truncate">
                      {group.description || '-'}
                    </TableCell>
                    <TableCell>
                      <StatusBadge status={group.active} />
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
                          <DropdownMenuItem onClick={() => handleView(group)}>
                            <Eye className="mr-2 h-4 w-4" />
                            Ver
                          </DropdownMenuItem>
                          {onDelete && (
                            <>
                              <DropdownMenuItem
                                onClick={() => handleEdit(group)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Editar grupo
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => onDelete(group.id)}
                                className="text-destructive focus:text-destructive"
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Excluir grupo
                              </DropdownMenuItem>
                            </>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      {selectedGroup && (
        <EditGroupDialog
          key={selectedGroup.id}
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedGroup(null);
          }}
          group={selectedGroup}
        />
      )}
      {meta && meta.totalPages > 0 && (
        <Pagination
          currentPage={meta.currentPage || 1}
          itemCount={meta.totalItems || 0}
          itemsPerPage={meta.itemsPerPage || 20}
          onPageChange={onPaginate}
        />
      )}
    </div>
  );
}
