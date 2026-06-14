import {
  Navigate,
  Route,
  Routes as RouterRoutes,
  useLocation,
} from 'react-router-dom';

import { PublicLayout } from '@/layouts/public-layout';
import { ConfirmationCreateCompanyAndUserPage } from '@/pages/public/confirmation-create-company-and-user/index';
import { ForgotPasswordPage } from '@/pages/public/forgot-password/forgot-password-page';
import { ResetPasswordPage } from '@/pages/public/reset-password/reset-password-page';
import { SignInPage } from '@/pages/public/sign-in/sign-in-page';
import { SignUpPage } from '@/pages/public/sign-up/sign-up-page';

function SignInPageWithKey() {
  const location = useLocation();
  return <SignInPage key={location.search} />;
}

export function PublicRoutes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<PublicLayout />}>
        <Route index element={<SignInPageWithKey />} />
        <Route path="sign-in" element={<SignInPageWithKey />} />
        <Route path="sign-up" element={<SignUpPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route
          path="exchange-password-for-token"
          element={<ResetPasswordPage />}
        />
        <Route
          path="confirmation-create-company-and-user"
          element={<ConfirmationCreateCompanyAndUserPage />}
        />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace={true} />} />
    </RouterRoutes>
  );
}
