#!/bin/bash

# Load revenue data into all databases
echo "Loading revenue data into all 12 databases..."
echo ""

# Load all tokens from .env
declare -A TOKENS
for i in {1..12}; do
    TOKEN=$(grep "STORE_${i}_TOKEN=" .env | cut -d '=' -f2)
    TOKENS[$i]=$TOKEN
done

for i in {1..12}; do
    echo "Loading revenue data into store_${i}..."

    duckdb "md:store_${i}?motherduck_token=${TOKENS[$i]}" < data/seed-analytics-data-duckdb.sql

    echo "  ✓ Store ${i} revenue data loaded"
done

echo ""
echo "✅ Revenue data loaded for all stores!"
