@AGENTS.md

# CLAUDE.md — Aditya Deshpande Portfolio

This file is the single source of truth for building this portfolio. You are working as an autonomous Claude Code agent on an **existing Next.js project** that already has **Framer Motion** and **Three.js** installed. Read this file fully before every task. When a decision is not covered here, choose the option that looks more polished while staying fast and accessible, then note the decision in `DECISIONS.md`.

---

## 0. Mission

**Build a stunning, award-worthy developer portfolio.** Aim for the level of craft seen on Awwwards / FWA "Site of the Day" portfolios.

Every section should have one moment that makes the viewer pause:
- a cinematic entrance
- a satisfying hover
- a 3D element that reacts to them

The site must still stay fast, accessible, and readable. The target is "stunning and classy", never "noisy". If a detail feels generic or template-like, push it further: refine the spacing, the easing, the typography, and the light.

---

## 1. Project Overview

A personal portfolio for **Aditya N. Deshpande**, a Full-stack Software Engineer (React · TypeScript · ASP.NET Core) with 4+ years of experience.

**Goal:** A stunning, cinematic, dark-themed portfolio built with Three.js and Framer Motion. It should impress recruiters and engineering managers within 5 seconds, while staying fast, accessible, and easy to update.

**Creative concept: "Engineered Warmth."** The site is near-black with warm amber highlights. The amber is taken from the studio lighting in Aditya's headshot. The UI uses monospace headings, rounded cards, pill buttons, and thin decorative arcs. The 3D elements are subtle, purposeful, and never block content.

**Design reference:** a dark mobile portfolio with:
- monospace headings
- `…/About me…`-style section labels
- pill CTA buttons paired with a circular arrow button
- social pills
- a bento skill grid
- a work timeline table
- large faint circle arcs in the background

---

## 2. Tech Stack

| Layer | Choice |
|---|---|
| Framework | Next.js (existing project, App Router) + TypeScript (strict) |
| Styling | Tailwind CSS (if not present, ask before adding), with design tokens defined as CSS variables in `app/globals.css` |
| 3D | `three` (**already installed**) plus `@react-three/fiber`, `@react-three/drei`, `@react-three/postprocessing` (add these if they are missing; they are pre-approved) |
| Motion | `framer-motion` (**already installed**) for ALL animation: entrances, scroll-linked effects (`useScroll`, `useTransform`, `useSpring`), layout animations, page transitions (`AnimatePresence`), and hover micro-interactions. Do NOT add GSAP. |
| Smooth scroll | `lenis` (pre-approved), driving Framer Motion's scroll values |
| Content | Typed TS files in `content/` + MDX for case studies (`@next/mdx` or `next-mdx-remote`) |
| Contact | Next.js Server Action + Resend (API key in `.env.local`, never committed) |
| Icons | `lucide-react` + simple inline SVGs for GitHub/LinkedIn |
| Deploy | Vercel |
| Quality | ESLint, Prettier, Playwright smoke test, Lighthouse ≥ 90 in all categories |

Package manager: use whatever the project already uses (detect it from the lockfile). Commands in this file are written as `<pm>`.

---

## 3. Design Tokens

Define these in `app/globals.css` as CSS variables and map them in the Tailwind config. Never hardcode hex values in components.

```css
:root {
  --bg: #0B0B0C;
  --bg-elevated: #141416;
  --bg-inverse: #EDEDED;      /* light card, like the "Front-end" card in the reference */
  --text: #EDEDED;
  --text-muted: #8A8A8F;
  --text-inverse: #0B0B0C;
  --accent: #E8A15C;          /* amber, from portrait lighting */
  --accent-soft: rgba(232, 161, 92, 0.15);
  --border: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.16);

  --radius-card: 28px;
  --radius-pill: 999px;

  --container: 1200px;
  --gutter: clamp(20px, 4vw, 48px);
  --section-gap: clamp(96px, 14vw, 180px);

  --ease-out: cubic-bezier(0.22, 1, 0.36, 1);
}
```

The site is dark-only by design. Set `color-scheme: dark`.

