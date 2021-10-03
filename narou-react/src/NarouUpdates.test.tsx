import { BookmarkInfo } from './narouApi/useBookmarkInfo'
import { nextBookmark, prevBookmark } from './NarouUpdates';

jest.mock('./narouApi/NarouApi');

test('nextBookmark', () => {
	const state: BookmarkInfo = {
		1: { name: '1', num_items: 1 },
		3: { name: '3', num_items: 1 },
	};

	expect(nextBookmark(state, 0)).toBe(1);
	expect(nextBookmark(state, 1)).toBe(3);
	expect(nextBookmark(state, 2)).toBe(3);
	expect(nextBookmark(state, 3)).toBe(0);
	expect(nextBookmark(state, 4)).toBe(0);
	expect(nextBookmark({}, 0)).toBe(0);
})

test('prevBookmark', () => {
	const state: BookmarkInfo = {
		1: { name: '1', num_items: 1 },
		3: { name: '3', num_items: 1 },
	};

	expect(prevBookmark(state, 0)).toBe(3);
	expect(prevBookmark(state, 1)).toBe(0);
	expect(prevBookmark(state, 2)).toBe(1);
	expect(prevBookmark(state, 3)).toBe(1);
	expect(prevBookmark(state, 4)).toBe(3);
	expect(prevBookmark({}, 0)).toBe(0);
})

test.todo('NarouUpdates');
		// const callSpy = jest.spyOn(NarouApi.prototype, 'call').mockReturnValue()
		// const narouApi = new NarouApi('server');
