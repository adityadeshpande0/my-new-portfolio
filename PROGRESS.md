# Progress

## Done (session 1)

All build phases from `CLAUDE.md` §11 are in place, to a first-pass level:

1. **Foundation**: fonts (JetBrains Mono + Inter), tokens, `lib/motion.ts`, MotionProvider (LazyMotion + MotionConfig `reducedMotion="user"`), Lenis provider, content seeded from the resume.
2. **UI kit**: PillButton, ArrowButton, CtaGroup, SocialPill, Card, Tag, SectionLabel, Arc, Counter, Container, Emphasis. Motion primitives: RevealText, Reveal, Magnetic, Parallax. Hidden showcase at `/dev/ui` (noindex, disallowed in robots).
3. **Sections**: Nav (hide on scroll down, full-screen mobile menu), Hero, About, Experience (accordion), Skills (bento), Projects (filters), Recognition, Contact, Footer.
4. **3D**: CanvasGate (reduced motion / ≤4 cores / no WebGL → CSS glow fallback; pauses off-screen; one canvas on mobile), Monorepo Constellation with bloom and scroll-driven clustering, Portrait duotone/ripple shader, "AD" particle monogram with cursor repel, skills icosahedron that warms on card hover.
5. **Motion**: preloader (skipped on repeat visits), masked text reveals, parallax, magnetic buttons, cursor glow + ring, layout animations, page-transition curtain, counters.
6. **Case studies**: `@next/mdx` pipeline, `/projects/[slug]` template, full Nx monorepo case study with an architecture diagram. The other three are skeleton MDX files.
7. **Contact backend**: Server Action + zod + honeypot + rate limit + Resend.
8. **Polish**: metadata, dynamic OG image, sitemap, robots, JSON-LD `Person`, skip link, focus rings, Playwright smoke tests (desktop + mobile).
9. **Deploy**: README setup instructions and `.env.example`. Vercel works with zero config.

## Done (session 2): responsive pass

- Checked at 320, 360, 375, 390, 768, 844×390 (landscape), 1024, 1280, 1920 and 2560 widths.
- Fixed: sideways scroll on phones, hero overflowing on landscape phones, cramped top of the hero on small phones, a stray arrow next to CTA buttons, the project filters wrapping on phones (now a swipeable row), cramped two-column projects on tablets (now one column), About stacking on tablets (now side by side from 768px), small UI on large monitors (now scales up), plus narrow-phone tweaks to skills, certificate cards, the contact email and the mobile menu.
- Added `e2e/responsive.spec.ts`: no horizontal scroll and the hero name fully on screen at 8 sizes, with real mobile emulation for phones and tablets.

## Done (session 3): articles

- `/articles` archive (paginated, 10 per page), `/articles/tags/<tag>` pages, `/articles/<slug>` with table of contents, author box, share links, prev/next and related articles.
- "…/Articles…" section on the home page (latest three) and an Articles link in the nav and footer.
- SEO: per-article metadata and canonical URLs, Open Graph `article` tags, generated OG images, `BlogPosting`, `BreadcrumbList` and `Blog` JSON-LD, sitemap entries, RSS feed with autodiscovery.
- Authoring: `_template.mdx` and a README guide. Drafts only show in `npm run dev`.
- Tests: `e2e/articles.spec.ts`.

## Next

- Run Lighthouse on a real deployment (mobile) and tune any score below 90.
- Write the three remaining case studies (`src/content/projects/*.mdx`).
- Phase 2 (optional): Writing / Articles section (§5.8).
- Consider a shared-store rate limiter if the contact form gets abused.

## Needs Aditya

- **First article**: `src/content/articles/building-a-cinematic-portfolio-with-nextjs-and-r3f.mdx` is a draft (`draft: true`) written in your voice. Edit it and set `draft: false` to publish, or delete it. Until an article is published, the home section and `/articles` show a "first article is on its way" message.
- **Code highlighting** in articles needs a new dependency (e.g. Shiki). Approve it if you want coloured code blocks.

- **Domain**: `aditya.dev` is a placeholder. Set `NEXT_PUBLIC_SITE_URL` to the real URL (it drives canonical URLs, sitemap, OG and JSON-LD).
- **Resend**: create an API key, verify a sending domain, then set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`. Until then the form tells visitors to email directly.
- **Projects**: real details for the UI library, the Techzooka hackathon (stack is a guess: React / TypeScript) and the AI side project (repo link currently points to the GitHub profile). Years are estimates.
- **Copy**: the About story and section headings are drafts. Edit them in `src/content/profile.ts` and the section components.
- **Resume PDF**: `public/resume/Aditya_Deshpande_Resume.pdf` includes the phone number. That's intended per CLAUDE.md, but it is public once deployed.
