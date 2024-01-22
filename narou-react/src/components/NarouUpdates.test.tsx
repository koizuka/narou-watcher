import { createTheme, ThemeProvider } from '@mui/material/styles';
import React, { fireEvent, render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { SWRConfig } from 'swr';
import { ApiError } from "../narouApi/ApiError";
import { NarouApi } from '../narouApi/NarouApi';
import { NarouUpdates } from './NarouUpdates';
import { expect, test, vi } from 'vitest';

const theme = createTheme({});
function sleep(period: number) {
	return new Promise(resolve => setTimeout(resolve, period));
}

vi.mock('../narouApi/NarouApi');
const NarouApiMock = vi.mocked(NarouApi);

function setup() {
	const mockCall = vi.fn<[string], Promise<unknown>>();
	const mockLogin = vi.fn(async (): Promise<Response> => {
		return Promise.resolve(new Response());
	});

	NarouApiMock.mockImplementation(() => {
		return {
			call: mockCall,
			login: mockLogin,
		} as unknown as NarouApi;
	})
	NarouApi.isnoticelist = vi.fn(() => 'isnoticelist');

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
		return Promise.resolve();
	});

	expect(mockCall).toHaveBeenCalled();
	// console.log(prettyDOM());
	// TODO
});