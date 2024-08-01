import { render } from '@testing-library/react';
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
});
