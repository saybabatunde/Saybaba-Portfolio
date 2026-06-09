variable "aws_region" {
  description = "AWS region"
  type        = string
  default     = "us-east-1"
}

variable "aws_account_id" {
  description = "AWS Account ID"
  type        = string
  default     = "386973369589"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}
