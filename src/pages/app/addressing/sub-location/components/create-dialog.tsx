import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin } from 'lucide-react';
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
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from '@/hooks/use-location';
import { useSubLocation } from '@/hooks/use-sub-location';

import {
  type CreateSubLocationFormData,
  createSubLocationSchema,
} from '../lib/create-validation';

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSubLocationDialog({ open, onOpenChange }: Props) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateSubLocationFormData>({
    resolver: zodResolver(createSubLocationSchema),
    defaultValues: { code: '', name: '', locationId: '', description: '' },
  });

  const { useGetLocations } = useLocation();
  const { data: locationsData } = useGetLocations(0, 100);

  const { useCreateSubLocation } = useSubLocation();
  const { mutateAsync: createFn } = useCreateSubLocation();

  async function onSubmit(data: CreateSubLocationFormData) {
    await createFn({
      code: data.code,
      name: data.name,
      locationId: data.locationId,
      description: data.description || undefined,
    });
    reset();
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Nova Sub-Localização
            </DialogTitle>
            <DialogDescription>
              Preencha os dados da nova sub-localização
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 space-y-4">
            <div className="space-y-2">
              <Label>Localização</Label>
              <Controller
                name="locationId"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="h-11">
                      <SelectValue placeholder="Selecione uma localização" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationsData?.locations?.map((l) => (
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

            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input
                id="code"
                placeholder="Ex: SUB-A1"
                className="h-11"
                {...register('code')}
              />
              {errors.code && (
                <p className="text-sm text-destructive">
                  {errors.code.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input
                id="name"
                placeholder="Ex: Setor A1"
                className="h-11"
                {...register('name')}
              />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Descrição</Label>
              <Textarea
                id="description"
                placeholder="Opcional..."
                className="min-h-[80px] resize-none"
                {...register('description')}
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
