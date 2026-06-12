resource "azurerm_resource_group" "rg" {
  name     = "${var.project_name}-rg-${var.environment}"
  location = var.azure_region

  tags = {
    Project     = "UserOnboardingPortal"
    ManagedBy   = "Terraform"
    Environment = var.environment
  }
}

# Storage Account for audit logs
resource "azurerm_storage_account" "storage" {
  name                     = "${var.project_name}storage${var.environment}"
  resource_group_name      = azurerm_resource_group.rg.name
  location                 = azurerm_resource_group.rg.location
  account_tier             = "Standard"
  account_replication_type = "LRS"

  tags = {
    Name = "UserOnboardingStorage"
  }
}

# Table Storage for audit logs
resource "azurerm_storage_table" "audit_logs" {
  name                 = "auditlogs"
  storage_account_name = azurerm_storage_account.storage.name
}

# Application Insights for logging
resource "azurerm_application_insights" "appinsights" {
  name                = "${var.project_name}-insights-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  application_type    = "web"

  tags = {
    Name = "UserOnboardingAppInsights"
  }
}

# Service Plan (Consumption Plan - pay per execution)
resource "azurerm_service_plan" "app_service_plan" {
  name                = "${var.project_name}-plan-${var.environment}"
  location            = azurerm_resource_group.rg.location
  resource_group_name = azurerm_resource_group.rg.name
  os_type             = "Linux"
  sku_name            = "Y1"

  tags = {
    Name = "UserOnboardingPlan"
  }
}

# Function App
resource "azurerm_linux_function_app" "function_app" {
  name                       = "${var.project_name}-functions-${var.environment}"
  location                   = azurerm_resource_group.rg.location
  resource_group_name        = azurerm_resource_group.rg.name
  service_plan_id            = azurerm_service_plan.app_service_plan.id
  storage_account_name       = azurerm_storage_account.storage.name
  storage_account_access_key = azurerm_storage_account.storage.primary_access_key

  site_config {
    application_stack {
      python_version = "3.11"
    }
  }

  app_settings = {
    "APPINSIGHTS_INSTRUMENTATIONKEY" = azurerm_application_insights.appinsights.instrumentation_key
    "STORAGE_ACCOUNT_NAME"           = azurerm_storage_account.storage.name
    "STORAGE_ACCOUNT_KEY"            = azurerm_storage_account.storage.primary_access_key
    "AUDIT_TABLE_NAME"               = azurerm_storage_table.audit_logs.name
  }

  tags = {
    Name = "UserOnboardingFunctionApp"
  }
}

# Outputs
output "function_app_url" {
  description = "Base URL for the Function App"
  value       = "https://${azurerm_linux_function_app.function_app.default_hostname}"
}

output "storage_account_name" {
  description = "Storage account name"
  value       = azurerm_storage_account.storage.name
}

output "storage_account_key" {
  description = "Storage account key"
  value       = azurerm_storage_account.storage.primary_access_key
  sensitive   = true
}
