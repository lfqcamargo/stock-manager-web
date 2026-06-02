import { QueryClient } from '@tanstack/react-query';

import { ToastError } from '@/components/toast-error';

export const queryClient = new QueryClient({
  defaultOptions: {
    mutations: {
      onError: (error: unknown) => {
        ToastError(error);
      },
    },
  },
});
