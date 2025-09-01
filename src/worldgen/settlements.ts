// === worldgen/settlements.ts ===============================================


const sorted = [...field].sort((a, b) => b.score - a.score)
for (const s of sorted) {
if (picked.length >= maxCount) break
// rejeitar se houver um selecionado muito perto
if (picked.some((p) => (p.pos.x - s.pos.x) ** 2 + (p.pos.y - s.pos.y) ** 2 < minDistanceTiles ** 2)) continue
picked.push(s)
}
return picked
}


export function spawnSettlements(
tiles: Tile[],
cfg: WorldConfig,
desiredCount: number,
): Settlement[] {
const suit = computeSuitabilityField(tiles, cfg)
const peaks = pickPeaks(suit.filter((s) => s.score > 0.2), 8, desiredCount)
// classificar por pontuação para definir hierarquia
const ordered = [...peaks].sort((a, b) => b.score - a.score)
const result: Settlement[] = []
ordered.forEach((s, i) => {
const top = i < Math.max(1, Math.floor(ordered.length * 0.12)))
const kind: Settlement['kind'] = top ? 'Cidade' : i < ordered.length * 0.5 ? 'Vila' : 'Aldeia'


const densityPreset = BASE_DENSITY[cfg.civLevel]
const density =
kind === 'Cidade' ? densityPreset.city : kind === 'Vila' ? densityPreset.town : densityPreset.village


let verticality = densityPreset.verticality
if (s.tags.includes('porto')) verticality += 0.15


const buildable = Math.max(0.4, s.buildableKm2 * 0.6)
const population = Math.round(density * verticality * buildable)


result.push({
id: `S${i}`,
name: kind === 'Cidade' ? `Cidade ${i + 1}` : kind === 'Vila' ? `Vila ${i + 1}` : `Aldeia ${i + 1}`,
kind,
pos: s.pos,
civLevel: cfg.civLevel,
population,
density,
buildableKm2: Number(buildable.toFixed(2)),
fortification: (kind === 'Cidade' ? 2 : 1) as 1 | 2,
tags: s.tags,
resources: [],
})
})
// opcional: promover primeira cidade como cidade-estado se número for baixo
if (result.length > 0 && result.length < 6) {
result[0].kind = 'CidadeEstado'
result[0].isCapital = true
result[0].fortification = 3
}
return result
}