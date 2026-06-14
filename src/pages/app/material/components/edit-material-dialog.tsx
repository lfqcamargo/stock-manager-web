import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

import type { MaterialDetails } from '@/api/stock/fetch-materials';
import { GroupSearchDialog } from '@/components/group-search-dialog';
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
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
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
    getValues,
    formState: { errors, isSubmitting },
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

  const { useGetGroups } = useGroup();
  const { data: groupsData } = useGetGroups(0, 9999);

  const { useEditMaterial } = useMaterial();
  const { mutateAsync: editMaterialFn } = useEditMaterial();

  const [groupDialogOpen, setGroupDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<{
    id: string;
    name: string;
  } | null>(null);

  // Atualiza selectedGroup quando groupsData ou material.groupId mudarem
  useEffect(() => {
    if (material.groupId && groupsData?.groups) {
      const g = groupsData.groups.find((g) => g.id === material.groupId);
      setSelectedGroup(g ? { id: g.id, name: g.name } : null);
    }
  }, [groupsData, material.groupId]);

  async function handleEditMaterial(data: EditMaterialFormData) {
    await editMaterialFn({
      id: material.id,
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

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Novo Material</DialogTitle>
          <DialogDescription>
            Cadastre um novo material no sistema de estoque
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(handleEditMaterial)}>
          <div className="grid gap-4 py-4">
            {/* Grupo - linha separada no início do formulário */}
            <div className="flex flex-col sm:flex-row gap-2 items-end w-full">
              <div className="flex-1">
                <Label htmlFor="groupId">Grupo</Label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Controller
                        name="groupId"
                        control={control}
                        render={() => (
                          <Input
                            placeholder="Selecione um grupo"
                            value={selectedGroup ? selectedGroup.name : ''}
                            readOnly
                            onClick={() => setGroupDialogOpen(true)}
                            className="cursor-pointer bg-white w-full truncate"
                          />
                        )}
                      />
                    </TooltipTrigger>
                    {selectedGroup && (
                      <TooltipContent>{selectedGroup.name}</TooltipContent>
                    )}
                  </Tooltip>
                </TooltipProvider>
                {errors.groupId && (
                  <p className="text-sm text-destructive">
                    {errors.groupId.message}
                  </p>
                )}
              </div>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setGroupDialogOpen(true)}
                className="h-11 mt-6 sm:mt-0 w-full sm:w-auto"
              >
                Buscar grupo
              </Button>
              <GroupSearchDialog
                open={groupDialogOpen}
                onOpenChange={setGroupDialogOpen}
                onSelect={(group) => {
                  setSelectedGroup(group);
                  reset({ ...getValues(), groupId: group.id });
                }}
                selectedGroup={
                  selectedGroup
                    ? (groupsData?.groups?.find(
                        (g) => g.id === selectedGroup.id,
                      ) ?? null)
                    : null
                }
              />
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

              {/* Grupo removido (seleção via diálogo acima) */}

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
            <div className="flex items-center space-x-3 pt-2">
              <Controller
                name="active"
                control={control}
                render={({ field }) => (
                  <Switch
                    id="active"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <Label htmlFor="active">Material ativo</Label>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleCancel()}
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
