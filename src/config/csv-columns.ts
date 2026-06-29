import type { CsvColumnDef } from '@/components/import-csv-dialog';

export const csvColumns = {
  groups: [
    { label: 'Código', field: 'code', required: true, example: 'FIX' },
    { label: 'Nome', field: 'name', required: true, example: 'Fixação' },
    {
      label: 'Descrição',
      field: 'description',
      required: false,
      example: 'Grupo de parafusos',
    },
    { label: 'Ativo', field: 'active', required: false, example: 'true' },
  ] satisfies CsvColumnDef[],

  locations: [
    { label: 'Código', field: 'code', required: true, example: 'LOC-A' },
    { label: 'Nome', field: 'name', required: true, example: 'Galpão A' },
    {
      label: 'Descrição',
      field: 'description',
      required: false,
      example: 'Galpão principal',
    },
  ] satisfies CsvColumnDef[],

  subLocations: [
    {
      label: 'Código da Localização',
      field: 'locationCode',
      required: true,
      example: 'LOC-A',
    },
    { label: 'Código', field: 'code', required: true, example: 'SL-01' },
    { label: 'Nome', field: 'name', required: true, example: 'Setor 01' },
    {
      label: 'Descrição',
      field: 'description',
      required: false,
      example: 'Setor de entrada',
    },
  ] satisfies CsvColumnDef[],

  rows: [
    { label: 'Código', field: 'code', required: true, example: 'FIL-01' },
    { label: 'Nome', field: 'name', required: true, example: 'Fileira 01' },
    {
      label: 'Descrição',
      field: 'description',
      required: false,
      example: 'Fileira principal',
    },
  ] satisfies CsvColumnDef[],

  shelfs: [
    { label: 'Código', field: 'code', required: true, example: 'PRA-01' },
    { label: 'Nome', field: 'name', required: true, example: 'Prateleira 01' },
    {
      label: 'Descrição',
      field: 'description',
      required: false,
      example: 'Primeira prateleira',
    },
  ] satisfies CsvColumnDef[],

  positions: [
    { label: 'Código', field: 'code', required: true, example: 'POS-01' },
    { label: 'Nome', field: 'name', required: true, example: 'Posição 01' },
    {
      label: 'Descrição',
      field: 'description',
      required: false,
      example: 'Posição A1',
    },
  ] satisfies CsvColumnDef[],

  addressings: [
    {
      label: 'Código da Localização',
      field: 'locationCode',
      required: true,
      example: 'LOC-A',
    },
    {
      label: 'Código da Sub-Localização',
      field: 'subLocationCode',
      required: true,
      example: 'SL-01',
    },
    {
      label: 'Código da Fileira',
      field: 'rowCode',
      required: true,
      example: 'FIL-01',
    },
    {
      label: 'Código da Prateleira',
      field: 'shelfCode',
      required: true,
      example: 'PRA-01',
    },
    {
      label: 'Código da Posição',
      field: 'positionCode',
      required: true,
      example: 'POS-01',
    },
    {
      label: 'Código do Material',
      field: 'materialCode',
      required: false,
      example: 'M001',
    },
    { label: 'Ativo', field: 'active', required: false, example: 'true' },
  ] satisfies CsvColumnDef[],

  movementTypes: [
    { label: 'Nome', field: 'name', required: true, example: 'Compra' },
    { label: 'Direção', field: 'direction', required: true, example: 'IN' },
  ] satisfies CsvColumnDef[],

  materials: [
    {
      label: 'Código do Grupo',
      field: 'groupCode',
      required: true,
      example: 'FIX',
    },
    { label: 'Código', field: 'code', required: true, example: 'M001' },
    { label: 'Nome', field: 'name', required: true, example: 'Parafuso M6' },
    { label: 'Unidade', field: 'unit', required: true, example: 'UN' },
    {
      label: 'Descrição',
      field: 'description',
      required: false,
      example: 'Parafuso sextavado M6x20',
    },
    { label: 'Ativo', field: 'active', required: false, example: 'true' },
  ] satisfies CsvColumnDef[],

  users: [
    { label: 'Nome', field: 'name', required: true, example: 'João Silva' },
    {
      label: 'E-mail',
      field: 'email',
      required: true,
      example: 'joao@empresa.com',
    },
    { label: 'Senha', field: 'password', required: true, example: 'Senha@123' },
    { label: 'Função', field: 'role', required: true, example: 'EMPLOYEE' },
    { label: 'Ativo', field: 'active', required: false, example: 'true' },
  ] satisfies CsvColumnDef[],
};
