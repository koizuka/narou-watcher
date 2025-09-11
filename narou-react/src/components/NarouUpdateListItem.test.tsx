import { cleanup, fireEvent, render } from '@testing-library/react';
import { DateTime, Settings } from 'luxon';
import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { IsNoticeListItem } from '../narouApi/IsNoticeListItem';
import { BEWARE_TIME, NarouUpdateListItem } from './NarouUpdateListItem';

vi.useFakeTimers();

describe('NarouUpdateListItem', () => {
  afterEach(() => {
    cleanup(); // Ensure all components are unmounted
    Settings.now = () => Date.now(); // reset
    vi.clearAllTimers();
  });

  test('beware too new', () => {
    const update_time = Date.now();

    Settings.now = () => update_time; // fix current time
    const item: IsNoticeListItem = {
      base_url: '',
      update_time: DateTime.fromMillis(update_time),
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

    Settings.now = () => update_time;
    const rendered = render(toRender());
    const elem = rendered.getByTestId('item');
    const primary = elem.querySelector('.MuiListItemText-primary')?.textContent;
    expect(primary).toEqual(`${item.title} (${item.bookmark}/${item.latest})`);

    const withoutAlert =
      `${item.update_time.toFormat('yyyy/LL/dd HH:mm')} 更新  作者:${item.author_name}`;
    const withAlert =
      `${item.update_time.toFormat('yyyy/LL/dd HH:mm')}(注意) 更新  作者:${item.author_name}`;

    expect(elem.querySelector('.MuiListItemText-secondary')?.textContent).toEqual(withAlert);

    // 時間経過後に再レンダリングすると (注意) マークが消える
    // Change the time and create a new item with different timestamp to force recalculation
    Settings.now = () => update_time + BEWARE_TIME + 1000; // 3 minutes + 1 second after updated time
    const newItem = {
      ...item,
      update_time: DateTime.fromMillis(update_time + BEWARE_TIME + 1000 - BEWARE_TIME - 1000) // Same original time
    }; 
    const newRender = () =>
      <NarouUpdateListItem data-testid="item"
        item={newItem}
        index={0}
        isSelected
        setSelectedIndex={() => {/* nothing */ }}
        selectDefault={() => {/* nothing */ }}
        onSecondaryAction={() => {/* nothing */ }}
      />;
    rendered.rerender(newRender());
    const newElem = rendered.getByTestId('item');
    expect(newElem.querySelector('.MuiListItemText-secondary')?.textContent).toEqual(withoutAlert);
  });

  test('renders with onWaitingAction prop', () => {
    const update_time = Date.now();
    Settings.now = () => update_time; // Current time is same as update time

    const item: IsNoticeListItem = {
      base_url: 'https://ncode.syosetu.com/n1234aa/',
      update_time: DateTime.fromMillis(update_time),
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
    Settings.now = () => update_time; // Current time is same as update time

    const item: IsNoticeListItem = {
      base_url: 'https://ncode.syosetu.com/n1234aa/',
      update_time: DateTime.fromMillis(update_time),
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
    Settings.now = () => Date.now();

    const item: IsNoticeListItem = {
      base_url: 'https://ncode.syosetu.com/n1234aa/',
      update_time: DateTime.fromMillis(update_time),
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
    Settings.now = () => update_time;

    const item: IsNoticeListItem = {
      base_url: 'https://ncode.syosetu.com/n1234aa/',
      update_time: DateTime.fromMillis(update_time),
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
});
