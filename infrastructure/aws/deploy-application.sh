#!/bin/bash

# AWS Application Deployment Script for Aldilaijan-Khobara Web Application
# This script deploys the application code to AWS infrastructure

# Exit on error
set -e

echo "Starting application deployment for Aldilaijan-Khobara Web Application..."

# Check if AWS CLI is installed
if ! command -v aws &> /dev/null; then
    echo "AWS CLI is not installed. Please run the infrastructure setup script first."
    exit 1
fi

# Set variables
AWS_REGION="me-south-1"  # Middle East (Bahrain) region
APP_NAME="aldilaijan-khobara"
ENV="production"
S3_BUCKET_NAME="$APP_NAME-static-assets-$(aws s3api list-buckets --query "Buckets[?starts_with(Name, '$APP_NAME-static-assets')].Name" --output text)"
ECR_REPOSITORY_NAME="$APP_NAME-ecr-repo"
APP_VERSION="1.0.0"

echo "Setting AWS region to $AWS_REGION..."
aws configure set default.region $AWS_REGION

# Create ECR repository if it doesn't exist
echo "Checking if ECR repository exists..."
if ! aws ecr describe-repositories --repository-names $ECR_REPOSITORY_NAME &> /dev/null; then
    echo "Creating ECR repository..."
    aws ecr create-repository \
        --repository-name $ECR_REPOSITORY_NAME \
        --image-scanning-configuration scanOnPush=true \
        --tags "Key=Name,Value=$APP_NAME-ecr" "Key=Environment,Value=$ENV"
    echo "ECR repository created: $ECR_REPOSITORY_NAME"
else
    echo "ECR repository already exists: $ECR_REPOSITORY_NAME"
fi

# Get ECR repository URI
ECR_REPOSITORY_URI=$(aws ecr describe-repositories \
    --repository-names $ECR_REPOSITORY_NAME \
    --query 'repositories[0].repositoryUri' \
    --output text)
echo "ECR repository URI: $ECR_REPOSITORY_URI"

# Login to ECR
echo "Logging in to ECR..."
aws ecr get-login-password | docker login --username AWS --password-stdin $ECR_REPOSITORY_URI

# Build and push backend Docker image
echo "Building backend Docker image..."
cd /home/ubuntu/aldilaijan-khobara-app/backend

# Create Dockerfile for backend
cat > Dockerfile << EOF
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY . .

RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "start:prod"]
EOF

# Build Docker image
docker build -t $ECR_REPOSITORY_URI:backend-$APP_VERSION .

# Push Docker image to ECR
echo "Pushing backend Docker image to ECR..."
docker push $ECR_REPOSITORY_URI:backend-$APP_VERSION

# Build frontend applications
echo "Building frontend applications..."
cd /home/ubuntu/aldilaijan-khobara-app/frontend

# Build admin panel
echo "Building admin panel..."
cd admin-panel
npm ci
npm run build

# Build Aldilaijan client portal
echo "Building Aldilaijan client portal..."
cd ../client-portal
npm ci
npm run build:aldilaijan

# Build Khobara client portal
echo "Building Khobara client portal..."
cd ../client-portal
npm run build:khobara

# Upload frontend assets to S3
echo "Uploading admin panel assets to S3..."
aws s3 sync /home/ubuntu/aldilaijan-khobara-app/frontend/admin-panel/build/ s3://$S3_BUCKET_NAME/admin/ --delete

echo "Uploading Aldilaijan client portal assets to S3..."
aws s3 sync /home/ubuntu/aldilaijan-khobara-app/frontend/client-portal/build-aldilaijan/ s3://$S3_BUCKET_NAME/aldilaijan/ --delete

echo "Uploading Khobara client portal assets to S3..."
aws s3 sync /home/ubuntu/aldilaijan-khobara-app/frontend/client-portal/build-khobara/ s3://$S3_BUCKET_NAME/khobara/ --delete

