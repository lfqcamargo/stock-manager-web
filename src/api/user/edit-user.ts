import { api } from '@/lib/axios';

export interface EditUserBody {
  name?: string;
  email?: string;
  role?: 'ADMIN' | 'MANAGER' | 'EMPLOYEE';
  active?: boolean;
  photo?: string | null;
  password?: string;
}

export async function editUser(id: string, data: EditUserBody): Promise<void> {
  await api.put(`/users/${id}`, data);
}
