'use client';

import { Button } from '@/components/ui/button';
import { useLogout } from '@/features/auth/api/use-logout';
import { useMe } from '@/features/auth/api/use-me';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const router = useRouter();
  const { data, isLoading } = useMe();
  const { mutate } = useLogout();

  useEffect(() => {
    if (!data && !isLoading) {
      router.push('/sign-in');
    }
  }, [data]);

  return (
    <p>
      Only visible to authorized users.
      <Button onClick={() => mutate()}>Log out</Button>
    </p>
  );
}
