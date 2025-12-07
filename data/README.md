# Analytics Data for MotherDuck

This directory contains SQL scripts to seed your MotherDuck databases with sample analytics data.

## Database Structure

Following the 3-tier architecture pattern, each store should have its own database in MotherDuck with a dedicated service account.

## Data Overview

- **20 Users**: Mapped to various stores with different access levels
- **12 Stores**: Ecommerce stores with unique analytics data
- **5000+ Orders**: Distributed across all stores over the past 12 months
- **Customer Locations**: Geographic data across major US cities

## Loading Data into MotherDuck

### Step 1: Create Databases for Each Store

For each store (1-12), create a separate database in MotherDuck:

```bash
# Connect to MotherDuck
duckdb "md:"

# Create databases for each store
CREATE DATABASE store_1;
CREATE DATABASE store_2;
CREATE DATABASE store_3;
-- ... repeat for stores 4-12
```

### Step 2: Load Schema

For each store database, load the schema:

```sql
USE store_1;
.read schema.sql

USE store_2;
.read schema.sql

-- Repeat for all stores
```

### Step 3: Load User and Store Data

The users and stores tables contain cross-store data. Load this into a shared database or into each store's database:

```sql
USE store_1;
.read seed-users-stores.sql
```

### Step 4: Load Analytics Data

Load the orders and revenue data:

```sql
.read seed-analytics-data.sql
```

### Alternative: Using MotherDuck CLI

```bash
# For each store
duckdb "md:store_1?motherduck_token=YOUR_TOKEN_HERE"
.read schema.sql
.read seed-users-stores.sql
.read seed-analytics-data.sql
```

## Service Account Setup

Create a service account for each store in MotherDuck:

1. Go to MotherDuck Settings > Service Accounts
2. Create a service account for each store (e.g., `store_1_service`, `store_2_service`)
3. Grant read access to the respective database
4. Copy the token and add to your `.env` file:

```
STORE_1_TOKEN=your_token_here
STORE_2_TOKEN=your_token_here
# ... etc
```

## Data Schema

### users
- user_id, email, name, google_id

### stores
- store_id, store_name, store_url

### user_store_access
- Maps which users can access which stores
- Includes access_level (admin/viewer)

### orders
- Complete order data including customer location (lat/lng)
- Order status, totals, dates

### daily_revenue
- Aggregated daily revenue by store
- Order counts per day

## User-Store Mappings

Key user mappings for testing:

- Alice (alice.johnson@example.com): Stores 1, 2, 3 (admin)
- Bob (bob.smith@example.com): Stores 4, 5 (admin)
- Carol (carol.white@example.com): Store 6 (admin)
- Olivia (olivia.taylor@example.com): All stores (viewer) - good for testing

See `seed-users-stores.sql` for complete mappings.
