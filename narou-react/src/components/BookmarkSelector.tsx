import { MenuItem, Select, useMediaQuery } from '@mui/material';
import { Breakpoint, useTheme } from '@mui/material/styles';
import React, { useState } from 'react';
import { BookmarkInfo } from '../narouApi/useBookmarkInfo';

function useIsWidthUp(breakpoint: Breakpoint) {
  const theme = useTheme();
  return useMediaQuery(theme.breakpoints.up(breakpoint));
}

export const BookmarkSelector = React.memo(BookmarkSelectorRaw);
function BookmarkSelectorRaw({ bookmarks, bookmark, onChangeBookmark: setBookmark }: {
  bookmarks: BookmarkInfo | undefined;
  bookmark: number;
  onChangeBookmark: (newBookmark: number) => void;
}) {
  const [open, setOpen] = useState(false);
  const large = useIsWidthUp('sm');

  return (
    <Select
      disableUnderline={true}
      variant="standard"
      open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)}
      value={bookmark} onChange={event => setBookmark(Number(event.target.value))}>
      <MenuItem key={0} value={0}>{open || large ? 'ブックマークなし' : 'BM-'}</MenuItem>
      {bookmarks && Object.keys(bookmarks).map(k => <MenuItem key={k} value={k}>{open || large ? bookmarks[Number(k)].name : `BM${bookmark}`}</MenuItem>)}
    </Select>
  );
}