import { useRef, useState } from 'react';
import { gsap, prefersMotion, useGSAP } from '../lib/gsap';
import NotificationItem from './NotificationItem';
import { buildNotifications } from './notifications';

const notifications = buildNotifications();
const unreadCount = notifications.filter((n) => n.unread).length;

/** The first few items arrive slowly enough to read; the rest pour in after. */
const SLOW_ITEMS = 6;
const SLOW_GAP = 0.4;
const FAST_GAP = 0.06;

export default function Feed() {
  const feedRef = useRef<HTMLElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const skipRef = useRef<HTMLButtonElement>(null);
  const introRef = useRef<gsap.core.Timeline | null>(null);
  // Reduced motion: no intro at all — everything is simply there.
  const [introDone, setIntroDone] = useState(() => !prefersMotion());
  const [badgeCount, setBadgeCount] = useState(() => (introDone ? unreadCount : 0));

  // Runs when the intro ends, whether it played out or was skipped.
  const onIntroComplete = () => {
    setBadgeCount(unreadCount);
    setIntroDone(true);
    // The skip button is about to unmount — don't strand keyboard focus.
    if (document.activeElement === skipRef.current) headingRef.current?.focus();
  };

  // Intro: notifications drop in one by one; each unread one rings the bell
  // and ticks the badge up. Runs once per visit to Play mode.
  useGSAP(
    () => {
      if (introDone) return;
      const items = gsap.utils.toArray<HTMLElement>('.note');
      gsap.set(items, { autoAlpha: 0, y: -18, scale: 0.97 });
      gsap.set('.play-feed__badge', { autoAlpha: 0, scale: 0.5 });

      const tl = gsap.timeline({ delay: 0.5, onComplete: onIntroComplete });
      items.forEach((item, i) => {
        const at = i < SLOW_ITEMS ? i * SLOW_GAP : SLOW_ITEMS * SLOW_GAP + (i - SLOW_ITEMS) * FAST_GAP;
        tl.to(item, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }, at);
        if (i >= unreadCount) return;
        tl.call(() => setBadgeCount(i + 1), [], at)
          .to('.play-feed__bell', { keyframes: { rotation: [0, -22, 16, -8, 0] }, duration: 0.38 }, at)
          .fromTo(
            '.play-feed__badge',
            { autoAlpha: 1, scale: 1.3 },
            { autoAlpha: 1, scale: 1, duration: 0.3, ease: 'back.out(3)' },
            at,
          );
      });
      introRef.current = tl;

      // Any key or click skips ahead — nobody should have to wait for it. This
      // also covers the Skip button: pointerdown fires before its click.
      const skip = () => tl.progress(1);
      window.addEventListener('keydown', skip, { once: true });
      window.addEventListener('pointerdown', skip, { once: true });
      return () => {
        window.removeEventListener('keydown', skip);
        window.removeEventListener('pointerdown', skip);
      };
    },
    { scope: feedRef },
  );

  return (
    <section className="play-feed" aria-labelledby="play-feed-heading" ref={feedRef}>
      <header className="play-feed__header">
        <h2 id="play-feed-heading" ref={headingRef} tabIndex={-1}>
          <span className="play-feed__bell" aria-hidden="true">
            🔔
          </span>{' '}
          Notifications <span className="play-feed__badge">{badgeCount} new</span>
        </h2>
        {!introDone && (
          <button ref={skipRef} type="button" className="play-feed__skip is-interactive"
            onClick={() => introRef.current?.progress(1)}
          >
            Skip intro
          </button>
        )}
      </header>
      <ol className="play-feed__list">
        {notifications.map((notification) => (
          <NotificationItem key={notification.id} notification={notification} />
        ))}
      </ol>
    </section>
  );
}
