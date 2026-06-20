import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useController, useForm } from 'react-hook-form';

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
    formState: { errors, isSubmitting },
  } = useForm<CreateMaterialFormData>({
    resolver: zodResolver(CreateMaterialSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      groupId: '',
      unit: 'UN',
      active: true,
    },
  });

  const {
    field: { value: active, onChange: setActive },
  } = useController({
    name: 'active',
    control,
  });

  const { useGetGroups } = useGroup();
  const { data: groupsData } = useGetGroups(0, 100);

  const { useCreateMaterial } = useMaterial();
  const { mutateAsync: createMaterialFn } = useCreateMaterial();

  async function onSubmit(data: CreateMaterialFormData) {
    await createMaterialFn({
      groupId: data.groupId,
      code: data.code,
      name: data.name,
      description: data.description,
      unit: data.unit,
      active: data.active,
    });
    reset();
    onOpenChange(false);
  }

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Material</DialogTitle>
          <DialogDescription>
            Cadastre um novo material no sistema de estoque
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
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
                <Input
                  id="code"
                  placeholder="Ex: PAR001"
                  {...register('code')}
                />
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
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
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
                  disabled={isSubmitting}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar Material'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
