import { useState } from 'react';
import {
  isWidthUp, makeStyles, MenuItem,
  Select,
  withWidth
} from '@material-ui/core';
import { BookmarkInfo } from './narouApi/useBookmarkInfo';
import { Breakpoint } from '@material-ui/core/styles/createBreakpoints';

// prevent text/icon color to white when darkMode (since this Select is on the AppBar)
const useStyles = makeStyles({
  root: {
    color: 'black',
  },
  icon: {
    fill: 'black',
  },
});

function BookmarkSelector({ bookmarks, bookmark, onChangeBookmark: setBookmark, width }: {
  bookmarks: BookmarkInfo | undefined;
  bookmark: number;
  onChangeBookmark: (newBookmark: number) => void;
  width: Breakpoint;
}) {
  const classes = useStyles();

  const [open, setOpen] = useState(false);
  const large = isWidthUp('sm', width);

  return (
    <Select
      classes={{ root: classes.root, icon: classes.icon }}
      disableUnderline={true}
      open={open} onOpen={() => setOpen(true)} onClose={() => setOpen(false)}
      value={bookmark} onChange={event => setBookmark(Number(event.target.value))}>
      <MenuItem key={0} value={0}>{open || large ? 'ブックマークなし' : 'BM-'}</MenuItem>
      {bookmarks && Object.keys(bookmarks).map(k => <MenuItem key={k} value={k}>{open || large ? bookmarks[Number(k)].name : `BM${bookmark}`}</MenuItem>)}
    </Select>
  );
}

export default withWidth()(BookmarkSelector);