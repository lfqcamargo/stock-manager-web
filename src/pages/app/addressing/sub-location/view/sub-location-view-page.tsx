import { ArrowLeft, MapPin } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from '@/hooks/use-location';
import { useSubLocation } from '@/hooks/use-sub-location';

export function SubLocationViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useGetSubLocationById } = useSubLocation();
  const { data: subLocation, isLoading } = useGetSubLocationById(id ?? '');
  const { useGetLocations } = useLocation();
  const { data: locationsData } = useGetLocations(0, 100);

  const locationLabel = (() => {
    if (!subLocation) return '';
    const found = locationsData?.locations?.find(
      (l) => l.id === subLocation.locationId,
    );
    if (found) return `${found.code} — ${found.name}`;
    return subLocation.locationId;
  })();

  return (
    <div className="flex-1 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8">
        <div className="flex items-start gap-3 md:gap-4">
          <Button
            variant="outline"
            size="icon"
            className="h-9 w-9 md:h-10 md:w-10 rounded-lg md:rounded-xl shadow-sm hover:shadow transition-all duration-200"
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="space-y-0.5 md:space-y-1">
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight flex items-center gap-2">
              <MapPin className="h-6 w-6" />
              Visualizar Sub-Localização
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Detalhes completos da sub-localização
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8 space-y-5">
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-11 w-full" />
        </div>
      ) : subLocation ? (
        <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8">
          <Card className="border-0 shadow-none">
            <CardContent className="space-y-5 pt-6">
              {/* Código */}
              <div className="space-y-2">
                <Label htmlFor="code">Código</Label>
                <Input id="code" value={subLocation.code} disabled />
              </div>

              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome</Label>
                <Input id="name" value={subLocation.name} disabled />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  rows={3}
                  value={subLocation.description ?? ''}
                  disabled
                />
              </div>

              {/* Localização */}
              <div className="space-y-2">
                <Label htmlFor="locationId">Localização</Label>
                <Input id="locationId" value={locationLabel} disabled />
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
