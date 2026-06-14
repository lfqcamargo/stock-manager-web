import { z } from 'zod';

export const EditSubLocationSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  description: z.string().optional(),
  locationId: z.string().min(1, 'Localização é obrigatória'),
});

export type EditSubLocationFormData = z.infer<typeof EditSubLocationSchema>;
