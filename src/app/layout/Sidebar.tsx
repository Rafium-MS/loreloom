import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Menu } from 'lucide-react';
import { appRoutes } from '../routesConfig';

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
          {appRoutes.map(({ path, label, icon: Icon }) => (
            <li key={path}>
              <NavLink
                to={path}
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

