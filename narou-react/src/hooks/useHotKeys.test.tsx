import { checkKeyString } from "./useHotKeys";

test('checkKeyString', () => {
  expect(() => checkKeyString('a')).not.toThrow();
  expect(() => checkKeyString('shift+A')).not.toThrow();
  expect(() => checkKeyString('ctrl+a')).not.toThrow();
  expect(() => checkKeyString('alt+a')).not.toThrow();
  expect(() => checkKeyString('meta+a')).not.toThrow();

  expect(() => checkKeyString('+')).not.toThrow();
  expect(() => checkKeyString('shift++')).not.toThrow();

  expect(() => checkKeyString('meta+shift+a')).toThrow();
  expect(() => checkKeyString('+a')).toThrow();
  expect(() => checkKeyString('shift++a')).toThrow();
  expect(() => checkKeyString('hoge+a')).toThrow();
})