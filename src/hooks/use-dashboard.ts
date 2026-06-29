import { useQuery } from '@tanstack/react-query';

import { fetchDashboard } from '@/api/stock/fetch-dashboard';

export function useDashboard() {
  return useQuery({
    queryKey: ['dashboard'],
    queryFn: fetchDashboard,
    staleTime: 1000 * 60 * 2, // 2 minutes
    refetchInterval: 1000 * 60 * 5, // auto-refresh every 5 minutes
  });
}
