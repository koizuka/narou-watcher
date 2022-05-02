import { Backdrop, CircularProgress, List } from '@mui/material';
import React, { useMemo } from 'react';
import { HotKeys, useHotKeys } from '../hooks/useHotKeys';
import { IsNoticeListItem } from "../narouApi/IsNoticeListItem";
import { NarouUpdateListItem } from './NarouUpdateListItem';

export function NarouUpdateList({ items, selectedIndex, setSelectedIndex, selectDefault, onSecondaryAction }: {
  items: IsNoticeListItem[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  selectDefault: () => void;
  onSecondaryAction: (item: IsNoticeListItem) => void;
}) {
  useHotKeys(useMemo((): HotKeys => {
    if (items) {
      const len = items.length;
      const guard = (f: (event: KeyboardEvent) => void) => (event: KeyboardEvent) => {
        const ignoreClasses = [
          'MuiDialog-container',
          'MuiInputBase-input',
          'MuiMenuItem-root',
        ];
        const classList = (event.target as HTMLElement).classList;
        if (ignoreClasses.some(c => classList.contains(c))) {
          return;
        }
        f(event);
      };

      const arrowUp = (event: KeyboardEvent) => {
        event.preventDefault();
        setSelectedIndex(selectedIndex - 1);
      };
      const arrowDown = (event: KeyboardEvent) => {
        event.preventDefault();
        setSelectedIndex(selectedIndex + 1);
      };

      return {
        ...(selectedIndex > 0 && {
          'ArrowUp': guard(arrowUp),
          'k': guard(arrowUp),
        }),
        ...(selectedIndex < len - 1 && {
          'ArrowDown': guard(arrowDown),
          'j': guard(arrowDown),
        }),
        ...(len > 0 && {
          'Home': guard(() => setSelectedIndex(0)),
          'g': guard(() => setSelectedIndex(0)),
          'End': guard(() => setSelectedIndex(len - 1)),
          'shift+G': guard(() => setSelectedIndex(len - 1)),
          'Escape': guard(() => selectDefault()),
          'i': guard(() => onSecondaryAction(items[selectedIndex])),
        }),
      };
    } else {
      return {};
    }
  }, [items, onSecondaryAction, selectDefault, selectedIndex, setSelectedIndex]));

  if (!items) {
    return <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={true}>
      <CircularProgress color="inherit" />
    </Backdrop>;
  }

  return (
    <List dense>
      {items.map((item, index) => <NarouUpdateListItem
        key={item.base_url}
        item={item} index={index} isSelected={index === selectedIndex}
        setSelectedIndex={setSelectedIndex}
        selectDefault={selectDefault}
        onSecondaryAction={onSecondaryAction}
      />)}
    </List>
  );
}
