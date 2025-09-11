import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateTime } from 'luxon';
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
    update_time: DateTime.now(),
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
    cleanup();
  });

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
    expect(screen.getByText('30秒ごとに確認し、公開され次第自動的に開きます。')).toBeInTheDocument();
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
});