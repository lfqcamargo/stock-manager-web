import { useQuery } from '@tanstack/react-query';
import { CalendarDays, Eye, MapPin, Package } from 'lucide-react';
import { useMemo, useState } from 'react';

import { fetchAddressings } from '@/api/stock/fetch-addressings';
import { fetchMovementTypes } from '@/api/stock/fetch-movement-types';
import type { FetchMovementsResponse, Movement } from '@/api/stock/fetch-movements';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/format-date';

import { MovementDetailsDialog } from './movement-details-dialog';

interface MovementsCardsProps {
  isLoading?: boolean;
  movements: Movement[];
  meta?: FetchMovementsResponse['meta'];
  onPaginate: (newPage: number) => void;
}

export function MovementsCards({
  isLoading,
  movements,
  meta,
  onPaginate,
}: MovementsCardsProps) {
  const [selectedMovement, setSelectedMovement] = useState<Movement | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);

  const { data: typesData } = useQuery({
    queryKey: ['movementTypes', 0, 100, undefined],
    queryFn: () => fetchMovementTypes({ page: 0, limit: 100 }),
  });

  const { data: addressingsData } = useQuery({
    queryKey: ['addressings', 0, 100, { active: true }],
    queryFn: () => fetchAddressings({ page: 0, limit: 100, active: true }),
  });

  const typesMap = useMemo(() => {
    const map = new Map<string, { name: string; direction: 'IN' | 'OUT' }>();
    typesData?.movementTypes.forEach((t) => map.set(t.id, t));
    return map;
  }, [typesData]);

  const addressingsMap = useMemo(() => {
    const map = new Map<string, string>();
    addressingsData?.addressings.forEach((a) => {
      const label = [
        a.location?.name,
        a.subLocation?.name,
        a.row?.name,
        a.shelf?.name,
        a.position?.name,
      ]
        .filter(Boolean)
        .join(' / ');
      map.set(a.id, label || a.id);
    });
    return map;
  }, [addressingsData]);

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
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-3 justify-end">
                <Skeleton className="h-8 w-28 rounded" />
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
        {movements.map((movement) => {
          const movType = typesMap.get(movement.movementTypeId);
          const addressingLabel =
            addressingsMap.get(movement.addressingId) ?? movement.addressingId;

          return (
            <Card key={movement.id} className="overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <Package className="h-6 w-6 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {movType?.name ?? 'Movimentação'}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Qtd: {movement.quantity}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="truncate">{addressingLabel}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    <span>{formatDate(movement.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        movType?.direction === 'IN' ? 'default' : 'destructive'
                      }
                    >
                      {movType?.direction === 'IN' ? 'Entrada' : 'Saída'}
                    </Badge>
                  </div>
                  {movement.observation && (
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      {movement.observation}
                    </p>
                  )}
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-3 flex justify-end items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedMovement(movement);
                    setIsDetailsDialogOpen(true);
                  }}
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver detalhes
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

      {selectedMovement && (
        <MovementDetailsDialog
          open={isDetailsDialogOpen}
          onOpenChange={(open) => {
            setIsDetailsDialogOpen(open);
            if (!open) setSelectedMovement(null);
          }}
          movement={selectedMovement}
          addressingLabel={addressingsMap.get(selectedMovement.addressingId)}
          movementType={typesMap.get(selectedMovement.movementTypeId)}
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
