import { api } from '@/lib/axios';

import type { Row } from './fetch-rows';

export async function findRowById(id: string): Promise<Row> {
  const response = await api.get<Row>(`/rows/${id}`);
  return response.data;
}
