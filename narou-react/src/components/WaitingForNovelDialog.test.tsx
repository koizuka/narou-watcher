import { cleanup, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateTime } from 'luxon';
import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { IsNoticeListItem } from '../narouApi/IsNoticeListItem';
import { NarouApi } from '../narouApi/NarouApi';
import { WaitingForNovelDialog } from './WaitingForNovelDialog';

vi.mock('../narouApi/NarouApi');

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
    isR18: false,
  };

  const mockOnClose = vi.fn();

  afterEach(() => {
    cleanup(); // Ensure all components are unmounted
    vi.clearAllMocks();
    vi.clearAllTimers();
    vi.unstubAllGlobals();
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

    // Wait for dialog to render and find cancel button by text content
    const cancelButton = await screen.findByText('キャンセル');
    expect(cancelButton).toBeInTheDocument();
    
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

    // Wait for dialog to render by finding expected buttons
    const manualRetryButton = await screen.findByText('今すぐ確認');
    const openAnywayButton = await screen.findByText('そのまま開く');
    const cancelButton = await screen.findByText('キャンセル');

    expect(manualRetryButton).toBeInTheDocument();
    expect(openAnywayButton).toBeInTheDocument();
    expect(cancelButton).toBeInTheDocument();
  });
});