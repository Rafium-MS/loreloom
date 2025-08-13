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
      className={`bg-gray-100 p-4 transition-all ${collapsed ? 'w-16' : 'w-48'}`}
    >
      <button onClick={() => setCollapsed((c) => !c)} className="mb-4">
        <Menu size={20} />
      </button>
      <nav>
        <ul className="space-y-2">
          {links.map(({ to, label, icon: Icon }) => (
            <li key={to}>
              <NavLink
                to={to}
                className={({ isActive }) =>
                  `flex items-center gap-2 p-2 rounded hover:bg-gray-200 ${isActive ? 'bg-gray-200 font-bold' : ''}`
                }
              >
                <Icon size={18} />
                {!collapsed && <span>{label}</span>}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
};

export default Sidebar;

