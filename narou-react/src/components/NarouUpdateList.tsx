import { Book, Info } from '@mui/icons-material';
import {
  Avatar,
  Backdrop,
  Badge, BadgeTypeMap, CircularProgress, IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton, ListItemSecondaryAction, ListItemText
} from '@mui/material';
import React, { useCallback, useEffect } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { useHotKeys } from '../hooks/useHotKeys';
import { IsNoticeListItem, itemSummary, nextLink, unread } from "../narouApi/IsNoticeListItem";

function badgeProps(item: IsNoticeListItem): BadgeTypeMap['props'] {
  if (item.latest < item.bookmark) {
    return { color: 'secondary', badgeContent: '!' };
  }
  return { color: 'primary', badgeContent: unread(item) };
}

export function NarouUpdateList({ items, selectedIndex, setSelectedIndex, selectDefault, onSecondaryAction }: {
  items: IsNoticeListItem[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  selectDefault: () => void;
  onSecondaryAction: (item: IsNoticeListItem) => void;
}) {
  const scrollIn = useCallback((node: HTMLLIElement | null) => {
    if (node) {
      scrollIntoView(node, { behavior: 'smooth', scrollMode: 'if-needed' });
      node.focus();
    }
  }, []);

  const [setHotKeys] = useHotKeys();

  useEffect(() => {
    if (items) {
      const len = items.length;
      const arrowUp = (event: KeyboardEvent) => {
        event.preventDefault();
        setSelectedIndex(selectedIndex - 1);
      };
      const arrowDown = (event: KeyboardEvent) => {
        event.preventDefault();
        setSelectedIndex(selectedIndex + 1);
      };

      setHotKeys({
        ...(selectedIndex > 0 && {
          'ArrowUp': arrowUp,
          'k': arrowUp,
        }),
        ...(selectedIndex < len - 1 && {
          'ArrowDown': arrowDown,
          'j': arrowDown,
        }),
        ...(len > 0 && {
          'Home': () => setSelectedIndex(0),
          'g': () => setSelectedIndex(0),
          'End': () => setSelectedIndex(len - 1),
          'shift+G': () => setSelectedIndex(len - 1),
          'Escape': () => selectDefault(),
          'i': () => onSecondaryAction(items[selectedIndex]),
        }),
      });
    } else {
      setHotKeys({});
    }
  }, [items, onSecondaryAction, selectDefault, selectedIndex, setHotKeys, setSelectedIndex]);

  const buttonProps = useCallback((item: IsNoticeListItem) => {
    if (unread(item) > 0) {
      return {
        component: 'a',
        href: nextLink(item),
        onClick: () => selectDefault(),
        target: '_blank',
        tabIndex: 0,
      };
    } else {
      return { disabled: true };
    }
  }, [selectDefault]);

  if (!items) {
    return <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>;
  }

  return (
    <List>
      {items?.map((item, index) => <ListItem key={item.base_url}
        {...(index === selectedIndex ? { selected: true, ref: scrollIn } : {})}
      >
        <ListItemButton
          disableRipple={true}
          onFocusVisible={() => setSelectedIndex(index)}
          {...buttonProps(item)}
          sx={{ paddingRight: "0px" }}
        >
          <ListItemAvatar>
            <Badge overlap="circular" {...badgeProps(item)}>
              <Avatar>
                <Book color={item.isR18 ? "secondary" : undefined} />
              </Avatar>
            </Badge>
          </ListItemAvatar>
          <ListItemText
            primary={itemSummary(item)}
            secondary={`${item.update_time.toFormat('yyyy/LL/dd HH:mm')} 更新  作者:${item.author_name}`} />
        </ListItemButton>
        <ListItemSecondaryAction>
          <IconButton
            edge="end"
            onClick={() => { onSecondaryAction(item); }}
            disableRipple={true}
            size="large"
            tabIndex={-1}>
            <Info />
          </IconButton>
        </ListItemSecondaryAction>
      </ListItem>)}
    </List >
  );
}
