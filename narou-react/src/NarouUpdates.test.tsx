import { createTheme, ThemeProvider } from '@mui/material/styles';
import { fireEvent, prettyDOM, render, screen } from '@testing-library/react';
import React from 'react';
import { act } from 'react-dom/test-utils';
import { SWRConfig } from 'swr';
import { ApiError } from "./narouApi/ApiError";
import { NarouApi } from './narouApi/NarouApi';
import { BookmarkInfo } from './narouApi/useBookmarkInfo';
import { NarouUpdates, nextBookmark, prevBookmark } from './NarouUpdates';

describe('bookmark', () => {
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
});

const theme = createTheme({});
function sleep(period: number) {
	return new Promise(resolve => setTimeout(resolve, period));
}

jest.mock('./narouApi/NarouApi');
const NarouApiMock = NarouApi as unknown as jest.Mock;

function setup() {
	const mockCall = jest.fn<Promise<any>, [string]>();
	const mockLogin = jest.fn(async (id: string, password: string): Promise<Response> => {
		return new Response();
	});

	NarouApiMock.mockImplementation(() => {
		return {
			call: mockCall,
			login: mockLogin,
		};
	})
	NarouApi.isnoticelist = jest.fn(() => 'isnoticelist');

	return { mockCall, mockLogin, api: new NarouApi('') };
}

test('login page when not logged in', async () => {
	const { mockCall, mockLogin, api } = setup();
	mockCall.mockImplementation(() => Promise.reject(new ApiError(401, 'not logged in')));

	await act(async () => {
		render(
			<ThemeProvider theme={theme}>
				<SWRConfig value={{ provider: () => new Map() }}>
					<NarouUpdates api={api} />
				</SWRConfig>
			</ThemeProvider>
		);
	});

	expect(mockCall).toHaveBeenCalled();

	const linkElement = screen.getByTestId('login-page');
	expect(linkElement).toBeInTheDocument();

	// login
	const id = screen.getByTestId('id').querySelector('input');
	// console.log(id && prettyDOM(id));
	const password = screen.getByTestId('password').querySelector('input');
	expect(id).toBeTruthy();
	expect(password).toBeTruthy();
	if (!id || !password) {
		throw new Error();
	}
	fireEvent.change(id, { target: { value: 'id' } });
	fireEvent.change(password, { target: { value: 'password' } });
	await act(async () => {
		fireEvent.click(screen.getByTestId('login'));
		await sleep(0);
	});
	expect(mockLogin).toHaveBeenCalledWith('id', 'password');
});

test('empty', async () => {
	const { mockCall, api } = setup();
	mockCall.mockImplementation(() => Promise.resolve([]));

	await act(async () => {
		render(
			<ThemeProvider theme={theme}>
				<SWRConfig value={{ provider: () => new Map() }}>
					<NarouUpdates api={api} />
				</SWRConfig>
			</ThemeProvider>
		);
	});

	expect(mockCall).toHaveBeenCalled();
	console.log(prettyDOM());
	// TODO
});