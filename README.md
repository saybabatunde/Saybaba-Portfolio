# Saybaba Portfolio

A professional portfolio website showcasing AWS, Azure, Python projects and more. Built with Next.js, Tailwind CSS, and designed for deployment on Vercel.

## Features

✅ **Custom Login Page** - "Welcome to Saybaba Portfolio" with demo credentials  
✅ **Portfolio Dashboard** - Organized project sections (AWS, Azure, Python, Apps)  
✅ **Responsive Design** - Works on desktop, tablet, and mobile  
✅ **Fast & Lightweight** - Next.js with Tailwind CSS  
✅ **Easy Deployment** - Deploy to Vercel with one click  
✅ **LinkedIn Shareable** - Perfect for sharing your portfolio on social media  

## Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn

### Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Run development server:**
   ```bash
   npm run dev
   ```

3. **Open in browser:**
   - Visit `http://localhost:3000`
   - Login with: `username: admin` / `password: admin`

### Demo Credentials

```
Username: admin
Password: admin
```

## Deployment

### Deploy to Vercel

1. Push to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/saybaba-portfolio.git
   git push -u origin main
   ```

2. Go to [Vercel](https://vercel.com)
3. Click "New Project"
4. Import your GitHub repo
5. Deploy!

### Environment Variables

No environment variables needed for demo mode. If you want to add Supabase:

```
NEXT_PUBLIC_SUPABASE_URL=your-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-key
```

## Project Structure

```
Saybaba-Portfolio/
├── app/
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Login page
│   ├── globals.css          # Global styles
│   └── dashboard/
│       └── page.tsx         # Portfolio dashboard
├── components/
│   ├── LoginForm.tsx        # Login form component
│   └── ProjectCard.tsx      # Project card component
├── public/                  # Static assets
├── tailwind.config.ts       # Tailwind config
└── package.json
```

## Customization

### Change Login Message

Edit `app/page.tsx` and modify the welcome text:

```tsx
<h1 className="text-5xl font-bold text-white mb-4">
  Welcome to YOUR NAME Portfolio
</h1>
```

### Add Your Projects

Edit `app/dashboard/page.tsx` and add your projects to the `projects` object:

```js
const projects = {
  AWS: [
    {
      id: 1,
      title: 'Your Project Title',
      description: 'Project description',
      link: 'https://github.com/...',
    },
  ],
  // Add more projects...
}
```

### Change Colors

Edit `tailwind.config.ts` to customize colors, or modify CSS classes directly.

## Technologies Used

- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Vercel** - Deployment

## Future Enhancements

- Real user registration with Supabase Auth
- Admin panel to manage projects
- Project detail pages
- Email contact form
- Dark/Light theme toggle
- Analytics tracking

## License

MIT - Feel free to use and modify for your portfolio!

## Support

For issues or questions, check the SETUP.md file or contact me on LinkedIn.
