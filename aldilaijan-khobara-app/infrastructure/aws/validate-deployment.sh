#!/bin/bash

# Validation Script for Aldilaijan-Khobara Web Application
# This script validates the deployed application by checking various components

# Exit on error
set -e

echo "Starting validation of Aldilaijan-Khobara Web Application..."

# Set variables
AWS_REGION="me-south-1"  # Middle East (Bahrain) region
APP_NAME="aldilaijan-khobara"
ENV="production"

echo "Setting AWS region to $AWS_REGION..."
aws configure set default.region $AWS_REGION

# Function to check if a URL is accessible
check_url() {
    local url=$1
    local description=$2
    echo "Checking $description..."
    
    if curl -s -o /dev/null -w "%{http_code}" "$url" | grep -q "200\|301\|302"; then
        echo "✅ $description is accessible"
        return 0
    else
        echo "❌ $description is not accessible"
        return 1
    fi
}

# Function to check AWS resource status
check_aws_resource() {
    local resource_type=$1
    local resource_id=$2
    local description=$3
    
    echo "Checking $description..."
    
    case $resource_type in
        "rds")
            status=$(aws rds describe-db-instances --db-instance-identifier "$resource_id" --query 'DBInstances[0].DBInstanceStatus' --output text)
            if [ "$status" == "available" ]; then
                echo "✅ $description is available (Status: $status)"
                return 0
            else
                echo "❌ $description is not available (Status: $status)"
                return 1
            fi
            ;;
        "elasticache")
            status=$(aws elasticache describe-cache-clusters --cache-cluster-id "$resource_id" --query 'CacheClusters[0].CacheClusterStatus' --output text)
            if [ "$status" == "available" ]; then
                echo "✅ $description is available (Status: $status)"
                return 0
            else
                echo "❌ $description is not available (Status: $status)"
                return 1
            fi
            ;;
        "ecs-service")
            status=$(aws ecs describe-services --cluster "$APP_NAME-cluster" --services "$resource_id" --query 'services[0].status' --output text)
            desired_count=$(aws ecs describe-services --cluster "$APP_NAME-cluster" --services "$resource_id" --query 'services[0].desiredCount' --output text)
            running_count=$(aws ecs describe-services --cluster "$APP_NAME-cluster" --services "$resource_id" --query 'services[0].runningCount' --output text)
            
            if [ "$status" == "ACTIVE" ] && [ "$desired_count" == "$running_count" ]; then
                echo "✅ $description is running (Status: $status, Running: $running_count/$desired_count)"
                return 0
            else
                echo "❌ $description is not fully running (Status: $status, Running: $running_count/$desired_count)"
                return 1
            fi
            ;;
        "cloudfront")
            status=$(aws cloudfront get-distribution --id "$resource_id" --query 'Distribution.Status' --output text)
            if [ "$status" == "Deployed" ]; then
                echo "✅ $description is deployed (Status: $status)"
                return 0
            else
                echo "❌ $description is not deployed (Status: $status)"
                return 1
            fi
            ;;
        "alb")
            state=$(aws elbv2 describe-load-balancers --names "$resource_id" --query 'LoadBalancers[0].State.Code' --output text)
            if [ "$state" == "active" ]; then
                echo "✅ $description is active (State: $state)"
                return 0
            else
                echo "❌ $description is not active (State: $state)"
                return 1
            fi
            ;;
        *)
            echo "Unknown resource type: $resource_type"
            return 1
            ;;
    esac
}

# Function to check database connectivity
check_database_connectivity() {
    echo "Checking database connectivity..."
    
    # Get RDS endpoint
    RDS_ENDPOINT=$(aws rds describe-db-instances --db-instance-identifier "$APP_NAME-db" --query 'DBInstances[0].Endpoint.Address' --output text)
    
    # Check if psql is installed
    if ! command -v psql &> /dev/null; then
        echo "❌ psql is not installed. Cannot check database connectivity directly."
        return 1
    fi
    
    # Try to connect to the database
    if PGPASSWORD="TemporaryPassword123!" psql -h "$RDS_ENDPOINT" -U dbadmin -d aldilaijankhobara -c "SELECT 1" &> /dev/null; then
        echo "✅ Database connection successful"
        return 0
    else
        echo "❌ Database connection failed"
        return 1
    fi
}

