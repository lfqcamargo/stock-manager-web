import { SignUpFooter } from './components/sign-up-footer';
import { SignUpForm } from './components/sign-up-form';
import { SignUpHeader } from './components/sign-up-header';

export function SignUpPage() {
  return (
    <div className="space-y-6">
      <SignUpHeader />
      <SignUpForm />
      <SignUpFooter />
    </div>
  );
}
