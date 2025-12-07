import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { executeQuery } from '@/lib/motherduck';
import type { AnalyticsSummary } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  const requestStart = performance.now();
  const storeId = parseInt(params.storeId);
  console.log(`[API /stores/${storeId}/analytics] Request started`);

  try {
    const sessionStart = performance.now();
    const session = await getSession();
    console.log(`[API /stores/${storeId}/analytics] Session retrieved in ${(performance.now() - sessionStart).toFixed(0)}ms`);

    if (!session || !session.user) {
      console.log(`[API /stores/${storeId}/analytics] Unauthorized - no session`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get analytics summary for the store
    const summaryQuery = `
      SELECT
        SUM(order_total) as total_revenue,
        COUNT(*) as total_orders,
        AVG(order_total) as average_order_value
      FROM orders
      WHERE store_id = ?
        AND order_status = 'completed'
        AND order_date >= CURRENT_DATE - INTERVAL '30 days'
    `;

    const summaryStart = performance.now();
    const summaryResult = await executeQuery(storeId, summaryQuery, [storeId]);
    console.log(`[API /stores/${storeId}/analytics] Summary query completed in ${(performance.now() - summaryStart).toFixed(0)}ms`);

    // Get revenue growth (compare last 30 days to previous 30 days)
    const growthQuery = `
      WITH current_period AS (
        SELECT SUM(order_total) as revenue
        FROM orders
        WHERE store_id = ?
          AND order_status = 'completed'
          AND order_date >= CURRENT_DATE - INTERVAL '30 days'
      ),
      previous_period AS (
        SELECT SUM(order_total) as revenue
        FROM orders
        WHERE store_id = ?
          AND order_status = 'completed'
          AND order_date >= CURRENT_DATE - INTERVAL '60 days'
          AND order_date < CURRENT_DATE - INTERVAL '30 days'
      )
      SELECT
        ((current_period.revenue - previous_period.revenue) / NULLIF(previous_period.revenue, 0) * 100) as growth_percentage
      FROM current_period, previous_period
    `;

    const growthStart = performance.now();
    const growthResult = await executeQuery(storeId, growthQuery, [storeId, storeId]);
    console.log(`[API /stores/${storeId}/analytics] Growth query completed in ${(performance.now() - growthStart).toFixed(0)}ms`);

    const summary: AnalyticsSummary = {
      totalRevenue: Number(summaryResult[0]?.total_revenue || 0),
      totalOrders: Number(summaryResult[0]?.total_orders || 0),
      averageOrderValue: Number(summaryResult[0]?.average_order_value || 0),
      revenueGrowth: Number(growthResult[0]?.growth_percentage || 0),
    };

    console.log(`[API /stores/${storeId}/analytics] Request completed in ${(performance.now() - requestStart).toFixed(0)}ms`);
    return NextResponse.json({ summary });
  } catch (error) {
    console.error(`[API /stores/${storeId}/analytics] Error after ${(performance.now() - requestStart).toFixed(0)}ms:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch analytics' },
      { status: 500 }
    );
  }
}
