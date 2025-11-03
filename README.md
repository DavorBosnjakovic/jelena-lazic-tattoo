# jela-website/README.md

# Jelena Lazić Tattoo Website

Professional portfolio and business website for tattoo artist Jelena Lazić, built with Next.js 14, TypeScript, Tailwind CSS, and Supabase.

## 🎨 Project Overview

An elegant, minimalist website showcasing custom tattoo designs with a focus on artistic excellence and user experience. The site features a sophisticated design system with light/dark mode, portfolio gallery, contact form, and newsletter integration.

## 🚀 Tech Stack

- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Email:** Resend
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **Hosting:** Vercel (recommended)

## 📁 Project Structure
```
jela-website/
├── public/
│   ├── fonts/          # Custom fonts (Agency, Freedoomed, Montserrat)
│   └── images/         # Static images (logo, favicon)
├── src/
│   ├── app/            # Next.js pages and API routes
│   ├── components/     # React components
│   ├── lib/            # Utilities and configurations
│   ├── types/          # TypeScript type definitions
│   └── styles/         # Global styles
├── .env.local          # Environment variables (not in git)
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 🛠️ Setup Instructions

### 1. Prerequisites

- Node.js 18+ and npm 9+
- Supabase account
- Resend account (for emails)
- Git

### 2. Clone and Install
```bash
# Clone repository
git clone [repository-url]
cd jela-website

# Install dependencies
npm install
```

### 3. Environment Variables

Create `.env.local` file in the root directory:
```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Resend
RESEND_API_KEY=your-resend-api-key

# Google Analytics (optional)
NEXT_PUBLIC_GA_MEASUREMENT_ID=G-XXXXXXXXXX
```

### 4. Supabase Setup

#### Create Storage Buckets

Create these public storage buckets in Supabase:

- `hero-images` - Homepage hero section images (6 images)
- `portfolio-images` - Portfolio gallery images (25 images)
- `about-images` - Artist photos
- `logo-images` - Logo files

#### Create Database Tables

Run this SQL in Supabase SQL Editor:
```sql
-- Newsletter Subscribers Table
CREATE TABLE newsletter_subscribers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  email TEXT UNIQUE NOT NULL,
  subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  is_active BOOLEAN DEFAULT TRUE
);

-- Contact Submissions Table
CREATE TABLE contact_submissions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  message TEXT NOT NULL,
  submitted_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied'))
);

-- Portfolio Images Table (for Phase 2 CMS)
CREATE TABLE portfolio_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  title TEXT,
  description TEXT,
  category TEXT,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero Images Table (for Phase 2 CMS)
CREATE TABLE hero_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  image_url TEXT NOT NULL,
  position INTEGER NOT NULL CHECK (position BETWEEN 1 AND 6),
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE newsletter_subscribers ENABLE ROW LEVEL SECURITY;
ALTER TABLE contact_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE portfolio_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;

-- RLS Policies (allow service role to do everything, public can read)
CREATE POLICY "Allow public read access" ON portfolio_images FOR SELECT USING (true);
CREATE POLICY "Allow public read access" ON hero_images FOR SELECT USING (true);
```

### 5. Upload Images

Upload your images to Supabase Storage:

**Hero Images:** 6 images named `hero1.png` through `hero6.png` (190x780px each)

**Portfolio Images:** 25 images named `portfolio-001.jpg` through `portfolio-025.jpg`

### 6. Resend Setup

1. Sign up at [resend.com](https://resend.com)
2. Verify your domain (or use testing domain)
3. Create API key
4. Update `src/lib/resend.ts` with your verified domain in `EMAIL_CONFIG.from`

### 7. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📝 Available Scripts
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run lint         # Run ESLint
npm run type-check   # TypeScript type checking
```

## 🚢 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy

### Manual Deployment
```bash
npm run build
npm run start
```

## 🎨 Design System

- **Colors:** Red accent (#8B0000), elegant light/dark modes
- **Fonts:** Agency (nav), FreedoomedDemo (headings), Montserrat (body)
- **Spacing:** 8px base unit system
- **Breakpoints:** Mobile (<768px), Tablet (768-1199px), Desktop (1200px+)

## 📧 Contact Form

Contact submissions are:
1. Stored in Supabase `contact_submissions` table
2. Emailed to artist via Resend
3. Validated with React Hook Form + Zod

## 📬 Newsletter

Newsletter signups:
1. Stored in Supabase `newsletter_subscribers` table
2. Send welcome email via Resend
3. No automated campaigns (occasional manual sends only)

## 🔐 Security

- Environment variables secured
- Supabase Row Level Security enabled
- Form validation and sanitization
- HTTPS only in production

## 🌐 SEO

- Metadata configured on all pages
- Semantic HTML structure
- Image optimization via next/image
- Sitemap generation (add in Phase 3)

## 🎯 Future Enhancements (Phase 2+)

- [ ] Admin CMS panel
- [ ] Online store with Stripe
- [ ] Blog/content section
- [ ] Advanced portfolio filters
- [ ] Booking/appointment system
- [ ] Testimonials section

## 📄 License

© 2025 Jelena Lazić. All rights reserved.

## 👤 Contact

- **Website:** jelenalazictattoo.com
- **Email:** jelenalazictattoo@gmail.com
- **Instagram:** [@jelena_lazic_tattoo](https://www.instagram.com/jelena_lazic_tattoo)
- **Location:** Belgrade, Serbia

---

**Built with ❤️ for elegant tattoo artistry**