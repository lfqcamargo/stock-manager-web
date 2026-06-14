import { useQuery } from '@tanstack/react-query';
import { CheckCircle, MapPin, Package, Settings, XCircle } from 'lucide-react';
import type React from 'react';
import { useState } from 'react';

import { type MaterialDetails } from '@/api/stock/fetch-materials';
import { fetchPositions } from '@/api/stock/fetch-positions';
import { fetchRows } from '@/api/stock/fetch-rows';
import { fetchShelfs } from '@/api/stock/fetch-shelfs';
import { fetchSubLocations } from '@/api/stock/fetch-sub-locations';
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
import { useLocation } from '@/hooks/use-location';

interface CreateAddressingDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateAddressingDialog({
  open,
  onOpenChange,
}: CreateAddressingDialogProps) {
  const [formData, setFormData] = useState({
    materialId: '',
    locationId: '',
    subLocationId: '',
    rowId: '',
    shelfId: '',
    positionId: '',
    active: true,
  });

  // Estado para dialog de busca de material
  const [materialDialogOpen, setMaterialDialogOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] =
    useState<MaterialDetails | null>(null);

  const { useGetLocationsStats } = useLocation();
  const { data: locationsData } = useGetLocationsStats();

  const { data: subLocationsData } = useQuery({
    queryKey: ['subLocations', formData.locationId],
    queryFn: () => fetchSubLocations({ locationId: formData.locationId }),
    enabled: !!formData.locationId,
  });

  const { data: rowsData } = useQuery({
    queryKey: ['rows', formData.subLocationId],
    queryFn: () => fetchRows(),
    enabled: !!formData.subLocationId,
  });

  const { data: shelfsData } = useQuery({
    queryKey: ['shelfs', formData.rowId],
    queryFn: () => fetchShelfs(),
    enabled: !!formData.rowId,
  });

  const { data: positionsData } = useQuery({
    queryKey: ['positions', formData.shelfId],
    queryFn: () => fetchPositions(),
    enabled: !!formData.shelfId,
  });

  // const materials = materialsData?.materials || [];
  const locations = locationsData?.locations || [];
  const subLocations = subLocationsData?.sublocations || [];
  const rows = rowsData?.rows || [];
  const shelfs = shelfsData?.shelfs || [];
  const positions = positionsData?.positions || [];

  const { useCreateAddressing } = useAddressing();
  const { mutateAsync: createAddressingFn, isPending } = useCreateAddressing();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    await createAddressingFn({
      materialId: formData.materialId || undefined,
      locationId: formData.locationId,
      subLocationId: formData.subLocationId,
      rowId: formData.rowId,
      shelfId: formData.shelfId,
      positionId: formData.positionId,
      active: formData.active,
    });

    onOpenChange(false);

    // Reset form
    setFormData({
      materialId: '',
      locationId: '',
      subLocationId: '',
      rowId: '',
      shelfId: '',
      positionId: '',
      active: true,
    });
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
                Novo Endereçamento
              </DialogTitle>
              <DialogDescription className="text-muted-foreground">
                Vincule um material a uma localização específica no estoque.
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
                <Badge variant="secondary" className="text-xs">
                  Obrigatório
                </Badge>
              </div>
            </div>

            {/* Primeira linha - Local e Sub-local */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="location"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <span>Local</span>
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.locationId}
                  onValueChange={(value) => {
                    setFormData({
                      ...formData,
                      locationId: value,
                      subLocationId: '',
                      rowId: '',
                      shelfId: '',
                      positionId: '',
                    });
                    queryClient.invalidateQueries({
                      queryKey: ['subLocations'],
                    });
                  }}
                  required
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Selecione o local" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(locations) &&
                      locations
                        .filter(
                          (l) => typeof l.id === 'string' && l.id.trim() !== '',
                        )
                        .map((location) => (
                          <SelectItem key={location.id} value={location.id}>
                            {location.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="subLocation"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <span>Sub-Local</span>
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.subLocationId}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      subLocationId: value,
                      rowId: '',
                      shelfId: '',
                      positionId: '',
                    })
                  }
                  disabled={!formData.locationId}
                  required
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Selecione o sub-local" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(subLocations) &&
                      subLocations
                        .filter(
                          (sl) =>
                            typeof sl.id === 'string' && sl.id.trim() !== '',
                        )
                        .map((subLocation) => (
                          <SelectItem
                            key={subLocation.id}
                            value={subLocation.id}
                          >
                            {subLocation.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Segunda linha - Fileira e Prateleira */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="row"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <span>Fileira</span>
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.rowId}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      rowId: value,
                      shelfId: '',
                      positionId: '',
                    })
                  }
                  disabled={!formData.subLocationId}
                  required
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Selecione a fileira" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(rows) &&
                      rows
                        .filter(
                          (r) => typeof r.id === 'string' && r.id.trim() !== '',
                        )
                        .map((row) => (
                          <SelectItem key={row.id} value={row.id}>
                            {row.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="shelf"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <span>Prateleira</span>
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.shelfId}
                  onValueChange={(value) =>
                    setFormData({
                      ...formData,
                      shelfId: value,
                      positionId: '',
                    })
                  }
                  disabled={!formData.rowId}
                  required
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Selecione a prateleira" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(shelfs) &&
                      shelfs
                        .filter(
                          (s) => typeof s.id === 'string' && s.id.trim() !== '',
                        )
                        .map((shelf) => (
                          <SelectItem key={shelf.id} value={shelf.id}>
                            {shelf.name}
                          </SelectItem>
                        ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Terceira linha - Posição */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label
                  htmlFor="position"
                  className="text-sm font-medium flex items-center gap-2"
                >
                  <span>Posição</span>
                  <span className="text-red-500">*</span>
                </Label>
                <Select
                  value={formData.positionId}
                  onValueChange={(value) =>
                    setFormData({ ...formData, positionId: value })
                  }
                  disabled={!formData.shelfId}
                  required
                >
                  <SelectTrigger className="h-9 w-full">
                    <SelectValue placeholder="Selecione a posição" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.isArray(positions) &&
                      positions
                        .filter(
                          (p) => typeof p.id === 'string' && p.id.trim() !== '',
                        )
                        .map((position) => (
                          <SelectItem key={position.id} value={position.id}>
                            {position.name}
                          </SelectItem>
                        ))}
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
                  onCheckedChange={(checked) =>
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
                Clique em "Buscar material" para selecionar o material deste
                endereçamento.
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
                onSelect={(material) => {
                  setSelectedMaterial(material);
                  setFormData((prev) => ({ ...prev, materialId: material.id }));
                }}
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
              {isPending ? 'Criando...' : 'Criar Endereçamento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
