import { DateTime } from 'luxon';

export type IsNoticeListItem = {
  base_url: string;
  update_time: DateTime;
  bookmark: number;
  latest: number;
  title: string;
  author_name: string;
  completed?: boolean;
  isR18: boolean;
};

export function hasUnread(item: IsNoticeListItem): boolean {
  return item.latest > item.bookmark;
}

export function nextLink(item: IsNoticeListItem): string {
  if (hasUnread(item)) {
    return `${item.base_url}${item.bookmark + 1}/`;
  }
  return `${item.base_url}${item.latest}/`;
}

export function itemSummary(item: IsNoticeListItem): string {
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

export function unread(item: IsNoticeListItem): number {
  return Math.max(item.latest - item.bookmark, 0);
}
