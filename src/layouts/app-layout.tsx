import {
  Activity,
  ChevronRight,
  ChevronsUpDown,
  Home,
  LayoutGrid,
  LogOut,
  Monitor,
  Moon,
  Package,
  Sun,
  User,
  Users,
  Warehouse,
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Separator } from '@/components/ui/separator';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import { Skeleton } from '@/components/ui/skeleton';
import { useAuth } from '@/hooks/use-auth';
import { useCompany } from '@/hooks/use-company';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';
import { formatRole } from '@/utils/format-role';

function getInitials(name?: string) {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function getShortName(name?: string) {
  if (!name) return '';
  const parts = name.split(' ').filter((part) => part.trim().length > 0);
  if (parts.length <= 2) return name;
  return `${parts[0]} ${parts[parts.length - 1]}`;
}

// Navigation items
interface NavItem {
  label: string;
  icon: React.ElementType;
  href: string;
}

interface NavGroup {
  title: string;
  icon?: React.ElementType;
  items: NavItem[];
}

const navItems: NavGroup[] = [
  {
    title: 'Principal',
    icon: Home,
    items: [{ label: 'Painel', icon: Home, href: '/' }],
  },
  {
    title: 'Material',
    icon: Package,
    items: [
      { label: 'Grupos', icon: LayoutGrid, href: '/material/group' },
      { label: 'Materiais', icon: Package, href: '/material/material' },
    ],
  },
  {
    title: 'Endereçamento',
    icon: Warehouse,
    items: [
      { label: 'Localizações', icon: Warehouse, href: '/addressing/location' },
      {
        label: 'Sub-localizações',
        icon: LayoutGrid,
        href: '/addressing/sub-location',
      },
      { label: 'Fileiras', icon: LayoutGrid, href: '/addressing/row' },
      { label: 'Prateleiras', icon: LayoutGrid, href: '/addressing/shelf' },
      { label: 'Posições', icon: LayoutGrid, href: '/addressing/position' },
      { label: 'Endereços', icon: LayoutGrid, href: '/addressing/addressing' },
    ],
  },
  {
    title: 'Movimentação',
    icon: Activity,
    items: [
      { label: 'Movimentações', icon: Activity, href: '/movement/movement' },
      {
        label: 'Tipos de Movimento',
        icon: LayoutGrid,
        href: '/movement/movement-types',
      },
    ],
  },
  {
    title: 'Empresa',
    icon: Users,
    items: [
      { label: 'Empresa', icon: Users, href: '/company/profile' },
      { label: 'Usuários', icon: Users, href: '/company/users' },
    ],
  },
];

function AppLayoutContent() {
  const { user, signOutMutation } = useAuth();
  const { company, isLoading: isCompanyLoading } = useCompany();
  const { theme, setTheme } = useTheme();
  const location = useLocation();
  const { state } = useSidebar();

  function handleSignOut() {
    void signOutMutation.mutateAsync();
  }

  return (
    <>
      <Sidebar collapsible="icon">
        {/* Header da sidebar — company logo */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/">
                  {isCompanyLoading ? (
                    <>
                      <Skeleton className="h-8 w-8 rounded-lg" />
                      <div className="flex flex-col leading-tight">
                        <Skeleton className="h-4 w-16" />
                        <Skeleton className="h-3 w-12 mt-1" />
                      </div>
                    </>
                  ) : (
                    <>
                      <Avatar className="h-8 w-8 rounded-lg shrink-0">
                        <AvatarImage
                          src={company?.photo ?? ''}
                          alt={company?.name}
                        />
                        <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
                          {getInitials(company?.name)}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col leading-tight">
                        <span className="text-sm font-semibold">
                          {company?.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          Empresa
                        </span>
                      </div>
                    </>
                  )}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Navegação */}
        <SidebarContent>
          {state === 'collapsed' ? (
            // Quando a sidebar está recolhida, mostra todos os itens diretamente
            <SidebarGroup>
              <SidebarGroupContent>
                <SidebarMenu>
                  {navItems.flatMap((group) =>
                    group.items.map((item) => {
                      const isActive = location.pathname === item.href;
                      const ItemIcon = item.icon;
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={item.label}
                          >
                            <Link to={item.href}>
                              <ItemIcon />
                              <span>{item.label}</span>
                            </Link>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    }),
                  )}
                </SidebarMenu>
              </SidebarGroupContent>
            </SidebarGroup>
          ) : (
            // Quando a sidebar está expandida, mostra a estrutura original com grupos e colapsíveis
            navItems.map((group) => {
              const hasIcon = !!group.icon;
              if (hasIcon) {
                const GroupIcon = group.icon as React.ElementType;
                return (
                  <Collapsible
                    key={group.title}
                    defaultOpen
                    className="group/collapsible"
                  >
                    <SidebarGroup>
                      <SidebarGroupLabel
                        asChild
                        className="group/label p-0 text-foreground"
                      >
                        <CollapsibleTrigger asChild>
                          <SidebarMenuButton className="w-full justify-between">
                            <div className="flex items-center gap-2">
                              <GroupIcon />
                              <span>{group.title}</span>
                            </div>
                            <ChevronRight className="text-muted-foreground transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                          </SidebarMenuButton>
                        </CollapsibleTrigger>
                      </SidebarGroupLabel>

                      <CollapsibleContent>
                        <SidebarGroupContent>
                          <SidebarMenu>
                            {group.items.map((item) => {
                              const isActive = location.pathname === item.href;
                              const ItemIcon = item.icon;
                              return (
                                <SidebarMenuItem key={item.href}>
                                  <SidebarMenuButton
                                    asChild
                                    isActive={isActive}
                                    tooltip={item.label}
                                  >
                                    <Link to={item.href}>
                                      <ItemIcon />
                                      <span>{item.label}</span>
                                    </Link>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              );
                            })}
                          </SidebarMenu>
                        </SidebarGroupContent>
                      </CollapsibleContent>
                    </SidebarGroup>
                  </Collapsible>
                );
              }

              return (
                <SidebarGroup key={group.title}>
                  <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {group.items.map((item) => {
                        const isActive = location.pathname === item.href;
                        const ItemIcon = item.icon;
                        return (
                          <SidebarMenuItem key={item.href}>
                            <SidebarMenuButton
                              asChild
                              isActive={isActive}
                              tooltip={item.label}
                            >
                              <Link to={item.href}>
                                <ItemIcon />
                                <span>{item.label}</span>
                              </Link>
                            </SidebarMenuButton>
                          </SidebarMenuItem>
                        );
                      })}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              );
            })
          )}
        </SidebarContent>

        {/* Footer da sidebar — usuário */}
        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <SidebarMenuButton
                    size="lg"
                    className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                  >
                    <Avatar className="h-8 w-8 rounded-lg shrink-0">
                      <AvatarImage src={user?.photo ?? ''} alt={user?.name} />
                      <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight text-left">
                      <span className="text-sm font-medium truncate">
                        {getShortName(user?.name)}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user?.role ? formatRole(user.role) : user?.email}
                      </span>
                    </div>
                    <ChevronsUpDown className="ml-auto size-4 shrink-0" />
                  </SidebarMenuButton>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                  side="top"
                  align="end"
                  className="w-56"
                  sideOffset={4}
                >
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">
                        {user?.name}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground truncate">
                        {user?.email}
                      </p>
                      {user?.role && (
                        <p className="text-xs leading-none text-muted-foreground truncate">
                          {formatRole(user.role)}
                        </p>
                      )}
                    </div>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild className="cursor-pointer gap-2">
                    <Link to="/user/profile">
                      <User className="h-4 w-4" />
                      Meu Perfil
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  {/* Tema */}
                  <DropdownMenuItem
                    onClick={() => setTheme('light')}
                    className={cn(
                      'cursor-pointer gap-2',
                      theme === 'light' && 'font-medium text-primary',
                    )}
                  >
                    <Sun className="h-4 w-4" />
                    Tema claro
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme('dark')}
                    className={cn(
                      'cursor-pointer gap-2',
                      theme === 'dark' && 'font-medium text-primary',
                    )}
                  >
                    <Moon className="h-4 w-4" />
                    Tema escuro
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setTheme('system')}
                    className={cn(
                      'cursor-pointer gap-2',
                      theme === 'system' && 'font-medium text-primary',
                    )}
                  >
                    <Monitor className="h-4 w-4" />
                    Tema do sistema
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleSignOut}
                    className="cursor-pointer gap-2 text-destructive focus:text-destructive"
                  >
                    <LogOut className="h-4 w-4" />
                    Sair
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>

        <SidebarRail />
      </Sidebar>

      {/* Conteúdo principal */}
      <SidebarInset>
        {/* Topbar */}
        <header className="flex h-12 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <Separator orientation="vertical" className="h-4" />
          {/* Breadcrumb slot — pode ser expandido por página */}
          <span className="text-sm text-muted-foreground">
            {navItems
              .flatMap((g) => g.items)
              .find((i) => i.href === location.pathname)?.label ?? 'Página'}
          </span>
        </header>

        {/* Conteúdo da rota */}
        <div className="flex flex-1 flex-col gap-4 p-6">
          <Outlet />
        </div>
      </SidebarInset>
    </>
  );
}

export function AppLayout() {
  return (
    <SidebarProvider>
      <AppLayoutContent />
    </SidebarProvider>
  );
}
