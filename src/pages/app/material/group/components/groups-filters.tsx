import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface GroupsFiltersProps {
  codeFilter: string;
  nameFilter: string;
  descriptionFilter: string;
  activeFilter: string;
  onUpdateSearchParams: (updates: Record<string, string | null>) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
}

export function GroupsFilters({
  codeFilter,
  nameFilter,
  descriptionFilter,
  activeFilter,
  onUpdateSearchParams,
  onClearFilters,
  hasFilters,
}: GroupsFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <Input
        placeholder="Código"
        className="h-11"
        value={codeFilter}
        onChange={(e) => onUpdateSearchParams({ code: e.target.value || null })}
      />
      <Input
        placeholder="Nome"
        className="h-11"
        value={nameFilter}
        onChange={(e) => onUpdateSearchParams({ name: e.target.value || null })}
      />
      <Input
        placeholder="Descrição"
        className="h-11"
        value={descriptionFilter}
        onChange={(e) =>
          onUpdateSearchParams({ description: e.target.value || null })
        }
      />
      <div className="flex items-center gap-2">
        <Select
          value={activeFilter || 'all'}
          onValueChange={(value) =>
            onUpdateSearchParams({ active: value === 'all' ? null : value })
          }
        >
          <SelectTrigger className="h-11">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos</SelectItem>
            <SelectItem value="true">Ativo</SelectItem>
            <SelectItem value="false">Inativo</SelectItem>
          </SelectContent>
        </Select>
        {hasFilters && (
          <Button variant="ghost" size="sm" onClick={onClearFilters}>
            Limpar
          </Button>
        )}
      </div>
    </div>
  );
}
