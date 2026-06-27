import { Navigate, Route, Routes as RouterRoutes } from 'react-router-dom';

import { AppLayout } from '@/layouts/app-layout';
import { AddressingPage } from '@/pages/app/addressing/addressing/addressing-page';
import { AddressingViewPage } from '@/pages/app/addressing/addressing/view/addressing-view-page';
import { LocationPage } from '@/pages/app/addressing/location/location-page';
import { LocationViewPage } from '@/pages/app/addressing/location/view/location-view-page';
import { PositionPage } from '@/pages/app/addressing/position/position-page';
import { PositionViewPage } from '@/pages/app/addressing/position/view/position-view-page';
import { RowPage } from '@/pages/app/addressing/row/row-page';
import { RowViewPage } from '@/pages/app/addressing/row/view/row-view-page';
import { ShelfPage } from '@/pages/app/addressing/shelf/shelf-page';
import { ShelfViewPage } from '@/pages/app/addressing/shelf/view/shelf-view-page';
import { SubLocationPage } from '@/pages/app/addressing/sub-location/sub-location-page';
import { SubLocationViewPage } from '@/pages/app/addressing/sub-location/view/sub-location-view-page';
import { CompanyProfilePage } from '@/pages/app/company/profile/company-profile-page';
import { UsersPage } from '@/pages/app/company/users/users-page';
import { DashboardPage } from '@/pages/app/dashboard/dashboard-page';
import { GroupPage } from '@/pages/app/material/group/group-page';
import { GroupViewPage } from '@/pages/app/material/group/view/group-view-page';
import { MaterialPage } from '@/pages/app/material/material-page';
import { MaterialViewPage } from '@/pages/app/material/view/material-view-page';
import { MovementPage } from '@/pages/app/movement/movement/movement-page';
import { MovementTypesPage } from '@/pages/app/movement/movement-types/movement-types-page';
import { UserProfilePage } from '@/pages/app/user/profile/user-profile-page';

export function AppRoutes() {
  return (
    <RouterRoutes>
      <Route path="/" element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="/material/group" element={<GroupPage />} />
        <Route path="/material/group/:id" element={<GroupViewPage />} />
        <Route path="/material/material" element={<MaterialPage />} />
        <Route path="/material/material/:id" element={<MaterialViewPage />} />
        <Route path="/addressing/location" element={<LocationPage />} />
        <Route path="/addressing/location/:id" element={<LocationViewPage />} />
        <Route path="/addressing/sub-location" element={<SubLocationPage />} />
        <Route path="/addressing/sub-location/:id" element={<SubLocationViewPage />} />
        <Route path="/addressing/row" element={<RowPage />} />
        <Route path="/addressing/row/:id" element={<RowViewPage />} />
        <Route path="/addressing/shelf" element={<ShelfPage />} />
        <Route path="/addressing/shelf/:id" element={<ShelfViewPage />} />
        <Route path="/addressing/position" element={<PositionPage />} />
        <Route path="/addressing/position/:id" element={<PositionViewPage />} />
        <Route path="/addressing/addressing" element={<AddressingPage />} />
        <Route path="/addressing/addressing/:id" element={<AddressingViewPage />} />
        <Route path="/company/users" element={<UsersPage />} />
        <Route path="/company/profile" element={<CompanyProfilePage />} />
        <Route path="/user/profile" element={<UserProfilePage />} />
        <Route path="/movement/movement" element={<MovementPage />} />
        <Route
          path="/movement/movement-types"
          element={<MovementTypesPage />}
        />
      </Route>

      {/* Default redirect */}
      <Route path="*" element={<Navigate to="/" replace={true} />} />
    </RouterRoutes>
  );
}
