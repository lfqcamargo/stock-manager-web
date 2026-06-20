import type { Group } from '@/api/stock/fetch-groups';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface MaterialsFiltersProps {
  codeFilter: string;
  nameFilter: string;
  descriptionFilter: string;
  groupIdFilter: string;
  activeFilter: string;
  onUpdateSearchParams: (updates: Record<string, string | null>) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
  groups: Group[];
}

export function MaterialsFilters({
  codeFilter,
  nameFilter,
  descriptionFilter,
  groupIdFilter,
  activeFilter,
  onUpdateSearchParams,
  onClearFilters,
  hasFilters,
  groups,
}: MaterialsFiltersProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
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
      <Select
        value={groupIdFilter}
        onValueChange={(value) =>
          onUpdateSearchParams({ groupId: value === 'all' ? null : value })
        }
      >
        <SelectTrigger className="h-11">
          <SelectValue placeholder="Grupo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os grupos</SelectItem>
          {groups.map((group) => (
            <SelectItem key={group.id} value={group.id}>
              {group.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <div className="flex items-center gap-2">
        <Select
          value={activeFilter}
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
