# Decisions

Choices not covered by `CLAUDE.md`, and places where the implementation deliberately differs from it.

| # | Decision | Why |
|---|---|---|
| 1 | Code lives under `src/` (`src/app`, `src/components`, `src/content`, `src/lib`), not the repo root shown in CLAUDE.md §8. | The project was scaffolded with `--src-dir`; the `@/*` alias points at `src/`. Folder names inside match §8 exactly. |
| 2 | Tailwind v4 is configured in CSS (`@theme inline` in `globals.css`), with no `tailwind.config`. | Tailwind v4 has no JS config by default. Tokens are CSS variables, mapped to utilities like `bg-bg-elevated`, `text-muted`, `border-line`, `rounded-card`, `ease-out-expo`. |
| 3 | `LazyMotion` loads `domMax` rather than `domAnimation`. | `layout` / `layoutId` animations (Experience accordion, project filters, project → case-study morph) need the layout features in `domMax`. |
| 4 | `react-hooks/immutability` is turned off for `src/components/three/**` only. | R3F mutates uniforms and buffers every frame inside `useFrame` by design. No React state is mutated. |
| 5 | Procedural scenes use a seeded PRNG (`lib/random.ts`). | Keeps render functions pure (lint rule), and the constellation looks the same on every visit. |
| 6 | The hero is a 210svh section with a sticky 100svh stage. | Nodes gather into Frontend/Backend/Cloud clusters and fade out while the hero is pinned, so the effect is actually seen instead of scrolling off screen. |
| 7 | The page-transition curtain plays on route *entry* (via `template.tsx`) and is skipped on first load. | App Router templates don't keep the old page mounted for exit animations. The preloader owns the first-load entrance. |
| 8 | Preloader skip on repeat visits happens in an inline `<head>` script (sets `html[data-intro=seen]`). | Hides the overlay before first paint, so there's no flash (per the Next 16 "preventing flash before hydration" guide). |
| 9 | The portrait renders a plain `next/image` underneath the shader canvas. | Keeps LCP and no-JS rendering good, and doubles as the §6.2 fallback. The shader fades in over it. |
| 10 | Project visuals are code-drawn mockups (`ProjectVisual.tsx`), not images. | CLAUDE.md §9 forbids real screenshots of client UI. The mockups also weigh nothing. |
| 11 | Project filters (All / Architecture / UI / Full-stack / AI) use a `focus` field in `content/projects.ts`. | §7 calls for layout-animated project filters. Tags alone were too granular to filter on. |
| 12 | The contact rate limiter is in-memory, per server instance (3 messages / 10 min / IP). | Needs no new dependency. Swap in a shared store (e.g. Upstash) if abuse appears. |
| 13 | Section headings ("Where I've shipped.", etc.) are written in components. | They are UI copy, not resume content. All resume data lives in `src/content/`. |
| 14 | The ArrowButton next to a pill (and on project cards) is `aria-hidden` and not focusable. | It points to the same URL as its sibling link, so keyboard and screen-reader users get one stop, not two. |
| 15 | The Microsoft certification icon is lucide `BadgeCheck`, not the Microsoft logo. | §13: no copyrighted logos beyond standard social/tech icons. |
