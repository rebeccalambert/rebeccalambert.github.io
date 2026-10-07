import StatTile from '../components/StatTile';
import Timeline from '../components/Timeline';
import { stats, timeline } from '../data/content';

export default function Impact() {
  return (
    <section className="impact" aria-labelledby="impact-heading">
      <h2 id="impact-heading">Impact</h2>
      <ul className="impact__stats">
        {stats.map((stat) => (
          <StatTile key={stat.label} {...stat} />
        ))}
      </ul>
      <h3 className="impact__timeline-heading">Career timeline</h3>
      <Timeline entries={timeline} />
    </section>
  );
}
