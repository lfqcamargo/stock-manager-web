import { QueryClient } from '@tanstack/react-query';

import { ToastError } from '@/components/toast-error';

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 0,
      gcTime: 0,
    },
    mutations: {
      onError: (error: unknown) => {
        ToastError(error);
      },
    },
  },
});
