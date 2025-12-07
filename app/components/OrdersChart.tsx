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
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#718096"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#718096"
          />
          <Tooltip
            contentStyle={{
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
            }}
          />
          <Legend />
          <Bar
            dataKey="orders"
            name="Orders"
            fill="#764ba2"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
