export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  active: boolean;
  photo?: string | null;
  createdAt: string;
  updatedAt: string;
  lastLogin: string | null;

  companyId: string;
}
