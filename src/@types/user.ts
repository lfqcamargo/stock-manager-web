export interface User {
  id: string;
  name: string;
  email: string;
  role: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  active: boolean;
  photo?: string | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;

  companyId: string;
}
