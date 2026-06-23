import { zodResolver } from '@hookform/resolvers/zod';
import { FolderPlus } from 'lucide-react';
import { Controller, useController, useForm } from 'react-hook-form';

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
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { useGroup } from '@/hooks/use-group';
import { getInitials } from '@/utils/get-initials';

import type { CreateGroupFormData } from '../lib/create-validation';
import { CreateGroupSchema } from '../lib/create-validation';

interface CreateGroupDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateGroupDialog({
  open,
  onOpenChange,
}: CreateGroupDialogProps) {
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors },
    watch,
  } = useForm<CreateGroupFormData>({
    resolver: zodResolver(CreateGroupSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      active: true,
      photoUrl: null,
    },
    mode: 'onChange',
  });

  const watchName = watch('name');

  const {
    field: { value: active, onChange: setActive },
  } = useController({
    name: 'active',
    control,
  });

  const { useCreateGroup } = useGroup();
  const { mutate: createGroupFn, isPending } = useCreateGroup();

  const handleCreateGroup = handleSubmit((data) => {
    createGroupFn(
      {
        code: data.code,
        name: data.name,
        description: data.description,
        active: data.active,
        photoUrl: data.photoUrl,
      },
      {
        onSuccess: () => {
          reset();
          onOpenChange(false);
        },
      },
    );
  });

  const handleCancel = () => {
    reset();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <FolderPlus className="h-5 w-5 text-primary" />
            Novo Grupo de Material
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Preencha os dados do novo grupo para organizá-los no sistema
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={(e) => {
            void handleCreateGroup(e);
          }}
          className="space-y-5"
        >
          {/* Preview */}
          <Controller
            name="photoUrl"
            control={control}
            render={({ field }) => (
              <div className="flex justify-center mb-2">
                <div className="h-24 w-24 rounded-lg overflow-hidden relative">
                  {field.value ? (
                    <img
                      src={field.value}
                      alt="Preview"
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = 'none';
                      }}
                    />
                  ) : null}
                  {!field.value ? (
                    <div className="h-full w-full bg-primary/10 flex items-center justify-center text-2xl bg-primary text-primary-foreground">
                      {getInitials(watchName || 'G')}
                    </div>
                  ) : null}
                </div>
              </div>
            )}
          />

          {/* Código */}
          <div className="space-y-2">
            <Label htmlFor="code">Código</Label>
            <Input
              id="code"
              maxLength={10}
              placeholder="Ex: FIX"
              className="h-11"
              {...register('code')}
            />
            {errors.code && (
              <p className="text-sm text-destructive">{errors.code.message}</p>
            )}
          </div>

          {/* Nome */}
          <div className="space-y-2">
            <Label htmlFor="name">Nome do Grupo</Label>
            <Input
              id="name"
              placeholder="Ex: Fixação"
              className="h-11"
              disabled={isPending}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              placeholder="Descrição do grupo de materiais..."
              rows={3}
              disabled={isPending}
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">
                {errors.description.message}
              </p>
            )}
          </div>

          {/* URL da Foto */}
          <div className="space-y-2">
            <Label htmlFor="photoUrl">URL da Foto (opcional)</Label>
            <Controller
              name="photoUrl"
              control={control}
              render={({ field }) => (
                <Input
                  id="photoUrl"
                  type="url"
                  placeholder="https://example.com/photo.jpg"
                  disabled={isPending}
                  aria-invalid={!!errors.photoUrl}
                  value={field.value ?? ''}
                  onChange={(e) => {
                    const value = e.target.value;
                    field.onChange(value === '' ? null : value);
                  }}
                />
              )}
            />
            {errors.photoUrl && (
              <p className="text-destructive text-sm">
                {errors.photoUrl.message}
              </p>
            )}
          </div>

          {/* Ativo */}
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="active">Status do Grupo</Label>
              <p className="text-sm text-muted-foreground">
                {active
                  ? 'Grupo está ativo e pode ser utilizado'
                  : 'Grupo está inativo e não pode ser utilizado'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span
                className={`text-sm font-medium ${active ? 'text-green-600' : 'text-destructive'}`}
              >
                {active ? 'Ativo' : 'Inativo'}
              </span>
              <Switch
                id="active"
                checked={active}
                onCheckedChange={setActive}
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={handleCancel}
              disabled={isPending}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Salvando...
                </div>
              ) : (
                'Salvar Grupo'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
