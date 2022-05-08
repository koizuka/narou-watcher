import { Backdrop, CircularProgress, List } from '@mui/material';
import React, { useCallback, useMemo } from 'react';
import { HotKeys, useHotKeys } from '../hooks/useHotKeys';
import { IsNoticeListItem } from "../narouApi/IsNoticeListItem";
import { SelectCommand } from '../reducer/ItemsState';
import { NarouUpdateListItem } from './NarouUpdateListItem';

const guard = (f: (event: KeyboardEvent) => void) => (event: KeyboardEvent) => {
  const ignoreClasses = [
    'MuiInputBase-input',
  ];
  const classList = (event.target as HTMLElement).classList;
  if (ignoreClasses.some(c => classList.contains(c))) {
    return;
  }
  event.preventDefault();
  f(event);
};

export function NarouUpdateList({
  items,
  selectedIndex, setSelectedIndex,
  selectCommand,
  onSecondaryAction,
}: {
  items: IsNoticeListItem[];
  selectedIndex: number;
  setSelectedIndex: (index: number) => void;
  selectCommand: (command: SelectCommand) => void;
  onSecondaryAction: (item: IsNoticeListItem) => void;
}) {
  useHotKeys(useMemo((): HotKeys => {
    return {
      'ArrowUp': guard(() => selectCommand('up')),
      'k': guard(() => selectCommand('up')),
      'ArrowDown': guard(() => selectCommand('down')),
      'j': guard(() => selectCommand('down')),
      'Home': guard(() => selectCommand('home')),
      'g': guard(() => selectCommand('home')),
      'End': guard(() => selectCommand('end')),
      'shift+G': guard(() => selectCommand('end')),
      'Escape': guard(() => selectCommand('default')),
    };
  }, [selectCommand]));

  const currentItem = items[selectedIndex];
  useHotKeys(useMemo((): HotKeys => ({
    'i': guard(() => onSecondaryAction(currentItem)),
  }), [currentItem, onSecondaryAction]));

  const selectDefault = useCallback(() => selectCommand('default'), [selectCommand]);

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
