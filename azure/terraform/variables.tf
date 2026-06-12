variable "azure_subscription_id" {
  description = "Azure Subscription ID"
  type        = string
}

variable "azure_tenant_id" {
  description = "Azure Tenant ID"
  type        = string
}

variable "azure_client_id" {
  description = "Azure Client ID (Service Principal)"
  type        = string
}

variable "azure_client_secret" {
  description = "Azure Client Secret (Service Principal)"
  type        = string
  sensitive   = true
}

variable "azure_region" {
  description = "Azure Region"
  type        = string
  default     = "eastus2"
}

variable "environment" {
  description = "Environment name"
  type        = string
  default     = "dev"
}

variable "project_name" {
  description = "Project name for resource naming"
  type        = string
  default     = "useronboarding"
}
