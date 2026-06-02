import { ForgotPasswordFooter } from './components/forgot-password-footer';
import { ForgotPasswordForm } from './components/forgot-password-form';
import { ForgotPasswordHeader } from './components/forgot-password-header';

export function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      <ForgotPasswordHeader />
      <ForgotPasswordForm />
      <ForgotPasswordFooter />
    </div>
  );
}
