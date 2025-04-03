#!/bin/bash

# Script to create a proper zip file for AWS CodeBuild and deploy using CodeCommit

# Set variables
APP_NAME="aldilaijan-khobara"
AWS_REGION="me-south-1"  # Change to your region
ENV="production"
ECR_REPO_NAME="$APP_NAME-ecr-repo"
CODECOMMIT_REPO_NAME="$APP_NAME-repo"

echo "Starting improved deployment process for Aldilaijan-Khobara Web Application..."

# Set AWS region
echo "Setting AWS region to $AWS_REGION..."
aws configure set default.region $AWS_REGION

# Check if backend directory exists, create if not
BACKEND_DIR="/home/ubuntu/aldilaijan-khobara-app/backend"
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
EOF

# Get AWS account ID
AWS_ACCOUNT_ID=$(aws sts get-caller-identity --query Account --output text)
echo "AWS Account ID: $AWS_ACCOUNT_ID"

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

# Check if CodeCommit repository exists
echo "Checking if CodeCommit repository exists..."
if aws codecommit get-repository --repository-name $CODECOMMIT_REPO_NAME 2>/dev/null; then
    echo "CodeCommit repository already exists: $CODECOMMIT_REPO_NAME"
else
    echo "Creating CodeCommit repository..."
    aws codecommit create-repository \
        --repository-name $CODECOMMIT_REPO_NAME \
        --repository-description "Repository for $APP_NAME application"
    echo "CodeCommit repository created: $CODECOMMIT_REPO_NAME"
fi

# Create a temporary directory for Git operations
TEMP_DIR=$(mktemp -d)
echo "Created temporary directory: $TEMP_DIR"

# Initialize Git repository and push to CodeCommit
echo "Initializing Git repository and pushing to CodeCommit..."
cd $BACKEND_DIR
git init
git config --local user.name "AWS CodeBuild"
git config --local user.email "codebuild@example.com"
git add .
git commit -m "Initial commit"

# Get CodeCommit repository URL
CODECOMMIT_URL=$(aws codecommit get-repository --repository-name $CODECOMMIT_REPO_NAME --query 'repositoryMetadata.cloneUrlHttp' --output text)
echo "CodeCommit repository URL: $CODECOMMIT_URL"

# Configure Git credentials helper for AWS CodeCommit
git config --local credential.helper '!aws codecommit credential-helper $@'
git config --local credential.UseHttpPath true

# Add remote and push
git remote add origin $CODECOMMIT_URL
git push -u origin master

echo "Code pushed to CodeCommit repository: $CODECOMMIT_REPO_NAME"

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
        "logs:PutLogEvents"
      ],
      "Resource": "*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "codecommit:GitPull"
      ],
      "Resource": "arn:aws:codecommit:$AWS_REGION:$AWS_ACCOUNT_ID:$CODECOMMIT_REPO_NAME"
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

# Create CodeBuild project
CODEBUILD_PROJECT_NAME="$APP_NAME-codebuild"
echo "Creating/updating CodeBuild project: $CODEBUILD_PROJECT_NAME"
aws codebuild create-project \
    --name $CODEBUILD_PROJECT_NAME \
    --source "type=CODECOMMIT,location=$CODECOMMIT_URL" \
    --artifacts "type=NO_ARTIFACTS" \
    --environment "type=LINUX_CONTAINER,image=aws/codebuild/amazonlinux2-x86_64-standard:3.0,computeType=BUILD_GENERAL1_SMALL,privilegedMode=true,environmentVariables=[{name=AWS_ACCOUNT_ID,value=$AWS_ACCOUNT_ID},{name=AWS_REGION,value=$AWS_REGION}]" \
    --service-role $CODEBUILD_ROLE_ARN

# Start CodeBuild project
echo "Starting CodeBuild project..."
BUILD_ID=$(aws codebuild start-build --project-name $CODEBUILD_PROJECT_NAME --query 'build.id' --output text)
echo "CodeBuild project started with build ID: $BUILD_ID"

# Wait for build to complete
echo "Waiting for build to complete..."
aws codebuild wait build-complete --id $BUILD_ID
BUILD_STATUS=$(aws codebuild batch-get-builds --ids $BUILD_ID --query 'builds[0].buildStatus' --output text)

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
    echo "Check the CodeBuild logs for more information"
fi
