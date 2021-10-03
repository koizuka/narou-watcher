import { DateTime } from 'luxon';
import { IsNoticeListItem } from './narouApi/IsNoticeListItem';
import { BookmarkInfo } from './narouApi/useBookmarkInfo'
import { ItemsState, itemsStateReducer, nextBookmark, prevBookmark } from './NarouUpdates';

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

describe('itemsStateReducer', () => {
	const dummyDateTime = DateTime.fromISO('2021-10-03T16:59:00+0900');
	const dummyItem: Omit<IsNoticeListItem, 'bookmark' | 'latest'> = {
		update_time: dummyDateTime,
		base_url: 'base_url',
		title: 'title',
		author_name: 'author',
		isR18: false,
	};

	describe('set', () => {
		const prevState: ItemsState = {
			unreads: null,
			selectedIndex: -1,
			defaultIndex: -1,
		};

		test('empty', () => {
			const items: IsNoticeListItem[] = [];
			expect(itemsStateReducer(prevState, { type: 'set', items })).toEqual({
				items,
				unreads: 0,
				selectedIndex: -1,
				defaultIndex: -1,
			});
		})

		test('one read item', () => {
			const items: IsNoticeListItem[] = [{ ...dummyItem, bookmark: 1, latest: 1 },
			];
			expect(itemsStateReducer(prevState, { type: 'set', items })).toEqual({
				items,
				unreads: 0,
				selectedIndex: -1,
				defaultIndex: -1,
			});
		})

		test('one unread item', () => {
			const items: IsNoticeListItem[] = [{ ...dummyItem, bookmark: 1, latest: 2 },
			];
			expect(itemsStateReducer(prevState, { type: 'set', items })).toEqual({
				items,
				unreads: 1,
				selectedIndex: 0,
				defaultIndex: 0,
			});
		})
	})

	describe('select', () => {
		const prevState: ItemsState = {
			items: [
				{ ...dummyItem, bookmark: 1, latest: 2 },
				{ ...dummyItem, bookmark: 2, latest: 2 },
			],
			unreads: 1,
			selectedIndex: -1,
			defaultIndex: -1,
		};

		test.each<[number, number]>([
			[-2, -1],
			[-1, -1],
			[0, 0],
			[1, 1],
			[2, 1],
		])('%d -> %d', (index, expected) => {
			expect(itemsStateReducer(prevState, { type: 'select', index }).selectedIndex).toBe(expected);
		});
	})
});

test.todo('NarouUpdates');
		// const callSpy = jest.spyOn(NarouApi.prototype, 'call').mockReturnValue()
		// const narouApi = new NarouApi('server');
