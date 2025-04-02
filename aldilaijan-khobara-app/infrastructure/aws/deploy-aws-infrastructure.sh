#!/bin/bash

# AWS Deployment Script for Aldilaijan-Khobara Web Application
# This script sets up the AWS infrastructure for the application

# Exit on error
set -e

echo "Starting AWS cloud-native deployment for Aldilaijan-Khobara Web Application..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Installing..."
    curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    unzip awscliv2.zip
    sudo ./aws/install
    rm -rf aws awscliv2.zip
fi

# Check if AWS credentials are configured
if ! aws sts get-caller-identity &> /dev/null; then
    echo "AWS credentials not configured. Please run 'aws configure' to set up your credentials."
    exit 1
fi

# Set variables
AWS_REGION="me-south-1"  # Middle East (Bahrain) region
APP_NAME="aldilaijan-khobara"
ENV="production"
VPC_CIDR="10.0.0.0/16"
PUBLIC_SUBNET_1_CIDR="10.0.1.0/24"
PUBLIC_SUBNET_2_CIDR="10.0.2.0/24"
PRIVATE_SUBNET_1_CIDR="10.0.3.0/24"
PRIVATE_SUBNET_2_CIDR="10.0.4.0/24"
DB_SUBNET_1_CIDR="10.0.5.0/24"
DB_SUBNET_2_CIDR="10.0.6.0/24"
EC2_INSTANCE_TYPE="t3.medium"
RDS_INSTANCE_TYPE="db.t3.medium"
ELASTICACHE_NODE_TYPE="cache.t3.medium"

echo "Setting AWS region to $AWS_REGION..."
aws configure set default.region $AWS_REGION

# Create VPC
echo "Creating VPC..."
VPC_ID=$(aws ec2 create-vpc \
    --cidr-block $VPC_CIDR \
    --tag-specifications "ResourceType=vpc,Tags=[{Key=Name,Value=$APP_NAME-vpc},{Key=Environment,Value=$ENV}]" \
    --query 'Vpc.VpcId' \
    --output text)
echo "VPC created with ID: $VPC_ID"

# Enable DNS hostnames for the VPC
aws ec2 modify-vpc-attribute \
    --vpc-id $VPC_ID \
    --enable-dns-hostnames "{\"Value\":true}"

# Create Internet Gateway
echo "Creating Internet Gateway..."
IGW_ID=$(aws ec2 create-internet-gateway \
    --tag-specifications "ResourceType=internet-gateway,Tags=[{Key=Name,Value=$APP_NAME-igw},{Key=Environment,Value=$ENV}]" \
    --query 'InternetGateway.InternetGatewayId' \
    --output text)
echo "Internet Gateway created with ID: $IGW_ID"

# Attach Internet Gateway to VPC
echo "Attaching Internet Gateway to VPC..."
aws ec2 attach-internet-gateway \
    --internet-gateway-id $IGW_ID \
    --vpc-id $VPC_ID

# Create public subnets
echo "Creating public subnets..."
PUBLIC_SUBNET_1_ID=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block $PUBLIC_SUBNET_1_CIDR \
    --availability-zone "${AWS_REGION}a" \
    --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$APP_NAME-public-subnet-1},{Key=Environment,Value=$ENV}]" \
    --query 'Subnet.SubnetId' \
    --output text)
echo "Public Subnet 1 created with ID: $PUBLIC_SUBNET_1_ID"

PUBLIC_SUBNET_2_ID=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block $PUBLIC_SUBNET_2_CIDR \
    --availability-zone "${AWS_REGION}b" \
    --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$APP_NAME-public-subnet-2},{Key=Environment,Value=$ENV}]" \
    --query 'Subnet.SubnetId' \
    --output text)
echo "Public Subnet 2 created with ID: $PUBLIC_SUBNET_2_ID"

# Create private subnets
echo "Creating private subnets..."
PRIVATE_SUBNET_1_ID=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block $PRIVATE_SUBNET_1_CIDR \
    --availability-zone "${AWS_REGION}a" \
    --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$APP_NAME-private-subnet-1},{Key=Environment,Value=$ENV}]" \
    --query 'Subnet.SubnetId' \
    --output text)
echo "Private Subnet 1 created with ID: $PRIVATE_SUBNET_1_ID"

