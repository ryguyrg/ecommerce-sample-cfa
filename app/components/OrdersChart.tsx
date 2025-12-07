'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { OrdersChartData } from '@/types';

interface OrdersChartProps {
  data: OrdersChartData[];
}

export default function OrdersChart({ data }: OrdersChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="card">
      <h3>Orders Over Time (Last 90 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#A1A1A1" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#383838"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#383838"
          />
          <Tooltip
            contentStyle={{
              background: '#FFFFFF',
              border: '2px solid #383838',
              borderRadius: '2px',
            }}
          />
          <Legend />
          <Bar
            dataKey="orders"
            name="Orders"
            fill="#FFDE00"
            stroke="#383838"
            strokeWidth={1}
            radius={[2, 2, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
