import React, { useEffect, useState } from 'react';
import { Character } from '../types';

type Props = {
  initialCharacter?: Character;
  onSave: (character: Character) => void;
  onCancel?: () => void;
};

const emptyCharacter: Character = {
  id: '',
  name: '',
  role: '',
  description: ''
};

const CharacterForm: React.FC<Props> = ({ initialCharacter, onSave, onCancel }) => {
  const [formData, setFormData] = useState<Character>(initialCharacter || emptyCharacter);

  useEffect(() => {
    setFormData(initialCharacter || emptyCharacter);
  }, [initialCharacter]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;
    const character = { ...formData, id: formData.id || Date.now().toString() };
    onSave(character);
    setFormData(emptyCharacter);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2">
      <input
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Nome"
        className="w-full p-2 border rounded"
      />
      <input
        name="role"
        value={formData.role}
        onChange={handleChange}
        placeholder="Papel/Função"
        className="w-full p-2 border rounded"
      />
      <textarea
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Descrição"
        className="w-full p-2 border rounded h-24"
      />
      {/* Campos futuros: idade, traços, objetivos */}
      <div className="flex space-x-2">
        <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded">Salvar</button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded border"
          >
            Cancelar
          </button>
        )}
      </div>
    </form>
  );
};

export default CharacterForm;