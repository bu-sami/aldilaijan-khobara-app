#!/bin/bash

# Database initialization script for Aldilaijan and Khobara Web Application
# This script creates the database and initializes the schema

set -e

echo "Initializing database for Aldilaijan and Khobara Web Application..."

# Check if Docker is running
if ! docker ps &> /dev/null; then
    echo "Docker is not running. Starting Docker services..."
    cd /home/ubuntu/aldilaijan-khobara-app/infrastructure/docker
    docker-compose up -d
    echo "Waiting for PostgreSQL to start..."
    sleep 10
fi

# Create database schema
echo "Creating database schema..."
docker exec -i aldilaijan-khobara-postgres psql -U postgres -d aldilaijan_khobara_dev < /home/ubuntu/aldilaijan-khobara-app/backend/database/schema.sql

echo "Database initialization completed successfully!"
