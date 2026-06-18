import { z } from 'zod';

export const editUserSchema = z.object({
  name: z
    .string()
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(255, 'Nome deve ter no máximo 255 caracteres'),
  email: z.string().email('E-mail inválido'),
  role: z.enum(['ADMIN', 'MANAGER', 'EMPLOYEE']),
  active: z.boolean(),
  password: z
    .string()
    .min(6, 'Senha deve ter pelo menos 6 caracteres')
    .optional()
    .or(z.literal('')),
});

export type EditUserFormData = z.infer<typeof editUserSchema>;
