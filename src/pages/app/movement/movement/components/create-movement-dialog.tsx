/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import { Calendar, ClipboardEdit, Hash, MapPin, Package } from 'lucide-react';
import { useEffect, useState } from 'react';
import { z } from 'zod';

import { MaterialSearchDialog } from '@/components/material-search-dialog';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { api } from '@/lib/axios';

const createMovementBodySchema = z.object({
  movementTypeId: z
    .string()
    .uuid({ message: 'Selecione o tipo de movimentação.' }),
  addressingId: z.string().uuid({ message: 'Selecione o endereçamento.' }),
  quantity: z
    .number()
    .min(1, { message: 'Quantidade deve ser maior que zero.' }),
  date: z.coerce.date({ message: 'Informe uma data válida.' }),
  observation: z.string().nullable().optional(),
});

type CreateMovementBody = z.infer<typeof createMovementBodySchema>;

interface MovementType {
  id: string;
  name: string;
  direction: string;
}

interface Material {
  id: string;
  code: string;
  name: string;
  description: string;
}

interface MaterialDetails {
  id: string;
  code: string;
  name: string;
  description: string | null;
}

interface Addressing {
  id: string;
  location: { name: string };
  subLocation: { name: string };
  row: { name: string };
  shelf: { name: string };
  position: { name: string };
  material: Material | null;
}

interface CreateMovementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: CreateMovementBody) => void;
  isLoading: boolean;
}

