import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin } from 'lucide-react';
import { useForm } from 'react-hook-form';

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

interface CreateSubLocationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateSubLocationDialog({
  open,
  onOpenChange,
}: CreateSubLocationDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<CreateSubLocationFormData>({
    resolver: zodResolver(createSubLocationSchema),
    defaultValues: {
      name: '',
      description: '',
      locationId: '',
    },
  });

  const locationId = watch('locationId');

  const { useGetLocationsStats } = useLocation();
  const { data: locationsData } = useGetLocationsStats();

  const { useCreateSubLocation } = useSubLocation();
  const { mutateAsync: createSubLocationFn } = useCreateSubLocation();

  async function handleCreateSubLocation(data: CreateSubLocationFormData) {
    await createSubLocationFn({
      name: data.name,
      description: data.description || undefined,
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
        <form onSubmit={handleSubmit(handleCreateSubLocation)}>
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Nova Sub-Localização
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Preencha os dados da nova sub-localização
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 space-y-6">
            {/* Localização */}
            <div className="space-y-2">
              <Label htmlFor="locationId">Localização</Label>
              <Select
                value={locationId}
                onValueChange={(value) => setValue('locationId', value)}
              >
                <SelectTrigger className="h-11">
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
                placeholder="Ex: Setor destinado para materiais de fixação"
                className="min-h-[80px] resize-none"
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
