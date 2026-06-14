import { z } from 'zod';

export const CreateLocationSchema = z.object({
  code: z.string(),
  name: z.string().min(2, 'Nome é obrigatório'),
  description: z.string().optional(),
  active: z.boolean(),
});

export type CreateLocationFormData = z.infer<typeof CreateLocationSchema>;
