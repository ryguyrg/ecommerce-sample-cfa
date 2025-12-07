# MotherDuck Service Account Generator

This script automates the creation of 12 MotherDuck service accounts and tokens for your analytics application.

## Prerequisites

1. **MotherDuck Account**: You need an active MotherDuck account
2. **Admin Token**: Generate an admin token from your MotherDuck dashboard

## Getting Your Admin Token

1. Log in to [MotherDuck](https://app.motherduck.com/)
2. Go to Settings → Access Tokens
3. Create a new token with **Admin** privileges
4. Copy the token (you'll only see it once!)

## Running the Script

### Option 1: Pass token as argument

```bash
node scripts/generate-motherduck-tokens.js YOUR_ADMIN_TOKEN_HERE
```

### Option 2: Use environment variable

```bash
export MOTHERDUCK_ADMIN_TOKEN=your_admin_token_here
node scripts/generate-motherduck-tokens.js
```

## What the Script Does

The script will:

1. **Create 12 service accounts** named:
   - `store_1_service`
   - `store_2_service`
   - ... through `store_12_service`

2. **Generate read_write tokens** for each service account

3. **Output** the tokens in `.env` format for easy copying

## Example Output

```
============================================================
MotherDuck Service Account & Token Generator
============================================================

Generating 12 service accounts and tokens...

Creating service account: store_1_service...
✓ Created service account: store_1_service
Generating token for store_1_service...
✓ Generated token for store_1_service

[... continues for all 12 stores ...]

============================================================
RESULTS
============================================================

✓ Successfully generated tokens for 12 stores

Add these to your .env file:
------------------------------------------------------------
STORE_1_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
STORE_2_TOKEN=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
[... etc ...]
------------------------------------------------------------
```

## After Running the Script

1. **Copy the tokens** to your `.env` file

2. **Create databases** in MotherDuck for each store:
   ```sql
   CREATE DATABASE store_1;
   CREATE DATABASE store_2;
   -- ... through store_12
   ```

3. **Grant access** to service accounts:
   ```sql
   GRANT ALL ON DATABASE store_1 TO store_1_service;
   GRANT ALL ON DATABASE store_2 TO store_2_service;
   -- ... etc
   ```

4. **Load sample data** following instructions in `data/README.md`

## Troubleshooting

### Error: Admin token is required

**Solution**: Make sure you're passing the admin token correctly

### HTTP 401: Unauthorized

**Solution**: Your admin token may be invalid or expired. Generate a new one from MotherDuck

### HTTP 403: Forbidden

**Solution**: Your token doesn't have admin privileges. Make sure it's an Admin token, not a regular user token

### Service account already exists

**Solution**: The service accounts may have been created already. You can either:
- Delete them from MotherDuck UI and re-run
- Skip creation and just generate new tokens
- Use different names by modifying the script

## Security Notes

- **Never commit** your admin token or service tokens to git
- **Store tokens securely** in `.env` file (already in `.gitignore`)
- **Rotate tokens** periodically for security
- **Use read_only tokens** for viewer-only access if needed

## API Endpoints Used

This script uses the MotherDuck REST API:

- `POST /v1/users` - Create service accounts
- `POST /v1/users/:username/tokens` - Generate tokens

## Reference Documentation

- [MotherDuck Service Accounts Guide](https://motherduck.com/docs/key-tasks/service-accounts-guide/)
- [Create Service Account API](https://motherduck.com/docs/sql-reference/rest-api/users-create-service-account/)
- [Create Token API](https://motherduck.com/docs/sql-reference/rest-api/users-create-token/)
