#!/bin/bash

# Script to modify the AWS deployment script to check for existing VPCs before creating new ones

# Path to the original deployment script
ORIGINAL_SCRIPT="/home/ubuntu/aldilaijan-khobara-app/infrastructure/aws/deploy-aws-infrastructure.sh"
MODIFIED_SCRIPT="/home/ubuntu/aldilaijan-khobara-app/infrastructure/aws/deploy-aws-infrastructure-idempotent.sh"

# Create a copy of the original script
cp $ORIGINAL_SCRIPT $MODIFIED_SCRIPT

# Replace the VPC creation section with a check for existing VPCs
sed -i '/# Create VPC/,/echo "VPC created with ID: \$VPC_ID"/c\
# Create VPC or use existing one with the same name\
echo "Checking if VPC with name $APP_NAME-vpc already exists..."\
EXISTING_VPC_ID=$(aws ec2 describe-vpcs --filters "Name=tag:Name,Values=$APP_NAME-vpc" --query "Vpcs[0].VpcId" --output text)\
\
if [ "$EXISTING_VPC_ID" != "None" ] && [ ! -z "$EXISTING_VPC_ID" ]; then\
    echo "Using existing VPC: $EXISTING_VPC_ID"\
    VPC_ID=$EXISTING_VPC_ID\
else\
    echo "Creating new VPC..."\
    VPC_ID=$(aws ec2 create-vpc \\\
        --cidr-block $VPC_CIDR \\\
        --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=$APP_NAME-vpc},{Key=Environment,Value=$ENV}]" \\\
        --query '"Vpc.VpcId"' \\\
        --output text)\
    echo "VPC created with ID: $VPC_ID"\
\
    # Enable DNS hostnames for the VPC\
    aws ec2 modify-vpc-attribute \\\
        --vpc-id $VPC_ID \\\
        --enable-dns-hostnames "{\\\"Value\\\":true}"\
fi' $MODIFIED_SCRIPT

echo "Modified script created at $MODIFIED_SCRIPT"
echo "The script now checks for existing VPCs with the same name before creating a new one."
