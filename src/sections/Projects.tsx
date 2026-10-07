import EvalTable from '../components/EvalTable';
import ProjectCard from '../components/ProjectCard';
import { clauseCheckEvalResults, projects } from '../data/content';

export default function Projects() {
  return (
    <section className="projects" aria-labelledby="projects-heading">
      <h2 id="projects-heading">Projects</h2>
      <div className="projects__list">
        {projects.map((project) => (
          <ProjectCard
            key={project.name}
            project={project}
            visual={
              project.name === 'ClauseCheck' ? (
                <EvalTable rows={clauseCheckEvalResults} caption="ClauseCheck eval results" />
              ) : undefined
            }
          />
        ))}
      </div>
    </section>
  );
}
