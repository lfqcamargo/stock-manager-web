import { z } from 'zod';

export const UnitMeasureEnum = z.enum([
  'UN', // Unitário
  'PC', // Peça
  'MT', // Metro
  'KG', // Kilograma
  'LT', // Litro
  'CX', // Caixa
  'FD', // Fardo
]);

export type UnitMeasure = z.infer<typeof UnitMeasureEnum>;
