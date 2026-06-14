import { z } from 'zod';

export const EditShelfSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  description: z.string().optional(),
});

export type EditShelfFormData = z.infer<typeof EditShelfSchema>;
