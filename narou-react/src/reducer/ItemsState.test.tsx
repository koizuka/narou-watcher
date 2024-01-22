import { DateTime } from "luxon";
import { IsNoticeListItem } from "../narouApi/IsNoticeListItem";
import { ItemsState, itemsStateReducer, SelectCommand } from "./ItemsState";
import { describe, expect, test } from 'vitest';

describe('itemsStateReducer', () => {
  const dummyDateTime = DateTime.fromISO('2021-10-03T16:59:00+0900');
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
    };

    test('empty', () => {
      const items: IsNoticeListItem[] = [];
      expect(itemsStateReducer(prevState, { type: 'set', items })).toEqual<ItemsState>({
        items,
        numNewItems: 0,
        selectedIndex: -1,
        defaultIndex: -1,
      });
    })

    test('one read item', () => {
      const items: IsNoticeListItem[] = [{ ...dummyItem, bookmark: 1, latest: 1 }];
      expect(itemsStateReducer(prevState, { type: 'set', items })).toEqual<ItemsState>({
        items,
        numNewItems: 0,
        selectedIndex: -1,
        defaultIndex: -1,
      });
    })

    test('one unread item', () => {
      const items: IsNoticeListItem[] = [{ ...dummyItem, bookmark: 1, latest: 2 }];
      expect(itemsStateReducer(prevState, { type: 'set', items })).toEqual<ItemsState>({
        items,
        numNewItems: 1,
        selectedIndex: 0,
        defaultIndex: 0,
      });
    })

    test('sort: 未読は古い順、未読数が多いのは後ろ、既読はその後ろに新しい順', () => {
      const date1 = dummyDateTime.plus({ minutes: 1 });
      const date2 = dummyDateTime.plus({ minutes: 2 });
      const date3 = dummyDateTime.plus({ minutes: 3 });
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

      expect(itemsStateReducer(prevState, {
        type: 'set',
        items: [
          unread0date1, unread0date2, unread0date3,
          unread1date1, unread1date2, unread1date3,
          unread2url2, unread2url1,
          unreadMinus,
        ],
      })).toEqual<ItemsState>({
        items: [
          unread1date1, unread1date2, unread1date3,
          unread2url1, unread2url2,
          unreadMinus,
          unread0date3, unread0date2, unread0date1,
        ],
        numNewItems: 5,
        selectedIndex: 0,
        defaultIndex: 0,
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
});

