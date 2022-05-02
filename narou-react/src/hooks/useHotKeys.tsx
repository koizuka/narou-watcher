import { useEffect } from 'react';

export type HotKeys = {
  [key: string]: (event: KeyboardEvent) => void;
}

type KeyCombination = {
  key: string;
  shiftKey?: boolean;
  ctrlKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
};

function toKeyString(event: KeyCombination): string {
  return [
    event.shiftKey ? 'shift' : undefined,
    event.ctrlKey ? 'ctrl' : undefined,
    event.altKey ? 'alt' : undefined,
    event.metaKey ? 'meta' : undefined,
    event.key,
  ].filter(s => s !== undefined).join('+')
}

export function checkKeyString(keyString: string) {
  const [key, ...modifiers] =
    keyString === '+'
      ? ['+']
      : keyString.endsWith('++')
        ? ['+', ...keyString.slice(0, -2).split('+').reverse()]
        : keyString.split('+').reverse();

  const availableModifiers = ['shift', 'ctrl', 'alt', 'meta'];
  if (modifiers.some(s => !availableModifiers.includes(s))) {
    throw new Error(`HotKey(${keyString}): unknown modifiers: ${modifiers.filter(s => !availableModifiers.includes(s))}`);
  }

  const combination: KeyCombination = {
    key,
    shiftKey: modifiers.some(s => s === 'shift'),
    ctrlKey: modifiers.some(s => s === 'ctrl'),
    altKey: modifiers.some(s => s === 'alt'),
    metaKey: modifiers.some(s => s === 'meta'),
  };
  const shouldBe = toKeyString(combination);

  if (shouldBe !== keyString) {
    throw new Error(`HotKey(${keyString}): invalid order: must be ${shouldBe} `);
  }
}

export function useHotKeys(hotkeys: HotKeys) {
  useEffect(() => {
    const keys = Object.keys(hotkeys);
    if (keys.length > 0) {
      keys.forEach(key => checkKeyString(key));

      const onKeyDown = (event: KeyboardEvent) => {
        const handler = hotkeys[toKeyString(event)];
        if (handler) {
          handler(event);
        }
      };
      document.addEventListener('keydown', onKeyDown, false);
      return () => {
        document.removeEventListener('keydown', onKeyDown);
      };
    }
  }, [hotkeys]);
}
