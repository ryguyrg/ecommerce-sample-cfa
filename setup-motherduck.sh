#!/bin/bash

# Setup MotherDuck databases with sample data
# Following 3-tier CFA architecture: each database uses its own service token

echo "================================================"
echo "MotherDuck Database Setup (3-Tier Architecture)"
echo "================================================"
echo ""

# Check if DuckDB CLI is installed
if ! command -v duckdb &> /dev/null; then
    echo "📦 DuckDB CLI not found. Installing..."
    brew install duckdb
fi

echo "✓ DuckDB CLI ready"
echo ""

# Load all tokens from .env
echo "Loading service account tokens from .env..."
declare -A TOKENS
for i in {1..12}; do
    TOKEN=$(grep "STORE_${i}_TOKEN=" .env | cut -d '=' -f2)
    if [ -z "$TOKEN" ]; then
        echo "❌ Error: Could not find STORE_${i}_TOKEN in .env file"
        exit 1
    fi
    TOKENS[$i]=$TOKEN
done

echo "✓ All 12 service account tokens loaded"
echo ""

# Step 1: Create databases using respective service tokens
echo "Step 1: Creating 12 databases (each with its own service account)..."
echo "-----------------------------------"
echo ""

for i in {1..12}; do
    echo "Creating store_${i} database with STORE_${i}_TOKEN..."

    duckdb "md:?motherduck_token=${TOKENS[$i]}" <<EOF
CREATE DATABASE IF NOT EXISTS store_${i};
.quit
EOF

    echo "  ✓ store_${i} created"
done

echo ""
echo "✓ All databases created with proper service account isolation"
echo ""

# Step 2: Load data into each database using its own token
echo "Step 2: Loading sample data into each database..."
echo "-----------------------------------"
echo ""

for i in {1..12}; do
    echo "Loading data into store_${i} using STORE_${i}_TOKEN..."

    duckdb "md:store_${i}?motherduck_token=${TOKENS[$i]}" <<EOF
-- Load schema
$(cat data/schema.sql)

-- Load users and stores
$(cat data/seed-users-stores.sql)

-- Load analytics data
$(cat data/seed-analytics-data.sql)

-- Verify
SELECT 'Store ${i} - Users: ' || COUNT(*) FROM users
UNION ALL
SELECT 'Store ${i} - Orders: ' || COUNT(*) FROM orders
UNION ALL
SELECT 'Store ${i} - Revenue records: ' || COUNT(*) FROM daily_revenue;
EOF

    echo "  ✓ Store ${i} data loaded"
    echo ""
done

echo "================================================"
echo "✅ Setup Complete!"
echo "================================================"
echo ""
echo "All 12 databases have been created and loaded with:"
echo "  • 20 users"
echo "  • 12 stores"
echo "  • 5000+ orders"
echo "  • 12 months of revenue data"
echo ""
echo "Next step: Update a user with your Google email"
echo "Run: ./update-user-email.sh your-google-email@gmail.com"
echo ""
