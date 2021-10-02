import { BookmarkInfo } from './narouApi/useBookmarkInfo'
import { nextBookmark, prevBookmark } from './NarouUpdates';

test('nextBookmark', () => {
  const state: BookmarkInfo = {
		0: { name: '0', num_items: 1 },
		2: { name: '2', num_items: 1 },
		3: { name: '3', num_items: 1 },
	};

	expect(nextBookmark(state, 0)).toBe(2);
	expect(nextBookmark(state, 1)).toBe(2);
	expect(nextBookmark(state, 2)).toBe(3);
	expect(nextBookmark(state, 3)).toBe(0);
	expect(nextBookmark(state, 4)).toBe(0);
	expect(nextBookmark({}, 0)).toBe(0);
})

test('prevBookmark', () => {
	const state: BookmarkInfo = {
		0: { name: '0', num_items: 1 },
		2: { name: '2', num_items: 1 },
		3: { name: '3', num_items: 1 },
	};

	expect(prevBookmark(state, 0)).toBe(3);
	expect(prevBookmark(state, 1)).toBe(0);
	expect(prevBookmark(state, 2)).toBe(0);
	expect(prevBookmark(state, 3)).toBe(2);
	expect(prevBookmark(state, 4)).toBe(3);
	expect(prevBookmark({}, 0)).toBe(0);
})
