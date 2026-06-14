import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import type { MovementType } from '@/api/stock/fetch-movement-types';
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
import { useMovementType } from '@/hooks/use-movement-type';

const EditMovementTypeSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  direction: z.enum(['IN', 'OUT']),
});

type EditMovementTypeFormData = z.infer<typeof EditMovementTypeSchema>;

interface EditMovementTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movementType: MovementType;
}

export function EditMovementTypeDialog({
  open,
  onOpenChange,
  movementType,
}: EditMovementTypeDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditMovementTypeFormData>({
    resolver: zodResolver(EditMovementTypeSchema),
    defaultValues: {
      name: movementType.name,
      direction: movementType.direction,
    },
  });

  const { useEditMovementType } = useMovementType();
  const { mutateAsync: editMovementTypeFn } = useEditMovementType();

  async function onSubmit(data: EditMovementTypeFormData) {
    await editMovementTypeFn({ id: movementType.id, ...data });
    reset();
    onOpenChange(false);
  }

  useEffect(() => {
    if (!open) reset();
    else reset({ name: movementType.name, direction: movementType.direction });
  }, [open, reset, movementType]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Tipo de Movimento</DialogTitle>
          <DialogDescription>
            Edite os dados do tipo de movimento
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Ex: Compra, Venda, Devolução"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="direction">Direção</Label>
              <Controller
                name="direction"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a direção" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="IN">Entrada</SelectItem>
                      <SelectItem value="OUT">Saída</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.direction && (
                <p className="text-sm text-destructive">
                  {errors.direction.message}
                </p>
              )}
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
              {isSubmitting ? 'Salvando...' : 'Salvar Tipo'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
