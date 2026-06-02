import { BarChart3, Package } from 'lucide-react';

import { SignInForm } from './components/sign-in-form';

export function SignInPage() {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 text-center md:mb-8">
        <div className="relative mx-auto mb-4 h-16 w-16 md:h-20 md:w-20">
          <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg md:h-20 md:w-20">
            <Package className="text-primary-foreground h-8 w-8 md:h-10 md:w-10" />
          </div>
          <div className="bg-chart-1 absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full md:h-6 md:w-6">
            <BarChart3 className="h-2.5 w-2.5 text-white md:h-3 md:w-3" />
          </div>
        </div>
        <h1 className="text-foreground mb-2 text-xl font-bold md:text-2xl">
          Controle de Estoque
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Acesse sua conta para gerenciar seu inventário
        </p>
      </div>

      <SignInForm />
    </div>
  );
}
