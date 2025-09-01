// === worldgen/routes.ts =====================================================
dist.set(vk, nd)
prev.set(vk, uk)
push(nd, v)
}
}
}
const path: Point[] = []
let cur = key(b)
if (!prev.has(cur) && cur !== startK) return { path: [], cost: Infinity }
path.push(b)
while (cur !== startK) {
const p = prev.get(cur)!
const x = p % w
const y = (p / w) | 0
path.push({ x, y })
cur = p
}
path.push(a)
path.reverse()
const cost = dist.get(key(b)) ?? Infinity
return { path, cost }
}


// gravidade: liga pares mais importantes
const pairs: { i: number; j: number; weight: number }[] = []
for (let i = 0; i < settlements.length; i++) {
for (let j = i + 1; j < settlements.length; j++) {
const w = settlements[i].population * settlements[j].population
pairs.push({ i, j, weight: w })
}
}
pairs.sort((a, b) => b.weight - a.weight)


const connected = new Set<string>()
for (const p of pairs.slice(0, Math.min(pairs.length, 8 + settlements.length))) {
const A = settlements[p.i]
const B = settlements[p.j]
const { path, cost } = dijkstra(A.pos, B.pos)
if (!path.length || !isFinite(cost)) continue
const id = `R${A.id}-${B.id}`
// evitar sobreposição redundante
if (connected.has(id)) continue
connected.add(id)
routes.push({ id, kind: 'estrada', fromId: A.id, toId: B.id, path, cost })
}
return routes
}