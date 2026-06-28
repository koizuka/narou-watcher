import { describe, expect, test } from 'vitest';
import { isClearableCacheKey } from './useIsNoticeList';

describe('isClearableCacheKey', () => {
  test.each([
    // クエリ文字列付きの実キー(以前は完全一致せず無効化されなかったケース)
    '/narou/isnoticelist?max_page=1',
    '/r18/isnoticelist?max_page=2',
    '/narou/bookmarks/3?order=updated_at',
    '/r18/bookmarks/1?order=new',
    // クエリ無しのキー
    '/narou/isnoticelist',
    '/r18/isnoticelist',
    '/narou/bookmarks/',
    '/r18/bookmarks/',
    '/narou/notification',
  ])('clears %s', (key) => {
    expect(isClearableCacheKey(key)).toBe(true);
  });

  test.each([
    '/narou/novels/n1234ab',
    '/r18/novels/n1234ab',
    '/narou/check-novel-access/n1234ab/5',
    '/narou/login',
    'isnoticelist', // 先頭スラッシュ無しのテスト用キー
    '',
  ])('does not clear %s', (key) => {
    expect(isClearableCacheKey(key)).toBe(false);
  });

  test('ignores non-string keys', () => {
    expect(isClearableCacheKey(null)).toBe(false);
    expect(isClearableCacheKey(undefined)).toBe(false);
    expect(isClearableCacheKey(['/narou/isnoticelist'])).toBe(false);
  });
});
