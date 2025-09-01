// === worldgen/resources.ts ==================================================
// minérios em escarpas/montanhas secas
if (t.elevation > 0.65 && (t.biome.includes('Escarpa') || t.biome.includes('Pico'))) {
if (oreNoise > 0.58) push('Ferro', x, y, oreNoise)
if (oreNoise > 0.62) push('Cobre', x, y, oreNoise - 0.05)
}
// carvão em regiões antigas e secas
if (!t.isWater && t.moisture < 0.45 && oreNoise > 0.6) push('Carvao', x, y, oreNoise)
// pedreiras em encostas
if (t.slope > 0.45 && !t.isWater) push('Pedra', x, y, 0.4 + t.slope * 0.6)
// argila em várzeas úmidas
if (t.moisture > 0.6 && clayNoise > 0.55) push('Argila', x, y, clayNoise)
// madeira em biomas florestais
if (t.biome.includes('Floresta') || t.biome.includes('Bosque')) push('Madeira', x, y, 0.5 + t.moisture * 0.4)
// sal em regiões áridas
if (t.biome.includes('Deserto') && oreNoise > 0.57) push('Sal', x, y, oreNoise)
// trigo/vinho em terras férteis
if (t.moisture > 0.55 && grainNoise > 0.55) push('Trigo', x, y, grainNoise)
if (t.moisture > 0.5 && t.temperature > 0.5 && grainNoise > 0.58) push('Vinho', x, y, grainNoise)
// pecuária em campos/savanas
if (t.biome.includes('Campos') || t.biome.includes('Estepe')) push('Pecuaria', x, y, 0.4 + (1 - t.moisture) * 0.3)
}
}
return nodes
}


export function attachResourcesToSettlements(nodes: ResourceNode[], settlements: Settlement[], maxDistTiles = 8) {
for (const s of settlements) {
const owned = nodes
.filter((n) => (n.pos.x - s.pos.x) ** 2 + (n.pos.y - s.pos.y) ** 2 <= maxDistTiles ** 2)
.sort((a, b) => b.richness - a.richness)
.slice(0, 5)
s.resources = Array.from(new Set([...s.resources, ...owned.map((n) => n.kind)])) as any
if (s.resources.includes('Ferro') && s.resources.includes('Carvao')) s.tags.push('forjas')
if (s.resources.includes('Madeira')) s.tags.push('serraria')
if (s.resources.includes('Trigo') || s.resources.includes('Pecuaria')) s.tags.push('agronegocio')
if (s.resources.includes('Peixe')) s.tags.push('pesqueiro')
if (!s.tags.includes('porto') && s.resources.includes('Peixe')) s.tags.push('porto')
}
}