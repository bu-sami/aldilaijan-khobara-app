#!/bin/bash

# Database backup script for Aldilaijan and Khobara Web Application
# This script creates a backup of the PostgreSQL database

set -e

# Configuration
BACKUP_DIR="/home/ubuntu/aldilaijan-khobara-app/backups"
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
BACKUP_FILE="$BACKUP_DIR/aldilaijan_khobara_backup_$TIMESTAMP.sql"

# Create backup directory if it doesn't exist
mkdir -p $BACKUP_DIR

echo "Creating database backup for Aldilaijan and Khobara Web Application..."

# Check if Docker is running
if ! docker ps &> /dev/null; then
    echo "Docker is not running. Please start Docker services first."
    exit 1
fi

# Create backup
echo "Backing up database to $BACKUP_FILE..."
docker exec aldilaijan-khobara-postgres pg_dump -U postgres -d aldilaijan_khobara_dev > $BACKUP_FILE

# Compress backup
echo "Compressing backup file..."
gzip $BACKUP_FILE

echo "Database backup completed successfully: ${BACKUP_FILE}.gz"

# Clean up old backups (keep last 7 days)
echo "Cleaning up old backups..."
find $BACKUP_DIR -name "aldilaijan_khobara_backup_*.sql.gz" -type f -mtime +7 -delete

echo "Backup process completed!"
