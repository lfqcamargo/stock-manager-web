import { AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';

import type { LowStockItem } from '@/api/stock/fetch-dashboard';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

interface LowStockTableProps {
  items?: LowStockItem[];
  isLoading: boolean;
}

function getStockBadge(amount: number) {
  if (amount === 0)
    return (
      <Badge className="bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-0">
        Zerado
      </Badge>
    );
  if (amount < 5)
    return (
      <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 border-0">
        Crítico
      </Badge>
    );
  return (
    <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-950 dark:text-yellow-300 border-0">
      Baixo
    </Badge>
  );
}

export function LowStockTable({ items, isLoading }: LowStockTableProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
          <Skeleton className="h-4 w-36 mt-1" />
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-10 w-full" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const hasItems = items && items.length > 0;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-amber-500" />
          <CardTitle className="text-base">Estoque baixo</CardTitle>
        </div>
        <CardDescription>
          Materiais com menor quantidade total em endereços ativos
        </CardDescription>
      </CardHeader>
      <CardContent>
        {!hasItems ? (
          <div className="flex flex-col items-center justify-center py-8 text-center text-muted-foreground gap-2">
            <AlertTriangle className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-sm">Nenhum material endereçado encontrado</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Material</TableHead>
                <TableHead className="text-right">Qtd. total</TableHead>
                <TableHead className="text-right">Endereços</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.materialId}>
                  <TableCell className="font-mono text-xs text-muted-foreground">
                    {item.materialCode}
                  </TableCell>
                  <TableCell>
                    <Link
                      to={`/material/material/${item.materialId}`}
                      className="font-medium hover:underline underline-offset-4 text-sm"
                    >
                      {item.materialName}
                    </Link>
                  </TableCell>
                  <TableCell className="text-right tabular-nums font-semibold">
                    {item.totalAmount.toLocaleString('pt-BR', {
                      maximumFractionDigits: 2,
                    })}
                  </TableCell>
                  <TableCell className="text-right tabular-nums text-muted-foreground">
                    {item.addressingCount}
                  </TableCell>
                  <TableCell>{getStockBadge(item.totalAmount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
