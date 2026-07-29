#!/bin/sh
set -e

echo "Running Payload migrations..."
node --import tsx/esm ./scripts/run-payload-migrations.mjs

echo "Seeding database (skips if data already exists)..."
node --import tsx/esm ./scripts/seed.ts || echo "Seed step failed or was skipped – continuing."

echo "Starting server..."
exec node server.js
