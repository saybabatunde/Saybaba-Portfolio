# Saybaba Portfolio — Application Configuration

**What:** A professional portfolio website showcasing AWS, Azure, Python projects and other work, with secure login access via demo credentials.

---

## How I Want You to Work

### Before Coding
- **Read existing code first** — understand context before changing anything
- **Explain your approach in 1-2 sentences** before implementing
- **Make small, focused changes** — no big rewrites
- **Run tests/typecheck after changes** before saying "done"
- **Ask if something seems wrong** with the request before proceeding
- **Don't add dependencies** without asking first

### How to Communicate
- **Direct and concise** — short answers when they work
- **Explain WHY, not just WHAT** — reasoning matters
- **Say "I don't know"** if unsure; don't guess
- **Skip disclaimers** unless they actually matter
- **Assume I'm a beginner with code** — explain like I don't understand
- **No lengthy explanations** for short questions

### What NOT to Do
- Don't add dependencies without asking
- Don't over-engineer when simple works
- Don't change code style without a reason
- Don't give long explanations for short questions
- **Don't proceed if something seems off** — ask first

---

## Tech Stack

**Languages:** TypeScript, JavaScript  
**Framework:** Next.js 14 (React full-stack)  
**Database:** Supabase (PostgreSQL)  
**Auth:** Supabase Auth  
**Styling:** Tailwind CSS  
**Hosting:** Vercel  
**Version Control:** Git/GitHub

---

## Coding Standards

### TypeScript/JavaScript
- 2-space indentation
- Descriptive variable and function names
- Use `async/await` for async operations
- Error handling: graceful failures with user-friendly messages
- Comments explain *why*, not *what*

### React/Next.js
- Functional components with hooks
- Page-based routing (app or pages directory)
- Server components where possible
- Client components only when needed

### Styling
- Tailwind CSS for all styling
- No CSS modules unless necessary
- Mobile-first responsive design

### Testing
- Manual testing in browser during development
- Test login flow, navigation, and data display
- Check console for errors

---

## Secrets & Credentials

- Never commit `.env`, `.env.local` to version control
- Use `.env.example` with placeholder values
- Store Supabase keys in environment variables
- Vercel: secrets stored in project settings (not in code)
- Demo login: `admin` / `admin` (hardcoded for initial access)

---

## Deployment & Operations

**Environments:** Development (local), Production (Vercel)  
**Deployment Process:** Push to GitHub → Vercel auto-deploys  
**Database:** Supabase (cloud)  
**Monitoring:** Vercel Analytics, Supabase Logs  
**Rollback Plan:** Revert git commit and push; Vercel auto-deploys

---

## Key Decisions & Rationale

- **Next.js:** Full-stack React with built-in routing, API routes, and Vercel integration
- **Supabase:** PostgreSQL + Auth integrated; perfect for small projects
- **Vercel:** Native Next.js hosting; zero-config deployment
- **Demo Login:** Hardcoded for now; can upgrade to real registration later
- **Tailwind CSS:** Rapid styling without custom CSS
