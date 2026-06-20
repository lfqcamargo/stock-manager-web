import { api } from '@/lib/axios';
import type { UnitMeasure } from '@/lib/unit-measure-enum';

export interface CreateMaterialRequest {
  groupId: string;
  code: string;
  name: string;
  description?: string;
  unit: UnitMeasure;
  active: boolean;
}

export async function createMaterial({
  groupId,
  code,
  name,
  description,
  unit,
  active,
}: CreateMaterialRequest): Promise<void> {
  await api.post('/materials', {
    groupId,
    code,
    name,
    description,
    unit,
    active,
  });
}
