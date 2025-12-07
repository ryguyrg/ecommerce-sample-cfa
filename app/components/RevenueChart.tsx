'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { RevenueChartData } from '@/types';

interface RevenueChartProps {
  data: RevenueChartData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const formattedData = data.map(item => ({
    ...item,
    date: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  return (
    <div className="card">
      <h3>Revenue Over Time (Last 90 Days)</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={formattedData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#718096"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#718096"
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            formatter={(value: number) => `$${value.toLocaleString()}`}
            contentStyle={{
              background: 'white',
              border: '1px solid #e0e0e0',
              borderRadius: '4px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#667eea"
            strokeWidth={2}
            dot={{ fill: '#667eea', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
