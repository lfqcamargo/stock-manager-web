import type { Company } from '@/@types/company';
import { api } from '@/lib/axios';

export interface GetProfileCompanyResponse {
  company: Company;
}

export async function getProfileCompany(): Promise<Company> {
  const response = await api.get<GetProfileCompanyResponse>('/companies/me');
  return response.data.company;
}
