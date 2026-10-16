import { useId, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { gsap, MOTION_OK, prefersMotion, useGSAP } from '../lib/gsap';
import { usePlayMode } from '../lib/playMode';

export default function PlayModeToggle() {
  const { isPlayMode, canPlay, setPlayMode } = usePlayMode();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const hintId = useId();
  const [showHint, setShowHint] = useState(false);

  // Attention-getter on load: two hops, then it stops. Kept under 5s total so
  // it doesn't need a pause control (WCAG 2.2.2 Pause, Stop, Hide). Skipped when
  // the screen is too small, so we're not drawing attention to a blocked button.
  const { contextSafe } = useGSAP(
    () => {
      if (!canPlay) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ delay: 0.8, repeat: 1, repeatDelay: 1 })
          .to(buttonRef.current, { y: -10, duration: 0.25, ease: 'power2.out' })
          .to(buttonRef.current, { y: 0, duration: 0.7, ease: 'bounce.out' })
          .fromTo(
            '.play-toggle__icon',
            { rotation: 0 },
            { rotation: 360, duration: 0.6, ease: 'back.out(2)' },
            0,
          );
      });
      return () => mm.revert();
    },
    { scope: buttonRef, dependencies: [canPlay], revertOnUpdate: true },
  );

  const wiggle = contextSafe(() => {
    if (!canPlay || !prefersMotion()) return;
    gsap.to('.play-toggle__icon', {
      keyframes: { rotation: [0, -18, 14, -8, 0] },
      duration: 0.5,
      overwrite: 'auto',
    });
  });

  const handleClick = contextSafe((event: MouseEvent<HTMLButtonElement>) => {
    // Blocked: a click (or tap — phones have no hover) explains why instead.
    if (!canPlay) {
      setShowHint(true);
      return;
    }
    setPlayMode(!isPlayMode);
    if (!prefersMotion()) return;
    // Squash and stretch on press.
    gsap
      .timeline()
      .to(event.currentTarget, { scaleX: 1.15, scaleY: 0.85, duration: 0.1, ease: 'power1.out' })
      .to(event.currentTarget, { scaleX: 1, scaleY: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  });

  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.key === 'Escape') setShowHint(false);
  };

  return (
    // Hover listeners sit on the wrapper so moving the pointer onto the hint
    // keeps it open (WCAG 1.4.13: hoverable, dismissible, persistent).
    <span
      className="play-toggle-wrap"
      onMouseEnter={() => {
        wiggle();
        if (!canPlay) setShowHint(true);
      }}
      onMouseLeave={() => setShowHint(false)}
      onKeyDown={handleKeyDown}
    >
      <button
        ref={buttonRef}
        type="button"
        className={canPlay ? 'play-toggle' : 'play-toggle play-toggle--blocked'}
        // aria-disabled rather than disabled: a disabled button can't be focused,
        // so keyboard and screen reader users would never hear why.
        aria-disabled={canPlay ? undefined : true}
        aria-pressed={isPlayMode}
        aria-describedby={canPlay ? undefined : hintId}
        onClick={handleClick}
        onFocus={() => !canPlay && setShowHint(true)}
        onBlur={() => setShowHint(false)}
      >
        <span aria-hidden="true" className="play-toggle__icon">
          {isPlayMode ? '✨' : '🎮'}
        </span>
        Play mode
        {canPlay ? (
          <span aria-hidden="true" className="play-toggle__state">
            {isPlayMode ? 'On' : 'Off'}
          </span>
        ) : (
          <span className="play-toggle__state">Desktop only</span>
        )}
      </button>
      {!canPlay && (
        <span role="tooltip" id={hintId} className="play-toggle__hint" hidden={!showHint}>
          Play mode needs a wider screen.
        </span>
      )}
    </span>
  );
}
