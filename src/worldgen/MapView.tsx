// === components/MapView.tsx ================================================
if (t.river > 180 && !t.isWater) {
ctx.rect(t.x * tileSize, t.y * tileSize, tileSize, tileSize)
}
}
ctx.stroke()
}


if (show.regions) {
ctx.globalAlpha = 0.18
for (const r of regions) {
ctx.fillStyle = r.color
for (const t of tiles) if (t.regionId === r.id) ctx.fillRect(t.x * tileSize, t.y * tileSize, tileSize, tileSize)
}
ctx.globalAlpha = 1
}


if (show.routes) {
ctx.lineWidth = 2
ctx.strokeStyle = '#e9d27d'
ctx.beginPath()
for (const r of routes) {
for (let i = 1; i < r.path.length; i++) {
const a = r.path[i - 1]
const b = r.path[i]
ctx.moveTo((a.x + 0.5) * tileSize, (a.y + 0.5) * tileSize)
ctx.lineTo((b.x + 0.5) * tileSize, (b.y + 0.5) * tileSize)
}
}
ctx.stroke()
}


if (show.settlements) {
for (const s of settlements) {
ctx.fillStyle = '#fff'
const r = s.kind === 'Cidade' || s.kind === 'CidadeEstado' ? 3 : s.kind === 'Vila' ? 2 : 1
ctx.beginPath()
ctx.arc((s.pos.x + 0.5) * tileSize, (s.pos.y + 0.5) * tileSize, r, 0, Math.PI * 2)
ctx.fill()
}
}
}, [tiles, settlements, routes, regions, show, tileSize, width, height])


return <canvas ref={canvasRef} className="rounded-xl shadow border border-[var(--border,#2a2f3b)]" />
}


function biomeColor(name: string, water: boolean) {
if (water) return '#17456f'
const map: Record<string, string> = {
Oceano: '#123a6b',
Costa: '#2a6f8a',
'Pico Gelado': '#dfe7ef',
'Escarpa Rochosa': '#77746d',
'Deserto Quente': '#d1b274',
'Estepe/Frio Seco': '#cabd91',
'Floresta Tropical': '#1f6b3a',
'Floresta Temperada': '#2f7d4a',
'Bosque/Transição': '#397c56',
Tundra: '#b7c6cd',
'Campos/Savana': '#8fae62',
}
return map[name] ?? '#366a54'
}