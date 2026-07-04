import { Check, ChevronsUpDown, Search, X } from 'lucide-react';
import { useRef, useState } from 'react';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

export interface ComboboxOption {
  id: string;
  code: string;
  name: string;
}

interface EntityComboboxProps {
  options: ComboboxOption[];
  value: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  searchPlaceholder?: string;
  emptyLabel?: string;
  /** Quando true, exibe opção "Todos" no topo e permite limpar seleção */
  clearable?: boolean;
  clearLabel?: string;
  disabled?: boolean;
  className?: string;
  triggerClassName?: string;
}

export function EntityCombobox({
  options,
  value,
  onValueChange,
  placeholder = 'Selecione...',
  searchPlaceholder = 'Buscar...',
  emptyLabel = 'Nenhum resultado.',
  clearable = true,
  clearLabel = 'Todos',
  disabled = false,
  className,
  triggerClassName,
}: EntityComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = options.filter((o) => {
    if (!search) return true;
    const q = search.toLowerCase();
    return o.name.toLowerCase().includes(q) || o.code.toLowerCase().includes(q);
  });

  const selected = options.find((o) => o.id === value);
  const displayLabel = selected ? `${selected.code} — ${selected.name}` : placeholder;
  const isPlaceholder = !selected;

  function handleSelect(id: string) {
    // Clique no item já selecionado = deseleciona
    if (id === value) {
      onValueChange('');
    } else {
      onValueChange(id);
    }
    setSearch('');
    setOpen(false);
  }

  function handleClear(e: React.MouseEvent) {
    e.stopPropagation();
    onValueChange('');
  }

  return (
    <Popover
      open={open}
      onOpenChange={(o) => {
        setOpen(o);
        if (o) {
          setSearch('');
          setTimeout(() => inputRef.current?.focus(), 50);
        }
      }}
    >
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
          <span className="flex items-center gap-1 shrink-0 ml-2">
            {selected && clearable && (
              <X
                className="h-3.5 w-3.5 opacity-50 hover:opacity-100"
                onClick={handleClear}
              />
            )}
            <ChevronsUpDown className="h-4 w-4 opacity-50" />
          </span>
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className={cn('p-0', className)}
        style={{ width: 'var(--radix-popover-trigger-width)' }}
        align="start"
      >
        {/* Search */}
        <div className="flex items-center border-b px-3">
          <Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
          <Input
            ref={inputRef}
            placeholder={searchPlaceholder}
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="h-9 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
          />
        </div>

        {/* List */}
        <div className="max-h-52 overflow-y-auto">
          {/* Opção "Todos" para limpar */}
          {clearable && !search && (
            <button
              type="button"
              onClick={() => handleSelect('')}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer text-muted-foreground',
                !value && 'bg-accent/50 text-foreground',
              )}
            >
              <Check className={cn('h-4 w-4 shrink-0', !value ? 'opacity-100' : 'opacity-0')} />
              {clearLabel}
            </button>
          )}

          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
              {emptyLabel}
            </p>
          ) : (
            filtered.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelect(option.id)}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer',
                  value === option.id && 'bg-accent/50',
                )}
              >
                <Check
                  className={cn(
                    'h-4 w-4 shrink-0',
                    value === option.id ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <span className="truncate">
                  {option.code} — {option.name}
                </span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
