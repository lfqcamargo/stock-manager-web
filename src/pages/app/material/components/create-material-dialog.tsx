import { zodResolver } from '@hookform/resolvers/zod';
import { Package } from 'lucide-react';
import { Controller, useController, useForm, useWatch } from 'react-hook-form';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useGroup } from '@/hooks/use-group';
import { useMaterial } from '@/hooks/use-material';
import { getInitials } from '@/utils/get-initials';
import { unitMeasure } from '@/utils/unit-measure';

import {
  type CreateMaterialFormData,
  CreateMaterialSchema,
} from '../lib/create-validation';

interface CreateMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMaterialDialog({
  open,
  onOpenChange,
}: CreateMaterialDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<CreateMaterialFormData>({
    resolver: zodResolver(CreateMaterialSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      groupId: '',
      unit: 'UN',
      active: true,
      photoUrl: null,
    },
    mode: 'onChange',
  });

  const watchName = useWatch({ control, name: 'name' });

  const {
    field: { value: active, onChange: setActive },
  } = useController({
    name: 'active',
    control,
  });

  const { useGetGroups } = useGroup();
  const { data: groupsData } = useGetGroups(0, 100);

  const { useCreateMaterial } = useMaterial();
  const { mutate: createMaterialFn, isPending } = useCreateMaterial();

  const handleCreateMaterial = handleSubmit((data) => {
    createMaterialFn(
      {
        groupId: data.groupId,
        code: data.code,
        name: data.name,
        description: data.description,
        unit: data.unit,
        active: data.active,
        photoUrl: data.photoUrl,
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  });

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <Package className="h-5 w-5 text-primary" />
            Novo Material
          </DialogTitle>
          <DialogDescription>
            Cadastre um novo material no sistema de estoque
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            void handleCreateMaterial(e);
          }}
          className="space-y-5"
        >
          {/* Avatar Preview */}
          <Controller
            name="photoUrl"
            control={control}
            render={({ field }) => (
              <div className="flex justify-center mb-2">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={field.value ?? ''} alt="Preview" />
                  <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                    {getInitials(watchName || 'M')}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          />

          {/* Grupo */}
          <div className="space-y-2">
            <Label htmlFor="groupId">Grupo</Label>
            <Controller
              name="groupId"
              control={control}
              render={({ field }) => (
                <Select onValueChange={field.onChange} value={field.value}>
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
              )}
            />
            {errors.groupId && (
              <p className="text-sm text-destructive">
                {errors.groupId.message}
              </p>
            )}
          </div>

          {/* Código e Unidade na mesma linha */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Código */}
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input id="code" placeholder="Ex: PAR001" {...register('code')} />
              {errors.code && (
                <p className="text-sm text-destructive">
                  {errors.code.message}
                </p>
              )}
            </div>

            {/* Unidade */}
            <div className="space-y-2 col-span-1">
              <Label htmlFor="unit">Unidade</Label>
              <Controller
                name="unit"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
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
                )}
              />
              {errors.unit && (
                <p className="text-sm text-destructive">
                  {errors.unit.message}
                </p>
              )}
            </div>
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Material</Label>
            <Input
              id="name"
              placeholder="Ex: Parafuso M6x20"
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição detalhada do material..."
              rows={3}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* URL da Foto */}
          <div className="space-y-2">
            <Label htmlFor="photoUrl">URL da Foto (opcional)</Label>
            <Controller
              name="photoUrl"
              control={control}
              render={({ field }) => (
                <Input
                  id="photoUrl"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  disabled={isPending}
                  aria-invalid={!!errors.photoUrl}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? null : value);
                  }}
                />
              )}
            />
            {errors.photoUrl && (
              <p className="text-destructive text-sm">
                {errors.photoUrl.message}
              </p>
            )}
          </div>

          {/* Ativo */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="active">Status do Material</Label>
              <p className="text-sm text-muted-foreground">
                {active
                  ? 'Material está ativo e pode ser utilizado'
                  : 'Material está inativo e não pode ser utilizado'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-medium ${active ? 'text-green-600' : 'text-destructive'}`}
              >
                {active ? 'Ativo' : 'Inativo'}
              </span>
              <Switch
                id="active"
                checked={active}
                onCheckedChange={setActive}
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Salvando...' : 'Salvar Material'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
