import {
  BarChart3,
  Package,
  Settings,
  TrendingUp,
  Users,
  Warehouse,
} from 'lucide-react';
import { Outlet } from 'react-router-dom';

import { ModeToggle } from '@/components/ui/mode-toggle';

export function PublicLayout() {
  return (
    <div className="bg-background min-h-screen">
      {/* Background Pattern */}
      <div className="from-primary/5 via-background to-secondary/10 dark:from-primary/10 dark:via-background dark:to-secondary/20 absolute inset-0 bg-gradient-to-br">
        {/* Floating Icons - Mobile */}
        <div className="text-primary/15 dark:text-primary/25 absolute top-16 left-4 md:hidden">
          <Package className="h-6 w-6" />
        </div>
        <div className="text-chart-1/15 dark:text-chart-1/25 absolute top-32 right-6 md:hidden">
          <TrendingUp className="h-5 w-5" />
        </div>
        <div className="text-chart-2/15 dark:text-chart-2/25 absolute bottom-24 left-8 md:hidden">
          <BarChart3 className="h-5 w-5" />
        </div>

        {/* Floating Icons - Desktop */}
        <div className="text-primary/20 dark:text-primary/30 absolute top-20 left-10 hidden md:block">
          <Package className="h-8 w-8" />
        </div>
        <div className="text-chart-1/20 dark:text-chart-1/30 absolute top-40 right-16 hidden md:block">
          <TrendingUp className="h-6 w-6" />
        </div>
        <div className="text-chart-2/20 dark:text-chart-2/30 absolute bottom-32 left-20 hidden md:block">
          <BarChart3 className="h-7 w-7" />
        </div>
        <div className="text-chart-3/20 dark:text-chart-3/30 absolute top-60 left-1/3 hidden md:block">
          <Warehouse className="h-5 w-5" />
        </div>
        <div className="text-chart-4/20 dark:text-chart-4/30 absolute right-32 bottom-20 hidden md:block">
          <Users className="h-6 w-6" />
        </div>
        <div className="text-chart-5/20 dark:text-chart-5/30 absolute top-80 right-1/4 hidden md:block">
          <Settings className="h-5 w-5" />
        </div>
      </div>

      {/* Theme Toggle - Fixed Position */}
      <div className="fixed top-4 right-4 z-50">
        <ModeToggle />
      </div>

      {/* Layout Container */}
      <div className="relative flex min-h-screen items-center justify-center p-4">
        {/* Mobile Layout */}
        <div className="w-full max-w-md md:hidden">
          <div className="bg-card/95 border-border/50 rounded-2xl border p-6 shadow-2xl backdrop-blur-sm">
            <Outlet />
          </div>
        </div>

        {/* Desktop Layout */}
        <div className="hidden w-full max-w-6xl items-center justify-center gap-8 md:flex">
          {/* Left Side - Branding */}
          <div className="max-w-md flex-1">
            <div className="space-y-8">
              {/* Logo/Brand */}
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="bg-primary flex h-12 w-12 items-center justify-center rounded-xl shadow-lg">
                    <Package className="text-primary-foreground h-6 w-6" />
                  </div>
                  <div>
                    <h1 className="text-foreground text-2xl font-bold">
                      EstoquePro
                    </h1>
                    <p className="text-muted-foreground text-sm">
                      Sistema de Controle
                    </p>
                  </div>
                </div>
              </div>

              {/* Features */}
              <div className="space-y-6">
                <h2 className="text-foreground text-xl font-semibold">
                  Gerencie seu estoque com eficiência
                </h2>

                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="bg-chart-1/10 mt-1 flex h-8 w-8 items-center justify-center rounded-lg shadow-sm">
                      <Package className="text-chart-1 h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-medium">
                        Controle de Produtos
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Organize e gerencie seu inventário de forma inteligente
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-chart-2/10 mt-1 flex h-8 w-8 items-center justify-center rounded-lg shadow-sm">
                      <TrendingUp className="text-chart-2 h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-medium">
                        Relatórios Detalhados
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Acompanhe vendas, estoque baixo e movimentações
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <div className="bg-chart-3/10 mt-1 flex h-8 w-8 items-center justify-center rounded-lg shadow-sm">
                      <Users className="text-chart-3 h-4 w-4" />
                    </div>
                    <div>
                      <h3 className="text-foreground font-medium">
                        Gestão de Usuários
                      </h3>
                      <p className="text-muted-foreground text-sm">
                        Controle de acesso e permissões para sua equipe
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Stats */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                <div className="bg-card/50 border-border/20 rounded-lg border p-3 text-center shadow-sm">
                  <div className="text-chart-1 text-2xl font-bold">99%</div>
                  <div className="text-muted-foreground text-xs">Precisão</div>
                </div>
                <div className="bg-card/50 border-border/20 rounded-lg border p-3 text-center shadow-sm">
                  <div className="text-chart-2 text-2xl font-bold">24/7</div>
                  <div className="text-muted-foreground text-xs">
                    Disponível
                  </div>
                </div>
                <div className="bg-card/50 border-border/20 rounded-lg border p-3 text-center shadow-sm">
                  <div className="text-chart-3 text-2xl font-bold">1000+</div>
                  <div className="text-muted-foreground text-xs">Empresas</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Form */}
          <div className="max-w-md flex-1">
            <div className="bg-card/95 border-border/50 rounded-2xl border p-6 shadow-2xl backdrop-blur-sm">
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
