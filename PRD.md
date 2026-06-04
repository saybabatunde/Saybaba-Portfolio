# Product Requirements — Saybaba Portfolio

---

## Vision

Create a professional, shareable portfolio website where visitors can login and browse AWS, Azure, Python projects, and other work experiences.

---

## Problem Statement

Need a centralized place to showcase technical projects and experience. LinkedIn links should direct to a polished portfolio that demonstrates skills across cloud platforms and programming languages.

---

## Scope

### In Scope
- Custom login page with demo credentials (admin/admin)
- Dashboard showing portfolio sections
- Project categories: AWS, Azure, Python, Apps, Other
- Project cards with descriptions and links
- Responsive design (mobile, tablet, desktop)
- Deployable to Vercel
- Shareable via LinkedIn

### Out of Scope
- Real user registration (future)
- Comments or feedback system (future)
- Blog or articles (future)
- Admin panel to edit projects (phase 2)

---

## Key Features

### Feature 1: Login Page
**Description:** Custom login page with "Welcome to Saybaba Portfolio" and demo credentials.  
**Acceptance Criteria:**
- [ ] Page displays "Welcome to Saybaba Portfolio"
- [ ] Instructions show "Use admin for username and password"
- [ ] Login with admin/admin works
- [ ] Session persists (user stays logged in)
- [ ] Clean, professional design

### Feature 2: Portfolio Dashboard
**Description:** After login, user sees dashboard with project sections.  
**Acceptance Criteria:**
- [ ] Dashboard displays AWS, Azure, Python, Apps sections
- [ ] Each section shows project cards
- [ ] Cards include project name, description, and links
- [ ] Responsive layout (works on mobile, tablet, desktop)

### Feature 3: Logout
**Description:** User can logout and return to login page.  
**Acceptance Criteria:**
- [ ] Logout button visible on dashboard
- [ ] Clicking logout clears session
- [ ] User redirected to login page

---

## Success Metrics

- Clean, professional appearance
- Login works reliably
- All projects display correctly
- Page loads fast (< 2 seconds)
- Works on all devices

---

## Timeline & Phases

**Phase 1 (MVP):** 3-4 days
- Login page with demo credentials
- Basic dashboard with project sections
- Deploy to Vercel

**Phase 2 (Polish):** 2-3 days
- Add real projects to each section
- Improve styling and design
- Test across browsers

**Phase 3 (Future):** TBD
- Admin panel to edit projects
- Real user registration
- Project detail pages

---

## Assumptions & Dependencies

**Assumptions:**
- Visitors have internet access
- Demo login (admin/admin) sufficient for initial sharing
- Supabase is reliable and available

**Dependencies:**
- Supabase account and project
- GitHub for version control
- Vercel for deployment

---

## Constraints

- Build MVP in 1 week
- No custom CSS frameworks; use Tailwind only
- Single demo user (admin) for now

---

## Out of Scope / Future Considerations

- Real user registration system
- Admin dashboard to manage projects
- Email notifications
- Analytics tracking
- Social login (Google, GitHub)
