#!/usr/bin/env node

/**
 * Generate MotherDuck Service Accounts and Tokens
 *
 * This script creates 12 service accounts (one per store) and generates
 * read_write tokens for each using the MotherDuck REST API.
 *
 * Prerequisites:
 * - You need an Admin token from MotherDuck
 * - Run: node scripts/generate-motherduck-tokens.js
 */

const https = require('https');

const MOTHERDUCK_API = 'api.motherduck.com';
const NUM_STORES = 12;

// Get admin token from command line argument or environment variable
const ADMIN_TOKEN = process.argv[2] || process.env.MOTHERDUCK_ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
  console.error('Error: Admin token is required');
  console.error('Usage: node generate-motherduck-tokens.js YOUR_ADMIN_TOKEN');
  console.error('Or set MOTHERDUCK_ADMIN_TOKEN environment variable');
  process.exit(1);
}

/**
 * Make an HTTPS request to MotherDuck API
 */
function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: MOTHERDUCK_API,
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            resolve(data);
          }
        } else {
          reject(new Error(`HTTP ${res.statusCode}: ${data}`));
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    if (body) {
      req.write(JSON.stringify(body));
    }

    req.end();
  });
}

/**
 * Create a service account
 */
async function createServiceAccount(storeId) {
  const username = `store_${storeId}_service`;

  console.log(`Creating service account: ${username}...`);

  try {
    const response = await makeRequest('POST', '/v1/users', {
      username: username,
    });

    console.log(`✓ Created service account: ${username}`);
    return username;
  } catch (error) {
    console.error(`✗ Failed to create service account ${username}:`, error.message);
    throw error;
  }
}

/**
 * Generate a token for a service account
 */
async function generateToken(username, storeId) {
  const tokenName = `store_${storeId}_token`;

  console.log(`Generating token for ${username}...`);

  try {
    const response = await makeRequest('POST', `/v1/users/${username}/tokens`, {
      name: tokenName,
      token_type: 'read_write',
    });

    console.log(`✓ Generated token for ${username}`);
    return response.token || response.access_token;
  } catch (error) {
    console.error(`✗ Failed to generate token for ${username}:`, error.message);
    throw error;
  }
}

/**
 * Main function to generate all service accounts and tokens
 */
async function main() {
  console.log('='.repeat(60));
  console.log('MotherDuck Service Account & Token Generator');
  console.log('='.repeat(60));
  console.log(`\nGenerating ${NUM_STORES} service accounts and tokens...\n`);

  const results = [];

  for (let storeId = 1; storeId <= NUM_STORES; storeId++) {
    try {
      // Create service account
      const username = await createServiceAccount(storeId);

      // Wait a bit to ensure account is fully created
      await new Promise(resolve => setTimeout(resolve, 500));

      // Generate token
      const token = await generateToken(username, storeId);

      results.push({
        storeId,
        username,
        token,
      });

      console.log('');
    } catch (error) {
      console.error(`Failed for store ${storeId}:`, error.message);
      console.log('');
    }
  }

  // Output results
  console.log('='.repeat(60));
  console.log('RESULTS');
  console.log('='.repeat(60));
  console.log('\n✓ Successfully generated tokens for', results.length, 'stores\n');

  // Generate .env format
  console.log('Add these to your .env file:');
  console.log('-'.repeat(60));
  results.forEach(({ storeId, token }) => {
    console.log(`STORE_${storeId}_TOKEN=${token}`);
  });
  console.log('-'.repeat(60));

  // Generate summary table
  console.log('\n\nSummary:');
  console.log('-'.repeat(60));
  results.forEach(({ storeId, username }) => {
    console.log(`Store ${storeId}: ${username}`);
  });
  console.log('-'.repeat(60));

  console.log('\n✓ Done! Copy the tokens above to your .env file');
  console.log('\nNext steps:');
  console.log('1. Create databases in MotherDuck for each store:');
  console.log('   CREATE DATABASE store_1; CREATE DATABASE store_2; etc.');
  console.log('2. Grant access to each service account');
  console.log('3. Load sample data using data/schema.sql and data/seed-*.sql');
}

// Run the script
main().catch((error) => {
  console.error('\n✗ Script failed:', error.message);
  process.exit(1);
});
