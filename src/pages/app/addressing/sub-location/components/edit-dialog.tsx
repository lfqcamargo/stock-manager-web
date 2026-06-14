import { zodResolver } from '@hookform/resolvers/zod';
import { FolderPlus } from 'lucide-react';
import { Controller, useForm } from 'react-hook-form';

import type { SubLocation } from '@/api/stock/fetch-sub-locations';
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
  type EditSubLocationFormData,
  EditSubLocationSchema,
} from '../lib/edit-validation';

interface EditSubLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  sublocation: SubLocation;
}

export function EditSubLocationDialog({
  open,
  onOpenChange,
  sublocation,
}: EditSubLocationDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditSubLocationFormData>({
    resolver: zodResolver(EditSubLocationSchema),
    defaultValues: {
      name: sublocation.name,
      description: sublocation.description ?? undefined,
      locationId: sublocation.locationId,
    },
  });

  const { useGetLocationsStats } = useLocation();
  const { data: locationsData } = useGetLocationsStats();

  const { useEditSubLocation } = useSubLocation();
  const { mutateAsync: editSubLocationFn } = useEditSubLocation();

  async function handleEditSubLocation(data: EditSubLocationFormData) {
    await editSubLocationFn({
      id: sublocation.id,
      name: data.name,
      description: data.description,
      locationId: data.locationId,
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
        <form
          onSubmit={handleSubmit(handleEditSubLocation, (errors) => {
            console.log('ERROS DE VALIDAÇÃO:', errors);
          })}
        >
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-primary" />
              Editar Sub-Localização
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Edite os dados da sub-localização
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 space-y-6">
            {/* Localização */}
            <div className="space-y-2">
              <Label htmlFor="locationId">Localização</Label>
              <Controller
                name="locationId"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="h-11 w-full">
                      <SelectValue placeholder="Selecione uma localização" />
                    </SelectTrigger>
                    <SelectContent>
                      {locationsData?.locations?.map((location) => (
                        <SelectItem key={location.id} value={location.id}>
                          {location.name}
                        </SelectItem>
                      )) || []}
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

            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Sub-Localização</Label>
              <Input
                id="name"
                placeholder="Ex: Setor 1"
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
                placeholder="Descrição da sub-localização..."
                rows={3}
                {...register('description')}
              />
              {errors.description && (
                <p className="text-sm text-destructive">
                  {errors.description.message}
                </p>
              )}
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
                  'Salvar Sub-Localização'
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
