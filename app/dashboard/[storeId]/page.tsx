'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter, useParams } from 'next/navigation';
import dynamic from 'next/dynamic';
import RevenueChart from '@/app/components/RevenueChart';
import OrdersChart from '@/app/components/OrdersChart';
import type { AnalyticsSummary, RevenueChartData, OrdersChartData, CustomerLocation } from '@/types';

// Dynamically import the map component (client-side only)
const CustomerMap = dynamic(() => import('@/app/components/CustomerMap'), {
  ssr: false,
  loading: () => <div className="card"><div className="loading">Loading map...</div></div>,
});

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const params = useParams();
  const storeId = params.storeId as string;

  const [summary, setSummary] = useState<AnalyticsSummary | null>(null);
  const [revenueData, setRevenueData] = useState<RevenueChartData[]>([]);
  const [ordersData, setOrdersData] = useState<OrdersChartData[]>([]);
  const [locationsData, setLocationsData] = useState<CustomerLocation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/login');
    } else if (status === 'authenticated') {
      fetchAllData();
    }
  }, [status, storeId, router]);

  const fetchAllData = async () => {
    try {
      setLoading(true);

      // Fetch all data in parallel
      const [summaryRes, revenueRes, ordersRes, locationsRes] = await Promise.all([
        fetch(`/api/stores/${storeId}/analytics`),
        fetch(`/api/stores/${storeId}/revenue`),
        fetch(`/api/stores/${storeId}/orders`),
        fetch(`/api/stores/${storeId}/locations`),
      ]);

      if (!summaryRes.ok || !revenueRes.ok || !ordersRes.ok || !locationsRes.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const summaryData = await summaryRes.json();
      const revenueResult = await revenueRes.json();
      const ordersResult = await ordersRes.json();
      const locationsResult = await locationsRes.json();

      setSummary(summaryData.summary);
      setRevenueData(revenueResult.data);
      setOrdersData(ordersResult.data);
      setLocationsData(locationsResult.data);
    } catch (err) {
      setError('Failed to load dashboard data. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading || status === 'loading') {
    return <div className="loading">Loading dashboard...</div>;
  }

  if (error) {
    return (
      <div className="container">
        <div className="error">{error}</div>
        <button onClick={() => router.push('/stores')} className="btn btn-primary">
          Back to Stores
        </button>
      </div>
    );
  }

  return (
    <>
      <header className="header">
        <div className="header-content">
          <div className="logo">Analytics Dashboard</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <button onClick={() => router.push('/stores')} className="btn btn-secondary">
              ← Back to Stores
            </button>
            <span style={{ color: '#718096' }}>{session?.user?.name}</span>
          </div>
        </div>
      </header>

      <div className="container">
        <h1>Store Analytics</h1>

        {summary && (
          <div className="grid grid-2" style={{ marginBottom: '32px' }}>
            <div className="stat-card">
              <div className="stat-label">Total Revenue (30 days)</div>
              <div className="stat-value">${summary.totalRevenue.toLocaleString()}</div>
              <div className={`stat-change ${summary.revenueGrowth >= 0 ? 'positive' : 'negative'}`}>
                {summary.revenueGrowth >= 0 ? '↑' : '↓'} {Math.abs(summary.revenueGrowth).toFixed(1)}% vs previous period
              </div>
            </div>

            <div className="stat-card">
              <div className="stat-label">Total Orders (30 days)</div>
              <div className="stat-value">{summary.totalOrders.toLocaleString()}</div>
              <div className="stat-label">Avg Order Value: ${summary.averageOrderValue.toFixed(2)}</div>
            </div>
          </div>
        )}

        <div style={{ marginBottom: '24px' }}>
          <RevenueChart data={revenueData} />
        </div>

        <div style={{ marginBottom: '24px' }}>
          <OrdersChart data={ordersData} />
        </div>

        <div>
          <CustomerMap data={locationsData} />
        </div>
      </div>
    </>
  );
}
