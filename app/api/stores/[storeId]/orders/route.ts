import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { executeQuery } from '@/lib/motherduck';
import type { OrdersChartData } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  const requestStart = performance.now();
  const storeId = parseInt(params.storeId);
  console.log(`[API /stores/${storeId}/orders] Request started`);

  try {
    const sessionStart = performance.now();
    const session = await getSession();
    console.log(`[API /stores/${storeId}/orders] Session retrieved in ${(performance.now() - sessionStart).toFixed(0)}ms`);

    if (!session || !session.user) {
      console.log(`[API /stores/${storeId}/orders] Unauthorized - no session`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get order counts over time for the last 90 days
    const query = `
      SELECT
        revenue_date::VARCHAR as date,
        order_count as orders
      FROM daily_revenue
      WHERE store_id = ?
        AND revenue_date >= CURRENT_DATE - INTERVAL '90 days'
      ORDER BY revenue_date ASC
    `;

    const queryStart = performance.now();
    const results = await executeQuery<OrdersChartData>(storeId, query, [storeId]);
    console.log(`[API /stores/${storeId}/orders] Query completed in ${(performance.now() - queryStart).toFixed(0)}ms`);

    console.log(`[API /stores/${storeId}/orders] Request completed in ${(performance.now() - requestStart).toFixed(0)}ms`);
    return NextResponse.json({ data: results });
  } catch (error) {
    console.error(`[API /stores/${storeId}/orders] Error after ${(performance.now() - requestStart).toFixed(0)}ms:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch orders data' },
      { status: 500 }
    );
  }
}
