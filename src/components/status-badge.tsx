import { Badge } from '@/components/ui/badge';

interface StatusBadgeProps {
  status: boolean;
  activeLabel?: string;
  inactiveLabel?: string;
}

export function StatusBadge({
  status,
  activeLabel = 'Ativo',
  inactiveLabel = 'Inativo',
}: StatusBadgeProps) {
  return (
    <Badge
      variant={status ? 'default' : 'destructive'}
      className="text-xs"
    >
      {status ? activeLabel : inactiveLabel}
    </Badge>
  );
}
