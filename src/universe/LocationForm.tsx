import { useState } from 'react';
import '../tokens.css';
import { useCharacters } from '../hooks/useCharacters';

export interface LocationFormData {
  id?: number;
  name: string;
  type: string;
  climate: string;
  population: number;
  culturalComposition: string;
  mainProfessions: string[];
  economy: string;
  resources: string;
  army: {
    size: number;
    weapons: string;
    training: string;
  };
  religions: string[];
  commonFoods: string[];
  establishments: string;
  strategicPoints: string;
  government: string;
  battles: string;
  events: string;
  characterIds?: number[];
}

interface LocationFormProps {
  location: LocationFormData | null;
  onSave: (loc: LocationFormData) => void;
  onCancel: () => void;
  generatePopulation: () => number;
  generateEconomy: () => string;
}

const LocationForm = ({ location, onSave, onCancel, generatePopulation, generateEconomy }: LocationFormProps) => {
  const [formData, setFormData] = useState(
    (location || {
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
        training: '',
      },
      religions: [],
      commonFoods: [],
      establishments: '',
      strategicPoints: '',
      government: '',
      battles: '',
      events: '',
    }) as LocationFormData,
  );
  const [errors, setErrors] = useState({ name: '' });
  const { characters } = useCharacters();
  const [selectedCharacters, setSelectedCharacters] = useState(
    (location?.characterIds || []) as number[],
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newErrors = { name: formData.name.trim() ? '' : 'Nome é obrigatório' };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    onSave({
      ...formData,
      id: location?.id || Date.now(),
      characterIds: selectedCharacters,
    });
  };

  const handleArrayChange = (
    field: 'mainProfessions' | 'religions' | 'commonFoods',
    value: string,
  ) => {
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
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col">
              <label htmlFor="loc-name" className="mb-1 text-sm">Nome</label>
              <input
                id="loc-name"
                type="text"
                value={formData.name}
                onChange={(e) => {
                  setFormData({ ...formData, name: e.target.value });
                  if (errors.name) setErrors({ name: '' });
                }}
                className={`border rounded px-3 py-2 ${errors.name ? 'border-red-500' : ''}`}
              />
              {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
            </div>
            <div className="flex flex-col">
              <label htmlFor="loc-type" className="mb-1 text-sm">Tipo</label>
              <select
                id="loc-type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                className="border rounded px-3 py-2"
              >
                <option value="cidade">Cidade</option>
                <option value="vila">Vila</option>
                <option value="reino">Reino</option>
                <option value="fortaleza">Fortaleza</option>
              </select>
            </div>
            <div className="flex flex-col">
              <label htmlFor="loc-climate" className="mb-1 text-sm">Clima</label>
              <input
                id="loc-climate"
                type="text"
                value={formData.climate}
                onChange={(e) => setFormData({ ...formData, climate: e.target.value })}
                className="border rounded px-3 py-2"
              />
            </div>
          </div>
          </div>

          {/* População */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3">População</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="loc-population" className="mb-1 text-sm">Número de habitantes</label>
              <input
                id="loc-population"
                type="number"
                value={formData.population}
                onChange={(e) => setFormData({ ...formData, population: parseInt(e.target.value) })}
                className="border rounded px-3 py-2"
              />
            </div>
            <div className="flex flex-col">
              <label htmlFor="loc-culture" className="mb-1 text-sm">Composição cultural/étnica</label>
              <input
                id="loc-culture"
                type="text"
                value={formData.culturalComposition}
                onChange={(e) => setFormData({ ...formData, culturalComposition: e.target.value })}
                className="border rounded px-3 py-2"
              />
            </div>
          </div>
          </div>

          {/* Economia e Profissões */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3">Economia</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="loc-economy" className="mb-1 text-sm">Setor econômico principal</label>
                <input
                  id="loc-economy"
                  type="text"
                  value={formData.economy}
                  onChange={(e) => setFormData({ ...formData, economy: e.target.value })}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="loc-professions" className="mb-1 text-sm">Profissões (separadas por vírgula)</label>
                <input
                  id="loc-professions"
                  type="text"
                  value={formData.mainProfessions.join(', ')}
                  onChange={(e) => handleArrayChange('mainProfessions', e.target.value)}
                  className="border rounded px-3 py-2"
                />
              </div>
            </div>
            <div className="flex flex-col mt-2">
              <label htmlFor="loc-resources" className="mb-1 text-sm">Recursos e fontes de riqueza</label>
              <textarea
                id="loc-resources"
                value={formData.resources}
                onChange={(e) => setFormData({ ...formData, resources: e.target.value })}
                className="border rounded px-3 py-2 w-full h-20"
              />
            </div>
          </div>

          {/* Exército */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3">Exército Local</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="flex flex-col">
                <label htmlFor="loc-army-size" className="mb-1 text-sm">Tamanho do exército</label>
                <input
                  id="loc-army-size"
                  type="number"
                  value={formData.army.size}
                  onChange={(e) => setFormData({
                    ...formData,
                    army: { ...formData.army, size: parseInt(e.target.value) }
                  })}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="loc-army-weapons" className="mb-1 text-sm">Armas principais</label>
                <input
                  id="loc-army-weapons"
                  type="text"
                  value={formData.army.weapons}
                  onChange={(e) => setFormData({
                    ...formData,
                    army: { ...formData.army, weapons: e.target.value }
                  })}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="loc-army-training" className="mb-1 text-sm">Nível de treinamento</label>
                <input
                  id="loc-army-training"
                  type="text"
                  value={formData.army.training}
                  onChange={(e) => setFormData({
                    ...formData,
                    army: { ...formData.army, training: e.target.value }
                  })}
                  className="border rounded px-3 py-2"
                />
              </div>
            </div>
          </div>

          {/* Religião e Cultura */}
          <div className="border-b pb-4">
            <h4 className="font-semibold mb-3">Religião e Cultura</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="loc-religions" className="mb-1 text-sm">Religiões aceitas (separadas por vírgula)</label>
                <input
                  id="loc-religions"
                  type="text"
                  value={formData.religions.join(', ')}
                  onChange={(e) => handleArrayChange('religions', e.target.value)}
                  className="border rounded px-3 py-2"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="loc-foods" className="mb-1 text-sm">Alimentos comuns (separados por vírgula)</label>
                <input
                  id="loc-foods"
                  type="text"
                  value={formData.commonFoods.join(', ')}
                  onChange={(e) => handleArrayChange('commonFoods', e.target.value)}
                  className="border rounded px-3 py-2"
                />
          </div>
        </div>
      </div>

      {/* Personagens */}
      <div className="border-b pb-4">
        <h4 className="font-semibold mb-3">Personagens</h4>
        <div className="flex flex-col">
          <label htmlFor="loc-characters" className="mb-1 text-sm">Personagens presentes</label>
          <select
            id="loc-characters"
            multiple
            value={selectedCharacters.map(String)}
            onChange={(e) =>
              setSelectedCharacters(Array.from(e.target.selectedOptions, (o) => Number(o.value)))
            }
            className="border rounded px-3 py-2 w-full h-32"
          >
            {characters.map((char: { id: number; name: string }) => (
              <option key={char.id} value={char.id}>
                {char.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Infraestrutura */}
      <div className="border-b pb-4">
        <h4 className="font-semibold mb-3">Infraestrutura</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="loc-establishments" className="mb-1 text-sm">Estabelecimentos comerciais</label>
                <textarea
                  id="loc-establishments"
                  placeholder="Estabelecimentos comerciais"
                  value={formData.establishments}
                  onChange={(e) => setFormData({ ...formData, establishments: e.target.value })}
                  className="border rounded px-3 py-2 h-24"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="loc-strategic" className="mb-1 text-sm">Pontos estratégicos</label>
                <textarea
                  id="loc-strategic"
                  placeholder="Pontos estratégicos"
                  value={formData.strategicPoints}
                  onChange={(e) => setFormData({ ...formData, strategicPoints: e.target.value })}
                  className="border rounded px-3 py-2 h-24"
                />
              </div>
            </div>
          </div>

          {/* História */}
          <div className="pb-4">
            <h4 className="font-semibold mb-3">História</h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col">
                <label htmlFor="loc-government" className="mb-1 text-sm">Histórico de governos</label>
                <textarea
                  id="loc-government"
                  placeholder="Histórico de governos"
                  value={formData.government}
                  onChange={(e) => setFormData({ ...formData, government: e.target.value })}
                  className="border rounded px-3 py-2 h-24"
                />
              </div>
              <div className="flex flex-col">
                <label htmlFor="loc-battles" className="mb-1 text-sm">Batalhas importantes</label>
                <textarea
                  id="loc-battles"
                  placeholder="Batalhas importantes"
                  value={formData.battles}
                  onChange={(e) => setFormData({ ...formData, battles: e.target.value })}
                  className="border rounded px-3 py-2 h-24"
                />
              </div>
            </div>
          <div className="flex flex-col mt-2">
            <label htmlFor="loc-events" className="mb-1 text-sm">Eventos importantes</label>
            <textarea
              id="loc-events"
              placeholder="Eventos importantes"
              value={formData.events}
              onChange={(e) => setFormData({ ...formData, events: e.target.value })}
              className="border rounded px-3 py-2 w-full h-20"
            />
          </div>
        </div>

        <div className="pb-4">
          <h4 className="font-semibold mb-3">Personagens</h4>
          <div className="flex flex-col">
            <label htmlFor="loc-characters" className="mb-1 text-sm">Personagens</label>
            <select
              id="loc-characters"
              multiple
              value={selectedCharacters.map(String)}
              onChange={(e) =>
                setSelectedCharacters(
                  Array.from(e.target.selectedOptions, (option) => Number(option.value))
                )
              }
              className="border rounded px-3 py-2 w-full"
            >
              {characters.map((char: { id: number; name: string }) => (
                <option key={char.id} value={char.id}>
                  {char.name}
                </option>
              ))}
            </select>
          </div>
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
