import { ArrowLeft, Package } from 'lucide-react';
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useGroup } from '@/hooks/use-group';
import { useMaterial } from '@/hooks/use-material';
import { getInitials } from '@/utils/get-initials';
import { unitMeasure } from '@/utils/unit-measure';

export function MaterialViewPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { useGetMaterialById } = useMaterial();
  const { data: material, isLoading } = useGetMaterialById(id || '');
  const { useGetGroups } = useGroup();
  const { data: groupsData } = useGetGroups(0, 100);

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
              Visualizar Material
            </h1>
            <p className="text-xs md:text-sm text-muted-foreground">
              Detalhes completos do material
            </p>
          </div>
        </div>
      </div>

      {isLoading ? (
        <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8 space-y-5">
          <Skeleton className="h-40 w-40 rounded-lg mx-auto" />
          <Skeleton className="h-11 w-full" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Skeleton className="h-11 w-full" />
            <Skeleton className="h-11 w-full" />
          </div>
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-24 w-full" />
          <Skeleton className="h-11 w-full" />
          <Skeleton className="h-16 w-full" />
        </div>
      ) : material ? (
        <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm p-4 md:p-6 lg:p-8">
          <Card className="border-0 shadow-none">
            <CardContent className="space-y-5 pt-6">
              {/* Preview da Foto */}
              <div className="flex justify-center mb-2">
                <div className="h-40 w-40 rounded-lg overflow-hidden relative">
                  {material.photoUrl ? (
                    <img
                      src={material.photoUrl}
                      alt={material.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  {!material.photoUrl ? (
                    <div className="h-full w-full bg-primary/10 flex items-center justify-center text-4xl bg-primary text-primary-foreground">
                      {getInitials(material.name)}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Grupo */}
              <div className="space-y-2">
                <Label htmlFor="groupId">Grupo</Label>
                <Select value={material.groupId} disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione um grupo" />
                  </SelectTrigger>
                  <SelectContent>
                    {groupsData?.groups?.map((group) => (
                      <SelectItem key={group.id} value={group.id}>
                        {group.code} - {group.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Código e Unidade na mesma linha */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Código */}
                <div className="space-y-2">
                  <Label htmlFor="code">Código</Label>
                  <Input
                    id="code"
                    placeholder="Ex: PAR001"
                    value={material.code}
                    disabled
                  />
                </div>

                {/* Unidade */}
                <div className="space-y-2 col-span-1">
                  <Label htmlFor="unit">Unidade</Label>
                  <Select value={material.unit} disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="Unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(unitMeasure).map(([value, label]) => (
                        <SelectItem key={value} value={value}>
                          {value} - {label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Nome */}
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Material</Label>
                <Input
                  id="name"
                  placeholder="Ex: Parafuso M6x20"
                  value={material.name}
                  disabled
                />
              </div>

              {/* Descrição */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  placeholder="Descrição detalhada do material..."
                  rows={3}
                  value={material.description ?? ''}
                  disabled
                />
              </div>

              {/* URL da Foto */}
              <div className="space-y-2">
                <Label htmlFor="photoUrl">URL da Foto</Label>
                <Input
                  id="photoUrl"
                  type="url"
                  value={material.photoUrl ?? ''}
                  disabled
                />
              </div>

              {/* Status */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div className="space-y-0.5">
                  <Label>Status do Material</Label>
                  <p className="text-sm text-muted-foreground">
                    {material.active
                      ? 'Material está ativo e pode ser utilizado'
                      : 'Material está inativo e não pode ser utilizado'}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`text-sm font-medium ${material.active ? 'text-green-600' : 'text-destructive'}`}
                  >
                    {material.active ? 'Ativo' : 'Inativo'}
                  </span>
                  <Switch checked={material.active} disabled />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
