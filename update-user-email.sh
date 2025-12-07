#!/bin/bash

# Update a sample user with your actual Google email
# Usage: ./update-user-email.sh your-email@gmail.com

if [ -z "$1" ]; then
    echo "Usage: ./update-user-email.sh your-email@gmail.com"
    exit 1
fi

EMAIL="$1"
echo "================================================"
echo "Updating User Email"
echo "================================================"
echo ""
echo "Setting user #1 (Alice) to: $EMAIL"
echo ""

# Get the token from .env file
TOKEN=$(grep "STORE_1_TOKEN=" .env | cut -d '=' -f2)

if [ -z "$TOKEN" ]; then
    echo "❌ Error: Could not find STORE_1_TOKEN in .env file"
    exit 1
fi

# Update the user in store_1 database
# Note: Since all stores share the same data, we only need to update store_1
duckdb "md:store_1?motherduck_token=${TOKEN}" <<EOF
-- Update user #1 (Alice) with your email
-- Alice has admin access to stores 1, 2, and 3
UPDATE users
SET email = '${EMAIL}',
    name = 'Your Name'
WHERE user_id = 1;

-- Verify
SELECT
    user_id,
    email,
    name,
    'Access to stores: ' || GROUP_CONCAT(store_id::VARCHAR) as stores
FROM users u
JOIN user_store_access usa ON u.user_id = usa.user_id
WHERE u.user_id = 1
GROUP BY u.user_id, u.email, u.name;
EOF

echo ""
echo "✅ User updated successfully!"
echo ""
echo "You can now log in with: $EMAIL"
echo "You'll have admin access to stores 1, 2, and 3"
echo ""
echo "Go to: http://localhost:3000"
echo ""
