import React, { useState } from 'react';

export interface Location {
  id: number;
  name: string;
  type: 'cidade' | 'vila' | 'reino' | 'fortaleza';
  climate: string;
  population: number;
  professions: string[];
  economy: string;
  army: number;
  religions: string[];
  foods: string[];
  infrastructure: string;
  strategicPoints: string;
  history: string;
}

interface LocationFormProps {
  location?: Location;
  onSave: (location: Location) => void;
  onCancel: () => void;
}

const LocationForm: React.FC<LocationFormProps> = ({ location, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    name: location?.name || '',
    type: location?.type || 'cidade',
    climate: location?.climate || '',
    population: location?.population?.toString() || '',
    professions: location?.professions?.join(', ') || '',
    economy: location?.economy || '',
    army: location?.army?.toString() || '',
    religions: location?.religions?.join(', ') || '',
    foods: location?.foods?.join(', ') || '',
    infrastructure: location?.infrastructure || '',
    strategicPoints: location?.strategicPoints || '',
    history: location?.history || ''
  });

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newLocation: Location = {
      id: location?.id || Date.now(),
      name: formData.name,
      type: formData.type as Location['type'],
      climate: formData.climate,
      population: Number(formData.population) || 0,
      professions: formData.professions.split(',').map(p => p.trim()).filter(Boolean),
      economy: formData.economy,
      army: Number(formData.army) || 0,
      religions: formData.religions.split(',').map(r => r.trim()).filter(Boolean),
      foods: formData.foods.split(',').map(f => f.trim()).filter(Boolean),
      infrastructure: formData.infrastructure,
      strategicPoints: formData.strategicPoints,
      history: formData.history
    };
    onSave(newLocation);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">{location ? 'Editar Localização' : 'Nova Localização'}</h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="Nome"
              value={formData.name}
              onChange={e => handleChange('name', e.target.value)}
              className="border rounded px-3 py-2"
              required
            />
            <select
              value={formData.type}
              onChange={e => handleChange('type', e.target.value)}
              className="border rounded px-3 py-2"
            >
              <option value="cidade">Cidade</option>
              <option value="vila">Vila</option>
              <option value="reino">Reino</option>
              <option value="fortaleza">Fortaleza</option>
            </select>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <input
              type="text"
              placeholder="Clima"
              value={formData.climate}
              onChange={e => handleChange('climate', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="População"
              value={formData.population}
              onChange={e => handleChange('population', e.target.value)}
              className="border rounded px-3 py-2"
            />
            <input
              type="number"
              placeholder="Exército"
              value={formData.army}
              onChange={e => handleChange('army', e.target.value)}
              className="border rounded px-3 py-2"
            />
          </div>

          <input
            type="text"
            placeholder="Setor econômico"
            value={formData.economy}
            onChange={e => handleChange('economy', e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            type="text"
            placeholder="Profissões (separadas por vírgula)"
            value={formData.professions}
            onChange={e => handleChange('professions', e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            type="text"
            placeholder="Religiões (separadas por vírgula)"
            value={formData.religions}
            onChange={e => handleChange('religions', e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />

          <input
            type="text"
            placeholder="Comidas típicas (separadas por vírgula)"
            value={formData.foods}
            onChange={e => handleChange('foods', e.target.value)}
            className="border rounded px-3 py-2 w-full"
          />

          <textarea
            placeholder="Infraestrutura"
            value={formData.infrastructure}
            onChange={e => handleChange('infrastructure', e.target.value)}
            className="border rounded px-3 py-2 w-full h-20"
          />

          <textarea
            placeholder="Pontos estratégicos"
            value={formData.strategicPoints}
            onChange={e => handleChange('strategicPoints', e.target.value)}
            className="border rounded px-3 py-2 w-full h-20"
          />

          <textarea
            placeholder="História"
            value={formData.history}
            onChange={e => handleChange('history', e.target.value)}
            className="border rounded px-3 py-2 w-full h-20"
          />

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationForm;