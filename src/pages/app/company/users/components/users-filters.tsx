import { Search } from 'lucide-react';
import type { DateRange } from 'react-day-picker';

import { Button } from '@/components/ui/button';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface UsersFiltersProps {
  nameFilter: string;
  emailFilter: string;
  roleFilter: string;
  activeFilter: string;
  dateRange: DateRange | undefined;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onUpdateSearchParams: (updates: Record<string, string | null>) => void;
  onClearFilters: () => void;
  hasFilters: boolean;
}

export function UsersFilters({
  nameFilter,
  emailFilter,
  roleFilter,
  activeFilter,
  dateRange,
  onDateRangeChange,
  onUpdateSearchParams,
  onClearFilters,
  hasFilters,
}: UsersFiltersProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Nome do usuário..."
          className="pl-10 h-10"
          value={nameFilter}
          onChange={(e) =>
            onUpdateSearchParams({ name: e.target.value || null })
          }
        />
      </div>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="E-mail..."
          className="pl-10 h-10"
          value={emailFilter}
          onChange={(e) =>
            onUpdateSearchParams({ email: e.target.value || null })
          }
        />
      </div>
      <Select
        value={roleFilter}
        onValueChange={(value) =>
          onUpdateSearchParams({ role: value === 'all' ? null : value })
        }
      >
        <SelectTrigger className="h-10">
          <SelectValue placeholder="Todos os cargos" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os cargos</SelectItem>
          <SelectItem value="ADMIN">Administrador</SelectItem>
          <SelectItem value="MANAGER">Gerente</SelectItem>
          <SelectItem value="EMPLOYEE">Funcionário</SelectItem>
        </SelectContent>
      </Select>
      <Select
        value={activeFilter}
        onValueChange={(value) =>
          onUpdateSearchParams({ active: value === 'all' ? null : value })
        }
      >
        <SelectTrigger className="h-10">
          <SelectValue placeholder="Todos os status" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos os status</SelectItem>
          <SelectItem value="true">Ativo</SelectItem>
          <SelectItem value="false">Inativo</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center gap-2 col-span-1 xl:col-span-2">
        <DateRangePicker
          date={dateRange}
          onDateChange={onDateRangeChange}
          placeholder="Selecione o período"
          className="h-10 flex-1"
        />
        {hasFilters && (
          <Button
            variant="ghost"
            size="icon"
            onClick={onClearFilters}
            className="h-10 w-10 flex-shrink-0"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="lucide lucide-x"
            >
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </svg>
          </Button>
        )}
      </div>
    </div>
  );
}
