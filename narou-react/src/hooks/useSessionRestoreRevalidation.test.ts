import { renderHook } from '@testing-library/react';
import { beforeEach, expect, test, vi } from 'vitest';
import { mutate } from 'swr';
import { useSessionRestoreRevalidation } from './useSessionRestoreRevalidation';

vi.mock('swr', () => ({
  mutate: vi.fn(),
}));

beforeEach(() => {
  vi.clearAllMocks();
});

function firePageShow(persisted: boolean) {
  window.dispatchEvent(new PageTransitionEvent('pageshow', { persisted }));
}

test('does not revalidate on normal page load (persisted=false)', () => {
  const { unmount } = renderHook(() => {
    useSessionRestoreRevalidation();
  });

  firePageShow(false);

  expect(mutate).not.toHaveBeenCalled();
  unmount();
});

test('revalidates on BFCache/session restore (persisted=true)', () => {
  const { unmount } = renderHook(() => {
    useSessionRestoreRevalidation();
  });

  firePageShow(true);

  expect(mutate).toHaveBeenCalledWith(expect.any(Function), undefined, { revalidate: true });
  unmount();
});

test('removes listener on unmount', () => {
  const { unmount } = renderHook(() => {
    useSessionRestoreRevalidation();
  });
  unmount();

  firePageShow(true);

  expect(mutate).not.toHaveBeenCalled();
});
