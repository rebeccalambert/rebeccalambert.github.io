import { customerStories, projects, stats, timeline, type CustomerStory, type Project } from '../data/content';

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

/** How many of the newest items start unread — enough to make the badge and dots meaningful. */
const UNREAD_COUNT = 5;

// Feed items reuse the classic copy verbatim; only the first sentence is shown
// in the feed, with the full text coming back in the detail view.
function firstSentence(text: string): string {
  const end = text.indexOf('. ');
  return end === -1 ? text : text.slice(0, end + 1);
}

/** Builds the Play mode feed from content.ts — same facts as the classic view, newest first. */
export function buildNotifications(): PlayNotification[] {
  const items: Omit<PlayNotification, 'unread'>[] = [
    ...projects.map((project) => ({
      id: `projects-${project.name}`,
      category: 'projects' as const,
      title: project.name,
      body: firstSentence(project.description),
      meta: `Project · ${project.stack}`,
      detail: { kind: 'project' as const, project },
    })),
    ...stats.map((stat) => ({
      id: `impact-${stat.label}`,
      category: 'impact' as const,
      title: stat.value,
      body: stat.label,
      meta: `Impact · ${stat.source}`,
    })),
    ...customerStories.map((story) => ({
      id: `work-${story.heading}`,
      category: 'work' as const,
      title: story.heading,
      body: firstSentence(story.body),
      meta: `How I work · ${story.source}`,
      detail: { kind: 'story' as const, story },
    })),
    ...[...timeline].reverse().map((entry) => ({
      id: `career-${entry.period}`,
      category: 'career' as const,
      title: entry.label,
      body: '',
      meta: `Career · ${entry.period}`,
    })),
  ];

  return items.map((item, index) => ({ ...item, unread: index < UNREAD_COUNT }));
}
