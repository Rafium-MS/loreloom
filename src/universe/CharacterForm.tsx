import { useState } from 'react';
import '../tokens.css';
import { useLocations } from '../hooks/useLocations';
import { useReligions } from '../hooks/useReligions';

export interface CharacterFormData {
  id?: number;
  name: string;
  age: string | number;
  appearance: string;
  background: string;
  abilities: string;
  motivations: string;
  relationships: string;
  role: string;
  locationIds?: number[];
  religionIds?: number[];
}

interface CharacterFormProps {
  character: CharacterFormData | null;
  onSave: (char: CharacterFormData) => void;
  onCancel: () => void;
}

const CharacterForm = ({ character, onSave, onCancel }: CharacterFormProps) => {
  const [formData, setFormData] = useState(
    (character || {
      name: '',
      age: '',
      appearance: '',
      background: '',
      abilities: '',
      motivations: '',
      relationships: '',
      role: '',
    }) as CharacterFormData,
  );
  const [errors, setErrors] = useState({ name: '' });
  const { locations } = useLocations();
  const { religions } = useReligions();
  const [selectedLocations, setSelectedLocations] = useState(
    (character?.locationIds || []) as number[],
  );
  const [selectedReligions, setSelectedReligions] = useState(
    (character?.religionIds || []) as number[],
  );

  const handleSubmit = (e: any) => {
    e.preventDefault();
    const newErrors = { name: formData.name.trim() ? '' : 'Nome é obrigatório' };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    onSave({
      ...formData,
      id: character?.id || Date.now(),
      locationIds: selectedLocations,
      religionIds: selectedReligions,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">
          {character ? 'Editar Personagem' : 'Novo Personagem'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <label htmlFor="char-name" className="mb-1 text-sm">Nome</label>
              <input
                id="char-name"
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
              <label htmlFor="char-age" className="mb-1 text-sm">Idade</label>
              <input
                id="char-age"
                type="number"
                value={formData.age}
                onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                className="border rounded px-3 py-2"
              />
            </div>
          </div>
          <div className="flex flex-col">
            <label htmlFor="char-appearance" className="mb-1 text-sm">Aparência</label>
            <textarea
              id="char-appearance"
              value={formData.appearance}
              onChange={(e) => setFormData({ ...formData, appearance: e.target.value })}
              className="border rounded px-3 py-2 w-full h-20"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="char-background" className="mb-1 text-sm">Histórico</label>
            <textarea
              id="char-background"
              value={formData.background}
              onChange={(e) => setFormData({ ...formData, background: e.target.value })}
              className="border rounded px-3 py-2 w-full h-24"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="char-abilities" className="mb-1 text-sm">Habilidades</label>
            <textarea
              id="char-abilities"
              value={formData.abilities}
              onChange={(e) => setFormData({ ...formData, abilities: e.target.value })}
              className="border rounded px-3 py-2 w-full h-20"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="char-motivations" className="mb-1 text-sm">Motivações</label>
            <textarea
              id="char-motivations"
              value={formData.motivations}
              onChange={(e) => setFormData({ ...formData, motivations: e.target.value })}
              className="border rounded px-3 py-2 w-full h-20"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="char-relationships" className="mb-1 text-sm">Relacionamentos</label>
            <textarea
              id="char-relationships"
              value={formData.relationships}
              onChange={(e) => setFormData({ ...formData, relationships: e.target.value })}
              className="border rounded px-3 py-2 w-full h-20"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="char-role" className="mb-1 text-sm">Papel Narrativo</label>
            <input
              id="char-role"
              type="text"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="char-locations" className="mb-1 text-sm">Localizações</label>
            <select
              id="char-locations"
              multiple
              value={selectedLocations.map(String)}
              onChange={(e) =>
                setSelectedLocations(
                  Array.from(e.target.selectedOptions, (option) => Number(option.value))
                )
              }
              className="border rounded px-3 py-2 w-full h-32"
            >
              {locations.map((loc: { id: number; name: string }) => (
                  <option key={loc.id} value={loc.id}>
                    {loc.name}
                  </option>
              ))}
            </select>
          </div>
          <div className="flex flex-col">
            <label htmlFor="char-religions" className="mb-1 text-sm">Religiões</label>
            <select
              id="char-religions"
              multiple
              value={selectedReligions.map(String)}
              onChange={(e) =>
                setSelectedReligions(
                  Array.from(e.target.selectedOptions, (option) => Number(option.value))
                )
              }
              className="border rounded px-3 py-2 w-full h-32"
            >
              {religions.map((rel: { id: number; name: string }) => (
                  <option key={rel.id} value={rel.id}>
                    {rel.name}
                  </option>
              ))}
            </select>
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

export default CharacterForm;
