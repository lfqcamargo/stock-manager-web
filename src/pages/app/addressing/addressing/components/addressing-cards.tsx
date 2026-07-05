import { Edit, Eye, MapPin, Package } from 'lucide-react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import type {
  Addressing,
  FetchAddressingsResponse,
} from '@/api/stock/fetch-addressings';
import { Pagination } from '@/components/pagination';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { getInitials } from '@/utils/get-initials';

import { EditAddressingDialog } from './edit-dialog';

interface AddressingCardsProps {
  onDelete: ((id: string) => void) | undefined;
  isLoading?: boolean;
  addressings: Addressing[];
  meta?: FetchAddressingsResponse['meta'];
  onPaginate: (newPage: number) => void;
}

export function AddressingCards({
  onDelete,
  isLoading,
  addressings,
  meta,
  onPaginate,
}: AddressingCardsProps) {
  const navigate = useNavigate();
  const [selected, setSelected] = useState<Addressing | null>(null);
  const [editOpen, setEditOpen] = useState(false);

  const materialsFromAddressings = Array.from(
    new Map(
      addressings
        .filter((a) => a.material)
        .map((a) => [a.material!.id, a.material!]),
    ).values(),
  );

  function handleView(addr: Addressing) {
    void navigate(`/addressing/addressing/${addr.id}`);
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
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>
              </CardContent>
              <CardFooter className="border-t bg-muted/20 px-6 py-3 justify-end">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-16 rounded" />
                  <Skeleton className="h-8 w-16 rounded" />
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
        {addressings.map((addr) => (
          <Card key={addr.id} className="overflow-hidden group">
            <CardContent className="p-6">
              {/* Cabeçalho: foto/avatar do material + endereço */}
              <div
                className="flex items-start gap-4 mb-4 cursor-pointer"
                onClick={() => handleView(addr)}
              >
                <div className="h-12 w-12 rounded-lg overflow-hidden shrink-0 border bg-muted">
                  {addr.material?.photoUrl ? (
                    <img
                      src={addr.material.photoUrl}
                      alt={addr.material.name}
                      className="h-full w-full object-cover"
                    />
                  ) : addr.material ? (
                    <div className="h-full w-full bg-primary/10 flex items-center justify-center text-sm font-bold text-primary">
                      {getInitials(addr.material.name)}
                    </div>
                  ) : (
                    <div className="h-full w-full bg-muted flex items-center justify-center">
                      <Package className="h-5 w-5 text-muted-foreground/40" />
                    </div>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold truncate">
                    {addr.location.code} — {addr.location.name}
                  </h3>
                  <p className="text-sm text-muted-foreground truncate">
                    {[
                      addr.subLocation.code,
                      addr.row.code,
                      addr.shelf.code,
                      addr.position.code,
                    ]
                      .filter(Boolean)
                      .join(' / ')}
                  </p>
                </div>
              </div>

              {/* Corpo */}
              <div className="space-y-2">
                {addr.material ? (
                  <div className="flex items-start gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4 shrink-0 mt-0.5" />
                    <div className="min-w-0">
                      <span className="font-medium text-foreground truncate block">
                        {addr.material.code} — {addr.material.name}
                      </span>
                      <span className="text-xs">{addr.material.unit}</span>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Package className="h-4 w-4" />
                    <span>Sem material vinculado</span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0" />
                  <span>
                    Saldo:{' '}
                    <Badge
                      variant={addr.amount > 0 ? 'default' : 'outline'}
                      className="ml-1"
                    >
                      {addr.amount}
                    </Badge>
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={addr.active ? 'default' : 'secondary'}>
                    {addr.active ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </div>
            </CardContent>

            <CardFooter className="border-t bg-muted/20 px-6 py-3 flex justify-end items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleView(addr)}
              >
                <Eye className="h-4 w-4 mr-2" />
                Ver
              </Button>
              {onDelete && (
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelected(addr);
                      setEditOpen(true);
                    }}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => onDelete(addr.id)}
                  >
                    Excluir
                  </Button>
                </>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>

      {selected && (
        <EditAddressingDialog
          open={editOpen}
          onOpenChange={(o) => {
            setEditOpen(o);
            if (!o) setSelected(null);
          }}
          addressing={selected}
          materials={materialsFromAddressings}
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
