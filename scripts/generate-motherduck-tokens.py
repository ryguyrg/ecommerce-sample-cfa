#!/usr/bin/env python3

"""
Generate MotherDuck Service Accounts and Tokens

This script creates 12 service accounts (one per store) and generates
read_write tokens for each using the MotherDuck REST API.

Prerequisites:
- Python 3.6+
- requests library: pip install requests
- Admin token from MotherDuck

Usage:
    python scripts/generate-motherduck-tokens.py YOUR_ADMIN_TOKEN
"""

import sys
import os
import time
import requests
import json

MOTHERDUCK_API = "https://api.motherduck.com"
NUM_STORES = 12


def make_request(method, path, token, body=None):
    """Make an HTTPS request to MotherDuck API"""
    url = f"{MOTHERDUCK_API}{path}"
    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json",
    }

    print(f"\n{'='*60}")
    print(f"REQUEST: {method} {url}")
    print('='*60)
    print("\nRequest Headers:")
    for key, value in headers.items():
        if key == "Authorization":
            # Mask the token for security
            print(f"  {key}: Bearer {value[7:20]}...")
        else:
            print(f"  {key}: {value}")

    if body:
        print("\nRequest Body:")
        print(json.dumps(body, indent=2))

    try:
        if method == "POST":
            response = requests.post(url, headers=headers, json=body, timeout=30)
        elif method == "GET":
            response = requests.get(url, headers=headers, timeout=30)
        else:
            raise ValueError(f"Unsupported method: {method}")

        print(f"\n{'='*60}")
        print(f"RESPONSE: {response.status_code} {response.reason}")
        print('='*60)
        print("\nResponse Headers:")
        for key, value in response.headers.items():
            print(f"  {key}: {value}")

        print("\nResponse Body:")
        try:
            print(json.dumps(response.json(), indent=2))
        except:
            print(response.text)

        response.raise_for_status()
        return response.json()

    except requests.exceptions.RequestException as e:
        print(f"\n❌ Request failed: {e}")
        if hasattr(e, 'response') and e.response is not None:
            print(f"Response status: {e.response.status_code}")
            print(f"Response body: {e.response.text}")
        raise


def create_service_account(admin_token, store_id):
    """Create a service account for a store"""
    username = f"store_{store_id}_service"

    print(f"\n{'='*60}")
    print(f"Creating service account: {username}")
    print('='*60)

    try:
        response = make_request(
            "POST",
            "/v1/users",
            admin_token,
            {"username": username}
        )

        print(f"✓ Created service account: {username}")
        return username

    except Exception as e:
        print(f"✗ Failed to create service account {username}: {e}")
        raise


def generate_token(admin_token, username, store_id):
    """Generate a token for a service account"""
    token_name = f"store_{store_id}_token"

    print(f"\n{'='*60}")
    print(f"Generating token for: {username}")
    print('='*60)

    try:
        response = make_request(
            "POST",
            f"/v1/users/{username}/tokens",
            admin_token,
            {
                "name": token_name,
                "token_type": "read_write"
            }
        )

        # The token might be in 'token' or 'access_token' field
        token = response.get("token") or response.get("access_token")

        if not token:
            print(f"Warning: No token found in response. Full response: {response}")
            return None

        print(f"✓ Generated token for {username}")
        return token

    except Exception as e:
        print(f"✗ Failed to generate token for {username}: {e}")
        raise


def main():
    """Main function to generate all service accounts and tokens"""
    if len(sys.argv) < 2:
        print("Error: Admin token is required")
        print("Usage: python generate-motherduck-tokens.py YOUR_ADMIN_TOKEN")
        print("Or set MOTHERDUCK_ADMIN_TOKEN environment variable")
        sys.exit(1)

    admin_token = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("MOTHERDUCK_ADMIN_TOKEN")

    if not admin_token:
        print("Error: Admin token is required")
        sys.exit(1)

    print('='*60)
    print('MotherDuck Service Account & Token Generator')
    print('='*60)
    print(f"\nGenerating {NUM_STORES} service accounts and tokens...\n")

    results = []

    for store_id in range(1, NUM_STORES + 1):
        try:
            # Create service account
            username = create_service_account(admin_token, store_id)

            # Wait a bit to ensure account is fully created
            time.sleep(0.5)

            # Generate token
            token = generate_token(admin_token, username, store_id)

            if token:
                results.append({
                    "store_id": store_id,
                    "username": username,
                    "token": token
                })

            print()

        except Exception as e:
            print(f"Failed for store {store_id}: {e}")
            print()
            continue

    # Output results
    print('='*60)
    print('RESULTS')
    print('='*60)
    print(f"\n✓ Successfully generated tokens for {len(results)} stores\n")

    # Generate .env format
    print("Add these to your .env file:")
    print('-'*60)
    for result in results:
        print(f"STORE_{result['store_id']}_TOKEN={result['token']}")
    print('-'*60)

    # Generate summary table
    print("\n\nSummary:")
    print('-'*60)
    for result in results:
        print(f"Store {result['store_id']}: {result['username']}")
    print('-'*60)

    print("\n✓ Done! Copy the tokens above to your .env file")
    print("\nNext steps:")
    print("1. Create databases in MotherDuck for each store:")
    print("   CREATE DATABASE store_1; CREATE DATABASE store_2; etc.")
    print("2. Grant access to each service account")
    print("3. Load sample data using data/schema.sql and data/seed-*.sql")


if __name__ == "__main__":
    main()
