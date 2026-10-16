import { useRef, type MouseEvent } from 'react';
import { gsap, MOTION_OK, prefersMotion, useGSAP } from '../lib/gsap';
import { usePlayMode } from '../lib/playMode';

export default function PlayModeToggle() {
  const { isPlayMode, setPlayMode } = usePlayMode();
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Attention-getter on load: two hops, then it stops. Kept under 5s total so
  // it doesn't need a pause control (WCAG 2.2.2 Pause, Stop, Hide).
  const { contextSafe } = useGSAP(
    () => {
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
    { scope: buttonRef },
  );

  const wiggle = contextSafe(() => {
    if (!prefersMotion()) return;
    gsap.to('.play-toggle__icon', {
      keyframes: { rotation: [0, -18, 14, -8, 0] },
      duration: 0.5,
      overwrite: 'auto',
    });
  });

  const handleClick = contextSafe((event: MouseEvent<HTMLButtonElement>) => {
    setPlayMode(!isPlayMode);
    if (!prefersMotion()) return;
    // Squash and stretch on press.
    gsap
      .timeline()
      .to(event.currentTarget, { scaleX: 1.15, scaleY: 0.85, duration: 0.1, ease: 'power1.out' })
      .to(event.currentTarget, { scaleX: 1, scaleY: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
  });

  return (
    <button
      ref={buttonRef}
      type="button"
      className="play-toggle"
      aria-pressed={isPlayMode}
      onClick={handleClick}
      onMouseEnter={wiggle}
    >
      <span aria-hidden="true" className="play-toggle__icon">
        {isPlayMode ? '✨' : '🎮'}
      </span>
      Play mode
      <span aria-hidden="true" className="play-toggle__state">
        {isPlayMode ? 'On' : 'Off'}
      </span>
    </button>
  );
}
