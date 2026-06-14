import { zodResolver } from '@hookform/resolvers/zod';
import { Building, Eye, EyeOff, Loader2, Lock, Mail, User } from 'lucide-react';
import { useState } from 'react';
import { useForm, useWatch } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { formatCNPJ } from '@/utils/validate-cnpj';

import { type SignUpFormData, signUpSchema } from '../schemas/validations';
import { TermsAndPrivacyModal } from './terms-and-privacy-modal';

export function SignUpForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const { signUpMutation } = useAuth();
  const isPending = signUpMutation.isPending;
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      companyCnpj: '',
      companyName: '',
      userName: '',
      userEmail: '',
      userPassword: '',
      confirmPassword: '',
    },
  });

  const [
    cnpjWatch,
    companyNameWatch,
    emailWatch,
    userNameWatch,
    passwordWatch,
    confirmPasswordWatch,
  ] = useWatch({
    control,
    name: [
      'companyCnpj',
      'companyName',
      'userEmail',
      'userName',
      'userPassword',
      'confirmPassword',
    ],
  });

  const activeButton = Boolean(
    cnpjWatch &&
    companyNameWatch &&
    emailWatch &&
    userNameWatch &&
    passwordWatch &&
    confirmPasswordWatch &&
    agreeTerms &&
    !isPending,
  );

  const cnpjField = register('companyCnpj');

  async function handleSignUp(data: SignUpFormData) {
    await signUpMutation.mutateAsync({
      companyCnpj: data.companyCnpj,
      companyName: data.companyName,
      userName: data.userName,
      userEmail: data.userEmail,
      userPassword: data.userPassword,
    });
    void navigate(`/?email=${encodeURIComponent(data.userEmail)}`);
  }

  function onFormSubmit(data: SignUpFormData) {
    void handleSignUp(data);
  }

  return (
    <form
      onSubmit={(e) => void handleSubmit(onFormSubmit)(e)}
      className="space-y-4 md:space-y-6"
    >
      {/* Cnpj */}
      <div className="space-y-2">
        <Label htmlFor="cnpj" className="text-foreground text-sm font-medium">
          CNPJ
        </Label>
        <div className="relative">
          <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform md:h-5 md:w-5" />
          <Input
            type="text"
            id="cnpj"
            className="h-10 pl-9 text-sm md:h-11 md:pl-10 md:text-base"
            placeholder="00.000.000/0000-00"
            disabled={isPending}
            {...cnpjField}
            onChange={(e) => {
              const formatted = formatCNPJ(e.target.value);
              e.target.value = formatted;
              void cnpjField.onChange(e);
            }}
            maxLength={18}
          />
        </div>
        {errors.companyCnpj && (
          <p className="text-destructive mb-2 pl-1 text-sm">
            {errors.companyCnpj.message}
          </p>
        )}
      </div>

      {/* Company */}
      <div className="space-y-2">
        <Label
          htmlFor="companyName"
          className="text-foreground text-sm font-medium"
        >
          Nome da empresa
        </Label>
        <div className="relative">
          <Building className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform md:h-5 md:w-5" />
          <Input
            type="text"
            id="companyName"
            className="h-10 pl-9 text-sm md:h-11 md:pl-10 md:text-base"
            placeholder="Nome da sua empresa"
            disabled={isPending}
            {...register('companyName')}
          />
        </div>
        {errors.companyName && (
          <p className="text-destructive mb-2 pl-1 text-sm">
            {errors.companyName.message}
          </p>
        )}
      </div>

      {/* Name */}
      <div className="space-y-2">
        <Label
          htmlFor="userName"
          className="text-foreground text-sm font-medium"
        >
          Nome completo
        </Label>
        <div className="relative">
          <User className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform md:h-5 md:w-5" />
          <Input
            type="text"
            id="userName"
            className="h-10 pl-9 text-sm md:h-11 md:pl-10 md:text-base"
            placeholder="Seu nome completo"
            disabled={isPending}
            {...register('userName')}
          />
        </div>
        {errors.userName && (
          <p className="text-destructive mb-2 pl-1 text-sm">
            {errors.userName.message}
          </p>
        )}
      </div>

      {/* Email */}
      <div className="space-y-2">
        <Label htmlFor="email" className="text-foreground text-sm font-medium">
          E-mail
        </Label>
        <div className="relative">
          <Mail className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform md:h-5 md:w-5" />
          <Input
            type="email"
            id="email"
            className="h-10 pl-9 text-sm md:h-11 md:pl-10 md:text-base"
            placeholder="seu@email.com"
            disabled={isPending}
            {...register('userEmail')}
          />
        </div>
        {errors.userEmail && (
          <p className="text-destructive mb-2 pl-1 text-sm">
            {errors.userEmail.message}
          </p>
        )}
      </div>

      {/* Password */}
      <div className="space-y-2">
        <Label
          htmlFor="password"
          className="text-foreground text-sm font-medium"
        >
          Senha
        </Label>
        <div className="relative">
          <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform md:h-5 md:w-5" />
          <Input
            type={showPassword ? 'text' : 'password'}
            id="password"
            className="h-10 pr-11 pl-9 text-sm md:h-11 md:pr-12 md:pl-10 md:text-base"
            placeholder="Mínimo 8 caracteres"
            disabled={isPending}
            {...register('userPassword')}
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform"
            disabled={isPending}
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <Eye className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </button>
        </div>
        {errors.userPassword && (
          <p className="text-destructive mb-2 pl-1 text-sm">
            {errors.userPassword.message}
          </p>
        )}
      </div>

      {/* Confirm Password */}
      <div className="space-y-2">
        <Label
          htmlFor="confirmPassword"
          className="text-foreground text-sm font-medium"
        >
          Confirmar senha
        </Label>
        <div className="relative">
          <Lock className="text-muted-foreground absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 transform md:h-5 md:w-5" />
          <Input
            type={showConfirmPassword ? 'text' : 'password'}
            id="confirmPassword"
            className="h-10 pr-11 pl-9 text-sm md:h-11 md:pr-12 md:pl-10 md:text-base"
            placeholder="Confirme sua senha"
            disabled={isPending}
            {...register('confirmPassword')}
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2 transform"
            disabled={isPending}
          >
            {showConfirmPassword ? (
              <EyeOff className="h-4 w-4 md:h-5 md:w-5" />
            ) : (
              <Eye className="h-4 w-4 md:h-5 md:w-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-destructive mb-2 pl-1 text-sm">
            {errors.confirmPassword.message}
          </p>
        )}
      </div>

      {/* Terms */}
      <div className="flex items-start space-x-2 text-sm">
        <Checkbox
          id="terms"
          checked={agreeTerms}
          onCheckedChange={() => setAgreeTerms(!agreeTerms)}
          className="mt-1"
          disabled={isPending}
        />
        <Label
          htmlFor="terms"
          className="text-foreground cursor-pointer"
          onClick={() => setAgreeTerms(!agreeTerms)}
        >
          Eu concordo com os{' '}
        </Label>
        <Label>
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowTermsModal(true);
            }}
            className="text-primary hover:text-primary/80 underline"
          >
            Termos de Uso
          </button>{' '}
          e{' '}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setShowTermsModal(true);
            }}
            className="text-primary hover:text-primary/80 underline"
          >
            Política de Privacidade
          </button>
        </Label>
      </div>

      {/* Sign Up Button */}
      <Button
        type="submit"
        className="bg-primary hover:bg-primary/90 text-primary-foreground h-10 w-full rounded-xl text-sm font-medium shadow-lg transition-all duration-200 hover:shadow-xl md:h-11 md:text-base"
        disabled={!activeButton}
      >
        {isPending ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Processando...
          </>
        ) : (
          'CADASTRAR'
        )}
      </Button>

      {/* Divider */}
      <div className="relative my-4 md:my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="border-border w-full border-t" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="bg-card text-muted-foreground px-2">ou</span>
        </div>
      </div>

      {/* Sign In Link */}
      <div className="text-center">
        <p className="text-muted-foreground text-sm md:text-base">
          Já tem uma conta?{' '}
          <Link
            to="/"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Fazer login
          </Link>
        </p>
      </div>

      {/* Terms and Privacy Modal */}
      <TermsAndPrivacyModal
        isOpen={showTermsModal}
        onClose={(accepted) => {
          setShowTermsModal(false);
          setAgreeTerms(accepted);
        }}
        agreeTerms={agreeTerms}
      />
    </form>
  );
}
