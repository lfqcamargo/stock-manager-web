import { Outlet } from 'react-router-dom';

import { ModeToggle } from '@/components/ui/mode-toggle';
import { Separator } from '@/components/ui/separator';

export function PublicLayout() {
  return (
    <div className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="absolute top-0 right-0 left-0 z-10 flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          {/* Slot para logo — substitua pelo logo do projeto */}
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
            <span className="text-xs font-bold text-primary-foreground">T</span>
          </div>
          <span className="text-sm font-semibold text-foreground">
            Template
          </span>
        </div>
        <ModeToggle />
      </header>

      {/* Main */}
      <div className="flex min-h-screen">
        {/* Left panel — branding (desktop only) */}
        <div className="hidden lg:flex lg:w-1/2 flex-col justify-between bg-muted/40 border-r border-border px-12 py-20">
          <div />

          <div className="space-y-6">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Template React
              </p>
              <h1 className="text-4xl font-bold tracking-tight text-foreground leading-tight">
                Construa algo
                <br />
                <span className="text-primary">incrível.</span>
              </h1>
              <p className="text-muted-foreground text-base max-w-sm">
                Um ponto de partida sólido com autenticação, temas e estrutura
                pronta para escalar.
              </p>
            </div>

            <Separator className="w-12" />

            <ul className="space-y-3 text-sm text-muted-foreground">
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Autenticação completa (sign-in, sign-up, recuperação de senha)
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Tema claro / escuro com persistência
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                React Query + Axios configurados
              </li>
              <li className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                Componentes shadcn/ui prontos para uso
              </li>
            </ul>
          </div>

          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} Template React. Todos os direitos
            reservados.
          </p>
        </div>

        {/* Right panel — form */}
        <div className="flex flex-1 items-center justify-center px-6 py-24 lg:px-16">
          <div className="w-full max-w-sm">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}