PRIVATE_SUBNET_2_ID=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block $PRIVATE_SUBNET_2_CIDR \
    --availability-zone "${AWS_REGION}b" \
    --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$APP_NAME-private-subnet-2},{Key=Environment,Value=$ENV}]" \
    --query 'Subnet.SubnetId' \
    --output text)
echo "Private Subnet 2 created with ID: $PRIVATE_SUBNET_2_ID"

# Create database subnets
echo "Creating database subnets..."
DB_SUBNET_1_ID=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block $DB_SUBNET_1_CIDR \
    --availability-zone "${AWS_REGION}a" \
    --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$APP_NAME-db-subnet-1},{Key=Environment,Value=$ENV}]" \
    --query 'Subnet.SubnetId' \
    --output text)
echo "Database Subnet 1 created with ID: $DB_SUBNET_1_ID"

DB_SUBNET_2_ID=$(aws ec2 create-subnet \
    --vpc-id $VPC_ID \
    --cidr-block $DB_SUBNET_2_CIDR \
    --availability-zone "${AWS_REGION}b" \
    --tag-specifications "ResourceType=subnet,Tags=[{Key=Name,Value=$APP_NAME-db-subnet-2},{Key=Environment,Value=$ENV}]" \
    --query 'Subnet.SubnetId' \
    --output text)
echo "Database Subnet 2 created with ID: $DB_SUBNET_2_ID"

# Create public route table
echo "Creating public route table..."
PUBLIC_RT_ID=$(aws ec2 create-route-table \
    --vpc-id $VPC_ID \
    --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=$APP_NAME-public-rt},{Key=Environment,Value=$ENV}]" \
    --query 'RouteTable.RouteTableId' \
    --output text)
echo "Public Route Table created with ID: $PUBLIC_RT_ID"

# Create route to Internet Gateway
echo "Creating route to Internet Gateway..."
aws ec2 create-route \
    --route-table-id $PUBLIC_RT_ID \
    --destination-cidr-block 0.0.0.0/0 \
    --gateway-id $IGW_ID

# Associate public subnets with public route table
echo "Associating public subnets with public route table..."
aws ec2 associate-route-table \
    --route-table-id $PUBLIC_RT_ID \
    --subnet-id $PUBLIC_SUBNET_1_ID

aws ec2 associate-route-table \
    --route-table-id $PUBLIC_RT_ID \
    --subnet-id $PUBLIC_SUBNET_2_ID

# Create NAT Gateway for private subnets
echo "Creating Elastic IP for NAT Gateway..."
EIP_ID=$(aws ec2 allocate-address \
    --domain vpc \
    --tag-specifications "ResourceType=elastic-ip,Tags=[{Key=Name,Value=$APP_NAME-nat-eip},{Key=Environment,Value=$ENV}]" \
    --query 'AllocationId' \
    --output text)
echo "Elastic IP created with ID: $EIP_ID"

echo "Creating NAT Gateway..."
NAT_GW_ID=$(aws ec2 create-nat-gateway \
    --subnet-id $PUBLIC_SUBNET_1_ID \
    --allocation-id $EIP_ID \
    --tag-specifications "ResourceType=natgateway,Tags=[{Key=Name,Value=$APP_NAME-nat-gw},{Key=Environment,Value=$ENV}]" \
    --query 'NatGateway.NatGatewayId' \
    --output text)
echo "NAT Gateway created with ID: $NAT_GW_ID"

# Wait for NAT Gateway to become available
echo "Waiting for NAT Gateway to become available..."
aws ec2 wait nat-gateway-available --nat-gateway-ids $NAT_GW_ID

# Create private route table
echo "Creating private route table..."
PRIVATE_RT_ID=$(aws ec2 create-route-table \
    --vpc-id $VPC_ID \
    --tag-specifications "ResourceType=route-table,Tags=[{Key=Name,Value=$APP_NAME-private-rt},{Key=Environment,Value=$ENV}]" \
    --query 'RouteTable.RouteTableId' \
    --output text)
echo "Private Route Table created with ID: $PRIVATE_RT_ID"

# Create route to NAT Gateway
echo "Creating route to NAT Gateway..."
aws ec2 create-route \
    --route-table-id $PRIVATE_RT_ID \
    --destination-cidr-block 0.0.0.0/0 \
    --nat-gateway-id $NAT_GW_ID

