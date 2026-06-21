import { z } from 'zod';

import { UnitMeasureEnum } from '@/lib/unit-measure-enum';

export const EditMaterialSchema = z.object({
  groupId: z.string().uuid('Grupo inválido'),
  code: z.string().min(1, 'Código é obrigatório'),
  name: z.string().min(1, 'Nome é obrigatório'),
  description: z.string().optional(),
  unit: UnitMeasureEnum,
  active: z.boolean(),
  photoUrl: z.string().url('URL inválida').nullable().optional(),
});

export type EditMaterialFormData = z.infer<typeof EditMaterialSchema>;
