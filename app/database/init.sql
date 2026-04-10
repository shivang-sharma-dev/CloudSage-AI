-- CloudSage AI — PostgreSQL initialization script
-- This runs before Alembic migrations on fresh clusters

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "pgcrypto";     -- For gen_random_uuid()

-- Create database if it doesn't exist (handled by docker-compose env vars)
-- Grant privileges
-- (These are handled by POSTGRES_USER/POSTGRES_DB in docker-compose)

-- Set timezone
SET timezone = 'UTC';
