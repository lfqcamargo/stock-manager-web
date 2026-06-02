import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useAuth } from '@/hooks/use-auth';

import { ConfirmAccountHeader } from './components/confirm-account-header';
import { ConfirmAccountStatus } from './components/confirm-account-status';

type Status = 'loading' | 'success' | 'error' | 'invalid';

export function ConfirmAccountPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const {
    confirmAccount: { confirmAccount },
  } = useAuth();

  const [status, setStatus] = useState<Status>(token ? 'loading' : 'invalid');
  const [confirmedEmail, setConfirmedEmail] = useState<string | undefined>();
  const hasRun = useRef(false);

  useEffect(() => {
    if (!token || hasRun.current) return;
    hasRun.current = true;

    confirmAccount(token)
      .then((data) => {
        setConfirmedEmail(data.email);
        setStatus('success');
      })
      .catch(() => setStatus('error'));
    // confirmAccount é estável (vem do provider), não precisa estar nas deps
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  return (
    <div className="space-y-6">
      <ConfirmAccountHeader />
      <ConfirmAccountStatus status={status} email={confirmedEmail} />
    </div>
  );
}
