import React, { useMemo, useState } from 'react'
max={1}
step={0.01}
value={cfg.tempBias}
onChange={(e) => setCfg({ ...cfg, tempBias: +e.target.value })}
/>


<label className="text-xs opacity-70">Umidade</label>
<input
type="range"
min={-1}
max={1}
step={0.01}
value={cfg.moistureBias}
onChange={(e) => setCfg({ ...cfg, moistureBias: +e.target.value })}
/>


<label className="text-xs opacity-70">Civilização</label>
<select value={cfg.civLevel} onChange={(e) => setCfg({ ...cfg, civLevel: e.target.value as any })}>
<option>Civilizado</option>
<option>SemiCivilizado</option>
<option>Selvagem</option>
<option>Monstruoso</option>
</select>
</div>
<div className="flex gap-2 mt-3">
<button className="btn" onClick={onGenerate}>
Gerar
</button>
<button className="btn" onClick={onExport} disabled={!world}>
Exportar JSON
</button>
</div>
</div>
<div className="p-3 rounded-xl border shadow-sm">
<h3 className="font-semibold mb-2">Camadas</h3>
{(
[
['height', 'Altimetria'],
['biome', 'Biomas'],
['rivers', 'Rios'],
['regions', 'Regiões'],
['routes', 'Rotas'],
['settlements', 'Assentamentos'],
] as const
).map(([k, label]) => (
<label key={k} className="block text-sm">
<input
type="checkbox"
className="mr-2"
checked={(show as any)[k]}
onChange={(e) => setShow((s) => ({ ...s, [k]: e.target.checked }))}
/>
{label}
</label>
))}
</div>
{world && (
<div className="p-3 rounded-xl border shadow-sm text-sm opacity-80">
<div>Regiões: {world.layers.regions.length}</div>
<div>Assentamentos: {world.layers.settlements.length}</div>
<div>Rotas: {world.layers.routes.length}</div>
</div>
)}
</div>
<div className="lg:col-span-9">
{world ? (
<MapView layers={world.layers} show={show} tileSize={6} />
) : (
<div className="h-[70vh] grid place-items-center border rounded-xl">Gere um mundo para visualizar aqui</div>
)}
</div>
</div>
)
}