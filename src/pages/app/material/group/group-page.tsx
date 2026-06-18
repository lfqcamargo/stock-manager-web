import { ArrowLeft, Plus } from 'lucide-react';
import { useState } from 'react';
import { Link } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useGroup } from '@/hooks/use-group';

import { CreateGroupDialog } from './components/create-group-dialog';
import { GroupsTable } from './components/groups-table';

export function GroupPage() {
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  const { useDeleteGroup } = useGroup();
  const { mutateAsync: deleteGroupFn } = useDeleteGroup();

  async function handleDeleteGroup(id: string) {
    await deleteGroupFn({ id });
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
                Grupos de Material
              </h1>
              <p className="text-xs md:text-sm text-muted-foreground">
                Gerencie os grupos de material da sua empresa
              </p>
            </div>
          </div>
          <Button
            onClick={() => setIsAddDialogOpen(true)}
            className="rounded-lg md:rounded-xl shadow-md hover:shadow-lg transition-all duration-300 h-9 md:h-10 lg:h-11 w-full md:w-auto"
          >
            <Plus className="mr-2 h-4 w-4" />
            <span className="md:inline">Novo Grupo</span>
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg md:rounded-2xl border border-border/40 bg-card/50 backdrop-blur supports-backdrop-filter:bg-card/50 shadow-sm overflow-hidden">
        <GroupsTable
          onDelete={handleDeleteGroup}
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
        />
      </div>

      <CreateGroupDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
      />
    </div>
  );
}
