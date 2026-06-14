import { ArrowLeft, Camera, Save } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';

function getInitials(name?: string) {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

export function UserProfilePage() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(user?.name ?? '');

  if (!user) return null;

  const handleSave = () => {
    // TODO: Save changes
    setIsEditing(false);
  };

  return (
    <div className="flex-1 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-4 w-4" />
          </Link>
        </Button>
        <h1 className="text-2xl font-bold tracking-tight">Meu Perfil</h1>
      </div>

      <div className="grid gap-6">
        {/* Avatar Card */}
        <Card>
          <CardHeader>
            <CardTitle>Foto de Perfil</CardTitle>
          </CardHeader>
          <CardContent className="flex items-center gap-6">
            <div className="relative group">
              <Avatar className="h-24 w-24">
                <AvatarImage src={user.photo ?? ''} alt={user.name} />
                <AvatarFallback className="text-2xl bg-primary text-primary-foreground">
                  {getInitials(user.name)}
                </AvatarFallback>
              </Avatar>
              <label className="absolute inset-0 flex items-center justify-center bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity rounded-full cursor-pointer">
                <Camera className="h-8 w-8 text-white" />
                <input
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={() => {
                    // TODO: Handle image upload
                  }}
                />
              </label>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Clique na imagem para alterar sua foto
              </p>
              <p className="text-xs text-muted-foreground">
                PNG, JPG ou WEBP de até 5MB
              </p>
            </div>
          </CardContent>
        </Card>

        {/* User Info Card */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Informações Pessoais</CardTitle>
            {!isEditing ? (
              <Button size="sm" onClick={() => setIsEditing(true)}>
                Editar
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsEditing(false)}
                >
                  Cancelar
                </Button>
                <Button size="sm" onClick={handleSave}>
                  <Save className="mr-2 h-4 w-4" />
                  Salvar
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="user-name">Nome</Label>
              <Input
                id="user-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!isEditing}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-email">E-mail</Label>
              <Input id="user-email" value={user.email} disabled />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="user-role">Cargo</Label>
              <Input id="user-role" value={user.role} disabled />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
