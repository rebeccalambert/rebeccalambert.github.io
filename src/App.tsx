import MainContent from './components/MainContent';
import PlayModeProvider from './components/PlayModeProvider';
import PlayModeToggle from './components/PlayModeToggle';
import SkipLink from './components/SkipLink';
import ThemeToggle from './components/ThemeToggle';

export default function App() {
  return (
    <PlayModeProvider>
      <SkipLink />
      <header className="site-header">
        <a className="site-header__name" href="#main">
          Rebecca Lai
        </a>
        <div className="site-header__actions">
          <PlayModeToggle />
          <ThemeToggle />
        </div>
      </header>
      <MainContent />
      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} Rebecca Lai</p>
      </footer>
    </PlayModeProvider>
  );
}
