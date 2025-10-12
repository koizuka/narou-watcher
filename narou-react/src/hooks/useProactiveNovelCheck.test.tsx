import { renderHook, waitFor } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { IsNoticeListItem } from '../narouApi/IsNoticeListItem';
import { NarouApi } from '../narouApi/NarouApi';
import { useProactiveNovelCheck } from './useProactiveNovelCheck';

describe('useProactiveNovelCheck', () => {
  const mockCall = vi.fn();
  const mockApi = {
    call: mockCall,
  } as unknown as NarouApi;

  const mockItem: IsNoticeListItem = {
    base_url: 'https://ncode.syosetu.com/n1234aa/',
    update_time: new Date(),
    bookmark: 5,
    latest: 6,
    title: 'Test Novel',
    author_name: 'Test Author',
    completed: false,
    isR18: false,
    bewareNew: true,
  };

  const mockOnAccessible = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  test('calls checkNovelAccess when item is provided', async () => {
    mockCall.mockResolvedValue({ accessible: true, statusCode: 200 });

    renderHook(() => { useProactiveNovelCheck(mockApi, mockItem, mockOnAccessible); });

    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledExactlyOnceWith('/narou/check-novel-access/n1234aa/6');
    });
  });

  test('calls onAccessible when novel is accessible', async () => {
    mockCall.mockResolvedValue({ accessible: true, statusCode: 200 });

    renderHook(() => { useProactiveNovelCheck(mockApi, mockItem, mockOnAccessible); });

    await waitFor(() => {
      expect(mockOnAccessible).toHaveBeenCalledExactlyOnceWith(mockItem);
    });
  });

  test('does not call onAccessible when novel is not accessible', async () => {
    mockCall.mockResolvedValue({ accessible: false, statusCode: 404 });

    renderHook(() => { useProactiveNovelCheck(mockApi, mockItem, mockOnAccessible); });

    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledTimes(1);
    });

    // Wait a bit more to ensure onAccessible is not called
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockOnAccessible).not.toHaveBeenCalled();
  });

  test('does not call API when item is undefined', async () => {
    renderHook(() => { useProactiveNovelCheck(mockApi, undefined, mockOnAccessible); });

    // Wait a bit to ensure no API call is made
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockCall).not.toHaveBeenCalled();
    expect(mockOnAccessible).not.toHaveBeenCalled();
  });

  test('cancels previous check when item changes', async () => {
    mockCall.mockResolvedValue({ accessible: true, statusCode: 200 });

    const { rerender } = renderHook(
      ({ item }) => { useProactiveNovelCheck(mockApi, item, mockOnAccessible); },
      { initialProps: { item: mockItem } }
    );

    // Wait for first call
    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledTimes(1);
    });

    // Change item
    const newItem: IsNoticeListItem = {
      ...mockItem,
      base_url: 'https://ncode.syosetu.com/n5678bb/',
    };

    mockCall.mockClear();
    mockOnAccessible.mockClear();

    rerender({ item: newItem });

    // Should make a new call with the new item
    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledExactlyOnceWith('/narou/check-novel-access/n5678bb/6');
    });
  });

  test('handles API errors silently', async () => {
    const consoleSpy = vi.spyOn(console, 'debug').mockImplementation(() => {
      // Suppress console.debug in tests
    });

    mockCall.mockRejectedValue(new Error('Network error'));

    renderHook(() => { useProactiveNovelCheck(mockApi, mockItem, mockOnAccessible); });

    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledTimes(1);
    });

    // Should not call onAccessible
    expect(mockOnAccessible).not.toHaveBeenCalled();

    // Should log debug message
    await waitFor(() => {
      expect(consoleSpy.mock.calls.length).toBeGreaterThan(0);
      const found = consoleSpy.mock.calls.some(call =>
        call[0] === 'Proactive novel check failed:' && call[1] instanceof Error
      );
      expect(found).toBe(true);
    });

    consoleSpy.mockRestore();
  });

  test('uses correct episode number based on bookmark', async () => {
    const itemWithBookmark0: IsNoticeListItem = {
      ...mockItem,
      bookmark: 0, // Next episode should be 1
    };

    mockCall.mockResolvedValue({ accessible: true, statusCode: 200 });

    renderHook(() => { useProactiveNovelCheck(mockApi, itemWithBookmark0, mockOnAccessible); });

    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledExactlyOnceWith('/narou/check-novel-access/n1234aa/1');
    });
  });

  test('handles R18 novels with correct API endpoint', async () => {
    const r18Item: IsNoticeListItem = {
      ...mockItem,
      isR18: true,
    };

    mockCall.mockResolvedValue({ accessible: true, statusCode: 200 });

    renderHook(() => { useProactiveNovelCheck(mockApi, r18Item, mockOnAccessible); });

    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledExactlyOnceWith('/r18/check-novel-access/n1234aa/6');
    });
  });

  test('does not check if ncode extraction fails', async () => {
    const invalidItem: IsNoticeListItem = {
      ...mockItem,
      base_url: 'https://invalid-url.com', // Invalid URL format (no trailing slash and no ncode)
    };

    renderHook(() => { useProactiveNovelCheck(mockApi, invalidItem, mockOnAccessible); });

    // Wait a bit to ensure no API call is made
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockCall).not.toHaveBeenCalled();
    expect(mockOnAccessible).not.toHaveBeenCalled();
  });

  test('cleans up on unmount', async () => {
    let resolveCall: ((value: { accessible: boolean; statusCode: number }) => void) | undefined;
    const slowCall = new Promise<{ accessible: boolean; statusCode: number }>(resolve => {
      resolveCall = resolve;
    });
    mockCall.mockReturnValue(slowCall);

    const { unmount } = renderHook(() => { useProactiveNovelCheck(mockApi, mockItem, mockOnAccessible); });

    // Wait for API call to start
    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledTimes(1);
    });

    // Unmount before API call completes
    unmount();

    // Resolve the API call
    resolveCall?.({ accessible: true, statusCode: 200 });

    // Wait a bit to ensure onAccessible is not called after unmount
    await new Promise(resolve => setTimeout(resolve, 100));
    expect(mockOnAccessible).not.toHaveBeenCalled();
  });
});
