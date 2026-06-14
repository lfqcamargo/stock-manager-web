import { zodResolver } from '@hookform/resolvers/zod';
import { FolderPlus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import type { Location } from '@/api/stock/fetch-locations';
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
import { useLocation } from '@/hooks/use-location';

import {
  type EditLocationFormData,
  EditLocationSchema,
} from '../lib/edit-validation';

interface EditLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: Location;
}

export function EditLocationDialog({
  open,
  onOpenChange,
  location,
}: EditLocationDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditLocationFormData>({
    resolver: zodResolver(EditLocationSchema),
    defaultValues: {
      name: location.name,
      description: location.description ?? undefined,
    },
  });

  const { useEditLocation } = useLocation();
  const { mutateAsync: editLocationFn } = useEditLocation();

  async function handleEditLocation(data: EditLocationFormData) {
    await editLocationFn({
      id: location.id,
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
        <form onSubmit={handleSubmit(handleEditLocation)}>
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-primary" />
              Novo Localização de Material
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Preencha os dados do novo localização para organizá-los no sistema
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
              <Label htmlFor="name">Nome do Localização</Label>
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
                placeholder="Descrição do localização de materiais..."
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
              <Label htmlFor="active">Localização ativo</Label>
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
                  'Salvar Localização'
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
