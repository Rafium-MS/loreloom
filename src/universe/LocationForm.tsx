import React, { useState } from 'react';

interface LocationFormProps {
  location: any;
  onSave: (loc: any) => void;
  onCancel: () => void;
  generatePopulation: () => number;
  generateEconomy: () => string;
}

const LocationForm: React.FC<LocationFormProps> = ({ location, onSave, onCancel, generatePopulation, generateEconomy }) => {
  const [formData, setFormData] = useState(location || {
    name: '',
    type: 'cidade',
    climate: '',
    population: generatePopulation(),
    culturalComposition: '',
    mainProfessions: [],
    economy: generateEconomy(),
    resources: '',
    army: {
      size: 0,
      weapons: '',
      training: ''
    },
    religions: [],
    commonFoods: [],
    establishments: '',
    strategicPoints: '',
    government: '',
    battles: '',
    events: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ ...formData, id: location?.id || Date.now() });
  };

  const handleArrayChange = (field: string, value: string) => {
    const array = value.split(',').map(item => item.trim()).filter(item => item);
    setFormData({ ...formData, [field]: array });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">
          {location ? 'Editar Localização' : 'Nova Localização'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Informações Básicas */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3">Informações Básicas</h4>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="text"
                placeholder="Nome"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="border rounded px-3 py-2"
                required
              />
              <select
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option value="cidade">Cidade</option>
                <option value="vila">Vila</option>
                <option value="reino">Reino</option>
                <option value="fortaleza">Fortaleza</option>
              </select>
              <input
                type="text"
                placeholder="Clima"
                value={formData.climate}
                onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
                className="border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* População */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3">População</h4>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="number"
                placeholder="Número de habitantes"
                value={formData.population}
                onChange={(e) => setFormData({ ...formData, population: parseInt(e.target.value) })}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Composição cultural/étnica"
                value={formData.culturalComposition}
                onChange={(e) => setFormData({ ...formData, culturalComposition: e.target.value })}
                className="border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Economia e Profissões */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3">Economia</h4>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Setor econômico principal"
                value={formData.economy}
                onChange={(e) => setFormData({ ...formData, economy: e.target.value })}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Profissões (separadas por vírgula)"
                value={formData.mainProfessions.join(', ')}
                onChange={(e) => handleArrayChange('mainProfessions', e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>
            <textarea
              placeholder="Recursos e fontes de riqueza"
              value={formData.resources}
              onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
              className="border rounded px-3 py-2 w-full h-20 mt-2"
            />
          </div>

          {/* Exército */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3">Exército Local</h4>
            <div className="grid grid-cols-3 gap-4">
              <input
                type="number"
                placeholder="Tamanho do exército"
                value={formData.army.size}
                onChange={(e) => setFormData({
                  ...formData,
                  army: { ...formData.army, size: parseInt(e.target.value) }
                })}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Armas principais"
                value={formData.army.weapons}
                onChange={(e) => setFormData({
                  ...formData,
                  army: { ...formData.army, weapons: e.target.value }
                })}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Nível de treinamento"
                value={formData.army.training}
                onChange={(e) => setFormData({
                  ...formData,
                  army: { ...formData.army, training: e.target.value }
                })}
                className="border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Religião e Cultura */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3">Religião e Cultura</h4>
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Religiões aceitas (separadas por vírgula)"
                value={formData.religions.join(', ')}
                onChange={(e) => handleArrayChange('religions', e.target.value)}
                className="border rounded px-3 py-2"
              />
              <input
                type="text"
                placeholder="Alimentos comuns (separados por vírgula)"
                value={formData.commonFoods.join(', ')}
                onChange={(e) => handleArrayChange('commonFoods', e.target.value)}
                className="border rounded px-3 py-2"
              />
            </div>
          </div>

          {/* Infraestrutura */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3">Infraestrutura</h4>
            <div className="grid grid-cols-2 gap-4">
              <textarea
                placeholder="Estabelecimentos comerciais"
                value={formData.establishments}
                onChange={(e) => setFormData({ ...formData, establishments: e.target.value })}
                className="border rounded px-3 py-2 h-24"
              />
              <textarea
                placeholder="Pontos estratégicos"
                value={formData.strategicPoints}
                onChange={(e) => setFormData({ ...formData, strategicPoints: e.target.value })}
                className="border rounded px-3 py-2 h-24"
              />
            </div>
          </div>

          {/* História */}
          <div className="pb-4">
            <h4 className="font-semibold mb-3">História</h4>
            <div className="grid grid-cols-2 gap-4">
              <textarea
                placeholder="Histórico de governos"
                value={formData.government}
                onChange={(e) => setFormData({ ...formData, government: e.target.value })}
                className="border rounded px-3 py-2 h-24"
              />
              <textarea
                placeholder="Batalhas importantes"
                value={formData.battles}
                onChange={(e) => setFormData({ ...formData, battles: e.target.value })}
                className="border rounded px-3 py-2 h-24"
              />
            </div>
            <textarea
              placeholder="Eventos importantes"
              value={formData.events}
              onChange={(e) => setFormData({ ...formData, events: e.target.value })}
              className="border rounded px-3 py-2 w-full h-20 mt-2"
            />
          </div>

          <div className="flex gap-2 pt-4">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              Salvar
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LocationForm;
