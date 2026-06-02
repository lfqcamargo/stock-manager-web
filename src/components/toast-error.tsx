import { AxiosError } from 'axios';
import { toast } from 'sonner';

interface AxiosErrorResponseData {
  statusCode: number;
  message: string;
  error: string;
  errors?: unknown;
}

export function ToastError(error: unknown) {
  if (error instanceof AxiosError) {
    const response = error.response;

    if (!response) {
      return toast.error(
        'Erro ao realizar procedimento. Sem resposta do servidor.',
      );
    }

    const data = response.data as AxiosErrorResponseData;
    const statusCode = response.status;

    if (statusCode === 400 && data.errors) {
      const errorMessage =
        typeof data.errors === 'object' && 'message' in data.errors
          ? String(data.errors.message)
          : 'Dados inválidos. Verifique os campos preenchidos.';
      return toast.error(errorMessage);
    }

    // Mapeamento de mensagens de erro conhecidas
    switch (data.message) {
      // Erros de autenticação (401)
      case 'Credentials are not valid.':
        return toast.error(
          'Credenciais inválidas. Verifique seu e-mail e senha.',
        );

      // Erros de não encontrado (404)
      case 'User not found.':
        return toast.error('Usuário não encontrado.');

      // Erros de conflito (409)
      case 'Email already exists.':
        return toast.error('Este e-mail já está cadastrado.');

      // Erros de token (400)
      case 'Resource token not found.':
        return toast.error('Token inválido ou não encontrado.');
      case 'Token expired.':
        return toast.error('Token expirado. Solicite um novo token.');

      // Erros de validação (400)
      case 'Validation failed':
        return toast.error('Dados inválidos. Verifique os campos preenchidos.');

      // Erro inesperado
      case 'Unexpected error':
        return toast.error(
          'Erro interno do servidor. Tente novamente mais tarde.',
        );

      default:
        // Se houver uma mensagem customizada, usa ela, senão usa mensagem genérica baseada no status code
        if (data.message) {
          return toast.error(data.message);
        }

        switch (statusCode) {
          case 400:
            return toast.error(
              'Requisição inválida. Verifique os dados enviados.',
            );
          case 401:
            return toast.error('Não autorizado. Faça login novamente.');
          case 403:
            return toast.error(
              'Acesso negado. Você não tem permissão para esta ação.',
            );
          case 404:
            return toast.error('Recurso não encontrado.');
          case 409:
            return toast.error('Conflito. O recurso já existe.');
          case 500:
            return toast.error(
              'Erro interno do servidor. Tente novamente mais tarde.',
            );
          default:
            return toast.error(
              'Erro ao realizar procedimento. Tente novamente.',
            );
        }
    }
  }

  return toast.error(
    'Erro ao realizar procedimento. Sem resposta do servidor.',
  );
}
