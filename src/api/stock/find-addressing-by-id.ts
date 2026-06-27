import { api } from '@/lib/axios';

export interface AddressingById {
  id: string;
  amount: number;
  active: boolean;
  locationId: string;
  subLocationId: string;
  rowId: string;
  shelfId: string;
  positionId: string;
  materialId: string | null;
}

export async function findAddressingById(id: string): Promise<AddressingById> {
  const response = await api.get<AddressingById>(`/addressings/${id}`);
  return response.data;
}
