# Rebecca Lai: Portfolio

Source for my portfolio site: **https://rebeccalambert.github.io/**

I'm a frontend / full-stack developer based in the Chicago area. The site covers my background, how I work with customers, measurable impact, and selected projects.

## Stack

- React 19 + TypeScript
- Vite
- Plain CSS with custom properties (no UI framework)
- GSAP (with `@gsap/react`) for Play mode animations
- oxlint for linting
- GitHub Actions + GitHub Pages for deployment

## Design goals

- **Fast:** the classic view stays light. Play mode's GSAP plugins, styles, and fonts load only when someone turns it on.
- **Accessible:** semantic landmarks, skip link, visible focus states, and light/dark themes that respect `prefers-color-scheme`.
- **Light/dark theme:** the theme is applied before first paint to avoid a flash, and the toggle choice is remembered.
- **Basic mobile support:** layouts collapse to a single column on small screens.

Lighthouse (live site, desktop): Performance 95, Accessibility 100, Best Practices 96, SEO 100.

## Play mode

A **Play mode** toggle in the header swaps the résumé for an interactive version of the same content, styled as a notification feed. It uses only the facts already on the classic page; nothing is added or changed.

<!-- TODO: add a short GIF of Play mode here, e.g. ![Play mode](docs/play-mode.gif) -->

What it does, and the GSAP features behind each part:

- **Animated entrance:** the classic sections animate out and the feed builds in; notifications arrive one by one while the bell rings and the unread badge counts up (timelines).
- **Filters:** chips filter the feed, and items slide, fade, and reflow into place (Flip).
- **Detail cards:** project and "How I work" rows expand in place, and opening one marks it read. ClauseCheck's eval results animate in row by row.
- **Impact view:** stats become candy bubbles you can drag and toss, with numbers that count up (Draggable + Inertia).
- **Career view:** a winding timeline draws itself, and a marker travels the path to whichever job you pick by click or arrow keys (DrawSVG + MotionPath).

Built with accessibility in mind:

- Respects `prefers-reduced-motion`: animations are replaced with instant state changes.
- All content, filters, detail cards, and the Career timeline work by keyboard. Dragging and tossing the Impact bubbles is an optional mouse extra; the stats are readable without it.
- Screen readers get real values, not animation frames, and filter changes are announced.
- Automatic motion stops within 5 seconds (WCAG 2.2.2).

Play mode is **desktop-only** (1024px and up). On smaller screens the toggle explains why instead of opening. The Play code is lazy-loaded, and an error boundary keeps the page usable if it fails to load.

## Getting started

Requires Node 22+.

```bash
npm ci          # install dependencies
npm run dev     # start the dev server
npm run build   # type-check and build to dist/
npm run preview # serve the production build locally
npm run lint    # run oxlint
```

## Project structure

```
src/
  sections/    Page sections (Hero, About, CustomerWork, Impact, Projects, Contact)
  components/  Reusable pieces (ProjectCard, StatTile, Timeline, EvalTable, ThemeToggle, SkipLink,
               PlayModeToggle, MainContent: swaps classic and Play views)
  play/        Play mode (lazy-loaded): feed, filters, Impact bubbles, Career path, play.css
  data/        content.ts: all site copy and project data in one place
  lib/         theme.ts, playMode.ts (state + desktop check), gsap.ts (GSAP core setup)
  styles/      CSS variables, base, layout, and component styles
public/        Static assets (images, resume PDF, robots.txt)
```

To change site text or projects, edit `src/data/content.ts`.

## Deployment

Pushes to `master` run `.github/workflows/deploy.yml`, which builds the site and publishes `dist/` to GitHub Pages. The repo is named `rebeccalambert.github.io` so the site is served from the root URL.

## Featured projects

- [ClauseCheck](https://github.com/rebeccalambert/clausecheck): a tool-using LLM agent that answers contract questions and cites its sources, with an eval suite that catches ungrounded citations.
- RainFlix: a video streaming app organized by category (Rails, React/Redux).

## Contact

Email and links are on the live site.
