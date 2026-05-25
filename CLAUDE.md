# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A single-file personal portfolio for Mihir Sanghvi — a full-stack developer and CS student. The entire application lives in **`index.html`** with no build toolchain.

## Running the Site

Open `index.html` directly in a browser. No server, no build step, no `npm install`.

For a local dev server (needed if you hit `file://` restrictions on fetch or CORS):
```
npx serve .
# or
python -m http.server
```

## Architecture

Everything is in one `<script type="text/babel">` block inside `index.html`. Babel transpiles JSX in-browser at load time via `@babel/standalone`. Dependencies are loaded from CDN:

- **React 18** (`react` + `react-dom` UMD builds)
- **Framer Motion 11** (`window.framerMotion` alias → `fm`)
- **Tailwind CSS** (CDN play script — no config file)
- **Google Fonts** — Kanit (300–900)

Framer Motion is accessed via `const M = fm.motion` and `useScrollHook` / `useTransformHook` aliases because the global name differs across CDN bundles.

## Component Map

| Component | Purpose |
|-----------|---------|
| `FadeIn` | Reusable `whileInView` entrance animation; wraps any `motion.*` element via the `as` prop |
| `Magnet` | Mouse-proximity magnetic pull effect; listens to `window.mousemove` |
| `AnimatedText` | Scroll-driven per-character opacity reveal using `useScroll` + `useTransform` |
| `NavBar` | Fixed header; blurs backdrop after 48 px scroll |
| `HeroSection` | Full-viewport hero with parallax on heading and bottom bar |
| `MarqueeSection` | Two counter-scrolling rows of GIF tiles driven by manual scroll offset |
| `AboutSection` | Decorative floating icons + `AnimatedText` bio |
| `ServicesSection` | White-background section listing five service items from the `SERVICES` array |
| `ProjectsSection` | Sticky-stacked `ProjectCard` components with scroll-driven scale compression |
| `ProjectCard` | Card with left info panel and right 2×2 image grid; `ProjectImage` handles broken/missing src gracefully |
| `Footer` | Giant "Let's talk" CTA + social links |

## Data — Edit These to Update Content

All content is defined as inline constants near the top of the `<script>` block:

- **`SERVICES`** — array of `{ n, name, desc }` objects for the Skills/Services section
- **`PROJECTS`** — array of `{ n, tag, name, blurb, href, img1, img2, img3 }` for project cards
- **`MARQUEE_URLS`** — list of GIF URLs for the marquee strip
- Contact email is hardcoded in `ContactButton` and the `Footer` (`sanghvimihir96@gmail.com`)

## Design Tokens

| Token | Value |
|-------|-------|
| Background | `#0C0C0C` |
| Surface (cards) | `#0D0D14` |
| Text | `#D7E2EA` |
| Services bg | `#FFFFFF` (light section) |
| Gradient text | `.hero-heading` CSS class (linear-gradient `#646973 → #BBCCD7`, clipped) |
| Contact button | `.contact-btn` CSS class (purple-pink gradient with inset box-shadow) |
| Font | Kanit, sans-serif |

## Scroll-Margin Fix

All `[id]` elements get `scroll-margin-top: 80px` in global CSS to clear the fixed nav when anchor-jumping.

## Key Constraints

- **No module imports** — everything must be globally available or inlined; adding npm packages requires switching to a bundler.
- **Babel transpiles at runtime** — syntax errors in the JSX block show as runtime errors in the browser console, not build errors.
- **`useTransform` inside `.map()`** — `AnimatedText` calls `useTransformHook` inside a map, which is technically a rules-of-hooks violation but works here because the array length (`chars`) is stable for a given `text` prop. Don't change `text` dynamically.
