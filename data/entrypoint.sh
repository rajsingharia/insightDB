#!/bin/bash

# Wait for PostgreSQL to be ready
./wait-for-it.sh postgres:5432 -- echo "PostgreSQL is up"

# Apply Prisma migrations
npx prisma migrate deploy

# Execute the main application process
exec npm start
