import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { executeQuery } from '@/lib/motherduck';
import type { CustomerLocation } from '@/types';

export async function GET(
  request: Request,
  { params }: { params: { storeId: string } }
) {
  const requestStart = performance.now();
  const storeId = parseInt(params.storeId);
  console.log(`[API /stores/${storeId}/locations] Request started`);

  try {
    const sessionStart = performance.now();
    const session = await getSession();
    console.log(`[API /stores/${storeId}/locations] Session retrieved in ${(performance.now() - sessionStart).toFixed(0)}ms`);

    if (!session || !session.user) {
      console.log(`[API /stores/${storeId}/locations] Unauthorized - no session`);
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get customer locations aggregated by city
    const query = `
      SELECT
        customer_lat as lat,
        customer_lng as lng,
        customer_city as city,
        customer_state as state,
        COUNT(*) as orderCount,
        SUM(order_total) as totalRevenue
      FROM orders
      WHERE store_id = ?
        AND order_status = 'completed'
        AND order_date >= CURRENT_DATE - INTERVAL '90 days'
      GROUP BY customer_lat, customer_lng, customer_city, customer_state
      ORDER BY totalRevenue DESC
      LIMIT 100
    `;

    const queryStart = performance.now();
    const results = await executeQuery<CustomerLocation>(storeId, query, [storeId]);
    console.log(`[API /stores/${storeId}/locations] Query completed in ${(performance.now() - queryStart).toFixed(0)}ms`);

    // Convert BigInt values to numbers for JSON serialization
    const serializedResults = results.map(row => ({
      ...row,
      orderCount: Number(row.orderCount),
      totalRevenue: Number(row.totalRevenue)
    }));

    console.log(`[API /stores/${storeId}/locations] Request completed in ${(performance.now() - requestStart).toFixed(0)}ms`);
    return NextResponse.json({ data: serializedResults });
  } catch (error) {
    console.error(`[API /stores/${storeId}/locations] Error after ${(performance.now() - requestStart).toFixed(0)}ms:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch location data' },
      { status: 500 }
    );
  }
}
