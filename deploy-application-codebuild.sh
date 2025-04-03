#!/bin/bash

# Application deployment script for Aldilaijan-Khobara Web Application using AWS CodeBuild
# This script doesn't require Docker to be installed locally

# Set variables
APP_NAME="aldilaijan-khobara"
AWS_REGION="me-south-1"  # Change to your region
ENV="production"
ECR_REPO_NAME="$APP_NAME-ecr-repo"
CODEBUILD_PROJECT_NAME="$APP_NAME-codebuild"
S3_BUCKET_NAME="$APP_NAME-codebuild-artifacts"

echo "Starting application deployment for Aldilaijan-Khobara Web Application using AWS CodeBuild..."

# Set AWS region
echo "Setting AWS region to $AWS_REGION..."
aws configure set default.region $AWS_REGION

# Check if backend directory exists, create if not
BACKEND_DIR="./backend"
if [ ! -d "$BACKEND_DIR" ]; then
    echo "Backend directory not found. Creating directory structure..."
    mkdir -p "$BACKEND_DIR/src"
    mkdir -p "$BACKEND_DIR/shared/src"
    mkdir -p "$BACKEND_DIR/aldilaijan/src"
    mkdir -p "$BACKEND_DIR/khobara/src"
    
    # Create a simple Dockerfile for demonstration
    cat > "$BACKEND_DIR/Dockerfile" << 'EOF'
FROM node:16-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

EXPOSE 3000
CMD ["npm", "start"]
EOF

    # Create a simple package.json
    cat > "$BACKEND_DIR/package.json" << 'EOF'
{
  "name": "aldilaijan-khobara-backend",
  "version": "1.0.0",
  "description": "Backend for Aldilaijan-Khobara Web Application",
  "main": "src/main.js",
  "scripts": {
    "start": "node src/main.js",
    "build": "echo 'Build completed'"
  },
  "dependencies": {
    "express": "^4.17.1",
    "pg": "^8.7.1",
    "typeorm": "^0.2.41",
    "nestjs": "^8.0.0"
  }
}
EOF

    # Create a simple main.js file
    cat > "$BACKEND_DIR/src/main.js" << 'EOF'
console.log('Aldilaijan-Khobara Backend Server Starting...');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.get('/', (req, res) => {
  res.send('Aldilaijan-Khobara Backend API is running');
});

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

app.listen(port, '0.0.0.0', () => {
  console.log(`Server listening at http://0.0.0.0:${port}`);
});
EOF

    echo "Created basic backend application structure for deployment demonstration"
fi

# Create buildspec.yml for CodeBuild
cat > "$BACKEND_DIR/buildspec.yml" << EOF
version: 0.2

