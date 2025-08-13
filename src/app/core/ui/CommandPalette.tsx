import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { appRoutes } from '../../routesConfig';

interface Props {
  open: boolean;
  onClose: () => void;
}

const CommandPalette: React.FC<Props> = ({ open, onClose }) => {
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const filtered = appRoutes.filter((c) =>
    c.label.toLowerCase().includes(query.toLowerCase()),
  );
  if (!open) return null;

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
    setQuery('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center">
      <div className="mt-20 w-96 rounded bg-white shadow dark:bg-gray-800">
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar..."
          className="w-full border-b p-2 bg-transparent outline-none"
        />
        <ul className="max-h-64 overflow-auto">
          {filtered.map((c) => (
            <li key={c.path}>
              <button
                className="w-full p-2 text-left hover:bg-gray-100 dark:hover:bg-gray-700"
                onClick={() => handleSelect(c.path)}
              >
                {c.label}
              </button>
            </li>
          ))}
          {filtered.length === 0 && (
            <li className="p-2 text-sm text-gray-500">Nenhum resultado</li>
          )}
        </ul>
      </div>
    </div>
  );
};

export default CommandPalette;

