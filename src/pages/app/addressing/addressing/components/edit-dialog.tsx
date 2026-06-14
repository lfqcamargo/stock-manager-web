import { useQuery } from '@tanstack/react-query';
import { CheckCircle, MapPin, Package, Settings, XCircle } from 'lucide-react';
import type React from 'react';
import { useEffect, useState } from 'react';

import { type Addressing } from '@/api/stock/fetch-addressings';
import { fetchGroups } from '@/api/stock/fetch-groups';
import { fetchMaterials } from '@/api/stock/fetch-materials';
import { type MaterialDetails } from '@/api/stock/fetch-materials';
import { MaterialSearchDialog } from '@/components/material-search-dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useAddressing } from '@/hooks/use-addressing';

interface EditAddressingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  addressing: Addressing;
}

export function EditAddressingDialog({
  open,
  onOpenChange,
  addressing,
}: EditAddressingDialogProps) {
  // Query para buscar materiais (deve vir antes de qualquer useEffect)
  const { data: materialsData } = useQuery({
    queryKey: ['materials'],
    queryFn: () => fetchMaterials({ page: 1, itemsPerPage: 100 }),
    enabled: open,
    staleTime: 0,
    refetchOnMount: true,
  });

  // Buscar todos os grupos para preencher o nome do grupo no selectedMaterial
  const { data: groupsData } = useQuery({
    queryKey: ['groups-all'],
    queryFn: () => fetchGroups({ page: 1, itemsPerPage: 9999 }),
    staleTime: 5 * 60 * 1000,
  });

  const [formData, setFormData] = useState({
    materialId: '',
    locationId: '',
    subLocationId: '',
    rowId: '',
    shelfId: '',
    positionId: '',
    amount: '',
    active: true,
  });

  // Estado para controlar o dialog de busca de material
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialDetails | null>(null);

  // Preenche o material selecionado ao abrir o edit
  useEffect(() => {
    if (!open) {
      setSelectedMaterial(null);
      setFormData((prev: typeof formData) => ({ ...prev, materialId: '' }));
      return;
    }
    if (!addressing?.material) {
      setSelectedMaterial(null);
      return;
    }
    // Buscar material completo na lista de materiais
    let materialFull: MaterialDetails | null = null;
    if (materialsData?.materials) {
      materialFull =
        materialsData.materials.find(
          (m: MaterialDetails) => m.id === addressing.material?.id,
        ) || null;
    }
    let groupName = '';
    let groupId = '';
    let createdAt = '';
    if (materialFull) {
      groupName = materialFull.group || '';
      groupId = materialFull.groupId || '';
      createdAt = materialFull.createdAt || '';
      // Se não veio o nome do grupo, tenta buscar pelo groupId
      if (!groupName && groupId && groupsData?.groups) {
        const groupObj = groupsData.groups.find(
          (g: { id: string }) => g.id === groupId,
        );
        groupName = groupObj ? groupObj.name : '';
      }
    } else if (groupsData?.groups) {
      // Tenta buscar pelo nome do grupo se possível
      const groupByName = groupsData.groups.find(
        (g: { name: string }) => g.name === addressing.material?.name,
      );
      groupName = groupByName ? groupByName.name : '';
      groupId = groupByName ? groupByName.id : '';
      createdAt = '';
    }
    setSelectedMaterial({
      id: addressing.material?.id || '',
      code: addressing.material?.code || '',
      name: addressing.material?.name || '',
      description: addressing.material?.description || '',
      unit: addressing.material?.unit || '',
      active: addressing.material?.active ?? true,
      groupId,
      group: groupName,
      createdAt,
    });
    setFormData((prev: typeof formData) => ({
      ...prev,
      materialId: addressing.material?.id || '',
    }));
  }, [open, addressing?.material, groupsData, materialsData]);

  // Preenche o formulário quando o dialog abrir
  useEffect(() => {
    if (open && addressing && addressing.id) {
      setFormData({
        materialId: addressing.material?.id || '',
        locationId: addressing.location?.id || '',
        subLocationId: addressing.subLocation?.id || '',
        rowId: addressing.row?.id || '',
        shelfId: addressing.shelf?.id || '',
        positionId: addressing.position?.id || '',
        amount: addressing.amount?.toString() || '',
        active: addressing.active ?? true,
      });
    }
  }, [open, addressing]);

  // Reset form quando dialog fechar
  useEffect(() => {
    if (!open) {
      setFormData({
        materialId: '',
        locationId: '',
        subLocationId: '',
        rowId: '',
        shelfId: '',
        positionId: '',
        amount: '',
        active: true,
      });
    }
  }, [open]);

  const { useEditAddressing } = useAddressing();
  const { mutateAsync: editAddressingFn, isPending } = useEditAddressing();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await editAddressingFn({
      id: addressing.id,
      materialId: formData.materialId || undefined,
      locationId: formData.locationId,
      subLocationId: formData.subLocationId,
      rowId: formData.rowId,
      shelfId: formData.shelfId,
      positionId: formData.positionId,
      active: formData.active,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[750px] max-h-[85vh] overflow-y-auto">
        <DialogHeader className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <MapPin className="h-5 w-5 text-primary" />
            </div>
            <div>
              <DialogTitle className="text-xl font-semibold">
                Editar Endereçamento
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Atualize as informações do endereçamento no estoque.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seção: Localização */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <div className="p-1.5 bg-primary/10 rounded-md">
                <MapPin className="h-4 w-4 text-primary" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Localização
                </h3>
                <Badge variant="outline" className="text-xs">
                  Somente Leitura
                </Badge>
              </div>
            </div>
            {/* Primeira linha - Local e Sub-local */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="location" className="text-sm font-medium">
                  Local
                </Label>
                <Select value={formData.locationId} disabled>
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={addressing?.location?.id || ''}>
                      {addressing?.location?.name || ''}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subLocation" className="text-sm font-medium">
                  Sub-Local
                </Label>
                <Select value={formData.subLocationId} disabled>
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Selecione o sub-local" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={addressing?.subLocation?.id || ''}>
                      {addressing?.subLocation?.name || ''}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Segunda linha - Fileira e Prateleira */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="row" className="text-sm font-medium">
                  Fileira
                </Label>
                <Select value={formData.rowId} disabled>
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Selecione a fileira" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={addressing?.row?.id || ''}>
                      {addressing?.row?.name || ''}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="shelf" className="text-sm font-medium">
                  Prateleira
                </Label>
                <Select value={formData.shelfId} disabled>
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Selecione a prateleira" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={addressing?.shelf?.id || ''}>
                      {addressing?.shelf?.name || ''}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            {/* Terceira linha - Posição */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="position" className="text-sm font-medium">
                  Posição
                </Label>
                <Select value={formData.positionId} disabled>
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Selecione a posição" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value={addressing?.position?.id || ''}>
                      {addressing?.position?.name || ''}
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          {/* Seção: Configurações */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <div className="p-1.5 bg-secondary/10 rounded-md">
                <Settings className="h-4 w-4 text-secondary-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground">
                Configurações
              </h3>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
              <div className="space-y-1">
                <Label htmlFor="active" className="text-sm font-medium">
                  Status do Endereçamento
                </Label>
                <p className="text-xs text-muted-foreground">
                  Define se este endereçamento está disponível para uso
                </p>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-2 text-sm">
                  {formData.active ? (
                    <>
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-green-600 font-medium">Ativo</span>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-red-600 font-medium">Inativo</span>
                    </>
                  )}
                </div>
                <Switch
                  id="active"
                  checked={formData.active}
                  onCheckedChange={(checked: boolean) =>
                    setFormData({ ...formData, active: checked })
                  }
                />
              </div>
            </div>
          </div>
          {/* Seção: Material (busca via dialog) */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 pb-2 border-b">
              <div className="p-1.5 bg-accent/10 rounded-md">
                <Package className="h-4 w-4 text-accent-foreground" />
              </div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold text-foreground">
                  Material
                </h3>
                <Badge variant="outline" className="text-xs">
                  Buscar e selecionar
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="material" className="text-sm font-medium">
                Material
              </Label>
              <p className="text-xs text-muted-foreground">
                Clique em "Buscar material" para selecionar ou alterar o
                material deste endereçamento.
              </p>
              <Button
                type="button"
                variant="secondary"
                onClick={() => setMaterialDialogOpen(true)}
              >
                Buscar material
              </Button>
              {selectedMaterial ? (
                <div className="p-3 border rounded bg-muted/30 mt-2">
                  <div className="font-medium">
                    {selectedMaterial.code} - {selectedMaterial.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {selectedMaterial.description}
                  </div>
                </div>
              ) : (
                <div className="p-3 border rounded bg-muted/30 mt-2 text-xs text-muted-foreground">
                  Nenhum material selecionado.
                </div>
              )}
              <MaterialSearchDialog
                open={materialDialogOpen}
                onOpenChange={setMaterialDialogOpen}
                onSelect={(material: MaterialDetails) => {
                  setSelectedMaterial(material);
                  setFormData((prev: typeof formData) => ({
                    ...prev,
                    materialId: material.id,
                  }));
                }}
                selectedMaterial={selectedMaterial}
              />
            </div>
          </div>
          <DialogFooter className="flex flex-col sm:flex-row gap-3 pt-6 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="order-2 sm:order-1 w-full sm:w-auto"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="order-1 sm:order-2 w-full sm:w-auto"
            >
              {isPending ? 'Salvando...' : 'Salvar Alterações'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
