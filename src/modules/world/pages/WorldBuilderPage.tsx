import React, { useState } from 'react';
import LocationForm, { Location } from '../components/LocationForm';
import LocationCard from '../components/LocationCard';
import AnalyticsPanel from '../components/AnalyticsPanel';

const WorldBuilderPage: React.FC = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [editing, setEditing] = useState<Location | null>(null);

  const handleSave = (location: Location) => {
    setLocations(prev => {
      const exists = prev.find(l => l.id === location.id);
      return exists ? prev.map(l => (l.id === location.id ? location : l)) : [...prev, location];
    });
    setEditing(null);
  };

  const handleDelete = (id: number) => {
    setLocations(prev => prev.filter(l => l.id !== id));
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Construtor de Mundo</h1>
        <button
          onClick={() => setEditing({} as Location)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Adicionar Localização
        </button>
      </div>

      <div className="space-y-4">
        {locations.map(location => (
          <LocationCard
            key={location.id}
            location={location}
            onEdit={loc => setEditing(loc)}
            onDelete={handleDelete}
          />
        ))}
        {locations.length === 0 && (
          <p className="text-gray-600 text-sm">Nenhuma localização cadastrada.</p>
        )}
      </div>

      <AnalyticsPanel locations={locations} />

      {editing && (
        <LocationForm
          location={editing.id ? editing : undefined}
          onSave={handleSave}
          onCancel={() => setEditing(null)}
        />
      )}
    </div>
  );
};

export default WorldBuilderPage;