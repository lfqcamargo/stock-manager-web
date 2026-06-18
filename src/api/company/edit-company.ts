import { api } from '@/lib/axios';

export interface EditCompanyBody {
  name?: string;
  photo?: string | null;
}

export async function editCompany(data: EditCompanyBody): Promise<void> {
  await api.put('/companies', data);
}
