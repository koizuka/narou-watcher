import { useEffect, useState } from 'react';
import { useHotKeys } from './useHotKeys';
import { NarouApi } from '../narouApi/NarouApi';
import { BookmarkInfo, useBookmarkInfo } from '../narouApi/useBookmarkInfo';

export function nextBookmark(bookmarks: BookmarkInfo, cur: number): number {
  const numbers = Object.keys(bookmarks).map(k => Number(k));
  for (const i of numbers) {
    if (i > cur) {
      return i;
    }
  }
  return 0;
}

export function prevBookmark(bookmarks: BookmarkInfo, cur: number): number {
  const numbers = [0, ...Object.keys(bookmarks).map(k => Number(k))];
  const i = numbers.findIndex(i => i >= cur);
  if (i > 0) {
    return numbers[i - 1];
  }
  return numbers[numbers.length - 1];
}

export function useBookmark(server: NarouApi): [number, (cur: number) => void, BookmarkInfo | undefined] {
  const [bookmark, setBookmark] = useState(0);
  const { data: bookmarks } = useBookmarkInfo(server, false);

  const [setHotKeys] = useHotKeys();

  useEffect(() => {
    if (bookmarks) {
      setHotKeys({
        'b': () => setBookmark(nextBookmark(bookmarks, bookmark)),
        'shift+B': () => setBookmark(prevBookmark(bookmarks, bookmark)),
      });
    } else {
      setHotKeys({});
    }
  }, [bookmark, bookmarks, setHotKeys]);

  return [bookmark, setBookmark, bookmarks];
}
