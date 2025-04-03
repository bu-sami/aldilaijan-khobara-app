#!/bin/bash

# Script to delete all VPCs in an AWS account
# Use with caution - this will delete ALL VPCs except the default VPC

# Set AWS region
AWS_REGION="me-south-1"  # Change to your region
aws configure set default.region $AWS_REGION

echo "Listing all VPCs in region $AWS_REGION..."
VPC_IDS=$(aws ec2 describe-vpcs --query 'Vpcs[?IsDefault==`false`].VpcId' --output text)

if [ -z "$VPC_IDS" ]; then
    echo "No non-default VPCs found in region $AWS_REGION."
    exit 0
fi

echo "Found the following non-default VPCs: $VPC_IDS"
echo "This script will delete all these VPCs and their associated resources."
echo "Press Ctrl+C now to abort, or wait 10 seconds to continue..."
sleep 10

for VPC_ID in $VPC_IDS; do
    echo "Processing VPC: $VPC_ID"
    
    # Get VPC name if available
    VPC_NAME=$(aws ec2 describe-vpcs --vpc-ids $VPC_ID --query 'Vpcs[0].Tags[?Key==`Name`].Value' --output text)
    if [ ! -z "$VPC_NAME" ]; then
        echo "VPC Name: $VPC_NAME"
    fi
    
    # Delete NAT Gateways
    echo "Checking for NAT Gateways..."
    NAT_GATEWAY_IDS=$(aws ec2 describe-nat-gateways --filter "Name=vpc-id,Values=$VPC_ID" --query 'NatGateways[*].NatGatewayId' --output text)
    for NAT_ID in $NAT_GATEWAY_IDS; do
        echo "Deleting NAT Gateway: $NAT_ID"
        aws ec2 delete-nat-gateway --nat-gateway-id $NAT_ID
    done
    
    if [ ! -z "$NAT_GATEWAY_IDS" ]; then
        echo "Waiting for NAT Gateways to be deleted..."
        sleep 30
    fi
    
    # Delete Load Balancers
    echo "Checking for Load Balancers..."
    LB_ARNS=$(aws elbv2 describe-load-balancers --query "LoadBalancers[?VpcId=='$VPC_ID'].LoadBalancerArn" --output text)
    for LB_ARN in $LB_ARNS; do
        echo "Deleting Load Balancer: $LB_ARN"
        aws elbv2 delete-load-balancer --load-balancer-arn $LB_ARN
    done
    
    if [ ! -z "$LB_ARNS" ]; then
        echo "Waiting for Load Balancers to be deleted..."
        sleep 30
    fi
    
    # Delete VPC Endpoints
    echo "Checking for VPC Endpoints..."
    ENDPOINT_IDS=$(aws ec2 describe-vpc-endpoints --filters "Name=vpc-id,Values=$VPC_ID" --query 'VpcEndpoints[*].VpcEndpointId' --output text)
    for ENDPOINT_ID in $ENDPOINT_IDS; do
        echo "Deleting VPC Endpoint: $ENDPOINT_ID"
        aws ec2 delete-vpc-endpoints --vpc-endpoint-ids $ENDPOINT_ID
    done
    
    # Delete VPC Peering Connections
    echo "Checking for VPC Peering Connections..."
    PEERING_IDS=$(aws ec2 describe-vpc-peering-connections --filters "Name=requester-vpc-info.vpc-id,Values=$VPC_ID" "Name=accepter-vpc-info.vpc-id,Values=$VPC_ID" --query 'VpcPeeringConnections[*].VpcPeeringConnectionId' --output text)
    for PEERING_ID in $PEERING_IDS; do
        echo "Deleting VPC Peering Connection: $PEERING_ID"
        aws ec2 delete-vpc-peering-connection --vpc-peering-connection-id $PEERING_ID
    done
    
    # Delete Transit Gateway Attachments
    echo "Checking for Transit Gateway Attachments..."
    TGW_ATTACHMENTS=$(aws ec2 describe-transit-gateway-attachments --filters "Name=resource-id,Values=$VPC_ID" --query 'TransitGatewayAttachments[*].TransitGatewayAttachmentId' --output text)
    for TGW_ATTACHMENT in $TGW_ATTACHMENTS; do
        echo "Deleting Transit Gateway Attachment: $TGW_ATTACHMENT"
        aws ec2 delete-transit-gateway-attachment --transit-gateway-attachment-id $TGW_ATTACHMENT
    done
    
    if [ ! -z "$TGW_ATTACHMENTS" ]; then
        echo "Waiting for Transit Gateway Attachments to be deleted..."
        sleep 30
    fi
    
    # Delete Subnets
    echo "Checking for Subnets..."
    SUBNET_IDS=$(aws ec2 describe-subnets --filters "Name=vpc-id,Values=$VPC_ID" --query 'Subnets[*].SubnetId' --output text)
    for SUBNET_ID in $SUBNET_IDS; do
        echo "Deleting Subnet: $SUBNET_ID"
        aws ec2 delete-subnet --subnet-id $SUBNET_ID
    done
    
    # Detach and Delete Internet Gateways
    echo "Checking for Internet Gateways..."
    IGW_IDS=$(aws ec2 describe-internet-gateways --filters "Name=attachment.vpc-id,Values=$VPC_ID" --query 'InternetGateways[*].InternetGatewayId' --output text)
    for IGW_ID in $IGW_IDS; do
        echo "Detaching Internet Gateway: $IGW_ID"
        aws ec2 detach-internet-gateway --internet-gateway-id $IGW_ID --vpc-id $VPC_ID
        echo "Deleting Internet Gateway: $IGW_ID"
        aws ec2 delete-internet-gateway --internet-gateway-id $IGW_ID
    done
    
    # Delete Security Groups (except default)
    echo "Checking for Security Groups..."
    SG_IDS=$(aws ec2 describe-security-groups --filters "Name=vpc-id,Values=$VPC_ID" --query 'SecurityGroups[?GroupName!=`default`].GroupId' --output text)
    for SG_ID in $SG_IDS; do
        echo "Deleting Security Group: $SG_ID"
        aws ec2 delete-security-group --group-id $SG_ID
    done
    
    # Delete Network ACLs (except default)
    echo "Checking for Network ACLs..."
    NACL_IDS=$(aws ec2 describe-network-acls --filters "Name=vpc-id,Values=$VPC_ID" --query 'NetworkAcls[?!IsDefault].NetworkAclId' --output text)
    for NACL_ID in $NACL_IDS; do
        echo "Deleting Network ACL: $NACL_ID"
        aws ec2 delete-network-acl --network-acl-id $NACL_ID
    done
    
    # Delete Route Tables (except main)
    echo "Checking for Route Tables..."
    RT_IDS=$(aws ec2 describe-route-tables --filters "Name=vpc-id,Values=$VPC_ID" --query 'RouteTables[?Associations[0].Main!=`true`].RouteTableId' --output text)
    for RT_ID in $RT_IDS; do
        # First, disassociate any subnet associations
        ASSOC_IDS=$(aws ec2 describe-route-tables --route-table-id $RT_ID --query 'RouteTables[0].Associations[?!Main].RouteTableAssociationId' --output text)
        for ASSOC_ID in $ASSOC_IDS; do
            echo "Disassociating Route Table Association: $ASSOC_ID"
            aws ec2 disassociate-route-table --association-id $ASSOC_ID
        done
        
        echo "Deleting Route Table: $RT_ID"
        aws ec2 delete-route-table --route-table-id $RT_ID
    done
    
    # Finally, delete the VPC
    echo "Deleting VPC: $VPC_ID"
    aws ec2 delete-vpc --vpc-id $VPC_ID
    
    echo "VPC $VPC_ID has been deleted along with its resources."
    echo "---------------------------------------------------"
done

echo "All non-default VPCs have been deleted."
