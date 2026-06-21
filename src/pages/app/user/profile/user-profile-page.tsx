import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Mail, Save, User } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { formatRole } from '@/utils/format-role';
import { getInitials } from '@/utils/get-initials';

import {
  type UpdateProfileFormData,
  updateProfileSchema,
} from './schemas/validations';

export function UserProfilePage() {
  const { user, isLoading, updateProfileMutation } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      name: '',
      photoUrl: null,
    },
  });

  const watchName = useWatch({ control, name: 'name' });
  const watchPhotoUrl = useWatch({ control, name: 'photoUrl' });

  const onSubmit = handleSubmit(async (data) => {
    await updateProfileMutation.mutateAsync(data);
    setIsEditing(false);
  });

  const handleEditClick = () => {
    if (user) {
      setValue('name', user.name);
      setValue('photoUrl', user.photoUrl ?? null);
    }
    setIsEditing(true);
  };

  if (isLoading || !user) {
    return (
      <div className="flex-1 space-y-8">
        <div className="flex items-center gap-4">
          <Button variant="outline" size="icon" asChild>
            <Link to="/">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <Skeleton className="h-8 w-48" />
        </div>

        <div className="mx-auto max-w-2xl space-y-6">
          <Card className="p-6">
            <CardHeader className="text-center pb-2">
              <div className="flex justify-center">
                <Skeleton className="h-24 w-24 rounded-full" />
              </div>
              <Skeleton className="mt-4 h-7 w-48 mx-auto" />
            </CardHeader>
          </Card>

          <Card className="p-6">
            <CardHeader className="pb-2">
              <Skeleton className="h-6 w-32" />
            </CardHeader>
            <CardContent className="space-y-4 pt-2">
              <div className="grid gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="grid gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const displayPhoto = isEditing ? watchPhotoUrl : user.photoUrl;

  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Avatar Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="relative inline-block group">
              <Avatar className="h-28 w-28">
                <AvatarImage src={displayPhoto ?? ''} alt={user.name} />
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                  {getInitials(isEditing ? watchName : user.name)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="mt-4 space-y-1">
              <h2 className="text-2xl font-bold">
                {isEditing ? watchName : user.name}
              </h2>
              <p className="text-muted-foreground">{user.email}</p>
            </div>
          </CardContent>
        </Card>

        {/* User Info Card */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between px-8 pt-8">
            <CardTitle>Informações Básicas</CardTitle>
            {!isEditing ? (
              <Button
                onClick={handleEditClick}
                disabled={updateProfileMutation.isPending}
              >
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => {
                    reset();
                    setIsEditing(false);
                  }}
                  disabled={updateProfileMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={(e) => void onSubmit(e as any)}
                  disabled={isSubmitting || updateProfileMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {updateProfileMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-2 space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="userName">Nome Completo</Label>
                  <Input
                    id="userName"
                    placeholder="Nome completo"
                    disabled={isSubmitting || updateProfileMutation.isPending}
                    aria-invalid={!!errors.name}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="photoUrl">URL da Foto (opcional)</Label>
                  <Input
                    id="photoUrl"
                    type="url"
                    placeholder="https://example.com/foto.jpg"
                    disabled={isSubmitting || updateProfileMutation.isPending}
                    aria-invalid={!!errors.photoUrl}
                    {...register('photoUrl')}
                  />
                  {errors.photoUrl && (
                    <p className="text-destructive text-sm">
                      {errors.photoUrl.message}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                    Nome Completo
                  </Label>
                  <div className="text-lg font-medium">{user.name}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                    E-mail
                  </Label>
                  <div className="flex items-center gap-2 text-lg">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                    Cargo
                  </Label>
                  <div className="flex items-center gap-2 text-lg">
                    <User className="h-5 w-5 text-muted-foreground" />
                    <span>{formatRole(user.role)}</span>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
