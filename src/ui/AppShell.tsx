// =============================


<div className="hidden md:flex items-center gap-2">
<div className="relative">
<Search className="absolute left-2 top-2.5 h-4 w-4 opacity-60"/>
<input
placeholder="Pesquisar (Ctrl/⌘+K)"
className="pl-8 pr-3 py-2 text-sm bg-transparent border rounded-md"
style={{ borderColor: 'var(--border)' }}
/>
</div>
<ThemeToggle/>
{rightActions}
</div>
</div>
</header>


<div className="flex flex-1 min-h-0">
{/* Sidebar */}
<aside className="w-60 border-r" style={{ borderColor: 'var(--border)' }}>
<nav className="p-2 space-y-1">
{tabs.map((t) => (
<button
key={t.id}
onClick={() => onTabChange(t.id)}
className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition ${
activeTab === t.id
? 'bg-[var(--primary)]/15 text-[var(--primary)]'
: 'hover:bg-white/5'
}`}
>
{t.icon ? <t.icon size={16} className="opacity-80"/> : null}
<span className="text-sm">{t.label}</span>
</button>
))}
</nav>
</aside>


{/* Content */}
<main className="flex-1 min-h-0 overflow-auto" style={{ background: 'var(--bg)' }}>
{children}
</main>
</div>
</div>
);
};


export default AppShell;