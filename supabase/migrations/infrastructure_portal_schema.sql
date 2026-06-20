-- Infrastructure Request Portal Schema

-- Infrastructure Requests Table
CREATE TABLE IF NOT EXISTS infrastructure_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_email TEXT NOT NULL,
  vm_size TEXT NOT NULL, -- B1s, B2s, B4ms
  region TEXT NOT NULL, -- eastus, uksouth, etc
  compliance_level TEXT NOT NULL, -- standard, regulated, healthcare
  cost_estimate DECIMAL(10, 2),
  status TEXT NOT NULL DEFAULT 'pending', -- pending, approved, deployed, failed, deleted
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  approved_at TIMESTAMP WITH TIME ZONE,
  deployed_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  error_message TEXT
);

-- Deployed Resources Table
CREATE TABLE IF NOT EXISTS deployed_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID NOT NULL REFERENCES infrastructure_requests(id) ON DELETE CASCADE,
  azure_resource_id TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- vm, storage, sql, vault
  resource_name TEXT NOT NULL,
  size TEXT,
  region TEXT,
  monthly_cost DECIMAL(10, 2),
  estimated_monthly_cost DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  deleted_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' -- active, expired, deleted
);

-- Audit Log Table
CREATE TABLE IF NOT EXISTS infrastructure_audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES infrastructure_requests(id) ON DELETE CASCADE,
  action TEXT NOT NULL, -- submitted, approved, deployed, deleted, failed
  user_email TEXT,
  details JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_infrastructure_requests_email ON infrastructure_requests(user_email);
CREATE INDEX IF NOT EXISTS idx_infrastructure_requests_status ON infrastructure_requests(status);
CREATE INDEX IF NOT EXISTS idx_deployed_resources_request_id ON deployed_resources(request_id);
CREATE INDEX IF NOT EXISTS idx_deployed_resources_status ON deployed_resources(status);
CREATE INDEX IF NOT EXISTS idx_audit_logs_request_id ON infrastructure_audit_logs(request_id);
