import { zodResolver } from '@hookform/resolvers/zod';
import { LayoutList } from 'lucide-react';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import type { Shelf } from '@/api/stock/fetch-shelfs';
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
import { useShelf } from '@/hooks/use-shelf';

const schema = z.object({
  code: z.string().min(1).max(50),
  name: z.string().min(3).max(255),
  description: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shelf: Shelf;
}

export function EditShelfDialog({ open, onOpenChange, shelf }: Props) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      code: shelf.code,
      name: shelf.name,
      description: shelf.description ?? '',
    },
  });

  useEffect(() => {
    if (open)
      reset({
        code: shelf.code,
        name: shelf.name,
        description: shelf.description ?? '',
      });
  }, [open, shelf, reset]);

  const { useEditShelf } = useShelf();
  const { mutateAsync: editFn } = useEditShelf();

  async function onSubmit(data: FormData) {
    await editFn({
      id: shelf.id,
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
              <LayoutList className="h-5 w-5 text-primary" />
              Editar Prateleira
            </DialogTitle>
            <DialogDescription>Altere os dados da prateleira</DialogDescription>
          </DialogHeader>
          <div className="px-6 space-y-4">
            <div className="space-y-2">
              <Label>Código</Label>
              <Input className="h-11" {...register('code')} />
              {errors.code && (
                <p className="text-sm text-destructive">
                  {errors.code.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input className="h-11" {...register('name')} />
              {errors.name && (
                <p className="text-sm text-destructive">
                  {errors.name.message}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <Label>Descrição</Label>
              <Textarea
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
