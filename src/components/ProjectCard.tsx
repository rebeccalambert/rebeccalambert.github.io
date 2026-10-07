import type { ReactNode } from 'react';
import type { Project } from '../data/content';

export default function ProjectCard({ project, visual }: { project: Project; visual?: ReactNode }) {
  const { name, description, stack, repoUrl, demoUrl, demoDisabledReason, screenshot, note } = project;

  return (
    <article className="project-card">
      <div className="project-card__visual">
        {visual}
        {!visual && screenshot && <img src={screenshot.src} alt={screenshot.alt} loading="lazy" />}
      </div>
      <div className="project-card__body">
        <h3>{name}</h3>
        <p>{description}</p>
        <p className="project-card__stack">{stack}</p>
        {note && <p className="project-card__note">{note}</p>}
        <ul className="project-card__actions">
          <li>
            <a href={repoUrl} target="_blank" rel="noreferrer">
              Code
            </a>
          </li>
          {demoUrl && (
            <li>
              <a href={demoUrl} target="_blank" rel="noreferrer" className="project-card__demo">
                Demo
              </a>
            </li>
          )}
          {!demoUrl && demoDisabledReason && (
            <li>
              <span className="project-card__demo project-card__demo--disabled" title={demoDisabledReason}>
                {demoDisabledReason}
              </span>
            </li>
          )}
        </ul>
      </div>
    </article>
  );
}
