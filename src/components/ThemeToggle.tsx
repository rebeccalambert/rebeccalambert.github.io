import { useEffect, useState } from 'react';
import { applyTheme, getInitialTheme, type Theme } from '../lib/theme';

export default function ThemeToggle() {
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  useEffect(() => {
    applyTheme(theme);
  }, [theme]);

  const isDark = theme === 'dark';

  return (
    <button
      type="button"
      className="theme-toggle"
      aria-pressed={isDark}
      onClick={() => setTheme(isDark ? 'light' : 'dark')}
    >
      <span aria-hidden="true" className="theme-toggle__icon">
        {isDark ? '☀️' : '🌙'}
      </span>
      {isDark ? 'Light mode' : 'Dark mode'}
    </button>
  );
}
