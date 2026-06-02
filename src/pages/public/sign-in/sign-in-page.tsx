import { SignInFooter } from './components/sign-in-footer';
import { SignInForm } from './components/sign-in-form';
import { SignInHeader } from './components/sign-in-header';

export function SignInPage() {
  return (
    <div className="space-y-6">
      <SignInHeader />
      <SignInForm />
      <SignInFooter />
    </div>
  );
}
