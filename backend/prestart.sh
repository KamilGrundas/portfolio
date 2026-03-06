#!/bin/bash

set -e

echo "Waiting for PostgreSQL..."
until nc -z db 5432; do
  echo "PostgreSQL is unavailable - sleeping"
  sleep 1
done

echo "PostgreSQL is ready!"
echo "Creating initial data..."
python -m app.initial_data

echo "Starting application..."
exec uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload