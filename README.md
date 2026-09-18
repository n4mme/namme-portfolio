# Emmanuel Nantes (NAMME) Portfolio

A high-performance, single-page developer portfolio website built for **Emmanuel Nantes (NAMME)**, a BSIT student specializing in Web & Mobile Development at Bulacan State University.

## 🚀 Key Features

- **IT-Themed Loading Screen**: Interactive cybernetic entrance overlay with orbiting & pulsing Lucide icons (`Terminal`, `Code2`, `Cpu`, `Database`) and a smooth Framer Motion exit.
- **Sticky Top Navigation**: Backdrop-blur navigation bar with active section tracking, smooth scrolling, a distinct "Hire Me" CTA, and a persistent dark grey / light theme toggle switch (`localStorage`).
- **Interactive Swinging ID Badge with Lanyard**:
  - Fabric lanyard ribbon with repeating branded text: `NAMME • NAMME • NAMME`.
  - Chrome metallic swivel clip connector.
  - Realistic credential card with BSU details, developer photo placeholder, barcode, and RFID chip.
  - Framer Motion pendulum drag physics anchored at the top clip.
- **Letter-Rearranging Anagram**: Smoothly morphs between `"I'M NAMME"` and `"I'M EMMAN"` using individual character layout spring physics.
- **Typewriter Subtitle**: Fixed prefix `"I'm a "` followed by rotating roles (`Full Stack Developer`, `Web Developer`, `Mobile App Developer`, `AI-Assisted Software Developer`) and blinking cursor.
- **Full Navigation Sections**: `#home`, `#about`, `#projects`, `#skills`, `#education`, and `#contact`.
- **Production SEO & Vercel Ready**: OpenGraph cards, Twitter cards, JSON-LD structured data (`Person`, `WebSite`), robots.txt, sitemap.xml, and `vercel.json` SPA routing.

## 🛠️ Tech Stack

- **Core**: React 18, Vite
- **Styling**: Tailwind CSS (class strategy dark mode, deep dark grey `#121212` palette)
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Effects**: Canvas Confetti

---

## 💻 Local Development

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Build for Production
```bash
npm run build
```

---

## 🌐 Deploying to Vercel

1. **Push to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Emmanuel Nantes (NAMME) portfolio"
   git branch -M main
   git remote add origin https://github.com/your-username/namme-portfolio.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and click **"Add New Project"**.
   - Import your GitHub repository.
   - Vercel will automatically detect **Vite** as the framework preset.
   - Click **Deploy**. The included `vercel.json` ensures all client-side routes rewrite to `/index.html`.