### Typography
- **Headings, labels, tags, nav:** `JetBrains Mono` (via `next/font/google`), weights 400 and 700.
- **Body:** `Inter`, weights 400 and 500.
- Type scale, using fluid `clamp()`:
  - Display (hero name): `clamp(44px, 8vw, 104px)`, mono, weight 700, tight tracking
  - H2 (section titles): `clamp(32px, 5vw, 56px)`, mono
  - H3 (card titles): 20–24px, Inter 500
  - Body: 16–18px, line-height 1.6, `--text-muted`, with key phrases in *italic* `--text` (as in the reference)
  - Label / tag: 12–13px mono

---

## 4. UI Kit (`components/ui/`)

Build these first. Each one needs typed props, keyboard focus styles, and hover/active states.

- **`PillButton`**: rounded-full, light background (`--bg-inverse`) with dark text, italic label, 44px height. A `variant="ghost"` option uses a transparent background with `--border-strong`.
- **`ArrowButton`**: a 44px circle with a `→` or `↗` icon. It sits next to a PillButton, and the arrow rotates or slides on hover.
- **`CtaGroup`**: a PillButton and an ArrowButton side by side, as in the reference.
- **`SocialPill`**: a small outlined pill with an icon and a label (GitHub, LinkedIn, Email, Resume).
- **`Card`**: `--bg-elevated`, `--radius-card`, 1px `--border`, 24–32px padding. Variants: `default | inverse | outline`.
- **`Tag`**: a small mono outlined pill for tech stack items.
- **`SectionLabel`**: renders `…/About me…` in mono, 13px. The `/` and dots are `--text-muted` and the word is `--text`.
- **`Arc`**: a decorative SVG circle outline in `--border`, absolutely positioned and `aria-hidden`, for the background arcs.
- **`Counter`**: an animated number that counts up when scrolled into view (respects reduced motion).
- **`Container`**: a max-width wrapper with the gutter applied.

---

## 5. Page Structure

`app/page.tsx` is a single scrolling page. The sections, in order:

### 5.1 Nav
- Left: the `aditya.dev` wordmark in mono.
- Right: the section links (About, Work, Projects, Contact) on desktop; a hamburger that opens a full-screen overlay on mobile.
- The nav hides on scroll down and shows on scroll up. Blurred background: `backdrop-filter: blur(12px)`.

### 5.2 Hero
- 3D Constellation canvas in the background (see §6.1).
- Name: **Aditya Deshpande**, set as display type on two offset lines, as in the reference.
- Role: `Full-stack Engineer — React · .NET`
- Tagline (with the italic emphasis style): "I build *maintainable*, *high-performance* enterprise apps — from pixel-perfect React interfaces to *scalable* ASP.NET Core APIs."
- A `CtaGroup` with the label "View Work".
- Social pills: GitHub, LinkedIn, Email, Resume (PDF download).
- A scroll hint at the bottom.

### 5.3 About (`…/About me…`)
- Portrait with the shader treatment (see §6.2). Source image: `public/images/profile.jpg`.
- Story paragraph (Aditya will refine the wording):
  > Hello! I'm Aditya, a *full-stack engineer* with *4+ years* building enterprise React and .NET applications. I started as a mechanical engineer, spent a year in tech recruiting, and then moved into software. That path taught me to think in *systems* and to understand what teams actually need.
- Stat counters, in a row of 4 cards:
  - 4+ years
  - 25% faster page loads
  - 40% faster data fetching
  - 30% less tech debt

### 5.4 Experience (`…/Work…`)
- A timeline table styled like the reference. Each row shows:
  - left column: years and duration in muted text
  - right column: company, plus role | stack in mono
- The current role row is highlighted with an inverse (light) background, as in the reference.
- Clicking a row expands its highlight bullets, with an accessible accordion (`button` + `aria-expanded`).
- Footer text: "Work experience — *4+ years*".

### 5.5 Skills (`…/Stack…`)
- A bento grid: 2 columns on mobile, 3–4 columns on desktop, with mixed card sizes.
- The Frontend card uses the inverse (light) variant as the hero card.
- Each card shows its title plus a slash-separated mono list (`React / TypeScript / Next.js /`), as in the reference.
- A small caption card reads: "Some of my *favorite* technologies, topics, or tools that I worked with".
- Optional background: the wireframe icosahedron (§6.3).

