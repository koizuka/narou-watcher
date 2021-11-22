import { BookmarkInfo } from "../narouApi/useBookmarkInfo";
import { BookmarkState, bookmarkStateReducer, InitialBookmarkState } from "./BookmarkState";

describe('bookmarkStateReducer', () => {
  const bookmarks: BookmarkInfo = {
    1: { name: '1', num_items: 1 },
    3: { name: '3', num_items: 1 },
  };

  test('set', () => {
    const set = (prev: BookmarkState, bookmarks: BookmarkInfo | undefined): BookmarkState =>
      bookmarkStateReducer(prev, { type: 'set', bookmarks });

    expect(set(InitialBookmarkState, bookmarks)).toEqual({ bookmarks, selected: 0 });
    expect(set({ bookmarks, selected: 1 }, undefined)).toEqual({ bookmarks: undefined, selected: 0 });
    expect(set({ bookmarks, selected: 1 }, bookmarks)).toEqual({ bookmarks, selected: 0 });
  });

  test('select', () => {
    const select = (bookmarks: BookmarkInfo, selected: number): number =>
      bookmarkStateReducer({ bookmarks, selected: 0 }, { type: 'select', selected }).selected;

    expect(select(bookmarks, 0)).toBe(0);
    expect(select(bookmarks, 1)).toBe(1);
    expect(select(bookmarks, 2)).toBe(0);
    expect(select(bookmarks, 3)).toBe(3);
    expect(select(bookmarks, 4)).toBe(0);
    expect(select({}, 1)).toBe(0);
  });

  test('next', () => {
    const next = (bookmarks: BookmarkInfo, selected: number): number =>
      bookmarkStateReducer({ bookmarks, selected }, { type: 'next' }).selected;

    expect(next(bookmarks, 0)).toBe(1);
    expect(next(bookmarks, 1)).toBe(3);
    expect(next(bookmarks, 2)).toBe(3);
    expect(next(bookmarks, 3)).toBe(0);
    expect(next(bookmarks, 4)).toBe(0);
    expect(next({}, 0)).toBe(0);
  });

  test('prev', () => {
    const prev = (bookmarks: BookmarkInfo, selected: number): number =>
      bookmarkStateReducer({ bookmarks, selected }, { type: 'prev' }).selected;

    expect(prev(bookmarks, 0)).toBe(3);
    expect(prev(bookmarks, 1)).toBe(0);
    expect(prev(bookmarks, 2)).toBe(1);
    expect(prev(bookmarks, 3)).toBe(1);
    expect(prev(bookmarks, 4)).toBe(3);
    expect(prev({}, 0)).toBe(0);
  });
});
