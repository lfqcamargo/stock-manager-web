import { zodResolver } from '@hookform/resolvers/zod';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

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

const CreateMovementTypeSchema = z.object({
  name: z.string().min(1, 'Nome é obrigatório'),
  direction: z.enum(['IN', 'OUT']),
});

type CreateMovementTypeFormData = z.infer<typeof CreateMovementTypeSchema>;

interface CreateMovementTypeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMovementTypeDialog({
  open,
  onOpenChange,
}: CreateMovementTypeDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateMovementTypeFormData>({
    resolver: zodResolver(CreateMovementTypeSchema),
    defaultValues: {
      name: '',
      direction: 'IN',
    },
  });

  const { useCreateMovementType } = useMovementType();
  const { mutateAsync: createMovementTypeFn } = useCreateMovementType();

  async function onSubmit(data: CreateMovementTypeFormData) {
    await createMovementTypeFn(data);
    reset();
    onOpenChange(false);
  }

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Novo Tipo de Movimento</DialogTitle>
          <DialogDescription>
            Cadastre um novo tipo de movimento no sistema
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={(e) => void handleSubmit(onSubmit)(e)}>
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
