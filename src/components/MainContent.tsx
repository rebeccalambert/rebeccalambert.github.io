import { lazy, Suspense, useLayoutEffect, useRef, useState } from 'react';
import { gsap, prefersMotion, useGSAP } from '../lib/gsap';
import { applyDocumentMode, usePlayMode } from '../lib/playMode';
import { loadPlayMode } from '../play/loadPlayMode';
import PlayModeErrorBoundary from './PlayModeErrorBoundary';
import About from '../sections/About';
import Contact from '../sections/Contact';
import CustomerWork from '../sections/CustomerWork';
import Hero from '../sections/Hero';
import Impact from '../sections/Impact';
import Projects from '../sections/Projects';

const PlayMode = lazy(loadPlayMode);

/**
 * Swaps <main> between the classic résumé and Play mode. The toggle flips
 * `isPlayMode` right away; `showPlay` lags behind until the outgoing content
 * has animated out, so the two views never overlap.
 */
export default function MainContent() {
  const { isPlayMode, setPlayMode } = usePlayMode();
  const [showPlay, setShowPlay] = useState(isPlayMode);
  const mainRef = useRef<HTMLElement>(null);
  const hasSwapped = useRef(false);

  // Page colors follow what's on screen, not the toggle. Layout effect so the
  // new palette lands in the same frame as the new content.
  useLayoutEffect(() => {
    applyDocumentMode(showPlay);
  }, [showPlay]);

  // Exit: animate the current view out, then swap. revertOnUpdate means
  // toggling back mid-exit snaps the content back instead of leaving it faded.
  useGSAP(
    () => {
      if (showPlay === isPlayMode) return;
      const swap = () => {
        hasSwapped.current = true;
        setShowPlay(isPlayMode);
      };
      if (!prefersMotion() || !mainRef.current) {
        swap();
        return;
      }
      gsap.to(mainRef.current.children, {
        autoAlpha: 0,
        y: -24,
        duration: 0.25,
        stagger: 0.05,
        ease: 'power1.in',
        onComplete: swap,
      });
    },
    { scope: mainRef, dependencies: [isPlayMode, showPlay], revertOnUpdate: true },
  );

  // Enter (classic only — Play mode choreographs its own entrance). Skipped on
  // first page load so the résumé never animates for someone who didn't ask.
  useGSAP(
    () => {
      if (showPlay || !hasSwapped.current || !mainRef.current || !prefersMotion()) return;
      gsap.from(mainRef.current.children, {
        autoAlpha: 0,
        y: 24,
        duration: 0.4,
        stagger: 0.06,
        ease: 'power2.out',
        clearProps: 'all',
      });
    },
    { scope: mainRef, dependencies: [showPlay] },
  );

  return (
    <main id="main" ref={mainRef}>
      {showPlay ? (
        <PlayModeErrorBoundary onBackToClassic={() => setPlayMode(false)}>
          <Suspense fallback={<p className="play-loading">Loading Play mode…</p>}>
            <PlayMode />
          </Suspense>
        </PlayModeErrorBoundary>
      ) : (
        <>
          <Hero />
          <Impact />
          <Projects />
          <CustomerWork />
          <About />
          <Contact />
        </>
      )}
    </main>
  );
}
