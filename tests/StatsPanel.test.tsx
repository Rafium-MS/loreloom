import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import StatsPanel from '../src/components/StatsPanel';

vi.mock('react-chartjs-2', () => ({
  Pie: () => <div data-testid="pie-chart" />,
  Bar: () => <div data-testid="bar-chart" />,
}));

const characters = [
  { role: 'hero' },
  { role: 'villain' },
  { role: 'hero' },
];

const locations = [
  { name: 'City', type: 'urban', population: 1000, army: { size: 100 } },
  { name: 'Forest', type: 'rural', population: 200, army: { size: 20 } },
];

describe('StatsPanel', () => {
  it('renders total statistics', () => {
    const onClose = vi.fn();
    render(<StatsPanel characters={characters} locations={locations} onClose={onClose} />);
    const totalPopulation = (1000 + 200).toLocaleString();
    const totalArmy = (100 + 20).toLocaleString();
    expect(screen.getByText(`População total: ${totalPopulation}`)).toBeInTheDocument();
    expect(screen.getByText(`Força militar total: ${totalArmy}`)).toBeInTheDocument();
  });

  it('allows filtering by character role', () => {
    const onClose = vi.fn();
    render(<StatsPanel characters={characters} locations={locations} onClose={onClose} />);
    const roleSelect = screen.getByLabelText('Tipo de personagem');
    fireEvent.change(roleSelect, { target: { value: 'villain' } });
    expect((roleSelect as HTMLSelectElement).value).toBe('villain');
  });
});