# Create CloudFront invalidation to refresh cache
echo "Creating CloudFront invalidation..."
CLOUDFRONT_DISTRIBUTION_ID=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Origins.Items[0].DomainName, '$S3_BUCKET_NAME')].Id" --output text)
aws cloudfront create-invalidation --distribution-id $CLOUDFRONT_DISTRIBUTION_ID --paths "/*"

# Create ECS cluster if it doesn't exist
echo "Checking if ECS cluster exists..."
if ! aws ecs describe-clusters --clusters $APP_NAME-cluster --query "clusters[0].clusterName" --output text &> /dev/null; then
    echo "Creating ECS cluster..."
    aws ecs create-cluster \
        --cluster-name $APP_NAME-cluster \
        --tags "key=Name,value=$APP_NAME-cluster" "key=Environment,value=$ENV"
    echo "ECS cluster created: $APP_NAME-cluster"
else
    echo "ECS cluster already exists: $APP_NAME-cluster"
fi

# Create task definition
echo "Creating ECS task definition..."
cat > task-definition.json << EOF
{
    "family": "$APP_NAME-task",
    "networkMode": "awsvpc",
    "executionRoleArn": "arn:aws:iam::$(aws sts get-caller-identity --query 'Account' --output text):role/ecsTaskExecutionRole",
    "containerDefinitions": [
        {
            "name": "$APP_NAME-container",
            "image": "$ECR_REPOSITORY_URI:backend-$APP_VERSION",
            "essential": true,
            "portMappings": [
                {
                    "containerPort": 3000,
                    "hostPort": 3000,
                    "protocol": "tcp"
                }
            ],
            "environment": [
                {
                    "name": "NODE_ENV",
                    "value": "production"
                },
                {
                    "name": "PORT",
                    "value": "3000"
                },
                {
                    "name": "DATABASE_HOST",
                    "value": "$(aws rds describe-db-instances --db-instance-identifier $APP_NAME-db --query 'DBInstances[0].Endpoint.Address' --output text)"
                },
                {
                    "name": "DATABASE_PORT",
                    "value": "5432"
                },
                {
                    "name": "DATABASE_NAME",
                    "value": "aldilaijankhobara"
                },
                {
                    "name": "DATABASE_USERNAME",
                    "value": "dbadmin"
                },
                {
                    "name": "REDIS_HOST",
                    "value": "$(aws elasticache describe-cache-clusters --cache-cluster-id $APP_NAME-redis --show-cache-node-info --query 'CacheClusters[0].CacheNodes[0].Endpoint.Address' --output text)"
                },
                {
                    "name": "REDIS_PORT",
                    "value": "6379"
                },
                {
                    "name": "S3_BUCKET",
                    "value": "$S3_BUCKET_NAME"
                },
                {
                    "name": "CLOUDFRONT_DOMAIN",
                    "value": "$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Origins.Items[0].DomainName, '$S3_BUCKET_NAME')].DomainName" --output text)"
                }
            ],
            "secrets": [
                {
                    "name": "DATABASE_PASSWORD",
                    "valueFrom": "arn:aws:ssm:$AWS_REGION:$(aws sts get-caller-identity --query 'Account' --output text):parameter/$APP_NAME/database/password"
                },
                {
                    "name": "JWT_SECRET",
                    "valueFrom": "arn:aws:ssm:$AWS_REGION:$(aws sts get-caller-identity --query 'Account' --output text):parameter/$APP_NAME/jwt/secret"
                }
            ],
            "logConfiguration": {
                "logDriver": "awslogs",
                "options": {
                    "awslogs-group": "/ecs/$APP_NAME",
                    "awslogs-region": "$AWS_REGION",
                    "awslogs-stream-prefix": "ecs"
                }
            }
        }
    ],
    "requiresCompatibilities": [
        "FARGATE"
    ],
    "cpu": "1024",
    "memory": "2048"
}
EOF

