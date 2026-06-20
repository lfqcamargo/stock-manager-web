import { zodResolver } from '@hookform/resolvers/zod';
import { FolderPlus } from 'lucide-react';
import { useController, useForm } from 'react-hook-form';

import type { Group } from '@/api/stock/fetch-groups';
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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useGroup } from '@/hooks/use-group';

import {
  type EditGroupFormData,
  EditGroupSchema,
} from '../lib/edit-validation';

interface EditGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  group: Group;
}

export function EditGroupDialog({
  open,
  onOpenChange,
  group,
}: EditGroupDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditGroupFormData>({
    resolver: zodResolver(EditGroupSchema),
    defaultValues: {
      code: group.code,
      name: group.name,
      description: group.description ?? undefined,
      active: group.active,
    },
  });

  const {
    field: { value: active, onChange: setActive },
  } = useController({
    name: 'active',
    control,
  });

  const { useEditGroup } = useGroup();
  const { mutateAsync: editGroupFn } = useEditGroup();

  async function handleEditGroup(data: EditGroupFormData) {
    await editGroupFn({
      id: group.id,
      code: data.code,
      name: data.name,
      description: data.description,
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
      <DialogContent className="sm:max-w-[500px] p-0">
        <form onSubmit={handleSubmit(handleEditGroup)}>
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-primary" />
              Editar Grupo de Material
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Atualize os dados do grupo
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 space-y-6">
            {/* Código */}
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                maxLength={10}
                placeholder="Ex: FIX"
                className="h-11"
                {...register('code')}
              />
              {errors.code && (
                <p className="text-sm text-destructive">
                  {errors.code.message}
                </p>
              )}
            </div>

            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Grupo</Label>
              <Input
                id="name"
                placeholder="Ex: Fixação"
                className="h-11"
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
                placeholder="Descrição do grupo de materiais..."
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
                <Label htmlFor="active">Status do Grupo</Label>
                <p className="text-sm text-muted-foreground">
                  {active
                    ? 'Grupo está ativo e pode ser utilizado'
                    : 'Grupo está inativo e não pode ser utilizado'}
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

          <DialogFooter className="px-6 py-4 bg-muted/30 mt-6">
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                className="flex-1 sm:flex-none"
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                className="flex-1 sm:flex-none"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Salvando...
                  </div>
                ) : (
                  'Salvar Grupo'
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
