import { z } from 'zod';

import { validateCNPJ } from '@/utils/validate-cnpj';

export const signUpSchema = z
  .object({
    companyCnpj: z
      .string()
      .min(1, 'CNPJ é obrigatório')
      .max(18, 'CNPJ inválido')
      .transform((cnpj) => cnpj.replace(/\D/g, ''))
      .refine((cnpj) => cnpj.length === 14, {
        message: 'CNPJ deve ter exatamente 14 dígitos',
      })
      .refine((cnpj) => validateCNPJ(cnpj), {
        message: 'CNPJ inválido',
      }),

    companyName: z
      .string()
      .min(1, 'Nome da empresa é obrigatório')
      .min(3, 'Nome da empresa deve ter pelo menos 3 caracteres')
      .max(255, 'Nome da empresa deve ter no máximo 255 caracteres')
      .regex(
        /^[\p{L}0-9&.,\-()\s]+$/u,
        'Nome da empresa contém caracteres inválidos',
      )
      .transform((name) => name.trim().replace(/\s+/g, ' '))
      .transform((name) =>
        name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
      ),

    userName: z
      .string()
      .min(1, 'Nome do usuário é obrigatório')
      .min(3, 'Nome do usuário deve ter pelo menos 3 caracteres')
      .max(255, 'Nome do usuário deve ter no máximo 255 caracteres')
      .regex(
        /^[\p{L}]+([\p{L}\s']+)?$/u,
        'Nome do usuário deve conter apenas letras e espaços',
      )
      .transform((name) => name.trim().replace(/\s+/g, ' '))
      .transform((name) =>
        name.toLowerCase().replace(/\b\w/g, (c) => c.toUpperCase()),
      ),

    userEmail: z
      .email('Formato de email inválido')
      .min(5, 'Email deve ter pelo menos 5 caracteres')
      .max(255, 'Email deve ter no máximo 255 caracteres')
      .transform((email) => email.toLowerCase().trim()),

    userPassword: z
      .string()
      .min(1, 'Senha é obrigatória')
      .min(6, 'Senha deve ter pelo menos 8 caracteres')
      .max(50, 'Senha deve ter no máximo 100 caracteres'),
    confirmPassword: z.string().min(1, 'Confirmação de senha é obrigatória'),
  })
  .refine((data) => data.userPassword === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
