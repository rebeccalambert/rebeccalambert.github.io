import SkipLink from './components/SkipLink';
import ThemeToggle from './components/ThemeToggle';
import About from './sections/About';
import Contact from './sections/Contact';
import CustomerWork from './sections/CustomerWork';
import Hero from './sections/Hero';
import Impact from './sections/Impact';
import Projects from './sections/Projects';

export default function App() {
  return (
    <>
      <SkipLink />
      <header className="site-header">
        <a className="site-header__name" href="#main">
          Rebecca Lai
        </a>
        <ThemeToggle />
      </header>
      <main id="main">
        <Hero />
        <Impact />
        <Projects />
        <CustomerWork />
        <About />
        <Contact />
      </main>
      <footer className="site-footer">
        <p>&copy; {new Date().getFullYear()} Rebecca Lai</p>
      </footer>
    </>
  );
}
