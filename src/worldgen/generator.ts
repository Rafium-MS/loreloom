// === worldgen/generator.ts ==================================================
// === worldgen/generator.ts (INTEGRAÇÃO) ====================================
import { generateResources, attachResourcesToSettlements } from './resources'
import { WORLD_PROFILES } from './profiles'
import { connectFluvial, connectMaritime } from './routes'


// Dentro da função generateWorld(cfg: WorldConfig):
// 1) Aplicar perfil se fornecido
// const profile = cfg.profile ? WORLD_PROFILES.find(p=>p.id===cfg.profile) : undefined
// if (profile) { /* aqui você pode ajustar cfg.tempBias, moistureBias, etc. ou guardar p/ decisões */ }
// ... (após gerar tiles e settlements)
// 2) Recursos
// const resourceNodes = generateResources(tiles, cfg)
// attachResourcesToSettlements(resourceNodes, settlements)
// 3) Rotas existentes + aquáticas
// const roadRoutes = connectSettlements(tiles, cfg, settlements)
// const riverRoutes = connectFluvial(tiles, cfg, settlements)
// const seaRoutes = connectMaritime(tiles, cfg, settlements)
// const routes = [...roadRoutes, ...riverRoutes, ...seaRoutes]
// 4) Retorne resourceNodes opcionalmente em catalog
// return { ... , catalog: { regions, settlements, routes, resources: resourceNodes as any } }
for (let x = 0; x < W; x++) {
const i = idx(x, y)
const e = elev[i]
const isWater = e < sea
const t = temperature[i]
const m = moisture[i]
const b = classifyBiome(e, t, m)
tiles.push({
x,
y,
elevation: e,
slope: slope[i],
temperature: t,
moisture: m,
isWater,
biome: b,
river: isWater ? 0 : flow[i],
})
}
}


// 4) Assentamentos
const desired = Math.max(6, Math.floor((W * H) / 800))
const settlements = spawnSettlements(tiles, cfg, desired)


// 5) Regiões (partição simples por sementes a partir das maiores cidades)
const seeds = settlements
.filter((s) => s.kind === 'Cidade' || s.kind === 'CidadeEstado')
.slice(0, Math.max(2, Math.floor(settlements.length / 6)))
const regions: Region[] = seeds.map((s, i) => ({
id: `G${i}`,
kind: s.kind === 'CidadeEstado' ? 'Reino' : 'Reino',
name: s.kind === 'CidadeEstado' ? `Cidade‑Estado ${i + 1}` : `Reino ${i + 1}`,
color: `hsl(${(i * 137) % 360} 60% 50%)`,
tiles: 0,
centroid: { ...s.pos },
civLevel: s.civLevel,
}))
// Voronoi por vizinho mais próximo
for (const t of tiles) {
let best = 0
let bd = Infinity
regions.forEach((r, i) => {
const dx = r.centroid.x - t.x
const dy = r.centroid.y - t.y
const d = dx * dx + dy * dy
if (d < bd) {
bd = d
best = i
}
})
t.regionId = regions[best].id
regions[best].tiles++
}
settlements.forEach((s) => {
// anexar ao Voronoi
const region = regions.reduce((acc, r) => {
const d = (r.centroid.x - s.pos.x) ** 2 + (r.centroid.y - s.pos.y) ** 2
return d < (acc?.d ?? Infinity) ? { r, d } : acc
}, null as null | { r: Region; d: number })?.r
if (region) s.regionId = region.id
})


// 6) Rotas
const routes = connectSettlements(tiles, cfg, settlements)


return {
config: cfg,
layers: { tiles, regions, settlements, routes },
catalog: { regions, settlements, routes },
}
}