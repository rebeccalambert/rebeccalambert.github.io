export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'theme';

/** Mirrors the inline script in index.html that runs before first paint. */
export function getInitialTheme(): Theme {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') return stored;
  } catch {
    // localStorage can throw (private browsing, storage disabled) — fall through.
  }
  return 'dark';
}

export function applyTheme(theme: Theme): void {
  document.documentElement.setAttribute('data-theme', theme);
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    // Non-fatal: theme still applies for this session, just won't persist.
  }
}
