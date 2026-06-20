import { z } from 'zod';

export const UnitMeasureEnum = z.enum([
  'UN', // Unidade
  'KG', // Quilograma
  'G', // Grama
  'MG', // Miligrama
  'TON', // Tonelada
  'L', // Litro
  'ML', // Mililitro
  'M', // Metro
  'CM', // Centímetro
  'MM', // Milímetro
  'M2', // Metro Quadrado
  'M3', // Metro Cúbico
  'CX', // Caixa
  'PC', // Peça
  'PCT', // Pacote
  'FD', // Fardo
  'BDJ', // Bandagem
  'RL', // Rolo
  'SC', // Saco
  'LT', // Lata
  'GAL', // Galão
  'JAR', // Jarro
  'TBL', // Tubo
  'KIT', // Kit
]);

export type UnitMeasure = z.infer<typeof UnitMeasureEnum>;
