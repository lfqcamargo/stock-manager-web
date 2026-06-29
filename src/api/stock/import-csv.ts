import { api } from '@/lib/axios';

export type ImportMode = 'ADD_NEW' | 'UPDATE_EXISTING' | 'RESET';

export type CsvEntity =
  | 'groups'
  | 'locations'
  | 'sub-locations'
  | 'rows'
  | 'shelfs'
  | 'positions'
  | 'addressings'
  | 'movement-types'
  | 'materials'
  | 'users';

export interface ImportCsvResult {
  imported: number;
  skipped: number;
}

/**
 * Uploads a CSV file for bulk import.
 * The file must already have the correct backend column names as headers.
 */
export async function importCsv(
  entity: CsvEntity,
  mode: ImportMode,
  file: File,
): Promise<ImportCsvResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post<ImportCsvResult>(
    `/csv/${entity}?mode=${mode}`,
    formData,
    {
      headers: { 'Content-Type': 'multipart/form-data' },
    },
  );

  return response.data;
}

/**
 * Uploads a CSV file after remapping PT-BR headers to the expected backend field names.
 * headerMap: { 'Código': 'code', 'Nome': 'name', ... }
 */
export async function importCsvWithHeaderMap(
  entity: CsvEntity,
  mode: ImportMode,
  file: File,
  headerMap: Record<string, string>,
): Promise<ImportCsvResult> {
  const text = await file.text();
  const remapped = remapCsvHeaders(text, headerMap);
  const blob = new Blob([remapped], { type: 'text/csv' });
  const remappedFile = new File([blob], file.name, { type: 'text/csv' });
  return importCsv(entity, mode, remappedFile);
}

/**
 * Replaces the first row (header) of a CSV string according to headerMap.
 * Unknown columns are kept as-is so the backend can report them.
 */
function remapCsvHeaders(
  csvText: string,
  headerMap: Record<string, string>,
): string {
  const normalized = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n');
  const lines = normalized.split('\n');
  if (lines.length === 0) return csvText;

  const headers = lines[0].split(',').map((h) => h.trim());
  const remappedHeaders = headers.map((h) => headerMap[h] ?? h);
  lines[0] = remappedHeaders.join(',');
  return lines.join('\n');
}
