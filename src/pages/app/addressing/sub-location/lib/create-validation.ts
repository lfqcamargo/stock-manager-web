import { z } from 'zod';

export const createSubLocationSchema = z.object({
  name: z
    .string()
    .min(1, 'Nome é obrigatório')
    .max(100, 'Nome deve ter no máximo 100 caracteres'),
  description: z
    .string()
    .max(500, 'Descrição deve ter no máximo 500 caracteres')
    .optional(),
  locationId: z.string().min(1, 'Localização é obrigatória'),
});

export type CreateSubLocationFormData = z.infer<typeof createSubLocationSchema>;
