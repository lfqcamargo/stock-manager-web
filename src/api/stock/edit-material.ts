import { api } from '@/lib/axios';
import type { UnitMeasure } from '@/lib/unit-measure-enum';

export interface EditMaterialRequest {
  id: string;
  groupId: string;
  code: string;
  name: string;
  description?: string;
  unit: UnitMeasure;
  active: boolean;
  photoUrl?: string | null;
}

export async function editMaterial({
  id,
  groupId,
  code,
  name,
  description,
  unit,
  active,
  photoUrl,
}: EditMaterialRequest): Promise<void> {
  await api.put(`/materials/${id}`, {
    groupId,
    code,
    name,
    description,
    unit,
    active,
    photoUrl,
  });
}
