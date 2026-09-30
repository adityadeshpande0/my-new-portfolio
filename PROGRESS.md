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

## Next

- Run Lighthouse on a real deployment (mobile) and tune any score below 90.
- Write the three remaining case studies (`src/content/projects/*.mdx`).
- Phase 2 (optional): Writing / Articles section (§5.8).
- Consider a shared-store rate limiter if the contact form gets abused.

## Needs Aditya

- **Domain**: `aditya.dev` is a placeholder. Set `NEXT_PUBLIC_SITE_URL` to the real URL (it drives canonical URLs, sitemap, OG and JSON-LD).
- **Resend**: create an API key, verify a sending domain, then set `RESEND_API_KEY`, `CONTACT_TO_EMAIL` and `CONTACT_FROM_EMAIL`. Until then the form tells visitors to email directly.
- **Projects**: real details for the UI library, the Techzooka hackathon (stack is a guess: React / TypeScript) and the AI side project (repo link currently points to the GitHub profile). Years are estimates.
- **Copy**: the About story and section headings are drafts. Edit them in `src/content/profile.ts` and the section components.
- **Resume PDF**: `public/resume/Aditya_Deshpande_Resume.pdf` includes the phone number. That's intended per CLAUDE.md, but it is public once deployed.
