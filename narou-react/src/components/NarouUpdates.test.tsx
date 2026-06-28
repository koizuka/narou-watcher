import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { act } from 'react';
import { SWRConfig } from 'swr';
import { beforeEach, expect, test, vi } from 'vitest';
import { ApiError } from "../narouApi/ApiError";
import { NarouApi } from '../narouApi/NarouApi';
import { NarouUpdates } from './NarouUpdates';

const theme = createTheme({});
function sleep(period: number) {
	return new Promise(resolve => setTimeout(resolve, period));
}

vi.mock('../narouApi/NarouApi');
const NarouApiMock = vi.mocked(NarouApi);

function setup() {
	const mockCall = vi.fn<(s: string) => Promise<unknown>>();
	const mockLogin = vi.fn(async (): Promise<Response> => {
		return Promise.resolve(new Response());
	});

	NarouApiMock.mockImplementation(function() {
		return {
			call: mockCall,
			login: mockLogin,
		} as unknown as NarouApi;
	})
	NarouApi.isnoticelist = vi.fn(() => 'isnoticelist');
	NarouApi.notification = vi.fn(() => '/narou/notification');
	NarouApi.checkNovelAccess = vi.fn((ncode: string, episode: number, r18: boolean) =>
		`${r18 ? '/r18' : '/narou'}/check-novel-access/${ncode}/${episode}`
	);

	return { mockCall, mockLogin, api: new NarouApi('') };
}

beforeEach(() => {
	vi.clearAllMocks();
});

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
		return Promise.resolve();
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
	expect(mockLogin).toHaveBeenCalledExactlyOnceWith('id', 'password');
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
		return Promise.resolve();
	});

	expect(mockCall).toHaveBeenCalled();
	// console.log(prettyDOM());
	// TODO
});

test('shows notification badge on user home button when has_notification is true', async () => {
	const { mockCall, api } = setup();
	mockCall.mockImplementation((key: string) => {
		if (key === 'isnoticelist') {
			return Promise.resolve([]);
		}
		if (key === '/narou/notification') {
			return Promise.resolve({ has_notification: true, count: 1 });
		}
		return Promise.reject(new Error(`Unexpected API call: ${key}`));
	});

	let container: HTMLElement = document.createElement('div');
	await act(async () => {
		container = render(
			<ThemeProvider theme={theme}>
				<SWRConfig value={{ provider: () => new Map() }}>
					<NarouUpdates api={api} />
				</SWRConfig>
			</ThemeProvider>
		).container;
		return Promise.resolve();
	});

	// variant="dot" のバッジは通知ボタン専用なので一意に取得できる
	await waitFor(() => {
		const dot = container.querySelector('.MuiBadge-dot');
		expect(dot).toBeTruthy();
		expect(dot?.classList.contains('MuiBadge-invisible')).toBe(false);
	});
});

test('hides notification badge on user home button when has_notification is false', async () => {
	const { mockCall, api } = setup();
	mockCall.mockImplementation((key: string) => {
		if (key === 'isnoticelist') {
			return Promise.resolve([]);
		}
		if (key === '/narou/notification') {
			return Promise.resolve({ has_notification: false, count: 0 });
		}
		return Promise.reject(new Error(`Unexpected API call: ${key}`));
	});

	let container: HTMLElement = document.createElement('div');
	await act(async () => {
		container = render(
			<ThemeProvider theme={theme}>
				<SWRConfig value={{ provider: () => new Map() }}>
					<NarouUpdates api={api} />
				</SWRConfig>
			</ThemeProvider>
		).container;
		return Promise.resolve();
	});

	// notification を取得した後もバッジは invisible のまま
	await waitFor(() => {
		const calls = mockCall.mock.calls;
		expect(calls.some(call => call[0] === '/narou/notification')).toBe(true);
	});
	const dot = container.querySelector('.MuiBadge-dot');
	expect(dot).toBeTruthy();
	expect(dot?.classList.contains('MuiBadge-invisible')).toBe(true);
});

test('proactively checks first beware novel accessibility', async () => {
	const { mockCall, api } = setup();

	const now = Date.now();
	const recentTime = new Date(now - 60 * 1000).toISOString(); // 1 minute ago (within BEWARE_TIME)
	const oldTime = new Date(now - 10 * 60 * 1000).toISOString(); // 10 minutes ago (beyond BEWARE_TIME)

	const mockItems = [
		{
			base_url: 'https://ncode.syosetu.com/n1111aa/',
			update_time: recentTime,
			bookmark: 5,
			latest: 6,
			title: 'Recent Novel (Beware)',
			author_name: 'Author 1',
			completed: false,
			isR18: false,
		},
		{
			base_url: 'https://ncode.syosetu.com/n2222bb/',
			update_time: oldTime,
			bookmark: 3,
			latest: 4,
			title: 'Old Novel',
			author_name: 'Author 2',
			completed: false,
			isR18: false,
		},
	];

	// First call returns the novel list, subsequent calls are for proactive checks
	mockCall.mockImplementation((key: string) => {
		if (key === 'isnoticelist') {
			return Promise.resolve(mockItems);
		}
		if (key === '/narou/notification') {
			return Promise.resolve({ has_notification: false, count: 0 });
		}
		// Proactive check for the first beware novel
		if (key === '/narou/check-novel-access/n1111aa/6') {
			return Promise.resolve({ accessible: true, statusCode: 200 });
		}
		return Promise.reject(new Error(`Unexpected API call: ${key}`));
	});

	await act(async () => {
		render(
			<ThemeProvider theme={theme}>
				<SWRConfig value={{ provider: () => new Map() }}>
					<NarouUpdates api={api} />
				</SWRConfig>
			</ThemeProvider>
		);
		return Promise.resolve();
	});

	// Wait for proactive check to be called
	await waitFor(() => {
		const calls = mockCall.mock.calls;
		const found = calls.some(call => call[0] === '/narou/check-novel-access/n1111aa/6');
		expect(found).toBe(true);
	}, { timeout: 3000 });
});

test('does not check if no beware novels exist', async () => {
	const { mockCall, api } = setup();

	const oldTime = new Date(Date.now() - 10 * 60 * 1000).toISOString(); // 10 minutes ago

	const mockItems = [
		{
			base_url: 'https://ncode.syosetu.com/n1111aa/',
			update_time: oldTime,
			bookmark: 5,
			latest: 6,
			title: 'Old Novel',
			author_name: 'Author 1',
			completed: false,
			isR18: false,
		},
	];

	mockCall.mockImplementation((key: string) => {
		if (key === 'isnoticelist') {
			return Promise.resolve(mockItems);
		}
		if (key === '/narou/notification') {
			return Promise.resolve({ has_notification: false, count: 0 });
		}
		return Promise.reject(new Error(`Unexpected API call: ${key}`));
	});

	await act(async () => {
		render(
			<ThemeProvider theme={theme}>
				<SWRConfig value={{ provider: () => new Map() }}>
					<NarouUpdates api={api} />
				</SWRConfig>
			</ThemeProvider>
		);
		return Promise.resolve();
	});

	// Wait a bit to ensure no proactive check is made
	await sleep(200);

	// Should only have called isnoticelist, not checkNovelAccess
	const calls = mockCall.mock.calls;
	expect(calls.some(call => call[0] === 'isnoticelist')).toBe(true);
	const hasCheckCall = calls.some(call => typeof call[0] === 'string' && call[0].includes('check-novel-access'));
	expect(hasCheckCall).toBe(false);
});

