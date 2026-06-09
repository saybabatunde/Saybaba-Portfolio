# AWS User Onboarding Portal

**Live Demo:** Coming soon at `babatundeportfolio.com/dashboard/onboarding`

## Overview

This is a **production-ready user onboarding system** that demonstrates:
- ✅ Real AWS integration (Lambda, IAM, DynamoDB, API Gateway)
- ✅ Serverless architecture (cost-effective, scalable)
- ✅ Infrastructure-as-Code (Terraform)
- ✅ Full audit trail and logging
- ✅ Real-time user creation

**What it does:** Admins fill out a form, click "Create," and real AWS IAM users are created in seconds with full audit logging.

---

## Key Features

### 1. **User Creation Form**
- Clean, intuitive UI
- Real-time validation
- Assign users to IAM groups (developers, admins, finance)
- Displays success/failure feedback instantly

### 2. **Real AWS Integration**
```python
# Actual AWS API calls:
iam.create_user(UserName='sarah@company.com')
iam.add_user_to_group(GroupName='developers', UserName='sarah@company.com')
```

### 3. **Comprehensive Audit Logging**
Every action is logged with:
- Who created the user
- When it was created
- What API calls were made
- Success/failure status
- Detailed error messages if something fails

### 4. **Scalable Architecture**
```
Frontend (Vercel)  →  API Gateway  →  Lambda  →  IAM + DynamoDB
```

---

## Technology Stack

| Layer | Technology | Why |
|-------|-----------|-----|
| **Frontend** | Next.js 14, React 18, TypeScript | Modern, fast, type-safe |
| **Backend** | AWS Lambda (Python) | Serverless, scalable, zero-ops |
| **Database** | DynamoDB | Serverless, auto-scaling, cheap |
| **API** | AWS API Gateway | Managed REST API |
| **Identity** | AWS IAM | Enterprise-grade access control |
| **Logging** | CloudWatch + DynamoDB | Centralized, queryable audit trail |
| **IaC** | Terraform | Infrastructure as Code, version-controlled |
| **Deployment** | Vercel (frontend), AWS (backend) | Automated, reliable |

---

## Architecture Diagram

```
┌─────────────────────────────────────────────────────┐
│         Frontend (Next.js on Vercel)               │
│                                                     │
│  ┌────────────────┐          ┌──────────────────┐ │
│  │ Create User    │          │ Audit Dashboard  │ │
│  │ Form           │          │                  │ │
│  └────────────────┘          └──────────────────┘ │
└────────────────────┬──────────────────────────────┘
                     │
              HTTP/REST API
                     │
        ┌────────────▼────────────┐
        │   API Gateway           │
        │   (AWS Managed)         │
        └────────────┬────────────┘
                     │
        ┌────────────▼─────────────┐
        │  AWS Lambda (Python)     │
        │  - Validate input        │
        │  - Call IAM APIs         │
        │  - Log to DynamoDB       │
        └────────────┬─────────────┘
                     │
        ┌────────────┴────────────┐
        │                         │
    ┌───▼────┐          ┌────────▼─────┐
    │   IAM  │          │   DynamoDB    │
    │ Create │          │  Audit Logs   │
    │ Users  │          │               │
    └────────┘          └───────────────┘
```

---

## How It Works

### User Journey

1. **Admin Logs In**
   - Authentication via portfolio system
   - Redirected to onboarding page

2. **Admin Fills Form**
   - Name: "Sarah Johnson"
   - Email: "sarah@company.com"
   - Group: "developers"

3. **Click "Approve & Create"**
   - Frontend sends to API Gateway
   - Lambda function executes

4. **Lambda Creates User**
   ```python
   ✓ Creates IAM user
   ✓ Adds to IAM group
   ✓ Logs every action to DynamoDB
   ```

5. **Admin Sees Results**
   - Success message with user details
   - Audit log updated in real-time
   - Can verify in AWS IAM console

### API Endpoints

**POST `/api/create-user`**
```json
Request:
{
  "name": "Sarah Johnson",
  "email": "sarah@company.com",
  "group": "developers"
}

Response:
{
  "auditId": "abc-123-def-456",
  "username": "sarah",
  "email": "sarah@company.com",
  "group": "developers",
  "status": "COMPLETED",
  "logs": [
    {
      "timestamp": "2024-06-09T14:32:15Z",
      "action": "CreateIAMUser",
      "status": "SUCCESS",
      "details": "Created IAM user: sarah"
    }
  ]
}
```

