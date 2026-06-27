import { api } from '@/lib/axios';

export interface EditSubLocationRequest {
  id: string;
  code: string;
  name: string;
  locationId: string;
  description?: string | null;
}

export async function editSubLocation({
  id,
  code,
  name,
  locationId,
  description,
}: EditSubLocationRequest): Promise<void> {
  await api.put(`/sub-locations/${id}`, {
    code,
    name,
    locationId,
    description: description ?? null,
  });
}
