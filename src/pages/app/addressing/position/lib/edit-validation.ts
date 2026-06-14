import { z } from 'zod';

export const EditPositionSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  description: z.string().optional(),
});

export type EditPositionFormData = z.infer<typeof EditPositionSchema>;
