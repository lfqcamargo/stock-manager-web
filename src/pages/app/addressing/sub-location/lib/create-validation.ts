import { z } from 'zod';

export const createSubLocationSchema = z.object({
  code: z.string().min(1, 'Código é obrigatório').max(50),
  name: z.string().min(3, 'Nome deve ter no mínimo 3 caracteres').max(255),
  locationId: z.string().min(1, 'Localização é obrigatória'),
  description: z.string().optional(),
});

export type CreateSubLocationFormData = z.infer<typeof createSubLocationSchema>;
