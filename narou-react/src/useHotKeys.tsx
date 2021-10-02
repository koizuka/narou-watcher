import { useEffect, useState } from 'react';

export type HotKeys = {
  [key: string]: (event: KeyboardEvent) => void;
}

function toKeyString(event: { key: string; shiftKey: boolean; ctrlKey: boolean; altKey: boolean; metaKey: boolean}): string {
  return [
    event.shiftKey ? 'shift' : undefined,
    event.ctrlKey ? 'ctrl' : undefined,
    event.altKey ? 'alt' : undefined,
    event.metaKey ? 'meta' : undefined,
    event.key,
  ].filter(s => s !== undefined).join('+')
}

export function checkKeyString(keyString: string) {
  const [key, ...elems] =
    keyString === '+'
      ? ['+']
      : keyString.endsWith('++')
        ? ['+', ...keyString.slice(0, -2).split('+').reverse()]
        : keyString.split('+').reverse();

  const availableModifiers = ['shift', 'ctrl', 'alt', 'meta'];
  if (elems.some(s => !availableModifiers.includes(s))) {
    throw new Error(`HotKey(${keyString}): unknown modifiers: ${elems.filter(s => !availableModifiers.includes(s))}`);
  }
 
  const shouldBe = toKeyString({
    key,
    shiftKey: elems.some(s => s === 'shift'),
    ctrlKey: elems.some(s => s === 'ctrl'),
    altKey: elems.some(s => s === 'alt'),
    metaKey: elems.some(s => s === 'meta'),
  });

  if (shouldBe !== keyString) {
    throw new Error(`HotKey(${keyString}): invalid order: must be ${shouldBe} `);
  }
}

export function useHotKeys() {
  const [hotkeys, setHotkeys] = useState<HotKeys>({});

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

  return [setHotkeys];
}
