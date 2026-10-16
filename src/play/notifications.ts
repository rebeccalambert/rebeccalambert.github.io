import { projects, timeline, type CustomerStory, type Project, type Stat, type TimelineEntry } from '../data/content';
import { linksFor } from './careerLinks';

export type NotificationCategory = 'projects' | 'impact' | 'work' | 'career';

export interface PlayNotification {
  id: string;
  category: NotificationCategory;
  /** Bold lead-in, e.g. "ClauseCheck" or "99.95%+". */
  title: string;
  /** Rest of the sentence after the title; may be empty. */
  body: string;
  /** Small grey line under the text, e.g. "Impact · LinkedIn". */
  meta: string;
  /** Overrides the category icon, e.g. 🎓 for school entries in Career. */
  icon?: string;
  unread: boolean;
  /** Full content shown when the row is expanded. Only set when it adds something the row doesn't already show. */
  detail?: NotificationDetail;
}

interface ProjectDetail {
  kind: 'project';
  project: Project;
}

interface StoryDetail {
  kind: 'story';
  story: CustomerStory;
}

// A union needs `type`; each member is an interface.
export type NotificationDetail = ProjectDetail | StoryDetail;

export const CATEGORY_ICONS: Record<NotificationCategory, string> = {
  projects: '🚀',
  impact: '📈',
  work: '🤝',
  career: '💼',
};

// IDs end up in `id` and `aria-controls`, which can't contain spaces
// (aria-controls is a space-separated list), so reduce titles to a slug.
function slug(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

// Feed items reuse the classic copy verbatim; only the first sentence is shown
// in the feed, with the full text coming back in the detail view.
function firstSentence(text: string): string {
  const end = text.indexOf('. ');
  return end === -1 ? text : text.slice(0, end + 1);
}

type FeedItem = Omit<PlayNotification, 'unread'>;

const projectItem = (project: Project): FeedItem => ({
  id: `projects-${slug(project.name)}`,
  category: 'projects',
  title: project.name,
  body: firstSentence(project.description),
  meta: `Project · ${project.stack}`,
  detail: { kind: 'project', project },
});

const statItem = (stat: Stat): FeedItem => ({
  id: `impact-${slug(stat.label)}`,
  category: 'impact',
  title: stat.value,
  body: stat.label,
  meta: `Impact · ${stat.source}`,
});

const storyItem = (story: CustomerStory): FeedItem => ({
  id: `work-${slug(story.heading)}`,
  category: 'work',
  title: story.heading,
  body: firstSentence(story.body),
  meta: `How I work · ${story.source}`,
  detail: { kind: 'story', story },
});

const careerItem = (entry: TimelineEntry): FeedItem => ({
  id: `career-${slug(entry.period)}`,
  category: 'career',
  title: entry.label,
  body: '',
  meta: `Career · ${entry.period}`,
  icon: entry.education ? '🎓' : undefined,
});

/**
 * Builds the Play mode feed from content.ts — same facts as the classic view,
 * newest first like a real notification feed. It's assembled oldest to newest
 * (each career stop, then the impact, stories, and projects tied to it — same
 * matching as the Career view — then projects not tied to a job) and then
 * reversed, so each job sits below the work that came out of it.
 */
export function buildNotifications(): PlayNotification[] {
  const items: FeedItem[] = [];
  const placed = new Set<Project>();

  for (const entry of timeline) {
    const links = linksFor(entry);
    items.push(careerItem(entry), ...links.stats.map(statItem), ...links.stories.map(storyItem));
    for (const project of links.projects) {
      items.push(projectItem(project));
      placed.add(project);
    }
  }
  // content.ts lists projects newest first; the feed runs oldest first.
  const unplaced = projects.filter((project) => !placed.has(project)).reverse();
  items.push(...unplaced.map(projectItem));

  // Every row that opens starts unread, and only those: opening is how a row
  // gets read, so every dot can be cleared by mouse or keyboard.
  return items.reverse().map((item) => ({ ...item, unread: item.detail !== undefined }));
}
