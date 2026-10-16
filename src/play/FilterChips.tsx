import { FILTERS, type FeedFilter } from './filters';

export default function FilterChips({
  active,
  onChange,
}: {
  active: FeedFilter;
  onChange: (filter: FeedFilter) => void;
}) {
  return (
    <div className="chips" role="group" aria-label="Filter notifications">
      {FILTERS.map(({ value, label }) => (
        <button
          key={value}
          type="button"
          className="chip is-interactive"
          aria-pressed={active === value}
          onClick={() => onChange(value)}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