# Associate private subnets with private route table
echo "Associating private subnets with private route table..."
aws ec2 associate-route-table \
    --route-table-id $PRIVATE_RT_ID \
    --subnet-id $PRIVATE_SUBNET_1_ID

aws ec2 associate-route-table \
    --route-table-id $PRIVATE_RT_ID \
    --subnet-id $PRIVATE_SUBNET_2_ID

aws ec2 associate-route-table \
    --route-table-id $PRIVATE_RT_ID \
    --subnet-id $DB_SUBNET_1_ID

aws ec2 associate-route-table \
    --route-table-id $PRIVATE_RT_ID \
    --subnet-id $DB_SUBNET_2_ID

# Create security groups
echo "Creating security groups..."

# Security group for application load balancer
echo "Creating ALB security group..."
ALB_SG_ID=$(aws ec2 create-security-group \
    --group-name "$APP_NAME-alb-sg" \
    --description "Security group for $APP_NAME application load balancer" \
    --vpc-id $VPC_ID \
    --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$APP_NAME-alb-sg},{Key=Environment,Value=$ENV}]" \
    --query 'GroupId' \
    --output text)
echo "ALB Security Group created with ID: $ALB_SG_ID"

# Allow HTTP and HTTPS traffic to ALB
aws ec2 authorize-security-group-ingress \
    --group-id $ALB_SG_ID \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-id $ALB_SG_ID \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0

# Security group for EC2 instances
echo "Creating EC2 security group..."
EC2_SG_ID=$(aws ec2 create-security-group \
    --group-name "$APP_NAME-ec2-sg" \
    --description "Security group for $APP_NAME EC2 instances" \
    --vpc-id $VPC_ID \
    --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$APP_NAME-ec2-sg},{Key=Environment,Value=$ENV}]" \
    --query 'GroupId' \
    --output text)
echo "EC2 Security Group created with ID: $EC2_SG_ID"

# Allow traffic from ALB to EC2 instances
aws ec2 authorize-security-group-ingress \
    --group-id $EC2_SG_ID \
    --protocol tcp \
    --port 3000 \
    --source-group $ALB_SG_ID

# Security group for RDS
echo "Creating RDS security group..."
RDS_SG_ID=$(aws ec2 create-security-group \
    --group-name "$APP_NAME-rds-sg" \
    --description "Security group for $APP_NAME RDS instances" \
    --vpc-id $VPC_ID \
    --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$APP_NAME-rds-sg},{Key=Environment,Value=$ENV}]" \
    --query 'GroupId' \
    --output text)
echo "RDS Security Group created with ID: $RDS_SG_ID"

# Allow PostgreSQL traffic from EC2 instances to RDS
aws ec2 authorize-security-group-ingress \
    --group-id $RDS_SG_ID \
    --protocol tcp \
    --port 5432 \
    --source-group $EC2_SG_ID

# Security group for ElastiCache
echo "Creating ElastiCache security group..."
ELASTICACHE_SG_ID=$(aws ec2 create-security-group \
    --group-name "$APP_NAME-elasticache-sg" \
    --description "Security group for $APP_NAME ElastiCache clusters" \
    --vpc-id $VPC_ID \
    --tag-specifications "ResourceType=security-group,Tags=[{Key=Name,Value=$APP_NAME-elasticache-sg},{Key=Environment,Value=$ENV}]" \
    --query 'GroupId' \
    --output text)
echo "ElastiCache Security Group created with ID: $ELASTICACHE_SG_ID"

# Allow Redis traffic from EC2 instances to ElastiCache
aws ec2 authorize-security-group-ingress \
    --group-id $ELASTICACHE_SG_ID \
    --protocol tcp \
    --port 6379 \
    --source-group $EC2_SG_ID

# Create DB subnet group
echo "Creating DB subnet group..."
aws rds create-db-subnet-group \
    --db-subnet-group-name "$APP_NAME-db-subnet-group" \
    --db-subnet-group-description "Subnet group for $APP_NAME RDS instances" \
    --subnet-ids "$DB_SUBNET_1_ID" "$DB_SUBNET_2_ID" \
    --tags "Key=Name,Value=$APP_NAME-db-subnet-group" "Key=Environment,Value=$ENV"
echo "DB Subnet Group created"

