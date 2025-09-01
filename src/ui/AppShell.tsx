// =========================================
// src/ui/AppShell.tsx
// Layout component providing sidebar and top
// navigation for the application.
// =========================================

import { Search } from 'lucide-react';
import ThemeToggle from './ThemeToggle';

export interface AppShellTab {
  id: string;
  label: string;
  icon?: React.ComponentType<{ size?: number; className?: string }>;
}

export interface AppShellProps {
  tabs: AppShellTab[];
  activeTab: string;
  onTabChange: (id: string) => void;
  children: React.ReactNode;
  rightActions?: React.ReactNode;
}

/**
 * Shell wrapper used across pages. Renders a sidebar with
 * navigation tabs and a header containing search and theme toggle
 * actions.
 */
const AppShell = ({
  tabs,
  activeTab,
  onTabChange,
  children,
  rightActions,
}: AppShellProps) => {
  return (
    <div className="flex flex-col min-h-screen">
      <header
        className="flex items-center justify-end p-4 border-b"
        style={{ borderColor: 'var(--border)' }}
      >
        <div className="hidden md:flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 opacity-60" />
            <input
              placeholder="Pesquisar (Ctrl/⌘+K)"
              className="pl-8 pr-3 py-2 text-sm bg-transparent border rounded-md"
              style={{ borderColor: 'var(--border)' }}
            />
          </div>
          <ThemeToggle />
          {rightActions}
        </div>
      </header>

      <div className="flex flex-1 min-h-0">
        {/* Sidebar */}
        <aside className="w-60 border-r" style={{ borderColor: 'var(--border)' }}>
          <nav className="p-2 space-y-1">
            {tabs.map((t: AppShellTab) => (
              <button
                key={t.id}
                onClick={() => onTabChange(t.id)}
                title={t.label}
                aria-label={t.label}
                className={`w-full flex items-center gap-2 px-3 py-2 rounded-md text-left transition ${
                  activeTab === t.id
                    ? 'bg-[var(--primary)]/15 text-[var(--primary)]'
                    : 'hover:bg-white/5'
                }`}
              >
                {t.icon ? <t.icon size={16} className="opacity-80" /> : null}
                <span className="text-sm">{t.label}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Content */}
        <main
          className="flex-1 min-h-0 overflow-auto"
          style={{ background: 'var(--bg)' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppShell;

