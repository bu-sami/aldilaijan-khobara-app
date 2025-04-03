# Deployment Guide for Aldilaijan-Khobara Web Application

This document provides comprehensive instructions for deploying the Aldilaijan-Khobara web application using a cloud-native AWS architecture. The deployment process is divided into two main parts: infrastructure setup and application deployment.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Architecture Overview](#architecture-overview)
3. [Infrastructure Deployment](#infrastructure-deployment)
4. [Application Deployment](#application-deployment)
5. [Post-Deployment Configuration](#post-deployment-configuration)
6. [Monitoring and Maintenance](#monitoring-and-maintenance)
7. [Troubleshooting](#troubleshooting)
8. [Security Considerations](#security-considerations)

## Prerequisites

Before starting the deployment process, ensure you have the following:

- AWS account with administrative access
- AWS CLI installed and configured with appropriate credentials
- Docker installed (for building application containers)
- Node.js and npm installed (for building frontend applications)
- Git installed (for cloning the repository)

## Architecture Overview

The Aldilaijan-Khobara web application uses a cloud-native architecture on AWS with the following components:

- **Networking**: VPC with public and private subnets across multiple availability zones
- **Compute**: ECS Fargate for containerized backend services
- **Database**: Amazon RDS for PostgreSQL with multi-AZ deployment
- **Caching**: Amazon ElastiCache for Redis
- **Storage**: Amazon S3 for static assets and file storage
- **Content Delivery**: CloudFront CDN for global content delivery
- **Load Balancing**: Application Load Balancer for traffic distribution
- **Security**: Security groups, IAM roles, and encryption for data at rest and in transit

![Architecture Diagram](architecture-diagram.png)

## Infrastructure Deployment

The infrastructure deployment script (`deploy-aws-infrastructure.sh`) creates all the necessary AWS resources for the application.

### Steps to Deploy Infrastructure

1. Clone the repository:
   ```bash
   git clone https://github.com/your-organization/aldilaijan-khobara-app.git
   cd aldilaijan-khobara-app
   ```

2. Make the infrastructure deployment script executable:
   ```bash
   chmod +x infrastructure/aws/deploy-aws-infrastructure.sh
   ```

3. Run the infrastructure deployment script:
   ```bash
   ./infrastructure/aws/deploy-aws-infrastructure.sh
   ```

4. The script will create the following resources:
   - VPC with public, private, and database subnets
   - Internet Gateway and NAT Gateway
   - Security groups for ALB, EC2, RDS, and ElastiCache
   - RDS PostgreSQL database
   - ElastiCache Redis cluster
   - S3 bucket for static assets
   - CloudFront distribution
   - Application Load Balancer
   - IAM roles and policies

5. The script will output important information such as:
   - VPC ID
   - RDS Database Endpoint
   - ElastiCache Redis Endpoint
   - S3 Bucket Name
   - CloudFront Distribution ID
   - Application Load Balancer ARN

### Infrastructure Deployment Parameters

The infrastructure deployment script uses the following default parameters:

- **AWS Region**: me-south-1 (Middle East - Bahrain)
- **Application Name**: aldilaijan-khobara
- **Environment**: production
- **VPC CIDR**: 10.0.0.0/16
- **EC2 Instance Type**: t3.medium
- **RDS Instance Type**: db.t3.medium
- **ElastiCache Node Type**: cache.t3.medium

To modify these parameters, edit the variables at the beginning of the script.

## Application Deployment

After the infrastructure is set up, you can deploy the application using the application deployment script (`deploy-application.sh`).

### Steps to Deploy Application

1. Make the application deployment script executable:
   ```bash
   chmod +x infrastructure/aws/deploy-application.sh
   ```

2. Run the application deployment script:
   ```bash
   ./infrastructure/aws/deploy-application.sh
   ```

3. The script will perform the following actions:
   - Create an ECR repository for Docker images
   - Build and push the backend Docker image
   - Build the frontend applications (admin panel, Aldilaijan portal, Khobara portal)
   - Upload frontend assets to S3
   - Create CloudFront invalidation to refresh cache
   - Create ECS cluster and task definition
   - Deploy the application as an ECS service
   - Configure load balancing

4. The script will output access URLs for:
   - Admin Panel
   - Aldilaijan Client Portal
   - Khobara Client Portal
   - API Endpoint

### Application Deployment Parameters

The application deployment script uses the following default parameters:

- **AWS Region**: me-south-1 (Middle East - Bahrain)
- **Application Name**: aldilaijan-khobara
- **Environment**: production
- **Application Version**: 1.0.0

To modify these parameters, edit the variables at the beginning of the script.

## Post-Deployment Configuration

After deploying the application, you should perform the following post-deployment configurations:

### 1. Set up Custom Domain Names

1. Register domain names for your application (e.g., aldilaijan.com, khobara.com)
2. Create a Route 53 hosted zone for each domain
3. Create DNS records to point to your CloudFront distribution and ALB
4. Configure SSL certificates using AWS Certificate Manager

### 2. Set up Database Migrations

1. Connect to the RDS database using the endpoint provided by the infrastructure script
2. Run database migrations to create the necessary tables and schemas:
   ```bash
   cd backend
   npm run migration:run
   ```

### 3. Create Initial Admin User

1. Connect to the RDS database
2. Insert an initial admin user into the users table:
   ```sql
   INSERT INTO shared.users (username, email, password_hash, role_id, is_active)
   VALUES ('admin', 'admin@example.com', '$2b$10$...', 1, true);
   ```

### 4. Configure Environment Variables

1. Create the following parameters in AWS Systems Manager Parameter Store:
   - /$APP_NAME/database/password
   - /$APP_NAME/jwt/secret

2. Update the ECS task definition with the correct environment variables if needed

## Monitoring and Maintenance

### Monitoring

1. Set up CloudWatch dashboards to monitor:
   - ECS service metrics (CPU, memory, task count)
   - RDS database metrics (connections, CPU, storage)
   - ElastiCache metrics (memory usage, connections)
   - ALB metrics (request count, latency, error rates)

2. Configure CloudWatch alarms for critical metrics:
   - High CPU or memory usage
   - Database connection issues
   - HTTP 5xx errors
   - Elevated response times

### Maintenance

1. **Database Backups**: RDS automatically creates daily backups with a 7-day retention period

2. **Log Management**: Configure log retention policies in CloudWatch Logs

3. **Updates and Patches**:
   - Regularly update the application code
   - Apply security patches to the database and other services
   - Update dependencies to address vulnerabilities

4. **Scaling**:
   - Configure Auto Scaling for the ECS service based on CPU and memory metrics
   - Monitor database performance and upgrade instance type if needed

## Troubleshooting

### Common Issues and Solutions

1. **Application not accessible**:
   - Check ECS service status and task health
   - Verify security group rules allow traffic
   - Check ALB target group health

2. **Database connection issues**:
   - Verify security group rules allow traffic from ECS to RDS
   - Check database credentials in SSM Parameter Store
   - Verify database instance is running

3. **Frontend assets not loading**:
   - Check S3 bucket permissions
   - Verify CloudFront distribution is enabled
   - Create a CloudFront invalidation to refresh cache

### Accessing Logs

1. **Application Logs**: View in CloudWatch Logs under the `/ecs/$APP_NAME` log group

2. **ALB Access Logs**: Enable access logs for the ALB to an S3 bucket

3. **Database Logs**: View RDS logs in the RDS console or CloudWatch Logs

## Security Considerations

The deployment follows AWS security best practices:

1. **Network Security**:
   - Private subnets for application and database resources
   - Security groups with least privilege access
   - NAT Gateway for outbound internet access from private subnets

2. **Data Security**:
   - Encryption at rest for RDS and S3
   - Encryption in transit using HTTPS/TLS
   - Secure handling of secrets using SSM Parameter Store

3. **Access Control**:
   - IAM roles with least privilege permissions
   - Role-based access control within the application
   - Secure authentication using JWT tokens

4. **Compliance**:
   - Regular security audits and vulnerability scanning
   - Logging and monitoring for security events
   - Regular backup and disaster recovery testing

## Conclusion

This deployment guide provides a comprehensive approach to deploying the Aldilaijan-Khobara web application on AWS. By following these instructions, you can set up a secure, scalable, and highly available environment for the application.

For additional support or questions, please contact the development team.

---

Last updated: April 2, 2025
