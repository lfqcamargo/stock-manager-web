import { zodResolver } from '@hookform/resolvers/zod';
import type { UseMutationResult } from '@tanstack/react-query';
import { Eye, EyeOff } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Controller, useController, useForm } from 'react-hook-form';

import type { User } from '@/@types/user';
import type { EditUserBody } from '@/api/user/edit-user';
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
import { Switch } from '@/components/ui/switch';

import { type EditUserFormData, editUserSchema } from '../schemas/validations';

interface EditUserDialogProps {
  user: User | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editUserMutation: UseMutationResult<
    void,
    Error,
    { id: string; data: EditUserBody }
  >;
}

export function EditUserDialog({
  user,
  open,
  onOpenChange,
  editUserMutation,
}: EditUserDialogProps) {
  const [showPassword, setShowPassword] = useState(false);
  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditUserFormData>({
    resolver: zodResolver(editUserSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      email: '',
      role: 'EMPLOYEE',
      active: true,
      password: '',
    },
  });

  const {
    field: { value: active, onChange: setActive },
  } = useController({
    name: 'active',
    control,
  });

  // Reset form when user changes
  useEffect(() => {
    if (open && user) {
      reset({
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
        password: '',
      });
    } else {
      reset();
    }
  }, [user, open, reset]);

  function onFormSubmit(data: EditUserFormData) {
    if (user) {
      const { password, ...rest } = data;
      editUserMutation.mutate(
        { id: user.id, data: { ...rest, ...(password ? { password } : {}) } },
        {
          onSuccess: () => {
            onOpenChange(false);
          },
        },
      );
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogDescription>
            Atualize as informações do usuário abaixo. Deixe a senha em branco
            para não alterar.
          </DialogDescription>
        </DialogHeader>
        <form
          onSubmit={(e) => void handleSubmit(onFormSubmit)(e)}
          className="space-y-5"
        >
          <div className="space-y-2">
            <Label htmlFor="name">Nome Completo</Label>
            <Input
              id="name"
              placeholder="Nome do usuário"
              disabled={isSubmitting}
              aria-invalid={!!errors.name}
              {...register('name')}
            />
            {errors.name && (
              <p className="text-destructive text-sm">{errors.name.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">E-mail</Label>
            <Input
              id="email"
              type="email"
              placeholder="E-mail do usuário"
              disabled
              aria-invalid={!!errors.email}
              {...register('email')}
            />
            <p className="text-xs text-muted-foreground">
              E-mail não pode ser alterado
            </p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Cargo</Label>
            <Controller
              name="role"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isSubmitting}
                >
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Selecione um cargo" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ADMIN">Administrador</SelectItem>
                    <SelectItem value="MANAGER">Gerente</SelectItem>
                    <SelectItem value="EMPLOYEE">Funcionário</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Nova Senha (opcional)</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Deixe em branco para manter a senha atual"
                disabled={isSubmitting}
                aria-invalid={!!errors.password}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="text-destructive text-sm">
                {errors.password.message}
              </p>
            )}
          </div>
          <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
            <div className="space-y-0.5">
              <Label htmlFor="active">Status do Usuário</Label>
              <p className="text-sm text-muted-foreground">
                {active
                  ? 'Usuário está ativo e pode acessar o sistema'
                  : 'Usuário está inativo e não pode acessar o sistema'}
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
                disabled={isSubmitting}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {editUserMutation.isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
