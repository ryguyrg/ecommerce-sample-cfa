import * as duckdb from 'duckdb';

// Connection pool configuration
const IDLE_TIMEOUT_MS = 3 * 60 * 1000; // 3 minutes of inactivity before closing

interface PooledConnection {
  db: duckdb.Database;
  storeId: number;
  lastUsed: number;
  timeoutId: NodeJS.Timeout | null;
  connecting: Promise<duckdb.Database> | null;
}

// Store connections by storeId
const connectionPool = new Map<number, PooledConnection>();

/**
 * Reset the idle timeout for a connection
 */
function resetIdleTimeout(pooled: PooledConnection): void {
  if (pooled.timeoutId) {
    clearTimeout(pooled.timeoutId);
  }

  pooled.lastUsed = Date.now();
  pooled.timeoutId = setTimeout(() => {
    closeConnection(pooled.storeId);
  }, IDLE_TIMEOUT_MS);
}

/**
 * Close and remove a connection from the pool
 */
function closeConnection(storeId: number): void {
  const pooled = connectionPool.get(storeId);
  if (pooled) {
    console.log(`[MotherDuck] Closing idle connection for store ${storeId} (inactive for ${IDLE_TIMEOUT_MS / 1000}s)`);
    if (pooled.timeoutId) {
      clearTimeout(pooled.timeoutId);
    }
    pooled.db.close();
    connectionPool.delete(storeId);
  }
}

/**
 * Create a new connection to a store's MotherDuck database
 */
function createConnection(storeId: number): Promise<duckdb.Database> {
  const startTime = performance.now();
  console.log(`[MotherDuck] Connecting to store ${storeId}...`);

  const tokenEnvVar = `STORE_${storeId}_TOKEN`;
  const token = process.env[tokenEnvVar];

  if (!token) {
    throw new Error(`MotherDuck token not found for store ${storeId}. Please set ${tokenEnvVar} in your environment.`);
  }

  const connectionString = `md:store_${storeId}?motherduck_token=${token}`;

  return new Promise((resolve, reject) => {
    const db = new duckdb.Database(connectionString, (err) => {
      const elapsed = (performance.now() - startTime).toFixed(0);
      if (err) {
        console.error(`[MotherDuck] Connection to store ${storeId} failed after ${elapsed}ms: ${err.message}`);
        reject(new Error(`Failed to connect to MotherDuck for store ${storeId}: ${err.message}`));
      } else {
        console.log(`[MotherDuck] Connected to store ${storeId} in ${elapsed}ms`);
        resolve(db);
      }
    });
  });
}

/**
 * Get a connection to a specific store's MotherDuck database from the pool
 * Reuses existing connections and creates new ones as needed
 * @param storeId - The ID of the store
 * @returns Promise<duckdb.Database>
 */
export async function getStoreConnection(storeId: number): Promise<duckdb.Database> {
  const existing = connectionPool.get(storeId);

  // If we have an existing connection, reset timeout and return it
  if (existing && !existing.connecting) {
    console.log(`[MotherDuck] Reusing pooled connection for store ${storeId}`);
    resetIdleTimeout(existing);
    return existing.db;
  }

  // If a connection is currently being established, wait for it
  if (existing?.connecting) {
    console.log(`[MotherDuck] Waiting for pending connection for store ${storeId}`);
    return existing.connecting;
  }

  // Create a new connection
  const pooled: PooledConnection = {
    db: null as any,
    storeId,
    lastUsed: Date.now(),
    timeoutId: null,
    connecting: null,
  };

  // Store the promise immediately to prevent duplicate connections
  pooled.connecting = createConnection(storeId);
  connectionPool.set(storeId, pooled);

  try {
    pooled.db = await pooled.connecting;
    pooled.connecting = null;
    resetIdleTimeout(pooled);
    return pooled.db;
  } catch (error) {
    // Remove from pool on failure
    connectionPool.delete(storeId);
    throw error;
  }
}

/**
 * Execute a query on a store's database
 * @param storeId - The ID of the store
 * @param query - SQL query to execute
 * @param params - Optional query parameters
 * @returns Promise with query results
 */
export async function executeQuery<T = any>(
  storeId: number,
  query: string,
  params?: any[]
): Promise<T[]> {
  const totalStartTime = performance.now();
  const queryPreview = query.replace(/\s+/g, ' ').trim().slice(0, 80);
  console.log(`[MotherDuck] Executing query for store ${storeId}: ${queryPreview}...`);

  const db = await getStoreConnection(storeId);
  const queryStartTime = performance.now();

  return new Promise((resolve, reject) => {
    if (params && params.length > 0) {
      // Use prepare() and run() for parameterized queries
      const stmt = db.prepare(query);
      stmt.all(...params, (err: Error | null, rows: T[]) => {
        const queryElapsed = (performance.now() - queryStartTime).toFixed(0);
        const totalElapsed = (performance.now() - totalStartTime).toFixed(0);
        if (err) {
          console.error(`[MotherDuck] Query failed after ${totalElapsed}ms (query: ${queryElapsed}ms): ${err.message}`);
          reject(new Error(`Query execution failed: ${err.message}`));
        } else {
          console.log(`[MotherDuck] Query completed in ${totalElapsed}ms (connection: ${(queryStartTime - totalStartTime).toFixed(0)}ms, query: ${queryElapsed}ms, rows: ${rows.length})`);
          resolve(rows);
        }
        stmt.finalize();
        // Connection stays open in pool - don't close it
      });
    } else {
      // Use all() directly for non-parameterized queries
      db.all(query, (err: Error | null, rows: T[]) => {
        const queryElapsed = (performance.now() - queryStartTime).toFixed(0);
        const totalElapsed = (performance.now() - totalStartTime).toFixed(0);
        if (err) {
          console.error(`[MotherDuck] Query failed after ${totalElapsed}ms (query: ${queryElapsed}ms): ${err.message}`);
          reject(new Error(`Query execution failed: ${err.message}`));
        } else {
          console.log(`[MotherDuck] Query completed in ${totalElapsed}ms (connection: ${(queryStartTime - totalStartTime).toFixed(0)}ms, query: ${queryElapsed}ms, rows: ${rows.length})`);
          resolve(rows);
        }
        // Connection stays open in pool - don't close it
      });
    }
  });
}

/**
 * Get user's accessible stores
 * This would typically query a shared database or use the first store's connection
 * @param userEmail - User's email address
 * @returns Promise with list of stores user can access
 */
export async function getUserStores(userEmail: string) {
  // For simplicity, using store 1's connection to query user access
  // In production, this might be in a separate shared database
  const query = `
    SELECT s.store_id, s.store_name, s.store_url, usa.access_level
    FROM stores s
    JOIN user_store_access usa ON s.store_id = usa.store_id
    JOIN users u ON usa.user_id = u.user_id
    WHERE u.email = ?
    ORDER BY s.store_name
  `;

  try {
    const stores = await executeQuery(1, query, [userEmail]);
    return stores;
  } catch (error) {
    // If query fails, return empty array
    console.error('Error fetching user stores:', error);
    return [];
  }
}
