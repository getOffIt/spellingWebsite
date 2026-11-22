import snapshots from './weeklyHomework.json';
import type { ChartSection } from './spellingChart';
import type { Word } from './words';

type WeeklySnapshot = {
  id: string;
  label: string;
  dates: string;
  year: number;
  description: string;
  groups: Array<ChartSection & { category: string }>;
};

export const [currentWeek, ...previousSnapshots] = snapshots as WeeklySnapshot[];

export const weeklyTitle = `Words of the Week — ${currentWeek.label} · ${currentWeek.dates}`;

export function snapshotWords(week: WeeklySnapshot): Word[] {
  const byText = new Map<string, Word>();
  for (const group of week.groups) {
    for (const text of group.words) {
      if (!byText.has(text)) byText.set(text, { text, year: 2, category: group.category });
    }
  }
  return [...byText.values()];
}
