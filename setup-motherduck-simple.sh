#!/bin/bash

# Setup MotherDuck databases with sample data
# Following 3-tier CFA architecture: each database uses its own service token

echo "================================================"
echo "MotherDuck Database Setup (3-Tier Architecture)"
echo "================================================"
echo ""

# Load tokens from .env (without associative arrays)
STORE_1_TOKEN=$(grep "STORE_1_TOKEN=" .env | cut -d '=' -f2)
STORE_2_TOKEN=$(grep "STORE_2_TOKEN=" .env | cut -d '=' -f2)
STORE_3_TOKEN=$(grep "STORE_3_TOKEN=" .env | cut -d '=' -f2)
STORE_4_TOKEN=$(grep "STORE_4_TOKEN=" .env | cut -d '=' -f2)
STORE_5_TOKEN=$(grep "STORE_5_TOKEN=" .env | cut -d '=' -f2)
STORE_6_TOKEN=$(grep "STORE_6_TOKEN=" .env | cut -d '=' -f2)
STORE_7_TOKEN=$(grep "STORE_7_TOKEN=" .env | cut -d '=' -f2)
STORE_8_TOKEN=$(grep "STORE_8_TOKEN=" .env | cut -d '=' -f2)
STORE_9_TOKEN=$(grep "STORE_9_TOKEN=" .env | cut -d '=' -f2)
STORE_10_TOKEN=$(grep "STORE_10_TOKEN=" .env | cut -d '=' -f2)
STORE_11_TOKEN=$(grep "STORE_11_TOKEN=" .env | cut -d '=' -f2)
STORE_12_TOKEN=$(grep "STORE_12_TOKEN=" .env | cut -d '=' -f2)

echo "✓ All 12 service account tokens loaded"
echo ""

# Function to setup a single store
setup_store() {
    local store_id=$1
    local token_var="STORE_${store_id}_TOKEN"
    local token=${!token_var}

    echo "Setting up store_${store_id}..."

    # Create database
    duckdb "md:?motherduck_token=${token}" <<EOF
CREATE DATABASE IF NOT EXISTS store_${store_id};
EOF

    # Load schema and data
    duckdb "md:store_${store_id}?motherduck_token=${token}" < data/schema.sql
    duckdb "md:store_${store_id}?motherduck_token=${token}" < data/seed-users-stores.sql
    duckdb "md:store_${store_id}?motherduck_token=${token}" < data/seed-analytics-data-duckdb.sql

    # Verify
    echo "  ✓ Store ${store_id} complete"
}

# Setup all 12 stores
for i in {1..12}; do
    setup_store $i
    echo ""
done

echo "================================================"
echo "✅ Setup Complete!"
echo "================================================"
echo ""
