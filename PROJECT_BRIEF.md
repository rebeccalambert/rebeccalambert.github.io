# Portfolio redesign: project brief

Owner: Rebecca Lai. Site: https://rebeccalai.portfolio (GitHub Pages, user site, public repo).
Goal: a fast, accessible, modern portfolio that gets frontend/full-stack interviews. Audience: recruiters and hiring managers for frontend and full-stack roles. Recruiters give it about 30 seconds.

## Ground rules
- Work on a branch named `redesign`. Do not merge to or push `main` until Rebecca has reviewed the result.
- Never commit secrets. No API keys in this repo, ever (it is public).
- Copy style: concise, concrete, specific numbers and employer names. No clichés ("passionate", "eager to learn", "awesome"), and do not use the word "genuine". Do not invent facts: use only what is in this brief.
- Accessibility and speed matter more than flourish. Mobile: basic responsive only (not mobile-first).

## Stack and deploy
- Vite + React + TypeScript. Plain CSS with CSS variables (no UI library). Keep JS small.
- Deploy with an official GitHub Actions workflow to GitHub Pages. Rebecca must switch the repo's Settings > Pages > Source to "GitHub Actions" once. Actions are free for public repos.
- Do not break existing project pages served from other repos on this domain (for example /daily-tracker/). Old template files stay in git history; remove them from the working tree once migrated.

## Design requirements
- Light and dark themes with a visible toggle. Default to `prefers-color-scheme`; persist the choice in localStorage (wrap in try/catch); apply the theme before first paint to avoid a flash.
- Modern, restrained look: one accent color, strong typography, generous spacing, minimal motion. Respect `prefers-reduced-motion`.
- Accessibility: semantic landmarks, a skip link, visible focus states, WCAG AA contrast in both themes, alt text, full keyboard use. Target Lighthouse 95+ for Performance, Accessibility, Best Practices, SEO.

## Page sections (in order)
1. **Hero**: Rebecca Lai, one-line title, links: Resume (PDF), Email, GitHub, LinkedIn.
2. **Impact**: six stat tiles (real text, not images) plus a short career timeline below.
   - 99.95%+ production uptime through monthly on-call (LinkedIn)
   - < 20 min average time to mitigate incidents (LinkedIn)
   - 80%+ automated test coverage (LinkedIn)
   - 4 streaming platforms rebuilt pixel-perfect in React (Pilotly)
   - ~10 weekly user tests tracked with REST APIs and MongoDB (Pilotly)
   - 14 participants supported in a custom focus-group video tool (Pilotly)
   - Timeline: Penumbra (2016-2019, regulatory affairs) > App Academy (2019) > Pilotly (2020-2022) > LinkedIn (2022-2025) > volunteer year abroad (2025-2026) > ClauseCheck, 2026.
3. **Projects** (three, in this order). No Pilotly or LinkedIn screenshots exist; those roles appear only in Impact.
   - **ClauseCheck** (new, first). Repo: https://github.com/rebeccalambert/clausecheck. TypeScript, Anthropic API, SQLite. Tool-using LLM agent that answers contract questions and cites the clauses it relied on. An eval suite fails any citation to a clause the agent never opened, and it must decline questions the contracts do not cover. Repeated eval runs exposed an intermittent bad-citation failure (about 15% of runs: it declined correctly but still cited a related clause); a prompt change brought it to 0 failures in 26 runs. A second finding: the scorer rejected a correct answer worded "three" instead of "3", fixed in the scorer, not the prompt. No screenshot exists: render the eval-results table as the visual. Link the repo; no live demo yet.
   - **Daily Tracker**. Repo: https://github.com/rebeccalambert/daily-tracker, demo: https://rebeccalambert.github.io/daily-tracker/. Installable offline-first PWA (React/TypeScript) that syncs Google Calendar, Google Sheets and Habitica via OAuth into one daily planning view. Architected and directed end-to-end using Claude Code. Screenshot: images/dailytracker.png.
   - **RainFlix**. Repo: https://github.com/rebeccalambert/Rainflix. Video streaming app organized by category, Ruby on Rails, JavaScript, React/Redux. NO demo button (the old Heroku demo is offline). Screenshot: images/rainflix.png. Mention it was a bootcamp project (App Academy, 2019) only if space allows.
   - Removed from the site: Mood Booster (group project, not remembered), Ferry Driver, Spotlight, 3D Blocks.
4. **How I work with customers and stakeholders**
   Intro: "I've been the engineer in the room with customers, and in the planning meetings where frontend and backend agree on a contract."
   - Scoping with Apple TV+ engineering (Pilotly): I met with Apple TV+ engineering liaisons to scope a customized SVOD environment, then extended our platform to handle different ad placements in video and across the UI.
   - Live debugging during customer tests (Pilotly): As the engineer on call for the video-conferencing pilot, I joined customers' test runs and fixed functionality issues while they were using the product.
   - Defining API shapes (LinkedIn): On the 3-4 month Settings notification-toggle project, I joined planning meetings where backend and frontend engineers agreed on API shapes and how data would reach the UI, so the design worked on both sides of the stack.
   (Confirm "SVOD" wording with Rebecca; she originally wrote "SVD".)
5. **About**: photo (reuse images/me.png) plus a short bio. Draft, for Rebecca to edit: "Frontend engineer, formerly at LinkedIn (Notifications) and Pilotly. I build React and TypeScript interfaces with accessibility and testing built in, and I like working close to the people who use them. Based in the Chicago area."
6. **Contact**: email rlambert.w@gmail.com (plain mailto link), LinkedIn https://www.linkedin.com/in/rebeccajlambert/, GitHub https://github.com/rebeccalambert, resume PDF.

## Assets
- Photo: images/me.png (existing). Screenshots: images/dailytracker.png, images/rainflix.png.
- New resume: new-assets/Lai_Rebecca_Resume_General.pdf. Replace images/RebeccaLai_Resume_2026.pdf with it (keep the old filename's URL working or update every link).

## Phase 1 (target: live by Friday): everything above, deployed.
## Phase 2 (after Phase 1 is live; not part of the first deploy): "Ask about Rebecca" chatbot
- Static Pages cannot hold an API key. Plan: a Cloudflare Worker proxy that holds the Anthropic key as a secret, with per-visitor rate limiting, a max output length, an origin check, and a monthly spend limit on the Anthropic workspace.
- Grounded in a small public facts file (resume and project content only): answers cite their source, honestly say "no" to skills she lacks (Django, PostgreSQL, React Native; Python is basic), and decline anything outside the facts (salary, other applications, address).
- Reuse the ClauseCheck design: tool loop, grounding check, and an eval suite including adversarial and out-of-scope questions. Accessible chat UI (live region, keyboard use). Details to be settled with Rebecca before building.
