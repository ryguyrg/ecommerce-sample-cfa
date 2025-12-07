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
          <CartesianGrid strokeDasharray="3 3" stroke="#A1A1A1" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            stroke="#383838"
          />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#383838"
            tickFormatter={(value) => `$${value.toLocaleString()}`}
          />
          <Tooltip
            formatter={(value: number) => `$${value.toLocaleString()}`}
            contentStyle={{
              background: '#FFFFFF',
              border: '2px solid #383838',
              borderRadius: '2px',
            }}
          />
          <Legend />
          <Line
            type="monotone"
            dataKey="revenue"
            name="Revenue"
            stroke="#2BA5FF"
            strokeWidth={2}
            dot={{ fill: '#2BA5FF', r: 4 }}
            activeDot={{ r: 6, fill: '#FFDE00', stroke: '#383838', strokeWidth: 2 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
