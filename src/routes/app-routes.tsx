import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';

import { AppLayout } from '@/layouts/app-layout';
import { AddressingPage } from '@/pages/app/addressing/addressing/addressing-page';
import { LocationPage } from '@/pages/app/addressing/location/location-page';
import { PositionPage } from '@/pages/app/addressing/position/position-page';
import { RowPage } from '@/pages/app/addressing/row/row-page';
import { ShelfPage } from '@/pages/app/addressing/shelf/shelf-page';
import { SubLocationPage } from '@/pages/app/addressing/sub-location/sub-location-page';
import { DashboardPage } from '@/pages/app/dashboard/dashboard-page';
import { GroupPage } from '@/pages/app/material/group/group-page';
import { MaterialPage } from '@/pages/app/material/material-page';

export function AppRoutes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/material/group" element={<GroupPage />} />
        <Route path="/material/material" element={<MaterialPage />} />
        <Route path="/addressing/location" element={<LocationPage />} />
        <Route path="/addressing/sub-location" element={<SubLocationPage />} />
        <Route path="/addressing/row" element={<RowPage />} />
        <Route path="/addressing/shelf" element={<ShelfPage />} />
        <Route path="/addressing/position" element={<PositionPage />} />
        <Route path="/addressing/addressing" element={<AddressingPage />} />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace={true} />} />
    </RouterRoutes>
  );
}
