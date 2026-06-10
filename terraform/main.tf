terraform {
  required_version = ">= 1.0"
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
  }
}

provider "aws" {
  region = var.aws_region

  default_tags {
    tags = {
      Project = "UserOnboardingPortal"
      ManagedBy = "Terraform"
      Environment = var.environment
    }
  }
}

# DynamoDB Table for Audit Logs
resource "aws_dynamodb_table" "audit_logs" {
  name           = "UserOnboardingAuditLog"
  billing_mode   = "PAY_PER_REQUEST"
  hash_key       = "auditId"
  range_key      = "timestamp"

  attribute {
    name = "auditId"
    type = "S"
  }

  attribute {
    name = "timestamp"
    type = "S"
  }

  ttl {
    attribute_name = "ttl"
    enabled        = true
  }

  tags = {
    Name = "UserOnboardingAuditLog"
  }
}

# IAM Role for Lambda
resource "aws_iam_role" "lambda_role" {
  name = "UserOnboardingLambdaRole"

  assume_role_policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Action = "sts:AssumeRole"
        Effect = "Allow"
        Principal = {
          Service = "lambda.amazonaws.com"
        }
      }
    ]
  })
}

# IAM Policy for Lambda to access DynamoDB
resource "aws_iam_role_policy" "lambda_dynamodb_policy" {
  name   = "LambdaDynamoDBPolicy"
  role   = aws_iam_role.lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "dynamodb:PutItem",
          "dynamodb:GetItem",
          "dynamodb:Query",
          "dynamodb:Scan"
        ]
        Resource = aws_dynamodb_table.audit_logs.arn
      }
    ]
  })
}

# IAM Policy for Lambda to create/manage IAM users
resource "aws_iam_role_policy" "lambda_iam_policy" {
  name   = "LambdaIAMPolicy"
  role   = aws_iam_role.lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "iam:CreateUser",
          "iam:DeleteUser",
          "iam:AddUserToGroup",
          "iam:RemoveUserFromGroup",
          "iam:ListGroupsForUser"
        ]
        Resource = "arn:aws:iam::${var.aws_account_id}:user/*"
      },
      {
        Effect = "Allow"
        Action = [
          "iam:ListGroups"
        ]
        Resource = "*"
      }
    ]
  })
}

# CloudWatch Logs policy for Lambda
resource "aws_iam_role_policy" "lambda_logs_policy" {
  name   = "LambdaLogsPolicy"
  role   = aws_iam_role.lambda_role.id
  policy = jsonencode({
    Version = "2012-10-17"
    Statement = [
      {
        Effect = "Allow"
        Action = [
          "logs:CreateLogGroup",
          "logs:CreateLogStream",
          "logs:PutLogEvents"
        ]
        Resource = "arn:aws:logs:${var.aws_region}:${var.aws_account_id}:*"
      }
    ]
  })
}

# Lambda Function (Create User)
resource "aws_lambda_function" "create_user" {
  filename      = "lambda_package.zip"
  function_name = "UserOnboarding-CreateUser"
  role          = aws_iam_role.lambda_role.arn
  handler       = "create_user.lambda_handler"
  runtime       = "python3.11"
  timeout       = 30

  environment {
    variables = {
      AUDIT_TABLE = aws_dynamodb_table.audit_logs.name
    }
  }

  depends_on = [aws_iam_role_policy.lambda_dynamodb_policy]
}

# API Gateway REST API
resource "aws_api_gateway_rest_api" "user_onboarding_api" {
  name        = "UserOnboarding-API"
  description = "API for user onboarding portal"

  endpoint_configuration {
    types = ["REGIONAL"]
  }
}

# Create User Resource
resource "aws_api_gateway_resource" "create_user" {
  rest_api_id = aws_api_gateway_rest_api.user_onboarding_api.id
  parent_id   = aws_api_gateway_rest_api.user_onboarding_api.root_resource_id
  path_part   = "create-user"
}

# Create User Method
resource "aws_api_gateway_method" "create_user_method" {
  rest_api_id      = aws_api_gateway_rest_api.user_onboarding_api.id
  resource_id      = aws_api_gateway_resource.create_user.id
  http_method      = "POST"
  authorization    = "NONE"
}

