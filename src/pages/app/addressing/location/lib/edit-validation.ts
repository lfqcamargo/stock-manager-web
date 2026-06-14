import { z } from 'zod';

export const EditLocationSchema = z.object({
  code: z.string(),
  name: z.string().min(2, 'Nome é obrigatório'),
  description: z.string().optional(),
  active: z.boolean(),
});

export type EditLocationFormData = z.infer<typeof EditLocationSchema>;
