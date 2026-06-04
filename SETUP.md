# Saybaba Portfolio — Setup Guide

## Prerequisites
- Node.js 18+
- Git
- Supabase account (free tier works)
- Vercel account (for deployment)

## Local Development Setup

### 1. Clone or Initialize Project
```bash
cd Saybaba-Portfolio
npm install
```

### 2. Supabase Setup

1. Go to https://supabase.com and create a project
2. In Supabase dashboard:
   - Go to **Settings** → **API**
   - Copy `Project URL` and `anon key`
   - Save these values

3. Copy `.env.example` to `.env.local`:
   ```bash
   cp env.example .env.local
   ```

4. Fill in `.env.local` with your Supabase values:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### 3. Create Supabase Tables

In Supabase dashboard, go to **SQL Editor** and run:

```sql
-- Users table (for demo login)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  password TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert demo user
INSERT INTO users (username, password) VALUES ('admin', 'admin');

-- Projects table
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL (AWS, Azure, Python, Apps, Other),
  link TEXT,
  image_url TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Insert sample projects
INSERT INTO projects (title, description, category, link) VALUES
('AWS Infrastructure Setup', 'Terraform automation for AWS resources', 'AWS', 'https://github.com/...'),
('Azure Bicep Templates', 'IaC templates for Azure deployment', 'Azure', 'https://github.com/...'),
('Python Data Pipeline', 'ETL pipeline for data processing', 'Python', 'https://github.com/...');
```

### 4. Run Local Dev Server

```bash
npm run dev
```

Visit `http://localhost:3000` in browser

Login with:
- Username: `admin`
- Password: `admin`

## Deployment to Vercel

### 1. Push to GitHub
```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/saybaba-portfolio.git
git push -u origin main
```

### 2. Deploy to Vercel
1. Go to https://vercel.com
2. Click "New Project"
3. Import your GitHub repo
4. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Click Deploy

### 3. Share on LinkedIn
- Copy your Vercel URL (e.g., saybaba-portfolio.vercel.app)
- Add to LinkedIn profile
- Share the link: "Check out my portfolio!"

## File Structure

```
Saybaba-Portfolio/
├── app/                    # Next.js app directory
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Login page
│   └── dashboard/
│       └── page.tsx       # Portfolio dashboard
├── components/            # Reusable components
│   ├── LoginForm.tsx
│   └── ProjectCard.tsx
├── lib/
│   └── supabase.ts        # Supabase client
├── public/                # Static assets
├── package.json
├── next.config.js
├── tsconfig.json
└── env.example
```

## Troubleshooting

**Login not working?**
- Check Supabase URL and keys in `.env.local`
- Verify user `admin` exists in Supabase users table

**Page looks broken?**
- Clear `.next` folder: `rm -rf .next`
- Restart dev server: `npm run dev`

**Deployment fails?**
- Check Vercel logs
- Ensure `.env.local` is NOT in git (add to `.gitignore`)
- Verify environment variables set in Vercel dashboard

## Next Steps

1. ✅ Local setup and login working
2. ✅ Add your projects to Supabase
3. ✅ Customize styling/branding
4. ✅ Deploy to Vercel
5. ✅ Share on LinkedIn
