import { checkKeyString } from "./useHotKeys";
import { expect, test } from 'vitest';

test('checkKeyString', () => {
  expect(() => checkKeyString('a')).not.toThrow();
  expect(() => checkKeyString('shift+A')).not.toThrow();
  expect(() => checkKeyString('ctrl+a')).not.toThrow();
  expect(() => checkKeyString('alt+a')).not.toThrow();
  expect(() => checkKeyString('meta+a')).not.toThrow();
  expect(checkKeyString('a')).toBe('a');
  expect(checkKeyString('A')).toBe('a');
  expect(checkKeyString('Shift+a')).toBe('shift+a');
  expect(checkKeyString('shift+A')).toBe('shift+a');

  expect(() => checkKeyString('+')).not.toThrow();
  expect(checkKeyString('+')).toBe('+');
  expect(() => checkKeyString('shift++')).not.toThrow();
  expect(checkKeyString('shift++')).toBe('shift++');

  expect(checkKeyString('meta+shift+a')).toBe('shift+meta+a');
  expect(() => checkKeyString('+a')).toThrow();
  expect(() => checkKeyString('shift++a')).toThrow();
  expect(() => checkKeyString('hoge+a')).toThrow();
})