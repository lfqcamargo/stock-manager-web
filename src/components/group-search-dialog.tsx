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
import type { Group } from '@/api/stock/fetch-groups';

interface GroupSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSelect: (group: Group) => void;
  selectedGroup?: Group | null;
}

// Mock data
const mockGroups: Group[] = [
  {
    id: '1',
    code: 'MAT001',
    name: 'Eletrônicos',
    description: 'Produtos eletrônicos',
    active: true,
    photoUrl: undefined,
  },
  {
    id: '2',
    code: 'MAT002',
    name: 'Móveis',
    description: 'Móveis para escritório',
    active: true,
    photoUrl: undefined,
  },
];

export function GroupSearchDialog({
  open,
  onOpenChange,
  onSelect,
  selectedGroup,
}: GroupSearchDialogProps) {
  const [search, setSearch] = useState('');
  const [groups] = useState<Group[]>(mockGroups);

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(search.toLowerCase()) ||
      g.code.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (open) setSearch('');
  }, [open]);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Selecionar Grupo</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Buscar grupo..."
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
            {filteredGroups.map((group) => (
              <TableRow
                key={group.id}
                className="cursor-pointer hover:bg-muted"
                onClick={() => onSelect(group)}
              >
                <TableCell>{group.code}</TableCell>
                <TableCell>{group.name}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {selectedGroup && (
          <div className="text-sm text-muted-foreground">
            Selecionado: {selectedGroup.name}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
