# Quick Start Guide

Get your analytics application up and running in minutes!

## Step 1: Generate MotherDuck Service Tokens

First, get your admin token from MotherDuck:
1. Log in to [MotherDuck](https://app.motherduck.com/)
2. Go to Settings → Access Tokens
3. Create a new **Admin** token
4. Copy the token

Then run the token generation script:

```bash
cd analytics-app
node scripts/generate-motherduck-tokens.js YOUR_ADMIN_TOKEN_HERE
```

This will create 12 service accounts and generate tokens for each store. Copy the output to your `.env` file.

## Step 2: Set Up Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and add:

1. **Google OAuth credentials** (get from [Google Cloud Console](https://console.cloud.google.com/)):
   ```
   GOOGLE_CLIENT_ID=your-client-id
   GOOGLE_CLIENT_SECRET=your-client-secret
   ```

2. **NextAuth secret** (generate with `openssl rand -base64 32`):
   ```
   NEXTAUTH_SECRET=generated-secret
   ```

3. **MotherDuck tokens** (paste from script output):
   ```
   STORE_1_TOKEN=...
   STORE_2_TOKEN=...
   # ... etc
   ```

## Step 3: Create MotherDuck Databases

Connect to MotherDuck and create databases for each store:

```sql
CREATE DATABASE store_1;
CREATE DATABASE store_2;
CREATE DATABASE store_3;
CREATE DATABASE store_4;
CREATE DATABASE store_5;
CREATE DATABASE store_6;
CREATE DATABASE store_7;
CREATE DATABASE store_8;
CREATE DATABASE store_9;
CREATE DATABASE store_10;
CREATE DATABASE store_11;
CREATE DATABASE store_12;
```

Grant access to service accounts:

```sql
GRANT ALL ON DATABASE store_1 TO store_1_service;
GRANT ALL ON DATABASE store_2 TO store_2_service;
-- ... repeat for all 12 stores
```

## Step 4: Load Sample Data

For each store database, load the schema and data:

```bash
# Connect to store 1
duckdb "md:store_1?motherduck_token=YOUR_STORE_1_TOKEN"

# Load schema
.read data/schema.sql

# Load user/store data
.read data/seed-users-stores.sql

# Load analytics data
.read data/seed-analytics-data.sql

# Repeat for all 12 stores
```

**Pro tip**: Create a shell script to automate this:

```bash
#!/bin/bash
for i in {1..12}; do
  TOKEN=$(grep "STORE_${i}_TOKEN" .env | cut -d '=' -f2)
  echo "Loading data into store_${i}..."
  duckdb "md:store_${i}?motherduck_token=${TOKEN}" < data/load-all.sql
done
```

## Step 5: Install Dependencies & Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Step 6: Test the Application

1. **Sign in** with your Google account
2. You'll see the stores list (based on the user mappings in the sample data)
3. Click on a store to view its analytics dashboard
4. Explore the charts and customer location map

### Test Users

The sample data includes these user mappings (by email domain in Google OAuth):

- **alice.johnson@example.com**: Admin for stores 1, 2, 3
- **bob.smith@example.com**: Admin for stores 4, 5
- **olivia.taylor@example.com**: Viewer for all 12 stores

**Note**: You'll need to update the sample data with your actual Google email to see the stores when you log in.

## Troubleshooting

### "No stores found"

**Solution**: Update the sample data with your Google email:

```sql
-- Connect to store 1
UPDATE users SET google_id = 'your-google-id', email = 'your@email.com'
WHERE user_id = 1;
```

You can find your Google ID in the NextAuth session after logging in.

### "Failed to connect to MotherDuck"

**Solution**: Verify your tokens are correct in `.env` and that service accounts have been granted access to the databases.

### Google OAuth errors

**Solution**: Make sure you've added `http://localhost:3000/api/auth/callback/google` to your authorized redirect URIs in Google Cloud Console.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Tier 1: Frontend                  │
│            Next.js 14 + React + TypeScript          │
│        (Google OAuth, Recharts, Leaflet Maps)       │
└─────────────────┬───────────────────────────────────┘
                  │ HTTPS/API
┌─────────────────┴───────────────────────────────────┐
│                 Tier 2: Backend API                 │
│              Next.js API Routes + DuckDB            │
│          (Authentication, Token Management)          │
└─────────────────┬───────────────────────────────────┘
                  │ DuckDB Protocol
┌─────────────────┴───────────────────────────────────┐
│              Tier 3: MotherDuck Cloud               │
│         12 Isolated Databases (1 per store)         │
│           Each with dedicated service account        │
└─────────────────────────────────────────────────────┘
```

## What's Included

✓ **Multi-tenant architecture** - 12 stores, each with isolated database
✓ **Role-based access control** - Admin and viewer roles
✓ **20 sample users** - Pre-configured user-store mappings
✓ **5000+ orders** - 12 months of sample analytics data
✓ **Interactive visualizations** - Revenue charts, order trends, location maps
✓ **Production-ready** - TypeScript, error handling, authentication

## Next Steps

Once you have the basic application running:

1. **Customize the UI** - Modify components in `app/components/`
2. **Add more charts** - Create new chart types with Recharts
3. **Extend analytics** - Add more API endpoints in `app/api/stores/`
4. **Configure production** - Deploy to Vercel or your preferred platform
5. **Add real data** - Replace sample data with actual e-commerce data

## Support

- **Documentation**: See [README.md](README.md) for full documentation
- **MotherDuck Docs**: https://motherduck.com/docs
- **3-Tier Architecture Guide**: https://motherduck.com/docs/key-tasks/customer-facing-analytics/3-tier-cfa-guide/

Happy analyzing! 🚀
