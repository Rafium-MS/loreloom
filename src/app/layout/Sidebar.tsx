import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import {
  Menu,
  FileText,
  Book,
  Users,
  Globe,
  Zap,
  Cpu,
  Clock,
  Share2,
} from 'lucide-react';

const links = [
  { to: '/editor', label: 'Editor', icon: FileText },
  { to: '/book', label: 'Book', icon: Book },
  { to: '/characters', label: 'Characters', icon: Users },
  { to: '/world', label: 'World', icon: Globe },
  { to: '/plot', label: 'Plot', icon: FileText },
  { to: '/magic', label: 'Magic', icon: Zap },
  { to: '/tech', label: 'Tech', icon: Cpu },
  { to: '/timeline', label: 'Timeline', icon: Clock },
  { to: '/relationships', label: 'Relationships', icon: Share2 },
];

const Sidebar: React.FC = () => {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <aside
      className={`p-6 transition-all ${collapsed ? 'w-16' : 'w-56'} bg-[var(--color-bg)] text-[var(--color-text)]`}
      style={{ fontFamily: 'Cinzel, serif' }}
    >
      <button onClick={() => setCollapsed((c) => !c)} className="mb-4 text-[var(--primary)]">
        <Menu size={20} />
      </button>
      <nav>
        <ul className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded transition-colors hover:bg-[#253a56] hover:border-l-4 hover:border-[var(--primary)] ${
                    isActive ? 'text-[var(--primary)]' : 'text-[var(--color-text)]'
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    <Icon
                      size={18}
                      className={isActive ? 'text-[var(--accent)]' : 'text-[var(--primary)]'}
                    />
                    {!collapsed && <span style={{ fontSize: '18px' }}>{label}</span>}
                  </>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

