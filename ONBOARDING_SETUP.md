# User Onboarding Portal - Setup Guide

This guide explains how to deploy the User Onboarding Portal to your AWS account.

## Architecture Overview

```
Frontend (Next.js) → API Gateway → Lambda → IAM / DynamoDB
```

### Components:
- **Frontend:** React/Next.js deployed on Vercel
- **Backend:** AWS Lambda functions (Python)
- **Database:** DynamoDB for audit logs
- **API:** API Gateway for REST endpoints
- **Infrastructure:** Terraform for IaC

## Prerequisites

1. **AWS Account** with credentials configured
   - Access Key ID and Secret Access Key
   - Appropriate IAM permissions

2. **Terraform** installed (v1.0+)
   ```bash
   terraform --version
   ```

3. **Python 3.11+** (for Lambda development)

4. **Next.js** environment variables configured

## Deployment Steps

### Step 1: Configure AWS Credentials

Set up your AWS credentials (already done in `.env.local`):

```bash
export AWS_ACCESS_KEY_ID=your_access_key
export AWS_SECRET_ACCESS_KEY=your_secret_key
export AWS_REGION=us-east-1
```

### Step 2: Package Lambda Function

```bash
cd lambda
pip install -r requirements.txt -t package/
cd package
zip -r ../lambda_package.zip .
cd ..
zip -g lambda_package.zip create_user.py
cd ..
cp lambda/lambda_package.zip terraform/
```

### Step 3: Deploy with Terraform

```bash
cd terraform

# Initialize Terraform
terraform init

# Plan the deployment
terraform plan

# Apply the deployment
terraform apply
```

Terraform will create:
- ✓ DynamoDB table for audit logs
- ✓ Lambda function for user creation
- ✓ API Gateway with routes
- ✓ IAM roles and policies
- ✓ CloudWatch logs

### Step 4: Get API Endpoint

After deployment, Terraform will output the API endpoint:

```bash
terraform output api_endpoint
```

Copy this endpoint and add to your `.env.local`:

```
NEXT_PUBLIC_API_ENDPOINT=https://your-api-id.execute-api.us-east-1.amazonaws.com
```

### Step 5: Test Locally

```bash
npm run dev
# Visit http://localhost:3000/dashboard/onboarding
```

### Step 6: Deploy Frontend to Vercel

```bash
vercel env add NEXT_PUBLIC_API_ENDPOINT
# Enter your API endpoint when prompted

git push origin main
# Vercel auto-deploys
```

## AWS Permissions Required

The Lambda function needs these IAM permissions:

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "iam:CreateUser",
        "iam:DeleteUser",
        "iam:AddUserToGroup",
        "iam:RemoveUserFromGroup",
        "iam:ListGroupsForUser"
      ],
      "Resource": "arn:aws:iam::ACCOUNT_ID:user/*"
    },
    {
      "Effect": "Allow",
      "Action": [
        "dynamodb:PutItem",
        "dynamodb:GetItem",
        "dynamodb:Query",
        "dynamodb:Scan"
      ],
      "Resource": "arn:aws:dynamodb:REGION:ACCOUNT_ID:table/UserOnboardingAuditLog"
    }
  ]
}
```

## Cleanup

To delete all AWS resources:

```bash
cd terraform
terraform destroy

# Manually delete IAM users created during testing:
aws iam delete-user --user-name demo-testuser-*
```

## Environment Variables

### Development (`.env.local`)
```
AWS_ACCESS_KEY_ID=your_key
AWS_SECRET_ACCESS_KEY=your_secret
AWS_ACCOUNT_ID=386973369589
AWS_REGION=us-east-1
NEXT_PUBLIC_API_ENDPOINT=http://localhost:3001
```

### Production (Vercel)
- Store credentials in Vercel Settings → Environment Variables
- Or use IAM roles if deployed on AWS

## Troubleshooting

### Lambda function not found
- Ensure `lambda_package.zip` is in the terraform directory
- Check that all dependencies are included in the zip file

### API Gateway CORS errors
- CORS is already configured in Terraform
- If issues persist, check API Gateway → API → CORS settings

### DynamoDB query returns empty
- Check that DynamoDB table was created
- Verify IAM permissions for the Lambda role

### Audit logs not appearing
- Check CloudWatch Logs for Lambda errors
- Verify DynamoDB table name matches in Lambda environment variables

## Architecture Decisions

### Why Lambda?
- Serverless (no VMs to manage)
- Scales automatically
- Pay-per-execution (cheap for demos)
- Easy to integrate with IAM

### Why DynamoDB?
- Serverless database
- Free tier included
- Auto-scaling
- Low latency for audit logs

### Why Terraform?
- Infrastructure as Code
- Reproducible deployments
- Version control
- Easy to modify and scale

## Future Enhancements

- [ ] Add MFA enforcement
- [ ] Add email notifications
- [ ] Add approval workflow (multi-step)
- [ ] Add Azure implementation
- [ ] Add cost dashboard
- [ ] Add CloudTrail integration

## Support

For issues or questions, check:
1. CloudWatch Logs (Lambda errors)
2. API Gateway request/response logs
3. DynamoDB console (table metrics)
4. Terraform state file (resource status)