# Register task definition
TASK_DEFINITION_ARN=$(aws ecs register-task-definition \
    --cli-input-json file://task-definition.json \
    --query 'taskDefinition.taskDefinitionArn' \
    --output text)
echo "Task definition registered: $TASK_DEFINITION_ARN"

# Get VPC and subnet IDs
VPC_ID=$(aws ec2 describe-vpcs --filters "Name=tag:Name,Values=$APP_NAME-vpc" --query 'Vpcs[0].VpcId' --output text)
PRIVATE_SUBNET_1_ID=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" "Name=tag:Name,Values=$APP_NAME-private-subnet-1" --query 'Subnets[0].SubnetId' --output text)
PRIVATE_SUBNET_2_ID=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" "Name=tag:Name,Values=$APP_NAME-private-subnet-2" --query 'Subnets[0].SubnetId' --output text)
SECURITY_GROUP_ID=$(aws ec2 describe-security-groups --filters "Name=vpc-id,Values=$VPC_ID" "Name=tag:Name,Values=$APP_NAME-ec2-sg" --query 'SecurityGroups[0].GroupId' --output text)

# Create ECS service
echo "Creating ECS service..."
TARGET_GROUP_ARN=$(aws elbv2 describe-target-groups --names "$APP_NAME-api-tg" --query 'TargetGroups[0].TargetGroupArn' --output text)

aws ecs create-service \
    --cluster $APP_NAME-cluster \
    --service-name $APP_NAME-service \
    --task-definition $TASK_DEFINITION_ARN \
    --desired-count 2 \
    --launch-type FARGATE \
    --platform-version LATEST \
    --network-configuration "awsvpcConfiguration={subnets=[$PRIVATE_SUBNET_1_ID,$PRIVATE_SUBNET_2_ID],securityGroups=[$SECURITY_GROUP_ID],assignPublicIp=DISABLED}" \
    --load-balancers "targetGroupArn=$TARGET_GROUP_ARN,containerName=$APP_NAME-container,containerPort=3000" \
    --health-check-grace-period-seconds 60 \
    --scheduling-strategy REPLICA \
    --deployment-controller "type=ECS" \
    --tags "key=Name,value=$APP_NAME-service" "key=Environment,value=$ENV"

echo "ECS service created: $APP_NAME-service"

# Create Route 53 hosted zone (if domain is available)
# Note: This is commented out as it requires a registered domain
# echo "Creating Route 53 hosted zone..."
# aws route53 create-hosted-zone \
#     --name "aldilaijan-khobara.com" \
#     --caller-reference "$(date +%s)" \
#     --hosted-zone-config "Comment=Hosted zone for $APP_NAME application"

# Get ALB DNS name
ALB_DNS_NAME=$(aws elbv2 describe-load-balancers --names "$APP_NAME-alb" --query 'LoadBalancers[0].DNSName' --output text)
echo "Application Load Balancer DNS name: $ALB_DNS_NAME"

# Get CloudFront domain name
CLOUDFRONT_DOMAIN=$(aws cloudfront list-distributions --query "DistributionList.Items[?contains(Origins.Items[0].DomainName, '$S3_BUCKET_NAME')].DomainName" --output text)
echo "CloudFront domain name: $CLOUDFRONT_DOMAIN"

echo "Application deployment completed successfully!"
echo ""
echo "Access URLs:"
echo "- Admin Panel: https://$CLOUDFRONT_DOMAIN/admin/"
echo "- Aldilaijan Client Portal: https://$CLOUDFRONT_DOMAIN/aldilaijan/"
echo "- Khobara Client Portal: https://$CLOUDFRONT_DOMAIN/khobara/"
echo "- API Endpoint: http://$ALB_DNS_NAME/api/"
echo ""
echo "Next steps:"
echo "1. Configure custom domain names in Route 53"
echo "2. Set up SSL certificates with AWS Certificate Manager"
echo "3. Configure monitoring and alerting with CloudWatch"
echo "4. Set up CI/CD pipeline for automated deployments"
echo ""
echo "Deployment script completed!"
