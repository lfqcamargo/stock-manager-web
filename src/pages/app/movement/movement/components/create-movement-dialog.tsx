import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { AlertCircle } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { z } from 'zod';

import { fetchAddressings } from '@/api/stock/fetch-addressings';
import { Alert, AlertDescription } from '@/components/ui/alert';
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
import { useMovement } from '@/hooks/use-movement';
import { useMovementType } from '@/hooks/use-movement-type';

const schema = z.object({
  addressingId: z.string().min(1, 'Endereçamento é obrigatório'),
  movementTypeId: z.string().min(1, 'Tipo de movimento é obrigatório'),
  quantity: z.coerce
    .number()
    .int('Informe um número inteiro')
    .positive('Quantidade deve ser maior que zero'),
  date: z.string().min(1, 'Data é obrigatória'),
  observation: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateMovementDialog({ open, onOpenChange }: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      date: new Date().toISOString().split('T')[0],
    },
  });

  const { useGetMovementTypes } = useMovementType();
  const { useCreateMovement } = useMovement();

  const { data: typesData } = useGetMovementTypes(0, 100);
  const { data: addressingsData } = useQuery({
    queryKey: ['addressings', 0, 100, { active: true }],
    queryFn: () => fetchAddressings({ page: 0, limit: 100, active: true }),
  });

  const { mutateAsync: createMovementFn } = useCreateMovement();

  const selectedTypeId = useWatch({ control, name: 'movementTypeId' });
  const selectedType = typesData?.movementTypes.find(
    (t) => t.id === selectedTypeId,
  );

  async function onSubmit(data: FormData) {
    await createMovementFn({
      addressingId: data.addressingId,
      movementTypeId: data.movementTypeId,
      quantity: data.quantity,
      date: data.date,
      observation: data.observation || undefined,
    });
    reset();
    onOpenChange(false);
  }

  useEffect(() => {
    if (!open) reset();
  }, [open, reset]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] p-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold">
              Nova Movimentação
            </DialogTitle>
            <DialogDescription>
              Registre uma nova movimentação de estoque
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 space-y-4">
            {/* Endereçamento */}
            <div className="space-y-2">
              <Label htmlFor="addressingId">Endereçamento</Label>
              <Controller
                name="addressingId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione o endereçamento" />
                    </SelectTrigger>
                    <SelectContent>
                      {addressingsData?.addressings.map((a) => {
                        const label = [
                          a.location?.name,
                          a.subLocation?.name,
                          a.row?.name,
                          a.shelf?.name,
                          a.position?.name,
                        ]
                          .filter(Boolean)
                          .join(' / ');
                        return (
                          <SelectItem key={a.id} value={a.id}>
                            {label || a.id}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.addressingId && (
                <p className="text-sm text-destructive">
                  {errors.addressingId.message}
                </p>
              )}
            </div>

            {/* Tipo de Movimento */}
            <div className="space-y-2">
              <Label htmlFor="movementTypeId">Tipo de Movimento</Label>
              <Controller
                name="movementTypeId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione o tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {typesData?.movementTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          {type.name} ({type.direction === 'IN' ? 'Entrada' : 'Saída'})
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

            {/* Aviso OUT */}
            {selectedType?.direction === 'OUT' && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Tipo de saída selecionado. Verifique se o saldo do
                  endereçamento é suficiente antes de confirmar.
                </AlertDescription>
              </Alert>
            )}

            <div className="grid grid-cols-2 gap-4">
              {/* Quantidade */}
              <div className="space-y-2">
                <Label htmlFor="quantity">Quantidade</Label>
                <Input
                  id="quantity"
                  type="number"
                  min={1}
                  placeholder="0"
                  className="h-11"
                  {...register('quantity')}
                />
                {errors.quantity && (
                  <p className="text-sm text-destructive">
                    {errors.quantity.message}
                  </p>
                )}
              </div>

              {/* Data */}
              <div className="space-y-2">
                <Label htmlFor="date">Data</Label>
                <Input
                  id="date"
                  type="date"
                  className="h-11"
                  {...register('date')}
                />
                {errors.date && (
                  <p className="text-sm text-destructive">
                    {errors.date.message}
                  </p>
                )}
              </div>
            </div>

            {/* Observação */}
            <div className="space-y-2">
              <Label htmlFor="observation">Observação (opcional)</Label>
              <Textarea
                id="observation"
                placeholder="Observação da movimentação..."
                className="resize-none min-h-[80px]"
                {...register('observation')}
              />
            </div>
          </div>

          <DialogFooter className="px-6 py-4 bg-muted/30 mt-6">
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  reset();
                  onOpenChange(false);
                }}
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 sm:flex-none"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Salvando...
                  </span>
                ) : (
                  'Salvar'
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
