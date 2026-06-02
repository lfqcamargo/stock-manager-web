import { z } from 'zod';

export const forgotPasswordSchema = z.object({
  email: z
    .email({ message: 'E-mail inválido' })
    .transform((email) => email.toLowerCase().trim()),
});

export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
