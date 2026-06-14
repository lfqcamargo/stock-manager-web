import { z } from 'zod';

export const EditRowSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  description: z.string().optional(),
});

export type EditRowFormData = z.infer<typeof EditRowSchema>;
