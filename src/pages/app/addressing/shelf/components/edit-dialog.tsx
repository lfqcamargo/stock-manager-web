import { zodResolver } from '@hookform/resolvers/zod';
import { FolderPlus } from 'lucide-react';
import { useForm } from 'react-hook-form';

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

import {
  type EditShelfFormData,
  EditShelfSchema,
} from '../lib/edit-validation';

interface EditShelfDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shelf: Shelf;
}

export function EditShelfDialog({
  open,
  onOpenChange,
  shelf,
}: EditShelfDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditShelfFormData>({
    resolver: zodResolver(EditShelfSchema),
    defaultValues: {
      name: shelf.name,
      description: shelf.description ?? undefined,
    },
  });

  const { useEditShelf } = useShelf();
  const { mutateAsync: editShelfFn } = useEditShelf();

  async function handleEditShelf(data: EditShelfFormData) {
    await editShelfFn({
      id: shelf.id,
      name: data.name,
      description: data.description,
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
        <form onSubmit={handleSubmit(handleEditShelf)}>
          <DialogHeader className="px-6 pt-6 pb-4">
            <DialogTitle className="text-xl font-semibold flex items-center gap-2">
              <FolderPlus className="h-5 w-5 text-primary" />
              Editar Prateleira
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              Edite os dados da prateleira
            </DialogDescription>
          </DialogHeader>

          <div className="px-6 space-y-6">
            {/* Nome */}
            <div className="space-y-2">
              <Label htmlFor="name">Nome da Prateleira</Label>
              <Input
                id="name"
                placeholder="Ex: Prateleira 1"
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
                placeholder="Descrição da prateleira..."
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
                  'Salvar Prateleira'
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
