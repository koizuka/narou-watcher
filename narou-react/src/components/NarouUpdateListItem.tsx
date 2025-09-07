import { Book, Info } from '@mui/icons-material';
import {
  Avatar, Badge, BadgeTypeMap, ButtonTypeMap, IconButton, ListItem,
  ListItemAvatar,
  ListItemButton, ListItemText
} from '@mui/material';
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import scrollIntoView from 'scroll-into-view-if-needed';
import { IsNoticeListItem, itemSummary, nextLink, unread } from "../narouApi/IsNoticeListItem";

export const BEWARE_TIME = 3 * 60 * 1000;

export const NarouUpdateListItem = React.memo(NarouUpdateListItemRaw);
function NarouUpdateListItemRaw({ item, index, isSelected, setSelectedIndex, onSecondaryAction, onWaitingAction, selectDefault, 'data-testid': testId }: {
  item: IsNoticeListItem;
  index: number;
  isSelected: boolean;
  setSelectedIndex: (index: number) => void;
  selectDefault: () => void;
  onSecondaryAction: (item: IsNoticeListItem) => void;
  onWaitingAction?: (item: IsNoticeListItem) => void;
  'data-testid'?: string;
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

  const [bewareTooNew, setBewareTooNew] = useState(false);
  useEffect(() => {
    const past = -item.update_time.diffNow('milliseconds').milliseconds;
    if (past < BEWARE_TIME) {
      setBewareTooNew(true);
      const handle = setTimeout(() => {
        setBewareTooNew(false);
      }, BEWARE_TIME - past);
      return () => {
        clearTimeout(handle);
      }
    } else {
      setBewareTooNew(false);
    }
  }, [bewareTooNew, item.update_time]);

  const buttonProps = useMemo<ButtonTypeMap['props']>(() => {
    if (unread(item) > 0) {
      if (bewareTooNew && onWaitingAction) {
        // For recent updates, use waiting action instead of direct link
        return {
          onClick: () => {
            selectDefault();
            onWaitingAction(item);
          },
          tabIndex: 0,
          ref: ref,
        };
      } else {
        // Normal behavior: direct link
        return {
          component: 'a',
          href: nextLink(item),
          onClick: () => { selectDefault(); },
          target: '_blank',
          tabIndex: 0,
          ref: ref,
        };
      }
    } else {
      return { disabled: true };
    }
  }, [item, selectDefault, bewareTooNew, onWaitingAction]);

  const badgeProps = useMemo<BadgeTypeMap['props']>(() => {
    const numNewEpisodes = item.latest - item.bookmark;

    if (numNewEpisodes < 0) {
      return { color: 'secondary', badgeContent: '!' };
    }
    return { color: 'primary', badgeContent: numNewEpisodes };
  }, [item.bookmark, item.latest]);

  const onFocusVisible = useCallback(() => { setSelectedIndex(index); }, [index, setSelectedIndex]);
  const onClick = useCallback(() => { onSecondaryAction(item); }, [item, onSecondaryAction]);

  const [firstLine, secondLine] = useMemo(() => [
    itemSummary(item),
    `${item.update_time.toFormat('yyyy/LL/dd HH:mm')}${bewareTooNew ? '(注意)' : ''} 更新  作者:${item.author_name}${item.memo ? `  メモ:${item.memo}` : ''}`,
  ], [bewareTooNew, item]);

  return (
    <ListItem data-testid={testId}
      secondaryAction={
        <IconButton
          edge="end"
          onClick={onClick}
          disableRipple={true}
          size="large"
          tabIndex={-1}>
          <Info />
        </IconButton>
      }
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
    </ListItem>
  );
}
