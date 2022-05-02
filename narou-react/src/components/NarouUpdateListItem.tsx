import { Book, Info } from '@mui/icons-material';
import {
  Avatar, Badge, BadgeTypeMap, ButtonTypeMap, IconButton, ListItem,
  ListItemAvatar,
  ListItemButton, ListItemSecondaryAction, ListItemText
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { IsNoticeListItem, itemSummary, nextLink, unread } from "../narouApi/IsNoticeListItem";

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

  const ref = useRef<HTMLLIElement | null>(null);
  useEffect(() => {
    if (isSelected) {
      ref.current?.focus();
    } else {
      ref.current?.blur();
    }
  }, [isSelected]);

  const buttonProps = useMemo<ButtonTypeMap['props']>(() => {
    if (unread(item) > 0) {
      return {
        component: 'a',
        href: nextLink(item),
        onClick: () => selectDefault(),
        target: '_blank',
        tabIndex: 0,
        ref: ref,
      };
    } else {
      return { disabled: true };
    }
  }, [item, selectDefault]);

  const badgeProps = useMemo<BadgeTypeMap['props']>(() => {
    const numNewEpisodes = item.latest - item.bookmark;

    if (numNewEpisodes < 0) {
      return { color: 'secondary', badgeContent: '!' };
    }
    return { color: 'primary', badgeContent: numNewEpisodes };
  }, [item.bookmark, item.latest]);

  const onFocusVisible = useCallback(() => setSelectedIndex(index), [index, setSelectedIndex]);
  const onClick = useCallback(() => onSecondaryAction(item), [item, onSecondaryAction]);

  const [firstLine, secondLine] = useMemo(() => [
    itemSummary(item),
    `${item.update_time.toFormat('yyyy/LL/dd HH:mm')} 更新  作者:${item.author_name}`,
  ], [item]);

  return (
    <ListItem
      {...(isSelected ? { selected: true, ref: scrollIn } : {})}
    >
      <ListItemButton
        disableRipple={true}
        onFocusVisible={onFocusVisible}
        {...buttonProps}
        disableGutters
      >
        <ListItemAvatar>
          <Badge overlap="circular" {...badgeProps}>
            <Avatar>
              <Book color={item.isR18 ? "secondary" : undefined} />
            </Avatar>
          </Badge>
        </ListItemAvatar>
        <ListItemText primary={firstLine} secondary={secondLine} />
      </ListItemButton>
      <ListItemSecondaryAction>
        <IconButton
          edge="end"
          onClick={onClick}
          disableRipple={true}
          size="large"
          tabIndex={-1}>
          <Info />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
}
