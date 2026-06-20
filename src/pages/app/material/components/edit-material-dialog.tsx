import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useController, useForm } from 'react-hook-form';

import type { MaterialDetails } from '@/api/stock/fetch-materials';
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
  type EditMaterialFormData,
  EditMaterialSchema,
} from '../lib/edit-validation';

interface EditMaterialDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  material: MaterialDetails;
}

export function EditMaterialDialog({
  open,
  onOpenChange,
  material,
}: EditMaterialDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
  } = useForm<EditMaterialFormData>({
    resolver: zodResolver(EditMaterialSchema),
    defaultValues: {
      code: material.code,
      name: material.name,
      description: material.description ?? undefined,
      groupId: material.groupId,
      unit: material.unit,
      active: material.active,
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

  const { useEditMaterial } = useMaterial();
  const { mutate: editMaterialFn, isPending } = useEditMaterial();

  function handleEditMaterial(data: EditMaterialFormData) {
    editMaterialFn(
      {
        id: material.id,
        groupId: data.groupId,
        code: data.code,
        name: data.name,
        description: data.description,
        unit: data.unit,
        active: data.active,
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  }

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Editar Material</DialogTitle>
          <DialogDescription>Atualize os dados do material</DialogDescription>
        </DialogHeader>

        <form onSubmit={void handleSubmit(handleEditMaterial)}>
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
                  disabled={isPending}
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleCancel()}
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
