# E-commerce Analytics Dashboard

A modern Next.js application for multi-tenant e-commerce analytics powered by MotherDuck, following a 3-tier architecture pattern.

## Architecture

This application implements a **3-tier architecture** as recommended in the [MotherDuck Customer-Facing Analytics Guide](https://motherduck.com/docs/key-tasks/customer-facing-analytics/3-tier-cfa-guide/):

### Tier 1: Frontend (Next.js 14)
- React-based user interface with TypeScript
- Google OAuth authentication via NextAuth.js
- Interactive charts using Recharts
- Customer location maps using Leaflet

### Tier 2: Backend (Next.js API Routes)
- RESTful API endpoints
- Authentication middleware
- DuckDB client for MotherDuck connectivity
- Per-store token management

### Tier 3: Database (MotherDuck)
- Isolated database per store (hyper-tenancy)
- Dedicated service accounts per store
- Scalable analytics queries
- Customer data stored with geographic information

## Features

- **Multi-user Authentication**: Google OAuth login
- **Multi-tenant Access**: Users can access multiple stores based on permissions
- **Real-time Analytics**:
  - Revenue tracking over time
  - Order volume analysis
  - Customer location visualization
  - Key performance metrics
- **Role-based Access**: Admin and viewer roles per store

## Prerequisites

Before running this application, you need:

1. **Node.js**: Version 18 or higher
2. **MotherDuck Account**: With databases set up for each store
3. **Google OAuth Credentials**: For authentication
4. **MotherDuck Tokens**: Service account tokens for each store

## Setup Instructions

### 1. Install Dependencies

```bash
cd analytics-app
npm install
```

### 2. Configure Environment Variables

Copy the example environment file:

```bash
cp .env.example .env
```

Edit `.env` and add your credentials:

```env
# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# MotherDuck Tokens (one per store)
STORE_1_TOKEN=your-motherduck-token-store-1
STORE_2_TOKEN=your-motherduck-token-store-2
# ... add tokens for all stores
```

#### Getting Google OAuth Credentials

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing
3. Enable Google+ API
4. Create OAuth 2.0 credentials
5. Add authorized redirect URI: `http://localhost:3000/api/auth/callback/google`
6. Copy Client ID and Client Secret to `.env`

#### Generate NextAuth Secret

```bash
openssl rand -base64 32
```

### 3. Set Up MotherDuck

#### Create Databases

For each store, create a database in MotherDuck:

```sql
CREATE DATABASE store_1;
CREATE DATABASE store_2;
-- ... for stores 3-12
```

#### Load Sample Data

Navigate to the `data/` directory and follow the instructions in `data/README.md`:

```bash
cd data
# Follow data/README.md to load schema and sample data
```

The sample data includes:
- 20 test users
- 12 stores
- 5000+ orders over 12 months
- Geographic customer data

#### Create Service Accounts

1. In MotherDuck, create a service account for each store
2. Grant read access to the respective database
3. Copy the token to your `.env` file

### 4. Run the Application

Development mode:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

Production build:

```bash
npm run build
npm start
```

## Sample Users for Testing

The sample data includes 20 users. Here are a few to test with:

- **alice.johnson@example.com**: Admin access to stores 1, 2, 3
- **bob.smith@example.com**: Admin access to stores 4, 5
- **olivia.taylor@example.com**: Viewer access to all 12 stores

Note: When signing in with Google OAuth, use your actual Google account. The app will map your Google ID to these test users in the database.

## Project Structure

```
analytics-app/
├── app/
│   ├── api/                    # API routes
│   │   ├── auth/               # NextAuth configuration
│   │   └── stores/             # Store and analytics endpoints
│   ├── components/             # React components
│   │   ├── RevenueChart.tsx    # Revenue visualization
│   │   ├── OrdersChart.tsx     # Orders visualization
│   │   └── CustomerMap.tsx     # Location map
│   ├── dashboard/              # Dashboard pages
│   │   └── [storeId]/          # Dynamic store dashboard
│   ├── stores/                 # Store list page
│   ├── login/                  # Login page
│   ├── layout.tsx              # Root layout
│   ├── page.tsx                # Home page
│   └── globals.css             # Global styles
├── lib/
│   ├── auth.ts                 # Authentication utilities
│   └── motherduck.ts           # MotherDuck connection helper
├── types/
│   └── index.ts                # TypeScript definitions
├── data/
│   ├── schema.sql              # Database schema
│   ├── seed-users-stores.sql   # User and store data
│   ├── seed-analytics-data.sql # Sample analytics data
│   └── README.md               # Data loading instructions
├── package.json
├── tsconfig.json
├── next.config.js
└── .env.example
```

## Key Technologies

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **NextAuth.js**: Authentication with Google OAuth
- **DuckDB**: MotherDuck client for analytics queries
- **Recharts**: Declarative charts for React
- **Leaflet**: Interactive maps
- **React Leaflet**: React wrapper for Leaflet

## Security Considerations

- **Token Isolation**: Each store has its own MotherDuck token
- **Server-side Queries**: All database queries run server-side
- **Authentication Required**: All routes protected by NextAuth
- **Environment Variables**: Sensitive data never exposed to client
- **HTTPS Required**: Use HTTPS in production

## Scaling Considerations

Following MotherDuck's recommendations:

1. **Start Simple**: Single Duckling per customer
2. **Monitor**: Watch for latency and concurrency issues
3. **Scale When Needed**: Add read-scaling tokens only when monitoring shows need
4. **Data Isolation**: Each store's data is completely isolated

## API Endpoints

### Authentication
- `GET /api/auth/signin` - Google OAuth login
- `GET /api/auth/signout` - Logout

### Stores
- `GET /api/stores` - List user's accessible stores

### Analytics (per store)
- `GET /api/stores/[storeId]/analytics` - Summary metrics
- `GET /api/stores/[storeId]/revenue` - Revenue over time
- `GET /api/stores/[storeId]/orders` - Orders over time
- `GET /api/stores/[storeId]/locations` - Customer locations

## Troubleshooting

### MotherDuck Connection Issues

```
Error: Failed to connect to MotherDuck for store X
```

**Solution**: Verify the token in `.env` is correct and has access to the database.

### Google OAuth Errors

```
Error: redirect_uri_mismatch
```

**Solution**: Add `http://localhost:3000/api/auth/callback/google` to authorized redirect URIs in Google Cloud Console.

### Missing Data

```
No stores found
```

**Solution**: Ensure sample data is loaded into MotherDuck and user mappings are correct.

## Production Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Environment Variables for Production

Update these in production:
- `NEXTAUTH_URL`: Your production domain
- `GOOGLE_CLIENT_ID/SECRET`: Production OAuth credentials
- Add production redirect URI in Google Console

## Contributing

This is a template application. Customize it for your specific needs:

- Add more chart types
- Implement data filtering
- Add export functionality
- Customize styling
- Add more analytics queries

## License

MIT

## Support

For MotherDuck-specific questions, refer to:
- [MotherDuck Documentation](https://motherduck.com/docs)
- [3-Tier Architecture Guide](https://motherduck.com/docs/key-tasks/customer-facing-analytics/3-tier-cfa-guide/)
