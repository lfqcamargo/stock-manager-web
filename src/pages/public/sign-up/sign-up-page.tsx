import { Building, Package } from 'lucide-react';

import { SignUpForm } from './components/sign-up-form';

export function SignUpPage() {
  return (
    <div className="p-6 md:p-8">
      {/* Header */}
      <div className="mb-6 text-center md:mb-8">
        <div className="relative mx-auto mb-4 h-16 w-16 md:h-20 md:w-20">
          <div className="bg-primary flex h-16 w-16 items-center justify-center rounded-2xl shadow-lg md:h-20 md:w-20">
            <Building className="text-primary-foreground h-8 w-8 md:h-10 md:w-10" />
          </div>
          <div className="bg-chart-1 absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full md:h-6 md:w-6">
            <Package className="h-2.5 w-2.5 text-white md:h-3 md:w-3" />
          </div>
        </div>
        <h1 className="text-foreground mb-2 text-xl font-bold md:text-2xl">
          Criar Empresa
        </h1>
        <p className="text-muted-foreground text-sm md:text-base">
          Configure sua empresa e comece a controlar seu estoque
        </p>
      </div>

      {/* Form */}
      <SignUpForm />
    </div>
  );
}
