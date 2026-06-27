import { zodResolver } from '@hookform/resolvers/zod';
import { Warehouse } from 'lucide-react';
import { useEffect } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import type { Addressing } from '@/api/stock/fetch-addressings';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAddressing } from '@/hooks/use-addressing';

const schema = z.object({
  active: z.boolean(),
  materialId: z.string().nullable(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addressing: Addressing;
  materials: { id: string; code: string; name: string }[];
}

export function EditAddressingDialog({
  open,
  onOpenChange,
  addressing,
  materials,
}: Props) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      active: addressing.active,
      materialId: addressing.material?.id ?? null,
    },
  });

  useEffect(() => {
    if (open)
      reset({
        active: addressing.active,
        materialId: addressing.material?.id ?? null,
      });
  }, [open, addressing, reset]);

  const { useEditAddressing } = useAddressing();
  const { mutateAsync: editFn } = useEditAddressing();

  async function onSubmit(data: FormData) {
    await editFn({
      id: addressing.id,
      active: data.active,
      materialId: data.materialId,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-primary" />
              Editar Endereçamento
            </DialogTitle>
            <DialogDescription>
              Altere o material vinculado e o status
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 space-y-4">
            {/* Localização resumida (somente leitura) */}
            <div className="rounded-md border p-3 space-y-1 bg-muted/30 text-sm">
              <p>
                <span className="text-muted-foreground">Localização:</span>{' '}
                {addressing.location.code} — {addressing.location.name}
              </p>
              <p>
                <span className="text-muted-foreground">Sub-local:</span>{' '}
                {addressing.subLocation.code} — {addressing.subLocation.name}
              </p>
              <p>
                <span className="text-muted-foreground">
                  Fileira / Prateleira / Posição:
                </span>{' '}
                {addressing.row.code} / {addressing.shelf.code} /{' '}
                {addressing.position.code}
              </p>
              <p>
                <span className="text-muted-foreground">Saldo:</span>{' '}
                <Badge variant="outline">{addressing.amount}</Badge>
              </p>
            </div>

            {/* Material */}
            <div className="space-y-2">
              <Label>Material vinculado</Label>
              <Controller
                name="materialId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? '__none__'}
                    onValueChange={(v) =>
                      field.onChange(v === '__none__' ? null : v)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Sem material" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">— Sem material —</SelectItem>
                      {materials.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.code} — {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            {/* Ativo */}
            <div className="flex items-center gap-3">
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
              <Label htmlFor="active">Endereçamento ativo</Label>
            </div>
          </div>

          <DialogFooter className="px-6 py-4 bg-muted/30 mt-6">
            <div className="flex gap-3 w-full sm:w-auto">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
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
