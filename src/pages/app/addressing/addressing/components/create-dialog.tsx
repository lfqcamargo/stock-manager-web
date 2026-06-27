import { zodResolver } from '@hookform/resolvers/zod';
import { useQuery } from '@tanstack/react-query';
import { Warehouse } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';
import { z } from 'zod';

import { fetchMaterials } from '@/api/stock/fetch-materials';
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
import { useAddressing } from '@/hooks/use-addressing';
import { useLocation } from '@/hooks/use-location';
import { usePosition } from '@/hooks/use-position';
import { useRow } from '@/hooks/use-row';
import { useShelf } from '@/hooks/use-shelf';
import { useSubLocation } from '@/hooks/use-sub-location';

const schema = z.object({
  locationId: z.string().min(1, 'Localização é obrigatória'),
  subLocationId: z.string().min(1, 'Sub-localização é obrigatória'),
  rowId: z.string().min(1, 'Fileira é obrigatória'),
  shelfId: z.string().min(1, 'Prateleira é obrigatória'),
  positionId: z.string().min(1, 'Posição é obrigatória'),
  materialId: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAddressingDialog({ open, onOpenChange }: Props) {
  const {
    control,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      locationId: '',
      subLocationId: '',
      rowId: '',
      shelfId: '',
      positionId: '',
      materialId: '',
    },
  });

  const locationId = watch('locationId');

  const { useGetLocations } = useLocation();
  const { data: locData } = useGetLocations(0, 100);

  const { useGetSubLocations } = useSubLocation();
  const { data: subData } = useGetSubLocations(0, 100, {
    locationId: locationId || undefined,
  });

  const { useGetRows } = useRow();
  const { data: rowData } = useGetRows(0, 100);

  const { useGetShelfs } = useShelf();
  const { data: shelfData } = useGetShelfs(0, 100);

  const { useGetPositions } = usePosition();
  const { data: posData } = useGetPositions(0, 100);

  const { data: matData } = useQuery({
    queryKey: [
      'materials',
      0,
      100,
      { orderBy: 'name', orderDirection: 'asc', active: true },
    ],
    queryFn: () =>
      fetchMaterials(0, 100, {
        orderBy: 'name',
        orderDirection: 'asc',
        active: true,
      }),
  });

  const { useCreateAddressing } = useAddressing();
  const { mutateAsync: createFn } = useCreateAddressing();

  async function onSubmit(data: FormData) {
    await createFn({
      locationId: data.locationId,
      subLocationId: data.subLocationId,
      rowId: data.rowId,
      shelfId: data.shelfId,
      positionId: data.positionId,
      materialId: data.materialId || undefined,
      active: true,
    });
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[540px] p-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <Warehouse className="h-5 w-5 text-primary" />
              Novo Endereçamento
            </DialogTitle>
            <DialogDescription>
              Vincule uma posição de estoque
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 space-y-4 max-h-[60vh] overflow-y-auto">
            {/* Localização */}
            <div className="space-y-2">
              <Label>Localização</Label>
              <Controller
                name="locationId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {locData?.locations?.map((l) => (
                        <SelectItem key={l.id} value={l.id}>
                          {l.code} — {l.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.locationId && (
                <p className="text-sm text-destructive">
                  {errors.locationId.message}
                </p>
              )}
            </div>

            {/* Sub-Localização */}
            <div className="space-y-2">
              <Label>Sub-Localização</Label>
              <Controller
                name="subLocationId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value}
                    onValueChange={field.onChange}
                    disabled={!locationId}
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue
                        placeholder={
                          locationId
                            ? 'Selecione...'
                            : 'Selecione a localização primeiro'
                        }
                      />
                    </SelectTrigger>
                    <SelectContent>
                      {subData?.subLocations?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.code} — {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subLocationId && (
                <p className="text-sm text-destructive">
                  {errors.subLocationId.message}
                </p>
              )}
            </div>

            {/* Fileira */}
            <div className="space-y-2">
              <Label>Fileira</Label>
              <Controller
                name="rowId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {rowData?.rows?.map((r) => (
                        <SelectItem key={r.id} value={r.id}>
                          {r.code} — {r.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.rowId && (
                <p className="text-sm text-destructive">
                  {errors.rowId.message}
                </p>
              )}
            </div>

            {/* Prateleira */}
            <div className="space-y-2">
              <Label>Prateleira</Label>
              <Controller
                name="shelfId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {shelfData?.shelfs?.map((s) => (
                        <SelectItem key={s.id} value={s.id}>
                          {s.code} — {s.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.shelfId && (
                <p className="text-sm text-destructive">
                  {errors.shelfId.message}
                </p>
              )}
            </div>

            {/* Posição */}
            <div className="space-y-2">
              <Label>Posição</Label>
              <Controller
                name="positionId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      {posData?.positions?.map((p) => (
                        <SelectItem key={p.id} value={p.id}>
                          {p.code} — {p.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.positionId && (
                <p className="text-sm text-destructive">
                  {errors.positionId.message}
                </p>
              )}
            </div>

            {/* Material (opcional) */}
            <div className="space-y-2">
              <Label>
                Material{' '}
                <span className="text-muted-foreground font-normal">
                  (opcional)
                </span>
              </Label>
              <Controller
                name="materialId"
                control={control}
                render={({ field }) => (
                  <Select
                    value={field.value ?? ''}
                    onValueChange={(v) =>
                      field.onChange(v === 'none' ? '' : v)
                    }
                  >
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione um material..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Sem material</SelectItem>
                      {matData?.materials?.map((m) => (
                        <SelectItem key={m.id} value={m.id}>
                          {m.code} — {m.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
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
