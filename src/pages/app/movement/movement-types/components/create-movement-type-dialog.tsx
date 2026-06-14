import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';

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

import {
  type CreateMovementTypeFormData,
  CreateMovementTypeSchema,
} from '../lib/create-validation';

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

  async function handleCreateMovementType(data: CreateMovementTypeFormData) {
    await createMovementTypeFn(data);
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
        <form onSubmit={handleSubmit(handleCreateMovementType)}>
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              Novo Tipo de Movimentação
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Preencha os dados do novo tipo de movimentação
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome do Tipo</Label>
              <Input
                id="name"
                placeholder="Ex: Entrada por compra"
                className="h-11"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* Direção */}
            <div className="space-y-2">
              <Label htmlFor="direction">Direção</Label>
              <Controller
                name="direction"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11 w-full">
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

          <DialogFooter className="px-6 py-4 gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
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
