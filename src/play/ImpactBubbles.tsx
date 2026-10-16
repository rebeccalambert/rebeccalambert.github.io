import { useRef } from 'react';
import { stats } from '../data/content';
import { gsap, prefersMotion, useGSAP } from '../lib/gsap';
import { Draggable } from './gsapPlugins';
import { formatStatValue, parseStatValue } from './parseStatValue';

interface BubbleSpot {
  /** Horizontal position as a % of the board, so it scales with the panel. */
  left: string;
  top: number;
  size: number;
  color: string;
  tilt: number;
}

// Hand-placed collage (mockup D), one spot per stat in content.ts order.
const SPOTS: BubbleSpot[] = [
  { left: '3%', top: 24, size: 190, color: 'var(--candy-pink)', tilt: -4 },
  { left: '35%', top: 0, size: 165, color: 'var(--candy-lilac)', tilt: 3 },
  { left: '66%', top: 30, size: 180, color: 'var(--candy-mint)', tilt: -2 },
  { left: '9%', top: 250, size: 170, color: 'var(--candy-butter)', tilt: 4 },
  { left: '40%', top: 205, size: 185, color: 'var(--candy-sky)', tilt: -3 },
  { left: '71%', top: 262, size: 160, color: 'var(--candy-pink)', tilt: 2 },
];

const parsedStats = stats.map((stat) => parseStatValue(stat.value));

export default function ImpactBubbles() {
  const boardRef = useRef<HTMLUListElement>(null);

  useGSAP(
    () => {
      const board = boardRef.current;
      if (!board) return;
      const motion = prefersMotion();
      // Two layers per bubble so tweens never fight Draggable over `transform`:
      // the <li> is the drag handle (Draggable owns its x/y), and the inner
      // shape gets every visual tween (pop-in, bob, squash, press scale).
      const bubbles = gsap.utils.toArray<HTMLElement>('.bubble');
      const shapes = bubbles.map((bubble) => bubble.querySelector<HTMLElement>('.bubble__shape'));
      const counters = bubbles.map((bubble) => bubble.querySelector<HTMLElement>('.bubble__count'));

      // The visible number is GSAP-owned (React renders the span empty); screen
      // readers get the real value from a visually hidden sibling instead.
      const countUp = (i: number) => {
        const el = counters[i];
        const parsed = parsedStats[i];
        if (!el || !parsed) return;
        const counter = { n: 0 };
        gsap.to(counter, {
          n: parsed.number,
          duration: 1.2,
          ease: 'power2.out',
          overwrite: true,
          onUpdate: () => {
            el.textContent = formatStatValue(parsed, counter.n);
          },
        });
      };
      counters.forEach((el, i) => {
        if (!el) return;
        const parsed = parsedStats[i];
        el.textContent = motion && parsed ? formatStatValue(parsed, 0) : stats[i].value;
      });

      if (motion) {
        // Pop in, count up, then bob a few times and settle — under 5s of
        // automatic motion, so no pause control is needed (WCAG 2.2.2).
        const tl = gsap.timeline({ delay: 0.2 });
        tl.from(shapes, { scale: 0, duration: 0.6, ease: 'back.out(2)', stagger: 0.08 }).from(
          shapes,
          { autoAlpha: 0, duration: 0.25, stagger: 0.08 },
          0,
        );
        bubbles.forEach((_, i) => tl.call(() => countUp(i), [], 0.15 + i * 0.08));
        shapes.forEach((shape, i) => {
          if (!shape) return;
          gsap.to(shape, { y: -8, duration: 0.9 + i * 0.07, ease: 'sine.inOut', yoyo: true, repeat: 3, delay: 0.9 });
        });
      }

      // Drag and toss. Inertia only with motion allowed — reduced motion still
      // drags, it just stops where you let go.
      const draggables = bubbles.map((bubble, i) => {
        const shape = shapes[i];
        return Draggable.create(bubble, {
          type: 'x,y',
          bounds: board,
          inertia: motion,
          edgeResistance: 0.7,
          zIndexBoost: true,
          onPress: () => {
            if (shape) gsap.killTweensOf(shape, 'y');
            if (motion && shape) gsap.to(shape, { scale: 1.08, duration: 0.15, overwrite: 'auto' });
          },
          onRelease: () => {
            if (motion && shape) gsap.to(shape, { scale: 1, duration: 0.4, ease: 'back.out(3)', overwrite: 'auto' });
          },
          // A press without a drag: squash and replay the count.
          onClick: () => {
            if (!motion || !shape) return;
            gsap
              .timeline()
              .to(shape, { scaleX: 1.12, scaleY: 0.88, duration: 0.1, overwrite: 'auto' })
              .to(shape, { scaleX: 1, scaleY: 1, duration: 0.6, ease: 'elastic.out(1, 0.4)' });
            countUp(i);
          },
        })[0];
      });

      return () => draggables.forEach((draggable) => draggable.kill());
    },
    { scope: boardRef },
  );

  return (
    <div className="impact-view">
      {/* Mouse instructions — the stats themselves are fully readable without dragging. */}
      <p className="impact-view__hint" aria-hidden="true">
        Drag a bubble and give it a toss · click one to replay its count
      </p>
      <ul className="bubbles" ref={boardRef} aria-label="Impact stats">
        {stats.map((stat, i) => {
          const spot = SPOTS[i];
          return (
            <li
              key={stat.label}
              className="bubble"
              style={{ left: spot.left, top: spot.top, width: spot.size, height: spot.size }}
            >
              <div className="bubble__shape is-interactive" style={{ background: spot.color }}>
                <div className="bubble__body" style={{ rotate: `${spot.tilt}deg` }}>
                  <span className="visually-hidden">{stat.value}</span>
                  <span className="bubble__count" aria-hidden="true" />
                  <span className="bubble__label">{stat.label}</span>
                  <span className="bubble__source">{stat.source}</span>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
