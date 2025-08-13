import { render, screen, fireEvent, act } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import { ToastProvider, useToast } from './Toast';

const TestComponent = () => {
  const { addToast } = useToast();
  return (
    <button onClick={() => addToast({ type: 'success', message: 'Saved' })}>
      Show Toast
    </button>
  );
};

describe('ToastProvider', () => {
  it('displays toast when addToast is called', () => {
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /show toast/i }));
    expect(screen.getByText('Saved')).toBeInTheDocument();
  });

  it('removes toast after timeout', () => {
    vi.useFakeTimers();
    render(
      <ToastProvider>
        <TestComponent />
      </ToastProvider>
    );

    fireEvent.click(screen.getByRole('button', { name: /show toast/i }));
    expect(screen.getByText('Saved')).toBeInTheDocument();

    act(() => {
      vi.runAllTimers();
    });

    expect(screen.queryByText('Saved')).not.toBeInTheDocument();
    vi.useRealTimers();
  });
});
