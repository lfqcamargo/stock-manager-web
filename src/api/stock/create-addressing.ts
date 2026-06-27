import { api } from '@/lib/axios';

export interface CreateAddressingRequest {
  locationId: string;
  subLocationId: string;
  rowId: string;
  shelfId: string;
  positionId: string;
  materialId?: string;
  active?: boolean;
}

export async function createAddressing(
  data: CreateAddressingRequest,
): Promise<void> {
  await api.post('/addressings', { active: true, ...data });
}
