import { BookmarkInfo } from "../narouApi/useBookmarkInfo";

export interface BookmarkState {
  bookmarks: BookmarkInfo | undefined;
  selected: number;
}

export const InitialBookmarkState: BookmarkState = {
  bookmarks: undefined,
  selected: 0,
};

function nextBookmark(bookmarks: BookmarkInfo, cur: number): number {
  const numbers = Object.keys(bookmarks).map(k => Number(k));
  for (const i of numbers) {
    if (i > cur) {
      return i;
    }
  }
  return 0;
}

function prevBookmark(bookmarks: BookmarkInfo, cur: number): number {
  const numbers = [0, ...Object.keys(bookmarks).map(k => Number(k))];
  const i = numbers.findIndex(i => i >= cur);
  if (i > 0) {
    return numbers[i - 1];
  }
  return numbers[numbers.length - 1];
}

export type BookmarkStateAction =
  | { type: 'set', bookmarks: BookmarkInfo | undefined }
  | { type: 'select', selected: number }
  | { type: 'next' }
  | { type: 'prev' }

export function bookmarkStateReducer(state: BookmarkState, action: BookmarkStateAction): BookmarkState {
  switch (action.type) {
    case 'set':
      return {
        ...state,
        bookmarks: action.bookmarks,
        selected: 0,
      };

    case 'select':
      if (state.bookmarks && action.selected.toString() in state.bookmarks) {
        return {
          ...state,
          selected: action.selected,
        };
      } else {
        return {
          ...state,
          selected: 0,
        };
      }

    case 'next':
      return {
        ...state,
        selected: state.bookmarks ? nextBookmark(state.bookmarks, state.selected) : 0,
      };

    case 'prev':
      return {
        ...state,
        selected: state.bookmarks ? prevBookmark(state.bookmarks, state.selected) : 0,
      };
  }
}
