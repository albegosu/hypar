#!/bin/sh
set -e

# Run database migrations before starting the server
echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting server..."
exec "$@"