# Function to check Redis connectivity
check_redis_connectivity() {
    echo "Checking Redis connectivity..."
    
    # Get ElastiCache endpoint
    ELASTICACHE_ENDPOINT=$(aws elasticache describe-cache-clusters --cache-cluster-id "$APP_NAME-redis" --show-cache-node-info --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address' --output text)
    
    # Check if redis-cli is installed
    if ! command -v redis-cli &> /dev/null; then
        echo "❌ redis-cli is not installed. Cannot check Redis connectivity directly."
        return 1
    fi
    
    # Try to connect to Redis
    if redis-cli -h "$ELASTICACHE_ENDPOINT" ping | grep -q "PONG"; then
        echo "✅ Redis connection successful"
        return 0
    else
        echo "❌ Redis connection failed"
        return 1
    fi
}

# Function to check API health
check_api_health() {
    echo "Checking API health..."
    
    # Get ALB DNS name
    ALB_DNS_NAME=$(aws elbv2 describe-load-balancers --names "$APP_NAME-alb" --query 'LoadBalancers[0].DNSName' --output text)
    
    # Check API health endpoint
    if curl -s -o /dev/null -w "%{http_code}" "http://$ALB_DNS_NAME/api/health" | grep -q "200"; then
        echo "✅ API health check successful"
        return 0
    else
        echo "❌ API health check failed"
        return 1
    fi
}

# Function to check S3 bucket accessibility
check_s3_bucket() {
    echo "Checking S3 bucket accessibility..."
    
    # Get S3 bucket name
    S3_BUCKET_NAME=$(aws s3api list-buckets --query "Buckets[?starts_with(Name, '$APP_NAME-static-assets')].Name" --output text)
    
    # Check if bucket exists
    if aws s3api head-bucket --bucket "$S3_BUCKET_NAME" 2>/dev/null; then
        echo "✅ S3 bucket exists and is accessible"
        return 0
    else
        echo "❌ S3 bucket does not exist or is not accessible"
        return 1
    fi
}

# Function to check CloudFront distribution
check_cloudfront_distribution() {
    echo "Checking CloudFront distribution..."
    
    # Get CloudFront distribution ID
    CLOUDFRONT_DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Origins.Items[0].DomainName, '$APP_NAME-static-assets')].Id" --output text)
    
    # Get CloudFront domain name
    CLOUDFRONT_DOMAIN=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Origins.Items[0].DomainName, '$APP_NAME-static-assets')].DomainName" --output text)
    
    # Check if distribution is deployed
    check_aws_resource "cloudfront" "$CLOUDFRONT_DISTRIBUTION_ID" "CloudFront distribution"
    
    # Check if frontend assets are accessible
    check_url "https://$CLOUDFRONT_DOMAIN/admin/" "Admin Panel"
    check_url "https://$CLOUDFRONT_DOMAIN/aldilaijan/" "Aldilaijan Client Portal"
    check_url "https://$CLOUDFRONT_DOMAIN/khobara/" "Khobara Client Portal"
}

# Function to check ECS service
check_ecs_service() {
    echo "Checking ECS service..."
    
    # Check if ECS cluster exists
    if aws ecs describe-clusters --clusters "$APP_NAME-cluster" --query "clusters[0].clusterName" --output text &> /dev/null; then
        echo "✅ ECS cluster exists"
        
        # Check ECS service status
        check_aws_resource "ecs-service" "$APP_NAME-service" "ECS service"
        
        # Check ECS tasks
        RUNNING_TASKS=$(aws ecs list-tasks --cluster "$APP_NAME-cluster" --service-name "$APP_NAME-service" --desired-status RUNNING --query 'taskArns' --output text)
        
        if [ -n "$RUNNING_TASKS" ]; then
            TASK_COUNT=$(echo "$RUNNING_TASKS" | wc -w)
            echo "✅ $TASK_COUNT ECS tasks are running"
        else
            echo "❌ No ECS tasks are running"
            return 1
        fi
        
        return 0
    else
        echo "❌ ECS cluster does not exist"
        return 1
    fi
}

