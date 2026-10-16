import { useRef } from 'react';
import type { Stat } from '../data/content';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap';
import { usePlayMode } from '../lib/playMode';
import { formatStatValue, parseStatValue } from '../lib/parseStatValue';

export default function StatTile({ value, label, source }: Stat) {
  const { isPlayMode } = usePlayMode();
  const tileRef = useRef<HTMLLIElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const parsed = parseStatValue(value);
  const canCount = isPlayMode && parsed !== null;

  useGSAP(
    () => {
      const el = counterRef.current;
      if (!canCount || !parsed || !el) return;
      // GSAP owns this span's text; React renders it empty so they never fight.
      el.textContent = value;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const counter = { n: 0 };
        el.textContent = formatStatValue(parsed, 0);
        gsap.to(counter, {
          n: parsed.number,
          duration: 1.6,
          ease: 'power2.out',
          scrollTrigger: { trigger: tileRef.current, start: 'top 85%', once: true },
          onUpdate: () => {
            el.textContent = formatStatValue(parsed, counter.n);
          },
        });
      });
      return () => mm.revert();
    },
    { dependencies: [canCount], revertOnUpdate: true },
  );

  return (
    <li className="stat-tile" ref={tileRef}>
      <p className="stat-tile__value">
        {canCount ? (
          <>
            {/* Screen readers get the real value once, not every frame of the count. */}
            <span className="visually-hidden">{value}</span>
            <span aria-hidden="true" ref={counterRef} />
          </>
        ) : (
          value
        )}
      </p>
      <p className="stat-tile__label">
        {label} <span className="stat-tile__source">({source})</span>
      </p>
    </li>
  );
}
