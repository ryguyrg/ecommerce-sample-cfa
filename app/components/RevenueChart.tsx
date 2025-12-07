'use client';

import { useState, useCallback, useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceArea } from 'recharts';
import type { RevenueChartData } from '@/types';

interface RevenueChartProps {
  data: RevenueChartData[];
}

export default function RevenueChart({ data }: RevenueChartProps) {
  const [refAreaLeft, setRefAreaLeft] = useState<string | null>(null);
  const [refAreaRight, setRefAreaRight] = useState<string | null>(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [selectedSum, setSelectedSum] = useState<number | null>(null);
  const [selectionIndices, setSelectionIndices] = useState<{ start: number; end: number } | null>(null);
  const [selectedRange, setSelectedRange] = useState<{ start: string; end: string } | null>(null);

  const formattedData = useMemo(() => data.map(item => ({
    ...item,
    formattedDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    originalDate: item.date,
  })), [data]);

  // Create data with selected revenue separated for highlighting
  const chartData = useMemo(() => {
    if (!selectionIndices) {
      return formattedData.map(item => ({
        ...item,
        selectedRevenue: null,
      }));
    }

    return formattedData.map((item, index) => ({
      ...item,
      selectedRevenue: index >= selectionIndices.start && index <= selectionIndices.end ? item.revenue : null,
    }));
  }, [formattedData, selectionIndices]);

  const handleMouseDown = useCallback((e: any) => {
    if (e && e.activeLabel) {
      setRefAreaLeft(e.activeLabel);
      setRefAreaRight(e.activeLabel);
      setIsSelecting(true);
      setSelectedSum(null);
      setSelectionIndices(null);
    }
  }, []);

  const handleMouseMove = useCallback((e: any) => {
    if (isSelecting && e && e.activeLabel) {
      setRefAreaRight(e.activeLabel);
    }
  }, [isSelecting]);

  const handleMouseUp = useCallback(() => {
    if (refAreaLeft && refAreaRight && isSelecting) {
      // Find indices of selected range
      const leftIndex = formattedData.findIndex(d => d.formattedDate === refAreaLeft);
      const rightIndex = formattedData.findIndex(d => d.formattedDate === refAreaRight);

      const startIndex = Math.min(leftIndex, rightIndex);
      const endIndex = Math.max(leftIndex, rightIndex);

      if (startIndex >= 0 && endIndex >= 0) {
        // Sum revenue in selected range
        const sum = formattedData
          .slice(startIndex, endIndex + 1)
          .reduce((acc, item) => acc + item.revenue, 0);
        setSelectedSum(sum);
        setSelectionIndices({ start: startIndex, end: endIndex });
        setSelectedRange({
          start: formattedData[startIndex].formattedDate,
          end: formattedData[endIndex].formattedDate,
        });
      }
    }
    setIsSelecting(false);
  }, [refAreaLeft, refAreaRight, isSelecting, formattedData]);

  const clearSelection = () => {
    setRefAreaLeft(null);
    setRefAreaRight(null);
    setSelectedSum(null);
    setSelectionIndices(null);
    setSelectedRange(null);
  };

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
        <h3 style={{ margin: 0 }}>Revenue Over Time (Last 90 Days)</h3>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', minHeight: '32px' }}>
          {selectedSum !== null ? (
            <>
              <span style={{
                background: '#FFDE00',
                border: '2px solid #383838',
                borderRadius: '2px',
                padding: '4px 12px',
                fontWeight: 600,
              }}>
                {selectedRange?.start === selectedRange?.end
                ? selectedRange?.start
                : `${selectedRange?.start} – ${selectedRange?.end}`}: ${selectedSum.toLocaleString()}
              </span>
              <button
                onClick={clearSelection}
                style={{
                  background: '#FFFFFF',
                  border: '2px solid #383838',
                  borderRadius: '2px',
                  padding: '4px 12px',
                  cursor: 'pointer',
                  fontWeight: 600,
                }}
              >
                Clear
              </button>
            </>
          ) : (
            <span style={{ visibility: 'hidden', padding: '4px 12px' }}>Placeholder</span>
          )}
        </div>
      </div>
      <p style={{ fontSize: '0.85rem', color: '#A1A1A1', marginBottom: '12px' }}>
        Click and drag to select a date range and sum revenue
      </p>
      <ResponsiveContainer width="100%" height={300} style={{ userSelect: 'none' }}>
        <LineChart
          data={chartData}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#A1A1A1" />
          <XAxis
            dataKey="formattedDate"
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
            dot={{ fill: '#2BA5FF', r: 3 }}
            activeDot={{ r: 6, fill: '#FFDE00', stroke: '#383838', strokeWidth: 2 }}
          />
          {selectionIndices && (
            <Line
              type="monotone"
              dataKey="selectedRevenue"
              name="Selected"
              stroke="#383838"
              strokeWidth={3}
              dot={{ fill: '#FFDE00', stroke: '#383838', strokeWidth: 2, r: 5 }}
              activeDot={{ r: 7, fill: '#FFDE00', stroke: '#383838', strokeWidth: 2 }}
              legendType="none"
              connectNulls={false}
            />
          )}
          {refAreaLeft && refAreaRight && (
            <ReferenceArea
              x1={refAreaLeft}
              x2={refAreaRight}
              strokeOpacity={0.3}
              fill="#FFDE00"
              fillOpacity={0.3}
            />
          )}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