# Create ElastiCache subnet group
echo "Creating ElastiCache subnet group..."
aws elasticache create-cache-subnet-group \
    --cache-subnet-group-name "$APP_NAME-cache-subnet-group" \
    --cache-subnet-group-description "Subnet group for $APP_NAME ElastiCache clusters" \
    --subnet-ids "$PRIVATE_SUBNET_1_ID" "$PRIVATE_SUBNET_2_ID"
echo "ElastiCache Subnet Group created"

# Create RDS instance
echo "Creating RDS instance..."
aws rds create-db-instance \
    --db-instance-identifier "$APP_NAME-db" \
    --db-instance-class $RDS_INSTANCE_TYPE \
    --engine postgres \
    --engine-version 14.5 \
    --allocated-storage 20 \
    --storage-type gp2 \
    --master-username "dbadmin" \
    --master-user-password "TemporaryPassword123!" \
    --db-name "aldilaijankhobara" \
    --vpc-security-group-ids $RDS_SG_ID \
    --db-subnet-group-name "$APP_NAME-db-subnet-group" \
    --backup-retention-period 7 \
    --multi-az \
    --storage-encrypted \
    --tags "Key=Name,Value=$APP_NAME-db" "Key=Environment,Value=$ENV"
echo "RDS instance creation initiated"

# Create ElastiCache Redis cluster
echo "Creating ElastiCache Redis cluster..."
aws elasticache create-cache-cluster \
    --cache-cluster-id "$APP_NAME-redis" \
    --engine redis \
    --cache-node-type $ELASTICACHE_NODE_TYPE \
    --num-cache-nodes 1 \
    --cache-subnet-group-name "$APP_NAME-cache-subnet-group" \
    --security-group-ids $ELASTICACHE_SG_ID \
    --tags "Key=Name,Value=$APP_NAME-redis" "Key=Environment,Value=$ENV"
echo "ElastiCache Redis cluster creation initiated"

# Create S3 bucket for static assets
echo "Creating S3 bucket for static assets..."
S3_BUCKET_NAME="$APP_NAME-static-assets-$(date +%s)"
aws s3api create-bucket \
    --bucket $S3_BUCKET_NAME \
    --region $AWS_REGION \
    --create-bucket-configuration LocationConstraint=$AWS_REGION
echo "S3 bucket created: $S3_BUCKET_NAME"

# Enable S3 bucket encryption
aws s3api put-bucket-encryption \
    --bucket $S3_BUCKET_NAME \
    --server-side-encryption-configuration '{"Rules": [{"ApplyServerSideEncryptionByDefault": {"SSEAlgorithm": "AES256"}}]}'

# Create CloudFront distribution for S3 bucket
echo "Creating CloudFront distribution for S3 bucket..."
CLOUDFRONT_DISTRIBUTION_ID=$(aws cloudfront create-distribution \
    --origin-domain-name "$S3_BUCKET_NAME.s3.$AWS_REGION.amazonaws.com" \
    --default-root-object "index.html" \
    --enabled \
    --default-cache-behavior '{"TargetOriginId":"'$S3_BUCKET_NAME'","ViewerProtocolPolicy":"redirect-to-https","AllowedMethods":{"Quantity":2,"Items":["GET","HEAD"]},"CachedMethods":{"Quantity":2,"Items":["GET","HEAD"]},"ForwardedValues":{"QueryString":false,"Cookies":{"Forward":"none"}},"MinTTL":0,"DefaultTTL":86400,"MaxTTL":31536000}' \
    --query 'Distribution.Id' \
    --output text)
echo "CloudFront distribution created with ID: $CLOUDFRONT_DISTRIBUTION_ID"

# Create Application Load Balancer
echo "Creating Application Load Balancer..."
ALB_ARN=$(aws elbv2 create-load-balancer \
    --name "$APP_NAME-alb" \
    --subnets $PUBLIC_SUBNET_1_ID $PUBLIC_SUBNET_2_ID \
    --security-groups $ALB_SG_ID \
    --scheme internet-facing \
    --type application \
    --tags "Key=Name,Value=$APP_NAME-alb" "Key=Environment,Value=$ENV" \
    --query 'LoadBalancers[0].LoadBalancerArn' \
    --output text)
echo "Application Load Balancer created with ARN: $ALB_ARN"

