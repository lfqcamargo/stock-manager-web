import { z } from 'zod';

export const CreatePositionSchema = z.object({
  code: z.string(),
  name: z.string().min(2, 'Nome é obrigatório'),
  description: z.string().optional(),
  active: z.boolean(),
});

export type CreatePositionFormData = z.infer<typeof CreatePositionSchema>;
