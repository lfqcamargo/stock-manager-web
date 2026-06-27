import { z } from 'zod';

export const EditLocationSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório').max(50),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255),
  description: z.string().optional(),
});

export type EditLocationFormData = z.infer<typeof EditLocationSchema>;
