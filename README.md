# Portfolio — Mihir Sanghvi

Personal portfolio site: a single-page React app with scroll-driven animation,
a light/dark theme, and a pre-rendered HTML shell for SEO and fast first paint.

## Stack

| Area      | Choice                                  |
| --------- | --------------------------------------- |
| Framework | React 18 + TypeScript                   |
| Build     | Vite 6 (client build + SSR build)       |
| Styling   | Tailwind CSS 3, plus `src/index.css`    |
| Motion    | Framer Motion (in-view/parallax), GSAP ScrollTrigger (marquee, pixel reveal) |
| Analytics | `@vercel/analytics`                     |

## Getting started

```bash
npm install
npm run dev        # http://localhost:5173
```

## Scripts

- `npm run dev` — Vite dev server with HMR.
- `npm run build` — client build, then an SSR build of `src/entry-server.tsx`,
  then `prerender.mjs` injects the rendered markup into `dist/index.html`.
- `npm run typecheck` — `tsc --noEmit`; run this before committing.
- `npm run preview` — serve the production build locally.

## Layout

```
index.html            HTML shell: meta/OG tags, JSON-LD, font + CDN hints
prerender.mjs         Post-build step that inlines the SSR output
src/App.tsx           All sections (nav, hero, tech, about, journey, projects, footer)
src/index.css         Theme tokens, component styles, mobile overrides
src/entry-server.tsx  SSR entry used only at build time
public/               Resume PDF, project images (png + webp), sitemap, robots
```

## Content

Sections are driven by the data arrays at the top of each block in `src/App.tsx`
(`TECH_ROWS`, `JT_DATA`, project data). Adding an entry there is usually all a
content update needs — no layout changes required.
