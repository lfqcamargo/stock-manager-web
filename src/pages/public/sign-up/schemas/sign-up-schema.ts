import { z } from 'zod';

export const signUpSchema = z
  .object({
    name: z
      .string()
      .min(3, 'Name must be at least 3 characters')
      .max(255, 'Name must be at most 255 characters')
      .regex(
        /^[\p{L}]+([\p{L}\s']+)?$/u,
        'Name must contain only letters and spaces',
      )
      .transform((name) => name.trim().replace(/\s+/g, ' '))
      .transform((name) =>
        name
          .trim()
          .replace(/\s+/g, ' ')
          .toLowerCase()
          .replace(/\b\w/g, (c) => c.toUpperCase()),
      ),

    email: z
      .email({ message: 'Invalid email format' })
      .transform((email) => email.toLowerCase().trim()),

    password: z
      .string()
      .min(6, 'Password must be at least 6 characters')
      .max(100, 'Password must be at most 100 characters')
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        'Password must contain at least one uppercase letter, one lowercase letter, one number and one special character',
      ),
    confirmPassword: z
      .string()
      .min(6, 'Confirm password must be at least 6 characters'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas não coincidem',
    path: ['confirmPassword'],
  });

export type SignUpFormData = z.infer<typeof signUpSchema>;
