import React, { useState } from 'react';
import { useTheme } from '../ui/ThemeProvider';

interface CharacterFormProps {
  newCharacter: { name: string; description: string; role: string };
  setNewCharacter: (char: { name: string; description: string; role: string }) => void;
  addCharacter: () => void;
}

const CharacterForm: React.FC<CharacterFormProps> = ({ newCharacter, setNewCharacter, addCharacter }) => {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [errors, setErrors] = useState({ name: '', role: '', description: '' });

  const handleAdd = () => {
    const newErrors = {
      name: newCharacter.name.trim() ? '' : 'Nome é obrigatório',
      role: newCharacter.role.trim() ? '' : 'Papel é obrigatório',
      description: newCharacter.description.trim() ? '' : 'Descrição é obrigatória'
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;
    addCharacter();
  };

  return (
    <div className={`p-3 rounded-lg border ${isDark ? 'border-gray-600 bg-gray-700' : 'border-gray-200 bg-gray-50'}`}>
      <div className="mb-2">
        <label htmlFor="character-name" className="block text-sm mb-1">
          Nome do personagem
        </label>
        <input
          id="character-name"
          type="text"
          value={newCharacter.name}
          onChange={(e) => {
            setNewCharacter({ ...newCharacter, name: e.target.value });
            if (errors.name) setErrors({ ...errors, name: '' });
          }}
          className={`w-full p-2 border rounded ${errors.name ? 'border-red-500' : isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
        />
        {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
      </div>
      <div className="mb-2">
        <label htmlFor="character-role" className="block text-sm mb-1">
          Papel/Função
        </label>
        <input
          id="character-role"
          type="text"
          value={newCharacter.role}
          onChange={(e) => {
            setNewCharacter({ ...newCharacter, role: e.target.value });
            if (errors.role) setErrors({ ...errors, role: '' });
          }}
          className={`w-full p-2 border rounded ${errors.role ? 'border-red-500' : isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
        />
        {errors.role && <p className="text-red-500 text-sm mt-1">{errors.role}</p>}
      </div>
      <div className="mb-2">
        <label htmlFor="character-description" className="block text-sm mb-1">
          Descrição e características
        </label>
        <textarea
          id="character-description"
          value={newCharacter.description}
          onChange={(e) => {
            setNewCharacter({ ...newCharacter, description: e.target.value });
            if (errors.description) setErrors({ ...errors, description: '' });
          }}
          className={`w-full p-2 border rounded h-20 ${errors.description ? 'border-red-500' : isDark ? 'bg-gray-600 border-gray-500 text-gray-100' : 'bg-white border-gray-300'}`}
        />
        {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
      </div>
      <button
        onClick={handleAdd}
        className="w-full bg-purple-600 text-white p-2 rounded hover:bg-purple-700"
      >
        Adicionar
      </button>
    </div>
  );
};

export default CharacterForm;
