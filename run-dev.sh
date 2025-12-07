#!/bin/bash

# Helper script to run the development server with Node v20
export PATH="/opt/homebrew/opt/node@20/bin:$PATH"

echo "🚀 Starting Analytics App with Node $(node --version)"
echo "📊 Server will be available at http://localhost:3000"
echo ""

npm run dev
