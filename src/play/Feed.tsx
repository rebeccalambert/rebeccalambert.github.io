import { useRef, useState } from 'react';
import { stats, timeline } from '../data/content';
import { gsap, prefersMotion, useGSAP } from '../lib/gsap';
import FilterChips from './FilterChips';
import { filterLabel, type FeedFilter } from './filters';
import { Flip } from './gsapPlugins';
import CareerPath from './CareerPath';
import ImpactBubbles from './ImpactBubbles';
import NotificationItem from './NotificationItem';
import { buildNotifications, type PlayNotification } from './notifications';

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
  const [filter, setFilter] = useState<FeedFilter>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [readIds, setReadIds] = useState<ReadonlySet<string>>(() => new Set());
  // Positions recorded just before a filter or expand change, plus which kind
  // of change it was — the two animate differently.
  const pendingFlip = useRef<{ state: Flip.FlipState; kind: 'filter' | 'expand' } | null>(null);

  // Impact and Career swap the list for their showpiece views; their rows
  // Flip out like any other filtered-out rows.
  const showBubbles = filter === 'impact';
  const showCareer = filter === 'career';
  const isShown = (category: string) =>
    !showBubbles && !showCareer && (filter === 'all' || filter === category);
  const shownCount = notifications.filter((n) => isShown(n.category)).length;
  const isUnread = (n: PlayNotification) => n.unread && !readIds.has(n.id);
  const unreadNow = notifications.filter(isUnread).length;
  // During the intro the badge counts up on its own; afterwards it tracks reads.
  const shownBadge = introDone ? unreadNow : badgeCount;

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
      let unreadSoFar = 0;
      items.forEach((item, i) => {
        const at = i < SLOW_ITEMS ? i * SLOW_GAP : SLOW_ITEMS * SLOW_GAP + (i - SLOW_ITEMS) * FAST_GAP;
        tl.to(item, { autoAlpha: 1, y: 0, scale: 1, duration: 0.45, ease: 'back.out(1.8)' }, at);
        // Unread rows aren't necessarily first in the feed — count as they arrive.
        if (!notifications[i].unread) return;
        const count = ++unreadSoFar;
        tl.call(() => setBadgeCount(count), [], at)
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

  // Filtering: every item stays rendered and non-matching ones get `hidden`,
  // so Flip can record positions before the change and animate leavers out,
  // enterers in, and survivors sliding to their new spots.
  const recordFlip = (kind: 'filter' | 'expand') => {
    if (!prefersMotion() || !feedRef.current) return;
    pendingFlip.current = { state: Flip.getState(feedRef.current.querySelectorAll('.note')), kind };
  };

  const changeFilter = (next: FeedFilter) => {
    if (next === filter) return;
    recordFlip('filter');
    setFilter(next);
  };

  // Accordion: opening one row closes any other, so the feed stays scannable.
  const toggleExpanded = (id: string) => {
    recordFlip('expand');
    setExpandedId((current) => (current === id ? null : id));
  };

  // Opening or clicking a notification marks it read: the dot shrinks away,
  // then the state updates (badge counts down, unread tint fades via CSS).
  const markRead = (id: string) => {
    const notification = notifications.find((n) => n.id === id);
    if (!notification || !isUnread(notification)) return;
    const commit = () => {
      setReadIds((prev) => new Set(prev).add(id));
      const badge = feedRef.current?.querySelector('.play-feed__badge');
      if (badge && prefersMotion()) {
        gsap.fromTo(badge, { scale: 1.25 }, { scale: 1, duration: 0.3, ease: 'back.out(3)' });
      }
    };
    const dot = feedRef.current?.querySelector(`[data-id="${CSS.escape(id)}"] .note__dot`);
    if (!dot || !prefersMotion()) {
      commit();
      return;
    }
    if (gsap.isTweening(dot)) return; // already on its way out
    gsap.to(dot, { scale: 0, autoAlpha: 0, duration: 0.25, ease: 'back.in(2)', onComplete: commit });
  };

  useGSAP(
    () => {
      const pending = pendingFlip.current;
      if (!pending) return;
      pendingFlip.current = null;
      if (pending.kind === 'filter') {
        Flip.from(pending.state, {
          duration: 0.5,
          ease: 'power2.inOut',
          absolute: true,
          nested: true,
          onEnter: (els) =>
            gsap.fromTo(els, { autoAlpha: 0, scale: 0.92 }, { autoAlpha: 1, scale: 1, duration: 0.4, delay: 0.15 }),
          onLeave: (els) => gsap.to(els, { autoAlpha: 0, scale: 0.92, duration: 0.25 }),
        });
      } else {
        // scale: false animates real height instead of stretching the text, so
        // the row grows open and everything below slides down to make room.
        Flip.from(pending.state, { duration: 0.45, ease: 'power2.inOut', scale: false, nested: true });
      }
    },
    { scope: feedRef, dependencies: [filter, expandedId] },
  );

  return (
    <section className="play-feed" aria-labelledby="play-feed-heading" ref={feedRef}>
      <header className="play-feed__header">
        <h2 id="play-feed-heading" ref={headingRef} tabIndex={-1}>
          <span className="play-feed__bell" aria-hidden="true">
            🔔
          </span>{' '}
          Notifications{' '}
          {/* Always rendered during the intro — its tweens target the badge
              when the timeline is built, before the count reaches 1. */}
          {(!introDone || shownBadge > 0) && <span className="play-feed__badge">{shownBadge} unread</span>}
        </h2>
        {!introDone && (
          <button
            ref={skipRef}
            type="button"
            className="play-feed__skip is-interactive"
            onClick={() => introRef.current?.progress(1)}
          >
            Skip intro
          </button>
        )}
      </header>
      <FilterChips active={filter} onChange={changeFilter} />
      <p className="visually-hidden" aria-live="polite">
        {showBubbles
          ? `Showing ${stats.length} Impact stats`
          : showCareer
            ? `Showing career timeline, ${timeline.length} stops`
            : filter === 'all'
            ? `Showing all ${shownCount} notifications`
            : `Showing ${shownCount} ${filterLabel(filter)} notifications`}
      </p>
      <ol className="play-feed__list">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            hidden={!isShown(notification.category)}
            unread={isUnread(notification)}
            expanded={expandedId === notification.id}
            onToggle={toggleExpanded}
            onRead={markRead}
          />
        ))}
      </ol>
      {showBubbles && <ImpactBubbles />}
      {showCareer && <CareerPath />}
    </section>
  );
}
