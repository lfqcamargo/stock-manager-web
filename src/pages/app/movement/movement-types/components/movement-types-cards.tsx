import { ArrowDownCircle, ArrowUpCircle, Edit, Trash2 } from 'lucide-react';
import { useState } from 'react';

import type { MovementType } from '@/api/stock/fetch-movement-types';
import type { FetchMovementTypesResponse } from '@/api/stock/fetch-movement-types';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { EditMovementTypeDialog } from './edit-movement-type-dialog';

interface MovementTypesCardsProps {
  onDelete: (id: string) => void;
  isLoading?: boolean;
  movementTypes: MovementType[];
  meta?: FetchMovementTypesResponse['meta'];
  onPaginate: (newPage: number) => void;
}

export function MovementTypesCards({
  onDelete,
  isLoading,
  movementTypes,
  meta,
  onPaginate,
}: MovementTypesCardsProps) {
  const [selectedType, setSelectedType] = useState<MovementType | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  function handleEdit(type: MovementType) {
    setSelectedType(type);
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
                    <Skeleton className="h-3 w-20" />
                  </div>
                </div>
                <Skeleton className="h-6 w-20 rounded-full" />
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-3 justify-end">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20 rounded" />
                  <Skeleton className="h-8 w-20 rounded" />
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
        {movementTypes.map((type) => (
          <Card key={type.id} className="overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  {type.direction === 'IN' ? (
                    <ArrowUpCircle className="h-6 w-6 text-green-600" />
                  ) : (
                    <ArrowDownCircle className="h-6 w-6 text-red-600" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{type.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    Tipo de movimentação
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Badge
                    variant={type.direction === 'IN' ? 'default' : 'destructive'}
                  >
                    {type.direction === 'IN' ? 'Entrada' : 'Saída'}
                  </Badge>
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-3 flex justify-end items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(type)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(type.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedType && (
        <EditMovementTypeDialog
          key={selectedType.id}
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedType(null);
          }}
          movementType={selectedType}
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
