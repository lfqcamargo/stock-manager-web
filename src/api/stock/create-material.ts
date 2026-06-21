import { api } from '@/lib/axios';
import type { UnitMeasure } from '@/lib/unit-measure-enum';

export interface CreateMaterialRequest {
  groupId: string;
  code: string;
  name: string;
  description?: string;
  unit: UnitMeasure;
  active: boolean;
  photoUrl?: string | null;
}

export async function createMaterial({
  groupId,
  code,
  name,
  description,
  unit,
  active,
  photoUrl,
}: CreateMaterialRequest): Promise<void> {
  await api.post('/materials', {
    groupId,
    code,
    name,
    description,
    unit,
    active,
    photoUrl,
  });
}