### 5.6 Projects (`…/Projects…`)
- 3–4 project blocks. Each block has:
  - an image cluster with rounded, overlapping images and an ArrowButton overlay
  - the title
  - Tag pills
  - a 2–3 line description with italic emphasis
  - a GitHub icon and a ↗ link to `/projects/[slug]`
- Case study detail pages live at `app/projects/[slug]/page.tsx`, rendered from MDX in `content/projects/`.
- Case study template: **Overview → Problem → Approach → Architecture (diagram) → Tech → Results → What I learned**.

### 5.7 Recognition (`…/Recognition…`)
- Certification cards with "Verify ↗" links.
- A list of awards.

### 5.8 Writing (`…/Articles…`) — PHASE 2, OPTIONAL
- Article cards with a "Read more" pill, plus pagination, as in the reference.

### 5.9 Contact / Footer (`…/Contacts…`)
- Big heading: "Let's build something."
- A contact form (name, email, message) that submits through a Server Action to Resend. It needs a honeypot field, validation (zod), and success/error states.
- A particle "AD" monogram (§6.4).
- Footer nav links, social pills, and the lines "Designed & built by Aditya / Powered by Next.js & Three.js".

---

## 6. 3D Specifications (`components/three/`)

**Global rules:**
- Every Canvas is loaded with `next/dynamic` and `{ ssr: false }`, wrapped in `Suspense` with a static fallback.
- Set `dpr={[1, 1.5]}`. Use `frameloop="demand"`, or pause via `IntersectionObserver` when the canvas is off-screen.
- Under `prefers-reduced-motion: reduce`, or on devices with `navigator.hardwareConcurrency <= 4` or no WebGL: render a static CSS radial gradient fallback (amber glow on black) instead of the canvas.
- Canvases are `aria-hidden` and `pointer-events: none`, except where interaction is intended.
- No 3D asset over 500 KB. Prefer procedural geometry.
- Only one Canvas mounts on mobile. Disable the secondary scenes there.

### 6.1 Hero — "Monorepo Constellation"
- Roughly 80–120 nodes (instanced small spheres or points) in a loose 3D cloud, connected by thin lines between near neighbours. This evokes an Nx dependency graph.
- Nodes are amber at varying opacity, and lines are white at 6–10% opacity. Add a subtle bloom (postprocessing, low intensity).
- Slow idle drift, plus parallax: the camera leans slightly toward the cursor, lerped.
- On scroll (Framer Motion `useScroll` on the hero section → `useSpring`-smoothed `progress` → fed to a shader uniform or `useFrame`): the nodes ease into 3 labelled clusters — "Frontend", "Backend", "Cloud" — and then fade out as the About section enters.
- Mobile: fewer nodes (~40), no bloom, and gyroscope parallax optional.

### 6.2 Portrait Shader
- A plane mesh textured with `profile.jpg`.
- Custom `shaderMaterial`:
  - a duotone that maps luminance between `#141416` and `#E8A15C`, blended about 60% with the original colours
  - a hover that triggers a gentle ripple/displacement from the cursor UV position and shifts towards full colour
- The corners are rounded via an SDF mask in the shader, or by a CSS mask on the container.
- Fallback: a plain `next/image` with a CSS amber gradient overlay.

### 6.3 Skills Icosahedron (optional)
- A slowly rotating wireframe icosahedron (detail 1) behind the grid, at low opacity.
- Its colour lerps towards the accent while a skill card is hovered (shared state via a small zustand store or React context).

### 6.4 Footer "AD" Particles
- About 1,500 points sampled from the "AD" text geometry (drei `Text3D`, or points sampled from a canvas-rendered text).
- When the footer scrolls into view, the particles move from a scattered state to form the letters. The cursor gently repels nearby particles.

---

## 7. Motion Guidelines

All motion uses **Framer Motion**. Put shared variants and easings in `lib/motion.ts` so the whole site feels like one choreography.

