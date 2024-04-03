'use client';

import { useAuthContext } from '@/context-providers/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Page() {
  const router = useRouter();
  const { isLogged, isLoading } = useAuthContext();

  useEffect(() => {
    if (isLoading) return;

    if (!isLogged) {
      router.push('/login');
    } else {
      router.push('/home');
    }
  }, [isLogged, router, isLoading]);
}
