import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useSubLocation } from '@/hooks/use-sub-location';

import { CreateSubLocationDialog } from './components/create-dialog';
import { SubLocationsTable } from './components/table';

export function SubLocationPage() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  const { useDeleteSubLocation } = useSubLocation();
  const { mutateAsync: deleteSubLocationFn } = useDeleteSubLocation();

  async function handleDelete(id: string) {
    await deleteSubLocationFn({ id });
  }

  return (
    <div className="flex-1 space-y-4 md:space-y-6">
      {/* Header */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 p-4 md:p-6 lg:p-8 shadow-sm">
        <div className="flex flex-col gap-4 md:gap-6 md:flex-row md:items-start md:justify-between">
          <div className="flex items-start gap-3 md:gap-4">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="h-9 w-9 md:h-10 md:w-10 rounded-lg md:rounded-xl shadow-sm hover:shadow transition-all duration-200"
            >
              <Link to="/">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="space-y-0.5 md:space-y-1">
              <h1 className="text-xl md:text-2xl lg:text-3xl font-bold tracking-tight">
                Sub-Localizações
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Gerencie as sub-localizações do seu estoque por localização
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-9 md:h-10 lg:h-11 w-full md:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="md:inline">Nova Sub-Localização</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-[backdrop-filter]:bg-card/50 shadow-sm overflow-hidden">
        <SubLocationsTable onDelete={handleDelete} />
      </div>

      {/* Dialogs */}
      <CreateSubLocationDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      />
    </div>
  );
}
