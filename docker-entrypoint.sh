#!/bin/sh
set -e

if [ -z "$DATABASE_URL" ]; then
  echo "Error: DATABASE_URL is not set."
  echo "On Railway (or any host), set DATABASE_URL to your PostgreSQL connection string."
  echo "If you use Railway Postgres: add a Postgres service, then copy its DATABASE_URL into this service's variables (or link the service so the variable is injected)."
  exit 1
fi

# Run database migrations before starting the server
echo "Running database migrations..."
npx prisma migrate deploy

echo "Starting server..."
exec "$@"
