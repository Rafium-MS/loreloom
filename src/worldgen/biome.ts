// === worldgen/biome.ts =====================================================
export function classifyBiome(e: number, t: number, m: number): string {
if (e < 0.05) return 'Oceano'
if (e < 0.07) return 'Costa'
// Montanha gelada
if (e > 0.8 && t < 0.3) return 'Pico Gelado'
if (e > 0.7 && m < 0.3) return 'Escarpa Rochosa'
// Desertos
if (m < 0.2 && t > 0.6) return 'Deserto Quente'
if (m < 0.2 && t <= 0.6) return 'Estepe/Frio Seco'
// Florestas e campos
if (m > 0.65 && t > 0.5) return 'Floresta Tropical'
if (m > 0.55 && t <= 0.5) return 'Floresta Temperada'
if (m > 0.45) return 'Bosque/Transição'
// Pastos e tundra
if (t < 0.3 && m > 0.4) return 'Tundra'
return 'Campos/Savana'
}