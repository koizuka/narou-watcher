import React, { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import { AutoLinkText } from './AutoLinkText';

const text = "this is https://example.com https://example2.com";

test('AutoLinkText', async () => {
  await act(async () => {
    render(
      <div data-testid="target">
        <AutoLinkText text={text} />
      </div>
    );
  });

  const target = screen.getByTestId('target');
  expect(target).toBeInTheDocument();

  expect(target.textContent).toBe(text);

  const a = target.querySelectorAll('a');
  expect(a.length).toBe(2);
  expect(a[0].href).toBe('https://example.com/');
  expect(a[1].href).toBe('https://example2.com/');
});
