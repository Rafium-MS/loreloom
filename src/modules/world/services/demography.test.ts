import { describe, it, expect } from 'vitest';
import { calcularDensidade } from './demography';

describe('calcularDensidade', () => {
  it('retorna categorias corretas', () => {
    expect(calcularDensidade(1000, 0)).toBe('desolado');
    expect(calcularDensidade(1000, 2)).toBe('baixo');
    expect(calcularDensidade(1000, 7)).toBe('novo assentamento');
    expect(calcularDensidade(1000, 12)).toBe('medio');
    expect(calcularDensidade(1000, 17)).toBe('alto');
    expect(calcularDensidade(1000, 25)).toBe('maximo');
  });
});
