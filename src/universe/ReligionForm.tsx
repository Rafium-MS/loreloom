import { useState } from 'react';
import '../tokens.css';
import { useCharacters } from '../hooks/useCharacters';

export interface ReligionFormData {
  id?: number;
  name: string;
  doctrine: string;
  factions: string;
  pantheon: string;
  magicConnection: string;
  characterIds?: number[];
}

interface ReligionFormProps {
  religion: ReligionFormData | null;
  onSave: (rel: ReligionFormData) => void;
  onCancel: () => void;
}

const ReligionForm = ({ religion, onSave, onCancel }: ReligionFormProps) => {
  const [formData, setFormData] = useState(
    (religion || { name: '', doctrine: '', factions: '', pantheon: '', magicConnection: '' }) as ReligionFormData,
  );
  const [errors, setErrors] = useState({ name: '' });
  const { characters } = useCharacters();
  const [selectedCharacters, setSelectedCharacters] = useState(
    (religion?.characterIds || []) as number[],
  );

    const handleSubmit = (e: any) => {
    e.preventDefault();
    const newErrors = { name: formData.name.trim() ? '' : 'Nome é obrigatório' };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    onSave({
      ...formData,
      id: religion?.id || Date.now(),
      characterIds: selectedCharacters,
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h3 className="text-xl font-bold mb-4">
          {religion ? 'Editar Religião' : 'Nova Religião'}
        </h3>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col">
            <label htmlFor="religion-name" className="mb-1 text-sm">Nome</label>
            <input
              id="religion-name"
              type="text"
              value={formData.name}
              onChange={(e) => {
                setFormData({ ...formData, name: e.target.value });
                if (errors.name) setErrors({ name: '' });
              }}
              className={`border rounded px-3 py-2 w-full ${errors.name ? 'border-red-500' : ''}`}
            />
            {errors.name && <span className="text-red-500 text-sm mt-1">{errors.name}</span>}
          </div>
          <div className="flex flex-col">
            <label htmlFor="religion-doctrine" className="mb-1 text-sm">Doutrina</label>
            <textarea
              id="religion-doctrine"
              value={formData.doctrine}
              onChange={(e) => setFormData({ ...formData, doctrine: e.target.value })}
              className="border rounded px-3 py-2 w-full h-24"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="religion-pantheon" className="mb-1 text-sm">Panteão (separado por vírgula)</label>
            <input
              id="religion-pantheon"
              type="text"
              value={formData.pantheon}
              onChange={(e) => setFormData({ ...formData, pantheon: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="religion-factions" className="mb-1 text-sm">Facções (separadas por vírgula)</label>
            <input
              id="religion-factions"
              type="text"
              value={formData.factions}
              onChange={(e) => setFormData({ ...formData, factions: e.target.value })}
              className="border rounded px-3 py-2 w-full"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="religion-magic" className="mb-1 text-sm">Ligação com magia</label>
            <textarea
              id="religion-magic"
              value={formData.magicConnection}
              onChange={(e) => setFormData({ ...formData, magicConnection: e.target.value })}
              className="border rounded px-3 py-2 w-full h-24"
            />
          </div>
          <div className="flex flex-col">

            <label htmlFor="religion-characters" className="mb-1 text-sm">Personagens</label>
            <select
              id="religion-characters"
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

export default ReligionForm;
