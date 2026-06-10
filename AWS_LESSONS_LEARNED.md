# AWS User Onboarding - Lessons Learned & Mistakes

## Critical Mistakes Made

### 1. **Environment Variables Not Loading (MAJOR)**
**Mistake:** Created `.env.local` but Next.js dev server didn't pick up `NEXT_PUBLIC_API_ENDPOINT` variable.
- Tried multiple times to reload, but env var wasn't being read
- Fell back to hardcoding endpoint instead of debugging root cause

**Root Cause:** Next.js caches environment variables at startup. Changes to `.env.local` require:
- Complete dev server restart (kill + restart, not just file save)
- Clear `.next` build cache
- Browser hard refresh (Ctrl+Shift+R)

**Fix for Tomorrow:** 
- Document env var strategy BEFORE coding
- Test env loading immediately after setup
- Verify with `console.log(process.env.NEXT_PUBLIC_API_ENDPOINT)` in code

### 2. **Incomplete Backend Planning**
**Mistake:** Created POST `/create-user` endpoint but forgot about GET `/audit-logs` endpoint
- Frontend code expected both endpoints
- Only wired up one in Terraform
- Discovered missing endpoint after hours of CORS debugging

**Fix for Tomorrow:**
- Map out ALL endpoints on paper FIRST
- Create endpoint checklist before any Terraform code
- For this pattern: Create-User (POST) + Get Audit Logs (GET) + List Users (GET optional)

### 3. **CORS Configuration Was Incomplete**
**Mistake:** Added CORS to API Gateway in Terraform, but also needed Lambda function to return CORS headers
- API Gateway config alone isn't enough
- With AWS_PROXY integration, Lambda is responsible for response headers
- Debugged for 2+ hours before realizing both layers needed CORS

**What Needed:**
- API Gateway: OPTIONS method + integration responses with CORS headers
- Lambda function: Return `Access-Control-Allow-Origin` header in response
- Both are required together

**Fix for Tomorrow:**
- Document CORS strategy upfront: "Lambda will handle all CORS headers"
- Include CORS headers in Lambda response from Day 1, don't add later
- Test CORS with `curl -i` before testing in browser

### 4. **Terraform Didn't Detect Lambda Changes**
**Mistake:** Updated Lambda code but Terraform didn't redeploy it
- No `source_code_hash` in Lambda resource
- Terraform doesn't detect zip file changes without hash

**Fix for Tomorrow:**
- Always include in Lambda resource:
  ```hcl
  source_code_hash = filebase64sha256("lambda_package.zip")
  ```
- Do this from the first Lambda resource definition

### 5. **API Gateway Deployment Caching**
**Mistake:** Added CORS to Terraform but API Gateway wasn't redeploying with new config
- Deployment existed with old config
- Needed to make deployment depend on new CORS resources

**Fix for Tomorrow:**
- Make deployment depend on ALL integration/method resources:
  ```hcl
  depends_on = [
    aws_api_gateway_integration.create_user_lambda,
    aws_api_gateway_integration_response.create_user_integration_response,
    aws_api_gateway_method.options,  # Include OPTIONS
    aws_api_gateway_integration_response.options_response
  ]
  ```

### 6. **Tested in Production First**
**Mistake:** Went straight to Vercel production to test instead of fixing local dev environment
- Should have fixed `.env.local` loading locally first
- Would have caught CORS issues faster
- Local testing is faster than waiting for Vercel deployment

**Fix for Tomorrow:**
- Get local dev working with mock data first
- Test API integration locally with hardcoded endpoint OR .env.local
- Only move to production after local tests pass

### 7. **Didn't Plan API Response Format**
**Mistake:** Lambda response format wasn't clear
- Hardcoded response structure without documentation
- Could have had mismatch between frontend expectations and backend

**Fix for Tomorrow:**
- Document API contract BEFORE coding:
  ```
  POST /create-user
  Request: { name, email, group }
  Response: { auditId, username, email, group, status, logs: [...] }
  
  GET /audit-logs  
  Response: [{ auditId, timestamp, fullName, email, group, status, logs: [...] }]
  ```

## What Went Right

✅ Infrastructure was deployed correctly  
✅ Terraform IaC approach was sound  
✅ Architecture was reasonable (Lambda + DynamoDB + API Gateway)  
✅ Code quality was good  
✅ Committed to GitHub with proper history  

## Azure Build Checklist (Tomorrow)

- [ ] **Plan Phase**
  - [ ] Map all API endpoints (POST, GET, DELETE)
  - [ ] Document API request/response format
  - [ ] Design CORS strategy: "Azure Function handles CORS headers"
  - [ ] Decide on data storage (Cosmos DB, SQL, or Table Storage)

- [ ] **Setup Phase**
  - [ ] Test `.env.local` loading immediately
  - [ ] Add `console.log` to verify env vars
  - [ ] Create all .env variables needed upfront

- [ ] **Backend Phase**
  - [ ] Create Azure Function for each endpoint
  - [ ] Include CORS headers in ALL responses from Day 1
  - [ ] Add proper error responses with headers
  - [ ] Test locally with curl/Postman first

- [ ] **Terraform/IaC Phase**
  - [ ] Include `source_code_hash` in Azure Function resource
  - [ ] Make deployment depend on all functions/integrations
  - [ ] Test Terraform plan before apply

- [ ] **Integration Phase**
  - [ ] Test API locally with .env endpoint
  - [ ] Only then deploy to production
  - [ ] Test CORS with curl before browser

- [ ] **Testing**
  - [ ] Test each API endpoint independently
  - [ ] Test CORS preflight requests
  - [ ] Test error cases (400, 500)
  - [ ] Test full user flow end-to-end

## Time Estimate for Azure Build

With lessons learned:
- Planning: 15 minutes
- Backend (Azure Functions): 45 minutes
- Infrastructure (Terraform): 30 minutes
- Integration + Testing: 30 minutes
- **Total: ~2 hours** (vs 6+ hours for AWS with debugging)

## Key Principle for Tomorrow

**Build complete units, not pieces:**
- Don't add just POST endpoint and debug later
- Don't add CORS to API Gateway only
- Don't hardcode what should be in .env
- Think end-to-end before starting any one piece
