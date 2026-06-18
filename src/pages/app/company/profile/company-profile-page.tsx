import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowLeft, Building, Camera, Save } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link } from 'react-router-dom';
import { z } from 'zod';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';
import { useCompany } from '@/hooks/use-company';
import { formatCNPJ } from '@/utils/validate-cnpj';

const editCompanySchema = z.object({
  name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  photo: z.string().nullable().optional(),
});

type EditCompanyFormData = z.infer<typeof editCompanySchema>;

function getInitials(name?: string): string {
  if (!name) return '—';
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function CompanyProfilePage() {
  const { company, isLoading, editCompanyMutation } = useCompany();
  const [isEditing, setIsEditing] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<EditCompanyFormData>({
    resolver: zodResolver(editCompanySchema),
    defaultValues: {
      name: '',
      photo: null,
    },
  });

  const watchName = useWatch({ control, name: 'name' });
  const watchPhoto = useWatch({ control, name: 'photo' });

  const onSubmit = handleSubmit(async (data) => {
    await editCompanyMutation.mutateAsync(data);
    setIsEditing(false);
    setPreviewPhoto(null);
  });

  const handleEditClick = () => {
    if (company) {
      setValue('name', company.name);
      setValue('photo', company.photo ?? null);
      setPreviewPhoto(company.photo ?? null);
    }
    setIsEditing(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        setPreviewPhoto(result);
        setValue('photo', result);
      };
      reader.readAsDataURL(file);
    }
  };

  if (isLoading || !company) {
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
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const displayPhoto = previewPhoto ?? (isEditing ? watchPhoto : company.photo);

  return (
    <div className="flex-1 space-y-8">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Perfil da Empresa</h1>
      </div>

      <div className="mx-auto max-w-2xl space-y-6">
        {/* Avatar Card */}
        <Card className="overflow-hidden">
          <CardContent className="p-8 text-center">
            <div className="relative inline-block group">
              <Avatar className="h-28 w-28">
                <AvatarImage src={displayPhoto ?? ''} alt={company.name} />
                <AvatarFallback className="text-3xl bg-primary text-primary-foreground">
                  {getInitials(isEditing ? watchName : company.name)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-100 transition-opacity rounded-full cursor-pointer">
                  <Camera className="h-9 w-9 text-white" />
                  <input
                    type="file"
                    accept="image/*"
                    className="sr-only"
                    onChange={handleFileChange}
                  />
                </label>
              )}
            </div>
            <div className="mt-4 space-y-1">
              <h2 className="text-2xl font-bold">
                {isEditing ? watchName : company.name}
              </h2>
              <p className="text-muted-foreground">
                {formatCNPJ(company.cnpj)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Company Info Card */}
        <Card className="overflow-hidden">
          <CardHeader className="flex flex-row items-center justify-between px-8 pt-8">
            <CardTitle>Informações Básicas</CardTitle>
            {!isEditing ? (
              <Button
                onClick={handleEditClick}
                disabled={editCompanyMutation.isPending}
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
                    setPreviewPhoto(null);
                  }}
                  disabled={editCompanyMutation.isPending}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={(e) => void onSubmit(e as any)}
                  disabled={isSubmitting || editCompanyMutation.isPending}
                >
                  <Save className="mr-2 h-4 w-4" />
                  {editCompanyMutation.isPending ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="px-8 pb-8 pt-2 space-y-6">
            {isEditing ? (
              <div className="space-y-4">
                <div className="grid gap-2">
                  <Label htmlFor="companyName">Nome da Empresa</Label>
                  <Input
                    id="companyName"
                    placeholder="Nome da empresa"
                    disabled={isSubmitting || editCompanyMutation.isPending}
                    aria-invalid={!!errors.name}
                    {...register('name')}
                  />
                  {errors.name && (
                    <p className="text-destructive text-sm">
                      {errors.name.message}
                    </p>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                    Nome da Empresa
                  </Label>
                  <div className="text-lg font-medium">{company.name}</div>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground text-xs uppercase tracking-wider">
                    CNPJ
                  </Label>
                  <div className="flex items-center gap-2 text-lg">
                    <Building className="h-5 w-5 text-muted-foreground" />
                    <span>{formatCNPJ(company.cnpj)}</span>
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
