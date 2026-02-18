#!/bin/bash

echo "Running database migrations..."
python -m alembic upgrade head || echo "WARNING: Alembic migration failed, tables will be created by app startup."

echo "Starting server..."
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
