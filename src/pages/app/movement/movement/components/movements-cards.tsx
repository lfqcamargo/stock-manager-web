import { CalendarDays, Eye, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import type {
  FetchMovementsResponse,
  Movement,
} from '@/api/stock/fetch-movements';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { formatDate } from '@/utils/format-date';
import { getInitials } from '@/utils/get-initials';

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
  const navigate = useNavigate();

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
          const addrLabel = [
            movement.locationName,
            movement.subLocationName,
            movement.rowName,
            movement.shelfName,
            movement.positionName,
          ]
            .filter(Boolean)
            .join(' / ');

          return (
            <Card key={movement.id} className="overflow-hidden group">
              <CardContent className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 border bg-muted">
                    {movement.materialPhotoUrl ? (
                      <img
                        src={movement.materialPhotoUrl}
                        alt={movement.materialName}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="h-full w-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                        {getInitials(movement.materialName)}
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold truncate">
                      {movement.movementTypeName}
                    </h3>
                    <p className="text-sm text-muted-foreground truncate">
                      {movement.materialName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Qtd: {movement.quantity}
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                    <span className="truncate">
                      {addrLabel || movement.addressingId}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    <span>{formatDate(movement.date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge
                      variant={
                        movement.movementTypeDirection === 'IN'
                          ? 'default'
                          : 'destructive'
                      }
                    >
                      {movement.movementTypeDirection === 'IN'
                        ? 'Entrada'
                        : 'Saída'}
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
                  onClick={() =>
                    void navigate(`/movement/movement/${movement.id}`)
                  }
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver detalhes
                </Button>
              </CardFooter>
            </Card>
          );
        })}
      </div>

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
