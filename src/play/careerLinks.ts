import {
  customerStories,
  projects,
  stats,
  type CustomerStory,
  type Project,
  type Stat,
  type TimelineEntry,
} from '../data/content';

export interface CareerLinks {
  stats: Stat[];
  stories: CustomerStory[];
  projects: Project[];
}

/**
 * Existing content that belongs to a career stop, matched by name — no new
 * copy. "LinkedIn" pulls the LinkedIn stats and story; "ClauseCheck" pulls the
 * project; "App Academy" pulls RainFlix, whose description names it.
 */
export function linksFor(entry: TimelineEntry): CareerLinks {
  const name = entry.label;
  return {
    stats: stats.filter((stat) => stat.source === name),
    stories: customerStories.filter((story) => story.source === name),
    projects: projects.filter((project) => project.name === name || project.description.includes(name)),
  };
}
