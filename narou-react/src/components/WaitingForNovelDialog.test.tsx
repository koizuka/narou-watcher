import { act, cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { IsNoticeListItem } from '../narouApi/IsNoticeListItem';
import { NarouApi } from '../narouApi/NarouApi';
import { WaitingForNovelDialog } from './WaitingForNovelDialog';

// Mock window.open
Object.defineProperty(window, 'open', {
  writable: true,
  value: vi.fn(),
});

// Don't mock the entire module, we need the static methods

describe('WaitingForNovelDialog', () => {
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
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    // Only run timer cleanup if fake timers are active
    try {
      vi.runOnlyPendingTimers();
    } catch {
      // Ignore error if timers are not mocked
    }
    vi.useRealTimers();
    cleanup();
  });

  const flushAsync = async () => {
    await act(async () => {
      // Flush any pending promises
    });
  };

  test('displays waiting dialog when item is provided', () => {
    mockCall.mockResolvedValue({ accessible: false });

    render(
      <WaitingForNovelDialog
        api={mockApi}
        item={mockItem}
        onClose={mockOnClose}
      />
    );

    expect(screen.getByText('小説の公開を待っています...')).toBeInTheDocument();
    expect(screen.getByText('「Test Novel」の次の話がまだ公開されていません。')).toBeInTheDocument();
    expect(screen.getByText('自動的に公開をチェックし、公開され次第開きます。')).toBeInTheDocument();
  });

  test('does not display dialog when item is undefined', () => {
    const { container } = render(
      <WaitingForNovelDialog 
        api={mockApi}
        item={undefined}
        onClose={mockOnClose}
      />
    );

    // Dialog should not be open
    expect(container.querySelector('[role="dialog"]')).not.toBeInTheDocument();
  });

  test('calls onClose when cancel button is clicked', async () => {
    const user = userEvent.setup();
    mockCall.mockResolvedValue({ accessible: false });

    render(
      <WaitingForNovelDialog 
        api={mockApi}
        item={mockItem}
        onClose={mockOnClose}
      />
    );

    // Wait for initial API call to complete
    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledTimes(1);
    });

    // Find and click cancel button
    const cancelButton = screen.getByTestId('cancel-button');
    await user.click(cancelButton);
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('has manual retry button', async () => {
    mockCall.mockResolvedValue({ accessible: false });

    render(
      <WaitingForNovelDialog 
        api={mockApi}
        item={mockItem}
        onClose={mockOnClose}
      />
    );

    // Wait for initial API call to complete
    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledTimes(1);
    });

    // Check that all buttons are rendered
    expect(screen.getByTestId('manual-retry-button')).toBeInTheDocument();
    expect(screen.getByTestId('open-anyway-button')).toBeInTheDocument();
    expect(screen.getByTestId('cancel-button')).toBeInTheDocument();
  });

  test('opens novel immediately when accessible', async () => {
    mockCall.mockResolvedValue({ accessible: true, statusCode: 200 });

    render(
      <WaitingForNovelDialog 
        api={mockApi}
        item={mockItem}
        onClose={mockOnClose}
      />
    );

    // Wait for the API call and window.open to be called
    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledWith('/narou/check-novel-access/n1234aa/6');
      expect(window.open).toHaveBeenCalledWith('https://ncode.syosetu.com/n1234aa/6/', '_blank');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('opens novel after manual retry when accessible', async () => {
    const user = userEvent.setup();
    
    // First call returns not accessible, second returns accessible
    mockCall
      .mockResolvedValueOnce({ accessible: false, statusCode: 404 })
      .mockResolvedValueOnce({ accessible: true, statusCode: 200 });

    render(
      <WaitingForNovelDialog 
        api={mockApi}
        item={mockItem}
        onClose={mockOnClose}
      />
    );

    // Wait for initial call
    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledTimes(1);
    });

    // Click manual retry
    const retryButton = screen.getByTestId('manual-retry-button');
    await user.click(retryButton);

    // Wait for window.open to be called
    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledTimes(2);
      expect(mockCall).toHaveBeenNthCalledWith(1, '/narou/check-novel-access/n1234aa/6');
      expect(mockCall).toHaveBeenNthCalledWith(2, '/narou/check-novel-access/n1234aa/6');
      expect(window.open).toHaveBeenCalledWith('https://ncode.syosetu.com/n1234aa/6/', '_blank');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('opens novel when "そのまま開く" is clicked', async () => {
    const user = userEvent.setup();
    mockCall.mockResolvedValue({ accessible: false, statusCode: 404 });

    render(
      <WaitingForNovelDialog 
        api={mockApi}
        item={mockItem}
        onClose={mockOnClose}
      />
    );

    // Wait for initial call
    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledTimes(1);
    });

    // Click "open anyway" button
    const openAnywayButton = screen.getByTestId('open-anyway-button');
    await user.click(openAnywayButton);

    expect(window.open).toHaveBeenCalledWith('https://ncode.syosetu.com/n1234aa/6/', '_blank');
    expect(mockOnClose).toHaveBeenCalled();
  });

  test('handles API errors gracefully', async () => {
    // Mock console.error to suppress error output in tests
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {
      // Suppress console.error in tests
    });
    mockCall.mockRejectedValue(new Error('Network error'));

    render(
      <WaitingForNovelDialog 
        api={mockApi}
        item={mockItem}
        onClose={mockOnClose}
      />
    );

    // Wait for error to be handled
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('Failed to check novel access:', expect.any(Error));
    });

    // Should not crash and should show retry options
    expect(screen.getByTestId('manual-retry-button')).toBeInTheDocument();
    expect(screen.getByTestId('open-anyway-button')).toBeInTheDocument();
    
    consoleSpy.mockRestore();
  });

  test('shows correct episode number for bookmark', async () => {
    const itemWithBookmark0: IsNoticeListItem = {
      ...mockItem,
      bookmark: 0, // Next episode should be 1
    };

    mockCall.mockResolvedValue({ accessible: true, statusCode: 200 });

    render(
      <WaitingForNovelDialog 
        api={mockApi}
        item={itemWithBookmark0}
        onClose={mockOnClose}
      />
    );

    // Should try to access episode 1 (bookmark + 1)
    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledWith('/narou/check-novel-access/n1234aa/1');
      expect(window.open).toHaveBeenCalledWith('https://ncode.syosetu.com/n1234aa/1/', '_blank');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('handles R18 novels with correct API endpoint', async () => {
    const r18Item: IsNoticeListItem = {
      ...mockItem,
      isR18: true,
    };

    mockCall.mockResolvedValue({ accessible: true, statusCode: 200 });

    render(
      <WaitingForNovelDialog
        api={mockApi}
        item={r18Item}
        onClose={mockOnClose}
      />
    );

    // Should use R18 endpoint and open novel
    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledWith('/r18/check-novel-access/n1234aa/6');
      expect(window.open).toHaveBeenCalledWith('https://ncode.syosetu.com/n1234aa/6/', '_blank');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  test('displays countdown timer starting from 30 seconds', async () => {
    mockCall.mockResolvedValue({ accessible: false });

    render(
      <WaitingForNovelDialog
        api={mockApi}
        item={mockItem}
        onClose={mockOnClose}
      />
    );

    // Wait for initial call and countdown to be displayed
    await waitFor(() => {
      expect(mockCall).toHaveBeenCalledTimes(1);
      expect(screen.getByText('次回確認まで: 30秒')).toBeInTheDocument();
    });
  });

  test('countdown timer shows decreasing seconds over time', async () => {
    vi.useFakeTimers();
    mockCall.mockResolvedValue({ accessible: false });

    render(
      <WaitingForNovelDialog
        api={mockApi}
        item={mockItem}
        onClose={mockOnClose}
      />
    );

    await flushAsync();

    expect(mockCall).toHaveBeenCalledTimes(1);
    expect(screen.getByText('次回確認まで: 30秒')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(1000);
    });

    expect(screen.getByText('次回確認まで: 29秒')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('次回確認まで: 24秒')).toBeInTheDocument();
  });

  test('countdown resets after automatic polling check', async () => {
    vi.useFakeTimers();
    mockCall.mockResolvedValue({ accessible: false });

    render(
      <WaitingForNovelDialog
        api={mockApi}
        item={mockItem}
        onClose={mockOnClose}
      />
    );

    await flushAsync();

    expect(mockCall).toHaveBeenCalledTimes(1);
    expect(screen.getByText('次回確認まで: 30秒')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(30000);
    });

    await flushAsync();

    expect(mockCall).toHaveBeenCalledTimes(2);
    expect(screen.getByText('次回確認まで: 30秒')).toBeInTheDocument();
  });

  test('shows checking state instead of countdown during API calls', async () => {
    // Mock a slow API call
    let resolveCall: ((value: { accessible: boolean; statusCode: number }) => void) | undefined;
    const slowCall = new Promise<{ accessible: boolean; statusCode: number }>(resolve => {
      resolveCall = resolve;
    });
    mockCall.mockReturnValue(slowCall);

    render(
      <WaitingForNovelDialog
        api={mockApi}
        item={mockItem}
        onClose={mockOnClose}
      />
    );

    // Should show checking state immediately
    await waitFor(() => {
      expect(screen.getByText('確認中...')).toBeInTheDocument();
    });

    // Should not show countdown while checking
    expect(screen.queryByText(/次回確認まで:/)).not.toBeInTheDocument();

    // Resolve the API call
    resolveCall?.({ accessible: false, statusCode: 404 });

    // Should show countdown after API call completes
    await waitFor(() => {
      expect(screen.queryByText('確認中...')).not.toBeInTheDocument();
      expect(screen.getByText('次回確認まで: 30秒')).toBeInTheDocument();
    });
  });

  test('manual retry button works and resets countdown', async () => {
    vi.useFakeTimers(); // Set fake timers BEFORE rendering
    mockCall.mockResolvedValue({ accessible: false });

    render(
      <WaitingForNovelDialog
        api={mockApi}
        item={mockItem}
        onClose={mockOnClose}
      />
    );

    await flushAsync();

    expect(mockCall).toHaveBeenCalledTimes(1);
    expect(screen.getByText('次回確認まで: 30秒')).toBeInTheDocument();

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(screen.getByText('次回確認まで: 25秒')).toBeInTheDocument();

    const retryButton = screen.getByTestId('manual-retry-button');
    fireEvent.click(retryButton);

    await flushAsync();

    expect(mockCall).toHaveBeenCalledTimes(2);
    expect(screen.getByText('次回確認まで: 30秒')).toBeInTheDocument();
  });
});
