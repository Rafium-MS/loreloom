import React from 'react';

const Topbar: React.FC = () => (
  <header className="flex items-center justify-between p-4 border-b">
    <input
      type="text"
      placeholder="Buscar..."
      className="border p-1 rounded w-1/2"
    />
    <div className="space-x-2">
      <button className="px-3 py-1 bg-blue-500 text-white rounded">Salvar</button>
      <button className="px-3 py-1 bg-green-500 text-white rounded">Exportar</button>
    </div>
  </header>
);

export default Topbar;