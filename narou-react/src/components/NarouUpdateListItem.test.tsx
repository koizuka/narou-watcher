import { cleanup, fireEvent, render } from '@testing-library/react';
import { format } from 'date-fns';
import React from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { IsNoticeListItem } from '../narouApi/IsNoticeListItem';
import { NarouUpdateListItem } from './NarouUpdateListItem';

describe('NarouUpdateListItem', () => {
  afterEach(() => {
    cleanup(); // Ensure all components are unmounted
  });

  test('shows beware mark when bewareNew is true', () => {
    const update_time = new Date();
    const item: IsNoticeListItem = {
      base_url: '',
      update_time,
      bookmark: 0,
      latest: 1,
      title: 'title',
      author_name: 'author',
      completed: false,
      isR18: false,
      bewareNew: true,
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
    const primary = elem.querySelector('.MuiListItemText-primary')?.textContent;
    expect(primary).toEqual(`${item.title} (${item.bookmark}/${item.latest})`);

    const withAlert =
      `${format(item.update_time, 'yyyy/MM/dd HH:mm')}(注意) 更新  作者:${item.author_name}`;

    expect(elem.querySelector('.MuiListItemText-secondary')?.textContent).toEqual(withAlert);
  });

  test('hides beware mark when bewareNew is false', () => {
    const update_time = new Date();
    const item: IsNoticeListItem = {
      base_url: '',
      update_time,
      bookmark: 0,
      latest: 1,
      title: 'title',
      author_name: 'author',
      completed: false,
      isR18: false,
      bewareNew: false,
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

    expect(elem.querySelector('.MuiListItemText-secondary')?.textContent).toEqual(withoutAlert);
  });

  test('renders with onWaitingAction prop', () => {
    const item: IsNoticeListItem = {
      base_url: 'https://ncode.syosetu.com/n1234aa/',
      update_time: new Date(),
      bookmark: 0,
      latest: 1,
      title: 'Recent Novel',
      author_name: 'author',
      completed: false,
      isR18: false,
      bewareNew: true,
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

  test('calls onWaitingAction when bewareNew is true', () => {
    const item: IsNoticeListItem = {
      base_url: 'https://ncode.syosetu.com/n1234aa/',
      update_time: new Date(),
      bookmark: 0,
      latest: 1,
      title: 'Recent Novel',
      author_name: 'author',
      completed: false,
      isR18: false,
      bewareNew: true,
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

    // Should call onWaitingAction when bewareNew is true
    expect(mockOnWaitingAction).toHaveBeenCalledExactlyOnceWith(item);
    expect(mockSelectDefault).toHaveBeenCalled();
  });

  test('uses normal link when bewareNew is false', () => {
    const item: IsNoticeListItem = {
      base_url: 'https://ncode.syosetu.com/n1234aa/',
      update_time: new Date(),
      bookmark: 0,
      latest: 1,
      title: 'Old Novel',
      author_name: 'author',
      completed: false,
      isR18: false,
      bewareNew: false,
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

    // Should not show (注意) mark when bewareNew is false
    const secondaryText = container.querySelector('.MuiListItemText-secondary')?.textContent;
    expect(secondaryText).not.toContain('(注意)');

    // Should have a link button when bewareNew is false
    const linkButton = container.querySelector('a');
    expect(linkButton).toBeInTheDocument();
    expect(linkButton).toHaveAttribute('target', '_blank');
    expect(linkButton).toHaveAttribute('href');

    // Should not call onWaitingAction when bewareNew is false
    expect(mockOnWaitingAction).not.toHaveBeenCalled();
  });

  test('disabled button when no unread episodes', () => {
    const item: IsNoticeListItem = {
      base_url: 'https://ncode.syosetu.com/n1234aa/',
      update_time: new Date(),
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
