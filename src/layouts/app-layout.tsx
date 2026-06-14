import {
  ChevronRight,
  ChevronsUpDown,
  Home,
  LayoutGrid,
  LogOut,
  Monitor,
  Moon,
  Package,
  Sun,
  Warehouse,
} from 'lucide-react';
import { Link, Outlet, useLocation } from 'react-router-dom';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
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
  SidebarMenuSubButton,
  SidebarProvider,
  SidebarRail,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuth } from '@/hooks/use-auth';
import { useTheme } from '@/hooks/use-theme';
import { cn } from '@/lib/utils';

function getInitials(name?: string) {
  if (!name) return '?';
  return name
    .split(' ')
    .slice(0, 2)
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

// Navigation items
const navItems: Array<
  | {
      title: string;
      items: Array<{
        label: string;
        icon: React.ElementType;
        href: string;
      }>;
    }
  | {
      title: string;
      icon: React.ElementType;
      items: Array<{
        label: string;
        icon: React.ElementType;
        href: string;
      }>;
    }
> = [
  {
    title: 'Main',
    items: [{ label: 'Dashboard', icon: Home, href: '/' }],
  },
  {
    title: 'Material',
    icon: Package,
    items: [
      { label: 'Group', icon: LayoutGrid, href: '/material/group' },
      { label: 'Material', icon: Package, href: '/material/material' },
    ],
  },
  {
    title: 'Addressing',
    icon: Warehouse,
    items: [
      { label: 'Location', icon: Warehouse, href: '/addressing/location' },
      {
        label: 'Sub Location',
        icon: LayoutGrid,
        href: '/addressing/sub-location',
      },
      { label: 'Row', icon: LayoutGrid, href: '/addressing/row' },
      { label: 'Shelf', icon: LayoutGrid, href: '/addressing/shelf' },
      { label: 'Position', icon: LayoutGrid, href: '/addressing/position' },
      { label: 'Addressing', icon: LayoutGrid, href: '/addressing/addressing' },
    ],
  },
];

export function AppLayout() {
  const { user, signOutMutation } = useAuth();
  const { theme, setTheme } = useTheme();
  const location = useLocation();

  function handleSignOut() {
    void signOutMutation.mutateAsync();
  }

  return (
    <SidebarProvider>
      <Sidebar collapsible="icon">
        {/* Header da sidebar — logo */}
        <SidebarHeader>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton size="lg" asChild>
                <Link to="/">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shrink-0">
                    <span className="text-sm font-bold">T</span>
                  </div>
                  <div className="flex flex-col leading-tight">
                    <span className="text-sm font-semibold">Template</span>
                    <span className="text-xs text-muted-foreground">React</span>
                  </div>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarHeader>

        {/* Navegação */}
        <SidebarContent>
          {navItems.map((group) => {
            const hasIcon = 'icon' in group;
            if (hasIcon) {
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
                            <group.icon />
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
                            return (
                              <SidebarMenuItem key={item.href}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive}
                                >
                                  <Link to={item.href}>
                                    <item.icon />
                                    <span>{item.label}</span>
                                  </Link>
                                </SidebarMenuSubButton>
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
                      return (
                        <SidebarMenuItem key={item.href}>
                          <SidebarMenuButton
                            asChild
                            isActive={isActive}
                            tooltip={item.label}
                          >
                            <Link to={item.href}>
                              <item.icon />
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
          })}
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
                      <AvatarFallback className="rounded-lg bg-primary text-primary-foreground text-xs">
                        {getInitials(user?.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col leading-tight text-left">
                      <span className="text-sm font-medium truncate">
                        {user?.name}
                      </span>
                      <span className="text-xs text-muted-foreground truncate">
                        {user?.email}
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
                    </div>
                  </DropdownMenuLabel>

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
    </SidebarProvider>
  );
}
