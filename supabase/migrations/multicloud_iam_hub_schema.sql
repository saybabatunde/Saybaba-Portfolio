-- Multi-Cloud Identity & Infrastructure Automation Hub
-- Database Schema for Supabase PostgreSQL

-- Profiles (Users)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  department TEXT,
  role TEXT DEFAULT 'viewer', -- viewer, approver, admin, engineer
  avatar_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Onboarding Requests
CREATE TABLE IF NOT EXISTS onboarding_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  requester_id UUID REFERENCES profiles(id),
  employee_name TEXT NOT NULL,
  employee_email TEXT,
  department TEXT NOT NULL, -- Finance, Engineering, HR, Sales
  job_title TEXT NOT NULL, -- Finance Analyst, Senior Engineer, etc
  location TEXT NOT NULL, -- Canada, USA, UK, etc
  worker_type TEXT NOT NULL, -- Employee, Contractor, Vendor
  start_date DATE,
  manager_name TEXT,
  manager_email TEXT,

  -- Suggested provisioning
  suggested_ad_ou TEXT,
  suggested_entra_groups TEXT[] DEFAULT ARRAY[]::TEXT[],
  suggested_m365_license TEXT,
  suggested_apps TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Approval
  status TEXT DEFAULT 'pending', -- pending, approved, rejected, provisioning, completed
  approved_by UUID REFERENCES profiles(id),
  approved_at TIMESTAMP WITH TIME ZONE,
  rejection_reason TEXT,

  -- Tracking
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Role Mapping Matrix (Admin configuration)
CREATE TABLE IF NOT EXISTS role_mappings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  department TEXT NOT NULL,
  job_title TEXT NOT NULL,
  location TEXT NOT NULL,

  -- Mapped to
  m365_license TEXT,
  entra_groups TEXT[] DEFAULT ARRAY[]::TEXT[],
  security_groups TEXT[] DEFAULT ARRAY[]::TEXT[],
  applications TEXT[] DEFAULT ARRAY[]::TEXT[],
  vpn_access TEXT,
  sharepoint_sites TEXT[] DEFAULT ARRAY[]::TEXT[],

  -- Cloud access
  azure_resources TEXT[] DEFAULT ARRAY[]::TEXT[],
  aws_roles TEXT[] DEFAULT ARRAY[]::TEXT[],

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(department, job_title, location)
);

-- Provisioning Runs (Simulation logs)
CREATE TABLE IF NOT EXISTS provisioning_runs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  request_id UUID REFERENCES onboarding_requests(id),
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed, failed
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  -- Generated values
  generated_username TEXT,
  generated_email TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Provisioning Steps (Detailed progress)
CREATE TABLE IF NOT EXISTS provisioning_steps (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  provisioning_run_id UUID REFERENCES provisioning_runs(id) ON DELETE CASCADE,
  step_number INT,
  step_name TEXT NOT NULL, -- Validate, Generate Username, Assign OU, etc
  status TEXT DEFAULT 'pending', -- pending, in_progress, completed, failed
  result TEXT, -- JSON result or error message
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cloud Resources (Inventory - initially mock data)
CREATE TABLE IF NOT EXISTS cloud_resources (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id TEXT UNIQUE,
  resource_name TEXT NOT NULL,
  resource_type TEXT NOT NULL, -- VM, FunctionApp, Lambda, S3, StorageAccount, etc
  cloud_provider TEXT NOT NULL, -- Azure, AWS, Vercel, Supabase
  environment TEXT, -- dev, staging, prod
  owner_email TEXT,
  owner_name TEXT,

  -- Metadata
  tags JSONB, -- { "Environment": "prod", "Team": "Finance" }
  cost_estimate_monthly DECIMAL(10, 2),
  risk_level TEXT, -- low, medium, high
  is_tagged BOOLEAN DEFAULT FALSE,
  is_public BOOLEAN DEFAULT FALSE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_scanned TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Cloud Costs (Tracking)
CREATE TABLE IF NOT EXISTS cloud_costs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES cloud_resources(id),
  month_year DATE,
  cost_amount DECIMAL(10, 2),
  cost_currency TEXT DEFAULT 'USD',
  cost_breakdown JSONB, -- { "compute": 50, "storage": 20, "network": 10 }

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Risk Findings (Security & compliance issues)
CREATE TABLE IF NOT EXISTS risk_findings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  resource_id UUID REFERENCES cloud_resources(id),
  finding_type TEXT NOT NULL, -- untagged, public, high_privilege, expired_cred, etc
  severity TEXT NOT NULL, -- low, medium, high, critical
  description TEXT,
  recommendation TEXT,
  status TEXT DEFAULT 'open', -- open, acknowledged, remediated

  found_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  remediated_at TIMESTAMP WITH TIME ZONE
);

-- Audit Logs (Everything)
CREATE TABLE IF NOT EXISTS audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  actor_id UUID REFERENCES profiles(id),
  actor_name TEXT,
  actor_email TEXT,
  action TEXT NOT NULL, -- created, approved, rejected, provisioned, scanned, etc
  resource_type TEXT, -- request, role_mapping, provisioning, resource, etc
  resource_id TEXT,
  resource_name TEXT,

  -- Details
  changes JSONB, -- what changed
  status TEXT, -- success, failed
  error_message TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Access Packages (Groups/permissions)
CREATE TABLE IF NOT EXISTS access_packages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  package_name TEXT UNIQUE NOT NULL,
  description TEXT,
  includes_groups TEXT[] DEFAULT ARRAY[]::TEXT[],
  includes_apps TEXT[] DEFAULT ARRAY[]::TEXT[],
  includes_licenses TEXT[] DEFAULT ARRAY[]::TEXT[],
  risk_level TEXT, -- low, medium, high

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_onboarding_requests_status ON onboarding_requests(status);
CREATE INDEX IF NOT EXISTS idx_onboarding_requests_created ON onboarding_requests(created_at);
CREATE INDEX IF NOT EXISTS idx_role_mappings_dept_title ON role_mappings(department, job_title);
CREATE INDEX IF NOT EXISTS idx_provisioning_runs_request ON provisioning_runs(request_id);
CREATE INDEX IF NOT EXISTS idx_cloud_resources_provider ON cloud_resources(cloud_provider);
CREATE INDEX IF NOT EXISTS idx_cloud_resources_type ON cloud_resources(resource_type);
CREATE INDEX IF NOT EXISTS idx_audit_logs_actor ON audit_logs(actor_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created ON audit_logs(created_at);

-- Row-level security policies (optional, for later)
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE onboarding_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;