# Create target group for API
echo "Creating target group for API..."
API_TG_ARN=$(aws elbv2 create-target-group \
    --name "$APP_NAME-api-tg" \
    --protocol HTTP \
    --port 3000 \
    --vpc-id $VPC_ID \
    --health-check-protocol HTTP \
    --health-check-path "/api/health" \
    --health-check-interval-seconds 30 \
    --health-check-timeout-seconds 5 \
    --healthy-threshold-count 2 \
    --unhealthy-threshold-count 2 \
    --target-type instance \
    --tags "Key=Name,Value=$APP_NAME-api-tg" "Key=Environment,Value=$ENV" \
    --query 'TargetGroups[0].TargetGroupArn' \
    --output text)
echo "API Target Group created with ARN: $API_TG_ARN"

# Create listener for HTTP (redirect to HTTPS)
echo "Creating HTTP listener (redirect to HTTPS)..."
HTTP_LISTENER_ARN=$(aws elbv2 create-listener \
    --load-balancer-arn $ALB_ARN \
    --protocol HTTP \
    --port 80 \
    --default-actions Type=redirect,RedirectConfig="{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}" \
    --query 'Listeners[0].ListenerArn' \
    --output text)
echo "HTTP Listener created with ARN: $HTTP_LISTENER_ARN"

# Create IAM role for EC2 instances
echo "Creating IAM role for EC2 instances..."
aws iam create-role \
    --role-name "$APP_NAME-ec2-role" \
    --assume-role-policy-document '{"Version":"2012-10-17","Statement":[{"Effect":"Allow","Principal":{"Service":"ec2.amazonaws.com"},"Action":"sts:AssumeRole"}]}'
echo "IAM role created: $APP_NAME-ec2-role"

# Attach policies to IAM role
echo "Attaching policies to IAM role..."
aws iam attach-role-policy \
    --role-name "$APP_NAME-ec2-role" \
    --policy-arn arn:aws:iam::aws:policy/AmazonS3ReadOnlyAccess

aws iam attach-role-policy \
    --role-name "$APP_NAME-ec2-role" \
    --policy-arn arn:aws:iam::aws:policy/AmazonSSMManagedInstanceCore

# Create instance profile
echo "Creating instance profile..."
aws iam create-instance-profile \
    --instance-profile-name "$APP_NAME-ec2-instance-profile"
echo "Instance profile created: $APP_NAME-ec2-instance-profile"

# Add role to instance profile
echo "Adding role to instance profile..."
aws iam add-role-to-instance-profile \
    --instance-profile-name "$APP_NAME-ec2-instance-profile" \
    --role-name "$APP_NAME-ec2-role"

# Wait for RDS instance to become available
echo "Waiting for RDS instance to become available (this may take several minutes)..."
aws rds wait db-instance-available --db-instance-identifier "$APP_NAME-db"
echo "RDS instance is now available"

# Get RDS endpoint
RDS_ENDPOINT=$(aws rds describe-db-instances \
    --db-instance-identifier "$APP_NAME-db" \
    --query 'DBInstances[0].Endpoint.Address' \
    --output text)
echo "RDS endpoint: $RDS_ENDPOINT"

# Wait for ElastiCache cluster to become available
echo "Waiting for ElastiCache cluster to become available (this may take several minutes)..."
aws elasticache wait cache-cluster-available --cache-cluster-id "$APP_NAME-redis"
echo "ElastiCache cluster is now available"

# Get ElastiCache endpoint
ELASTICACHE_ENDPOINT=$(aws elasticache describe-cache-clusters \
    --cache-cluster-id "$APP_NAME-redis" \
    --show-cache-node-info \
    --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address' \
    --output text)
echo "ElastiCache endpoint: $ELASTICACHE_ENDPOINT"

echo "AWS infrastructure setup completed successfully!"
echo ""
echo "Summary of resources created:"
echo "- VPC: $VPC_ID"
echo "- RDS Database Endpoint: $RDS_ENDPOINT"
echo "- ElastiCache Redis Endpoint: $ELASTICACHE_ENDPOINT"
echo "- S3 Bucket for Static Assets: $S3_BUCKET_NAME"
echo "- CloudFront Distribution ID: $CLOUDFRONT_DISTRIBUTION_ID"
echo "- Application Load Balancer ARN: $ALB_ARN"
echo ""
echo "Next steps:"
echo "1. Deploy the application code to EC2 instances"
echo "2. Configure the application with the correct environment variables"
echo "3. Set up CI/CD pipeline for automated deployments"
echo "4. Configure DNS and SSL certificates"
echo ""
echo "Deployment script completed!"
