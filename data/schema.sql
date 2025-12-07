-- Schema for Analytics Database
-- Each store gets its own database in MotherDuck

-- Users table: maps users to stores they can access
CREATE TABLE IF NOT EXISTS users (
    user_id INTEGER PRIMARY KEY,
    email VARCHAR NOT NULL,
    name VARCHAR NOT NULL,
    google_id VARCHAR UNIQUE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stores table: store information
CREATE TABLE IF NOT EXISTS stores (
    store_id INTEGER PRIMARY KEY,
    store_name VARCHAR NOT NULL,
    store_url VARCHAR,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- User-Store access mapping
CREATE TABLE IF NOT EXISTS user_store_access (
    user_id INTEGER,
    store_id INTEGER,
    access_level VARCHAR DEFAULT 'viewer', -- viewer, admin
    PRIMARY KEY (user_id, store_id)
);

-- Orders table: order transactions
CREATE TABLE IF NOT EXISTS orders (
    order_id INTEGER PRIMARY KEY,
    store_id INTEGER NOT NULL,
    order_date TIMESTAMP NOT NULL,
    customer_name VARCHAR,
    customer_email VARCHAR,
    customer_city VARCHAR,
    customer_state VARCHAR,
    customer_country VARCHAR,
    customer_lat FLOAT,
    customer_lng FLOAT,
    order_total DECIMAL(10, 2),
    order_status VARCHAR -- completed, pending, cancelled
);

-- Revenue table: daily revenue aggregates
CREATE TABLE IF NOT EXISTS daily_revenue (
    revenue_date DATE NOT NULL,
    store_id INTEGER NOT NULL,
    total_revenue DECIMAL(10, 2),
    order_count INTEGER,
    PRIMARY KEY (revenue_date, store_id)
);

-- Product performance table
CREATE TABLE IF NOT EXISTS product_sales (
    product_id INTEGER,
    store_id INTEGER,
    product_name VARCHAR,
    sale_date DATE,
    quantity_sold INTEGER,
    revenue DECIMAL(10, 2),
    PRIMARY KEY (product_id, store_id, sale_date)
);
