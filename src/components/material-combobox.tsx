import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { useRef, useState } from 'react';

import type { MaterialDetails } from '@/api/stock/fetch-materials';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';

interface MaterialComboboxProps {
  materials: MaterialDetails[];
  value: string; // material id, or 'all' / '' for "no selection"
  onValueChange: (value: string) => void;
  onSearchChange?: (search: string) => void;
  isLoading?: boolean;
  placeholder?: string;
  allLabel?: string;
  /** When true, shows a "all materials" option (useful for filter contexts) */
  showAllOption?: boolean;
  /** When true, shows a "no material" option (useful for optional fields) */
  showNoneOption?: boolean;
  noneLabel?: string;
  className?: string;
  triggerClassName?: string;
  disabled?: boolean;
}

export function MaterialCombobox({
  materials,
  value,
  onValueChange,
  onSearchChange,
  isLoading = false,
  placeholder = 'Selecione um material',
  allLabel = 'Todos os materiais',
  showAllOption = false,
  showNoneOption = false,
  noneLabel = 'Sem material',
  className,
  triggerClassName,
  disabled = false,
}: MaterialComboboxProps) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = onSearchChange
    ? materials // já filtrado server-side
    : materials.filter((m) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return m.name.toLowerCase().includes(q) || m.code.toLowerCase().includes(q);
      });

  const selectedMaterial = materials.find((m) => m.id === value);

  const isAll = value === 'all';
  const isNone = value === 'none' || value === '';

  const displayLabel =
    isAll && showAllOption
      ? allLabel
      : isNone && showNoneOption
        ? noneLabel
        : selectedMaterial
          ? `${selectedMaterial.code} — ${selectedMaterial.name}`
          : placeholder;

  const isPlaceholder = !selectedMaterial && !isAll && !isNone;

  function handleSelect(id: string) {
    onValueChange(id);
    setSearch('');
    setOpen(false);
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
            placeholder="Buscar material..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              onSearchChange?.(e.target.value);
            }}
            className="h-9 border-0 bg-transparent p-0 shadow-none focus-visible:ring-0 placeholder:text-muted-foreground"
          />
          {isLoading && (
            <span className="ml-2 h-4 w-4 shrink-0 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
          )}
        </div>

        {/* List */}
        <div className="max-h-60 overflow-y-auto">
          {showAllOption && (
            <button
              type="button"
              onClick={() => handleSelect('all')}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer',
                isAll && 'bg-accent/50',
              )}
            >
              <Check className={cn('h-4 w-4', isAll ? 'opacity-100' : 'opacity-0')} />
              {allLabel}
            </button>
          )}

          {showNoneOption && (
            <button
              type="button"
              onClick={() => handleSelect('none')}
              className={cn(
                'flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer',
                (value === 'none' || value === '') && 'bg-accent/50',
              )}
            >
              <Check
                className={cn(
                  'h-4 w-4',
                  value === 'none' || value === '' ? 'opacity-100' : 'opacity-0',
                )}
              />
              {noneLabel}
            </button>
          )}

          {filtered.length === 0 ? (
            <p className="px-3 py-4 text-center text-sm text-muted-foreground">
              Nenhum material encontrado.
            </p>
          ) : (
            filtered.map((material) => (
              <button
                key={material.id}
                type="button"
                onClick={() => handleSelect(material.id)}
                className={cn(
                  'flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-accent hover:text-accent-foreground cursor-pointer',
                  value === material.id && 'bg-accent/50',
                )}
              >
                <Check
                  className={cn(
                    'h-4 w-4 shrink-0',
                    value === material.id ? 'opacity-100' : 'opacity-0',
                  )}
                />
                <span className="truncate">
                  {material.code} — {material.name}
                </span>
              </button>
            ))
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}
