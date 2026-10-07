import { customerStories } from '../data/content';

export default function CustomerWork() {
  return (
    <section className="customer-work" aria-labelledby="customer-work-heading">
      <h2 id="customer-work-heading">How I work with customers and stakeholders</h2>
      <p className="customer-work__intro">
        I've been the engineer in the room with customers, and in the planning meetings where frontend and
        backend agree on a contract.
      </p>
      <ul className="customer-work__list">
        {customerStories.map((story) => (
          <li key={story.heading}>
            <h3>
              {story.heading} <span className="customer-work__source">({story.source})</span>
            </h3>
            <p>{story.body}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
