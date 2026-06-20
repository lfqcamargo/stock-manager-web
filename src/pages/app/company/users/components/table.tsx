import type { UseMutationResult } from '@tanstack/react-query';
import {
  ArrowDown,
  ArrowUp,
  ArrowUpDown,
  Edit,
  MoreHorizontal,
  Search,
  Trash2,
  User as UserIcon,
} from 'lucide-react';
import { useState } from 'react';
import type { DateRange } from 'react-day-picker';

import type { User } from '@/@types/user';
import type { EditUserBody } from '@/api/user/edit-user';
import type { FetchUsersResponse } from '@/api/user/fetch-users';
import { Pagination } from '@/components/pagination';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
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
import { formatDate } from '@/utils/format-date';
import { formatRole } from '@/utils/format-role';
import { getInitials } from '@/utils/get-initials';

import { EditUserDialog } from './edit-user-dialog';

interface UsersTableProps {
  onDelete: (id: string) => void;
  isLoading?: boolean;
  editUserMutation: UseMutationResult<
    void,
    Error,
    { id: string; data: EditUserBody }
  >;
  users: User[];
  meta?: FetchUsersResponse['meta'];
  dateRange?: DateRange;
  nameFilter: string;
  emailFilter: string;
  roleFilter: string;
  activeFilter: string;
  sortBy: string;
  sortDirection: string;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onUpdateSearchParams: (updates: Record<string, string | null>) => void;
  onPaginate: (newPage: number) => void;
  onClearFilters: () => void;
}

type SortField = 'nome' | 'email' | 'cargo' | 'status' | 'dataCriacao';
type SortDirection = 'asc' | 'desc';

const sortFieldMapping: Record<
  SortField,
  'name' | 'email' | 'role' | 'active' | 'createdAt'
> = {
  nome: 'name',
  email: 'email',
  cargo: 'role',
  status: 'active',
  dataCriacao: 'createdAt',
};

const reverseSortFieldMapping: Record<string, SortField> = {
  name: 'nome',
  email: 'email',
  role: 'cargo',
  active: 'status',
  createdAt: 'dataCriacao',
};

export function UsersTable({
  onDelete,
  isLoading: externalLoading,
  editUserMutation,
  users,
  meta,
  dateRange,
  nameFilter,
  emailFilter,
  roleFilter,
  activeFilter,
  sortBy,
  sortDirection,
  onDateRangeChange,
  onUpdateSearchParams,
  onPaginate,
  onClearFilters,
}: UsersTableProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const itemsPerPage = 20;

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

  const loading = externalLoading || false;

  const roleColors: Record<string, string> = {
    ADMIN: 'text-purple-600',
    MANAGER: 'text-blue-600',
    EMPLOYEE: 'text-green-600',
  };

  function handleEdit(user: User) {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Nome do usuário..."
              className="pl-10 h-10"
              value={nameFilter}
              onChange={(e) =>
                onUpdateSearchParams({ name: e.target.value || null })
              }
            />
          </div>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="E-mail..."
              className="pl-10 h-10"
              value={emailFilter}
              onChange={(e) =>
                onUpdateSearchParams({ email: e.target.value || null })
              }
            />
          </div>
          <Select
            value={roleFilter}
            onValueChange={(value) =>
              onUpdateSearchParams({ role: value === 'all' ? null : value })
            }
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Todos os cargos" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os cargos</SelectItem>
              <SelectItem value="ADMIN">Administrador</SelectItem>
              <SelectItem value="MANAGER">Gerente</SelectItem>
              <SelectItem value="EMPLOYEE">Funcionário</SelectItem>
            </SelectContent>
          </Select>
          <Select
            value={activeFilter}
            onValueChange={(value) =>
              onUpdateSearchParams({ active: value === 'all' ? null : value })
            }
          >
            <SelectTrigger className="h-10">
              <SelectValue placeholder="Todos os status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os status</SelectItem>
              <SelectItem value="true">Ativo</SelectItem>
              <SelectItem value="false">Inativo</SelectItem>
            </SelectContent>
          </Select>
          <div className="flex items-center gap-2 col-span-1 xl:col-span-2">
            <DateRangePicker
              date={dateRange}
              onDateChange={onDateRangeChange}
              placeholder="Selecione o período"
              className="h-10 flex-1"
            />
            {(nameFilter ||
              emailFilter ||
              roleFilter !== 'all' ||
              activeFilter !== 'all' ||
              dateRange) && (
              <Button
                variant="ghost"
                size="icon"
                onClick={onClearFilters}
                className="h-10 w-10 flex-shrink-0"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="lucide lucide-x"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </Button>
            )}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <UserIcon className="h-4 w-4" />
          <span>
            Mostrando {users.length} de {meta?.totalItems ?? 0} usuários
            {meta &&
              meta.totalPages > 1 &&
              ` • Página ${meta.page} de ${meta.totalPages}`}
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
                  onClick={() => handleSort('nome')}
                >
                  Usuário
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
                  onClick={() => handleSort('email')}
                >
                  E-mail
                  {currentSortField === 'email' ? (
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
              <TableHead className="hidden md:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('cargo')}
                >
                  Cargo
                  {currentSortField === 'cargo' ? (
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
              <TableHead className="hidden md:table-cell">
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
              <TableHead className="hidden lg:table-cell">
                <Button
                  variant="ghost"
                  className="h-auto p-0 font-semibold hover:bg-transparent"
                  onClick={() => handleSort('dataCriacao')}
                >
                  Data Criação
                  {currentSortField === 'dataCriacao' ? (
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
            {loading
              ? Array.from({ length: 5 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-9 w-9 rounded-full" />
                        <div className="space-y-1">
                          <Skeleton className="h-4 w-32" />
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Skeleton className="h-4 w-40" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Skeleton className="h-4 w-16" />
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="hidden xl:table-cell">
                      <Skeleton className="h-4 w-20" />
                    </TableCell>
                    <TableCell className="text-right">
                      <Skeleton className="h-8 w-8 rounded" />
                    </TableCell>
                  </TableRow>
                ))
              : users.map((user: User) => (
                  <TableRow key={user.id} className="group">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="h-9 w-9 rounded-lg">
                          <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
                            {getInitials(user.name)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="font-medium">{user.name}</div>
                      </div>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="text-sm text-muted-foreground">
                        {user.email}
                      </div>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant="secondary"
                        className={`text-xs ${roleColors[user.role]}`}
                      >
                        {formatRole(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      <Badge
                        variant={user.active ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {user.active ? 'Ativo' : 'Inativo'}
                      </Badge>
                    </TableCell>
                    <TableCell className="hidden lg:table-cell">
                      <div className="flex items-center gap-2 text-sm">
                        <UserIcon className="h-4 w-4 text-muted-foreground" />
                        {formatDate(user.createdAt)}
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
                          <DropdownMenuItem onClick={() => handleEdit(user)}>
                            <Edit className="mr-2 h-4 w-4" />
                            Editar usuário
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onDelete(user.id)}
                            className="text-destructive focus:text-destructive"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Excluir usuário
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
          </TableBody>
        </Table>
      </div>

      <EditUserDialog
        user={selectedUser}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editUserMutation={editUserMutation}
      />
      {meta && meta.totalPages > 0 && (
        <Pagination
          currentPage={meta.page}
          itemCount={meta.totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPaginate}
        />
      )}
    </div>
  );
}
