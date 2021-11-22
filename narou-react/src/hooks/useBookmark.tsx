import { useEffect, useReducer } from 'react';
import { NarouApi } from '../narouApi/NarouApi';
import { BookmarkInfo, useBookmarkInfo } from '../narouApi/useBookmarkInfo';
import { bookmarkStateReducer, InitialBookmarkState } from '../reducer/BookmarkState';
import { useHotKeys } from './useHotKeys';

export function useBookmark(server: NarouApi): [number, (cur: number) => void, BookmarkInfo | undefined] {
  const [{ bookmarks, selected }, dispatch] = useReducer(bookmarkStateReducer, InitialBookmarkState);

  const { data } = useBookmarkInfo(server, false);
  useEffect(() => dispatch({ type: 'set', bookmarks: data }), [data]);

  const [setHotKeys] = useHotKeys();

  useEffect(() => {
    if (bookmarks) {
      setHotKeys({
        'b': () => dispatch({ type: 'next' }),
        'shift+B': () => dispatch({ type: 'prev' }),
      });
    } else {
      setHotKeys({});
    }
  }, [bookmarks, setHotKeys]);

  return [
    selected,
    (selected: number) => dispatch({ type: 'select', selected }),
    bookmarks,
  ];
}
