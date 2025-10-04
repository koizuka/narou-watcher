import { addMinutes, parseISO } from "date-fns";
import { IsNoticeListItem } from "../narouApi/IsNoticeListItem";
import { ItemsState, itemsStateReducer, SelectCommand } from "./ItemsState";
import { describe, expect, test } from 'vitest';

describe('itemsStateReducer', () => {
  const dummyDateTime = parseISO('2021-10-03T16:59:00+09:00');
  const dummyItem: Omit<IsNoticeListItem, 'bookmark' | 'latest'> = {
    update_time: dummyDateTime,
    base_url: 'base_url',
    title: 'title',
    author_name: 'author',
    isR18: false,
  };

  describe('set', () => {
    const prevState: ItemsState = {
      numNewItems: null,
      selectedIndex: -1,
      defaultIndex: -1,
      clearedBewareItems: new Map(),
    };

    test('empty', () => {
      const items: IsNoticeListItem[] = [];
      expect(itemsStateReducer(prevState, { type: 'set', items })).toEqual<ItemsState>({
        items,
        numNewItems: 0,
        selectedIndex: -1,
        defaultIndex: -1,
        clearedBewareItems: new Map(),
      });
    })

    test('one read item', () => {
      const items: IsNoticeListItem[] = [{ ...dummyItem, bookmark: 1, latest: 1 }];
      const result = itemsStateReducer(prevState, { type: 'set', items });
      expect(result).toEqual<ItemsState>({
        items: [{ ...items[0], bewareNew: false }],
        numNewItems: 0,
        selectedIndex: -1,
        defaultIndex: -1,
        clearedBewareItems: new Map(),
      });
    })

    test('one unread item', () => {
      const items: IsNoticeListItem[] = [{ ...dummyItem, bookmark: 1, latest: 2 }];
      const result = itemsStateReducer(prevState, { type: 'set', items });
      expect(result).toEqual<ItemsState>({
        items: [{ ...items[0], bewareNew: false }],
        numNewItems: 1,
        selectedIndex: 0,
        defaultIndex: 0,
        clearedBewareItems: new Map(),
      });
    })

    test('sort: 未読は古い順、未読数が多いのは後ろ、既読はその後ろに新しい順', () => {
      const date1 = addMinutes(dummyDateTime, 1);
      const date2 = addMinutes(dummyDateTime, 2);
      const date3 = addMinutes(dummyDateTime, 3);
      const unread0 = { ...dummyItem, bookmark: 1, latest: 1 };
      const unread1 = { ...dummyItem, bookmark: 1, latest: 2 };
      const unread2 = { ...dummyItem, bookmark: 1, latest: 3, update_time: date1 };
      const unreadMinus = { ...dummyItem, bookmark: 2, latest: 1 };

      const unread0date1 = { ...unread0, update_time: date1 };
      const unread0date2 = { ...unread0, update_time: date2 };
      const unread0date3 = { ...unread0, update_time: date3 };
      const unread1date1 = { ...unread1, update_time: date1 };
      const unread1date2 = { ...unread1, update_time: date2 };
      const unread1date3 = { ...unread1, update_time: date3 };
      const unread2url1 = { ...unread2, base_url: '1' };
      const unread2url2 = { ...unread2, base_url: '2' };

      const result = itemsStateReducer(prevState, {
        type: 'set',
        items: [
          unread0date1, unread0date2, unread0date3,
          unread1date1, unread1date2, unread1date3,
          unread2url2, unread2url1,
          unreadMinus,
        ],
      });
      expect(result).toEqual<ItemsState>({
        items: [
          { ...unread1date1, bewareNew: false },
          { ...unread1date2, bewareNew: false },
          { ...unread1date3, bewareNew: false },
          { ...unread2url1, bewareNew: false },
          { ...unread2url2, bewareNew: false },
          { ...unreadMinus, bewareNew: false },
          { ...unread0date3, bewareNew: false },
          { ...unread0date2, bewareNew: false },
          { ...unread0date1, bewareNew: false },
        ],
        numNewItems: 5,
        selectedIndex: 0,
        defaultIndex: 0,
        clearedBewareItems: new Map(),
      });
    })
  })

  describe('select', () => {
    const prevState: ItemsState = {
      items: [
        { ...dummyItem, bookmark: 1, latest: 2 },
        { ...dummyItem, bookmark: 2, latest: 2 },
      ],
      numNewItems: 1,
      selectedIndex: -1,
      defaultIndex: -1,
      clearedBewareItems: new Map(),
    };

    test.each<[number, number]>([
      [-2, -1],
      [-1, -1],
      [0, 0],
      [1, 1],
      [2, 1],
    ])('%d -> %d', (index, expected) => {
      expect(itemsStateReducer(prevState, { type: 'select', index }).selectedIndex).toBe(expected);
    });
  })

  describe('select-command', () => {
    const prevState: ItemsState = {
      items: [
        { ...dummyItem, bookmark: 1, latest: 2 },
        { ...dummyItem, bookmark: 2, latest: 2 },
      ],
      numNewItems: 1,
      selectedIndex: -1,
      defaultIndex: -1,
      clearedBewareItems: new Map(),
    };

    test.each<[SelectCommand, number, number]>([
      ['up', 1, 0],
      ['up', 0, 0],
      ['down', 0, 1],
      ['down', 1, 1],
      ['home', 0, 0],
      ['home', 1, 0],
      ['end', 0, 1],
      ['end', 1, 1],
      ['default', 0, -1],
      ['default', 1, -1],
    ])('%s %d -> %d', (command, selectedIndex, expected) => {
      expect(itemsStateReducer(
        { ...prevState, selectedIndex },
        { type: 'select-command', command }).selectedIndex
      ).toBe(expected);
    });
  })

  describe('clear-beware', () => {
    test('clears bewareNew flag for matching item', () => {
      const prevState: ItemsState = {
        items: [
          { ...dummyItem, base_url: 'url1', bookmark: 0, latest: 1, bewareNew: true },
          { ...dummyItem, base_url: 'url2', bookmark: 0, latest: 1, bewareNew: true },
          { ...dummyItem, base_url: 'url3', bookmark: 0, latest: 1, bewareNew: false },
        ],
        numNewItems: 0,
        selectedIndex: -1,
        defaultIndex: -1,
        clearedBewareItems: new Map(),
      };

      const result = itemsStateReducer(prevState, { type: 'clear-beware', baseUrl: 'url1' });

      expect(result.items?.[0].bewareNew).toBe(false);
      expect(result.items?.[1].bewareNew).toBe(true);
      expect(result.items?.[2].bewareNew).toBe(false);
      expect(result.clearedBewareItems.has('url1')).toBe(true);
    });

    test('does not update state when bewareNew is already false', () => {
      const prevState: ItemsState = {
        items: [
          { ...dummyItem, base_url: 'url1', bookmark: 0, latest: 1, bewareNew: false },
        ],
        numNewItems: 0,
        selectedIndex: -1,
        defaultIndex: -1,
        clearedBewareItems: new Map(),
      };

      const result = itemsStateReducer(prevState, { type: 'clear-beware', baseUrl: 'url1' });

      // Should return same state reference (no change)
      expect(result).toBe(prevState);
    });

    test('does not update state when item not found', () => {
      const prevState: ItemsState = {
        items: [
          { ...dummyItem, base_url: 'url1', bookmark: 0, latest: 1, bewareNew: true },
        ],
        numNewItems: 0,
        selectedIndex: -1,
        defaultIndex: -1,
        clearedBewareItems: new Map(),
      };

      const result = itemsStateReducer(prevState, { type: 'clear-beware', baseUrl: 'url2' });

      // Should return same state reference (no change)
      expect(result).toBe(prevState);
    });
  });

  describe('refresh-beware', () => {
    test('updates bewareNew based on current time', () => {
      const now = Date.now();
      const recentTime = new Date(now - 1000); // 1 second ago
      const oldTime = new Date(now - 4 * 60 * 1000); // 4 minutes ago

      const prevState: ItemsState = {
        items: [
          { ...dummyItem, base_url: 'url1', bookmark: 0, latest: 1, update_time: recentTime, bewareNew: true },
          { ...dummyItem, base_url: 'url2', bookmark: 0, latest: 1, update_time: oldTime, bewareNew: true },
        ],
        numNewItems: 0,
        selectedIndex: -1,
        defaultIndex: -1,
        clearedBewareItems: new Map(),
      };

      const result = itemsStateReducer(prevState, { type: 'refresh-beware' });

      expect(result.items?.[0].bewareNew).toBe(true);  // Still within BEWARE_TIME
      expect(result.items?.[1].bewareNew).toBe(false); // Beyond BEWARE_TIME
    });

    test('does not update state when no changes', () => {
      const now = Date.now();
      const recentTime = new Date(now - 1000); // 1 second ago

      const prevState: ItemsState = {
        items: [
          { ...dummyItem, base_url: 'url1', bookmark: 0, latest: 1, update_time: recentTime, bewareNew: true },
        ],
        numNewItems: 0,
        selectedIndex: -1,
        defaultIndex: -1,
        clearedBewareItems: new Map(),
      };

      const result = itemsStateReducer(prevState, { type: 'refresh-beware' });

      // Should return same state reference (no change)
      expect(result).toBe(prevState);
    });

    test('updates state when bewareNew changes', () => {
      const now = Date.now();
      const oldTime = new Date(now - 4 * 60 * 1000); // 4 minutes ago

      const prevState: ItemsState = {
        items: [
          { ...dummyItem, base_url: 'url1', bookmark: 0, latest: 1, update_time: oldTime, bewareNew: true },
        ],
        numNewItems: 0,
        selectedIndex: -1,
        defaultIndex: -1,
        clearedBewareItems: new Map(),
      };

      const result = itemsStateReducer(prevState, { type: 'refresh-beware' });

      // Should return new state reference (changed)
      expect(result).not.toBe(prevState);
      expect(result.items?.[0].bewareNew).toBe(false);
    });

    test('keeps cleared items as false', () => {
      const now = Date.now();
      const recentTime = new Date(now - 1000); // 1 second ago (still within BEWARE_TIME)

      const clearedBewareItems = new Map<string, number>();
      clearedBewareItems.set('url1', now - 500); // Cleared 500ms ago

      const prevState: ItemsState = {
        items: [
          { ...dummyItem, base_url: 'url1', bookmark: 0, latest: 1, update_time: recentTime, bewareNew: false },
        ],
        numNewItems: 0,
        selectedIndex: -1,
        defaultIndex: -1,
        clearedBewareItems,
      };

      const result = itemsStateReducer(prevState, { type: 'refresh-beware' });

      // Should keep bewareNew=false even though timestamp is recent
      expect(result.items?.[0].bewareNew).toBe(false);
    });

    test('removes expired cleared records', () => {
      const now = Date.now();
      const recentTime = new Date(now - 1000); // 1 second ago

      const clearedBewareItems = new Map<string, number>();
      clearedBewareItems.set('url1', now - 4 * 60 * 1000); // Cleared 4 minutes ago (expired)

      const prevState: ItemsState = {
        items: [
          { ...dummyItem, base_url: 'url1', bookmark: 0, latest: 1, update_time: recentTime, bewareNew: false },
        ],
        numNewItems: 0,
        selectedIndex: -1,
        defaultIndex: -1,
        clearedBewareItems,
      };

      const result = itemsStateReducer(prevState, { type: 'refresh-beware' });

      // Should remove expired cleared record
      expect(result.clearedBewareItems.has('url1')).toBe(false);
      // Should recalculate bewareNew from timestamp
      expect(result.items?.[0].bewareNew).toBe(true);
    });
  });
});

