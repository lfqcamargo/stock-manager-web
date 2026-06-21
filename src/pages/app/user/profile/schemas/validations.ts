import { z } from 'zod';

export const updateProfileSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  photoUrl: z.string().nullable().optional(),
});

export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
