import { NextResponse } from 'next/server';
import { getSession } from '@/lib/auth';
import { getUserStores } from '@/lib/motherduck';

export async function GET() {
  const requestStart = performance.now();
  console.log('[API /stores] Request started');

  try {
    const sessionStart = performance.now();
    const session = await getSession();
    console.log(`[API /stores] Session retrieved in ${(performance.now() - sessionStart).toFixed(0)}ms`);

    if (!session || !session.user) {
      console.log('[API /stores] Unauthorized - no session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user's email from session
    const userEmail = session.user.email;

    if (!userEmail) {
      console.log('[API /stores] No email in session');
      return NextResponse.json({ error: 'No email in session' }, { status: 400 });
    }

    // Fetch stores the user has access to
    const storesStart = performance.now();
    const stores = await getUserStores(userEmail);
    console.log(`[API /stores] Stores fetched in ${(performance.now() - storesStart).toFixed(0)}ms`);

    console.log(`[API /stores] Request completed in ${(performance.now() - requestStart).toFixed(0)}ms`);
    return NextResponse.json({ stores });
  } catch (error) {
    console.error(`[API /stores] Error after ${(performance.now() - requestStart).toFixed(0)}ms:`, error);
    return NextResponse.json(
      { error: 'Failed to fetch stores' },
      { status: 500 }
    );
  }
}