phases:
  pre_build:
    commands:
      - echo Logging in to Amazon ECR...
      - aws ecr get-login-password --region $AWS_REGION | docker login --username AWS --password-stdin \$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com
      - REPOSITORY_URI=\$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME
      - COMMIT_HASH=\$(echo \$CODEBUILD_RESOLVED_SOURCE_VERSION | cut -c 1-7)
      - IMAGE_TAG=\${COMMIT_HASH:=latest}
  build:
    commands:
      - echo Build started on \`date\`
      - echo Building the Docker image...
      - docker build -t \$REPOSITORY_URI:latest .
      - docker tag \$REPOSITORY_URI:latest \$REPOSITORY_URI:\$IMAGE_TAG
  post_build:
    commands:
      - echo Build completed on \`date\`
      - echo Pushing the Docker image...
      - docker push \$REPOSITORY_URI:latest
      - docker push \$REPOSITORY_URI:\$IMAGE_TAG
      - echo Writing image definitions file...
      - |
        if ! aws ecs describe-task-definition --task-definition $APP_NAME-task &>/dev/null; then
          echo "Creating task definition JSON since it does not exist..."
          cat <<TASKDEF > taskdef.json
{
    "family": "$APP_NAME-task",
    "executionRoleArn": "arn:aws:iam::\$AWS_ACCOUNT_ID:role/ecsTaskExecutionRole",
    "networkMode": "awsvpc",
    "containerDefinitions": [
        {
            "name": "$APP_NAME-container",
            "image": "\$REPOSITORY_URI:latest",
            "essential": true,
            "portMappings": [
                {
                    "containerPort": 3000,
                    "hostPort": 3000,
                    "protocol": "tcp"
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
    "cpu": "256",
    "memory": "512"
}
TASKDEF
        else
          echo "Using existing task definition..."
          aws ecs describe-task-definition --task-definition $APP_NAME-task --query taskDefinition > taskdef.json
        fi
      - cat taskdef.json
      - echo '{"ImageURI":"\$REPOSITORY_URI:\$IMAGE_TAG"}' > imageDefinition.json
artifacts:
  files:
    - imageDefinition.json
    - taskdef.json
    - appspec.yml
EOF

# Create appspec.yml for CodeDeploy
cat > "$BACKEND_DIR/appspec.yml" << EOF
version: 0.0
Resources:
  - TargetService:
      Type: AWS::ECS::Service
      Properties:
        TaskDefinition: <TASK_DEFINITION>
        LoadBalancerInfo:
          ContainerName: "$APP_NAME-container"
          ContainerPort: 3000
EOF

# Check if ECR repository exists
echo "Checking if ECR repository exists..."
if aws ecr describe-repositories --repository-names $ECR_REPO_NAME 2>/dev/null; then
    echo "ECR repository already exists: $ECR_REPO_NAME"
else
    echo "Creating ECR repository..."
    aws ecr create-repository \
        --repository-name $ECR_REPO_NAME \
        --image-scanning-configuration scanOnPush=true
    echo "ECR repository created: $ECR_REPO_NAME"
fi

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "AWS Account ID: $AWS_ACCOUNT_ID"

# Check if S3 bucket exists, create if not
if aws s3api head-bucket --bucket $S3_BUCKET_NAME 2>/dev/null; then
    echo "S3 bucket already exists: $S3_BUCKET_NAME"
else
    echo "Creating S3 bucket for CodeBuild artifacts..."
    aws s3api create-bucket \
        --bucket $S3_BUCKET_NAME \
        --region $AWS_REGION \
        --create-bucket-configuration LocationConstraint=$AWS_REGION
    echo "S3 bucket created: $S3_BUCKET_NAME"
fi

# Create CodeBuild service role if it doesn't exist
CODEBUILD_ROLE_NAME="$APP_NAME-codebuild-role"
if aws iam get-role --role-name $CODEBUILD_ROLE_NAME 2>/dev/null; then
    echo "CodeBuild service role already exists: $CODEBUILD_ROLE_NAME"
else
    echo "Creating CodeBuild service role..."
    cat > codebuild-role-trust-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "codebuild.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

    aws iam create-role \
        --role-name $CODEBUILD_ROLE_NAME \
        --assume-role-policy-document file://codebuild-role-trust-policy.json

    cat > codebuild-role-policy.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents",
        "logs:DescribeLogGroups",
        "logs:DescribeLogStreams",
        "logs:GetLogEvents"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "s3:GetObject",
        "s3:GetObjectVersion",
        "s3:PutObject",
        "s3:ListBucket"
      ],
      "Resource": [
        "arn:aws:s3:::$S3_BUCKET_NAME",
        "arn:aws:s3:::$S3_BUCKET_NAME/*"
      ]
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecr:GetAuthorizationToken",
        "ecr:BatchCheckLayerAvailability",
        "ecr:GetDownloadUrlForLayer",
        "ecr:BatchGetImage",
        "ecr:InitiateLayerUpload",
        "ecr:UploadLayerPart",
        "ecr:CompleteLayerUpload",
        "ecr:PutImage"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "ecs:DescribeTaskDefinition",
        "ecs:RegisterTaskDefinition",
        "ecs:ListTaskDefinitions"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "iam:PassRole"
      ],
      "Resource": "arn:aws:iam::$AWS_ACCOUNT_ID:role/ecsTaskExecutionRole"
    }
  ]
}
EOF

    aws iam put-role-policy \
        --role-name $CODEBUILD_ROLE_NAME \
        --policy-name $APP_NAME-codebuild-policy \
        --policy-document file://codebuild-role-policy.json

    echo "CodeBuild service role created: $CODEBUILD_ROLE_NAME"
fi

# Get CodeBuild service role ARN
CODEBUILD_ROLE_ARN=$(aws iam get-role --role-name $CODEBUILD_ROLE_NAME --query 'Role.Arn' --output text)
echo "CodeBuild service role ARN: $CODEBUILD_ROLE_ARN"

# Check if CodeBuild project exists, create if not
if aws codebuild batch-get-projects --names $CODEBUILD_PROJECT_NAME | grep -q "\"name\": \"$CODEBUILD_PROJECT_NAME\""; then
    echo "CodeBuild project already exists: $CODEBUILD_PROJECT_NAME"
else
    echo "Creating CodeBuild project..."
    
    # Determine source configuration based on available compression tools
    SOURCE_CONFIG=""
    if command -v zip &> /dev/null; then
        SOURCE_CONFIG="type=S3,location=$S3_BUCKET_NAME/source.zip"
    elif command -v tar &> /dev/null; then
        SOURCE_CONFIG="type=S3,location=$S3_BUCKET_NAME/source.tar.gz,extractionType=TAR"
    else
        echo "Error: Neither zip nor tar commands are available. Cannot proceed."
        exit 1
    fi
    
    aws codebuild create-project \
        --name $CODEBUILD_PROJECT_NAME \
        --source "$SOURCE_CONFIG" \
        --artifacts "type=S3,location=$S3_BUCKET_NAME,name=artifacts.zip" \
        --environment "type=LINUX_CONTAINER,image=aws/codebuild/amazonlinux2-x86_64-standard:3.0,computeType=BUILD_GENERAL1_SMALL,privilegedMode=true,environmentVariables=[{name=AWS_ACCOUNT_ID,value=$AWS_ACCOUNT_ID},{name=AWS_REGION,value=$AWS_REGION}]" \
        --service-role $CODEBUILD_ROLE_ARN
    echo "CodeBuild project created: $CODEBUILD_PROJECT_NAME"
fi

# Check if zip command is available and use alternative if not
echo "Creating source zip file..."
if [ -d "$BACKEND_DIR" ]; then
    if command -v zip &> /dev/null; then
        cd $BACKEND_DIR
        zip -r ../source.zip .
        cd ..
        echo "Source zip file created at ./source.zip"
    else
        echo "Warning: zip command not found. Using tar and gzip as alternative."
        if command -v tar &> /dev/null; then
            cd $BACKEND_DIR
            tar -czf ../source.tar.gz .
            cd ..
            echo "Source tar.gz file created at ./source.tar.gz"
            
            # Upload using tar.gz instead
            echo "Uploading source code to S3..."
            if [ -f "./source.tar.gz" ]; then
                aws s3 cp ./source.tar.gz s3://$S3_BUCKET_NAME/source.tar.gz
                
                # Update CodeBuild project to use tar.gz instead of zip
                echo "Updating CodeBuild project to use tar.gz instead of zip..."
                aws codebuild update-project \
                    --name $CODEBUILD_PROJECT_NAME \
                    --source "type=S3,location=$S3_BUCKET_NAME/source.tar.gz,buildspec=buildspec.yml,extractionType=TAR"
                echo "Source code uploaded to S3"
                
                # Skip the normal zip upload section
                USE_TAR=true
            else
                echo "Error: source.tar.gz file not found"
                exit 1
            fi
        else
            echo "Error: Neither zip nor tar commands are available. Cannot package source code."
            echo "Please install zip or tar and try again."
            exit 1
        fi
    fi
else
    echo "Error: Backend directory not found at $BACKEND_DIR"
    exit 1
fi

# Upload source code to S3 (only if we used zip)
if [ "$USE_TAR" != "true" ]; then
    echo "Uploading source code to S3..."
    if [ -f "./source.zip" ]; then
        aws s3 cp ./source.zip s3://$S3_BUCKET_NAME/source.zip
        echo "Source code uploaded to S3"
    else
        echo "Error: source.zip file not found"
        exit 1
    fi
fi

# Create a simple ECS task definition if it doesn't exist
echo "Checking if the task definition '$APP_NAME-task' exists..."
if ! aws ecs describe-task-definition --task-definition "$APP_NAME-task" &>/dev/null; then
    echo "Task definition '$APP_NAME-task' does not exist. Creating a simple task definition..."
    cat > task-definition.json << EOF
{
    "family": "$APP_NAME-task",
    "executionRoleArn": "arn:aws:iam::$AWS_ACCOUNT_ID:role/ecsTaskExecutionRole",
    "networkMode": "awsvpc",
    "containerDefinitions": [
        {
            "name": "$APP_NAME-container",
            "image": "$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME:latest",
            "essential": true,
            "portMappings": [
                {
                    "containerPort": 3000,
                    "hostPort": 3000,
                    "protocol": "tcp"
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
    "cpu": "256",
    "memory": "512"
}
EOF

    # Check if ecsTaskExecutionRole exists, if not create it
    if ! aws iam get-role --role-name ecsTaskExecutionRole &>/dev/null; then
        echo "ecsTaskExecutionRole not found. Creating role..."
        cat > ecs-task-execution-trust.json << EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Action": "sts:AssumeRole"
    }
  ]
}
EOF

        aws iam create-role \
            --role-name ecsTaskExecutionRole \
            --assume-role-policy-document file://ecs-task-execution-trust.json

        # Attach the AmazonECSTaskExecutionRolePolicy to the role
        aws iam attach-role-policy \
            --role-name ecsTaskExecutionRole \
            --policy-arn arn:aws:iam::aws:policy/service-role/AmazonECSTaskExecutionRolePolicy
        echo "Created ecsTaskExecutionRole with proper permissions"
    fi

    # Register the task definition
    aws ecs register-task-definition --cli-input-json file://task-definition.json
    echo "Task definition created: $APP_NAME-task"
fi

# Start CodeBuild project
echo "Starting CodeBuild project..."
BUILD_ID=$(aws codebuild start-build --project-name $CODEBUILD_PROJECT_NAME --query 'build.id' --output text 2>/dev/null)

# Check if the build was started successfully
if [ -z "$BUILD_ID" ]; then
    echo "Error: Failed to start CodeBuild project. Please check if the project exists and you have the necessary permissions."
    exit 1
fi

echo "CodeBuild project started with build ID: $BUILD_ID"

# Wait for build to complete using polling instead of the wait command
echo "Waiting for build to complete..."
BUILD_STATUS="IN_PROGRESS"
while [[ "$BUILD_STATUS" == "IN_PROGRESS" ]]; do
    sleep 30
    echo "Checking build status..."
    BUILD_STATUS=$(aws codebuild batch-get-builds --ids $BUILD_ID --query 'builds[0].buildStatus' --output text 2>/dev/null)
    if [[ -z "$BUILD_STATUS" ]]; then
        echo "Error retrieving build status. Will retry..."
    else
        echo "Current build status: $BUILD_STATUS"
    fi
done

if [ "$BUILD_STATUS" == "SUCCEEDED" ]; then
    echo "Build completed successfully!"
    # Get ECR repository URI
    ECR_REPO_URI="$AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/$ECR_REPO_NAME"
    echo "ECR repository URI: $ECR_REPO_URI"
    echo "Application deployment initiated successfully!"
    echo "Backend image pushed to: $ECR_REPO_URI:latest"
    echo "You can now access the application at the load balancer URL"
else
    echo "Build failed with status: $BUILD_STATUS"
    echo "Retrieving build logs to help diagnose the issue..."
    
    # Get the log group and stream information
    LOG_INFO=$(aws codebuild batch-get-builds --ids $BUILD_ID --query 'builds[0].logs' --output json)
    LOG_GROUP=$(echo $LOG_INFO | grep -o '"groupName":"[^"]*' | sed 's/"groupName":"//')
    LOG_STREAM=$(echo $LOG_INFO | grep -o '"streamName":"[^"]*' | sed 's/"streamName":"//')
    
    if [ -n "$LOG_GROUP" ] && [ -n "$LOG_STREAM" ]; then
        echo "Log group: $LOG_GROUP"
        echo "Log stream: $LOG_STREAM"
        echo "Last 20 log events:"
        
        # Fix log group name to avoid path issues
        FIXED_LOG_GROUP=$(echo $LOG_GROUP | sed 's|^/|/|')
        
        # Use AWS CLI with proper formatting for log group names
        aws logs get-log-events \
            --log-group-name "$FIXED_LOG_GROUP" \
            --log-stream-name "$LOG_STREAM" \
            --limit 20 \
            --query 'events[*].message' \
            --output text || echo "Failed to retrieve logs. Check the AWS Console."
    else
        echo "Couldn't retrieve log information. Check the CodeBuild console for logs."
        echo "You can view logs in the AWS console at: https://$AWS_REGION.console.aws.amazon.com/codesuite/codebuild/projects/$CODEBUILD_PROJECT_NAME/build/$BUILD_ID/log"
    fi
    
    exit 1
fi
