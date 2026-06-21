import { Edit, Package, Trash2 } from 'lucide-react';
import { useState } from 'react';

import type { MaterialDetails } from '@/api/stock/fetch-materials';
import type { GetMaterialsResponse } from '@/api/stock/fetch-materials';
import { Pagination } from '@/components/pagination';
import { StatusBadge } from '@/components/status-badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

import { EditMaterialDialog } from './edit-material-dialog';

interface MaterialsCardsProps {
  onDelete: (id: string) => void;
  isLoading?: boolean;
  materials: MaterialDetails[];
  meta?: GetMaterialsResponse['meta'];
  onPaginate: (newPage: number) => void;
}

export function MaterialsCards({
  onDelete,
  isLoading,
  materials,
  meta,
  onPaginate,
}: MaterialsCardsProps) {
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialDetails | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);

  function handleEdit(material: MaterialDetails) {
    setSelectedMaterial(material);
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
                    <Skeleton className="h-3 w-24" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-32" />
                  </div>
                  <div className="flex items-center gap-2">
                    <Skeleton className="h-5 w-5" />
                    <Skeleton className="h-4 w-24" />
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
        {materials.map((material: MaterialDetails) => (
          <Card key={material.id} className="overflow-hidden group">
            <CardContent className="p-6">
              <div className="flex items-start gap-4 mb-4">
                <div className="h-12 w-12 rounded-lg overflow-hidden relative">
                  {material.photoUrl && (
                    <img
                      key={material.id}
                      src={material.photoUrl}
                      alt={material.name}
                      className="h-full w-full object-cover absolute top-0 left-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  )}
                  {!material.photoUrl && (
                    <div className="h-full w-full bg-primary/10 flex items-center justify-center">
                      <Package className="h-6 w-6 text-primary" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">{material.name}</h3>
                  <p className="text-sm text-muted-foreground">
                    {material.code}
                  </p>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Grupo:</span>
                  <span className="font-medium">{material.group}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>Unidade:</span>
                  <span className="font-medium">{material.unit}</span>
                </div>
                <div className="flex items-center gap-2">
                  <StatusBadge status={material.active} />
                </div>
              </div>
            </CardContent>
            <CardFooter className="border-t bg-muted/20 px-6 py-3 flex justify-end items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(material)}
              >
                <Edit className="h-4 w-4 mr-2" />
                Editar
              </Button>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => onDelete(material.id)}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Excluir
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      {selectedMaterial && (
        <EditMaterialDialog
          key={selectedMaterial.id}
          open={isEditDialogOpen}
          onOpenChange={(open) => {
            setIsEditDialogOpen(open);
            if (!open) setSelectedMaterial(null);
          }}
          material={selectedMaterial}
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
