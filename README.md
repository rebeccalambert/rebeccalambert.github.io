# Rebecca Lai: Portfolio

Source for my portfolio site: **https://rebeccalambert.github.io/**

I'm a frontend / full-stack developer based in the Chicago area. The site covers my background, how I work with customers, measurable impact, and selected projects.

## Stack

- React 19 + TypeScript
- Vite
- Plain CSS with custom properties (no UI framework)
- oxlint for linting
- GitHub Actions + GitHub Pages for deployment

## Design goals

- **Fast:** small bundle, no runtime dependencies beyond React.
- **Accessible:** semantic landmarks, skip link, visible focus states, and light/dark themes that respect `prefers-color-scheme`.
- **Light/dark theme:** the theme is applied before first paint to avoid a flash, and the toggle choice is remembered.
- **Basic mobile support:** layouts collapse to a single column on small screens.

Lighthouse (live site, desktop): Performance 95, Accessibility 100, Best Practices 96, SEO 100.

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
  components/  Reusable pieces (ProjectCard, StatTile, Timeline, EvalTable, ThemeToggle, SkipLink)
  data/        content.ts: all site copy and project data in one place
  lib/         theme.ts: theme initialization and toggling
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
