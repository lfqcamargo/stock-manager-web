import { ArrowLeft, FolderPlus } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useGroup } from '@/hooks/use-group';
import { getInitials } from '@/utils/get-initials';

export function GroupViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useGetGroupById } = useGroup();
  const { data: group, isLoading } = useGetGroupById(id || '');

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
            <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
              Visualizar Grupo
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Detalhes completos do grupo
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8 space-y-5">
          <Skeleton className="h-40 w-40 rounded-lg mx-auto" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : group ? (
        <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8">
          <Card className="border-0 shadow-none">
            <CardContent className="space-y-5 pt-6">
              {/* Preview da Foto */}
              <div className="flex justify-center mb-2">
                <div className="h-40 w-40 rounded-lg overflow-hidden relative">
                  {group.photoUrl ? (
                    <img
                      src={group.photoUrl}
                      alt={group.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  {!group.photoUrl ? (
                    <div className="h-full w-full bg-primary/10 flex items-center justify-center text-4xl bg-primary text-primary-foreground">
                      {getInitials(group.name)}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Código */}
              <div className="space-y-2">
                <Label htmlFor="code">Código</Label>
                <Input id="code" value={group.code} disabled className="h-11" />
              </div>

              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Grupo</Label>
                <Input id="name" value={group.name} disabled className="h-11" />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={group.description ?? ''}
                  disabled
                  rows={3}
                />
              </div>

              {/* URL da Foto */}
              <div className="space-y-2">
                <Label htmlFor="photoUrl">URL da Foto</Label>
                <Input
                  id="photoUrl"
                  type="url"
                  value={group.photoUrl ?? ''}
                  disabled
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="space-y-0.5">
                  <Label>Status do Grupo</Label>
                  <p className="text-sm text-muted-foreground">
                    {group.active
                      ? 'Grupo está ativo e pode ser utilizado'
                      : 'Grupo está inativo e não pode ser utilizado'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-medium ${group.active ? 'text-green-600' : 'text-destructive'}`}
                  >
                    {group.active ? 'Ativo' : 'Inativo'}
                  </span>
                  <Switch checked={group.active} disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
