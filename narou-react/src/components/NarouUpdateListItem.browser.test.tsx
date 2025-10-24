import { expect, test } from 'vitest';
import { render } from 'vitest-browser-react';
import React from 'react';
import { NarouUpdateListItem } from './NarouUpdateListItem';
import type { IsNoticeListItem } from '../narouApi/IsNoticeListItem';

/**
 * Visual regression tests for NarouUpdateListItem component
 * These tests capture screenshots and compare them against baseline images
 * to detect unintended visual changes, especially after MUI updates.
 */

test('visual: renders normal state', async () => {
  const item: IsNoticeListItem = {
    base_url: 'https://ncode.syosetu.com/n1234aa/',
    update_time: new Date('2025-01-15T10:30:00'),
    bookmark: 5,
    latest: 10,
    title: 'Sample Novel Title',
    author_name: 'Test Author',
    completed: false,
    isR18: false,
    bewareNew: false,
  };

  const screen = await render(
    <NarouUpdateListItem
      data-testid="item"
      item={item}
      index={0}
      isSelected={false}
      setSelectedIndex={() => {/* nothing */}}
      selectDefault={() => {/* nothing */}}
      onSecondaryAction={() => {/* nothing */}}
    />
  );

  const element = screen.getByTestId('item');
  await expect.element(element).toMatchScreenshot('normal-state.png');
});

test('visual: renders with beware mark', async () => {
  const item: IsNoticeListItem = {
    base_url: 'https://ncode.syosetu.com/n1234aa/',
    update_time: new Date('2025-01-15T10:30:00'),
    bookmark: 5,
    latest: 10,
    title: 'Recent Novel with Warning',
    author_name: 'Test Author',
    completed: false,
    isR18: false,
    bewareNew: true,
  };

  const screen = await render(
    <NarouUpdateListItem
      data-testid="item"
      item={item}
      index={0}
      isSelected={false}
      setSelectedIndex={() => {/* nothing */}}
      selectDefault={() => {/* nothing */}}
      onSecondaryAction={() => {/* nothing */}}
      onWaitingAction={() => {/* nothing */}}
    />
  );

  const element = screen.getByTestId('item');
  await expect.element(element).toMatchScreenshot('beware-mark-state.png');
});

test('visual: renders selected state', async () => {
  const item: IsNoticeListItem = {
    base_url: 'https://ncode.syosetu.com/n1234aa/',
    update_time: new Date('2025-01-15T10:30:00'),
    bookmark: 5,
    latest: 10,
    title: 'Selected Novel',
    author_name: 'Test Author',
    completed: false,
    isR18: false,
    bewareNew: false,
  };

  const screen = await render(
    <NarouUpdateListItem
      data-testid="item"
      item={item}
      index={0}
      isSelected={true}
      setSelectedIndex={() => {/* nothing */}}
      selectDefault={() => {/* nothing */}}
      onSecondaryAction={() => {/* nothing */}}
    />
  );

  const element = screen.getByTestId('item');
  await expect.element(element).toMatchScreenshot('selected-state.png');
});

test('visual: renders disabled state (no unread)', async () => {
  const item: IsNoticeListItem = {
    base_url: 'https://ncode.syosetu.com/n1234aa/',
    update_time: new Date('2025-01-15T10:30:00'),
    bookmark: 10,
    latest: 10,
    title: 'No Unread Novel',
    author_name: 'Test Author',
    completed: false,
    isR18: false,
  };

  const screen = await render(
    <NarouUpdateListItem
      data-testid="item"
      item={item}
      index={0}
      isSelected={false}
      setSelectedIndex={() => {/* nothing */}}
      selectDefault={() => {/* nothing */}}
      onSecondaryAction={() => {/* nothing */}}
    />
  );

  const element = screen.getByTestId('item');
  await expect.element(element).toMatchScreenshot('disabled-state.png');
});

test('visual: renders completed novel', async () => {
  const item: IsNoticeListItem = {
    base_url: 'https://ncode.syosetu.com/n1234aa/',
    update_time: new Date('2025-01-15T10:30:00'),
    bookmark: 5,
    latest: 10,
    title: 'Completed Novel',
    author_name: 'Test Author',
    completed: true,
    isR18: false,
    bewareNew: false,
  };

  const screen = await render(
    <NarouUpdateListItem
      data-testid="item"
      item={item}
      index={0}
      isSelected={false}
      setSelectedIndex={() => {/* nothing */}}
      selectDefault={() => {/* nothing */}}
      onSecondaryAction={() => {/* nothing */}}
    />
  );

  const element = screen.getByTestId('item');
  await expect.element(element).toMatchScreenshot('completed-state.png');
});

test('visual: renders R18 novel', async () => {
  const item: IsNoticeListItem = {
    base_url: 'https://novel18.syosetu.com/n1234aa/',
    update_time: new Date('2025-01-15T10:30:00'),
    bookmark: 5,
    latest: 10,
    title: 'R18 Novel',
    author_name: 'Test Author',
    completed: false,
    isR18: true,
    bewareNew: false,
  };

  const screen = await render(
    <NarouUpdateListItem
      data-testid="item"
      item={item}
      index={0}
      isSelected={false}
      setSelectedIndex={() => {/* nothing */}}
      selectDefault={() => {/* nothing */}}
      onSecondaryAction={() => {/* nothing */}}
    />
  );

  const element = screen.getByTestId('item');
  await expect.element(element).toMatchScreenshot('r18-state.png');
});
