import { useRef, useState, type KeyboardEvent } from 'react';
import { timeline } from '../data/content';
import { gsap, prefersMotion, useGSAP } from '../lib/gsap';
import { linksFor } from './careerLinks';

const VIEW_W = 1000;
const VIEW_H = 300;

// One point per timeline entry (oldest → newest), evenly spaced and
// alternating low/high so the path winds (mockup D). Derived from the entry
// count so adding or removing a job in content.ts keeps the curve valid.
const X_START = 60;
const X_END = 940;
const Y_LOW = 205;
const Y_HIGH = 90;
const POINTS: [number, number][] = timeline.map((_, i) => [
  X_START + (i * (X_END - X_START)) / Math.max(timeline.length - 1, 1),
  i % 2 === 0 ? Y_LOW : Y_HIGH,
]);

/** Smooth path through every point: each segment is a cubic with flat handles. */
function pathThrough(points: [number, number][]): string {
  let d = `M${points[0][0]} ${points[0][1]}`;
  for (let i = 1; i < points.length; i++) {
    const [x0, y0] = points[i - 1];
    const [x1, y1] = points[i];
    const mid = (x1 - x0) / 2;
    d += ` C${x0 + mid} ${y0}, ${x1 - mid} ${y1}, ${x1} ${y1}`;
  }
  return d;
}

const PATH_D = pathThrough(POINTS);
const LATEST = timeline.length - 1;

/** Progress (0–1) along the path closest to each stop, found by sampling. */
function stopProgress(path: SVGPathElement): number[] {
  const total = path.getTotalLength();
  const samples = 400;
  return POINTS.map(([x, y]) => {
    let best = 0;
    let bestDist = Infinity;
    for (let s = 0; s <= samples; s++) {
      const p = path.getPointAtLength((s / samples) * total);
      const dist = (p.x - x) ** 2 + (p.y - y) ** 2;
      if (dist < bestDist) {
        bestDist = dist;
        best = s / samples;
      }
    }
    return best;
  });
}

export default function CareerPath() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const markerRef = useRef<SVGGElement>(null);
  const stopRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const progressAt = useRef<number[]>([]);
  // Where the marker actually is right now, so a new trip can start mid-flight.
  const markerProgress = useRef(0);
  const [selected, setSelected] = useState(LATEST);

  const placeMarker = (from: number, to: number, duration: number, ease = 'power2.inOut') => {
    const path = pathRef.current;
    const marker = markerRef.current;
    if (!path || !marker) return;
    const motionPath = { path, align: path, alignOrigin: [0.5, 0.5], start: from, end: to };
    // Instant moves (reduced motion) go through gsap.set: a zero-duration tween
    // renders inside gsap.to(), so an onUpdate reading `tween` would throw.
    if (duration === 0) {
      gsap.set(marker, { motionPath: { ...motionPath, start: to }, overwrite: true });
      markerProgress.current = to;
      return;
    }
    const tween = gsap.to(marker, {
      motionPath,
      duration,
      ease,
      overwrite: true,
      onUpdate: () => {
        markerProgress.current = from + (to - from) * tween.ratio;
      },
    });
  };

  // Entrance: the path draws itself left to right, each stop pops in as the
  // line reaches it, and the marker rides from the first job to today.
  useGSAP(
    () => {
      const path = pathRef.current;
      if (!path) return;
      progressAt.current = stopProgress(path);
      const end = progressAt.current[LATEST];

      if (!prefersMotion()) {
        placeMarker(end, end, 0);
        return;
      }

      const draw = 1.6;
      const tl = gsap.timeline({ delay: 0.2 });
      tl.from(path, { drawSVG: '0%', duration: draw, ease: 'power1.inOut' });
      progressAt.current.forEach((p, i) => {
        tl.from(
          stopRefs.current[i],
          { autoAlpha: 0, scale: 0.6, duration: 0.35, ease: 'back.out(2.5)' },
          p * draw,
        );
      });
      tl.from(markerRef.current, { autoAlpha: 0, scale: 0, transformOrigin: '50% 50%', duration: 0.3 }, 0);
      tl.add(() => {
        placeMarker(0, end, 1.6, 'power1.inOut');
      }, 0);
      return () => gsap.killTweensOf(markerRef.current);
    },
    { scope: wrapRef },
  );

  const select = (i: number) => {
    setSelected(i);
    const to = progressAt.current[i];
    if (to === undefined) return;
    const from = markerProgress.current;
    const duration = prefersMotion() ? Math.min(1.6, Math.max(0.4, Math.abs(to - from) * 2.4)) : 0;
    placeMarker(from, to, duration);
  };

  // ←/→ (and Home/End) walk the timeline and move focus with the selection.
  const handleKeyDown = (event: KeyboardEvent) => {
    const next =
      event.key === 'ArrowRight'
        ? Math.min(selected + 1, LATEST)
        : event.key === 'ArrowLeft'
          ? Math.max(selected - 1, 0)
          : event.key === 'Home'
            ? 0
            : event.key === 'End'
              ? LATEST
              : null;
    if (next === null) return;
    event.preventDefault();
    select(next);
    stopRefs.current[next]?.focus();
  };

  const entry = timeline[selected];
  const links = linksFor(entry);
  const hasLinks = links.stats.length + links.stories.length + links.projects.length > 0;

  return (
    <div className="career-view" ref={wrapRef}>
      <p className="career-view__hint" aria-hidden="true">
        Click a stop, or use ← → to travel
      </p>
      <div className="career-path">
        <svg viewBox={`0 0 ${VIEW_W} ${VIEW_H}`} aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id="career-gradient" x1="0" x2="1">
              <stop offset="0" stopColor="#ff8ad1" />
              <stop offset="0.5" stopColor="#b794ff" />
              <stop offset="1" stopColor="#6ea2ff" />
            </linearGradient>
          </defs>
          <path className="career-path__ghost" d={PATH_D} />
          <path className="career-path__line" d={PATH_D} ref={pathRef} />
          <g className="career-path__marker" ref={markerRef}>
            <circle r="17" />
            <circle r="6" className="career-path__marker-dot" />
          </g>
        </svg>
        <div className="career-path__stops" role="group" aria-label="Career timeline" onKeyDown={handleKeyDown}>
          {timeline.map((stop, i) => {
            const [x, y] = POINTS[i];
            const labelAbove = y < VIEW_H / 2;
            return (
              <button
                key={stop.period}
                ref={(el) => {
                  stopRefs.current[i] = el;
                }}
                type="button"
                className={labelAbove ? 'career-stop career-stop--above' : 'career-stop'}
                style={{ left: `${(x / VIEW_W) * 100}%`, top: `${(y / VIEW_H) * 100}%` }}
                aria-pressed={selected === i}
                onClick={() => select(i)}
              >
                <span className="career-stop__dot" aria-hidden="true" />
                <span className="career-stop__text">
                  <span className="career-stop__label">{stop.label}</span>
                  <span className="career-stop__period">{stop.period}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <section className="career-detail" aria-live="polite" aria-labelledby="career-detail-heading">
        <h3 id="career-detail-heading">
          {entry.label} <span className="career-detail__period">{entry.period}</span>
        </h3>
        {hasLinks && (
          <ul className="career-detail__list">
            {links.stats.map((stat) => (
              <li key={stat.label}>
                <strong>{stat.value}</strong> {stat.label}
              </li>
            ))}
            {links.stories.map((story) => (
              <li key={story.heading}>
                <strong>{story.heading}</strong> — {story.body}
              </li>
            ))}
            {links.projects.map((project) => (
              <li key={project.name}>
                <strong>{project.name}</strong> — {project.description}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
