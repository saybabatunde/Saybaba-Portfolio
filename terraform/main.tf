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

# API Gateway
resource "aws_apigatewayv2_api" "user_onboarding_api" {
  name          = "UserOnboarding-API"
  protocol_type = "HTTP"
  cors_configuration {
    allow_origins = ["*"]
    allow_methods = ["POST", "GET", "OPTIONS"]
    allow_headers = ["content-type"]
  }
}

# API Gateway Integration with Lambda (Create User)
resource "aws_apigatewayv2_integration" "create_user_integration" {
  api_id           = aws_apigatewayv2_api.user_onboarding_api.id
  integration_type = "AWS_PROXY"
  integration_method = "POST"
  payload_format_version = "2.0"
  target           = "arn:aws:apigatewayv2:${var.aws_region}:lambda:path/2015-03-31/functions/${aws_lambda_function.create_user.arn}/invocations"
}

# API Gateway Route for Create User
resource "aws_apigatewayv2_route" "create_user_route" {
  api_id    = aws_apigatewayv2_api.user_onboarding_api.id
  route_key = "POST /create-user"
  target    = "integrations/${aws_apigatewayv2_integration.create_user_integration.id}"
}

# Lambda Permission for API Gateway
resource "aws_lambda_permission" "api_gateway" {
  statement_id  = "AllowAPIGatewayInvoke"
  action        = "lambda:InvokeFunction"
  function_name = aws_lambda_function.create_user.function_name
  principal     = "apigateway.amazonaws.com"
  source_arn    = "${aws_apigatewayv2_api.user_onboarding_api.execution_arn}/*/*"
}

# API Gateway Stage
resource "aws_apigatewayv2_stage" "default" {
  api_id      = aws_apigatewayv2_api.user_onboarding_api.id
  name        = "$default"
  auto_deploy = true
}

# Outputs
output "api_endpoint" {
  description = "API Gateway endpoint URL"
  value       = "${aws_apigatewayv2_api.user_onboarding_api.api_endpoint}/create-user"
}

output "dynamodb_table" {
  description = "DynamoDB table name"
  value       = aws_dynamodb_table.audit_logs.name
}

output "lambda_function_name" {
  description = "Lambda function name"
  value       = aws_lambda_function.create_user.function_name
}