**Base settings (`lib/motion.ts`):**
- Easing: `[0.22, 1, 0.36, 1]`
- Default duration: 0.8s
- Stagger: 0.06s
- Springs: `{ stiffness: 120, damping: 20, mass: 0.6 }` for UI, and a softer spring for scroll smoothing

**Signature moments (these are what make the site stunning):**
1. **Preloader → Hero reveal.** A short (≤ 1.2s) intro:
   - the `AD` monogram draws in as an SVG `pathLength` animation, then wipes away with a clip-path
   - the hero name reveals line by line from behind a mask
   - the 3D constellation fades up behind it
   - the preloader is skipped on repeat visits, stored in `sessionStorage`
2. **Masked text reveals.** A `RevealText` component splits headings into words or lines, each inside an `overflow-hidden` span, animating `y: "100%" → 0` with `whileInView` and `once: true`.
3. **Scroll-linked depth:**
   - `useScroll` + `useTransform` for subtle parallax on images and arcs (±40px)
   - the section label counter animates as the section enters
   - the Experience rows slide in from alternating sides
4. **Magnetic buttons.** PillButton and ArrowButton follow the cursor slightly (max 8px) using `useMotionValue` + `useSpring`, then snap back on leave.
5. **Cursor glow + custom cursor (desktop only):**
   - a 300px radial `--accent-soft` glow follows the pointer with a spring
   - a small ring cursor grows over interactive elements
6. **Layout animations:**
   - the Experience accordion and Projects filters use `layout` and `AnimatePresence` for smooth height and position changes
   - a shared `layoutId` morphs a project card image into the case study hero on navigation
7. **Page transitions.** Route changes use a brief amber-edged curtain wipe (`template.tsx` + `AnimatePresence`).
8. **Hover micro-interactions:**
   - cards lift 4px and their border brightens
   - arrows rotate or slide
   - tags glow faintly in amber

**Rules:**
- Animate only `transform`, `opacity`, `clip-path`, and `filter`. Never animate layout properties like `width` or `top` directly; use `layout` instead.
- Use `LazyMotion` + `domAnimation` with the `m` components to keep the bundle small.
- Wrap the app in `MotionConfig reducedMotion="user"`. Under reduced motion, disable the preloader, parallax, magnetic effects, smooth scroll, and 3D animation, and show content immediately.

---

## 8. Folder Structure

```
app/
  layout.tsx            # fonts, metadata, Lenis provider, cursor glow
  page.tsx              # composes sections
  globals.css           # tokens + base styles
  projects/[slug]/page.tsx
  actions/contact.ts    # server action
  sitemap.ts
  robots.ts
  opengraph-image.tsx
components/
  ui/                   # PillButton, ArrowButton, Card, Tag, SectionLabel, Arc, Counter...
  sections/             # Hero, About, Experience, Skills, Projects, Recognition, Contact, Nav, Footer
  three/                # ConstellationScene, PortraitShader, IcosahedronBg, ParticleMonogram, CanvasGate
  motion/               # RevealText, Magnetic, Parallax, Preloader, CursorGlow, PageTransition
  providers/            # SmoothScrollProvider, MotionProvider (LazyMotion + MotionConfig)
content/
  profile.ts
  experience.ts
  skills.ts
  projects.ts
  recognition.ts
  projects/*.mdx
lib/
  motion.ts             # shared easings, springs, variants
  utils.ts
  useReducedMotion.ts
  useDeviceTier.ts
public/
  images/profile.jpg
  resume/Aditya_Deshpande_Resume.pdf
```

All content lives in `content/`. Components must never hardcode resume text.

---

## 9. Content Data (seed `content/` from this)

### profile.ts
- name: Aditya N. Deshpande
- role: Full-stack Engineer — React · .NET
- email: adityadeshpande1@outlook.com
- phone: +91 9405459309 (DO NOT display publicly on the site; keep it only in the downloadable resume)
- location: Pune, India
- links: github `TODO`, linkedin `TODO`, portfolio `TODO` (Aditya fills these in)

