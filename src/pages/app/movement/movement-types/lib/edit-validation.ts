import { z } from 'zod';

export const EditMovementTypeSchema = z.object({
  name: z.string().min(2, 'Nome é obrigatório'),
  direction: z.enum(['IN', 'OUT'], { required_error: 'Direção é obrigatória' }),
});

export type EditMovementTypeFormData = z.infer<typeof EditMovementTypeSchema>;