# Lambda Integration
resource "aws_api_gateway_integration" "create_user_lambda" {
  rest_api_id      = aws_api_gateway_rest_api.user_onboarding_api.id
  resource_id      = aws_api_gateway_resource.create_user.id
  http_method      = aws_api_gateway_method.create_user_method.http_method
  type             = "AWS_PROXY"
  integration_http_method = "POST"
  uri              = aws_lambda_function.create_user.invoke_arn
}

# Integration Response for POST (to add CORS headers)
resource "aws_api_gateway_integration_response" "create_user_integration_response" {
  rest_api_id       = aws_api_gateway_rest_api.user_onboarding_api.id
  resource_id       = aws_api_gateway_resource.create_user.id
  http_method       = aws_api_gateway_method.create_user_method.http_method
  status_code       = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  depends_on = [aws_api_gateway_method_response.create_user_method_response]
}

# Method Response for POST
resource "aws_api_gateway_method_response" "create_user_method_response" {
  rest_api_id      = aws_api_gateway_rest_api.user_onboarding_api.id
  resource_id      = aws_api_gateway_resource.create_user.id
  http_method      = aws_api_gateway_method.create_user_method.http_method
  status_code      = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

# OPTIONS Method for CORS Preflight
resource "aws_api_gateway_method" "create_user_options" {
  rest_api_id      = aws_api_gateway_rest_api.user_onboarding_api.id
  resource_id      = aws_api_gateway_resource.create_user.id
  http_method      = "OPTIONS"
  authorization    = "NONE"
}

# OPTIONS Integration (Mock)
resource "aws_api_gateway_integration" "create_user_options_integration" {
  rest_api_id      = aws_api_gateway_rest_api.user_onboarding_api.id
  resource_id      = aws_api_gateway_resource.create_user.id
  http_method      = aws_api_gateway_method.create_user_options.http_method
  type             = "MOCK"
}

# OPTIONS Integration Response
resource "aws_api_gateway_integration_response" "create_user_options_response" {
  rest_api_id       = aws_api_gateway_rest_api.user_onboarding_api.id
  resource_id       = aws_api_gateway_resource.create_user.id
  http_method       = aws_api_gateway_method.create_user_options.http_method
  status_code       = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = "'Content-Type,X-Amz-Date,Authorization,X-Api-Key,X-Amz-Security-Token'"
    "method.response.header.Access-Control-Allow-Methods" = "'GET,POST,PUT,DELETE,OPTIONS'"
    "method.response.header.Access-Control-Allow-Origin"  = "'*'"
  }
  depends_on = [aws_api_gateway_integration.create_user_options_integration]
}

# OPTIONS Method Response
resource "aws_api_gateway_method_response" "create_user_options_method_response" {
  rest_api_id      = aws_api_gateway_rest_api.user_onboarding_api.id
  resource_id      = aws_api_gateway_resource.create_user.id
  http_method      = aws_api_gateway_method.create_user_options.http_method
  status_code      = "200"
  response_parameters = {
    "method.response.header.Access-Control-Allow-Headers" = true
    "method.response.header.Access-Control-Allow-Methods" = true
    "method.response.header.Access-Control-Allow-Origin"  = true
  }
}

# Lambda Permission for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_user.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_api_gateway_rest_api.user_onboarding_api.execution_arn}/*/*"
}

# Deploy API
resource "aws_api_gateway_deployment" "user_onboarding" {
  rest_api_id = aws_api_gateway_rest_api.user_onboarding_api.id

  depends_on = [
    aws_api_gateway_integration.create_user_lambda
  ]
}

# API Gateway Stage
resource "aws_api_gateway_stage" "prod" {
  deployment_id = aws_api_gateway_deployment.user_onboarding.id
  rest_api_id   = aws_api_gateway_rest_api.user_onboarding_api.id
  stage_name    = "prod"
}

# Outputs
output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = "${aws_api_gateway_stage.prod.invoke_url}/create-user"
}

output "dynamodb_table" {
  description = "DynamoDB table name"
  value       = aws_dynamodb_table.audit_logs.name
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.create_user.function_name
}
