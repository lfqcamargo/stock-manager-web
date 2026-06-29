import { Activity, ArrowUpRight, Package, Warehouse } from 'lucide-react';
import { Link } from 'react-router-dom';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

const quickLinks = [
  {
    label: 'Novo Material',
    description: 'Cadastrar material no estoque',
    href: '/material/material',
    icon: Package,
    color: 'text-blue-500',
    bg: 'bg-blue-50 dark:bg-blue-950/40',
  },
  {
    label: 'Nova Localização',
    description: 'Adicionar ponto de armazenagem',
    href: '/addressing/location',
    icon: Warehouse,
    color: 'text-violet-500',
    bg: 'bg-violet-50 dark:bg-violet-950/40',
  },
  {
    label: 'Nova Movimentação',
    description: 'Registrar entrada ou saída',
    href: '/movement/movement',
    icon: Activity,
    color: 'text-emerald-500',
    bg: 'bg-emerald-50 dark:bg-emerald-950/40',
  },
];

export function QuickActions() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Ações rápidas</CardTitle>
        <CardDescription>Acesse as funções mais usadas</CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {quickLinks.map((link) => {
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              to={link.href}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-accent transition-colors group"
            >
              <div className={`rounded-lg p-2 ${link.bg} shrink-0`}>
                <Icon className={`h-4 w-4 ${link.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{link.label}</p>
                <p className="text-xs text-muted-foreground">{link.description}</p>
              </div>
              <ArrowUpRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
            </Link>
          );
        })}
      </CardContent>
    </Card>
  );
}
