#!/bin/sh
set -e

# Start Next.js app in the background
cd /app
node server.js &

# Start server
cd /app/server
npm run start 