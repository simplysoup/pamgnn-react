#!/bin/sh
set -e

echo "Running Payload migrations..."
node --import tsx/esm ./scripts/run-payload-migrations.mjs

echo "Starting server..."
exec node server.js
