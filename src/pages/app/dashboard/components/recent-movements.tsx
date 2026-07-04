import { formatDistanceToNow, parseISO } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { ArrowDown, ArrowUp } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { RecentMovement } from '@/api/stock/fetch-dashboard';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Skeleton } from '@/components/ui/skeleton';

interface RecentMovementsProps {
  movements?: RecentMovement[];
  isLoading: boolean;
}

export function RecentMovements({
  movements,
  isLoading,
}: RecentMovementsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-40" />
          <Skeleton className="h-4 w-32 mt-1" />
        </CardHeader>
        <CardContent className="space-y-0">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i}>
              <div className="flex items-center gap-3 py-3">
                <Skeleton className="h-8 w-8 rounded-full" />
                <div className="flex-1 space-y-1.5">
                  <Skeleton className="h-3.5 w-32" />
                  <Skeleton className="h-3 w-24" />
                </div>
                <Skeleton className="h-3 w-16" />
              </div>
              {i < 5 && <Separator />}
            </div>
          ))}
        </CardContent>
      </Card>
    );
  }

  const hasMovements = movements && movements.length > 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Últimas movimentações</CardTitle>
        <CardDescription>
          Movimentos registrados mais recentemente
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-0 p-0">
        {!hasMovements ? (
          <div className="flex items-center justify-center py-10 text-sm text-muted-foreground px-6">
            Nenhuma movimentação registrada ainda.
          </div>
        ) : (
          movements.map((m, index) => (
            <div key={m.id}>
              <div className="flex items-center gap-3 py-3 px-6">
                <div
                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
                    m.direction === 'IN'
                      ? 'bg-emerald-100 dark:bg-emerald-950/60'
                      : 'bg-rose-100 dark:bg-rose-950/60'
                  }`}
                >
                  {m.direction === 'IN' ? (
                    <ArrowUp className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                  ) : (
                    <ArrowDown className="h-3.5 w-3.5 text-rose-600 dark:text-rose-400" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium leading-none truncate">
                      {m.materialName ?? 'Endereço sem material'}
                    </p>
                    <Badge
                      variant="secondary"
                      className={`text-[10px] px-1.5 py-0 shrink-0 ${
                        m.direction === 'IN'
                          ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-950 dark:text-emerald-400'
                          : 'text-rose-600 bg-rose-50 dark:bg-rose-950 dark:text-rose-400'
                      }`}
                    >
                      {m.direction === 'IN' ? '+' : '-'}
                      {m.quantity.toLocaleString('pt-BR', {
                        maximumFractionDigits: 2,
                      })}
                    </Badge>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 truncate">
                    {m.movementTypeName}
                    {m.addressingLocation ? ` · ${m.addressingLocation}` : ''}
                  </p>
                </div>

                <Link
                  to={`/movement/movement/${m.id}`}
                  className="text-xs text-muted-foreground shrink-0 hover:text-foreground transition-colors"
                >
                  {formatDistanceToNow(parseISO(m.date), {
                    addSuffix: true,
                    locale: ptBR,
                  })}
                </Link>
              </div>
              {index < movements.length - 1 && <Separator />}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
