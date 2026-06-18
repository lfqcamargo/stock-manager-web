import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

import { editCompany as editCompanyApi } from '@/api/company/edit-company';
import { getProfileCompany } from '@/api/company/get-profile';
import { ToastError } from '@/components/toast-error';

export const useCompany = () => {
  const queryClient = useQueryClient();

  const companyQuery = useQuery({
    queryKey: ['company', 'profile'],
    queryFn: getProfileCompany,
  });

  const editCompanyMutation = useMutation({
    mutationFn: editCompanyApi,
    onSuccess: () => {
      toast.success('Empresa atualizada com sucesso');
      void queryClient.invalidateQueries({ queryKey: ['company', 'profile'] });
    },
    onError: (error) => {
      ToastError(error);
    },
  });

  return {
    company: companyQuery.data ?? null,
    isLoading: companyQuery.isLoading,
    isError: companyQuery.isError,
    editCompanyMutation,
  };
};
