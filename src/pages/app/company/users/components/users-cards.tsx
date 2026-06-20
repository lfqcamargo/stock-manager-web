import { Edit, Trash2, User as UserIcon } from 'lucide-react';
import { useState } from 'react';

import type { User } from '@/@types/user';
import type { FetchUsersResponse } from '@/api/user/fetch-users';
import { Pagination } from '@/components/pagination';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/format-date';
import { formatRole } from '@/utils/format-role';
import { getInitials } from '@/utils/get-initials';

import { EditUserDialog } from './edit-user-dialog';

interface UsersCardsProps {
  onDelete: (id: string) => void;
  isLoading?: boolean;
  editUserMutation: any;
  users: User[];
  meta?: FetchUsersResponse['meta'];
  onPaginate: (newPage: number) => void;
}

export function UsersCards({
  onDelete,
  isLoading,
  editUserMutation,
  users,
  meta,
  onPaginate,
}: UsersCardsProps) {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const itemsPerPage = 20;

  const roleColors: Record<string, string> = {
    ADMIN: 'text-purple-600',
    MANAGER: 'text-blue-600',
    EMPLOYEE: 'text-green-600',
  };

  function handleEdit(user: User) {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <Card key={index} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <Skeleton className="h-12 w-12 rounded-lg" />
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-3 w-48" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-3 justify-end">
                <Skeleton className="h-8 w-8 rounded" />
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {users.map((user: User) => (
          <Card key={user.id} className="overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <Avatar className="h-12 w-12 rounded-lg">
                  <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-sm">
                    {getInitials(user.name)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{user.name}</h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {user.email}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <UserIcon className="h-4 w-4" />
                  <span>{formatDate(user.createdAt)}</span>
                </div>

                <div className="flex items-center gap-3">
                  <Badge
                    variant="secondary"
                    className={`${roleColors[user.role]}`}
                  >
                    {formatRole(user.role)}
                  </Badge>
                  <Badge
                    variant={user.active ? 'default' : 'destructive'}
                    className="text-xs"
                  >
                    {user.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-3 flex justify-between items-center">
              <span className="text-xs text-muted-foreground">Ações</span>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(user)}
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() => onDelete(user.id)}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Excluir
                </Button>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      <EditUserDialog
        user={selectedUser}
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        editUserMutation={editUserMutation}
      />

      {meta && meta.totalPages > 0 && (
        <Pagination
          currentPage={meta.currentPage ?? meta.page ?? 1}
          itemCount={meta.totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={onPaginate}
        />
      )}
    </div>
  );
}
