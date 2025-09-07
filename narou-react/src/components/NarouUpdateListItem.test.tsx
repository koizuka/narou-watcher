import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DateTime, Settings } from 'luxon';
import React, { act } from 'react';
import { afterEach, describe, expect, test, vi } from 'vitest';
import { IsNoticeListItem } from '../narouApi/IsNoticeListItem';
import { BEWARE_TIME, NarouUpdateListItem } from './NarouUpdateListItem';

vi.useFakeTimers();

describe('NarouUpdateListItem', () => {
  afterEach(() => {
    Settings.now = () => Date.now();
  })

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

    Settings.now = () => update_time + BEWARE_TIME - 1; // 1 ms before disappear
    act(() => {
      vi.advanceTimersByTime(BEWARE_TIME - 1);
    });
    expect(elem.querySelector('.MuiListItemText-secondary')?.textContent).toEqual(withAlert);

    Settings.now = () => update_time + BEWARE_TIME; // 3 minutes after updated time
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(elem.querySelector('.MuiListItemText-secondary')?.textContent).toEqual(withoutAlert);

    // 新規に時間経過後で開いた場合
    Settings.now = () => update_time + BEWARE_TIME + 1; // 3 minutes after updated time
    rendered.rerender(toRender());
    expect(elem.querySelector('.MuiListItemText-secondary')?.textContent).toEqual(withoutAlert);
  });

  test('calls onWaitingAction when clicking on recent updates', async () => {
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
    const user = userEvent.setup();

    const rendered = render(
      <NarouUpdateListItem data-testid="item"
        item={item}
        index={0}
        isSelected
        setSelectedIndex={() => {/* nothing */ }}
        selectDefault={mockSelectDefault}
        onSecondaryAction={() => {/* nothing */ }}
        onWaitingAction={mockOnWaitingAction}
      />
    );

    const buttons = rendered.getAllByRole('button');
    const mainButton = buttons.find(button => button.getAttribute('role') === 'button' && !button.getAttribute('tabindex')?.includes('-1'));
    await user.click(mainButton || buttons[1]); // Use main button or fallback to second button

    expect(mockOnWaitingAction).toHaveBeenCalledWith(item);
    expect(mockSelectDefault).toHaveBeenCalled();
  }, 10000);

  test('opens direct link when clicking on older updates', () => {
    const update_time = Date.now();
    Settings.now = () => update_time + BEWARE_TIME + 1; // 3 minutes after update time

    const item: IsNoticeListItem = {
      base_url: 'https://ncode.syosetu.com/n1234aa/',
      update_time: DateTime.fromMillis(update_time),
      bookmark: 0,
      latest: 1,
      title: 'Older Novel',
      author_name: 'author',
      completed: false,
      isR18: false,
    };

    const mockOnWaitingAction = vi.fn();
    const mockSelectDefault = vi.fn();

    const rendered = render(
      <NarouUpdateListItem data-testid="item"
        item={item}
        index={0}
        isSelected
        setSelectedIndex={() => {/* nothing */ }}
        selectDefault={mockSelectDefault}
        onSecondaryAction={() => {/* nothing */ }}
        onWaitingAction={mockOnWaitingAction}
      />
    );

    const link = rendered.getByRole('link');
    
    // For older updates, it should be a direct link
    expect(link).toHaveAttribute('href', 'https://ncode.syosetu.com/n1234aa/1/');
    expect(mockOnWaitingAction).not.toHaveBeenCalled();
  });

  test('fallback to direct link when onWaitingAction is not provided', () => {
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

    const mockSelectDefault = vi.fn();

    const rendered = render(
      <NarouUpdateListItem data-testid="item"
        item={item}
        index={0}
        isSelected
        setSelectedIndex={() => {/* nothing */ }}
        selectDefault={mockSelectDefault}
        onSecondaryAction={() => {/* nothing */ }}
        // onWaitingAction is not provided
      />
    );

    const link = rendered.getByRole('link');
    
    // Should fallback to direct link behavior
    expect(link).toHaveAttribute('href', 'https://ncode.syosetu.com/n1234aa/1/');
  });
});
