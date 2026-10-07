import type { TimelineEntry } from '../data/content';

export default function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <ol className="timeline">
      {entries.map((entry) => (
        <li className="timeline__item" key={entry.period}>
          <span className="timeline__period">{entry.period}</span>
          <span className="timeline__label">{entry.label}</span>
        </li>
      ))}
    </ol>
  );
}
