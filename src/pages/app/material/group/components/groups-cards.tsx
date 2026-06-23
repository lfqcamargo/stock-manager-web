import { Edit, Eye, Folder, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type { Group } from '@/api/stock/fetch-groups';
import type { GetGroupsResponse } from '@/api/stock/fetch-groups';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { EditGroupDialog } from './edit-group-dialog';

interface GroupsCardsProps {
  onDelete: (id: string) => void;
  isLoading?: boolean;
  groups: Group[];
  meta?: GetGroupsResponse['meta'];
  onPaginate: (newPage: number) => void;
}

export function GroupsCards({
  onDelete,
  isLoading,
  groups,
  meta,
  onPaginate,
}: GroupsCardsProps) {
  const navigate = useNavigate();
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  function handleEdit(group: Group) {
    setSelectedGroup(group);
    setIsEditDialogOpen(true);
  }

  function handleView(group: Group) {
    void navigate(`/material/group/${group.id}`);
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
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-6 w-20 rounded-full" />
                  </div>
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-3 justify-end">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20 rounded" />
                  <Skeleton className="h-8 w-24 rounded" />
                </div>
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
        {groups.map((group: Group) => (
          <Card key={group.id} className="overflow-hidden group">
            <CardContent className="p-6">
              <div
                className="flex items-start gap-4 mb-4 cursor-pointer"
                onClick={() => handleView(group)}
              >
                <div className="h-12 w-12 rounded-lg overflow-hidden relative">
                  {group.photoUrl && (
                    <img
                      key={group.id}
                      src={group.photoUrl}
                      alt={group.name}
                      className="h-full w-full object-cover absolute top-0 left-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  {!group.photoUrl && (
                    <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                      <Folder className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{group.name}</h3>
                  <p className="text-sm text-muted-foreground">{group.code}</p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Descrição:</span>
                  <span className="font-medium">
                    {group.description || 'N/A'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={group.active} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-3 flex justify-end items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleView(group)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(group)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(group.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
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
