import { DateTime } from 'luxon';

export type IsNoticeListItem = {
  base_url: string;
  update_time: DateTime;
  bookmark: number;
  latest: number;
  title: string;
  author_name: string;
  completed?: boolean;
  memo?: string;
  isR18: boolean;
};

export function hasUnread(item: Pick<IsNoticeListItem, 'latest' | 'bookmark'>): boolean {
  return item.latest > item.bookmark;
}

export function nextLink(item: Pick<IsNoticeListItem, 'latest' | 'bookmark' | 'base_url'>): string {
  if (hasUnread(item)) {
    return `${item.base_url}${item.bookmark + 1}/`;
  }
  return `${item.base_url}${item.latest}/`;
}

export function itemSummary(item: Pick<IsNoticeListItem, 'title' | 'bookmark' | 'latest' | 'completed'>): string {
  const fields = [item.title, ' ('];
  if (hasUnread(item)) {
    fields.push(`${item.bookmark}/`);
  }
  fields.push(`${item.latest})`);
  if (item.completed) {
    fields.push('[完結]');
  }
  return fields.join('');
}

export function unread(item: Pick<IsNoticeListItem, 'latest' | 'bookmark'>): number {
  return Math.max(item.latest - item.bookmark, 0);
}
