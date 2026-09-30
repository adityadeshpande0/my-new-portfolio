# aditya.dev — portfolio

Personal portfolio of **Aditya N. Deshpande**, full-stack engineer (React · .NET). Built with Next.js 16 (App Router), Tailwind CSS v4, Framer Motion, Three.js / React Three Fiber and Lenis.

> Design and build rules live in [`CLAUDE.md`](./CLAUDE.md). Deviations are recorded in [`DECISIONS.md`](./DECISIONS.md), and status in [`PROGRESS.md`](./PROGRESS.md).

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in the values
npm run dev                  # http://localhost:3000
```

| Script | What it does |
|---|---|
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` / `npm start` | Production build / serve |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |
| `npm run format` | Prettier (with Tailwind class sorting) |
| `npm run test:e2e` | Playwright smoke tests (builds must exist: run `npm run build` first) |

For the first Playwright run, install a browser with `npx playwright install chromium`, or point `PW_CHROMIUM_PATH` at an existing Chromium.

## Environment variables

| Name | Purpose |
|---|---|
| `NEXT_PUBLIC_SITE_URL` | Public URL, used for canonical links, sitemap, OG image and JSON-LD |
| `RESEND_API_KEY` | Resend key for the contact form |
| `CONTACT_TO_EMAIL` | Inbox that receives contact messages |
| `CONTACT_FROM_EMAIL` | Verified Resend sender, e.g. `Portfolio <hello@your-domain.dev>` |

Without the Resend variables the site still works. The form shows a friendly "email me directly" message.

## Editing content

All resume content is typed data in `src/content/`:

- `profile.ts`: name, tagline, about text, stats, links, education
- `experience.ts`, `skills.ts`, `recognition.ts`, `projects.ts`
- `projects/<slug>.mdx`: case studies (Overview → Problem → Approach → Architecture → Tech → Results → What I learned)

Wrap words in `*asterisks*` in tagline, about and summary strings to render them as italic emphasis.

## Project layout

```
src/
  app/                 layout, page, template (page transition), projects/[slug], actions/contact.ts,
                       sitemap, robots, opengraph-image, dev/ui (hidden component showcase)
  components/
    ui/                PillButton, ArrowButton, CtaGroup, SocialPill, Card, Tag, SectionLabel, Arc, Counter…
    sections/          Nav, Hero, About, Experience, Skills, Projects, Recognition, Contact, Footer
    three/             CanvasGate, ConstellationScene, PortraitShader, ParticleMonogram, IcosahedronBg
    motion/            RevealText, Reveal, Magnetic, Parallax, Preloader, CursorGlow, PageTransition
    providers/         MotionProvider, SmoothScrollProvider
  content/             typed content + MDX case studies
  lib/                 motion tokens, hooks, utils
```

## Performance and accessibility notes

- 3D is gated: reduced motion, ≤4 CPU cores or no WebGL get a static amber glow. Mobile mounts only the hero canvas. Canvases stop rendering when off-screen.
- `MotionConfig reducedMotion="user"`, and Lenis, the preloader and the cursor effects are all disabled under reduced motion.
- Skip link, amber focus rings, semantic landmarks, and an accessible accordion. All canvases are `aria-hidden`.

## Deploy

Import the repo in Vercel (framework preset: Next.js), add the environment variables above, and deploy. No extra configuration is needed.
