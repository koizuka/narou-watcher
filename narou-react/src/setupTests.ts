// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom/vitest';
import 'whatwg-fetch';

// @ts-expect-error disable ts(7017) for globalThis
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

// Mock window.open for tests
Object.defineProperty(window, 'open', {
  writable: true,
  value: globalThis.vi?.fn() || function () {
    console.log('window.open called in test environment');
  },
});
