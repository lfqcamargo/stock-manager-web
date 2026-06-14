import { z } from 'zod';

export const resetPasswordSchema = z
  .object({
    password: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(6, 'Senha deve ter pelo menos 8 caracteres')
      .max(50, 'Senha deve ter no máximo 100 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export interface ResetPasswordActionData {
  token: string;
  password: string;
}

export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
