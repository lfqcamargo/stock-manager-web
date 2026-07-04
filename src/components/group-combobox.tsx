import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { useRef, useState } from 'react';

import type { Group } from '@/api/stock/fetch-groups';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface GroupComboboxProps {
  groups: Group[];
  value: string; // group id, or 'all' / '' for "no selection"
  onValueChange: (value: string) => void;
  placeholder?: string;
  allLabel?: string;
  /** When true, shows an "all groups" option (useful for filter contexts) */
  showAllOption?: boolean;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
}

export function GroupCombobox({
  groups,
  value,
  onValueChange,
  placeholder = 'Selecione um grupo',
  allLabel = 'Todos os grupos',
  showAllOption = false,
  className,
  triggerClassName,
  disabled = false,
}: GroupComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = groups.filter((g) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return g.name.toLowerCase().includes(q) || g.code.toLowerCase().includes(q);
  });

  const selectedGroup = groups.find((g) => g.id === value);

  const displayLabel =
    value === 'all' || value === ''
      ? showAllOption
        ? allLabel
        : placeholder
      : selectedGroup
        ? `${selectedGroup.code} — ${selectedGroup.name}`
        : placeholder;

  const isPlaceholder = !selectedGroup && (!showAllOption || value !== 'all');

  function handleSelect(id: string) {
    onValueChange(id);
    setSearch('');
    setOpen(false);
  }

  return (
    <Popover open={open} onOpenChange={(o) => {
      setOpen(o);
      if (o) {
        // reset search when opening
        setSearch('');
        // focus input after animation
        setTimeout(() => inputRef.current?.focus(), 50);
      }
    }}>
      <PopoverTrigger asChild disabled={disabled}>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            'w-full justify-between font-normal',
            isPlaceholder && 'text-muted-foreground',
            triggerClassName,
          )}
        >
          <span className="truncate">{displayLabel}</span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn('p-0', className)}
        style={{ width: 'var(--radix-popover-trigger-width)' }}
        align="start"
      >
        {/* Search input */}
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            ref={inputRef}
            placeholder="Buscar grupo..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
          />
        </div>

        {/* List */}
        <div className="max-h-60 overflow-y-auto">
          {showAllOption && (
            <button
              type="button"
              onClick={() => handleSelect('all')}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer',
                value === 'all' && 'bg-accent/50',
              )}
            >
              <Check
                className={cn('h-4 w-4', value === 'all' ? 'opacity-100' : 'opacity-0')}
              />
              {allLabel}
            </button>
          )}

          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
              Nenhum grupo encontrado.
            </p>
          ) : (
            filtered.map((group) => (
              <button
                key={group.id}
                type="button"
                onClick={() => handleSelect(group.id)}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer',
                  value === group.id && 'bg-accent/50',
                )}
              >
                <Check
                  className={cn(
                    'h-4 w-4 shrink-0',
                    value === group.id ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <span className="truncate">
                  {group.code} — {group.name}
                </span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
