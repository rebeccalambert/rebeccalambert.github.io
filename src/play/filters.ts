import type { NotificationCategory } from './notifications';

export type FeedFilter = 'all' | NotificationCategory;

export const FILTERS: { value: FeedFilter; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'projects', label: 'Projects' },
  { value: 'impact', label: 'Impact' },
  { value: 'work', label: 'How I work' },
  { value: 'career', label: 'Career' },
];

export function filterLabel(filter: FeedFilter): string {
  return FILTERS.find((f) => f.value === filter)?.label ?? '';
}
