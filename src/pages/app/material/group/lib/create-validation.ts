import { z } from 'zod';

export const CreateGroupSchema = z.object({
  code: z.string(),
  name: z.string().min(2, 'Nome é obrigatório'),
  description: z.string().optional(),
  active: z.boolean(),
  photoUrl: z.string().url('URL inválida').nullable().optional(),
});

export type CreateGroupFormData = z.infer<typeof CreateGroupSchema>;
