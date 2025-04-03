#!/bin/bash

# Script to dynamically determine available PostgreSQL versions in AWS RDS
# and update the deployment script to use the latest available version

# First, find the deployment script
echo "Searching for the deployment script..."
DEPLOY_SCRIPT=$(find /home -name "deploy-aws-infrastructure.sh" 2>/dev/null | head -1)

if [ -z "$DEPLOY_SCRIPT" ]; then
    echo "Error: Could not find the deployment script. Please provide the full path to the script:"
    read -p "Path to deployment script: " DEPLOY_SCRIPT
    
    if [ ! -f "$DEPLOY_SCRIPT" ]; then
        echo "Error: The specified file does not exist."
        exit 1
    fi
fi

echo "Found deployment script at: $DEPLOY_SCRIPT"
BACKUP_SCRIPT="${DEPLOY_SCRIPT}.bak"

# Make a backup of the original script
cp "$DEPLOY_SCRIPT" "$BACKUP_SCRIPT"
echo "Created backup at: $BACKUP_SCRIPT"

# Get available PostgreSQL versions in the current region
echo "Checking available PostgreSQL versions in your AWS region..."
AVAILABLE_PG_VERSIONS=$(aws rds describe-db-engine-versions --engine postgres --query "DBEngineVersions[].EngineVersion" --output text)

if [ -z "$AVAILABLE_PG_VERSIONS" ]; then
    echo "Error: Could not retrieve available PostgreSQL versions. Please check your AWS credentials and region settings."
    exit 1
fi

# Sort versions and get the latest one
LATEST_PG_VERSION=$(echo $AVAILABLE_PG_VERSIONS | tr ' ' '\n' | sort -V | tail -n 1)

echo "Latest available PostgreSQL version in your region: $LATEST_PG_VERSION"

# Update the deployment script to use the latest available version
sed -i "s/--engine-version [0-9]\+\.[0-9]\+/--engine-version $LATEST_PG_VERSION/g" "$DEPLOY_SCRIPT"

echo "Deployment script updated to use PostgreSQL version $LATEST_PG_VERSION"
echo "Original script backed up at $BACKUP_SCRIPT"
echo "You can now run the deployment script with the correct PostgreSQL version for your region."
