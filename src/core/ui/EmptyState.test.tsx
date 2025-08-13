import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import EmptyState from './EmptyState';

describe('EmptyState', () => {
  it('renders the provided message', () => {
    render(<EmptyState message="No data" />);
    expect(screen.getByText('No data')).toBeInTheDocument();
  });

  it('triggers action when button clicked', () => {
    const handleAction = vi.fn();
    render(
      <EmptyState message="No data" actionLabel="Create" onAction={handleAction} />
    );
    const button = screen.getByRole('button', { name: /create/i });
    fireEvent.click(button);
    expect(handleAction).toHaveBeenCalled();
  });
});
