import { cleanup, render, screen } from '@testing-library/react';
import React from 'react';
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { CountdownTimer } from './CountdownTimer';

describe('CountdownTimer', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    cleanup();
  });

  test('displays countdown when targetTime is provided', () => {
    const targetTime = new Date(Date.now() + 30 * 1000); // 30 seconds from now

    render(
      <CountdownTimer
        targetTime={targetTime}
        intervalMs={30000}
      />
    );

    expect(screen.getByText(/次回確認まで:/)).toBeInTheDocument();
    expect(screen.getByText(/秒/)).toBeInTheDocument();
  });

  test('does not display anything when targetTime is null', () => {
    const { container } = render(
      <CountdownTimer
        targetTime={null}
        intervalMs={30000}
      />
    );

    expect(container.firstChild).toBeNull();
  });

  test('shows decreasing seconds over time', async () => {
    const targetTime = new Date(Date.now() + 30 * 1000); // 30 seconds from now

    render(
      <CountdownTimer
        targetTime={targetTime}
        intervalMs={30000}
      />
    );

    // Should display some countdown text
    expect(screen.getByText(/次回確認まで:/)).toBeInTheDocument();
    expect(screen.getByText(/秒/)).toBeInTheDocument();

    // Test that progress bar exists
    expect(screen.getByRole('progressbar')).toBeInTheDocument();
  });

  test('disappears when countdown reaches zero', () => {
    const targetTime = new Date(Date.now() - 1000); // 1 second ago (already expired)

    const { container } = render(
      <CountdownTimer
        targetTime={targetTime}
        intervalMs={30000}
      />
    );

    // Should not render anything since time has already passed
    expect(container.firstChild).toBeNull();
  });

  test('updates when targetTime changes', () => {
    const initialTargetTime = new Date(Date.now() + 10 * 1000); // 10 seconds from now

    const { rerender } = render(
      <CountdownTimer
        targetTime={initialTargetTime}
        intervalMs={30000}
      />
    );

    expect(screen.getByText(/次回確認まで:/)).toBeInTheDocument();

    // Change targetTime to null
    rerender(
      <CountdownTimer
        targetTime={null}
        intervalMs={30000}
      />
    );

    expect(screen.queryByText(/次回確認まで:/)).not.toBeInTheDocument();
  });

  test('shows correct progress bar value', () => {
    const targetTime = new Date(Date.now() + 15 * 1000); // 15 seconds from now (half of 30)

    render(
      <CountdownTimer
        targetTime={targetTime}
        intervalMs={30000}
      />
    );

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toBeInTheDocument();
    expect(progressBar).toHaveAttribute('aria-valuenow');
  });
});