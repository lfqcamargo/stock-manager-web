import { ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from '@/hooks/use-location';

export function LocationViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useGetLocationById } = useLocation();
  const { data: location, isLoading } = useGetLocationById(id ?? '');

  return (
    <div className="flex-1 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8">
        <div className="flex items-start gap-3 md:gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 md:h-10 md:w-10 rounded-lg md:rounded-xl shadow-sm hover:shadow transition-all duration-200"
            onClick={() => void navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-0.5 md:space-y-1">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              Visualizar Localização
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Detalhes completos da localização
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8 space-y-5">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-24 w-full" />
        </div>
      ) : location ? (
        <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8">
          <Card className="border-0 shadow-none">
            <CardContent className="space-y-5 pt-6">
              {/* Código */}
              <div className="space-y-2">
                <Label htmlFor="code">Código</Label>
                <Input id="code" value={location.code} disabled />
              </div>

              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={location.name} disabled />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={location.description ?? ''}
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
