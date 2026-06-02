import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';

import { AppLayout } from '@/layouts/app-layout';
import { DashboardPage } from '@/pages/app/dashboard/dashboard-page';

export function AppRoutes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace={true} />} />
    </RouterRoutes>
  );
}
