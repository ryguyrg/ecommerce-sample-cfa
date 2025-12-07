#!/usr/bin/env node

/**
 * Test MotherDuck API connection and debug issues
 */

const https = require('https');

const ADMIN_TOKEN = process.argv[2] || process.env.MOTHERDUCK_ADMIN_TOKEN;

if (!ADMIN_TOKEN) {
  console.error('Usage: node test-motherduck-api.js YOUR_ADMIN_TOKEN');
  process.exit(1);
}

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const bodyString = body ? JSON.stringify(body) : '';

    const options = {
      hostname: 'api.motherduck.com',
      port: 443,
      path: path,
      method: method,
      headers: {
        'Authorization': `Bearer ${ADMIN_TOKEN}`,
        'Content-Type': 'application/json',
        'Content-Length': bodyString.length,
      },
    };

    console.log(`\n${'='.repeat(60)}`);
    console.log(`REQUEST: ${method} https://api.motherduck.com${path}`);
    console.log('='.repeat(60));
    console.log('\nRequest Headers:');
    for (const [key, value] of Object.entries(options.headers)) {
      if (key === 'Authorization') {
        // Mask the token for security
        console.log(`  ${key}: Bearer ${value.substring(7, 20)}...`);
      } else {
        console.log(`  ${key}: ${value}`);
      }
    }
    if (body) {
      console.log('\nRequest Body:');
      console.log(JSON.stringify(body, null, 2));
    }

    const req = https.request(options, (res) => {
      let data = '';

      console.log(`\n${'='.repeat(60)}`);
      console.log(`RESPONSE: ${res.statusCode} ${res.statusMessage}`);
      console.log('='.repeat(60));
      console.log('\nResponse Headers:');
      for (const [key, value] of Object.entries(res.headers)) {
        console.log(`  ${key}: ${value}`);
      }

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        console.log('\nResponse Body:');
        console.log(data);

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
      console.error('Request error:', error);
      reject(error);
    });

    if (bodyString) {
      req.write(bodyString);
    }

    req.end();
  });
}

async function testAPI() {
  console.log('='.repeat(60));
  console.log('MotherDuck API Connection Test');
  console.log('='.repeat(60));

  // Test 1: Try to list users (if endpoint exists)
  console.log('\n--- Test 1: GET /v1/users ---');
  try {
    await makeRequest('GET', '/v1/users');
    console.log('✓ GET /v1/users succeeded');
  } catch (error) {
    console.log('✗ GET /v1/users failed:', error.message);
  }

  // Test 2: Try creating a service account
  console.log('\n--- Test 2: POST /v1/users (create service account) ---');
  try {
    await makeRequest('POST', '/v1/users', {
      username: 'test_service_account_001'
    });
    console.log('✓ POST /v1/users succeeded');
  } catch (error) {
    console.log('✗ POST /v1/users failed:', error.message);
  }

  console.log('\n' + '='.repeat(60));
}

testAPI().catch(console.error);
