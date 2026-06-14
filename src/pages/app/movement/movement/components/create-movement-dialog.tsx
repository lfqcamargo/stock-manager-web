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
import { Textarea } from '@/components/ui/textarea';
import { useMaterial } from '@/hooks/use-material';
import { useMovement } from '@/hooks/use-movement';
import { useMovementType } from '@/hooks/use-movement-type';

const CreateMovementSchema = z.object({
  materialId: z.string().min(1, 'Material é obrigatório'),
  addressingId: z.string().min(1, 'Endereçamento é obrigatório'),
  movementTypeId: z.string().min(1, 'Tipo de movimento é obrigatório'),
  quantity: z.coerce.number().min(1, 'Quantidade é obrigatória'),
  date: z.string().min(1, 'Data é obrigatória'),
  observation: z.string().optional(),
});

type CreateMovementFormData = z.infer<typeof CreateMovementSchema>;

interface CreateMovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMovementDialog({
  open,
  onOpenChange,
}: CreateMovementDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateMovementFormData>({
    resolver: zodResolver(CreateMovementSchema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const { useGetMaterials } = useMaterial();
  const { useGetMovementTypes } = useMovementType();
  const { useCreateMovement } = useMovement();

  const { data: materialsData } = useGetMaterials(0, 9999);
  const { data: typesData } = useGetMovementTypes(0, 9999);
  const { mutateAsync: createMovementFn } = useCreateMovement();

  async function onSubmit(data: CreateMovementFormData) {
    await createMovementFn(data);
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
          <DialogTitle>Nova Movimentação</DialogTitle>
          <DialogDescription>
            Crie uma nova movimentação de estoque
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="materialId">Material</Label>
                <Controller
                  name="materialId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o material" />
                      </SelectTrigger>
                      <SelectContent>
                        {materialsData?.materials?.map((material) => (
                          <SelectItem key={material.id} value={material.id}>
                            {material.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.materialId && (
                  <p className="text-sm text-destructive">
                    {errors.materialId.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="movementTypeId">Tipo de Movimento</Label>
                <Controller
                  name="movementTypeId"
                  control={control}
                  render={({ field }) => (
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {typesData?.movementTypes?.map((type) => (
                          <SelectItem key={type.id} value={type.id}>
                            {type.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.movementTypeId && (
                  <p className="text-sm text-destructive">
                    {errors.movementTypeId.message}
                  </p>
                )}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  type="number"
                  id="quantity"
                  placeholder="0"
                  {...register('quantity')}
                />
                {errors.quantity && (
                  <p className="text-sm text-destructive">
                    {errors.quantity.message}
                  </p>
                )}
              </div>
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  type="date"
                  id="date"
                  {...register('date')}
                />
                {errors.date && (
                  <p className="text-sm text-destructive">
                    {errors.date.message}
                  </p>
                )}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="addressingId">Endereçamento</Label>
              <Input
                id="addressingId"
                placeholder="Selecione o endereçamento"
                {...register('addressingId')}
              />
              {errors.addressingId && (
                <p className="text-sm text-destructive">
                  {errors.addressingId.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="observation">Observação</Label>
              <Textarea
                id="observation"
                placeholder="Observação da movimentação..."
                rows={3}
                {...register('observation')}
              />
              {errors.observation && (
                <p className="text-sm text-destructive">
                  {errors.observation.message}
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
              {isSubmitting ? 'Salvando...' : 'Salvar Movimentação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