### experience.ts
1. **Software Engineer — VConstruct, Pune** · Aug 2025 – Present
   - Stack: React · TypeScript · ASP.NET Core · C# · SQL · Snowflake
   - Enterprise web apps for construction management and business-critical operational workflows.
   - End-to-end features: responsive React UIs, ASP.NET Core REST APIs, Snowflake integration.
   - Played a key role in migrating frontend apps to an Nx monorepo, improving code sharing, build consistency, and maintainability.
   - Built reusable Material UI components and shared libraries that set consistent UI standards across teams.
   - Performance work: React rendering optimization, state management, API and query improvements.
   - Participated in solution design, sprint planning, backlog refinement, and estimation.
   - Code reviews, Git workflows, Azure DevOps CI/CD, automated testing, SonarQube.
2. **System Engineer — Infosys, Pune** · Feb 2022 – Jul 2025
   - Stack: React · React Native · TypeScript · Redux Toolkit · React Query
   - Web and mobile solutions across Fuel Data, E-Commerce, and Rewards platforms.
   - Reduced page load times by **25%** through rendering, component architecture, and state optimizations.
   - Reduced data fetch times by **40%** with React Query and Axios caching and sync.
   - Scalable state management with Redux Toolkit and Redux Thunk.
   - Reduced technical debt by **30%** by modernizing legacy code to SonarQube standards.
3. **Talent Specialist — Collabera, Vadodara** · May 2021 – Jan 2022
   - US IT recruiter; managed the full recruitment lifecycle for US clients.

### skills.ts
- Frontend: React.js / React Native / Next.js / TypeScript / JavaScript (ES6+) / HTML5 / CSS3 / SASS / Styled Components / Tailwind CSS / Bootstrap / Material UI
- State & Data: Redux Toolkit / Redux Thunk / React Query / Axios
- Backend: ASP.NET Core Web API / C# / Node.js / Express.js / REST APIs
- Database: SQL Server / Snowflake / MongoDB
- Cloud & DevOps: Microsoft Azure / Azure DevOps / CI/CD / Nx
- Testing & Quality: Jest / React Testing Library / SonarQube
- AI: OpenAI API / OpenAI SDK / GitHub Copilot
- Tools: Git / GitHub / Agile / Scrum

### recognition.ts
- Certifications:
  - Microsoft Certified: Azure Administrator Associate — Credential ID 26B080808A23A53C — verify URL `TODO`
  - Microsoft Certified: Azure Fundamentals — Credential ID 48516A86BE774AFF — verify URL `TODO`
- Awards:
  - Infosys Techzooka Hackathon — Runner-Up
  - Infosys GitHub Codethon — Top Finalist
  - Infosys Tech-Cohere Chapter — RnR award for implementing and demonstrating GitHub Copilot across multiple projects
  - Project recognition for outstanding contributions

### projects.ts (placeholders; Aditya will supply the details)
1. `nx-monorepo-migration`: Nx Monorepo Migration (enterprise, anonymized). Tags: Nx, React, TypeScript, Azure DevOps.
2. `ui-component-library`: Reusable Material UI component library. Tags: React, MUI, TypeScript, Storybook.
3. `techzooka-hackathon`: Hackathon project (runner-up). Tags: `TODO`.
4. `ai-side-project`: an OpenAI-powered app. Tags: Next.js, OpenAI SDK, ASP.NET Core.

Client work must be anonymized: no client names, no real screenshots of proprietary UI. Use recreated mockups and architecture diagrams instead.

### Education (show in About or the footer, small)
- B.E. Mechanical Engineering — Amravati University, 2019

---

## 10. Non-functional Requirements

