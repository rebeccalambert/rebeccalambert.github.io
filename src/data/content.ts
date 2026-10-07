export interface Stat {
  value: string;
  label: string;
  source: string;
}

export const stats: Stat[] = [
  { value: '99.95%+', label: 'production uptime through monthly on-call', source: 'LinkedIn' },
  { value: '< 20 min', label: 'average time to mitigate incidents', source: 'LinkedIn' },
  { value: '80%+', label: 'automated test coverage', source: 'LinkedIn' },
  { value: '4', label: 'streaming platforms rebuilt pixel-perfect in React', source: 'Pilotly' },
  { value: '~10', label: 'weekly user tests tracked with REST APIs and MongoDB', source: 'Pilotly' },
  { value: '14', label: 'participants supported in a custom focus-group video tool', source: 'Pilotly' },
];

export interface TimelineEntry {
  period: string;
  label: string;
}

export const timeline: TimelineEntry[] = [
  { period: '2016–2019', label: 'Penumbra (regulatory affairs)' },
  { period: '2019', label: 'App Academy' },
  { period: '2020–2022', label: 'Pilotly' },
  { period: '2022–2025', label: 'LinkedIn' },
  { period: '2025–2026', label: 'Volunteer year abroad' },
  { period: '2026', label: 'ClauseCheck' },
];

export interface EvalRow {
  check: string;
  result: string;
}

export const clauseCheckEvalResults: EvalRow[] = [
  { check: 'Citation grounding — baseline', result: '~15% of runs: correctly declined, but cited an unrelated clause' },
  { check: 'Citation grounding — after prompt fix', result: '0 failures in 26 runs' },
  { check: 'Scorer accuracy', result: "Fixed false negative on numeral-vs-word answers (e.g. \"3\" vs \"three\")" },
];

export interface Project {
  name: string;
  description: string;
  stack: string;
  repoUrl: string;
  demoUrl?: string;
  demoDisabledReason?: string;
  screenshot?: { src: string; alt: string; width: number; height: number };
  note?: string;
}

export const projects: Project[] = [
  {
    name: 'ClauseCheck',
    description:
      'A tool-using LLM agent that answers contract questions and cites the clauses it relied on. An eval suite fails any citation to a clause the agent never opened, and the agent must decline questions the contracts do not cover.',
    stack: 'TypeScript, Anthropic API, SQLite',
    repoUrl: 'https://github.com/rebeccalambert/clausecheck',
    note: 'No live demo yet.',
  },
  {
    name: 'Daily Tracker',
    description:
      'An installable offline-first PWA that syncs Google Calendar, Google Sheets, and Habitica via OAuth into one daily planning view. Architected and directed end-to-end using Claude Code.',
    stack: 'React, TypeScript',
    repoUrl: 'https://github.com/rebeccalambert/daily-tracker',
    demoUrl: 'https://rebeccalambert.github.io/daily-tracker/',
    screenshot: { src: '/images/dailytracker.webp', alt: 'Screenshot of the Daily Tracker daily planning view', width: 640, height: 1022 },
  },
  {
    name: 'RainFlix',
    description:
      'A video streaming app organized by category. Built as a bootcamp project at App Academy (2019).',
    stack: 'Ruby on Rails, JavaScript, React/Redux',
    repoUrl: 'https://github.com/rebeccalambert/Rainflix',
    demoDisabledReason: 'Demo offline — see code',
    screenshot: { src: '/images/rainflix.webp', alt: 'Screenshot of the RainFlix category browsing page', width: 800, height: 494 },
  },
];

export interface CustomerStory {
  heading: string;
  source: string;
  body: string;
}

export const customerStories: CustomerStory[] = [
  {
    heading: 'Scoping with Apple TV+ engineering',
    source: 'Pilotly',
    body: 'I met with Apple TV+ engineering liaisons to scope a customized SVOD environment, then extended our platform to handle different ad placements in video and across the UI.',
  },
  {
    heading: 'Live debugging during customer tests',
    source: 'Pilotly',
    body: "As the engineer on call for the video-conferencing pilot, I joined customers' test runs and fixed functionality issues while they were using the product.",
  },
  {
    heading: 'Defining API shapes',
    source: 'LinkedIn',
    body: 'On the 3–4 month Settings notification-toggle project, I joined planning meetings where backend and frontend engineers agreed on API shapes and how data would reach the UI, so the design worked on both sides of the stack.',
  },
];
