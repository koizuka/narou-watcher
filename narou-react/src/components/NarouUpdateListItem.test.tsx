import { act, cleanup, fireEvent, render } from '@testing-library/react';
import { format } from 'date-fns';
import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { IsNoticeListItem } from '../narouApi/IsNoticeListItem';
import { BEWARE_TIME, NarouUpdateListItem } from './NarouUpdateListItem';

vi.useFakeTimers();

describe('NarouUpdateListItem', () => {
  afterEach(() => {
    cleanup(); // Ensure all components are unmounted
    // Reset fake timer
    vi.clearAllTimers();
  });

  test('beware too new', () => {
    const update_time = Date.now();

    vi.setSystemTime(new Date(update_time)); // fix current time
    const item: IsNoticeListItem = {
      base_url: '',
      update_time: new Date(update_time),
      bookmark: 0,
      latest: 1,
      title: 'title',
      author_name: 'author',
      completed: false,
      isR18: false,
    };

    const toRender = () =>
      <NarouUpdateListItem data-testid="item"
        item={item}
        index={0}
        isSelected
        setSelectedIndex={() => {/* nothing */ }}
        selectDefault={() => {/* nothing */ }}
        onSecondaryAction={() => {/* nothing */ }}
      />;

    vi.setSystemTime(new Date(update_time));
    const rendered = render(toRender());
    const elem = rendered.getByTestId('item');
    const primary = elem.querySelector('.MuiListItemText-primary')?.textContent;
    expect(primary).toEqual(`${item.title} (${item.bookmark}/${item.latest})`);

    const withoutAlert =
      `${format(item.update_time, 'yyyy/MM/dd HH:mm')} 更新  作者:${item.author_name}`;
    const withAlert =
      `${format(item.update_time, 'yyyy/MM/dd HH:mm')}(注意) 更新  作者:${item.author_name}`;

    expect(elem.querySelector('.MuiListItemText-secondary')?.textContent).toEqual(withAlert);

    // 時間経過後に自動的に (注意) マークが消える
    // Advance time to trigger the timer
    act(() => {
      vi.advanceTimersByTime(BEWARE_TIME + 1000); // 3 minutes + 1 second
    });

    const newElem = rendered.getByTestId('item');
    expect(newElem.querySelector('.MuiListItemText-secondary')?.textContent).toEqual(withoutAlert);
  });

  test('beware mark disappears exactly at BEWARE_TIME boundary', () => {
    const update_time = Date.now();
    vi.setSystemTime(new Date(update_time));

    const item: IsNoticeListItem = {
      base_url: '',
      update_time: new Date(update_time),
      bookmark: 0,
      latest: 1,
      title: 'title',
      author_name: 'author',
      completed: false,
      isR18: false,
    };

    const rendered = render(
      <NarouUpdateListItem data-testid="item"
        item={item}
        index={0}
        isSelected
        setSelectedIndex={() => {/* nothing */ }}
        selectDefault={() => {/* nothing */ }}
        onSecondaryAction={() => {/* nothing */ }}
      />
    );

    const elem = rendered.getByTestId('item');
    const withoutAlert =
      `${format(item.update_time, 'yyyy/MM/dd HH:mm')} 更新  作者:${item.author_name}`;
    const withAlert =
      `${format(item.update_time, 'yyyy/MM/dd HH:mm')}(注意) 更新  作者:${item.author_name}`;

    // Initially should have the alert
    expect(elem.querySelector('.MuiListItemText-secondary')?.textContent).toEqual(withAlert);

    // Advance time to exactly BEWARE_TIME (boundary condition)
    act(() => {
      vi.advanceTimersByTime(BEWARE_TIME);
    });

    // Should NOT have the mark at exactly BEWARE_TIME (since < BEWARE_TIME is now false)
    const newElem = rendered.getByTestId('item');
    expect(newElem.querySelector('.MuiListItemText-secondary')?.textContent).toEqual(withoutAlert);
  });

  test('renders with onWaitingAction prop', () => {
    const update_time = Date.now();
    vi.setSystemTime(new Date(update_time)); // Current time is same as update time

    const item: IsNoticeListItem = {
      base_url: 'https://ncode.syosetu.com/n1234aa/',
      update_time: new Date(update_time),
      bookmark: 0,
      latest: 1,
      title: 'Recent Novel',
      author_name: 'author',
      completed: false,
      isR18: false,
    };

    const mockOnWaitingAction = vi.fn();
    const mockSelectDefault = vi.fn();

    const { container } = render(
      <NarouUpdateListItem data-testid="item"
        item={item}
        index={0}
        isSelected={false}
        setSelectedIndex={() => {/* nothing */ }}
        selectDefault={mockSelectDefault}
        onSecondaryAction={() => {/* nothing */ }}
        onWaitingAction={mockOnWaitingAction}
      />
    );

    // Component should render successfully
    expect(container.querySelector('[data-testid="item"]')).toBeInTheDocument();
  });

  test('calls onWaitingAction for recent updates', () => {
    const update_time = Date.now();
    vi.setSystemTime(new Date(update_time)); // Current time is same as update time

    const item: IsNoticeListItem = {
      base_url: 'https://ncode.syosetu.com/n1234aa/',
      update_time: new Date(update_time),
      bookmark: 0,
      latest: 1,
      title: 'Recent Novel',
      author_name: 'author',
      completed: false,
      isR18: false,
    };

    const mockOnWaitingAction = vi.fn();
    const mockSelectDefault = vi.fn();

    const { container } = render(
      <NarouUpdateListItem data-testid="item"
        item={item}
        index={0}
        isSelected={false}
        setSelectedIndex={() => {/* nothing */ }}
        selectDefault={mockSelectDefault}
        onSecondaryAction={() => {/* nothing */ }}
        onWaitingAction={mockOnWaitingAction}
      />
    );

    // Click the main button (ListItemButton, not the secondary action button)
    const buttons = container.querySelectorAll('button, [role="button"]');
    const mainButton = buttons[0]; // The ListItemButton should be first
    fireEvent.click(mainButton);

    // Should call onWaitingAction for recent updates
    expect(mockOnWaitingAction).toHaveBeenCalledWith(item);
    expect(mockSelectDefault).toHaveBeenCalled();
  });

  test('uses normal link for old updates', () => {
    const update_time = Date.now() - BEWARE_TIME - 1000; // 3 minutes + 1 second ago
    vi.setSystemTime(new Date(Date.now()));

    const item: IsNoticeListItem = {
      base_url: 'https://ncode.syosetu.com/n1234aa/',
      update_time: new Date(update_time),
      bookmark: 0,
      latest: 1,
      title: 'Old Novel',
      author_name: 'author',
      completed: false,
      isR18: false,
    };

    const mockOnWaitingAction = vi.fn();
    const mockSelectDefault = vi.fn();

    const { container } = render(
      <NarouUpdateListItem data-testid="item"
        item={item}
        index={0}
        isSelected={false}
        setSelectedIndex={() => {/* nothing */ }}
        selectDefault={mockSelectDefault}
        onSecondaryAction={() => {/* nothing */ }}
        onWaitingAction={mockOnWaitingAction}
      />
    );

    // Should not show (注意) mark for old updates
    const secondaryText = container.querySelector('.MuiListItemText-secondary')?.textContent;
    expect(secondaryText).not.toContain('(注意)');

    // Should have a link button for old updates  
    const linkButton = container.querySelector('a');
    expect(linkButton).toBeInTheDocument();
    expect(linkButton).toHaveAttribute('target', '_blank');
    expect(linkButton).toHaveAttribute('href');
    
    // Should not call onWaitingAction for old updates
    expect(mockOnWaitingAction).not.toHaveBeenCalled();
  });

  test('disabled button when no unread episodes', () => {
    const update_time = Date.now();
    vi.setSystemTime(new Date(update_time));

    const item: IsNoticeListItem = {
      base_url: 'https://ncode.syosetu.com/n1234aa/',
      update_time: new Date(update_time),
      bookmark: 1, // Same as latest
      latest: 1,
      title: 'No Unread Novel',
      author_name: 'author',
      completed: false,
      isR18: false,
    };

    const mockOnWaitingAction = vi.fn();

    const { container } = render(
      <NarouUpdateListItem data-testid="item"
        item={item}
        index={0}
        isSelected={false}
        setSelectedIndex={() => {/* nothing */ }}
        selectDefault={() => {/* nothing */ }}
        onSecondaryAction={() => {/* nothing */ }}
        onWaitingAction={mockOnWaitingAction}
      />
    );

    // Main button should be disabled when no unread episodes
    const mainButton = container.querySelector('[role="button"]');
    expect(mainButton).toHaveAttribute('aria-disabled', 'true');
    expect(mainButton).toHaveAttribute('tabindex', '-1');
  });

  test('cleans up timer on unmount', () => {
    const update_time = Date.now();
    vi.setSystemTime(new Date(update_time));

    const item: IsNoticeListItem = {
      base_url: '',
      update_time: new Date(update_time),
      bookmark: 0,
      latest: 1,
      title: 'title',
      author_name: 'author',
      completed: false,
      isR18: false,
    };

    const { unmount } = render(
      <NarouUpdateListItem data-testid="item"
        item={item}
        index={0}
        isSelected={false}
        setSelectedIndex={() => {/* nothing */ }}
        selectDefault={() => {/* nothing */ }}
        onSecondaryAction={() => {/* nothing */ }}
      />
    );

    // Verify timer is set for recent update
    expect(vi.getTimerCount()).toBe(1);

    // Unmount component
    unmount();

    // Timer should be cleaned up
    expect(vi.getTimerCount()).toBe(0);
  });
});
