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
| 16 | Layout scales on large screens by raising the root font size (≥1600px: 17px, ≥2200px: 19px) and a rem-based `--container`. | Tailwind v4 sizes and spacing are rem-based, so the whole UI grows proportionally instead of sitting small in a wide frame. |
| 17 | A `short` variant (`max-height: 560px`) unpins the hero on landscape phones. | A pinned 100svh stage can't fit the hero content in ~390px of height. There the section flows normally and the content is never faded early. |
| 18 | `html` and the Experience section use `overflow-x: clip`. | On mobile, elements waiting to slide in widened the layout viewport and caused sideways scroll. `e2e/responsive.spec.ts` guards this at phone, tablet and desktop sizes. |
| 19 | ArrowButton's incoming hover arrow is `opacity-0` until hover. | Chrome painted it outside the circle despite `overflow: hidden` / `clip-path`, inside the transformed magnetic wrapper. |
| 20 | Hero cluster layout is computed every frame from the visible width (side by side when landscape, stacked when portrait). The cursor lean is damped while clusters are formed, and labels are a DOM overlay projected from 3D instead of drei `<Html>`. | With a fixed spread, the "Frontend" cluster/label could fall off screen or under the nav depending on window shape and cursor position. drei `<Html>` labels were also intermittently missing. `e2e/constellation.spec.ts` guards this. |
| 21 | Articles are MDX files with an exported, zod-validated `metadata` object, discovered from the filesystem at build time (`src/lib/articles.ts`). | One file per post, nothing else to edit, and invalid metadata fails the build instead of shipping. No new dependencies (no front-matter parser). |
| 22 | Article headings get ids from their text in `articleComponents`, and the table of contents is parsed from the `##` lines in the source. | Linkable sections and a TOC without adding remark/rehype plugins. |
| 23 | Articles use their own long-form MDX components (real `h2`/`h3`, brighter body text), separate from the case-study components. | Case studies keep the `…/Label…` section style; articles need reading-optimised typography. |
| 24 | Every articles route spreads `rssAlternate` into `alternates`. | Next replaces rather than merges `alternates` per page, so the layout's RSS autodiscovery link would otherwise disappear on pages that set a canonical. |
| 25 | No syntax highlighting in code blocks yet. | It needs a new dependency (e.g. Shiki), which CLAUDE.md asks to approve first. |
