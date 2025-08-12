import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar: React.FC = () => (
  <aside className="w-48 bg-gray-100 p-4">
    <nav>
      <ul className="space-y-2">
        <li><NavLink to="/editor">Editor</NavLink></li>
        <li><NavLink to="/book">Book</NavLink></li>
        <li><NavLink to="/characters">Characters</NavLink></li>
        <li><NavLink to="/world">World</NavLink></li>
        <li><NavLink to="/plot">Plot</NavLink></li>
        <li><NavLink to="/magic">Magic</NavLink></li>
        <li><NavLink to="/tech">Tech</NavLink></li>
        <li><NavLink to="/timeline">Timeline</NavLink></li>
        <li><NavLink to="/relationships">Relationships</NavLink></li>
      </ul>
    </nav>
  </aside>
);

export default Sidebar;