- **Performance:** Lighthouse ≥ 90 on mobile. LCP < 2.5s, CLS < 0.1. The hero text must render before the 3D loads. Use `next/image` everywhere.
- **Accessibility:**
  - semantic landmarks
  - a skip link
  - visible focus rings (amber outline)
  - text contrast ≥ 4.5:1 (don't place muted text on elevated cards below the contrast ratio)
  - everything works with the keyboard alone
  - all 3D is decorative and `aria-hidden`
- **SEO:**
  - metadata API with title "Aditya Deshpande — Full-stack Engineer (React · .NET)"
  - a description
  - a dynamic OG image
  - sitemap and robots
  - JSON-LD `Person` schema
- **Responsive:** design mobile-first. Breakpoints: 640 / 1024 / 1440. Test at 375px width.
- **Security:** keep secrets in env vars, rate-limit the contact action, include a honeypot field.

---

## 11. Build Phases

Complete one phase per session. At the end of each phase, run `<pm> lint && <pm> build` and fix all errors.

1. **Audit & foundation:**
   - Inspect the existing project: `package.json`, the lockfile, the `app/` structure, the Tailwind setup, and the installed versions of `three` and `framer-motion`.
   - Report what exists before changing anything.
   - Add the missing pre-approved packages (R3F, drei, postprocessing, lenis, zod).
   - Set up fonts, tokens, `lib/motion.ts`, MotionProvider (LazyMotion + MotionConfig), the folder structure, and the content files seeded from §9.
   - Don't delete existing files without asking.
2. **UI Kit:** everything in §4 plus the motion primitives (RevealText, Magnetic, Parallax), and a hidden `/dev/ui` page that shows every component.
3. **Static sections:** Nav, Hero (text only), About (plain image), Experience, Skills, Projects, Recognition, Contact, Footer. Fully responsive, no animation yet.
4. **3D:** CanvasGate (tier and reduced-motion detection + fallback), then §6.1 Constellation, §6.2 Portrait Shader, §6.4 Particles, and §6.3 last if time allows.
5. **Motion:** all the signature moments in §7, in this order:
   - Lenis
   - masked text reveals
   - scroll-linked depth
   - magnetic buttons
   - cursor
   - preloader
   - layout animations
   - page transitions
   - counters
6. **Case studies:** MDX pipeline, `/projects/[slug]` template, and 1 complete sample case study.
7. **Contact backend:** Server Action + Resend + zod + honeypot + rate limit.
8. **Polish:** SEO, OG image, JSON-LD, an a11y pass, a Lighthouse pass, and a Playwright smoke test.
9. **Deploy:** Vercel config and a README with setup instructions.

---

## 12. Coding Conventions

- Use Server Components by default. Add `"use client"` only when a component needs state, effects, browser APIs, or R3F.
- Keep components small and typed. Props interfaces are exported and named `XxxProps`.
- Use Tailwind for layout and spacing. Put complex effects in CSS modules or `globals.css` layers.
- No `any`. No unused dependencies. Before adding any library not listed in §2, ask first.
- Use `framer-motion` imports only (`import { m, useScroll } from "framer-motion"`). Don't mix in other animation libraries.
- R3F components must be client components and must be dynamically imported from sections.

## 12a. Agent Working Rules (Claude Code)

- **Start every session** by re-reading this file and `DECISIONS.md`, then run `git status` to see where things stand.
- **Plan before coding.** State a short checklist for the phase, then execute it.
- **Work in small, verifiable steps.** After each meaningful change, run the build or typecheck. Don't pile up errors.
- **Self-review visually.** If a browser or screenshot tool is available, check each section at 375px, 1024px, and 1440px, and refine the spacing, alignment, and motion timing until it looks polished.
- **Commit at the end of each phase** with a conventional message. Summarize what was done and what's next in `PROGRESS.md`.
- **Never** reinstall or downgrade `three` or `framer-motion`, change the Next.js version, or delete user files without asking.
- **When blocked** (missing content, `TODO` links, ambiguous design), use a tasteful placeholder, log it in `PROGRESS.md` under "Needs Aditya", and keep going.
- Name files in PascalCase for components and camelCase for utilities.
- Make small commits with conventional messages (`feat:`, `fix:`, `style:`, `perf:`).

## 13. Don'ts

- Don't let 3D delay first paint or block scrolling.
- Don't use more than one accent colour. Amber is the only accent.
- Don't display the phone number on the site.
- Don't use stock images or copyrighted logos beyond standard social and tech icons.
- Don't add gimmicky effects (glitch text, heavy chromatic aberration, auto-playing audio). Classy over flashy.