# Function to check ALB
check_alb() {
    echo "Checking Application Load Balancer..."
    
    # Check ALB status
    check_aws_resource "alb" "$APP_NAME-alb" "Application Load Balancer"
    
    # Get ALB DNS name
    ALB_DNS_NAME=$(aws elbv2 describe-load-balancers --names "$APP_NAME-alb" --query 'LoadBalancers[0].DNSName' --output text)
    
    # Check if ALB is accessible
    check_url "http://$ALB_DNS_NAME/" "ALB endpoint"
}

# Function to check security groups
check_security_groups() {
    echo "Checking security groups..."
    
    # Get VPC ID
    VPC_ID=$(aws ec2 describe-vpcs --filters "Name=tag:Name,Values=$APP_NAME-vpc" --query 'Vpcs[0].VpcId' --output text)
    
    # Check if security groups exist
    ALB_SG_EXISTS=$(aws ec2 describe-security-groups --filters "Name=vpc-id,Values=$VPC_ID" "Name=tag:Name,Values=$APP_NAME-alb-sg" --query 'SecurityGroups[0].GroupId' --output text)
    EC2_SG_EXISTS=$(aws ec2 describe-security-groups --filters "Name=vpc-id,Values=$VPC_ID" "Name=tag:Name,Values=$APP_NAME-ec2-sg" --query 'SecurityGroups[0].GroupId' --output text)
    RDS_SG_EXISTS=$(aws ec2 describe-security-groups --filters "Name=vpc-id,Values=$VPC_ID" "Name=tag:Name,Values=$APP_NAME-rds-sg" --query 'SecurityGroups[0].GroupId' --output text)
    ELASTICACHE_SG_EXISTS=$(aws ec2 describe-security-groups --filters "Name=vpc-id,Values=$VPC_ID" "Name=tag:Name,Values=$APP_NAME-elasticache-sg" --query 'SecurityGroups[0].GroupId' --output text)
    
    if [ -n "$ALB_SG_EXISTS" ]; then
        echo "✅ ALB security group exists"
    else
        echo "❌ ALB security group does not exist"
    fi
    
    if [ -n "$EC2_SG_EXISTS" ]; then
        echo "✅ EC2 security group exists"
    else
        echo "❌ EC2 security group does not exist"
    fi
    
    if [ -n "$RDS_SG_EXISTS" ]; then
        echo "✅ RDS security group exists"
    else
        echo "❌ RDS security group does not exist"
    fi
    
    if [ -n "$ELASTICACHE_SG_EXISTS" ]; then
        echo "✅ ElastiCache security group exists"
    else
        echo "❌ ElastiCache security group does not exist"
    fi
}

# Main validation process
echo "Starting validation checks..."

# Check AWS resources
echo -e "\n=== AWS Infrastructure Validation ==="
check_aws_resource "rds" "$APP_NAME-db" "RDS database"
check_aws_resource "elasticache" "$APP_NAME-redis" "ElastiCache Redis cluster"
check_s3_bucket
check_alb
check_cloudfront_distribution
check_ecs_service
check_security_groups

# Check connectivity
echo -e "\n=== Connectivity Validation ==="
check_database_connectivity
check_redis_connectivity
check_api_health

# Get access URLs
echo -e "\n=== Access URLs ==="
ALB_DNS_NAME=$(aws elbv2 describe-load-balancers --names "$APP_NAME-alb" --query 'LoadBalancers[0].DNSName' --output text 2>/dev/null || echo "Not available")
CLOUDFRONT_DOMAIN=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Origins.Items[0].DomainName, '$APP_NAME-static-assets')].DomainName" --output text 2>/dev/null || echo "Not available")

echo "Admin Panel: https://$CLOUDFRONT_DOMAIN/admin/"
echo "Aldilaijan Client Portal: https://$CLOUDFRONT_DOMAIN/aldilaijan/"
echo "Khobara Client Portal: https://$CLOUDFRONT_DOMAIN/khobara/"
echo "API Endpoint: http://$ALB_DNS_NAME/api/"

echo -e "\nValidation completed!"
