-- This file loads all data for ONE store
-- Usage: Run this after connecting to a specific store database
-- Example: duckdb "md:store_1?motherduck_token=YOUR_TOKEN"

-- First, load the schema
.read data/schema.sql

-- Load users and stores (shared data)
.read data/seed-users-stores.sql

-- Load analytics data
.read data/seed-analytics-data.sql

-- Show summary
SELECT 'Users loaded:' as info, COUNT(*) as count FROM users
UNION ALL
SELECT 'Stores loaded:', COUNT(*) FROM stores
UNION ALL
SELECT 'Orders loaded:', COUNT(*) FROM orders
UNION ALL
SELECT 'Daily revenue records:', COUNT(*) FROM daily_revenue;
