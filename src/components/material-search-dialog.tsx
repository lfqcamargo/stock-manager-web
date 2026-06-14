import { useEffect, useState } from 'react';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { MaterialDetails } from '@/api/stock/fetch-materials';

interface MaterialSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (material: MaterialDetails) => void;
  selectedMaterial?: MaterialDetails | null;
}

// Mock data
const mockMaterials: MaterialDetails[] = [
  {
    id: '1',
    code: 'MAT001',
    name: 'Teclado Mecânico',
    description: 'Teclado RGB para gaming',
    groupId: '1',
    groupName: 'Eletrônicos',
    unit: 'PC',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: '2',
    code: 'MAT002',
    name: 'Mouse Wireless',
    description: 'Mouse ergonômico sem fio',
    groupId: '1',
    groupName: 'Eletrônicos',
    unit: 'PC',
    active: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

export function MaterialSearchDialog({
  open,
  onOpenChange,
  onSelect,
  selectedMaterial,
}: MaterialSearchDialogProps) {
  const [search, setSearch] = useState('');
  const [materials] = useState<MaterialDetails[]>(mockMaterials);

  const filteredMaterials = materials.filter(
    (m) =>
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (open) setSearch('');
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Selecionar Material</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Buscar material..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Código</TableHead>
              <TableHead>Nome</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredMaterials.map((material) => (
              <TableRow
                key={material.id}
                className="cursor-pointer hover:bg-muted"
                onClick={() => onSelect(material)}
              >
                <TableCell>{material.code}</TableCell>
                <TableCell>{material.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedMaterial && (
          <div className="text-sm text-muted-foreground">
            Selecionado: {selectedMaterial.name}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
