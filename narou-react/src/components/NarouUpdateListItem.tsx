import { Book, Info } from '@mui/icons-material';
import {
  Avatar, Badge, BadgeTypeMap, IconButton, ListItem,
  ListItemAvatar,
  ListItemButton, ListItemSecondaryAction, ListItemText
} from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { IsNoticeListItem, itemSummary, nextLink, unread } from "../narouApi/IsNoticeListItem";

function badgeProps(item: IsNoticeListItem): BadgeTypeMap['props'] {
  if (item.latest < item.bookmark) {
    return { color: 'secondary', badgeContent: '!' };
  }
  return { color: 'primary', badgeContent: unread(item) };
}

export const NarouUpdateListItem = React.memo(NarouUpdateListItemRaw);
function NarouUpdateListItemRaw({ item, index, isSelected, setSelectedIndex, onSecondaryAction, selectDefault }: {
  item: IsNoticeListItem;
  index: number;
  isSelected: boolean;
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

  const buttonProps = useMemo(() => {
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
  }, [item, selectDefault]);

  return (
    <ListItem
      {...(isSelected ? { selected: true, ref: scrollIn } : {})}
    >
      <ListItemButton
        disableRipple={true}
        onFocusVisible={() => setSelectedIndex(index)}
        {...buttonProps}
        disableGutters
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
    </ListItem>
  );
}
