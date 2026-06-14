import { Plus, Search } from 'lucide-react';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useMovement } from '@/hooks/use-movement';

import { CreateMovementDialog } from './components/create-movement-dialog';
import { MovementsTable } from './components/movimentacoes-table';

export function MovementPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const { useCreateMovement } = useMovement();
  const { mutate: createMovementFn, isPending } = useCreateMovement();

  return (
    <div className="min-h-screen p-4 md:p-6 lg:p-8 space-y-6 md:space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
            Movimentações de Estoque
          </h1>
          <p className="text-sm md:text-base text-muted-foreground">
            Consulte e gerencie todas as movimentações do sistema
          </p>
        </div>
        <Button
          onClick={() => setIsAddDialogOpen(true)}
          className="shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
          size="lg"
        >
          <Plus className="mr-2 h-4 w-4 md:h-5 md:w-5" />
          Nova Movimentação
        </Button>
      </div>

      {/* Table Card */}
      <Card className="border-none shadow-xl bg-card/50 backdrop-blur-sm">
        <CardHeader className="border-b bg-muted/30 backdrop-blur-sm space-y-2 px-4 md:px-6 py-4 md:py-6">
          <CardTitle className="text-lg md:text-xl lg:text-2xl font-bold">
            Lista de Movimentações
          </CardTitle>
          <CardDescription className="text-xs md:text-sm">
            Visualize e gerencie todas as movimentações de estoque
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 md:p-6">
          <MovementsTable onDelete={() => {}} />
        </CardContent>
      </Card>

      <CreateMovementDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        onSubmit={(values) => {
          createMovementFn(values, {
            onSuccess: () => setIsAddDialogOpen(false),
          });
        }}
        isLoading={isPending}
      />
    </div>
  );
}
