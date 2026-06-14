import { Calendar, ClipboardEdit, Hash, MapPin, Package } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

interface MovementDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movement: {
    material: { code: string; name: string };
    addressing: {
      location: { name: string };
      subLocation: { name: string };
      row: { name: string };
      shelf: { name: string };
      position: { name: string };
    };
    movementType: { name: string; direction: string };
    quantity: number;
    date: string;
    observation?: string | null;
  };
}

export function MovementDetailsDialog({
  open,
  onOpenChange,
  movement,
}: MovementDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>Detalhes da Movimentação</DialogTitle>
        </DialogHeader>
        <form className="space-y-10">
          {/* Material - linha separada */}
          <div>
            <label className="block text-lg font-medium mb-3 flex items-center gap-2">
              <Package className="w-6 h-6 text-muted-foreground" /> Material
            </label>
            <Input
              value={`${movement.material.code} - ${movement.material.name}`}
              readOnly
              className="bg-muted h-14 text-lg w-[900px] max-w-full px-6"
            />
          </div>
          {/* Endereçamento - linha separada */}
          <div>
            <label className="block text-lg font-medium mb-3 flex items-center gap-2">
              <MapPin className="w-6 h-6 text-muted-foreground" /> Endereçamento
            </label>
            <Input
              value={`${movement.addressing.location.name} / ${movement.addressing.subLocation.name} / ${movement.addressing.row.name} / ${movement.addressing.shelf.name} / ${movement.addressing.position.name}`}
              readOnly
              className="bg-muted h-14 text-lg w-[900px] max-w-full px-6"
            />
          </div>
          {/* Restante dos campos em grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <label className="block text-lg font-medium mb-3 flex items-center gap-2">
                <ClipboardEdit className="w-6 h-6 text-muted-foreground" /> Tipo
                de Movimentação
              </label>
              <Input
                value={`${movement.movementType.name} (${
                  movement.movementType.direction === 'IN'
                    ? 'Entrada'
                    : movement.movementType.direction === 'OUT'
                      ? 'Saída'
                      : 'Ajuste'
                })`}
                readOnly
                className="bg-muted h-14 text-lg w-[900px] max-w-full px-6"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-3 flex items-center gap-2">
                <Hash className="w-6 h-6 text-muted-foreground" /> Quantidade
              </label>
              <Input
                value={movement.quantity}
                readOnly
                className="bg-muted h-14 text-lg w-[900px] max-w-full px-6"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-3 flex items-center gap-2">
                <Calendar className="w-6 h-6 text-muted-foreground" /> Data
              </label>
              <Input
                value={new Date(movement.date).toLocaleDateString('pt-BR')}
                readOnly
                className="bg-muted h-14 text-lg w-[900px] max-w-full px-6"
              />
            </div>
          </div>
          <div>
            <label className="block text-lg font-medium mb-3 flex items-center gap-2">
              Observação
            </label>
            <Input
              value={movement.observation ?? ''}
              readOnly
              className="bg-muted h-14 text-lg w-[900px] max-w-full px-6"
            />
          </div>
          <div className="flex justify-end gap-6 mt-8">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="h-14 px-12 text-lg"
            >
              Fechar
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