**GET `/api/audit-logs`**
```json
Response:
[
  {
    "auditId": "abc-123",
    "timestamp": "2024-06-09T14:32:15Z",
    "fullName": "Sarah Johnson",
    "email": "sarah@company.com",
    "group": "developers",
    "status": "COMPLETED",
    "logs": [...]
  }
]
```

---

## Deployment

### Development
```bash
# Local setup with mock backend
npm run dev
# Visit http://localhost:3000/dashboard/onboarding
```

### Production

**Backend (AWS):**
```bash
cd terraform
terraform plan
terraform apply
# Creates Lambda, DynamoDB, API Gateway
```

**Frontend (Vercel):**
```bash
git push origin main
# Auto-deploys to vercel
```

See [ONBOARDING_SETUP.md](./ONBOARDING_SETUP.md) for detailed instructions.

---

## Security Considerations

### ✅ Implemented
- **Least-privilege IAM role** for Lambda (only create/manage users)
- **Audit logging** for every action
- **Environment variables** for credentials (not hardcoded)
- **CORS protection** on API Gateway
- **Input validation** (email format, name length)

### 🔐 Production Recommendations
- **MFA enforcement** for user creation
- **Approval workflow** (2-person rule)
- **IP whitelisting** on API Gateway
- **Rate limiting** to prevent abuse
- **CloudTrail** for AWS API audit logs
- **Encryption** at rest (DynamoDB, S3)

---

## What This Shows Recruiters

| Skill | Evidence |
|-------|----------|
| **AWS Services** | Lambda, IAM, DynamoDB, API Gateway, CloudWatch |
| **Infrastructure** | Terraform, multi-layer architecture, scalability |
| **Backend Development** | Python, error handling, logging |
| **Frontend Development** | React, TypeScript, form handling, API integration |
| **System Design** | Serverless, cost-effective, production-ready |
| **Security** | Least-privilege access, audit trails, validation |
| **DevOps** | IaC, deployment automation, monitoring |
| **Real-world Skills** | Handles complex workflows, error states, user feedback |

---

## GitHub Repository

Full source code available at:
```
https://github.com/saybabatunde/Saybaba-Portfolio/tree/main/aws-onboarding
```

Includes:
- Complete Lambda source code
- Terraform configuration
- Next.js frontend components
- Deployment documentation
- Example API calls

---

## Performance & Cost

### Performance
- **API Response Time:** 100-500ms (depends on AWS Lambda cold start)
- **Audit Log Retrieval:** <100ms
- **Real IAM User Creation:** 1-3 seconds

### Cost (Monthly Estimates)
- **Lambda:** ~$0.20 (free tier covers ~1M requests)
- **DynamoDB:** ~$0.00 (free tier)
- **API Gateway:** ~$0.35 per 1M requests (free tier covers first 1M)
- **Total:** <$1/month for light usage

---

## Future Enhancements

- [ ] **Azure Implementation** - Same architecture for Azure AD users
- [ ] **Multi-step Approval** - Require manager approval before creation
- [ ] **Batch Operations** - Create multiple users at once
- [ ] **Email Notifications** - Notify new users automatically
- [ ] **MFA Enforcement** - Require MFA on created accounts
- [ ] **Cost Dashboard** - Show monthly AWS costs
- [ ] **Automated Cleanup** - Archive old audit logs to S3

---

## Why This Project Matters

This isn't a "hello world" app—it's a **real business problem solved with production-grade tools:**

- **Real-world use case:** Every company needs user onboarding
- **Actual AWS integration:** Not a mock or tutorial
- **Scalable architecture:** Works for 10 users or 10,000
- **Cost-effective:** Uses serverless for minimal expense
- **Professional quality:** Clean UI, proper logging, error handling

This shows you can:
1. **Design systems** that work at scale
2. **Integrate AWS services** properly
3. **Write production code** with proper error handling
4. **Deploy and monitor** applications
5. **Document your work** for other engineers

---

## Questions for Recruiters

**"How would you scale this?"**
- DynamoDB auto-scales
- Lambda auto-scales
- Add caching layer (ElastiCache)
- Add queue system (SQS) for bulk operations

**"What if AWS is down?"**
- Would need multi-region deployment
- Could add failover to Azure
- CloudFront for frontend resilience

**"What about security?"**
- Full audit trail in DynamoDB
- CloudTrail for AWS API logging
- IAM least-privilege policies
- Input validation on all endpoints

---

## Contact

For questions about this project:
- **GitHub:** https://github.com/saybabatunde
- **LinkedIn:** https://www.linkedin.com/in/babatundeolawale
- **Email:** olawalebabatunde98@gmail.com