export function CreateMovementDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading,
}: CreateMovementDialogProps) {
  const [form, setForm] = useState<Partial<CreateMovementBody>>({});
  const [error, setError] = useState<string | null>(null);
  const [movementTypes, setMovementTypes] = useState<MovementType[]>([]);
  const [loadingTypes, setLoadingTypes] = useState(false);

  // Material
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(
    null,
  );

  // Addressings
  const [addressings, setAddressings] = useState<Addressing[]>([]);
  const [loadingAddressings, setLoadingAddressings] = useState(false);

  useEffect(() => {
    if (open) {
      setLoadingTypes(true);
      api
        .get('/movement-types')
        .then((res) => setMovementTypes(res.data.movementTypes || res.data))
        .finally(() => setLoadingTypes(false));
      setSelectedMaterial(null);
      setAddressings([]);
      setForm({});
    }
  }, [open]);

  // Buscar addressings do material selecionado
  useEffect(() => {
    if (selectedMaterial) {
      setLoadingAddressings(true);
      api
        .get('/addressings', { params: { materialId: selectedMaterial.id } })
        .then((res) => setAddressings(res.data.addressings || res.data))
        .finally(() => setLoadingAddressings(false));
      setForm((prev) => ({ ...prev, addressingId: '' }));
    }
  }, [selectedMaterial]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'number' ? Number(value) : value,
    }));
  }

  function handleSelectChange(name: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      const parsed = createMovementBodySchema.parse({
        ...form,
        quantity: Number(form.quantity),
        date: form.date || undefined,
      });
      onSubmit(parsed);
      setForm({});
      setSelectedMaterial(null);
      setAddressings([]);
    } catch (err: unknown) {
      if (err instanceof z.ZodError) {
        setError(
          err.errors[0]?.message || 'Preencha todos os campos corretamente.',
        );
      } else {
        setError('Erro ao validar o formulário.');
      }
    }
  }

  function handleClose() {
    setForm({});
    setError(null);
    setSelectedMaterial(null);
    setAddressings([]);
    onOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Nova Movimentação</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-10">
          {/* Material - linha separada */}
          <div>
            <label className="block text-lg font-medium mb-3 items-center gap-2">
              <Package className="w-6 h-6 text-muted-foreground" /> Material{' '}
              <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <Input
                value={
                  selectedMaterial
                    ? `${selectedMaterial.code} - ${selectedMaterial.name}`
                    : ''
                }
                placeholder="Selecione o material"
                readOnly
                onClick={() => setMaterialDialogOpen(true)}
                required
                className="cursor-pointer bg-white h-12 text-lg w-[650px] max-w-full"
              />
              <Button
                type="button"
                variant="secondary"
                onClick={() => setMaterialDialogOpen(true)}
                className="h-12 px-8 text-lg"
              >
                <Package className="w-6 h-6" /> Buscar
              </Button>
            </div>
            <MaterialSearchDialog
              open={materialDialogOpen}
              onOpenChange={setMaterialDialogOpen}
              onSelect={(mat) => {
                setSelectedMaterial({
                  ...mat,
                  description: mat.description ?? '',
                });
                setForm((prev) => ({ ...prev, addressingId: '' }));
              }}
              selectedMaterial={selectedMaterial as unknown as MaterialDetails}
            />
          </div>
          {/* Endereçamento - linha separada */}
          <div>
            <label className="text-lg font-medium mb-3 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-muted-foreground" /> Endereçamento{' '}
              <span className="text-red-500">*</span>
            </label>
            <Select
              value={form.addressingId ?? ''}
              onValueChange={(v) => handleSelectChange('addressingId', v)}
              disabled={!selectedMaterial || loadingAddressings}
              required
            >
              <SelectTrigger className="h-12 text-lg w-[650px] max-w-full">
                <SelectValue
                  placeholder={
                    loadingAddressings ? 'Carregando...' : 'Selecione'
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {addressings.map((a) => (
                  <SelectItem key={a.id} value={a.id} className="text-lg">
                    {a.location.name} / {a.subLocation.name} / {a.row.name} /{' '}
                    {a.shelf.name} / {a.position.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {/* Restante dos campos em grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="block text-lg font-medium mb-3 flex items-center gap-2">
                <ClipboardEdit className="w-6 h-6 text-muted-foreground" /> Tipo
                de Movimentação <span className="text-red-500">*</span>
              </label>
              <Select
                value={form.movementTypeId ?? ''}
                onValueChange={(v) => handleSelectChange('movementTypeId', v)}
                disabled={loadingTypes}
                required
              >
                <SelectTrigger className="h-12 text-lg w-[650px] max-w-full">
                  <SelectValue
                    placeholder={loadingTypes ? 'Carregando...' : 'Selecione'}
                  />
                </SelectTrigger>
                <SelectContent>
                  {movementTypes.map((type) => (
                    <SelectItem
                      key={type.id}
                      value={type.id}
                      className="text-lg"
                    >
                      {type.name} (
                      {type.direction === 'IN'
                        ? 'Entrada'
                        : type.direction === 'OUT'
                          ? 'Saída'
                          : 'Ajuste'}
                      )
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-lg font-medium mb-3 flex items-center gap-2">
                <Hash className="w-6 h-6 text-muted-foreground" /> Quantidade{' '}
                <span className="text-red-500">*</span>
              </label>
              <Input
                name="quantity"
                type="number"
                placeholder="Quantidade"
                value={form.quantity ?? ''}
                onChange={handleChange}
                min={1}
                required
                className="h-12 text-lg w-[650px] max-w-full"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-3 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-muted-foreground" /> Data{' '}
                <span className="text-red-500">*</span>
              </label>
              <Input
                name="date"
                type="date"
                placeholder="Data"
                value={form.date ? String(form.date).slice(0, 10) : ''}
                onChange={handleChange}
                required
                className="h-12 text-lg w-[650px] max-w-full"
              />
            </div>
          </div>
          <div>
            <label className="text-lg font-medium mb-3 flex items-center gap-2">
              Observação
            </label>
            <Input
              name="observation"
              placeholder="Observação"
              value={form.observation ?? ''}
              onChange={handleChange}
              className="h-12 text-lg w-[650px] max-w-full"
            />
          </div>
          {error && <div className="text-red-600 text-lg mt-2">{error}</div>}
          <div className="flex justify-end gap-6 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isLoading}
              className="h-12 px-12 text-lg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="h-12 px-12 text-lg"
            >
              {isLoading ? 'Salvando...' : 'Salvar'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
