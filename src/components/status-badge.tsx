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
      className={status ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}
    >
      {status ? activeLabel : inactiveLabel}
    </Badge>
  );
}
