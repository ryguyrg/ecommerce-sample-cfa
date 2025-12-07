'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

export default function HomePage() {
  const router = useRouter();
  const { status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      router.push('/stores');
    } else if (status === 'unauthenticated') {
      router.push('/login');
    }
  }, [status, router]);

  return <div className="loading">Loading...</div>;
}
