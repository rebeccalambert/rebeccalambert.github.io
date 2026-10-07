import type { Stat } from '../data/content';

export default function StatTile({ value, label, source }: Stat) {
  return (
    <li className="stat-tile">
      <p className="stat-tile__value">{value}</p>
      <p className="stat-tile__label">
        {label} <span className="stat-tile__source">({source})</span>
      </p>
    </li>
  );
}
