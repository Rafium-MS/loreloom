// === worldgen/routes.ts (EXTENSÃO AQUÁTICA) ================================
guard++
path.push({x:cx,y:cy})
let best = {x:cx,y:cy, score: -Infinity}
for (let oy=-1;oy<=1;oy++) for (let ox=-1;ox<=1;ox++){
if (!ox && !oy) continue
const xx=cx+ox, yy=cy+oy
if (xx<0||yy<0||xx>=cfg.width||yy>=cfg.height) continue
const t=tiles[idx(xx,yy)]
const dir = -((B.pos.x-xx)**2+(B.pos.y-yy)**2)
const score = (t.river>=riverThreshold? 10:0) + dir*0.01 - (t.isWater?0.5:0)
if (score>best.score) best={x:xx,y:yy,score}
}
if (best.x===cx && best.y===cy) break
cx=best.x; cy=best.y
}
path.push(B.pos)
if (path.length>6){
routes.push({ id:`RF-${A.id}-${B.id}`, kind:'fluvial', fromId:A.id, toId:B.id, path, cost: Math.max(1, Math.floor(path.length/3)) })
linked++
}
}
}
return routes
}


export function connectMaritime(
tiles: Tile[], cfg: WorldConfig, settlements: Settlement[], maxHop = 120,
): Route[] {
const ports = settlements.filter((s)=> s.tags.includes('porto'))
const routes: Route[] = []
function waterPath(a: Point, b: Point): Point[] {
// linha reta com correção: aceita apenas tiles de água; se bater em terra, aborta
const dx = b.x - a.x, dy = b.y - a.y
const steps = Math.max(Math.abs(dx), Math.abs(dy))
const path: Point[] = []
for (let i=0;i<=steps;i++){
const x = Math.round(a.x + (dx*i)/steps)
const y = Math.round(a.y + (dy*i)/steps)
const t = tiles[y*cfg.width + x]
if (!t || !t.isWater) return []
path.push({x,y})
}
return path
}
// conectar pares por gravidade marítima limitada por distância
for (let i=0;i<ports.length;i++){
for (let j=i+1;j<ports.length;j++){
const A=ports[i], B=ports[j]
const d2 = (A.pos.x-B.pos.x)**2 + (A.pos.y-B.pos.y)**2
if (d2>maxHop*maxHop) continue
const path = waterPath(A.pos, B.pos)
if (path.length){
routes.push({ id:`RM-${A.id}-${B.id}`, kind:'maritima', fromId:A.id, toId:B.id, path, cost: Math.max(1, Math.floor(path.length/5)) })
}
}
}
return routes
}