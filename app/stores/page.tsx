'use client';

import { useEffect, useState } from 'react';
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import type { Store } from '@/types';

export default function StoresPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchStores();
    }
  }, [status, router]);

  const fetchStores = async () => {
    try {
      const response = await fetch('/api/stores');
      if (!response.ok) throw new Error('Failed to fetch stores');
      const data = await response.json();
      setStores(data.stores);
    } catch (err) {
      setError('Failed to load stores. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return <div className="loading">Loading...</div>;
  }

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="logo">Analytics Dashboard</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <span style={{ color: '#718096' }}>{session?.user?.name}</span>
            <button onClick={() => signOut()} className="btn btn-secondary">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <div className="container">
        <h1>Your Stores</h1>
        <p style={{ color: '#718096', marginBottom: '24px' }}>
          Select a store to view its analytics dashboard
        </p>

        {error && <div className="error">{error}</div>}

        {stores.length === 0 && !error && (
          <div className="card">
            <p>No stores found. Please contact your administrator for access.</p>
          </div>
        )}

        <div className="store-grid">
          {stores.map((store) => (
            <div
              key={store.store_id}
              className="store-card"
              onClick={() => router.push(`/dashboard/${store.store_id}`)}
            >
              <div className="store-name">{store.store_name}</div>
              {store.store_url && (
                <div className="store-url">{store.store_url}</div>
              )}
              <span className={`badge badge-${store.access_level || 'viewer'}`}>
                {store.access_level || 'viewer'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
