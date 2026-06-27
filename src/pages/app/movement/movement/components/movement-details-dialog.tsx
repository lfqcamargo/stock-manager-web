import { Calendar, ClipboardEdit, Hash, MapPin } from 'lucide-react';

import type { Movement } from '@/api/stock/fetch-movements';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

interface MovementDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  movement: Movement;
  addressingLabel?: string;
  movementType?: { name: string; direction: 'IN' | 'OUT' };
}

export function MovementDetailsDialog({
  open,
  onOpenChange,
  movement,
  addressingLabel,
  movementType,
}: MovementDetailsDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Detalhes da Movimentação</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          {/* Endereçamento */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              Endereçamento
            </label>
            <Input
              value={addressingLabel ?? movement.addressingId}
              readOnly
              className="bg-muted"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* Tipo */}
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center gap-2">
                <ClipboardEdit className="w-4 h-4 text-muted-foreground" />
                Tipo de Movimentação
              </label>
              <Input
                value={
                  movementType
                    ? `${movementType.name} (${movementType.direction === 'IN' ? 'Entrada' : 'Saída'})`
                    : movement.movementTypeId
                }
                readOnly
                className="bg-muted"
              />
            </div>

            {/* Quantidade */}
            <div className="space-y-1">
              <label className="text-sm font-medium flex items-center gap-2">
                <Hash className="w-4 h-4 text-muted-foreground" />
                Quantidade
              </label>
              <Input
                value={movement.quantity}
                readOnly
                className="bg-muted"
              />
            </div>
          </div>

          {/* Data */}
          <div className="space-y-1">
            <label className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4 text-muted-foreground" />
              Data
            </label>
            <Input
              value={new Date(movement.date).toLocaleDateString('pt-BR')}
              readOnly
              className="bg-muted"
            />
          </div>

          {/* Observação */}
          <div className="space-y-1">
            <label className="text-sm font-medium">Observação</label>
            <Textarea
              value={movement.observation ?? ''}
              readOnly
              className="bg-muted resize-none min-h-[80px]"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
          >
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
