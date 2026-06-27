import { zodResolver } from '@hookform/resolvers/zod';
import { MapPin } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { Location } from '@/api/stock/fetch-locations';
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
import { Textarea } from '@/components/ui/textarea';
import { useLocation } from '@/hooks/use-location';

const schema = z.object({
  code: z.string().min(1, 'Código é obrigatório').max(50),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255),
  description: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  location: Location;
}

export function EditLocationDialog({ open, onOpenChange, location }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: location.code,
      name: location.name,
      description: location.description ?? '',
    },
  });

  useEffect(() => {
    if (open) {
      reset({
        code: location.code,
        name: location.name,
        description: location.description ?? '',
      });
    }
  }, [open, location, reset]);

  const { useEditLocation } = useLocation();
  const { mutateAsync: editFn } = useEditLocation();

  async function onSubmit(data: FormData) {
    await editFn({
      id: location.id,
      code: data.code,
      name: data.name,
      description: data.description || null,
    });
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0">
        <form onSubmit={handleSubmit(onSubmit)}>
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <MapPin className="h-5 w-5 text-primary" />
              Editar Localização
            </DialogTitle>
            <DialogDescription>
              Altere os dados da localização
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 space-y-4">
            <div className="space-y-2">
              <Label htmlFor="code">Código</Label>
              <Input id="code" className="h-11" {...register('code')} />
              {errors.code && (
                <p className="text-sm text-destructive">
                  {errors.code.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">Nome</Label>
              <Input id="name" className="h-11" {...register('name')} />
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
