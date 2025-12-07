-- Generate sample orders and revenue data for all stores (DuckDB compatible)
-- This script generates data for the past 12 months

-- Sample orders for Store 1 (TechGear Pro)
INSERT INTO orders (order_id, store_id, order_date, customer_name, customer_email, customer_city, customer_state, customer_country, customer_lat, customer_lng, order_total, order_status)
SELECT
    1000 + row_number() OVER () as order_id,
    1 as store_id,
    CURRENT_DATE - INTERVAL (FLOOR(RANDOM() * 365)::INTEGER) DAY as order_date,
    'Customer ' || FLOOR(RANDOM() * 1000)::VARCHAR as customer_name,
    'customer' || FLOOR(RANDOM() * 1000)::VARCHAR || '@example.com' as customer_email,
    CASE FLOOR(RANDOM() * 10)::INTEGER
        WHEN 0 THEN 'New York'
        WHEN 1 THEN 'Los Angeles'
        WHEN 2 THEN 'Chicago'
        WHEN 3 THEN 'Houston'
        WHEN 4 THEN 'Phoenix'
        WHEN 5 THEN 'Philadelphia'
        WHEN 6 THEN 'San Antonio'
        WHEN 7 THEN 'San Diego'
        WHEN 8 THEN 'Dallas'
        ELSE 'San Jose'
    END as customer_city,
    CASE FLOOR(RANDOM() * 10)::INTEGER
        WHEN 0 THEN 'NY'
        WHEN 1 THEN 'CA'
        WHEN 2 THEN 'IL'
        WHEN 3 THEN 'TX'
        WHEN 4 THEN 'AZ'
        WHEN 5 THEN 'PA'
        WHEN 6 THEN 'TX'
        WHEN 7 THEN 'CA'
        WHEN 8 THEN 'TX'
        ELSE 'CA'
    END as customer_state,
    'USA' as customer_country,
    40.7128 + (RANDOM() * 10 - 5) as customer_lat,
    -74.0060 + (RANDOM() * 20 - 10) as customer_lng,
    ROUND((50 + RANDOM() * 950)::DECIMAL, 2) as order_total,
    CASE FLOOR(RANDOM() * 10)::INTEGER
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'cancelled'
        ELSE 'completed'
    END as order_status
FROM range(500);

-- Daily revenue for Store 1
INSERT INTO daily_revenue (revenue_date, store_id, total_revenue, order_count)
SELECT
    (CURRENT_DATE - INTERVAL (d::INTEGER) DAY)::DATE as revenue_date,
    1 as store_id,
    ROUND((2000 + RANDOM() * 5000)::DECIMAL, 2) as total_revenue,
    FLOOR(10 + RANDOM() * 40)::INTEGER as order_count
FROM range(365) t(d);

-- Store 2 (Fashion Forward)
INSERT INTO orders (order_id, store_id, order_date, customer_name, customer_email, customer_city, customer_state, customer_country, customer_lat, customer_lng, order_total, order_status)
SELECT
    2000 + row_number() OVER () as order_id,
    2 as store_id,
    CURRENT_DATE - INTERVAL (FLOOR(RANDOM() * 365)::INTEGER) DAY as order_date,
    'Customer ' || FLOOR(RANDOM() * 1000)::VARCHAR as customer_name,
    'customer' || FLOOR(RANDOM() * 1000)::VARCHAR || '@example.com' as customer_email,
    CASE FLOOR(RANDOM() * 8)::INTEGER
        WHEN 0 THEN 'Miami'
        WHEN 1 THEN 'Seattle'
        WHEN 2 THEN 'Boston'
        WHEN 3 THEN 'Atlanta'
        WHEN 4 THEN 'Denver'
        WHEN 5 THEN 'Portland'
        WHEN 6 THEN 'Austin'
        ELSE 'Nashville'
    END as customer_city,
    CASE FLOOR(RANDOM() * 8)::INTEGER
        WHEN 0 THEN 'FL'
        WHEN 1 THEN 'WA'
        WHEN 2 THEN 'MA'
        WHEN 3 THEN 'GA'
        WHEN 4 THEN 'CO'
        WHEN 5 THEN 'OR'
        WHEN 6 THEN 'TX'
        ELSE 'TN'
    END as customer_state,
    'USA' as customer_country,
    37.7749 + (RANDOM() * 10 - 5) as customer_lat,
    -122.4194 + (RANDOM() * 20 - 10) as customer_lng,
    ROUND((30 + RANDOM() * 470)::DECIMAL, 2) as order_total,
    CASE FLOOR(RANDOM() * 10)::INTEGER
        WHEN 0 THEN 'pending'
        WHEN 1 THEN 'cancelled'
        ELSE 'completed'
    END as order_status
