import { useRef } from 'react';
import type { TimelineEntry } from '../data/content';
import { gsap, MOTION_OK, useGSAP } from '../lib/gsap';
import { usePlayMode } from '../lib/playMode';

export default function Timeline({ entries }: { entries: TimelineEntry[] }) {
  const { isPlayMode } = usePlayMode();
  const wrapRef = useRef<HTMLDivElement>(null);

  // Play mode: the track draws left to right, then each entry pops in along it.
  useGSAP(
    () => {
      if (!isPlayMode) return;
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap
          .timeline({ scrollTrigger: { trigger: wrapRef.current, start: 'top 80%', once: true } })
          .from('.timeline__track', {
            scaleX: 0,
            transformOrigin: 'left center',
            duration: 1.2,
            ease: 'power2.inOut',
          })
          .from(
            '.timeline__item',
            { autoAlpha: 0, y: 16, duration: 0.4, stagger: 0.15, ease: 'back.out(2)' },
            '<0.15',
          );
      });
      return () => mm.revert();
    },
    { scope: wrapRef, dependencies: [isPlayMode], revertOnUpdate: true },
  );

  return (
    <div className="timeline-wrap" ref={wrapRef}>
      {isPlayMode && <div className="timeline__track" aria-hidden="true" />}
      <ol className="timeline">
        {entries.map((entry) => (
          <li className="timeline__item" key={entry.period}>
            <span className="timeline__period">{entry.period}</span>
            <span className="timeline__label">{entry.label}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