FROM range(600);

INSERT INTO daily_revenue (revenue_date, store_id, total_revenue, order_count)
SELECT
    (CURRENT_DATE - INTERVAL (d::INTEGER) DAY)::DATE as revenue_date,
    2 as store_id,
    ROUND((1500 + RANDOM() * 4000)::DECIMAL, 2) as total_revenue,
    FLOOR(15 + RANDOM() * 35)::INTEGER as order_count
FROM range(365) t(d);

-- Store 3 (Home Essentials)
INSERT INTO orders (order_id, store_id, order_date, customer_name, customer_email, customer_city, customer_state, customer_country, customer_lat, customer_lng, order_total, order_status)
SELECT
    3000 + row_number() OVER () as order_id,
    3 as store_id,
    CURRENT_DATE - INTERVAL (FLOOR(RANDOM() * 365)::INTEGER) DAY as order_date,
    'Customer ' || FLOOR(RANDOM() * 1000)::VARCHAR as customer_name,
    'customer' || FLOOR(RANDOM() * 1000)::VARCHAR || '@example.com' as customer_email,
    CASE FLOOR(RANDOM() * 6)::INTEGER
        WHEN 0 THEN 'Charlotte'
        WHEN 1 THEN 'Columbus'
        WHEN 2 THEN 'Indianapolis'
        WHEN 3 THEN 'San Francisco'
        WHEN 4 THEN 'Detroit'
        ELSE 'Minneapolis'
    END as customer_city,
    CASE FLOOR(RANDOM() * 6)::INTEGER
        WHEN 0 THEN 'NC'
        WHEN 1 THEN 'OH'
        WHEN 2 THEN 'IN'
        WHEN 3 THEN 'CA'
        WHEN 4 THEN 'MI'
        ELSE 'MN'
    END as customer_state,
    'USA' as customer_country,
    35.2271 + (RANDOM() * 10 - 5) as customer_lat,
    -80.8431 + (RANDOM() * 20 - 10) as customer_lng,
    ROUND((40 + RANDOM() * 560)::DECIMAL, 2) as order_total,
    CASE FLOOR(RANDOM() * 10)::INTEGER
        WHEN 0 THEN 'pending'
        ELSE 'completed'
    END as order_status
FROM range(450);

INSERT INTO daily_revenue (revenue_date, store_id, total_revenue, order_count)
SELECT
    (CURRENT_DATE - INTERVAL (d::INTEGER) DAY)::DATE as revenue_date,
    3 as store_id,
    ROUND((1800 + RANDOM() * 3500)::DECIMAL, 2) as total_revenue,
    FLOOR(12 + RANDOM() * 28)::INTEGER as order_count
FROM range(365) t(d);

-- Stores 4-12 with simpler pattern
INSERT INTO orders (order_id, store_id, order_date, customer_name, customer_email, customer_city, customer_state, customer_country, customer_lat, customer_lng, order_total, order_status)
SELECT
    (4000 + t.store_num * 1000 + row_number() OVER (PARTITION BY t.store_num))::INTEGER as order_id,
    t.store_num as store_id,
    CURRENT_DATE - INTERVAL (FLOOR(RANDOM() * 365)::INTEGER) DAY as order_date,
    'Customer ' || FLOOR(RANDOM() * 1000)::VARCHAR as customer_name,
    'customer' || FLOOR(RANDOM() * 1000)::VARCHAR || '@example.com' as customer_email,
    'City' || FLOOR(RANDOM() * 50)::VARCHAR as customer_city,
    'ST' as customer_state,
    'USA' as customer_country,
    39.8283 + (RANDOM() * 10 - 5) as customer_lat,
    -98.5795 + (RANDOM() * 20 - 10) as customer_lng,
    ROUND((30 + RANDOM() * 470)::DECIMAL, 2) as order_total,
    CASE FLOOR(RANDOM() * 10)::INTEGER
        WHEN 0 THEN 'pending'
        ELSE 'completed'
    END as order_status
FROM range(4, 13) t(store_num)
CROSS JOIN range(300) r;

INSERT INTO daily_revenue (revenue_date, store_id, total_revenue, order_count)
SELECT
    (CURRENT_DATE - INTERVAL (d::INTEGER) DAY)::DATE as revenue_date,
    t1.store_num as store_id,
    ROUND((800 + RANDOM() * (t1.store_num * 300))::DECIMAL, 2) as total_revenue,
    FLOOR(8 + RANDOM() * (t1.store_num * 3))::INTEGER as order_count
FROM range(4, 13) t1(store_num)
CROSS JOIN range(365) t2(d);
